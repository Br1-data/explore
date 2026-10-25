import { CAMP, DAY, EXTRACTION, PLAYER, STORM, TICK_DT, WORLD } from './constants';
import { CREATURES, PERKS, RECIPES, STRUCTURES } from './catalog';
import { ITEMS } from './items';
import { angleDiff, clamp, dist2, forwardXZ, yawTo } from './math';
import { hashInts, mulberry32 } from './rng';
import { createPlayer, stepPlayer, type MoveInput, type PlayerState } from './player';
import { biomeAt, generateNodes, heightAt, valleyCenter, type WorldNode } from './world';
import type {
  CapsuleState,
  CreatureKind,
  CreatureState,
  GameEvent,
  RunState,
  StructureKind,
  StructureState,
  WorldState,
} from './game-types';
import type { ClientMessage } from './protocol';

const INPUT_TIMEOUT = 300;
const ACTION_COOLDOWN = 350;
export interface SimulationActor {
  player: PlayerState;
  input: MoveInput | null;
  lastInputAt: number;
  lastActionAt: number;
  lastDamageAt: number;
  lastAttackAt: number;
  lastDodgeSeq: number;
  gatherRemainder: Record<string, number>;
}
export function createSimulationActor(
  id: string,
  name: string,
  seed: number,
  perks: string[] = [],
): SimulationActor {
  return {
    player: createPlayer(id, name, seed, perks),
    input: null,
    lastInputAt: 0,
    lastActionAt: -Infinity,
    lastDamageAt: -Infinity,
    lastAttackAt: -Infinity,
    lastDodgeSeq: -1,
    gatherRemainder: {},
  };
}
interface CreatureMemory {
  attackAt: number;
  angry: boolean;
  wanderYaw: number;
  assault?: boolean;
}
export interface SerializedExpedition {
  version: 3;
  seed: number;
  tickNumber: number;
  run: RunState;
  actors: SimulationActor[];
  depleted: [string, number | null][];
  structures: StructureState[];
  creatures: CreatureState[];
  capsules: CapsuleState[];
  nextId: number;
  nextSpawn: number;
  nextWave: number;
  bossSpawned: boolean;
  creatureMemory?: [string, CreatureMemory][];
  turretFire?: [string, number][];
}

/** One authoritative ruleset used by the online server and the static browser game. */
export class ExpeditionSimulation {
  readonly nodes: Map<string, WorldNode>;
  readonly depleted = new Map<string, number>();
  readonly structures = new Map<string, StructureState>();
  readonly creatures = new Map<string, CreatureState>();
  readonly capsules = new Map<string, CapsuleState>();
  readonly events: GameEvent[] = [];
  run: RunState = {
    phase: 'exploring',
    elapsed: 0,
    stormZ: STORM.startZ,
    extraction: 0,
    research: 0,
    kills: 0,
    biomes: [0],
  };
  tickNumber = 0;
  elapsed = 0;
  private nextId = 1;
  private eventId = 0;
  private nextSpawn = 12;
  private nextWave = 0;
  private bossSpawned = false;
  private readonly memory = new Map<string, CreatureMemory>();
  private readonly turretFire = new Map<string, number>();
  private actors: SimulationActor[] = [];

  constructor(readonly seed: number) {
    this.nodes = new Map(generateNodes(seed).map((node) => [node.id, node]));
  }

