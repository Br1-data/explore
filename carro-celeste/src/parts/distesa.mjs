// Ezekiel 1:22 — the expanse over the heads of the living creatures, "sparkling like
// awesome ice": a thick rectangular slab, like a block of ice, whose upper face is cut into
// irregular crystal facets.
import { chamferBox, rng, solidFromTriangles } from '../lib/kernel.mjs';
import { P } from '../params.mjs';

const E = P.expanse;

/** A block with a flat base and a faceted top, a little larger than the slab on every side. */
function facetedBlock() {
  const random = rng(22);
  const [hx, hy] = [E.half[0] + 2, E.half[1] + 2];
  const nx = 17;
  const ny = 11;
  const positions = [];
  const triangles = [];
  const top = (i, j) => j * (nx + 1) + i;
  const bottom = (i, j) => (nx + 1) * (ny + 1) + j * (nx + 1) + i;
  for (const layer of ['top', 'bottom']) {
    for (let j = 0; j <= ny; j++) {
      for (let i = 0; i <= nx; i++) {
        const inside = i > 0 && i < nx && j > 0 && j < ny;
        const wander = layer === 'top' && inside ? 1 : 0;
        const x = -hx + ((i + (random() - 0.5) * 0.62 * wander) / nx) * 2 * hx;
        const y = -hy + ((j + (random() - 0.5) * 0.62 * wander) / ny) * 2 * hy;
        const z = layer === 'top' ? E.top - 0.25 + (random() - 0.5) * 1.1 : E.bottom - 1;
        positions.push(x, y, z);
      }
    }
  }
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const [a, b, c, d] = [top(i, j), top(i + 1, j), top(i + 1, j + 1), top(i, j + 1)];
      if (random() < 0.5) triangles.push(a, b, c, a, c, d);
      else triangles.push(a, b, d, b, c, d);
      const [e, f, g, h] = [bottom(i, j), bottom(i + 1, j), bottom(i + 1, j + 1), bottom(i, j + 1)];
      triangles.push(e, g, f, e, h, g);
    }
  }
  for (let i = 0; i < nx; i++) {
    triangles.push(bottom(i, 0), bottom(i + 1, 0), top(i + 1, 0), bottom(i, 0), top(i + 1, 0), top(i, 0));
    triangles.push(
      bottom(i, ny),
      top(i + 1, ny),
      bottom(i + 1, ny),
      bottom(i, ny),
      top(i, ny),
      top(i + 1, ny),
    );
  }
  for (let j = 0; j < ny; j++) {
    triangles.push(bottom(0, j), top(0, j + 1), bottom(0, j + 1), bottom(0, j), top(0, j), top(0, j + 1));
    triangles.push(
      bottom(nx, j),
      bottom(nx, j + 1),
      top(nx, j + 1),
      bottom(nx, j),
      top(nx, j + 1),
      top(nx, j),
    );
  }
  return solidFromTriangles(positions, triangles);
}

export function distesa() {
  // The outline: a crisp rectangular slab with chamfered edges, 2 mm taller than needed so
  // that the faceted block alone decides the shape of the upper face.
  const height = E.thick + 2;
  const outline = chamferBox([E.half[0] * 2, E.half[1] * 2, height], E.chamfer).translate([
    0,
    0,
    E.bottom + height / 2,
  ]);
  return outline.intersect(facetedBlock());
}
