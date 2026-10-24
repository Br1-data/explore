import { describe, expect, it } from 'vitest';
import { ExpeditionSimulation, createSimulationActor } from '@segnale/shared';
import { GameRoom } from '../src/game';

describe('server and browser simulation parity', () => {
  it('keeps the same state for identical input and actions', () => {
    const room = new GameRoom('TEST', 42);
    const server = room.connect('a-test-token', 'Ada', null)!;
    const simulation = new ExpeditionSimulation(room.seed);
    const browser = createSimulationActor(server.player.id, server.player.name, room.seed);
    for (const [engine, actor] of [
      [room, server],
      [simulation, browser],
    ] as const) {
      expect(engine.gather(actor, 'node-0', 1000)).toBeNull();
      expect(engine.gather(actor, 'node-1', 1400)).toBeNull();
      expect(engine.craft(actor, 1800)).toBeNull();
      actor.player.o2 = 35;
      expect(engine.consume(actor, 'oxycell', 2200)).toBeNull();
    }
    for (let seq = 0; seq < 100; seq++) {
      const now = 3000 + seq * 50;
      const input = { seq, moveX: 0, moveZ: 1, yaw: 0, sprint: seq > 50, jump: seq === 5 };
      room.input(server, input, now);
      simulation.input(browser, input, now);
      room.tick(now);
      simulation.advance([browser], now);
    }
    expect(browser.player).toEqual(server.player);
    expect(simulation.elapsed).toBe(room.elapsed);
    expect(simulation.tickNumber).toBe(room.tickNumber);
    expect(simulation.depleted).toEqual(room.depleted);
  });
});
