// Builds every deliverable from the parametric description:
//   modelli/carro-celeste.stl       one watertight solid, ready to slice
//   modelli/kit/*.stl               the same model split into parts that print without fuss
//   modelli/carro-celeste.glb       coloured, instanced model for the web viewer
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { clean, union } from './lib/kernel.mjs';
import { creasedGeometry, meshData, writeBinaryStl, writeGlb } from './lib/mesh-io.mjs';
import { P } from './params.mjs';
import { base } from './parts/base.mjs';
import { cherubino } from './parts/cherubino.mjs';
import { distesa } from './parts/distesa.mjs';
import { fuoco } from './parts/fuoco.mjs';
import { ruota, ruotaIngombro } from './parts/ruota.mjs';
import { arcobaleno, figura, trono } from './parts/trono.mjs';

const out = fileURLToPath(new URL('../modelli/', import.meta.url));
mkdirSync(out + 'kit', { recursive: true });
const started = Date.now();
const log = (...args) => console.log(`[${((Date.now() - started) / 1000).toFixed(1)}s]`, ...args);

const quality = { edge: 0.3 };

// ---------------------------------------------------------------- parts, in local frames
const parts = {
  base: { nube: base() },
  fuoco: fuoco(),
  ruota: ruota(),
  cherubino: cherubino(quality),
  distesa: { ghiaccio: distesa() },
  trono: { zaffiro: trono() },
  figura: figura(quality),
  arcobaleno: arcobaleno(),
};
const cherubInfo = parts.cherubino.info;
delete parts.cherubino.info;
for (const key of Object.keys(parts.cherubino))
  parts.cherubino[key] = parts.cherubino[key].scale(P.cherub.scale);
const { aliA, aliB, ...cherubShared } = parts.cherubino;
log('parts built');

// ---------------------------------------------------------------- placement
const corners = [
  [1, 1],
  [-1, 1],
  [-1, -1],
  [1, -1],
];
const wheelAt = ([sx, sy]) => [sx * P.wheel.offset[0], sy * P.wheel.offset[1], P.wheelCentreZ];
const cherubAt = ([sx, sy]) => [sx * P.cherub.offset[0], sy * P.cherub.offset[1], P.ground - 0.4];
// Which wing set a creature wears: the longer wing must point along X, the long side.
const cherubWings = ([sx, sy]) => (sx * sy > 0 ? 'a' : 'b');
const cherubTurn = ([sx, sy]) => (Math.atan2(sy, sx) * 180) / Math.PI - 90;

const whole = (group) => union(Object.values(group));
const wheelSolid = whole(parts.ruota);
const cherubSolid = { a: union(whole(cherubShared), aliA), b: union(whole(cherubShared), aliB) };
const wheels = corners.map((c) => wheelSolid.translate(wheelAt(c)));
const cherubs = corners.map((c) =>
  cherubSolid[cherubWings(c)].rotate([0, 0, cherubTurn(c)]).translate(cherubAt(c)),
);
const turned = (solid) => solid.rotate([0, 0, P.throne.turn]);
const rainbowLocal = union(parts.arcobaleno.bande, parts.arcobaleno.nubi);
const rainbowSolid = turned(rainbowLocal);
const throneSolid = turned(union(whole(parts.trono), whole(parts.figura)));

// ---------------------------------------------------------------- one-piece model
const single = union(
  whole(parts.base),
  whole(parts.fuoco),
  wheels,
  cherubs,
  whole(parts.distesa),
  throneSolid,
  rainbowSolid,
);
const describe = (name, solid) => {
  const box = solid.boundingBox();
  const size = box.max.map((v, i) => +(v - box.min[i]).toFixed(1));
  const pieces = solid.decompose().length;
  log(
    `${name}: ${solid.numTri()} triangles, ${size.join(' x ')} mm, volume ${(solid.volume() / 1000).toFixed(1)} cm3,` +
      ` genus ${solid.genus()}, ${pieces} piece${pieces === 1 ? '' : 's'}, status ${solid.status()}`,
  );
  return { name, triangles: solid.numTri(), size, volumeCm3: +(solid.volume() / 1000).toFixed(1), pieces };
};
const report = { cherubWingLengths: cherubInfo.wingLengths.map((l) => +l.toFixed(2)), files: [] };
const save = (file, raw, title) => {
  const solid = clean(raw);
  const info = describe(file, solid);
  if (info.pieces !== 1) {
    for (const piece of solid.decompose()) {
      const b = piece.boundingBox();
      const f = (v) => v.map((x) => x.toFixed(1)).join(', ');
      log(`  piece of ${piece.volume().toFixed(2)} mm3 from [${f(b.min)}] to [${f(b.max)}]`);
    }
    throw new Error(`${file} is not a single connected solid (${info.pieces} pieces)`);
  }
  writeFileSync(out + file, writeBinaryStl(solid, title));
  report.files.push(info);
};
save('carro-celeste.stl', single, 'Carro celeste - Ezechiele 1 - pezzo unico (mm)');

