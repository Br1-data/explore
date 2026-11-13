// Every dimension of the model, in millimetres. Z is up; the ground the wheels stand on is
// the top of the base. The chariot has no front of its own: the throne faces -Y.

const base = {
  half: 87.5, // outer half-size of the cloud-rimmed base
  slabHalf: 84,
  corner: 22,
  thick: 4,
};

const wheel = {
  offset: 45, // wheel axes stand on the corners of a 90 mm square
  radius: 41, // outer radius of each of the two crossed rims
  rimRadial: 8,
  rimThick: 5,
  chamfer: 0.8,
  sink: 1.5, // how far a rim is embedded in the ground and in the expanse above
  sideEyes: 16,
  treadEyes: 20,
};

const ground = base.thick;
const wheelCentreZ = ground - wheel.sink + wheel.radius;
const expanseBottom = wheelCentreZ + wheel.radius - wheel.sink;

export const P = {
  base,
  wheel,
  ground,
  wheelCentreZ,
  cherub: {
    offset: 25, // cherubs stand on the corners of a 50 mm square, inside the wheels
    wingLength: 33.4,
    wingElevation: 50,
  },
  expanse: {
    radius: 80,
    bottom: expanseBottom,
    thick: 4,
    top: expanseBottom + 4,
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