  private event(kind: GameEvent['kind'], x: number, z: number, playerId?: string, text?: string): void {
    this.events.push({
      id: ++this.eventId,
      kind,
      x,
      z,
      ...(playerId ? { playerId } : {}),
      ...(text ? { text } : {}),
    });
    if (this.events.length > 32) this.events.shift();
  }
  input(member: SimulationActor, input: MoveInput, now = Date.now()): void {
    if (input.seq <= Math.max(member.player.lastSeq, member.input?.seq ?? -1)) return;
    member.input = input;
    member.lastInputAt = now;
  }
  private actionError(member: SimulationActor, now: number, cooldown = true): string | null {
    if (this.run.phase === 'won' || this.run.phase === 'lost')
      return 'La spedizione è terminata. Torna al menu per ripartire.';
    if (member.player.hp <= 0 || member.player.status !== 'alive')
      return 'Sei a terra: tieni E per rianimarti con un Medikit o attendi un compagno.';
    if (cooldown && now - member.lastActionAt < ACTION_COOLDOWN)
      return 'Attendi un istante prima di riprovare.';
    return null;
  }
  private near(kind: StructureKind, player: PlayerState, range = CAMP.stationRange): boolean {
    return [...this.structures.values()].some(
      (s) => s.kind === kind && s.hp > 0 && dist2(s.x, s.z, player.x, player.z) <= range * range,
    );
  }
  private pay(player: PlayerState, cost: Record<string, number>, discount = false): boolean {
    const entries = Object.entries(cost).map(
      ([id, count]) => [id, discount ? Math.ceil(count * 0.75) : count] as const,
    );
    if (entries.some(([id, count]) => (player.inventory[id] ?? 0) < count)) return false;
    for (const [id, count] of entries) player.inventory[id] -= count;
    return true;
  }
  gather(member: SimulationActor, nodeId: string, now = Date.now()): string | null {
    const error = this.actionError(member, now);
    if (error) return error;
    const node = this.nodes.get(nodeId);
    if (!node || this.depleted.has(nodeId)) return 'Questa risorsa non è disponibile.';
    const p = member.player;
    if (
      Math.hypot(node.x - p.x, node.z - p.z, heightAt(this.seed, node.x, node.z) - p.y) > PLAYER.interactRange
    )
      return 'Avvicinati alla risorsa per raccoglierla.';
    member.lastActionAt = now;
    if (node.kind === 'oxygen') {
      p.o2 = Math.min(p.maxO2, p.o2 + 40);
      this.depleted.set(nodeId, this.elapsed + 90);
    } else if (node.kind === 'cache') {
      this.run.research += 5;
      this.depleted.set(nodeId, Infinity);
    } else {
      const tool = ITEMS[p.activeItem]?.tool ?? ITEMS.tool1.tool!;
      const base = ['scrap', 'crystal', 'fiber'].includes(node.kind) ? 2 : 1;
      const exact =
        base * tool.gather * (p.perks.includes('hands') ? 1.25 : 1) +
        (member.gatherRemainder[node.kind] ?? 0);
      const count = node.kind === 'fruit' ? 1 : Math.floor(exact + 1e-9);
      if (node.kind !== 'fruit') member.gatherRemainder[node.kind] = Math.max(0, exact - count);
      p.inventory[node.kind] = (p.inventory[node.kind] ?? 0) + count;
      this.depleted.set(nodeId, node.kind === 'fruit' ? this.elapsed + 120 : Infinity);
    }
    this.event(
      'gather',
      node.x,
      node.z,
      p.id,
      node.kind === 'cache'
        ? '+5 Dati di ricerca'
        : node.kind === 'oxygen'
          ? '+40 O₂'
          : `+ ${ITEMS[node.kind]?.name ?? node.kind}`,
    );
    return null;
  }
  /** The old shorthand remains useful for the starter oxygen-cell recipe. */
  craft(member: SimulationActor, now = Date.now()): string | null {
    return this.craftItem(member, 'oxycell', now);
  }
  craftItem(member: SimulationActor, itemId: string, now = Date.now()): string | null {
    const error = this.actionError(member, now);
    if (error) return error;
    const recipe = Object.hasOwn(RECIPES, itemId) ? RECIPES[itemId] : undefined;
    const p = member.player;
    if (!recipe) return 'Ricetta sconosciuta.';
    if (recipe.station && !this.near(recipe.station, p))
      return recipe.station === 'workbench'
        ? 'Serve un Banco da lavoro entro 8 metri.'
        : 'Serve un Falò entro 8 metri.';
    if (ITEMS[itemId]?.kind === 'upgrade' && (p.inventory[itemId] ?? 0) > 0)
      return 'Questo potenziamento è già installato.';
    if (!this.pay(p, recipe.cost)) return `Servono materiali per ${ITEMS[itemId]?.name ?? itemId}.`;
    p.inventory[itemId] = (p.inventory[itemId] ?? 0) + 1;
    if (itemId === 'tank') {
      p.maxO2 += 50;
      p.o2 = Math.min(p.maxO2, p.o2 + 50);
    }
    if (ITEMS[itemId]?.tool && ITEMS[itemId].tier! > (ITEMS[p.activeItem]?.tier ?? 0)) p.activeItem = itemId;
    member.lastActionAt = now;
    this.event('craft', p.x, p.z, p.id, ITEMS[itemId]?.name);
    return null;
  }
  consume(member: SimulationActor, itemId: string, now = Date.now()): string | null {
    const error = this.actionError(member, now);
    if (error) return error;
    const p = member.player;
    const def = Object.hasOwn(ITEMS, itemId) ? ITEMS[itemId] : undefined;
    if (!def?.consumable) return 'Questo oggetto non si può consumare.';
    if ((p.inventory[itemId] ?? 0) < 1) return 'Non hai questo oggetto.';
    p.inventory[itemId] -= 1;
    member.lastActionAt = now;
    p.o2 = Math.min(p.maxO2, p.o2 + (def.consumable.o2 ?? 0));
    p.hp = Math.min(p.maxHp, p.hp + (def.consumable.hp ?? 0));
    p.energy = Math.min(PLAYER.maxEnergy, p.energy + (def.consumable.energy ?? 0));
    this.event('craft', p.x, p.z, p.id, def.name);
    return null;
  }
  equip(member: SimulationActor, itemId: string): string | null {
    if (
      (member.player.inventory[itemId] ?? 0) < 1 ||
      !Object.hasOwn(ITEMS, itemId) ||
      ITEMS[itemId].kind === 'resource' ||
      ITEMS[itemId].kind === 'upgrade' ||
      ITEMS[itemId].kind === 'key'
    )
      return 'Non puoi equipaggiare questo oggetto.';
    member.player.activeItem = itemId;
    return null;
  }
  build(
    member: SimulationActor,
    kind: StructureKind,
    x: number,
    z: number,
    yaw: number,
    now = Date.now(),
  ): string | null {
    const error = this.actionError(member, now);
    if (error) return error;
    const def = Object.hasOwn(STRUCTURES, kind) ? STRUCTURES[kind] : undefined;
    const p = member.player;
    if (!def || !Number.isFinite(x) || !Number.isFinite(z) || !Number.isFinite(yaw))
      return 'Posizione non valida.';
    if (Math.hypot(x - p.x, z - p.z) > 6) return 'Costruisci entro 6 metri da te.';
    if (
      z <= this.run.stormZ ||
      z < WORLD.zMin ||
      z > WORLD.zMax ||
      Math.abs(x - valleyCenter(this.seed, z)) > WORLD.halfWidth - 4
    )
      return 'Qui non puoi costruire.';
    if ([...this.structures.values()].some((s) => dist2(s.x, s.z, x, z) < 2.8 * 2.8))
      return 'Lo spazio è occupato da una struttura.';
    const h = heightAt(this.seed, x, z);
    if (
      [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ].some(([dx, dz]) => Math.abs(heightAt(this.seed, x + dx, z + dz) - h) > 0.75)
    )
      return 'Il terreno è troppo ripido.';
    if (
      def.requiresCamp &&
      ![...this.structures.values()].some(
        (s) => s.kind === 'beacon' && dist2(s.x, s.z, x, z) <= CAMP.radius ** 2,
      )
    )
      return 'Serve un Faro di campo entro 18 metri.';
    if (!this.pay(p, def.cost, p.perks.includes('engineer')))
      return 'Non hai materiali sufficienti per costruire.';
    const structure: StructureState = {
      id: `structure-${this.nextId++}`,
      kind,
      x,
      z,
      yaw,
      hp: def.hp,
      ownerId: p.id,
      paidCost: Object.fromEntries(
        Object.entries(def.cost).map(([id, count]) => [
          id,
          p.perks.includes('engineer') ? Math.ceil(count * 0.75) : count,
        ]),
      ),
    };
    this.structures.set(structure.id, structure);
    member.lastActionAt = now;
    this.event('build', x, z, p.id, def.name);
    return null;
  }
  dismantle(member: SimulationActor, id: string, now = Date.now()): string | null {
    const error = this.actionError(member, now);
    if (error) return error;
    const s = this.structures.get(id);
    const p = member.player;
    if (!s || Math.hypot(s.x - p.x, s.z - p.z) > PLAYER.interactRange + 1)
      return 'Avvicinati alla struttura da smontare.';
    for (const [item, cost] of Object.entries(STRUCTURES[s.kind].cost)) {
      const paid = s.paidCost?.[item] ?? cost;
      p.inventory[item] = (p.inventory[item] ?? 0) + Math.floor(paid * CAMP.refundRatio);
    }
    this.structures.delete(id);
    this.turretFire.delete(id);
    member.lastActionAt = now;
    this.event('build', s.x, s.z, p.id, 'Struttura smontata');
    return null;
  }
  attack(member: SimulationActor, targetId?: string, now = Date.now()): string | null {
    const error = this.actionError(member, now, false);
    if (error) return error;
    const p = member.player;
    const item = ITEMS[p.activeItem] ?? ITEMS.tool1;
    if (item.consumable) return this.consume(member, item.id, now);
    const stats = item.weapon ?? item.tool;
    if (!stats) return 'Equipaggia un attrezzo o un’arma.';
    if (now - member.lastAttackAt < stats.cooldown * 1000) return null;
    if (item.weapon && p.battery < item.weapon.cost) return 'Batteria scarica: attendi la ricarica.';
    member.lastAttackAt = now;
    if (item.weapon) {
      p.battery -= item.weapon.cost;
      this.event('shot', p.x, p.z, p.id);
    }
    const candidates = [...this.creatures.values()].filter(
      (c) =>
        c.hp > 0 &&
        Math.hypot(c.x - p.x, c.z - p.z) <= stats.range &&
        Math.abs(angleDiff(p.yaw, yawTo(p.x, p.z, c.x, c.z))) <= (item.weapon ? 0.2 : 1.2),
    );
    const creature = targetId
      ? candidates.find((c) => c.id === targetId)
      : candidates.sort((a, b) => dist2(a.x, a.z, p.x, p.z) - dist2(b.x, b.z, p.x, p.z))[0];
    if (!creature) {
      if (item.tool) {
        const node = [...this.nodes.values()]
          .filter(
            (n) =>
              !this.depleted.has(n.id) &&
              Math.hypot(n.x - p.x, n.z - p.z) <= stats.range &&
              Math.abs(angleDiff(p.yaw, yawTo(p.x, p.z, n.x, n.z))) < 1.3,
          )
          .sort((a, b) => dist2(a.x, a.z, p.x, p.z) - dist2(b.x, b.z, p.x, p.z))[0];
        if (node) return this.gather(member, node.id, now);
      }
      return null;
    }
    this.hurtCreature(creature, stats.damage, p);
    return null;
  }
  private hurtCreature(creature: CreatureState, damage: number, owner?: PlayerState): void {
    creature.hp = Math.max(0, creature.hp - damage);
    const memory = this.memory.get(creature.id) ?? { attackAt: 0, angry: false, wanderYaw: creature.yaw };
    memory.angry = true;
    this.memory.set(creature.id, memory);
    this.event('hit', creature.x, creature.z, owner?.id, `${damage}`);
    if (creature.hp > 0) return;
    this.creatures.delete(creature.id);
    this.memory.delete(creature.id);
    this.run.kills += 1;
    if (this.run.kills % 2 === 0) this.run.research += 1;
    if (owner)
      for (const [id, count] of Object.entries(CREATURES[creature.kind].loot))
        owner.inventory[id] = (owner.inventory[id] ?? 0) + count;
    else if (Object.keys(CREATURES[creature.kind].loot).length) {
      const capsule = {
        id: `capsule-${this.nextId++}`,
        x: creature.x,
        z: creature.z,
        inventory: { ...CREATURES[creature.kind].loot },
      };
      this.capsules.set(capsule.id, capsule);
    }
    this.event('death', creature.x, creature.z, owner?.id, CREATURES[creature.kind].name);
  }
  interact(member: SimulationActor, id: string, now = Date.now()): string | null {
    const error = this.actionError(member, now);
    if (error) return error;
    if (id.startsWith('node-')) return this.gather(member, id, now);
    const p = member.player;
    if (id === 'extraction') {
      if (Math.hypot(p.x - valleyCenter(this.seed, WORLD.signalZ), p.z - WORLD.signalZ) > EXTRACTION.radius)
        return 'Avvicinati al faro di estrazione.';
      if (this.run.phase === 'extracting') return null;
      if ((p.inventory.uplink ?? 0) < 1) return 'Crea il Modulo di uplink con i materiali dei quattro biomi.';
      p.inventory.uplink -= 1;
      this.run.phase = 'extracting';
      this.run.extraction = 0;
      this.nextWave = 0;
      member.lastActionAt = now;
      this.event('extract', p.x, p.z, p.id, 'Faro attivato. Difendi la zona per 120 secondi.');
      return null;
    }
    const capsule = this.capsules.get(id);
    if (!capsule || Math.hypot(capsule.x - p.x, capsule.z - p.z) > PLAYER.interactRange)
      return 'Nessun oggetto con cui interagire qui.';
    for (const [item, count] of Object.entries(capsule.inventory))
      p.inventory[item] = (p.inventory[item] ?? 0) + count;
    this.capsules.delete(id);
    member.lastActionAt = now;
    this.event('gather', p.x, p.z, p.id, 'Capsula recuperata');
    return null;
  }
  transfer(
    member: SimulationActor,
    targetId: string,
    itemId: string,
    amount: number,
    actors = this.actors,
  ): string | null {
    const error = this.actionError(member, Date.now(), false);
    if (error) return error;
    const p = member.player;
    const target = actors.find((a) => a.player.id === targetId)?.player;
    if (
      !target ||
      target === p ||
      !target.connected ||
      Math.hypot(target.x - p.x, target.z - p.z) > PLAYER.interactRange
    )
      return 'Avvicinati al compagno per passare risorse.';
    if (
      !Object.hasOwn(ITEMS, itemId) ||
      !['resource', 'consumable'].includes(ITEMS[itemId].kind) ||
      !Number.isSafeInteger(amount) ||
      amount < 1 ||
      (p.inventory[itemId] ?? 0) < amount
    )
      return 'Quantità o risorsa non disponibile.';
    p.inventory[itemId] -= amount;
    target.inventory[itemId] = (target.inventory[itemId] ?? 0) + amount;
    return null;
  }
  handleAction(
    member: SimulationActor,
    message: ClientMessage,
    now = Date.now(),
    actors?: SimulationActor[],
  ): string | null {
    switch (message.type) {
      case 'input':
        this.input(member, message.input, now);
        return null;
      case 'gather':
        return this.gather(member, message.nodeId, now);
      case 'craft':
        return this.craftItem(member, message.itemId, now);
      case 'consume':
        return this.consume(member, message.itemId, now);
      case 'equip':
        return this.equip(member, message.itemId);
      case 'build':
        return this.build(member, message.kind, message.x, message.z, message.yaw, now);
      case 'dismantle':
        return this.dismantle(member, message.structureId, now);
      case 'attack':
        return this.attack(member, message.targetId, now);
      case 'interact':
        return this.interact(member, message.targetId, now);
      case 'transfer':
        return this.transfer(member, message.targetId, message.itemId, message.amount, actors);
      default:
        return null;
    }
  }
  private damage(member: SimulationActor, amount: number, dodgeable = false): void {
    const p = member.player;
    if (p.status !== 'alive' || amount <= 0 || (dodgeable && p.dodgeUntil > this.elapsed)) return;
    p.hp = Math.max(0, p.hp - amount);
    member.lastDamageAt = this.elapsed;
    if (amount >= 1) this.event('damage', p.x, p.z, p.id, `${Math.ceil(amount)}`);
    if (p.hp === 0) {
      p.status = 'downed';
      p.downedUntil = this.elapsed + PLAYER.bleedOut;
      p.reviveProgress = 0;
      this.event('death', p.x, p.z, p.id, 'Astronauta a terra');
    }
  }
  private revive(member: SimulationActor): void {
    const p = member.player;
    p.status = 'alive';
    p.hp = p.maxHp * 0.3;
    p.reviveProgress = 0;
    p.downedUntil = 0;
    member.lastDamageAt = this.elapsed;
    this.event('revive', p.x, p.z, p.id, 'Rianimazione completata');
  }
  private die(member: SimulationActor): void {
    const p = member.player;
    const inventory: Record<string, number> = {};
    for (const [id, count] of Object.entries(p.inventory))
      if (ITEMS[id]?.kind === 'resource' || id === 'meat') {
        inventory[id] = Math.floor(count * 0.5);
        p.inventory[id] -= inventory[id];
      }
    const capsule = { id: `capsule-${this.nextId++}`, x: p.x, z: p.z, inventory };
    this.capsules.set(capsule.id, capsule);
    p.status = 'dead';
    p.respawnAt = this.elapsed + PLAYER.respawnDelay;
    p.reviveProgress = 0;
  }
  private respawn(member: SimulationActor, actors: SimulationActor[]): void {
    const p = member.player;
    const beacon = [...this.structures.values()].filter((s) => s.kind === 'beacon').at(-1);
    const companion = actors.find(
      (a) => a !== member && a.player.connected && a.player.status === 'alive',
    )?.player;
    if (!beacon && !companion) return;
    p.x = beacon?.x ?? companion!.x + 1;
    p.z = beacon?.z ?? companion!.z;
    p.y = heightAt(this.seed, p.x, p.z);
    p.vy = 0;
    p.status = 'alive';
    p.hp = p.maxHp * 0.5;
    p.o2 = p.maxO2;
    p.energy = 60;
    p.respawnAt = 0;
    member.lastDamageAt = this.elapsed;
    this.event('revive', p.x, p.z, p.id, 'Rientro in spedizione');
  }
  private spawn(kind: CreatureKind, x: number, z: number, assault = false): CreatureState {
    const creature: CreatureState = {
      id: `creature-${this.nextId++}`,
      kind,
      x,
      z,
      yaw: 0,
      hp: CREATURES[kind].hp,
      state: 'idle',
    };
    this.creatures.set(creature.id, creature);
    this.memory.set(creature.id, {
      attackAt: this.elapsed + 0.7,
      angry: kind === 'colossus' || assault,
      assault,
      wanderYaw: (hashInts(this.seed, this.nextId) / 0xffffffff) * Math.PI * 2,
    });
    return creature;
  }
  private spawnPopulation(players: PlayerState[], night: boolean): void {
    if (this.elapsed < this.nextSpawn || players.length === 0) return;
    this.nextSpawn = this.elapsed + 8;
    const rng = mulberry32(hashInts(this.seed, this.tickNumber, this.nextId));
    for (const p of players) {
      const biome = biomeAt(p.z).id;
      const population = Math.ceil((4 + biome * 2) * (night ? 1.5 : 1));
      const nearby = [...this.creatures.values()].filter((c) => dist2(c.x, c.z, p.x, p.z) < 110 ** 2).length;
      const pools: CreatureKind[][] = [
        ['hopper', 'crab'],
        ['hopper', 'lurker', 'sporeling'],
        ['scorpion', 'spitter'],
        ['frostbeast', 'frostwing'],
      ];
      for (let i = nearby; i < population && this.creatures.size < 80; i++) {
        const pool = pools[biome];
        const kind = pool[Math.floor(rng() * pool.length)];
        const angle = rng() * Math.PI * 2;
        const radius = 60 + rng() * 40;
        const z = clamp(p.z + Math.cos(angle) * radius, WORLD.zMin + 5, WORLD.zMax - 5);
        const x = clamp(
          p.x + Math.sin(angle) * radius,
          valleyCenter(this.seed, z) - WORLD.halfWidth + 12,
          valleyCenter(this.seed, z) + WORLD.halfWidth - 12,
        );
        if (z > this.run.stormZ) this.spawn(kind, x, z);
      }
    }
  }
  private updateCreatures(actors: SimulationActor[], night: boolean): void {
    const alive = actors.filter((a) => a.player.connected && a.player.status === 'alive');
    for (const creature of [...this.creatures.values()]) {
      if (
        creature.z <= this.run.stormZ ||
        !alive.some((a) => dist2(a.player.x, a.player.z, creature.x, creature.z) < 150 ** 2)
      ) {
        this.creatures.delete(creature.id);
        this.memory.delete(creature.id);
        continue;
      }
      const def = CREATURES[creature.kind];
      const memory = this.memory.get(creature.id) ?? { attackAt: 0, angry: false, wanderYaw: creature.yaw };
      this.memory.set(creature.id, memory);
      const target = alive.sort(
        (a, b) =>
          dist2(a.player.x, a.player.z, creature.x, creature.z) -
          dist2(b.player.x, b.player.z, creature.x, creature.z),
      )[0];
      if (!target) continue;
      const p = target.player;
      const distance = Math.hypot(p.x - creature.x, p.z - creature.z);
      const aggro = (creature.kind === 'colossus' || memory.assault ? 100 : 20) * (night ? 1.5 : 1);
      let direction = memory.wanderYaw;
      let speed = def.speed * 0.25;
      if (creature.kind === 'hopper' && distance < 15) {
        creature.state = 'flee';
        direction = yawTo(p.x, p.z, creature.x, creature.z);
        speed = def.speed;
      } else if ((def.hostile || memory.angry) && distance < aggro) {
        direction = yawTo(creature.x, creature.z, p.x, p.z);
        if (distance <= def.range) {
          creature.state = 'attack';
          speed = 0;
          if (this.elapsed >= memory.attackAt) {
            this.damage(target, def.damage, true);
            memory.attackAt = this.elapsed + def.cooldown;
            this.event('shot', creature.x, creature.z, undefined, 'creature');
          }
        } else {
          creature.state = 'chase';
          speed = def.speed;
        }
      } else {
        creature.state = 'idle';
        if (this.tickNumber % 100 === 0) memory.wanderYaw += 1.1;
      }
      creature.yaw = direction;
      const nx = creature.x + Math.sin(direction) * speed * TICK_DT;
      const nz = clamp(creature.z + Math.cos(direction) * speed * TICK_DT, WORLD.zMin + 2, WORLD.zMax - 2);
      const obstacle = [...this.structures.values()].find(
        (s) => dist2(s.x, s.z, nx, nz) < (s.kind === 'barricade' ? 2 : 1.3) ** 2,
      );
      if (obstacle && creature.state === 'chase') {
        if (this.elapsed >= memory.attackAt) {
          obstacle.hp -= def.damage;
          memory.attackAt = this.elapsed + def.cooldown;
          if (obstacle.hp <= 0) {
            this.structures.delete(obstacle.id);
            this.turretFire.delete(obstacle.id);
          }
        }
      } else {
        creature.x = clamp(
          nx,
          valleyCenter(this.seed, nz) - WORLD.halfWidth + 4,
          valleyCenter(this.seed, nz) + WORLD.halfWidth - 4,
        );
        creature.z = nz;
      }
    }
    for (const s of this.structures.values()) {
      if (s.kind !== 'turret' || this.elapsed < (this.turretFire.get(s.id) ?? 0)) continue;
      const target = [...this.creatures.values()]
        .filter((c) => c.kind !== 'hopper' && dist2(c.x, c.z, s.x, s.z) <= 16 ** 2)
        .sort((a, b) => dist2(a.x, a.z, s.x, s.z) - dist2(b.x, b.z, s.x, s.z))[0];
      if (target) {
        this.hurtCreature(target, 14, actors.find((a) => a.player.id === s.ownerId)?.player);
        this.turretFire.set(s.id, this.elapsed + 0.7);
        this.event('shot', s.x, s.z);
      }
    }
  }
  private updateExtraction(actors: SimulationActor[]): void {
    if (this.run.phase !== 'extracting') return;
    const x = valleyCenter(this.seed, WORLD.signalZ);
    const defended = actors.some(
      (a) =>
        a.player.connected &&
        a.player.status === 'alive' &&
        dist2(a.player.x, a.player.z, x, WORLD.signalZ) <= EXTRACTION.radius ** 2,
    );
    if (!defended) return;
    this.run.extraction = Math.min(EXTRACTION.duration, this.run.extraction + TICK_DT);
    if (this.run.extraction >= this.nextWave) {
      this.nextWave += EXTRACTION.waveEvery;
      const rng = mulberry32(hashInts(this.seed, this.tickNumber, this.nextId));
      for (let i = 0; i < 3 + Math.min(5, Math.floor(this.run.extraction / 30)); i++) {
        const angle = rng() * Math.PI * 2;
        this.spawn(
          i % 2 ? 'frostwing' : 'frostbeast',
          x + Math.sin(angle) * 42,
          WORLD.signalZ + Math.cos(angle) * 42,
          true,
        );
      }
      this.event('extract', x, WORLD.signalZ, undefined, 'Ondata in arrivo');
    }
    if (!this.bossSpawned && this.run.extraction >= (EXTRACTION.duration * EXTRACTION.bossAt) / 100) {
      this.bossSpawned = true;
      this.spawn('colossus', x, WORLD.signalZ + 45);
      this.event('extract', x, WORLD.signalZ, undefined, 'Colosso del Segnale rilevato');
    }
    if (this.run.extraction >= EXTRACTION.duration - 0.00001) {
      this.run.extraction = EXTRACTION.duration;
      this.run.phase = 'won';
      this.run.research += 50;
      this.run.reason = 'Segnale ricevuto. L’equipaggio è stato estratto.';
      this.event('extract', x, WORLD.signalZ, undefined, 'Estrazione riuscita');
    }
  }
  advance(iterable: Iterable<SimulationActor>, now = Date.now()): void {
    const actors = [...iterable];
    this.actors = actors;
    if (this.run.phase === 'won' || this.run.phase === 'lost') return;
    this.tickNumber += 1;
    this.elapsed = this.tickNumber * TICK_DT;
    this.run.elapsed = this.elapsed;
    this.run.stormZ = STORM.startZ + Math.max(0, this.elapsed - STORM.grace) * STORM.speed;
    const night = this.elapsed % DAY.length >= DAY.length * DAY.dayFraction;
    for (const [id, availableAt] of this.depleted) if (availableAt <= this.elapsed) this.depleted.delete(id);
    for (const [id, s] of this.structures)
      if (s.z <= this.run.stormZ) {
        this.structures.delete(id);
        this.turretFire.delete(id);
        this.event('death', s.x, s.z, undefined, 'Struttura distrutta dalla tempesta');
      }
    for (const [id, capsule] of this.capsules) if (capsule.z <= this.run.stormZ) this.capsules.delete(id);
    for (const member of actors) {
      const p = member.player;
      if (!p.connected) continue;
      if (p.status === 'dead') {
        if (this.elapsed >= p.respawnAt) this.respawn(member, actors);
        continue;
      }
      const active = member.input && now - member.lastInputAt <= INPUT_TIMEOUT;
      const input: MoveInput = active
        ? { ...member.input!, jump: member.input!.seq > p.lastSeq && member.input!.jump }
        : {
            seq: p.lastSeq,
            moveX: 0,
            moveZ: 0,
            yaw: p.yaw,
            sprint: false,
            jump: false,
            interact: false,
            dodge: false,
          };
      const beforeX = p.x;
      const beforeZ = p.z;
      if (
        p.status === 'alive' &&
        input.dodge &&
        input.seq > member.lastDodgeSeq &&
        this.elapsed >= p.dodgeReadyAt &&
        p.energy >= PLAYER.dodgeEnergy
      ) {
        p.dodgeUntil = this.elapsed + PLAYER.dodgeTime;
        p.dodgeReadyAt = this.elapsed + PLAYER.dodgeCooldown;
        p.energy -= PLAYER.dodgeEnergy;
        member.lastDodgeSeq = input.seq;
      }
      if (p.dodgeUntil > this.elapsed && p.status === 'alive') {
        const f = forwardXZ(p.yaw);
        if (Math.hypot(input.moveX, input.moveZ) === 0) {
          input.moveX = f.x;
          input.moveZ = f.z;
        }
        input.sprint = true;
      }
      stepPlayer(p, input, TICK_DT, this.seed);
      if (p.dodgeUntil > this.elapsed && p.status === 'alive') {
        const magnitude = Math.hypot(input.moveX, input.moveZ) || 1;
        p.x = beforeX + (input.moveX / magnitude) * PLAYER.dodgeSpeed * TICK_DT;
        p.z = clamp(
          beforeZ + (input.moveZ / magnitude) * PLAYER.dodgeSpeed * TICK_DT,
          WORLD.zMin + 1,
          WORLD.zMax - 1,
        );
        p.x = clamp(
          p.x,
          valleyCenter(this.seed, p.z) - WORLD.halfWidth + 1,
          valleyCenter(this.seed, p.z) + WORLD.halfWidth - 1,
        );
        p.y = Math.max(p.y, heightAt(this.seed, p.x, p.z));
      }
      if (
        [...this.structures.values()].some(
          (s) => s.kind === 'barricade' && dist2(s.x, s.z, p.x, p.z) < 1.3 ** 2,
        )
      ) {
        p.x = beforeX;
        p.z = beforeZ;
        p.y = Math.max(p.y, heightAt(this.seed, p.x, p.z));
      }
      p.lastSeq = Math.max(p.lastSeq, input.seq);
      if (p.status === 'downed') {
        if (input.interact && (p.inventory.medkit ?? 0) > 0) {
          p.reviveProgress += TICK_DT;
          if (p.reviveProgress >= PLAYER.selfReviveTime) {
            p.inventory.medkit -= 1;
            this.revive(member);
          }
        }
        if (p.status === 'downed' && this.elapsed >= p.downedUntil) this.die(member);
        continue;
      }
      // Hold E revives one nearby teammate. Progress belongs to the downed target.
      if (input.interact) {
        const target = actors.find(
          (a) =>
            a !== member &&
            a.player.connected &&
            a.player.status === 'downed' &&
            dist2(a.player.x, a.player.z, p.x, p.z) <= PLAYER.reviveRange ** 2,
        );
        if (target) {
          target.player.reviveProgress += TICK_DT;
          if (target.player.reviveProgress >= (p.perks.includes('medic') ? 2 : PLAYER.reviveTime))
            this.revive(target);
        }
      }
      const biome = biomeAt(p.z).id;
      if (!this.run.biomes.includes(biome)) {
        this.run.biomes.push(biome);
        if (biome > 0) this.run.research += 10;
      }
      const inStorm = p.z <= this.run.stormZ;
      const running = input.sprint && Math.hypot(input.moveX, input.moveZ) > 0;
      p.battery = Math.min(100, p.battery + 8 * TICK_DT);
      p.o2 = Math.max(0, p.o2 - PLAYER.o2Drain * (inStorm ? STORM.o2Mult : 1) * TICK_DT);
      const heat = biome === 2 && !night;
      p.energy = Math.max(
        0,
        p.energy -
          PLAYER.energyDrain *
            (running ? 2 : 1) *
            (heat ? 2 : 1) *
            (p.perks.includes('metabolism') ? 0.75 : 1) *
            TICK_DT,
      );
      if (this.near('oxygenator', p)) p.o2 = Math.min(p.maxO2, p.o2 + 12 * TICK_DT);
      let damage =
        (p.o2 <= 0 ? PLAYER.noO2Damage : 0) +
        (p.energy <= 0 ? PLAYER.noEnergyDamage : 0) +
        (inStorm ? STORM.damagePerSec : 0);
      if (
        biome === 1 &&
        !p.inventory.filter &&
        hashInts(this.seed, Math.floor(p.x / 12), Math.floor(p.z / 12)) % 7 === 0
      )
        damage += 2;
      if (biome === 3 && !p.inventory.thermal && !this.near('campfire', p)) damage += 2;
      if (damage > 0) this.damage(member, damage * TICK_DT);
      else if (p.energy > 50 && this.elapsed - member.lastDamageAt >= PLAYER.regenDelay)
        p.hp = Math.min(p.maxHp, p.hp + PLAYER.hpRegen * TICK_DT);
    }
    const connected = actors.filter((a) => a.player.connected);
    // Team revives accumulate only while a rescuer is actively holding E nearby.
    for (const target of connected)
      if (
        target.player.status === 'downed' &&
        !(target.input?.interact && (target.player.inventory.medkit ?? 0) > 0) &&
        !connected.some(
          (a) =>
            a !== target &&
            a.player.status === 'alive' &&
            a.input?.interact &&
            now - a.lastInputAt <= INPUT_TIMEOUT &&
            dist2(a.player.x, a.player.z, target.player.x, target.player.z) <= PLAYER.reviveRange ** 2,
        )
      )
        target.player.reviveProgress = 0;
    this.spawnPopulation(
      connected.filter((a) => a.player.status === 'alive').map((a) => a.player),
      night,
    );
    this.updateCreatures(actors, night);
    this.updateExtraction(actors);
    if ((this.run.phase as RunState['phase']) !== 'won' && this.run.stormZ >= WORLD.signalZ) {
      this.run.phase = 'lost';
      this.run.reason = 'La tempesta ha raggiunto il faro di estrazione.';
    }
    if (
      (this.run.phase as RunState['phase']) !== 'won' &&
      connected.length &&
      connected.every((a) => a.player.status !== 'alive')
    ) {
      const canSelfRevive = connected.some(
        (a) =>
          a.player.status === 'downed' &&
          (a.player.inventory.medkit ?? 0) > 0 &&
          a.player.downedUntil > this.elapsed,
      );
      if (!canSelfRevive) {
        this.run.phase = 'lost';
        this.run.reason = 'Nessun astronauta è rimasto in piedi. Spedizione terminata.';
      }
    }
  }
  worldSnapshot(): WorldState {
    return {
      structures: [...this.structures.values()].map((s) => ({ ...s })),
      creatures: [...this.creatures.values()].map((c) => ({ ...c })),
      capsules: [...this.capsules.values()].map((c) => ({ ...c, inventory: { ...c.inventory } })),
      run: { ...this.run, biomes: [...this.run.biomes] },
      events: this.events.map((e) => ({ ...e })),
    };
  }
  serialize(actors: Iterable<SimulationActor>): SerializedExpedition {
    return {
      version: 3,
      seed: this.seed,
      tickNumber: this.tickNumber,
      run: { ...this.run, biomes: [...this.run.biomes] },
      actors: [...actors].map((a) => ({
        ...a,
        input: null,
        lastInputAt: 0,
        lastActionAt: 0,
        lastAttackAt: 0,
        player: { ...a.player, inventory: { ...a.player.inventory }, perks: [...a.player.perks] },
      })),
      depleted: [...this.depleted].map(([id, time]) => [id, Number.isFinite(time) ? time : null]),
      structures: [...this.structures.values()].map((s) => ({ ...s })),
      creatures: [...this.creatures.values()].map((c) => ({ ...c })),
      capsules: [...this.capsules.values()].map((c) => ({ ...c, inventory: { ...c.inventory } })),
      nextId: this.nextId,
      nextSpawn: this.nextSpawn,
      nextWave: this.nextWave,
      bossSpawned: this.bossSpawned,
      creatureMemory: [...this.memory].map(([id, memory]) => [id, { ...memory }]),
      turretFire: [...this.turretFire].filter(([id]) => this.structures.get(id)?.kind === 'turret'),
    };
  }
  static restore(value: unknown): { simulation: ExpeditionSimulation; actors: SimulationActor[] } | null {
    try {
      if (!value || typeof value !== 'object') return null;
      const save = value as SerializedExpedition;
      const number = (v: unknown, min: number, max: number): v is number =>
        typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max;
      const integer = (v: unknown, min: number, max: number): v is number =>
        number(v, min, max) && Number.isSafeInteger(v);
      const object = (v: unknown): v is Record<string, unknown> =>
        typeof v === 'object' && v !== null && !Array.isArray(v);
      const identifier = (v: unknown): v is string =>
        typeof v === 'string' && /^[A-Za-z0-9_-]{1,80}$/.test(v);
      const inventory = (v: unknown): v is Record<string, number> =>
        object(v) &&
        Object.entries(v).every(([id, quantity]) => Object.hasOwn(ITEMS, id) && integer(quantity, 0, 99999));
      if (
        save.version !== 3 ||
        !integer(save.seed, 0, 0xffffffff) ||
        !integer(save.tickNumber, 0, 10_000_000) ||
        !integer(save.nextId, 1, 1_000_000_000) ||
        !number(save.nextSpawn, 0, 1_000_000) ||
        !number(save.nextWave, 0, EXTRACTION.duration + EXTRACTION.waveEvery) ||
        typeof save.bossSpawned !== 'boolean'
      )
        return null;
      if (
        !Array.isArray(save.actors) ||
        save.actors.length < 1 ||
        save.actors.length > 4 ||
        !Array.isArray(save.structures) ||
        save.structures.length > 1000 ||
        !Array.isArray(save.creatures) ||
        save.creatures.length > 100 ||
        !Array.isArray(save.depleted) ||
        save.depleted.length > 10000 ||
        !Array.isArray(save.capsules) ||
        save.capsules.length > 1000
      )
        return null;
      const r = save.run;
      if (
        !object(r) ||
        !['exploring', 'extracting', 'won', 'lost'].includes(r.phase as string) ||
        !number(r.elapsed, 0, 500_000) ||
        !number(r.stormZ, STORM.startZ, 1_000_000) ||
        !number(r.extraction, 0, EXTRACTION.duration) ||
        !integer(r.research, 0, 1_000_000) ||
        !integer(r.kills, 0, 1_000_000) ||
        !Array.isArray(r.biomes) ||
        r.biomes.length < 1 ||
        r.biomes.length > 4 ||
        new Set(r.biomes).size !== r.biomes.length ||
        r.biomes.some((id) => !integer(id, 0, 3)) ||
        (r.reason !== undefined && (typeof r.reason !== 'string' || r.reason.length > 300))
      )
        return null;
      const elapsed = save.tickNumber * TICK_DT;
      const point = (x: unknown, z: unknown): boolean =>
        number(x, -1000, 1000) &&
        number(z, WORLD.zMin, WORLD.zMax) &&
        Math.abs(x - valleyCenter(save.seed, z)) <= WORLD.halfWidth + 5;
      const ids = new Set<string>();
      const acceptId = (id: unknown): id is string => {
        if (!identifier(id) || ids.has(id)) return false;
        const generated = /^(?:structure|creature|capsule)-(\d+)$/.exec(id);
        if (generated && Number(generated[1]) >= save.nextId) return false;
        ids.add(id);
        return true;
      };
      const simulation = new ExpeditionSimulation(save.seed);
      simulation.tickNumber = save.tickNumber;
      simulation.elapsed = elapsed;
      simulation.run = { ...save.run, elapsed, biomes: [...save.run.biomes] };
      simulation.nextId = save.nextId;
      simulation.nextSpawn = save.nextSpawn;
      simulation.nextWave = save.nextWave;
      simulation.bossSpawned = save.bossSpawned;
      for (const entry of save.depleted) {
        if (!Array.isArray(entry) || entry.length !== 2) return null;
        const [id, time] = entry;
        if (
          typeof id !== 'string' ||
          !simulation.nodes.has(id) ||
          simulation.depleted.has(id) ||
          (time !== null && !number(time, 0, 1_000_000))
        )
          return null;
        simulation.depleted.set(id, time === null ? Infinity : time);
      }
      for (const s of save.structures) {
        if (
          !object(s) ||
          !Object.hasOwn(STRUCTURES, s.kind as string) ||
          !acceptId(s.id) ||
          !point(s.x, s.z) ||
          !number(s.hp, Number.MIN_VALUE, STRUCTURES[s.kind].hp) ||
          !number(s.yaw, -Math.PI * 1000, Math.PI * 1000) ||
          !identifier(s.ownerId)
        )
          return null;
        if (
          s.paidCost !== undefined &&
          (!inventory(s.paidCost) ||
            Object.entries(s.paidCost).some(
              ([id, count]) =>
                !Object.hasOwn(STRUCTURES[s.kind].cost, id) || count > STRUCTURES[s.kind].cost[id],
            ))
        )
          return null;
        simulation.structures.set(s.id, { ...s, ...(s.paidCost ? { paidCost: { ...s.paidCost } } : {}) });
      }
      for (const c of save.creatures) {
        if (
          !object(c) ||
          !Object.hasOwn(CREATURES, c.kind as string) ||
          !acceptId(c.id) ||
          !point(c.x, c.z) ||
          !number(c.hp, Number.MIN_VALUE, CREATURES[c.kind].hp) ||
          !number(c.yaw, -Math.PI * 1000, Math.PI * 1000) ||
          !['idle', 'chase', 'attack', 'flee'].includes(c.state)
        )
          return null;
        simulation.creatures.set(c.id, { ...c });
        simulation.memory.set(c.id, {
          angry: c.state === 'chase' || c.state === 'attack',
          assault: save.run.phase === 'extracting',
          attackAt: elapsed + 1,
          wanderYaw: c.yaw,
        });
      }
      for (const c of save.capsules) {
        if (!object(c) || !acceptId(c.id) || !point(c.x, c.z) || !inventory(c.inventory)) return null;
        simulation.capsules.set(c.id, { ...c, inventory: { ...c.inventory } });
      }
      const playerIds = new Set<string>();
      const actors: SimulationActor[] = [];
      for (const a of save.actors) {
        if (!object(a) || !object(a.player)) return null;
        const p = a.player;
        if (
          !identifier(p.id) ||
          playerIds.has(p.id) ||
          typeof p.name !== 'string' ||
          p.name.trim().length < 1 ||
          p.name.length > 24 ||
          !point(p.x, p.z) ||
          !number(p.y, heightAt(save.seed, p.x, p.z) - 0.5, heightAt(save.seed, p.x, p.z) + 100) ||
          !number(p.vy, -100, 100) ||
          !number(p.yaw, -Math.PI * 1000, Math.PI * 1000)
        )
          return null;
        playerIds.add(p.id);
        if (
          !Array.isArray(p.perks) ||
          p.perks.length > Object.keys(PERKS).length ||
          new Set(p.perks).size !== p.perks.length ||
          p.perks.some((id) => typeof id !== 'string' || !Object.hasOwn(PERKS, id)) ||
          !inventory(p.inventory)
        )
          return null;
        const expectedHp = PLAYER.maxHp + (p.perks.includes('armor') ? 15 : 0);
        const expectedO2 =
          PLAYER.maxO2 + (p.perks.includes('lungs') ? 25 : 0) + ((p.inventory.tank ?? 0) > 0 ? 50 : 0);
        if (
          p.maxHp !== expectedHp ||
          p.maxO2 !== expectedO2 ||
          !number(p.hp, 0, expectedHp) ||
          !number(p.o2, 0, expectedO2) ||
          !number(p.energy, 0, PLAYER.maxEnergy) ||
          !number(p.battery, 0, 100) ||
          !['alive', 'downed', 'dead'].includes(p.status) ||
          (p.status === 'alive' ? p.hp <= 0 : p.hp !== 0)
        )
          return null;
        if (
          !number(p.downedUntil, 0, elapsed + PLAYER.bleedOut + TICK_DT) ||
          !number(p.respawnAt, 0, elapsed + PLAYER.respawnDelay + TICK_DT) ||
          !number(p.reviveProgress, 0, PLAYER.selfReviveTime + TICK_DT) ||
          !number(p.dodgeUntil, 0, elapsed + PLAYER.dodgeTime + TICK_DT) ||
          !number(p.dodgeReadyAt, 0, elapsed + PLAYER.dodgeCooldown + TICK_DT) ||
          !integer(p.lastSeq, -1, Number.MAX_SAFE_INTEGER) ||
          !integer(a.lastDodgeSeq, -1, Number.MAX_SAFE_INTEGER)
        )
          return null;
        if (
          typeof p.activeItem !== 'string' ||
          !Object.hasOwn(ITEMS, p.activeItem) ||
          !['tool', 'weapon', 'consumable'].includes(ITEMS[p.activeItem].kind) ||
          typeof p.connected !== 'boolean'
        )
          return null;
        const remainder = a.gatherRemainder ?? {};
        if (
          !object(remainder) ||
          Object.entries(remainder).some(([id, amount]) => !Object.hasOwn(ITEMS, id) || !number(amount, 0, 1))
        )
          return null;
        if (!(a.lastDamageAt === null || a.lastDamageAt === -Infinity || number(a.lastDamageAt, 0, elapsed)))
          return null;
        actors.push({
          ...a,
          gatherRemainder: { ...remainder },
          input: null,
          lastInputAt: 0,
          lastActionAt: -Infinity,
          lastAttackAt: -Infinity,
          lastDamageAt: typeof a.lastDamageAt === 'number' ? a.lastDamageAt : -Infinity,
          player: { ...p, connected: true, inventory: { ...p.inventory }, perks: [...p.perks] },
        });
      }
      if (save.creatureMemory !== undefined) {
        if (!Array.isArray(save.creatureMemory) || save.creatureMemory.length > 100) return null;
        const seen = new Set<string>();
        for (const [id, memory] of save.creatureMemory) {
          if (
            !simulation.creatures.has(id) ||
            seen.has(id) ||
            !object(memory) ||
            !number(memory.attackAt, 0, elapsed + 10) ||
            typeof memory.angry !== 'boolean' ||
            !number(memory.wanderYaw, -1e9, 1e9) ||
            (memory.assault !== undefined && typeof memory.assault !== 'boolean')
          )
            return null;
          seen.add(id);
          simulation.memory.set(id, { ...memory });
        }
      }
      if (save.turretFire !== undefined) {
        if (!Array.isArray(save.turretFire) || save.turretFire.length > 1000) return null;
        for (const [id, ready] of save.turretFire) {
          if (
            simulation.structures.get(id)?.kind !== 'turret' ||
            !number(ready, 0, elapsed + 10) ||
            simulation.turretFire.has(id)
          )
            return null;
          simulation.turretFire.set(id, ready);
        }
      }
      return { simulation, actors };
    } catch {
      return null;
    }
  }
}
