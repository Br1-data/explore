import { describe, expect, it } from 'vitest';
import { MAX_PLAYERS, PLAYER, REJOIN_GRACE, TICK_DT, heightAt } from '@segnale/shared';
import { GameRoom } from '../src/game';

function setup() {
  const room = new GameRoom('TEST', 42);
  const member = room.connect('player-token', 'Ada', null)!;
  return { room, member };
}

describe('authoritative room simulation', () => {
  it('cannot accelerate movement by flooding input messages; stale and replayed input stops', () => {
    const { room, member } = setup();
    const start = member.player.z;
    for (let seq = 0; seq < 100; seq++) {
      room.input(member, { seq, moveX: 0, moveZ: 1, yaw: 0, sprint: false, jump: false }, 1000);
    }
    expect(member.player.z).toBe(start);
    room.tick(1000);
    expect(member.player.z - start).toBeCloseTo(PLAYER.walkSpeed * TICK_DT);
    expect(member.player.lastSeq).toBe(99);
    room.input(member, { seq: 50, moveX: 0, moveZ: -1, yaw: 0, sprint: false, jump: false }, 1010);
    room.tick(1400);
    expect(member.player.z - start).toBeCloseTo(PLAYER.walkSpeed * TICK_DT);
  });

  it('consumes a jump edge only once even while its input remains held', () => {
    const { room, member } = setup();
    room.input(member, { seq: 0, moveX: 0, moveZ: 0, yaw: 0, sprint: false, jump: true }, 1000);
    room.tick(1000);
    expect(member.player.y).toBeGreaterThan(heightAt(room.seed, member.player.x, member.player.z));
    for (let i = 0; i < 20; i++) room.tick(1000);
    expect(member.player.vy).toBe(0);
    expect(member.player.y).toBe(heightAt(room.seed, member.player.x, member.player.z));
  });

  it('checks interaction range, depletes resources and charges crafting exactly once', () => {
    const { room, member } = setup();
    const scrap = [...room.nodes.values()].find((node) => node.kind === 'scrap')!;
    const crystal = [...room.nodes.values()].find((node) => node.kind === 'crystal')!;
    member.player.x = scrap.x;
    member.player.z = scrap.z;
    member.player.y = 100;
    expect(room.gather(member, scrap.id, 1000)).toMatch(/Avvicinati/);
    member.player.y = heightAt(room.seed, scrap.x, scrap.z);
    member.player.x = scrap.x + 10;
    expect(room.gather(member, scrap.id, 1000)).toMatch(/Avvicinati/);
    member.player.x = scrap.x;
    member.player.z = scrap.z;
    expect(room.gather(member, scrap.id, 1000)).toBeNull();
    expect(member.player.inventory.scrap).toBe(2);
    expect(room.gather(member, scrap.id, 1400)).toMatch(/non è disponibile/);
    member.player.x = crystal.x;
    member.player.z = crystal.z;
    expect(room.gather(member, crystal.id, 1400)).toBeNull();
    expect(room.craft(member, 1800)).toBeNull();
    expect(member.player.inventory).toMatchObject({ oxycell: 1, scrap: 1, crystal: 0 });
    expect(room.craft(member, 2200)).toMatch(/Servono/);
    member.player.o2 = 20;
    expect(room.consume(member, 'oxycell', 2200)).toBeNull();
    expect(member.player.o2).toBe(70);
    expect(member.player.inventory.oxycell).toBe(0);
    expect(room.consume(member, 'oxycell', 2600)).toMatch(/Non hai/);
  });

  it('regrows oxygen bulbs after 90 simulated seconds and caps oxygen', () => {
    const { room, member } = setup();
    const oxygen = [...room.nodes.values()].find((node) => node.kind === 'oxygen')!;
    member.player.x = oxygen.x;
    member.player.z = oxygen.z;
    member.player.o2 = 90;
    expect(room.gather(member, oxygen.id, 1000)).toBeNull();
    expect(member.player.o2).toBe(100);
    expect(room.depleted.has(oxygen.id)).toBe(true);
    room.tickNumber = Math.ceil(90 / TICK_DT) - 1;
    room.tick(2000);
    expect(room.depleted.has(oxygen.id)).toBe(false);
  });

  it('drains survival stats without going negative and prevents dead-player actions', () => {
    const { room, member } = setup();
    member.player.o2 = 0;
    member.player.energy = 0;
    member.player.hp = 0.01;
    room.tick(1000);
    expect(member.player.hp).toBe(0);
    expect(member.player.o2).toBe(0);
    expect(member.player.energy).toBe(0);
    expect(room.craft(member, 2000)).toMatch(/terminata/);
    const start = member.player.z;
    room.input(member, { seq: 0, moveX: 0, moveZ: 1, yaw: 0, sprint: true, jump: false }, 2000);
    room.tick(2000);
    expect(member.player.z).toBe(start);
  });

  it('reserves four slots, restores disconnected characters and releases expired slots', () => {
    const { room, member } = setup();
    for (let i = 1; i < MAX_PLAYERS; i++) expect(room.connect(`token-${i}`, 'Ada', null)).not.toBeNull();
    expect(room.connect('extra-token', 'Ada', null)).toBeNull();
    member.player.inventory.scrap = 12;
    member.player.connected = false;
    member.disconnectedAt = 1000;
    expect(room.connect('player-token', 'Ada', null)).toBe(member);
    expect(member.player.inventory.scrap).toBe(12);
    expect(member.player.connected).toBe(true);
    member.disconnectedAt = 1000;
    member.player.connected = false;
    room.tick(1000 + REJOIN_GRACE * 1000);
    expect(room.connect('extra-token', 'Ada', null)).not.toBeNull();
  });
});
