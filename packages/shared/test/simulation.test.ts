import { describe, expect, it } from 'vitest';
import { TICK_DT } from '../src/constants';
import { ExpeditionSimulation, createSimulationActor } from '../src/simulation';

/** Exercises the same platform-independent API used by the browser's local transport. */
describe('standalone expedition simulation', () => {
  it('runs gathering, crafting, consumption and movement without a room or network', () => {
    const simulation = new ExpeditionSimulation(42);
    const actor = createSimulationActor('local-player', 'Ada', simulation.seed);
    expect(simulation.gather(actor, 'node-0', 1000)).toBeNull();
    expect(simulation.gather(actor, 'node-1', 1400)).toBeNull();
    expect(simulation.craft(actor, 1800)).toBeNull();
    actor.player.o2 = 20;
    expect(simulation.consume(actor, 'oxycell', 2200)).toBeNull();
    expect(actor.player.o2).toBe(70);
    expect(actor.player.inventory).toMatchObject({ tool1: 1, scrap: 1, crystal: 0, oxycell: 0 });
    expect([...simulation.depleted.keys()]).toEqual(['node-0', 'node-1']);
    simulation.input(actor, { seq: 0, moveX: 0, moveZ: 1, yaw: 0, sprint: false, jump: false }, 3000);
    simulation.advance([actor], 3000);
    expect(actor.player.z).toBeGreaterThan(0);
    expect(actor.player.o2).toBeLessThan(70);
    expect(actor.player.lastSeq).toBe(0);
    expect(simulation.elapsed).toBe(TICK_DT);
  });

  it('shares resource depletion while keeping each actor action cooldown independent', () => {
    const simulation = new ExpeditionSimulation(42);
    const first = createSimulationActor('first', 'Ada', 42);
    const second = createSimulationActor('second', 'Bruno', 42);
    expect(simulation.gather(first, 'node-0', 1000)).toBeNull();
    expect(simulation.gather(first, 'node-1', 1000)).toMatch(/Attendi/);
    expect(simulation.gather(second, 'node-0', 1000)).toMatch(/non è disponibile/);
    expect(simulation.gather(second, 'node-1', 1000)).toBeNull();
    expect(first.player.inventory.scrap).toBe(2);
    expect(second.player.inventory.crystal).toBe(2);
  });
});
