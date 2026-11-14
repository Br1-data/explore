// Ezekiel 1:5-12 — one living creature: human form, four faces, four wings, straight legs
// with calves' hooves, a human hand under each wing. Local frame: stands on z = 0,
// the man's face looks towards +Y, the creature's right is +X.
import { DEG, frame, union, vec } from '../lib/kernel.mjs';
import {
  blend,
  capsule,
  carve,
  ellipsoid,
  ellipticCone,
  roundBox,
  sphere,
  toSolid,
  torusZ,
} from '../lib/sdf.mjs';
import { ALA_RIPIEGATA, ALA_SPIEGATA, ala, alaTip } from './ali.mjs';
import { testa } from './testa.mjs';
import { P } from '../params.mjs';

const C = P.cherub;
const SHOULDER_Z = 39.5;
const WING_ROOT = 4.5; // distance of the spread wings' roots from the body axis
const HEAD_Z = 48.8;
const HEAD_SCALE = 0.9;
const DIAGONALS = [45, 135, 225, 315];

/** Shallow vertical folds, deepest at the hem and fading out towards the waist. */
const pleated = (field) => (x, y, z) => {
  const fade = Math.min(1, Math.max(0, (30 - z) / 14));
  return field(x, y, z) - 0.3 * fade * Math.cos(Math.atan2(y, x) * 12);
};

function corpo(edge) {
  const stubs = DIAGONALS.map((deg) => {
    const d = [Math.cos(deg * DEG), Math.sin(deg * DEG)];
    return capsule([d[0] * 3.6, d[1] * 3.6, 38.4], [d[0] * 7.6, d[1] * 7.6, 33.2], 1.5, 1.25);
  });
  const robe = blend(
    1.1,
    pleated(ellipticCone(0, 0, 13.5, 30, [5.6, 4.9], [4.2, 3.7])), // skirt of the robe
    ellipticCone(0, 0, 29, 38.5, [4.2, 3.7], [5.6, 4.2]), // chest
    ellipsoid([0, 0, 38.6], [6.0, 4.3, 2.6]), // shoulders
    capsule([0, 0, 39], [0, 0, 44], 2.2, 2.0), // neck
    ...stubs,
  );
  const sash = blend(0.3, robe, torusZ([0, 0, 29.6], 3.75, 0.8));
  return toSolid(sash, { min: [-9.5, -9.5, 12.8], max: [9.5, 9.5, 45.2] }, edge * 1.15, 0.1);
}

/** One arm reaching out along +X, ending in an open human hand (v. 8). */
function braccio(edge) {
  const wrist = [11.2, 0, 31.4];
  const fingers = [-24, -8, 8, 24].map((deg, i) => {
    const a = deg * DEG;
    const side = (deg / 24) * 0.75;
    const length = i === 0 || i === 3 ? 1.8 : 2.2;
    return capsule(
      [13.1, side, 31.25],
      [13.1 + Math.cos(a) * length, side + Math.sin(a) * length, 31.7],
      0.37,
      0.3,
    );
  });
  const field = blend(
    0.35,
    capsule([4.2, 0, 38.2], [7.6, 0, 33.2], 1.35, 1.15), // upper arm
    capsule([7.6, 0, 33.2], wrist, 1.15, 0.85), // forearm
    capsule(wrist, [13.2, 0, 31.2], 0.85, 1.0), // palm
    capsule([12.3, 0.95, 31.5], [12.9, 1.75, 32.7], 0.42, 0.33), // thumb
    ...fingers,
  );
  return toSolid(field, { min: [2.4, -2.6, 29.6], max: [16.4, 3.0, 40.2] }, edge * 0.75, 0.05);
}

function gambe(edge) {
  const one = (x) => {
    const leg = blend(
      0.5,
      capsule([x, 0, 3.0], [x, 0, 16.8], 1.5, 1.95), // straight leg
      sphere(x, -0.5, 4.3, 1.7), // fetlock
      ellipticCone(x, 0.45, 0, 3.7, [2.3, 2.9], [1.7, 2.1]), // hoof
    );
    // The cloven hoof of a calf: a narrow cleft at the front.
    return carve(0.12, leg, roundBox([x, 2.9, 1.5], [0.27, 1.7, 2.1], 0.1));
  };
  const field = blend(0, one(2.9), one(-2.9));
  return toSolid(field, { min: [-5.8, -3.4, -0.6], max: [5.8, 3.9, 17.4] }, edge, 0.07);
}

/**
 * The four wings. On a rectangular plan the neighbour along X is further away than the one
 * along Y, so the two spread wings differ in length; `longOnLeft` says which side the longer
 * one is on (it alternates from one creature to the next).
 */
function ali(longOnLeft) {
  const wings = [];
  const [tx, ty] = alaTip({ ...ALA_SPIEGATA, length: 1 });
  const overlap = 1.4;
  const lengths = [];
  // The two wings spread upwards, towards the neighbours on either side (vv. 9, 11, 23).
  for (const deg of [225, 315]) {
    const axis = (deg === 225) === longOnLeft ? 0 : 1;
    const beta = C.wingElevation[axis] * DEG;
    const reachPerUnit = tx * Math.cos(beta) - ty * Math.sin(beta);
    const length = (C.offset[axis] - WING_ROOT + overlap) / reachPerUnit;
    lengths.push(length);
    const d = [Math.cos(deg * DEG), Math.sin(deg * DEG), 0];
    const along = vec.add(vec.scale(d, Math.cos(beta)), [0, 0, Math.sin(beta)]);
    const leading = vec.add(vec.scale(d, -Math.sin(beta)), [0, 0, Math.cos(beta)]);
    const root = [d[0] * WING_ROOT, d[1] * WING_ROOT, SHOULDER_Z];
    wings.push(frame(root, along, leading).place(ala({ ...ALA_SPIEGATA, length })));
  }
  // The two wings folded down, one covering each side of the body (vv. 11, 23).
  const folded = ala({ ...ALA_RIPIEGATA, length: 30 });
  const root = [5.5, 1.6, 40.4];
  const right = frame(root, vec.sub([7.0, 0.4, 9.5], root), [0, 1, 0]).place(folded);
  wings.push(right, right.mirror([1, 0, 0]));
  return { solid: union(wings), lengths };
}

/**
 * Body, head and feet are the same for all four creatures; the wings come in two versions,
 * `aliA` (longer wing on the creature's left) and `aliB` (on its right).
 */
export function cherubino(quality) {
  const edge = quality.edge;
  const arm = braccio(edge);
  const arms = DIAGONALS.map((deg) => arm.rotate([0, 0, deg]));
  const a = ali(true);
  const b = ali(false);
  return {
    corpo: union(corpo(edge), arms),
    testa: testa(HEAD_SCALE, edge * 0.8).translate([0, 0, HEAD_Z]),
    piedi: gambe(edge * 0.85),
    aliA: a.solid,
    aliB: b.solid,
    info: { wingLengths: a.lengths },
  };
}
