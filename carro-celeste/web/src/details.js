// The details of the vision, each tied to its verses in Ezekiel 1 and to a point of view.
// Coordinates are model millimetres (Z up); the throne faces -Y. `camera` gives the direction
// to look from; the distance is worked out so that a sphere of `radius` around `target` fits
// in the part of the screen the interface leaves free.
// Texts paraphrase the account; the verse references point to the wording itself.

export const DETAILS = [
  {
    id: 'insieme',
    ref: 'Ezechiele 1:4-28',
    title: 'Il carro celeste',
    text: 'Quattro ruote enormi affiancate da quattro creature viventi. Sopra di loro una distesa che scintilla come ghiaccio e, più in alto, un trono.',
    camera: [-190, -345, 190],
    target: [0, 0, 70],
    radius: 118,
    orbit: true,
  },
  {
    id: 'nuvola',
    ref: 'v. 4',
    title: 'La nuvola e il fuoco',
    text: 'Un vento tempestoso arriva dal nord con una grande nuvola e un fuoco sfavillante; in mezzo al fuoco, qualcosa che splende come elettro.',
    camera: [170, -215, 62],
    target: [0, 0, 20],
    radius: 104,
  },
  {
    id: 'creature',
    ref: 'vv. 5, 6',
    title: 'Le quattro creature viventi',
    text: 'In mezzo al fuoco ci sono quattro creature viventi dall’aspetto umano. Ognuna ha quattro facce e quattro ali.',
    camera: [118, -118, 70],
    target: [0, 0, 38],
    radius: 58,
    hide: ['ruote'],
  },
  {
    id: 'facce',
    ref: 'v. 10',
    title: 'Le quattro facce',
    text: 'Davanti una faccia d’uomo, a destra una faccia di leone, a sinistra una faccia di toro; e ognuna ha anche una faccia d’aquila.',
    camera: [62, -62, 62],
    target: [25, -25, 51],
    radius: 13,
    solo: 'cherubino_4',
    orbit: true,
  },
  {
    id: 'ali',
    ref: 'vv. 9, 11, 23',
    title: 'Le ali che si toccano',
    text: 'Due ali sono spiegate verso l’alto e toccano quelle delle creature vicine, diritte l’una verso l’altra. Le altre due coprono il corpo.',
    camera: [0, -150, 76],
    target: [0, -25, 48],
    radius: 46,
    hide: ['ruote'],
  },
  {
    id: 'mani',
    ref: 'vv. 7, 8',
    title: 'Mani e piedi',
    text: 'Le gambe sono diritte e i piedi, simili a zoccoli di vitello, splendono come rame lucido. Sotto le ali, sui quattro lati, ci sono mani umane.',
    camera: [-22, -66, 44],
    target: [25, -25, 24],
    radius: 30,
    solo: 'cherubino_4',
  },
  {
    id: 'lampi',
    ref: 'vv. 13, 14',
    title: 'Carboni, torce e lampi',
    text: 'Le creature hanno l’aspetto di carboni ardenti. Fra loro si muove qualcosa di simile a torce di fuoco, e dal fuoco si sprigionano lampi.',
    camera: [12, -128, 50],
    target: [0, 0, 24],
    radius: 50,
    hide: ['ruote'],
  },
  {
    id: 'ruote',
    ref: 'vv. 15-17',
    title: 'Una ruota dentro l’altra',
    text: 'Accanto a ogni creatura una ruota poggia a terra e splende come crisolito. Sono due cerchi dello stesso diametro incrociati ad angolo retto: il carro va in ogni direzione senza voltarsi.',
    camera: [175, -160, 78],
    target: [45, -45, 43],
    radius: 52,
  },
  {
    id: 'occhi',
    ref: 'v. 18',
    title: 'Cerchi pieni di occhi',
    text: 'I cerchi hanno un’altezza impressionante e sono pieni di occhi tutt’intorno: al carro non sfugge nulla.',
    camera: [103, -92, 70],
    target: [72, -45, 60],
    radius: 24,
  },
  {
    id: 'distesa',
    ref: 'v. 22',
    title: 'La distesa come ghiaccio',
    text: 'Sopra le teste delle creature si estende una superficie che scintilla come ghiaccio.',
    camera: [-150, -205, 120],
    target: [0, 0, 84],
    radius: 88,
  },
  {
    id: 'trono',
    ref: 'v. 26',
    title: 'Il trono di zaffiro',
    text: 'Al di sopra della distesa c’è qualcosa di simile a pietra di zaffiro che sembra un trono. Vi siede qualcuno che ha l’aspetto di un uomo.',
    camera: [-52, -128, 124],
    target: [0, 2, 108],
    radius: 34,
  },
  {
    id: 'gloria',
    ref: 'vv. 27, 28',
    title: 'Elettro, fuoco e arcobaleno',
    text: 'Dai fianchi in su splende come elettro, dai fianchi in giù come fuoco. Tutt’intorno c’è uno splendore come quello dell’arcobaleno fra le nubi in un giorno di pioggia.',
    camera: [0, -205, 132],
    target: [0, 12, 114],
    radius: 64,
  },
];

