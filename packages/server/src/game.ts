import { randomBytes, randomUUID } from 'node:crypto';
import {
  MAX_PLAYERS,
  PLAYER,
  REJOIN_GRACE,
  TICK_DT,
  createPlayer,
  generateNodes,
  heightAt,
  stepPlayer,
  type MoveInput,
  type PlayerState,
  type ServerMessage,
  type WorldNode,
} from '@segnale/shared';
import { WebSocket } from 'ws';

const INPUT_TIMEOUT = 300;
const ACTION_COOLDOWN = 350;

export interface RoomPlayer {
  player: PlayerState;
  socket: WebSocket | null;
  disconnectedAt: number | null;
  input: MoveInput | null;
  lastInputAt: number;
  lastActionAt: number;
  lastDamageAt: number;
}

export function send(socket: WebSocket, message: ServerMessage): void {
  if (socket.readyState === WebSocket.OPEN && socket.bufferedAmount < 256 * 1024) {
    socket.send(JSON.stringify(message));
  }
}

/** A room owns all gameplay state; clients can request actions, never submit state. */
export class GameRoom {
  readonly players = new Map<string, RoomPlayer>();
  readonly nodes: Map<string, WorldNode>;
  readonly depleted = new Map<string, number>();
  tickNumber = 0;
  elapsed = 0;

  constructor(
    readonly code: string,
    readonly seed = randomBytes(4).readUInt32LE(),
  ) {
    this.nodes = new Map(generateNodes(seed).map((node) => [node.id, node]));
  }

  connect(token: string, name: string, socket: WebSocket | null): RoomPlayer | null {
    let member = this.players.get(token);
    if (member) {
      const previous = member.socket;
      member.socket = socket;
      member.disconnectedAt = null;
      member.player.connected = true;
      member.input = null;
      if (previous && previous !== socket) previous.close(4001, 'Sessione riaperta');
      return member;
    }
    if (this.players.size >= MAX_PLAYERS) return null;
    member = {
      player: createPlayer(randomUUID(), name, this.seed),
      socket,
      disconnectedAt: null,
      input: null,
      lastInputAt: 0,
      lastActionAt: -Infinity,
      lastDamageAt: -Infinity,
    };
    this.players.set(token, member);
    return member;
  }

  disconnect(token: string, socket: WebSocket, now = Date.now()): void {
    const member = this.players.get(token);
    if (!member || member.socket !== socket) return;
    member.socket = null;
    member.input = null;
    member.player.connected = false;
    member.disconnectedAt = now;
  }

  input(member: RoomPlayer, input: MoveInput, now = Date.now()): void {
    // Reject replays and out-of-order packets, including packets still pending this tick.
    if (input.seq <= Math.max(member.player.lastSeq, member.input?.seq ?? -1)) return;
    member.input = input;
    member.lastInputAt = now;
  }

  private actionError(member: RoomPlayer, now: number): string | null {
    if (member.player.hp <= 0) return 'La spedizione è terminata per te. Torna al menu per ripartire.';
    if (now - member.lastActionAt < ACTION_COOLDOWN) return 'Attendi un istante prima di riprovare.';
    return null;
  }

  gather(member: RoomPlayer, nodeId: string, now = Date.now()): string | null {
    const error = this.actionError(member, now);
    if (error) return error;
    const node = this.nodes.get(nodeId);
    if (!node || this.depleted.has(nodeId)) return 'Questa risorsa non è disponibile.';
    if (
      Math.hypot(
        node.x - member.player.x,
        node.z - member.player.z,
        heightAt(this.seed, node.x, node.z) - member.player.y,
      ) > PLAYER.interactRange
    ) {
      return 'Avvicinati alla risorsa per raccoglierla.';
    }
    member.lastActionAt = now;
    if (node.kind === 'oxygen') {
      member.player.o2 = Math.min(PLAYER.maxO2, member.player.o2 + 40);
      this.depleted.set(nodeId, this.elapsed + 90);
    } else {
      const yieldCount = ['scrap', 'crystal', 'fiber'].includes(node.kind) ? 2 : 1;
      member.player.inventory[node.kind] = (member.player.inventory[node.kind] ?? 0) + yieldCount;
      this.depleted.set(nodeId, node.kind === 'fruit' ? this.elapsed + 120 : Infinity);
    }
    return null;
  }