// ---------------------------------------------------------------- kit of parts
const c = P.kitClearance;
const onBed = (solid) => {
  const box = solid.boundingBox();
  return solid.translate([-(box.min[0] + box.max[0]) / 2, -(box.min[1] + box.max[1]) / 2, -box.min[2]]);
};
/** Cheap outward offset in the horizontal plane and downwards, for seats that parts drop into. */
const seatOf = (solid) => {
  const copies = [solid.translate([0, 0, -c])];
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    copies.push(solid.translate([Math.cos(a) * c, Math.sin(a) * c, 0]));
  }
  return union(copies);
};
const wheelSeats = union(corners.map((corner) => ruotaIngombro(c).translate(wheelAt(corner))));

save(
  'kit/1-base-e-creature.stl',
  union(whole(parts.base), whole(parts.fuoco), cherubs).subtract(wheelSeats),
  'Carro celeste - kit 1/5 - base, fuoco e creature viventi',
);
save('kit/2-ruota-x4.stl', onBed(wheelSolid), 'Carro celeste - kit 2/5 - ruota (stampare 4 copie)');
save(
  'kit/3-distesa.stl',
  onBed(
    whole(parts.distesa).subtract(wheelSeats).subtract(seatOf(throneSolid)).subtract(seatOf(rainbowSolid)),
  ),
  'Carro celeste - kit 3/5 - distesa simile a ghiaccio',
);
save('kit/4-trono.stl', onBed(throneSolid), 'Carro celeste - kit 4/5 - trono');
save(
  'kit/5-arcobaleno.stl',
  onBed(rainbowLocal.rotate([-90, 0, 0])),
  'Carro celeste - kit 5/5 - arcobaleno (stampare coricato)',
);

