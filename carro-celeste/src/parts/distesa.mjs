// Ezekiel 1:22 — the expanse over the heads of the living creatures, "sparkling like
// awesome ice": a broad disc whose upper face is cut into irregular crystal facets.
import { rng, solidFromTriangles } from '../lib/kernel.mjs';
import { P } from '../params.mjs';

const E = P.expanse;

export function distesa() {
  const random = rng(22);
  const around = 56;
  const positions = [];
  const triangles = [];
  const vertex = (x, y, z) => positions.push(x, y, z) / 3 - 1;
  // Rings alternate by half a step, so the bands between them are made of plain triangles.
  let ringCount = 0;
  const ring = (radius, z, jitter, lift) => {
    const shift = ringCount++ % 2 ? 0.5 : 0;
    const first = positions.length / 3;
    for (let i = 0; i < around; i++) {
      const a = ((i + shift + (random() - 0.5) * jitter) / around) * Math.PI * 2;
      const r = radius + (random() - 0.5) * jitter * 3.2;
      vertex(Math.cos(a) * r, Math.sin(a) * r, z + (random() - 0.5) * lift);
    }
    return { first, shift };
  };
  // Walking outwards from ring a to ring b; counter-clockwise seen from outside the solid.
  const band = (a, b) => {
    for (let i = 0; i < around; i++) {
      const next = (i + 1) % around;
      if (a.shift === 0) {
        triangles.push(a.first + i, b.first + i, a.first + next);
        triangles.push(a.first + next, b.first + i, b.first + next);
      } else {
        triangles.push(a.first + i, b.first + next, a.first + next);
        triangles.push(a.first + i, b.first + i, b.first + next);
      }
    }
  };

  const top = E.top;
  const centreTop = vertex(0, 0, top + 0.35);
  const rings = [];
  for (const r of [9, 19, 29, 39, 49, 59, 68]) rings.push(ring(r, top, 0.7, 1.0));
  const edgeTop = ring(E.radius - 3.4, top - 0.2, 0.25, 0.25);
  const girdle = ring(E.radius, E.bottom + E.thick * 0.5, 0, 0);
  const edgeBottom = ring(E.radius - 2.4, E.bottom, 0, 0);
  const centreBottom = vertex(0, 0, E.bottom);

  for (let i = 0; i < around; i++) {
    const next = (i + 1) % around;
    triangles.push(centreTop, rings[0].first + i, rings[0].first + next);
    triangles.push(centreBottom, edgeBottom.first + next, edgeBottom.first + i);
  }
  const outward = [...rings, edgeTop, girdle, edgeBottom];
  for (let k = 0; k + 1 < outward.length; k++) band(outward[k], outward[k + 1]);
  return solidFromTriangles(positions, triangles);
}
