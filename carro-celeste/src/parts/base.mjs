// Ezekiel 1:4, 15 — the ground the wheels stand on, rimmed by the great storm cloud.
import { CrossSection, Manifold, rng, union } from '../lib/kernel.mjs';
import { P } from '../params.mjs';

const B = P.base;

/** Points spaced about `step` apart along a rounded rectangle of half-sizes hx, hy. */
function roundedRectPath(hx, hy, corner, step) {
  const sides = [
    { length: 2 * (hy - corner), at: (s) => [hx, -hy + corner + s] },
    { length: 2 * (hx - corner), at: (s) => [hx - corner - s, hy] },
    { length: 2 * (hy - corner), at: (s) => [-hx, hy - corner - s] },
    { length: 2 * (hx - corner), at: (s) => [-hx + corner + s, -hy] },
  ];
  const centres = [
    [hx - corner, hy - corner],
    [-hx + corner, hy - corner],
    [-hx + corner, -hy + corner],
    [hx - corner, -hy + corner],
  ];
  const arc = (Math.PI / 2) * corner;
  const total = sides.reduce((sum, side) => sum + side.length, 0) + 4 * arc;
  const count = Math.round(total / step);
  const points = [];
  for (let i = 0; i < count; i++) {
    let s = (i / count) * total;
    for (let k = 0; k < 4; k++) {
      if (s < sides[k].length) {
        points.push(sides[k].at(s));
        break;
      }
      s -= sides[k].length;
      if (s < arc) {
        const a = (k * Math.PI) / 2 + s / corner;
        points.push([centres[k][0] + Math.cos(a) * corner, centres[k][1] + Math.sin(a) * corner]);
        break;
      }
      s -= arc;
    }
  }
  return points;
}

export function base() {
  const random = rng(4);
  const [hx, hy] = B.half;
  const slab = CrossSection.square([2 * (hx - B.inset - B.corner), 2 * (hy - B.inset - B.corner)], true)
    .offset(B.corner, 'Round', 2, 96)
    .extrude(B.thick);

  // Billows of cloud all around the rim, tangent to the outer boundary.
  const puffs = [];
  for (const [x, y] of roundedRectPath(hx, hy, B.corner + B.inset, 8.2)) {
    const r = 4.6 + random() * 3.6;
    const distance = Math.hypot(x, y);
    const k = (distance - r) / distance;
    puffs.push(
      Manifold.sphere(r, 12)
        .scale([1, 1, 0.62])
        .translate([x * k, y * k, 1.6 + random() * 0.9]),
    );
  }
  // A second, lower row further in gives the cloud some depth.
  for (const [x, y] of roundedRectPath(hx - 9.5, hy - 9.5, B.corner - 4, 10.5)) {
    const r = 3.4 + random() * 2.4;
    puffs.push(
      Manifold.sphere(r, 8)
        .scale([1, 1, 0.5])
        .translate([x + (random() - 0.5) * 3, y + (random() - 0.5) * 3, 2.6]),
    );
  }
  return union(slab, puffs).trimByPlane([0, 0, 1], 0);
}
