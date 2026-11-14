// Feathered wings (Ezekiel 1:6, 9, 11, 23). A wing is modelled flat, in its own plane:
// origin at the shoulder, +X towards the tip, +Y the leading edge, feathers trailing to -Y.
import { CrossSection, Manifold, clean, lerp, union } from '../lib/kernel.mjs';

const smooth = (t) => t * t * (3 - 2 * t);

/**
 * One feather along +X: a rounded vane with a raised shaft, canted about its own axis so
 * that neighbouring feathers overlap like shingles.
 */
function feather(length, width, thickness, cant, withShaft) {
  const tip = width * 0.4;
  const vane = CrossSection.hull([
    CrossSection.circle(width / 2, 8),
    CrossSection.circle(tip, 6).translate([length - tip, 0]),
  ]).extrude(thickness, 0, 0, [1, 1], true);
  if (!withShaft) return vane.rotate([cant, 0, 0]);
  const shaft = Manifold.cube([length - tip, width * 0.13, thickness + 0.42], true).translate([
    (length - tip) / 2,
    0,
    0,
  ]);
  return union(vane, shaft).rotate([cant, 0, 0]);
}

export function ala(spec) {
  const { length: L, rootAngle, tipAngle, bend, hand, featherLength, flight = 13, width = 0.125 } = spec;
  const armScale = spec.arm ?? 1;
  const p1 = [bend[0] * L, bend[1] * L];
  const p2 = [hand[0] * L, hand[1] * L];
  const curve = (u) => [2 * (1 - u) * u * p1[0] + u * u * p2[0], 2 * (1 - u) * u * p1[1] + u * u * p2[1]];
  const angle = (u) => lerp(rootAngle, tipAngle, smooth(u));
  const flightLength = (u) => lerp(featherLength[0], featherLength[1], Math.pow(u, 1.3)) * L;

  // Three overlapping rows, from the long flight feathers to the small coverts by the arm.
  const rows = [
    { count: flight, from: 0, to: 1, length: flightLength, width, thick: 0.95, cant: 11, shaft: true },
    {
      count: flight - 3,
      from: 0.03,
      to: 0.94,
      length: (u) => flightLength(u) * 0.5,
      width: width * 1.08,
      thick: 1.5,
      cant: 9,
    },
    {
      count: flight - 5,
      from: 0.02,
      to: 0.88,
      length: (u) => L * 0.22 * (1 - 0.3 * u),
      width: width * 0.95,
      thick: 2.0,
      cant: 7,
    },
  ];
  const solids = [];
  for (const row of rows) {
    for (let i = 0; i < row.count; i++) {
      const u = lerp(row.from, row.to, i / (row.count - 1));
      const [x, y] = curve(u);
      solids.push(
        feather(row.length(u), row.width * L * (1 - 0.2 * u), row.thick, row.cant, row.shaft)
          .rotate([0, 0, angle(u)])
          .translate([x, y - 0.015 * L, 0]),
      );
    }
  }

  // The arm of the wing along the leading edge, with a knob that sinks into the shoulder.
  const arm = [];
  const steps = 7;
  const radius = (u) => lerp(0.07, 0.03, u) * L * armScale;
  for (let i = 0; i < steps; i++) {
    const u0 = i / steps;
    const u1 = (i + 1) / steps;
    arm.push(
      CrossSection.hull([
        CrossSection.circle(radius(u0), 12).translate(curve(u0)),
        CrossSection.circle(radius(u1), 12).translate(curve(u1)),
      ]),
    );
  }
  arm.push(CrossSection.circle(0.085 * L * armScale, 16));
  solids.push(CrossSection.union(arm).extrude(2.6, 0, 0, [1, 1], true));
  return clean(union(solids));
}

/** Position of the outermost feather tip, in wing coordinates. */
export function alaTip(spec) {
  const { length: L, tipAngle, hand, featherLength } = spec;
  const a = (tipAngle * Math.PI) / 180;
  return [
    hand[0] * L + featherLength[1] * L * Math.cos(a),
    hand[1] * L - 0.015 * L + featherLength[1] * L * Math.sin(a),
  ];
}

export const ALA_SPIEGATA = {
  rootAngle: -74,
  tipAngle: -4,
  bend: [0.3, 0.13],
  hand: [0.56, 0.07],
  featherLength: [0.3, 0.5],
};

export const ALA_RIPIEGATA = {
  rootAngle: -44,
  tipAngle: -3,
  bend: [0.26, 0.04],
  hand: [0.46, 0.0],
  featherLength: [0.3, 0.56],
  flight: 12,
  width: 0.12,
  arm: 0.6,
};
