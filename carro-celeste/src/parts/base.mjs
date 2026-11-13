// Ezekiel 1:4, 15 — the ground the wheels stand on, rimmed by the great storm cloud.
import { CrossSection, Manifold, rng, union } from '../lib/kernel.mjs';
import { P } from '../params.mjs';

const B = P.base;

/** Points spaced `step` apart along a rounded square of the given half-size. */
function roundedSquarePath(half, corner, step) {
  const straight = 2 * (half - corner);
  const arc = (Math.PI / 2) * corner;
  const total = 4 * (straight + arc);
  const count = Math.round(total / step);
  const points = [];
  for (let i = 0; i < count; i++) {
    let s = (i / count) * total;
    const side = Math.floor(s / (straight + arc));
    s -= side * (straight + arc);
    let x;
    let y;
    if (s < straight) {
      x = half;
      y = -half + corner + s;
    } else {
      const a = (s - straight) / corner;
      x = half - corner + Math.cos(a) * corner;
      y = half - corner + Math.sin(a) * corner;
    }
    const turn = (side * Math.PI) / 2;
    points.push([x * Math.cos(turn) - y * Math.sin(turn), x * Math.sin(turn) + y * Math.cos(turn)]);
  }
  return points;
}

export function base() {
  const random = rng(4);
  const inner = B.slabHalf - B.corner;
  const slab = CrossSection.square([inner * 2, inner * 2], true)
    .offset(B.corner, 'Round', 2, 96)
    .extrude(B.thick);

  // Billows of cloud all around the rim, tangent to the outer boundary.
  const puffs = [];
  for (const [x, y] of roundedSquarePath(B.half, B.corner + 3.5, 8.2)) {
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
  for (const [x, y] of roundedSquarePath(B.half - 9.5, B.corner - 4, 10.5)) {
    const r = 3.4 + random() * 2.4;
    puffs.push(
      Manifold.sphere(r, 12)
        .scale([1, 1, 0.5])
        .translate([x + (random() - 0.5) * 3, y + (random() - 0.5) * 3, 2.6]),
    );
  }
  return union(slab, puffs).trimByPlane([0, 0, 1], 0);
}
