import { describe, expect, it } from 'vitest';
import { PLAYER, WORLD } from '../src/constants';
import { createPlayer, stepPlayer } from '../src/player';
import type { MoveInput } from '../src/player';
import { heightAt, valleyCenter } from '../src/world';

const seed = 42;
const idle: MoveInput = {
  seq: 0,
  moveX: 0,
  moveZ: 0,
  yaw: 0,
  sprint: false,
  jump: false,
};

describe('shared movement', () => {
  it('normalizes diagonal input so it cannot exceed walking speed', () => {
    const player = createPlayer('one', 'Ada', seed);
    const startX = player.x;
    const startZ = player.z;
    for (let i = 0; i < 20; i++) {
      stepPlayer(player, { ...idle, moveX: 1, moveZ: 1 }, 0.05, seed);
    }
    expect(Math.hypot(player.x - startX, player.z - startZ)).toBeCloseTo(PLAYER.walkSpeed, 8);
    expect(player.y).toBe(heightAt(seed, player.x, player.z));
  });

  it('allows sprinting only while energy remains', () => {
    const player = createPlayer('one', 'Ada', seed);
    stepPlayer(player, { ...idle, moveZ: 1, sprint: true }, 0.05, seed);
    expect(player.z).toBeCloseTo(PLAYER.sprintSpeed * 0.05);
    player.energy = 0;
    const previousZ = player.z;
    stepPlayer(player, { ...idle, moveZ: 1, sprint: true }, 0.05, seed);
    expect(player.z - previousZ).toBeCloseTo(PLAYER.walkSpeed * 0.05);
    expect(player.inventory).toEqual({ tool1: 1 });
    expect(player.o2).toBe(PLAYER.maxO2);
  });

  it('jumps above the terrain and lands without falling through it', () => {
    const player = createPlayer('one', 'Ada', seed);
    const ground = player.y;
    stepPlayer(player, { ...idle, jump: true }, 0.05, seed);
    expect(player.y).toBeGreaterThan(ground);
    expect(player.vy).toBeGreaterThan(0);
    for (let i = 0; i < 30; i++) stepPlayer(player, idle, 0.05, seed);
    expect(player.y).toBe(ground);
    expect(player.vy).toBe(0);
  });

  it('keeps movement inside the valley and world bounds', () => {
    const player = createPlayer('one', 'Ada', seed);
    player.z = WORLD.zMax - PLAYER.radius - 0.01;
    player.x = valleyCenter(seed, player.z);
    player.y = heightAt(seed, player.x, player.z);
    stepPlayer(player, { ...idle, moveZ: 1 }, 0.05, seed);
    expect(player.z).toBeLessThanOrEqual(WORLD.zMax - PLAYER.radius);

    const centre = valleyCenter(seed, player.z);
    player.x = centre + WORLD.halfWidth - PLAYER.radius - 0.01;
    player.y = heightAt(seed, player.x, player.z);
    stepPlayer(player, { ...idle, moveX: 1 }, 0.05, seed);
    expect(player.x).toBeLessThanOrEqual(centre + WORLD.halfWidth - PLAYER.radius);
  });

  it('replays identical commands identically for client reconciliation', () => {
    const client = createPlayer('one', 'Ada', seed);
    const server = createPlayer('one', 'Ada', seed);
    for (let i = 0; i < 90; i++) {
      const input = { ...idle, seq: i, moveZ: 1, jump: i === 5, sprint: i > 50 };
      stepPlayer(client, input, 1 / 30, seed);
      stepPlayer(server, input, 1 / 30, seed);
    }
    expect(client).toEqual(server);
  });
});
