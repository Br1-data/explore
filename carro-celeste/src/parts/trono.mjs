// Ezekiel 1:26-28 — above the expanse, "something like a sapphire stone that looked like
// a throne", the figure seated on it, and the brightness all around like a rainbow.
import { Manifold, chamferBox, rng, union } from '../lib/kernel.mjs';
import { blend, capsule, ellipsoid, sphere, toSolid } from '../lib/sdf.mjs';
import { fiamma } from './fuoco.mjs';
import { P } from '../params.mjs';

const TOP = P.expanse.top;
const Y = P.throne.y;
const DAIS = TOP + 4.6; // top of the upper step
const SEAT = DAIS + 11; // top of the seat
const WAIST = SEAT + 5.2;

/** A gem cut like a low pyramid with a flat table, for the faces of the throne. */
function gem(width, height, depth) {
  return Manifold.hull([
    Manifold.cube([width, 0.2, height], true),
    Manifold.cube([width * 0.45, depth * 2, height * 0.45], true),
  ]);
}

export function trono() {
  const parts = [];
  const box = (size, chamfer, centre) => parts.push(chamferBox(size, chamfer).translate(centre));
  // Two steps.
  box([46, 40, 3.2], 0.8, [0, Y - 1, TOP - 0.9 + 1.6]);
  box([38, 32, 3.0], 0.8, [0, Y, DAIS - 1.5]);
  // Seat.
  box([23, 18, 11.6], 1.1, [0, Y + 1, SEAT - 5.8]);
  // Armrests.
  for (const x of [-9.6, 9.6]) {
    box([4.2, 17, 7.4], 0.9, [x, Y + 0.5, SEAT + 3.2]);
    parts.push(
      Manifold.sphere(2.2, 16)
        .scale([1, 1.15, 0.9])
        .translate([x, Y - 8, SEAT + 6.4]),
    );
  }
  // Back: a tall slab cut to a point like a gemstone.
  const backDepth = 4.6;
  const backY = Y + 10 - backDepth / 2 + 2.2;
  const outline = [
    [-11.5, 0],
    [11.5, 0],
    [11.5, 28],
    [7, 35.5],
    [0, 38.5],
    [-7, 35.5],
    [-11.5, 28],
  ];
  const slab = Manifold.extrude([outline], backDepth, 0, 0, [1, 1], true)
    .rotate([90, 0, 0])
    .translate([0, backY, DAIS - 0.5]);
  parts.push(slab);
  // Facets on both faces of the back and on the front of the seat.
  for (const side of [-1, 1]) {
    const y = backY + side * (backDepth / 2);
    parts.push(gem(15, 15, 1.3).translate([0, y, DAIS + 22]));
    parts.push(
      gem(5.5, 5.5, 1.0)
        .rotate([0, 45, 0])
        .translate([0, y, DAIS + 33]),
    );
    for (const x of [-7.6, 7.6]) parts.push(gem(3.6, 9, 0.9).translate([x, y, DAIS + 30]));
  }
  parts.push(gem(13, 5.5, 1.0).translate([0, Y - 8, SEAT - 6]));
  // Finials.
  for (const x of [-10.2, 10.2]) {
    parts.push(
      Manifold.sphere(2.0, 4)
        .scale([1, 1, 1.5])
        .translate([x, backY, DAIS + 28.6]),
    );
  }
  return union(parts);
}

/**
 * The seated figure, deliberately without features: "from his waist up something like
 * electrum, like fire; from his waist down something like fire" (v. 27).
 * Returned in two halves so that the viewer can colour them differently.
 */