  craft(member: RoomPlayer, now = Date.now()): string | null {
    const error = this.actionError(member, now);
    if (error) return error;
    const inventory = member.player.inventory;
    if ((inventory.crystal ?? 0) < 2 || (inventory.scrap ?? 0) < 1) {
      return 'Servono 2 Cristalli e 1 Rottame per una Cella O₂.';
    }
    inventory.crystal -= 2;
    inventory.scrap -= 1;
    inventory.oxycell = (inventory.oxycell ?? 0) + 1;
    member.lastActionAt = now;
    return null;
  }

  consume(member: RoomPlayer, itemId: 'oxycell' | 'fruit', now = Date.now()): string | null {
    const error = this.actionError(member, now);
    if (error) return error;
    const player = member.player;
    if ((player.inventory[itemId] ?? 0) < 1) return 'Non hai questo oggetto.';
    player.inventory[itemId] -= 1;
    member.lastActionAt = now;
    if (itemId === 'oxycell') player.o2 = Math.min(PLAYER.maxO2, player.o2 + 50);
    else {
      player.energy = Math.min(PLAYER.maxEnergy, player.energy + 18);
      player.hp = Math.min(PLAYER.maxHp, player.hp + 5);
    }
    return null;
  }

  tick(now = Date.now()): void {
    this.tickNumber += 1;
    this.elapsed = this.tickNumber * TICK_DT;
    for (const [nodeId, availableAt] of this.depleted) {
      if (availableAt <= this.elapsed) this.depleted.delete(nodeId);
    }
    for (const [token, member] of this.players) {
      if (member.disconnectedAt !== null && now - member.disconnectedAt >= REJOIN_GRACE * 1000) {
        this.players.delete(token);
        continue;
      }
      const player = member.player;
      if (!player.connected || player.hp <= 0) continue;
      const activeInput = member.input && now - member.lastInputAt <= INPUT_TIMEOUT;
      const input = activeInput
        ? { ...member.input!, jump: member.input!.seq > player.lastSeq && member.input!.jump }
        : {
            seq: player.lastSeq,
            moveX: 0,
            moveZ: 0,
            yaw: player.yaw,
            sprint: false,
            jump: false,
          };
      stepPlayer(player, input, TICK_DT, this.seed);
      player.lastSeq = Math.max(player.lastSeq, input.seq);
      const running = input.sprint && Math.hypot(input.moveX, input.moveZ) > 0;
      player.o2 = Math.max(0, player.o2 - PLAYER.o2Drain * TICK_DT);
      player.energy = Math.max(0, player.energy - PLAYER.energyDrain * (running ? 2 : 1) * TICK_DT);
      const damage =
        (player.o2 <= 0 ? PLAYER.noO2Damage : 0) + (player.energy <= 0 ? PLAYER.noEnergyDamage : 0);
      if (damage) {
        player.hp = Math.max(0, player.hp - damage * TICK_DT);
        member.lastDamageAt = this.elapsed;
      } else if (player.energy > 50 && this.elapsed - member.lastDamageAt >= PLAYER.regenDelay) {
        player.hp = Math.min(PLAYER.maxHp, player.hp + PLAYER.hpRegen * TICK_DT);
      }
    }
  }

  snapshot(): ServerMessage {
    return {
      type: 'snapshot',
      tick: this.tickNumber,
      elapsed: this.elapsed,
      players: [...this.players.values()].map(({ player }) => ({
        ...player,
        inventory: { ...player.inventory },
      })),
      depleted: [...this.depleted.keys()],
    };
  }

  broadcast(): void {
    const snapshot = this.snapshot();
    for (const { socket } of this.players.values()) if (socket) send(socket, snapshot);
  }
}
