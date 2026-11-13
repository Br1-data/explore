// Small signed-distance toolkit used for the organic parts (faces, bodies, hands).
// Convention here: negative inside. `toSolid` flips the sign for Manifold.levelSet.
import { Manifold, clean } from './kernel.mjs';

export const sphere = (cx, cy, cz, r) => (x, y, z) => Math.hypot(x - cx, y - cy, z - cz) - r;

/** Ellipsoid (first-order distance estimate, accurate near the surface). */
export const ellipsoid = ([cx, cy, cz], [rx, ry, rz]) => {
  const ix = 1 / rx;
  const iy = 1 / ry;
  const iz = 1 / rz;
  return (x, y, z) => {
    const px = x - cx;
    const py = y - cy;
    const pz = z - cz;
    const k0 = Math.hypot(px * ix, py * iy, pz * iz);
    const k1 = Math.hypot(px * ix * ix, py * iy * iy, pz * iz * iz);
    return k1 < 1e-9 ? -Math.min(rx, ry, rz) : (k0 * (k0 - 1)) / k1;
  };
};

/** Capsule from a to b whose radius goes linearly from ra to rb. */
export const capsule = ([ax, ay, az], [bx, by, bz], ra, rb = ra) => {
  const dx = bx - ax;
  const dy = by - ay;
  const dz = bz - az;
  const inv = 1 / (dx * dx + dy * dy + dz * dz || 1);
  return (x, y, z) => {
    const px = x - ax;
    const py = y - ay;
    const pz = z - az;
    const t = Math.min(1, Math.max(0, (px * dx + py * dy + pz * dz) * inv));
    return Math.hypot(px - dx * t, py - dy * t, pz - dz * t) - (ra + (rb - ra) * t);
  };
};

/** Axis-aligned box with rounded edges. */
export const roundBox =
  ([cx, cy, cz], [hx, hy, hz], r) =>
  (x, y, z) => {
    const qx = Math.abs(x - cx) - hx + r;
    const qy = Math.abs(y - cy) - hy + r;
    const qz = Math.abs(z - cz) - hz + r;
    return (
      Math.hypot(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qy, qz), 0) - r
    );
  };

/** Vertical frustum with elliptical sections: (rx0, ry0) at z0 and (rx1, ry1) at z1. */
export const ellipticCone =
  (cx, cy, z0, z1, [rx0, ry0], [rx1, ry1]) =>
  (x, y, z) => {
    const t = Math.min(1, Math.max(0, (z - z0) / (z1 - z0)));
    const rx = rx0 + (rx1 - rx0) * t;
    const ry = ry0 + (ry1 - ry0) * t;
    const k = Math.hypot((x - cx) / rx, (y - cy) / ry);
    const side = (k - 1) * Math.min(rx, ry);
    const caps = Math.max(z0 - z, z - z1);
    return Math.max(side, caps);
  };

/** Torus around the Z axis of the local frame, centred at c. */
export const torusZ =
  ([cx, cy, cz], major, minor) =>
  (x, y, z) =>
    Math.hypot(Math.hypot(x - cx, y - cy) - major, z - cz) - minor;

const smin = (a, b, k) => {
  if (k <= 0) return Math.min(a, b);
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
};

/** Smooth union: k is the blend radius (0 = hard union). */
export const blend =
  (k, ...fields) =>
  (x, y, z) => {
    let d = fields[0](x, y, z);
    for (let i = 1; i < fields.length; i++) d = smin(d, fields[i](x, y, z), k);
    return d;
  };

/** Smooth subtraction of `tool` from `body`. */
export const carve = (k, body, tool) => (x, y, z) => -smin(-body(x, y, z), tool(x, y, z), k);

export const intersect = (a, b) => (x, y, z) => Math.max(a(x, y, z), b(x, y, z));

/** Evaluate `field` in a frame rotated about Z: field receives (u, v, w) = (sideways, up, outward). */
export const facing = (phiDeg, field) => {
  const c = Math.cos((phiDeg * Math.PI) / 180);
  const s = Math.sin((phiDeg * Math.PI) / 180);
  return (x, y, z) => field(-s * x + c * y, z, c * x + s * y);
};

export const translate =
  ([tx, ty, tz], field) =>
  (x, y, z) =>
    field(x - tx, y - ty, z - tz);

export const scaled = (s, field) => (x, y, z) => field(x / s, y / s, z / s) * s;

/** Mirror a field built for u > 0 onto both sides of the u = 0 plane. */
export const mirrorU = (field) => (x, y, z) => field(Math.abs(x), y, z);

/** Mesh the zero level set inside `bounds` and simplify the result. */
export function toSolid(field, { min, max }, edge, tolerance = 0.02) {
  const solid = Manifold.levelSet((p) => -field(p[0], p[1], p[2]), { min, max }, edge);
  return clean(tolerance > 0 ? solid.simplify(tolerance) : solid);
}
