// Ezekiel 1:15-18 — one wheel: two rims of the same diameter crossed at right angles
// ("a wheel within a wheel"), their rims full of eyes all around. The rims are broad bands, as
// in the book's drawing of the wheel.
import { CrossSection, Manifold, union } from '../lib/kernel.mjs';
import { P } from '../params.mjs';

const W = P.wheel;

/** One eye modelled lying on the XY plane, looking along +Z, long axis along X. */
function eyeParts(scale) {
  const a = 3.2 * scale;
  const b = 1.8 * scale;
  const rho = (a * a + b * b) / (2 * b);
  const lens = CrossSection.circle(rho, 18)
    .translate([0, rho - b])
    .intersect(CrossSection.circle(rho, 18).translate([0, b - rho]));
  const inner = lens.scale([0.82, 0.7]);
  const embed = 0.35;
  const raise = (section, height) => section.extrude(height + embed).translate([0, 0, -embed]);
  // A stack of ever smaller steps: eyelids, white, iris, pupil.
  return {
    lid: raise(lens, 0.4 * scale),
    sclera: raise(inner, 0.72 * scale),
    iris: Manifold.cylinder(1.0 * scale + embed, 1.25 * scale, 1.1 * scale, 10).translate([0, 0, -embed]),
    pupil: Manifold.cylinder(0.5 * scale, 0.62 * scale, 0.5 * scale, 6).translate([0, 0, 0.9 * scale]),
  };
}

/**
 * A single rim lying in the XY plane (axis = Z): a broad band, with two rows of eyes on its
 * outer face and two on its inner face.
 */
function rim() {
  const { radius: ro, rimRadial, rimThick: t, chamfer: c } = W;
  const ri = ro - rimRadial;
  const h = t / 2;
  const profile = [
    [ri + c, -h],
    [ro - c, -h],
    [ro, -h + c],
    [ro, h - c],
    [ro - c, h],
    [ri + c, h],
    [ri, h - c],
    [ri, -h + c],
  ];
  const body = Manifold.revolve([profile], 96);

  const groups = { lid: [], sclera: [], iris: [], pupil: [] };
  const eye = eyeParts(0.62);
  const row = t * 0.245;
  // `inward` eyes look towards the axis. Eyes are left out where the two bands cross and
  // where the rim meets the ground and the expanse.
  const ring = (count, inward, z, shift) => {
    for (let i = 0; i < count; i++) {
      const angle = ((i + shift) * 360) / count;
      const fromVertical = Math.min(Math.abs(angle - 90), Math.abs(angle - 270));
      if (fromVertical < 14) continue;
      for (const key of Object.keys(groups)) {
        groups[key].push(
          eye[key]
            .rotate([0, 0, 90])
            .rotate([0, inward ? -90 : 90, 0])
            .translate([inward ? ri + 0.12 : ro - 0.12, 0, z])
            .rotate([0, 0, angle]),
        );
      }
    }
  };
  ring(W.outerEyes, false, row, 0.25);
  ring(W.outerEyes, false, -row, 0.75);
  ring(W.innerEyes, true, row, 0.75);
  ring(W.innerEyes, true, -row, 0.25);
  return { body, ...groups };
}

/**
 * The wheel, centred on its own axis crossing: local origin is the wheel centre.
 * Returns the solids grouped by material.
 */
export function ruota() {
  const one = rim();
  const upright = (m) => m.rotate([90, 0, 0]); // rim plane XZ, angle 90° = top
  const crossed = (m) => upright(m).rotate([0, 0, 90]); // rim plane YZ
  const both = (list) => union(list.map(upright), list.map(crossed));
  return {
    cerchi: union(upright(one.body), crossed(one.body), both(one.lid)),
    occhi: both(one.sclera),
    iridi: both(one.iris),
    pupille: both(one.pupil),
  };
}

/** Slightly oversized plain rims, used to cut the seats of the wheels in the kit parts. */
export function ruotaIngombro(clearance) {
  const { radius: ro, rimRadial, rimThick: t } = W;
  const ring = Manifold.cylinder(t + 2 * clearance, ro + clearance, ro + clearance, 120, true).subtract(
    Manifold.cylinder(t + 2, ro - rimRadial - clearance, ro - rimRadial - clearance, 120, true),
  );
  const upright = ring.rotate([90, 0, 0]);
  return union(upright, upright.rotate([0, 0, 90]));
}