// ---------------------------------------------------------------- coloured model for the web
// name, base colour, metallic, roughness, emissive. The viewer refines these by name.
const palette = [
  ['nube', [0.62, 0.64, 0.72, 1], 0, 0.95, [0, 0, 0]],
  ['carboni', [0.25, 0.05, 0.02, 1], 0, 0.9, [0.9, 0.18, 0.02]],
  ['fuoco', [1, 0.5, 0.1, 1], 0, 0.5, [1, 0.42, 0.06]],
  ['lampo', [0.85, 0.92, 1, 1], 0, 0.3, [0.75, 0.88, 1]],
  ['crisolito', [0.78, 0.8, 0.18, 1], 0.3, 0.22, [0.2, 0.22, 0.02]],
  ['occhio', [0.96, 0.95, 0.86, 1], 0, 0.3, [0.25, 0.25, 0.2]],
  ['iride', [0.2, 0.42, 0.12, 1], 0.2, 0.25, [0.05, 0.12, 0.02]],
  ['pupilla', [0.02, 0.02, 0.02, 1], 0, 0.15, [0, 0, 0]],
  ['creatura', [0.95, 0.62, 0.25, 1], 0.6, 0.35, [0.45, 0.16, 0.03]],
  ['volto', [0.98, 0.74, 0.36, 1], 0.7, 0.3, [0.35, 0.14, 0.03]],
  ['ali', [0.98, 0.84, 0.55, 1], 0.5, 0.4, [0.3, 0.16, 0.05]],
  ['rame', [0.86, 0.45, 0.24, 1], 1, 0.18, [0.12, 0.04, 0.01]],
  ['ghiaccio', [0.8, 0.93, 1, 0.55], 0, 0.08, [0.03, 0.06, 0.09]],
  ['zaffiro', [0.06, 0.16, 0.62, 1], 0.1, 0.08, [0.01, 0.03, 0.2]],
  ['elettro', [1, 0.86, 0.5, 1], 0.9, 0.2, [0.9, 0.62, 0.2]],
  ['fuoco_trono', [1, 0.55, 0.14, 1], 0, 0.5, [1, 0.45, 0.08]],
  ['iride_1', [0.86, 0.1, 0.12, 1], 0, 0.4, [0.3, 0.02, 0.02]],
  ['iride_2', [0.95, 0.45, 0.08, 1], 0, 0.4, [0.3, 0.12, 0.01]],
  ['iride_3', [0.98, 0.85, 0.12, 1], 0, 0.4, [0.3, 0.25, 0.02]],
  ['iride_4', [0.2, 0.7, 0.25, 1], 0, 0.4, [0.04, 0.22, 0.05]],
  ['iride_5', [0.15, 0.55, 0.9, 1], 0, 0.4, [0.03, 0.14, 0.3]],
  ['iride_6', [0.22, 0.22, 0.7, 1], 0, 0.4, [0.05, 0.05, 0.28]],
  ['iride_7', [0.5, 0.18, 0.7, 1], 0, 0.4, [0.15, 0.04, 0.25]],
];
const materials = palette.map(([name, color, metallic, roughness, emissive]) => ({
  name,
  color,
  metallic,
  roughness,
  emissive,
}));
const prim = (material, solid, crease) => ({
  material,
  geometry: creasedGeometry(meshData(solid), crease),
});
const R = parts.arcobaleno;
const meshes = [
  { name: 'base', primitives: [prim('nube', parts.base.nube, 50)] },
  {
    name: 'fuoco',
    primitives: [
      prim('carboni', parts.fuoco.carboni, 0),
      prim('fuoco', parts.fuoco.fiamme, 50),
      prim('lampo', parts.fuoco.lampi, 20),
    ],
  },
  {
    name: 'ruota',
    primitives: [
      prim('crisolito', parts.ruota.cerchi, 32),
      prim('occhio', parts.ruota.occhi, 32),
      prim('iride', parts.ruota.iridi, 40),
      prim('pupilla', parts.ruota.pupille, 60),
    ],
  },
  ...['a', 'b'].map((set) => ({
    name: `cherubino_${set}`,
    primitives: [
      prim('creatura', cherubShared.corpo, 60),
      prim('volto', cherubShared.testa, 60),
      prim('ali', set === 'a' ? aliA : aliB, 30),
      prim('rame', cherubShared.piedi, 60),
    ],
  })),
  { name: 'distesa', primitives: [prim('ghiaccio', parts.distesa.ghiaccio, 0)] },
  { name: 'trono', primitives: [prim('zaffiro', parts.trono.zaffiro, 20)] },
  {
    name: 'figura',
    primitives: [
      prim('elettro', parts.figura.superiore, 60),
      prim('fuoco_trono', parts.figura.inferiore, 55),
    ],
  },
  {
    name: 'arcobaleno',
    primitives: [
      ...R.bande.map((band, k) => prim(`iride_${R.bande.length - k}`, band, 30)),
      prim('nube', R.nubi, 50),
    ],
  },
];
const instances = [
  { name: 'base', mesh: 'base' },
  { name: 'fuoco', mesh: 'fuoco' },
  ...corners.map((corner, i) => ({ name: `ruota_${i + 1}`, mesh: 'ruota', translation: wheelAt(corner) })),
  ...corners.map((corner, i) => ({
    name: `cherubino_${i + 1}`,
    mesh: `cherubino_${cherubWings(corner)}`,
    translation: cherubAt(corner),
    rotationZDeg: cherubTurn(corner),
  })),
  { name: 'distesa', mesh: 'distesa' },
  { name: 'trono', mesh: 'trono', rotationZDeg: P.throne.turn },
  { name: 'figura', mesh: 'figura', rotationZDeg: P.throne.turn },
  { name: 'arcobaleno', mesh: 'arcobaleno', rotationZDeg: P.throne.turn },
];
const glb = writeGlb({ meshes, materials, instances });
writeFileSync(out + 'carro-celeste.glb', glb);
log(`carro-celeste.glb: ${(glb.length / 1e6).toFixed(2)} MB`);

writeFileSync(out + 'report.json', JSON.stringify(report, null, 2) + '\n');
log('done');