export function figura(quality) {
  const y0 = Y + 1.5;
  const seatFront = Y - 8;
  const body = blend(
    1.6,
    ellipsoid([0, y0, SEAT + 3.2], [5.4, 4.6, 3.6]), // hips
    capsule([0, y0 + 0.6, SEAT + 4], [0, y0 + 0.9, SEAT + 15.5], 4.3, 4.9), // torso
    ellipsoid([0, y0 + 0.9, SEAT + 17], [6.6, 3.6, 2.6]), // shoulders
    capsule([0, y0 + 0.6, SEAT + 18], [0, y0 + 0.4, SEAT + 21], 1.9, 1.8), // neck
    sphere(0, y0 + 0.2, SEAT + 24.2, 3.7), // head
    capsule([3.1, y0 - 1, SEAT + 2.6], [3.3, seatFront - 1.2, SEAT + 2.4], 3.0, 2.7), // thighs
    capsule([-3.1, y0 - 1, SEAT + 2.6], [-3.3, seatFront - 1.2, SEAT + 2.4], 3.0, 2.7),
    capsule([3.3, seatFront - 1.4, SEAT + 2.2], [3.4, seatFront - 2.2, DAIS + 1.6], 2.6, 2.2), // shins
    capsule([-3.3, seatFront - 1.4, SEAT + 2.2], [-3.4, seatFront - 2.2, DAIS + 1.6], 2.6, 2.2),
    ellipsoid([0, seatFront - 3.6, DAIS + 1.2], [6.2, 3.4, 1.8]), // hem of the robe over the feet
  );
  const arms = blend(
    0.9,
    body,
    capsule([6.4, y0 + 0.8, SEAT + 16.6], [9.3, y0 - 0.4, SEAT + 9.6], 1.9, 1.6),
    capsule([-6.4, y0 + 0.8, SEAT + 16.6], [-9.3, y0 - 0.4, SEAT + 9.6], 1.9, 1.6),
    capsule([9.3, y0 - 0.4, SEAT + 9.6], [9.6, Y - 6.2, SEAT + 8.2], 1.6, 1.4),
    capsule([-9.3, y0 - 0.4, SEAT + 9.6], [-9.6, Y - 6.2, SEAT + 8.2], 1.6, 1.4),
  );
  const whole = toSolid(
    arms,
    { min: [-13, Y - 16, DAIS - 1], max: [13, Y + 9, SEAT + 29] },
    quality.edge * 1.4,
    0.06,
  );
  const upper = whole.trimByPlane([0, 0, 1], WAIST);
  const lower = whole.trimByPlane([0, 0, -1], -WAIST);

  // Fire from the waist down: tongues of flame rising around the seat and the legs.
  const random = rng(127);
  const flames = [];
  const plant = (x, y, z, height, radius) => flames.push(fiamma(height, radius, random).translate([x, y, z]));
  for (const x of [-7.4, -2.6, 2.6, 7.4])
    plant(x, Y - 13.5 + Math.abs(x) * 0.25, DAIS - 0.6, 9 + random() * 5, 2.2);
  for (const side of [-1, 1]) {
    plant(side * 13.2, Y - 6, DAIS - 0.6, 15 + random() * 4, 2.5);
    plant(side * 13.6, Y + 3, DAIS - 0.6, 18 + random() * 4, 2.6);
    plant(side * 13.4, Y + 10.5, DAIS - 0.6, 21 + random() * 4, 2.6);
  }
  return { superiore: upper, inferiore: union(lower, flames) };
}

/** The rainbow: seven bands arching behind the throne, its feet among small clouds (v. 28). */
export function arcobaleno() {
  const R = P.rainbow;
  const bands = [];
  const feet = TOP - 0.9;
  for (let k = 0; k < R.bands; k++) {
    const r0 = R.inner + k * R.band;
    const depth = k % 2 ? 2.6 : 3.4;
    const profile = [
      [r0 - 0.02, -depth / 2],
      [r0 + R.band + 0.02, -depth / 2],
      [r0 + R.band + 0.02, depth / 2],
      [r0 - 0.02, depth / 2],
    ];
    bands.push(Manifold.revolve([profile], 128, 180).rotate([90, 0, 0]).translate([0, R.y, feet]));
  }
  const random = rng(28);
  const clouds = [];
  const middle = R.inner + (R.bands * R.band) / 2;
  for (const side of [-1, 1]) {
    for (let i = 0; i < 6; i++) {
      const r = 3.2 + random() * 2.4;
      clouds.push(
        Manifold.sphere(r, 12)
          .scale([1, 1, 0.75])
          .translate([
            side * (middle + (random() - 0.5) * 15),
            R.y + (random() - 0.5) * 6,
            TOP - 0.6 + r * 0.35,
          ]),
      );
    }
  }
  return { bande: bands, nubi: union(clouds).trimByPlane([0, 0, 1], TOP - 0.9) };
}
