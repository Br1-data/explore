// Every dimension of the model, in millimetres. Z is up; the ground the wheels stand on is
// the top of the base. The throne faces -Y. The plan is a rectangle, long side along X, as in
// the illustration of the chariot in the book "Pure Worship" (chapter 3).

const wheel = {
  offset: [74, 45], // wheel axes stand on the corners of a 148 x 90 mm rectangle
  radius: 41, // outer radius of each of the two crossed rims
  rimRadial: 3.4, // the rims are broad bands, like hoops
  rimThick: 10,
  chamfer: 0.6,
  sink: 1.5, // how far a rim is embedded in the ground and in the expanse above
  outerEyes: 20, // per row; two rows on the outer face of each band
  innerEyes: 16, // per row; two rows on the inner face
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
    offset: [36, 25], // each creature stands inside the rectangle, by its own wheel
    wingElevation: [40, 50], // of the wing reaching along X and of the one reaching along Y
  },
  expanse: {
    half: [102, 68],
    bottom: expanseBottom,
    thick: expanseThick,
    top: expanseBottom + expanseThick,
    chamfer: 1.2,
  },
  throne: {
    y: 2,
  },
  rainbow: {
    y: 20.5,
    inner: 46,
    band: 2,
    bands: 7,
  },
  kitClearance: 0.25,
};
