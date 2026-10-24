import { PLAYER, WORLD } from './constants';
import { clamp } from './math';
import { heightAt, valleyCenter } from './world';

export interface PlayerState {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  vy: number;
  yaw: number;
  hp: number;
  o2: number;
  energy: number;
  inventory: Record<string, number>;
  connected: boolean;
  lastSeq: number;
}

/** Movement axes are world-space directions, not relative to the camera. */
export interface MoveInput {
  seq: number;
  moveX: number;
  moveZ: number;
  yaw: number;
  sprint: boolean;
  jump: boolean;
}

export function createPlayer(id: string, name: string, seed: number): PlayerState {
  const z = WORLD.crashZ;
  const x = valleyCenter(seed, z);
  return {
    id,
    name,
    x,
    y: heightAt(seed, x, z),
    z,
    vy: 0,
    yaw: 0,
    hp: PLAYER.maxHp,
    o2: PLAYER.maxO2,
    energy: PLAYER.maxEnergy,
    inventory: { tool1: 1 },
    connected: true,
    lastSeq: -1,
  };
}

/** Shared movement only: the authoritative server owns survival and inventory. */
export function stepPlayer(player: PlayerState, input: MoveInput, dt: number, seed: number): void {
  if (!Number.isFinite(dt) || dt <= 0) return;
  // Both callers use a fixed step. A stalled frame must not cause tunnelling.
  dt = Math.min(dt, 0.1);
  const oldGround = heightAt(seed, player.x, player.z);
  const grounded = player.y <= oldGround + 0.02 && player.vy <= 0;
  const magnitude = Math.hypot(input.moveX, input.moveZ);
  const divisor = Math.max(1, magnitude);
  const speed =
    player.hp <= 0
      ? PLAYER.downedSpeed
      : input.sprint && player.energy > 0
        ? PLAYER.sprintSpeed
        : PLAYER.walkSpeed;
  const dx = (input.moveX / divisor) * speed * dt;
  const dz = (input.moveZ / divisor) * speed * dt;
  const nextZ = clamp(player.z + dz, WORLD.zMin + PLAYER.radius, WORLD.zMax - PLAYER.radius);
  const centre = valleyCenter(seed, nextZ);
  const nextX = clamp(
    player.x + dx,
    centre - WORLD.halfWidth + PLAYER.radius,
    centre + WORLD.halfWidth - PLAYER.radius,
  );
  const nextGround = heightAt(seed, nextX, nextZ);
  const travel = Math.hypot(nextX - player.x, nextZ - player.z);
  // The valley walls cannot be climbed by walking; jump remains vertical.
  if (travel > 0 && nextGround - oldGround <= PLAYER.maxSlope * travel) {
    player.x = nextX;
    player.z = nextZ;
  }
  const ground = heightAt(seed, player.x, player.z);
  player.yaw = input.yaw;

  if (grounded && input.jump && player.hp > 0) player.vy = PLAYER.jumpVel;
  else if (grounded) {
    player.y = ground;
    player.vy = 0;
    return;
  }
  player.y += player.vy * dt - (PLAYER.gravity * dt * dt) / 2;
  player.vy -= PLAYER.gravity * dt;
  if (player.y <= ground) {
    player.y = ground;
    player.vy = 0;
  }
}
