export const clamp = (v: number, lo: number, hi: number): number => (v < lo ? lo : v > hi ? hi : v);

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Shortest signed difference between two angles, in (-PI, PI]. */
export function angleDiff(a: number, b: number): number {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d <= -Math.PI) d += Math.PI * 2;
  return d;
}

export const lerpAngle = (a: number, b: number, t: number): number => a + angleDiff(a, b) * t;

export const dist2 = (ax: number, az: number, bx: number, bz: number): number => {
  const dx = ax - bx;
  const dz = az - bz;
  return dx * dx + dz * dz;
};

export const dist3 = (ax: number, ay: number, az: number, bx: number, by: number, bz: number): number =>
  Math.hypot(ax - bx, ay - by, az - bz);

/** Round to 2 decimals to keep network payloads small. */
export const q2 = (v: number): number => Math.round(v * 100) / 100;

/** Round to 3 decimals (angles). */
export const q3 = (v: number): number => Math.round(v * 1000) / 1000;

/** Forward vector on the XZ plane for a yaw angle (yaw 0 faces +Z, towards the signal). */
export function forwardXZ(yaw: number): { x: number; z: number } {
  return { x: Math.sin(yaw), z: Math.cos(yaw) };
}

/** Right vector on the XZ plane for a yaw angle. */
export function rightXZ(yaw: number): { x: number; z: number } {
  return { x: -Math.cos(yaw), z: Math.sin(yaw) };
}

/** Yaw that faces from (ax,az) towards (bx,bz). */
export const yawTo = (ax: number, az: number, bx: number, bz: number): number => Math.atan2(bx - ax, bz - az);
