// Ezekiel 1:4, 13 — burning coals, torches of fire moving among the living creatures,
// and lightning flashing out of the fire.
import { CrossSection, Manifold, rng, union } from '../lib/kernel.mjs';
import { P } from '../params.mjs';

/** A single tongue of flame of the given height, standing on z = 0. */
export function fiamma(height, radius, random, lobes = 5) {
  const points = [];
  const steps = lobes * 3;
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const r = radius * (0.72 + 0.28 * Math.cos(a * lobes));
    points.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  const twist = (random() < 0.5 ? -1 : 1) * (70 + random() * 80);
  const phase = random() * Math.PI * 2;
  const sway = radius * (0.35 + random() * 0.35);
  const divisions = Math.max(7, Math.round(height / 3));
  return new CrossSection([points]).extrude(height, divisions, twist).warp((p) => {
    const t = p[2] / height;
    // Teardrop: swells a little above the foot, then tapers to a fine tip.
    const k = Math.pow(1 - t, 0.85) * (1 + 0.55 * Math.sin(Math.PI * Math.min(1, t * 2.2))) + 0.03;
    p[0] = p[0] * k + sway * t * Math.sin(phase + t * 5.2);
    p[1] = p[1] * k + sway * t * Math.cos(phase * 1.7 + t * 4.1);
  });
}

function carboni(random) {
  const lumps = [];
  for (let i = 0; i < 30; i++) {
    const ring = Math.sqrt(random()) * 12.5;
    const angle = random() * Math.PI * 2;
    const r = 2.2 + random() * 1.9;
    const height = Math.max(0, 5.2 - ring * 0.42) * random();
    const jitter = Array.from({ length: 12 }, () => 0.78 + random() * 0.44);
    const lump = Manifold.sphere(r, 8)
      .warp((p) => {
        // Push each vertex in or out by a pseudo-random amount keyed on its direction.
        const key = Math.abs(Math.round(p[0] * 7.1 + p[1] * 13.3 + p[2] * 3.7)) % jitter.length;
        const k = jitter[key];
        p[0] *= k;
        p[1] *= k;
        p[2] *= k * 0.82;
      })
      .rotate([random() * 360, random() * 360, random() * 360])
      .translate([Math.cos(angle) * ring, Math.sin(angle) * ring, P.ground + r * 0.45 + height]);
    lumps.push(lump);
  }
  // A low mound under the lumps keeps the pile solid for printing.
  const mound = Manifold.sphere(13, 24)
    .scale([1, 1, 0.34])
    .translate([0, 0, P.ground - 0.6]);
  return union(lumps, mound).trimByPlane([0, 0, 1], P.ground - 0.5);
}

function fiamme(random) {
  const tongues = [];
  const plant = (x, y, height, radius) =>
    tongues.push(fiamma(height, radius, random).translate([x, y, P.ground + 1.5]));
  plant(0, 0, 50, 5.2);
  for (let i = 0; i < 4; i++) {
    const a = (i * 90 + 20) * (Math.PI / 180);
    plant(Math.cos(a) * 6.5, Math.sin(a) * 6.5, 30 + random() * 9, 4.0);
  }
  // Torches between the living creatures: on the four axes, where the creatures are not.
  for (let i = 0; i < 4; i++) {
    const a = i * 90 * (Math.PI / 180);
    plant(Math.cos(a) * 12.5, Math.sin(a) * 12.5, 19 + random() * 7, 3.1);
    const b = (i * 90 + 45) * (Math.PI / 180);
    plant(Math.cos(b) * 10.5, Math.sin(b) * 10.5, 12 + random() * 5, 2.6);
  }
  return union(tongues);
}

/** One zig-zag bolt in the vertical plane through the axis, running outwards along +X. */
function lampo(random) {
  const path = [
    [3, 27, 2.0],
    [15, 33, 1.9],
    [19.5, 23.5, 1.8],
    [33, 28.5, 1.6],
    [38.5, 16, 1.45],
    [51, 20, 1.25],
    [61, P.ground - 0.4, 1.0],
  ];
  const node = ([rho, z, half], index) =>
    Manifold.cube([half * 2, half * 2, half * 2], true)
      .rotate([45, 0, 45])
      .translate([rho, index % 2 ? 1.1 : -1.1, z + (random() - 0.5) * 1.5]);
  const nodes = path.map(node);
  const segments = [];
  for (let i = 0; i + 1 < nodes.length; i++) segments.push(Manifold.hull([nodes[i], nodes[i + 1]]));
  return union(segments);
}

function lampi(random) {
  const bolts = [];
  for (let i = 0; i < 4; i++) bolts.push(lampo(random).rotate([0, 0, i * 90]));
  return union(bolts);
}

export function fuoco() {
  const random = rng(1613);
  return { carboni: carboni(random), fiamme: fiamme(random), lampi: lampi(random) };
}
