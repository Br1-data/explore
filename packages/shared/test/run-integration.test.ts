import { describe, expect, it } from 'vitest';
import { CREATURES, EXTRACTION, TICK_DT, WORLD } from '../src/index';
import { ExpeditionSimulation, createSimulationActor } from '../src/simulation';
import type { SimulationActor } from '../src/simulation';
import { heightAt, valleyCenter } from '../src/world';
import { yawTo } from '../src/math';

const seed = 42;
function place(actor: SimulationActor, x: number, z: number): void {
  actor.player.x = x;
  actor.player.z = z;
  actor.player.y = heightAt(seed, x, z);
  actor.player.vy = 0;
}

describe('complete expedition rules', () => {
  it('collects the four-biome resources, builds a camp and defends a real extraction to victory', () => {
    const simulation = new ExpeditionSimulation(seed);
    const actor = createSimulationActor('explorer', 'Ada', seed, ['armor', 'lungs', 'metabolism']);
    let now = 1000;
    const act = (callback: (time: number) => string | null) => {
      now += 600;
      expect(callback(now)).toBeNull();
    };
    // Compress travel in this rules integration test, but obtain every material
    // through real world nodes, interaction range checks and tool yields.
    const budgets: Record<string, number> = {
      scrap: 100,
      crystal: 50,
      fiber: 20,
      biogel: 20,
      obsidian: 15,
      cryo: 10,
    };
    for (const node of simulation.nodes.values()) {
      if (!budgets[node.kind] || (actor.player.inventory[node.kind] ?? 0) >= budgets[node.kind]) continue;
      place(actor, node.x, node.z);
      act((time) => simulation.gather(actor, node.id, time));
      simulation.advance([actor], now);
    }
    for (const [id, amount] of Object.entries(budgets)) {
      expect(actor.player.inventory[id], `world must supply ${id}`).toBeGreaterThanOrEqual(amount);
    }
    expect(simulation.run.biomes.slice().sort()).toEqual([0, 1, 2, 3]);

    const startX = valleyCenter(seed, 0);
    place(actor, startX, 0);
    act((time) => simulation.build(actor, 'beacon', startX + 4, 0, 0, time));
    act((time) => simulation.build(actor, 'workbench', startX, 4, 0, time));
    for (const id of ['tool2', 'filter', 'thermal', 'tank', 'blaster2', 'uplink']) {
      act((time) => simulation.craftItem(actor, id, time));
    }
    for (let i = 0; i < 5; i++) act((time) => simulation.craftItem(actor, 'medkit', time));
    expect(actor.player.maxO2).toBe(175);
    expect(simulation.equip(actor, 'blaster2')).toBeNull();

    const x = valleyCenter(seed, WORLD.signalZ);
    const z = WORLD.signalZ;
    place(actor, x, z);
    act((time) => simulation.build(actor, 'beacon', x + 4, z, 0, time));
    act((time) => simulation.build(actor, 'oxygenator', x, z - 4, 0, time));
    for (const [dx, dz] of [
      [6, 6],
      [-6, 6],
      [6, -6],
      [-6, -6],
    ]) {
      place(actor, x + Math.sign(dx) * 2, z + Math.sign(dz) * 2);
      act((time) => simulation.build(actor, 'turret', x + dx, z + dz, 0, time));
    }
    place(actor, x, z);
    act((time) => simulation.interact(actor, 'extraction', time));
    expect(simulation.run.phase).toBe('extracting');
    expect(actor.player.inventory.uplink).toBe(0);
    let sawColossus = false;
    let initialWaveDistance = 0;
    let approachingWave = false;
    let waveId = '';
    for (let tick = 0; tick < EXTRACTION.duration / TICK_DT + 2; tick++) {
      now += TICK_DT * 1000;
      if (actor.player.hp < 65 && actor.player.inventory.medkit > 0) simulation.consume(actor, 'medkit', now);
      const targets = [...simulation.creatures.values()].sort(
        (a, b) => Math.hypot(a.x - x, a.z - z) - Math.hypot(b.x - x, b.z - z),
      );
      const target = targets[0];
      if (target) {
        const yaw = yawTo(actor.player.x, actor.player.z, target.x, target.z);
        actor.player.yaw = yaw;
        simulation.input(actor, { seq: tick, moveX: 0, moveZ: 0, yaw, sprint: false, jump: false }, now);
        if (actor.player.battery >= 11) simulation.attack(actor, target.id, now);
      }
      simulation.advance([actor], now);
      if (!waveId && simulation.creatures.size) {
        const wave = [...simulation.creatures.values()][0];
        waveId = wave.id;
        initialWaveDistance = Math.hypot(wave.x - x, wave.z - z);
      }
      const wave = simulation.creatures.get(waveId);
      if (wave && Math.hypot(wave.x - x, wave.z - z) < initialWaveDistance - 2) approachingWave = true;
      sawColossus ||= [...simulation.creatures.values()].some((creature) => creature.kind === 'colossus');
      if (simulation.run.phase !== 'extracting') break;
    }
    expect(approachingWave, 'extraction creatures must actually approach the defended beacon').toBe(true);
    expect(sawColossus, 'the midpoint boss must spawn with its own catalog definition').toBe(true);
    expect(CREATURES.colossus.hp).toBe(900);
    expect(
      simulation.run.phase,
      JSON.stringify({
        run: simulation.run,
        hp: actor.player.hp,
        meds: actor.player.inventory.medkit,
        structures: simulation.structures.size,
      }),
    ).toBe('won');
    expect(simulation.run.extraction).toBe(EXTRACTION.duration);
    expect(simulation.run.kills).toBeGreaterThan(3);
    expect(simulation.run.research).toBeGreaterThanOrEqual(80);
    expect(actor.player.status).toBe('alive');
    expect(Object.values(actor.player.inventory).every((amount) => amount >= 0)).toBe(true);
  });

  it('accumulates a teammate revive regardless of actor iteration order', () => {
    for (const rescuerFirst of [false, true]) {
      const simulation = new ExpeditionSimulation(seed);
      const downed = createSimulationActor('downed', 'Ada', seed);
      const rescuer = createSimulationActor('rescuer', 'Bruno', seed);
      downed.player.hp = 0;
      downed.player.status = 'downed';
      downed.player.downedUntil = 30;
      const actors = rescuerFirst ? [rescuer, downed] : [downed, rescuer];
      for (let tick = 0; tick < 62; tick++) {
        const now = 1000 + tick * TICK_DT * 1000;
        simulation.input(
          rescuer,
          { seq: tick, moveX: 0, moveZ: 0, yaw: 0, sprint: false, jump: false, interact: true },
          now,
        );
        simulation.advance(actors, now);
      }
      expect(downed.player.status).toBe('alive');
      expect(downed.player.hp).toBeGreaterThanOrEqual(downed.player.maxHp * 0.3);
      expect(simulation.run.phase).toBe('exploring');
    }
  });

  it('refunds the actual discounted construction cost even when another player dismantles it', () => {
    const simulation = new ExpeditionSimulation(seed);
    const builder = createSimulationActor('builder', 'Ada', seed, ['engineer']);
    const teammate = createSimulationActor('teammate', 'Bruno', seed);
    builder.player.inventory.scrap = 3;
    builder.player.inventory.crystal = 2;
    const x = builder.player.x + 4;
    expect(simulation.build(builder, 'beacon', x, 0, 0, 1000)).toBeNull();
    const beacon = [...simulation.structures.values()][0];
    place(teammate, x, 0);
    expect(simulation.dismantle(teammate, beacon.id, 1500)).toBeNull();
    expect(teammate.player.inventory.scrap).toBe(2);
    expect(teammate.player.inventory.crystal).toBe(1);
    expect(builder.player.inventory.scrap).toBe(0);
  });
});
