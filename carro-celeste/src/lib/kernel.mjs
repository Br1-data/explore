// Thin layer over the Manifold solid-modelling kernel: every shape built through it is a
// watertight, oriented 2-manifold, which is what a slicer needs.
import Module from 'manifold-3d';

const wasm = await Module();
wasm.setup();

export const { Manifold, CrossSection, Mesh } = wasm;

export const DEG = Math.PI / 180;

/** Deterministic PRNG so that every build produces the same model. */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const vec = {
  add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
  sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  scale: (a, s) => [a[0] * s, a[1] * s, a[2] * s],
  dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
  len: (a) => Math.hypot(a[0], a[1], a[2]),
  norm: (a) => {
    const l = Math.hypot(a[0], a[1], a[2]) || 1;
    return [a[0] / l, a[1] / l, a[2] / l];
  },
  lerp: (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t],
};

export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));

export function union(...parts) {
  const list = parts.flat(Infinity).filter(Boolean);
  if (list.length === 0) throw new Error('union of nothing');
  return list.length === 1 ? list[0] : Manifold.union(list);
}

/**
 * Drop the debris a boolean can leave behind: specks too small to print and closed voids
 * buried inside the solid (which come out as components of negative volume).
 */
export function clean(solid, minVolume = 0.05) {
  const pieces = solid.decompose();
  if (pieces.length === 1) return solid;
  return Manifold.compose(pieces.filter((piece) => piece.volume() > minVolume));
}

/**
 * Right-handed orthonormal frame from an origin, an X direction and a hint for Y.
 * `place(m)` maps a solid modelled in local coordinates into that frame.
 */
export function frame(origin, xDir, yHint) {
  const x = vec.norm(xDir);
  const z = vec.norm(vec.cross(x, yHint));
  const y = vec.cross(z, x);
  const matrix = [x[0], x[1], x[2], 0, y[0], y[1], y[2], 0, z[0], z[1], z[2], 0, ...origin, 1];
  return { origin, x, y, z, matrix, place: (m) => m.transform(matrix) };
}

/** Tapered capsule between two points (convex hull of two spheres). */
export function capsule(a, b, ra, rb = ra, segments = 12) {
  return Manifold.hull([
    Manifold.sphere(ra, segments).translate(a),
    Manifold.sphere(rb, segments).translate(b),
  ]);
}

/** Box centred on the origin with all twelve edges chamfered by `c`. */
export function chamferBox([w, d, h], c) {
  return Manifold.hull([
    Manifold.cube([w, d - 2 * c, h - 2 * c], true),
    Manifold.cube([w - 2 * c, d, h - 2 * c], true),
    Manifold.cube([w - 2 * c, d - 2 * c, h], true),
  ]);
}

/** Closed solid from raw triangles; throws if the triangles do not form a valid manifold. */
export function solidFromTriangles(positions, triangles) {
  const mesh = new Mesh({
    numProp: 3,
    vertProperties: Float32Array.from(positions),
    triVerts: Uint32Array.from(triangles),
  });
  mesh.merge();
  return new Manifold(mesh);
}
