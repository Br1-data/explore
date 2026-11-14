// Development aid: triangle counts and connectivity of every part.
import { union } from '../src/lib/kernel.mjs';
import { base } from '../src/parts/base.mjs';
import { cherubino } from '../src/parts/cherubino.mjs';
import { distesa } from '../src/parts/distesa.mjs';
import { fuoco } from '../src/parts/fuoco.mjs';
import { ruota } from '../src/parts/ruota.mjs';
import { arcobaleno, figura, trono } from '../src/parts/trono.mjs';

const show = (name, solid) => {
  const pieces = solid.decompose();
  const box = solid.boundingBox();
  console.log(
    name.padEnd(22),
    String(solid.numTri()).padStart(7),
    'tri',
    `${pieces.length} pcs`,
    'z',
    box.min[2].toFixed(1),
    box.max[2].toFixed(1),
    'genus',
    solid.genus(),
  );
  if (pieces.length > 1 && pieces.length < 40) {
    for (const p of pieces) {
      const b = p.boundingBox();
      if (p.volume() < 5)
        console.log(
          '    small piece vol',
          p.volume().toFixed(3),
          'at',
          b.min.map((v) => v.toFixed(1)).join(','),
          '->',
          b.max.map((v) => v.toFixed(1)).join(','),
        );
    }
  }
};
const groups = {
  base: { nube: base() },
  fuoco: fuoco(),
  ruota: ruota(),
  cherubino: cherubino({ edge: 0.3 }),
  distesa: { ghiaccio: distesa() },
  trono: { zaffiro: trono() },
  figura: figura({ edge: 0.3 }),
};
delete groups.cherubino.info;
delete groups.cherubino.aliB;
const rainbow = arcobaleno();
groups.arcobaleno = { bande: union(rainbow.bande), nubi: rainbow.nubi };
for (const [group, members] of Object.entries(groups)) {
  for (const [name, solid] of Object.entries(members)) show(`${group}.${name}`, solid);
  show(`${group} (union)`, union(Object.values(members)));
}
