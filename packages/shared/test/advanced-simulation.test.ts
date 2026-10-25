import { describe, expect, it } from 'vitest';
import { CAMP, PLAYER, STORM, TICK_DT, WORLD } from '../src/constants';
import { ExpeditionSimulation, createSimulationActor } from '../src/simulation';
import { heightAt, valleyCenter } from '../src/world';
import { CREATURES } from '../src/catalog';

const idle = { seq: 0, moveX: 0, moveZ: 0, yaw: 0, sprint: false, jump: false };
function setup(perks: string[] = []) {
  const simulation = new ExpeditionSimulation(42);
  const actor = createSimulationActor('one', 'Ada', 42, perks);
  return { simulation, actor };
}
function at(actor: ReturnType<typeof createSimulationActor>, x: number, z: number) {
  actor.player.x = x;
  actor.player.z = z;
  actor.player.y = heightAt(42, x, z);
}

describe('complete expedition rules', () => {
  it('requires stations and materials, installs upgrades once and consumes all food types', () => {
    const { simulation, actor } = setup();
    const p = actor.player;
    p.inventory = { tool1: 1, scrap: 40, crystal: 30, fiber: 30, biogel: 20, meat: 8 };
    expect(simulation.craftItem(actor, 'tool2', 1000)).toMatch(/Banco/);
    expect(p.inventory.scrap).toBe(40);
    expect(simulation.build(actor, 'workbench', p.x, 4, 0, 1000)).toMatch(/Faro/);
    expect(simulation.build(actor, 'beacon', p.x - 4, 0, 0, 1000)).toBeNull();
    expect(simulation.build(actor, 'workbench', p.x + 4, 0, 0, 1400)).toBeNull();
    expect(simulation.craftItem(actor, 'tool2', 1800)).toBeNull();
    expect(p.inventory.tool2).toBe(1);
    expect(p.activeItem).toBe('tool2');
    expect(simulation.craftItem(actor, 'tank', 2200)).toBeNull();
    expect(p.maxO2).toBe(150);
    expect(simulation.craftItem(actor, 'tank', 2600)).toMatch(/già/);
    expect(simulation.craftItem(actor, 'ration', 2600)).toMatch(/Falò/);
    expect(simulation.build(actor, 'campfire', p.x, -4, 0, 2600)).toBeNull();
    expect(simulation.craftItem(actor, 'ration', 3000)).toBeNull();
    p.energy = 10;
    p.hp = 50;
    expect(simulation.consume(actor, 'ration', 3400)).toBeNull();
    expect(p.energy).toBe(50);
    expect(p.hp).toBe(60);
    expect(simulation.consume(actor, 'constructor', 3800)).toMatch(/consumare/);
    expect(simulation.craftItem(actor, '__proto__', 3800)).toMatch(/sconosciuta/);
  });

  it('regenerates oxygen in a camp and applies biome protection and heat consumption', () => {
    const { simulation, actor } = setup();
    const p = actor.player;
    p.inventory = { scrap: 20, crystal: 20, fiber: 20 };
    expect(simulation.build(actor, 'beacon', p.x - 4, 0, 0, 1000)).toBeNull();
    expect(simulation.build(actor, 'oxygenator', p.x + 4, 0, 0, 1400)).toBeNull();
    p.o2 = 10;
    simulation.advance([actor], 2000);
    expect(p.o2).toBeCloseTo(10 + (12 - PLAYER.o2Drain) * TICK_DT);
    at(actor, valleyCenter(42, 1300), 1300);
    p.hp = 50;
    simulation.advance([actor], 2050);
    expect(p.hp).toBeCloseTo(49.9);
    p.inventory.thermal = 1;
    const hp = p.hp;
    simulation.advance([actor], 2100);
    expect(p.hp).toBe(hp);
    at(actor, valleyCenter(42, 900), 900);
    const energy = p.energy;
    simulation.advance([actor], 2150);
    expect(energy - p.energy).toBeCloseTo(PLAYER.energyDrain * 2 * TICK_DT);
    expect(simulation.run.research).toBe(20);
  });

  it('uses the storm grace period and destroys structures and capsules behind the front', () => {
    const { simulation, actor } = setup();
    actor.player.inventory.scrap = 10;
    actor.player.inventory.crystal = 10;
    expect(simulation.build(actor, 'beacon', actor.player.x - 4, 0, 0, 1000)).toBeNull();
    simulation.capsules.set('capsule-test', {
      id: 'capsule-test',
      x: actor.player.x,
      z: 0,
      inventory: { scrap: 1 },
    });
    simulation.tickNumber = Math.floor(STORM.grace / TICK_DT) - 1;
    simulation.advance([actor], 1400);
    expect(simulation.run.stormZ).toBe(STORM.startZ);
    simulation.tickNumber = Math.ceil((STORM.grace + (1 - STORM.startZ) / STORM.speed) / TICK_DT);
    const hp = actor.player.hp;
    simulation.advance([actor], 2000);
    expect(simulation.structures.size).toBe(0);
    expect(simulation.capsules.size).toBe(0);
    expect(actor.player.hp).toBeLessThan(hp);
    simulation.tickNumber = Math.ceil((STORM.grace + (WORLD.signalZ - STORM.startZ) / STORM.speed) / TICK_DT);
    simulation.advance([actor], 2050);
    expect(simulation.run.phase).toBe('lost');
    expect(simulation.run.reason).toMatch(/tempesta/);
  });

  it('validates weapon aim, charges battery, enforces attack cooldown and awards loot', () => {
    const { simulation, actor } = setup();
    actor.player.inventory.blaster = 1;
    expect(simulation.equip(actor, 'blaster')).toBeNull();
    const p = actor.player;
    const target = {
      id: 'creature-test',
      kind: 'sporeling' as const,
      x: p.x,
      z: p.z + 10,
      yaw: 0,
      hp: CREATURES.sporeling.hp,
      state: 'idle' as const,
    };
    simulation.creatures.set(target.id, target);
    expect(simulation.attack(actor, target.id, 1000)).toBeNull();
    expect(target.hp).toBe(11);
    expect(p.battery).toBe(91);
    expect(simulation.attack(actor, target.id, 1100)).toBeNull();
    expect(target.hp).toBe(11);
    expect(p.battery).toBe(91);
    p.yaw = Math.PI;
    simulation.attack(actor, target.id, 1400);
    expect(target.hp).toBe(11);
    expect(p.battery).toBe(82);
    p.yaw = 0;
    simulation.attack(actor, target.id, 1800);
    expect(simulation.creatures.has(target.id)).toBe(false);
    expect(p.inventory.biogel).toBe(1);
    expect(simulation.run.kills).toBe(1);
  });

  it('supports downing, a held teammate revive, bleedout capsules and camp respawn', () => {
    const { simulation, actor } = setup();
    const teammate = createSimulationActor('two', 'Bruno', 42);
    actor.player.hp = 0.01;
    actor.player.o2 = 0;
    actor.player.energy = 0;
    actor.player.inventory.scrap = 9;
    simulation.advance([actor, teammate], 1000);
    expect(actor.player.status).toBe('downed');
    actor.player.o2 = 100;
    actor.player.energy = 100;
    for (let i = 0; i < 61; i++) {
      simulation.input(teammate, { ...idle, seq: i, interact: true }, 1100 + i * 50);
      simulation.advance([actor, teammate], 1100 + i * 50);
    }
    expect(actor.player.status).toBe('alive');
    expect(actor.player.hp).toBeCloseTo(30);
    actor.player.status = 'downed';
    actor.player.hp = 0;
    actor.player.downedUntil = simulation.elapsed;
    simulation.advance([actor, teammate], 5000);
    expect(actor.player.status).toBe('dead');
    expect([...simulation.capsules.values()][0].inventory.scrap).toBe(4);
    expect(actor.player.inventory.scrap).toBe(5);
    for (let i = 0; i < 201; i++) simulation.advance([actor, teammate], 5100 + i * 50);
    expect(actor.player.status).toBe('alive');
    expect(actor.player.hp).toBe(50);
  });

  it('keeps a solo medikit rescue window and loses only after it is exhausted', () => {
    const { simulation, actor } = setup();
    actor.player.hp = 0.01;
    actor.player.o2 = 0;
    actor.player.energy = 0;
    actor.player.inventory.medkit = 1;
    simulation.advance([actor], 1000);
    expect(actor.player.status).toBe('downed');
    expect(simulation.run.phase).toBe('exploring');
    actor.player.o2 = 100;
    actor.player.energy = 100;
    for (let i = 0; i < 101; i++) {
      simulation.input(actor, { ...idle, seq: i, interact: true }, 1100 + i * 50);
      simulation.advance([actor], 1100 + i * 50);
    }
    expect(actor.player.status).toBe('alive');
    expect(actor.player.inventory.medkit).toBe(0);
    actor.player.hp = 0.01;
    actor.player.o2 = 0;
    actor.player.energy = 0;
    simulation.advance([actor], 8000);
    expect(simulation.run.phase).toBe('lost');
  });

  it('restores a save after a fired turret is dismantled', () => {
    const { simulation, actor } = setup();
    const p = actor.player;
    p.inventory = { tool1: 1, scrap: 30, crystal: 30 };
    expect(simulation.build(actor, 'beacon', p.x - 4, 0, 0, 1000)).toBeNull();
    expect(simulation.build(actor, 'turret', p.x + 4, 0, 0, 1400)).toBeNull();
    const turret = [...simulation.structures.values()].find((s) => s.kind === 'turret')!;
    simulation.creatures.set('creature-2', {
      id: 'creature-2',
      kind: 'lurker',
      x: p.x + 8,
      z: 0,
      yaw: 0,
      hp: 70,
      state: 'chase',
    });
    simulation.advance([actor], 2000);
    expect(simulation.events.some((event) => event.kind === 'shot')).toBe(true);
    expect(simulation.dismantle(actor, turret.id, 2400)).toBeNull();
    const restored = ExpeditionSimulation.restore(JSON.parse(JSON.stringify(simulation.serialize([actor]))));
    expect(restored).not.toBeNull();
    expect(restored!.simulation.structures.has(turret.id)).toBe(false);
  });

  it('round-trips a local save without resurrecting depleted materials or losing inventory', () => {
    const { simulation, actor } = setup(['lungs', 'hands', 'supplies']);
    expect(actor.player.maxO2).toBe(125);
    expect(actor.player.inventory.fiber).toBe(5);
    simulation.gather(actor, 'node-0', 1000);
    simulation.advance([actor], 1100);
    const restored = ExpeditionSimulation.restore(JSON.parse(JSON.stringify(simulation.serialize([actor]))));
    expect(restored).not.toBeNull();
    expect(restored!.simulation.worldSnapshot().run).toEqual(simulation.worldSnapshot().run);
    expect(restored!.actors[0].player).toEqual(actor.player);
    expect(restored!.simulation.gather(restored!.actors[0], 'node-0', 2000)).toMatch(/non è disponibile/);
    expect(ExpeditionSimulation.restore({ version: 3, seed: 42 })).toBeNull();
    expect(CAMP.radius).toBe(18);
  });
});