// Layers the visitor can switch on and off; `nodes` are name prefixes in the glTF scene.
export const LAYERS = [
  { id: 'base', label: 'Nuvola e terreno', nodes: ['base'] },
  { id: 'fuoco', label: 'Fuoco e lampi', nodes: ['fuoco'] },
  { id: 'creature', label: 'Creature viventi', nodes: ['cherubino'] },
  { id: 'ruote', label: 'Ruote', nodes: ['ruota'] },
  { id: 'distesa', label: 'Distesa', nodes: ['distesa'] },
  { id: 'trono', label: 'Trono', nodes: ['trono'] },
  { id: 'figura', label: 'Figura sul trono', nodes: ['figura'] },
  { id: 'arcobaleno', label: 'Arcobaleno', nodes: ['arcobaleno'] },
];

// How far each part travels in the exploded view, in millimetres.
export const EXPLODE = {
  base: [0, 0, -18],
  fuoco: [0, 0, -18],
  cherubino: [0, 0, -18],
  ruota: 'outward',
  distesa: [0, 0, 34],
  trono: [0, 0, 62],
  figura: [0, 0, 62],
  arcobaleno: [0, 34, 78],
};

export const FILES = [
  {
    path: 'modelli/carro-celeste.stl',
    name: 'carro-celeste.stl',
    label: 'Modello in un pezzo unico',
    kind: 'STL',
  },
  {
    path: 'modelli/kit/1-base-e-creature.stl',
    name: 'kit/1-base-e-creature.stl',
    label: 'Kit 1 · base, fuoco e creature',
    kind: 'STL',
  },
  {
    path: 'modelli/kit/2-ruota-x4.stl',
    name: 'kit/2-ruota-x4.stl',
    label: 'Kit 2 · ruota (4 copie)',
    kind: 'STL',
  },
  { path: 'modelli/kit/3-distesa.stl', name: 'kit/3-distesa.stl', label: 'Kit 3 · distesa', kind: 'STL' },
  { path: 'modelli/kit/4-trono.stl', name: 'kit/4-trono.stl', label: 'Kit 4 · trono', kind: 'STL' },
  {
    path: 'modelli/kit/5-arcobaleno.stl',
    name: 'kit/5-arcobaleno.stl',
    label: 'Kit 5 · arcobaleno',
    kind: 'STL',
  },
  {
    path: 'modelli/carro-celeste.glb',
    name: 'carro-celeste.glb',
    label: 'Modello a colori per web e AR',
    kind: 'GLB',
  },
];

export const README_TXT = `CARRO CELESTE - Ezechiele 1
Modello 3D parametrico, misure in millimetri.

CONTENUTO
  carro-celeste.stl            modello in un pezzo unico (circa 178 x 178 x 146 mm)
  kit/1-base-e-creature.stl    base con nuvola, fuoco e le quattro creature viventi
  kit/2-ruota-x4.stl           una ruota: stamparne 4 copie
  kit/3-distesa.stl            la distesa simile a ghiaccio
  kit/4-trono.stl              trono con la figura seduta
  kit/5-arcobaleno.stl         arcobaleno, gia' coricato sul piatto
  carro-celeste.glb            modello a colori (visualizzatori web, AR)

STAMPA
  Pezzo unico: resina, oppure FDM con supporti ad albero. Strato 0,12-0,16 mm.
  Kit: ogni parte e' orientata per il piatto. Strato 0,12-0,2 mm, ugello 0,4 mm.
       Le ruote si stampano in piedi con supporti solo all'interno dei cerchi.
       La distesa rende bene in PETG o PLA trasparente, il trono in blu.
  Montaggio del kit: le ruote entrano nelle sedi della base, la distesa si appoggia
  sulle ruote, trono e arcobaleno entrano nelle sedi della distesa. Una goccia di
  colla cianoacrilica per ogni sede.
  Il modello si puo' scalare liberamente nello slicer.
`;
