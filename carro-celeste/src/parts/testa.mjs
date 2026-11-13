// Ezekiel 1:10 — the four faces. Seen from the creature itself: a man's face in front,
// a lion's on the right, a bull's on the left, an eagle's behind.
// Each face is sculpted as a signed-distance field in its own (u, v, w) frame:
// u sideways, v up, w outwards from the centre of the head.
import {
  blend,
  capsule,
  carve,
  ellipsoid,
  facing,
  intersect,
  mirrorU,
  roundBox,
  scaled,
  sphere,
  toSolid,
} from '../lib/sdf.mjs';

const rad = Math.PI / 180;

function uomo() {
  const flesh = blend(
    0.6,
    ellipsoid([0, -0.2, 2.6], [3.2, 4.4, 2.2]),
    capsule([0, 1.5, 4.25], [2.2, 1.35, 4.0], 0.68), // brow
    capsule([0, 1.3, 4.5], [0, -0.5, 5.35], 0.5, 0.68), // nose
    sphere(2.0, -0.9, 3.8, 1.25), // cheek
    ellipsoid([0, -1.95, 4.3], [1.45, 0.55, 0.7]), // lips
    ellipsoid([0, -3.6, 3.3], [2.4, 2.1, 1.8]), // beard
    ellipsoid([0, 3.0, 3.0], [3.3, 1.5, 1.9]), // hair over the forehead
  );
  let f = carve(0.3, flesh, sphere(1.5, 0.45, 5.15, 0.85)); // eye socket
  f = carve(0.08, f, capsule([0, -2.1, 5.15], [1.0, -2.05, 4.95], 0.2)); // mouth
  f = carve(0.1, f, capsule([0.95, -2.9, 5.2], [1.15, -5.4, 4.0], 0.2)); // strand of the beard
  return mirrorU(blend(0.12, f, sphere(1.5, 0.45, 4.42, 0.56)));
}

function leone() {
  const tufts = [-90, -58, -26, 6, 38, 70, 90].map((deg) => {
    const c = Math.cos(deg * rad);
    const s = Math.sin(deg * rad);
    return capsule([c * 2.6, s * 2.6 + 0.3, 3.5], [c * 4.2, s * 4.2 + 0.3, 3.95], 1.05, 0.6);
  });
  const head = blend(
    0.55,
    ellipsoid([0, 0.2, 3.0], [3.3, 3.4, 2.2]),
    ...tufts, // mane
    capsule([0, 1.9, 4.6], [0, -0.3, 5.7], 0.95, 1.0), // broad nose
    sphere(1.05, -1.5, 5.3, 1.25), // whisker pad
    sphere(0, -2.5, 4.7, 1.05), // chin
    capsule([1.0, 2.0, 4.6], [2.5, 1.5, 4.3], 0.6), // brow
    sphere(2.9, 3.3, 3.9, 0.95), // ear
  );
  let f = carve(0.25, head, sphere(1.75, 0.85, 5.05, 0.7));
  f = carve(0.1, f, sphere(2.95, 3.35, 4.75, 0.55));
  f = carve(0.06, f, capsule([0, -1.25, 6.5], [0, -1.85, 6.3], 0.17));
  f = carve(0.06, f, capsule([0, -1.9, 6.25], [1.3, -2.25, 5.65], 0.17));
  return mirrorU(blend(0.1, f, sphere(1.75, 0.85, 4.45, 0.5), ellipsoid([0, -0.55, 6.35], [0.85, 0.5, 0.5])));
}

function toro() {
  const head = blend(
    0.6,
    ellipsoid([0, 0.3, 2.9], [3.0, 3.9, 2.3]),
    ellipsoid([0, -2.7, 4.6], [2.25, 1.75, 1.9]), // muzzle
    capsule([0, 1.6, 4.6], [0, -1.8, 5.6], 1.45, 1.5), // long nose
    capsule([0.8, 2.3, 4.5], [2.5, 1.9, 4.1], 0.62), // brow
    capsule([2.3, 3.4, 3.7], [3.9, 4.3, 4.1], 0.95, 0.75), // horn
    capsule([3.9, 4.3, 4.1], [4.3, 5.7, 4.5], 0.75, 0.5),
    capsule([4.3, 5.7, 4.5], [3.9, 6.9, 4.8], 0.5, 0.2),
    capsule([2.7, 2.6, 3.7], [4.1, 2.0, 4.2], 0.75, 0.45), // ear
    sphere(0, 3.6, 4.0, 1.2), // forelock
  );
  let f = carve(0.25, head, sphere(2.15, 1.2, 4.95, 0.68));
  f = carve(0.12, f, sphere(0.95, -2.9, 6.45, 0.42)); // nostril
  f = carve(0.06, f, capsule([0, -3.75, 6.2], [1.5, -3.6, 5.6], 0.16)); // mouth
  return mirrorU(blend(0.1, f, sphere(2.15, 1.2, 4.38, 0.5)));
}

function aquila() {
  const head = blend(
    0.55,
    ellipsoid([0, 0.5, 2.9], [3.0, 3.6, 2.3]),
    capsule([0, 0.9, 4.9], [0, -0.3, 6.5], 1.25, 0.95), // upper beak
    capsule([0, -0.3, 6.5], [0, -1.7, 6.9], 0.95, 0.6),
    capsule([0, -1.7, 6.9], [0, -2.7, 6.3], 0.6, 0.22), // hook
    capsule([0, -1.2, 4.6], [0, -2.0, 5.8], 0.8, 0.45), // lower beak
    capsule([0.5, 1.9, 4.9], [2.7, 1.25, 4.1], 0.62, 0.5), // fierce brow
    sphere(2.3, -1.4, 3.6, 1.3), // cheek feathers
    capsule([0, 3.6, 3.4], [0, 4.9, 2.2], 1.1, 0.6), // crest
    sphere(1.6, -3.3, 3.3, 1.2), // ruff
    sphere(0, -3.7, 3.6, 1.2),
  );
  let f = carve(0.2, head, sphere(1.85, 0.75, 5.0, 0.66));
  f = carve(0.05, f, capsule([0.75, -1.0, 6.2], [1.5, -0.9, 4.9], 0.17)); // gape
  f = carve(0.08, f, sphere(0.55, 0.15, 6.15, 0.2)); // nostril
  return mirrorU(blend(0.08, f, sphere(1.85, 0.75, 4.42, 0.5)));
}

// A face may not spill past the diagonal planes it shares with its neighbours.
const wedge = (field) => intersect(field, (u, v, w) => (Math.abs(u) - w - 0.35) * Math.SQRT1_2);

/** Head centred on the origin, front (the man's face) towards +Y. */
export function testa(scale, edge) {
  const field = scaled(
    scale,
    blend(
      0.5,
      roundBox([0, 0, 0], [3.3, 3.3, 4.2], 2.0),
      ellipsoid([0, 0, 4.0], [3.7, 3.7, 2.0]), // crown
      capsule([0, 0, -3.4], [0, 0, -6.6], 2.1, 2.3), // neck
      facing(90, wedge(uomo())),
      facing(0, wedge(leone())),
      facing(180, wedge(toro())),
      facing(270, wedge(aquila())),
    ),
  );
  const r = 7.8 * scale;
  return toSolid(field, { min: [-r, -r, -7.4 * scale], max: [r, r, 7.9 * scale] }, edge, 0.04);
}
