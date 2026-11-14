// Every dimension of the model, in millimetres. Z is up; the ground the wheels stand on is
// the top of the base. The plan is a long rectangle, long side along X, with wheels that are
// small next to it, as in the illustration of the chariot in the book "Pure Worship"
// (chapter 3). The throne faces +X, along the long side.

const wheel = {
  offset: [86, 40], // wheel axes stand on the corners of a 172 x 80 mm rectangle
  radius: 34, // outer radius of each of the two crossed rims
  rimRadial: 3, // the rims are broad bands, like hoops
  rimThick: 9,
  chamfer: 0.6,
  sink: 1.5, // how far a rim is embedded in the ground and in the expanse above
  outerEyes: 18, // per row; two rows on the outer face of each band
  innerEyes: 14, // per row; two rows on the inner face
};

const margin = 1.5;
const base = {
  // outer half-sizes of the cloud-rimmed base: just clear of the wheels
  half: [wheel.offset[0] + wheel.radius + margin, wheel.offset[1] + wheel.radius + margin],
  inset: 3.5, // the slab stops short of the outer boundary; the cloud billows fill the rest
  corner: 22,
  thick: 4,
};

const ground = base.thick;
const wheelCentreZ = ground - wheel.sink + wheel.radius;
const expanseBottom = wheelCentreZ + wheel.radius - wheel.sink;
const expanseThick = 6;

export const P = {
  base,
  wheel,
  ground,
  wheelCentreZ,
  cherub: {
    offset: [40, 20], // each creature stands inside the rectangle, by its own wheel
    scale: 0.85, // the creatures are modelled 56 mm tall and scaled to stand well below the expanse
    wingElevation: [30, 50], // of the wing reaching along X and of the one reaching along Y
  },
  expanse: {
    half: [123, 77], // the slab reaches a little past the wheels on every side
    bottom: expanseBottom,
    thick: expanseThick,
    top: expanseBottom + expanseThick,
    chamfer: 1.2,
  },
  // Throne, figure and rainbow are modelled facing -Y and turned as one group.
  throne: {
    y: 2,
    turn: 90,
  },
  rainbow: {
    y: 20.5,
    inner: 46,
    band: 2,
    bands: 7,
  },
  kitClearance: 0.25,
};
