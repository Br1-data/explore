import { gradino, interpola, mescola } from './util';

/** Colori e forma del terreno di un ambiente. */
export interface Tavolozza {
  cielo: [string, string, string];
  astro: { x: number; y: number; r: number; colore: string; alone: string };
  stelle: number;
  nuvole: string;
  monti: [string, string, string];
  nebbia: string;
  terra: [string, string];
  sentiero: string;
  erba: string;
  foglia: [string, string];
  fiore: string;
  tronco: string;
  muro: [string, string];
  tela: [string, string, string];
  /** Colore e intensità del velo che l’ora del giorno stende su figure e oggetti. */
  velo: [string, number];
  /** Ampiezza delle ondulazioni del terreno. */
  rilievo: number;
}

const TAVOLOZZE: Record<string, Tavolozza> = {
  tramonto: {
    cielo: ['#2a2a58', '#93506c', '#f4a95e'],
    astro: { x: 0.7, y: 338, r: 44, colore: '#ffe0aa', alone: '#ffb066' },
    stelle: 0.3,
    nuvole: '#f7b98c',
    monti: ['#77577f', '#5c4270', '#44315a'],
    nebbia: '#f1a172',
    terra: ['#5e4340', '#2c2030'],
    sentiero: '#93705a',
    erba: '#55513d',
    foglia: ['#59603e', '#353c2f'],
    fiore: '#e8a070',
    tronco: '#3a2a2a',
    muro: ['#b58866', '#7c5848'],
    tela: ['#a8604b', '#8f7c5a', '#6c5b70'],
    velo: ['#5a3050', 0.22],
    rilievo: 7,
  },
  mattino: {
    cielo: ['#6aa5d8', '#b8d9ea', '#fbe7c9'],
    astro: { x: 0.2, y: 150, r: 38, colore: '#fff7da', alone: '#ffe9a6' },
    stelle: 0,
    nuvole: '#ffffff',
    monti: ['#a3bace', '#88a7b2', '#70948a'],
    nebbia: '#f5ead4',
    terra: ['#8d8d54', '#5c5a3a'],
    sentiero: '#d2bd8e',
    erba: '#7a944c',
    foglia: ['#72994a', '#48693a'],
    fiore: '#f2d06a',
    tronco: '#5a4634',
    muro: ['#d4b68c', '#a48460'],
    tela: ['#c9a76c', '#b5614b', '#7e8d8d'],
    velo: ['#ffffff', 0],
    rilievo: 16,
  },
  altura: {
    cielo: ['#48699d', '#e2b68e', '#ffe8b2'],
    astro: { x: 0.8, y: 312, r: 52, colore: '#fff4c8', alone: '#ffd27a' },
    stelle: 0.12,
    nuvole: '#ffe2bd',
    monti: ['#a48ea4', '#8c7a92', '#6e6582'],
    nebbia: '#ffe1aa',
    terra: ['#9c7f5a', '#584436'],
    sentiero: '#dcc090',
    erba: '#8f8c52',
    foglia: ['#7c8c4a', '#506038'],
    fiore: '#f0c070',
    tronco: '#4f3d30',
    muro: ['#dab98e', '#a98764'],
    tela: ['#c9a76c', '#b5614b', '#7e8d8d'],
    velo: ['#ffb060', 0.08],
    rilievo: 9,
  },
  giorno: {
    cielo: ['#4d8dd0', '#a7cfea', '#f3e4c2'],
    astro: { x: 0.5, y: 86, r: 34, colore: '#fffbe9', alone: '#fff0b4' },
    stelle: 0,
    nuvole: '#ffffff',
    monti: ['#c3b79d', '#af9f82', '#99886c'],
    nebbia: '#f1e0bc',
    terra: ['#c4a270', '#8b6b49'],
    sentiero: '#e3cb9b',
    erba: '#a3935a',
    foglia: ['#7f934a', '#57693a'],
    fiore: '#e8c060',
    tronco: '#5e4a36',
    muro: ['#dec298', '#b18b63'],
    tela: ['#c1563f', '#d7b46b', '#607f90'],
    velo: ['#ffffff', 0],
    rilievo: 3,
  },
  notte: {
    cielo: ['#0a0f25', '#192047', '#33355d'],
    astro: { x: 0.76, y: 118, r: 28, colore: '#f3f1e2', alone: '#9db0e2' },
    stelle: 1,
    nuvole: '#3a4270',
    monti: ['#242b53', '#1b2146', '#141a39'],
    nebbia: '#3b3d69',
    terra: ['#2b2e46', '#11132a'],
    sentiero: '#474a6a',
    erba: '#2b3142',
    foglia: ['#2b394a', '#1a2435'],
    fiore: '#5a6088',
    tronco: '#161a29',
    muro: ['#4b4b6c', '#2e2e4b'],
    tela: ['#4a3a50', '#44465a', '#3a3c58'],
    velo: ['#141c4a', 0.56],
    rilievo: 11,
  },
  quiete: {
    cielo: ['#25305c', '#6b6a97', '#e2aa92'],
    astro: { x: 0.84, y: 344, r: 40, colore: '#ffdaba', alone: '#f0a080' },
    stelle: 0.55,
    nuvole: '#b890a0',
    monti: ['#505783', '#434a75', '#363c63'],
    nebbia: '#c99b95',
    terra: ['#4b4b60', '#252738'],
    sentiero: '#706c85',
    erba: '#404b52',
    foglia: ['#405752', '#28383b'],
    fiore: '#9a88a8',
    tronco: '#22242f',
    muro: ['#77708c', '#4c4862'],
    tela: ['#6a5a70', '#5c5e72', '#4a4c68'],
    velo: ['#2a3470', 0.36],
    rilievo: 9,
  },
  paradiso: {
    cielo: ['#56aee8', '#b7e3f4', '#fff3ce'],
    astro: { x: 0.3, y: 128, r: 46, colore: '#fffbe2', alone: '#ffeeaa' },
    stelle: 0,
    nuvole: '#ffffff',
    monti: ['#9dc9c1', '#80b99b', '#60a979'],
    nebbia: '#fdf4d2',
    terra: ['#70af4f', '#3f7a3a'],
    sentiero: '#dacd8e',
    erba: '#60af49',
    foglia: ['#59b149', '#307b3a'],
    fiore: '#ff8fa8',
    tronco: '#6a4a30',
    muro: ['#d4b68c', '#a48460'],
    tela: ['#c9a76c', '#b5614b', '#7e8d8d'],
    velo: ['#ffffff', 0],
    rilievo: 9,
  },
  anni: {
    cielo: ['#86a3b6', '#d7d3bf', '#f5e5c6'],
    astro: { x: 0.62, y: 118, r: 36, colore: '#fff7de', alone: '#ffe9b0' },
    stelle: 0,
    nuvole: '#fffaf0',
    monti: ['#b2b29e', '#9d9d85', '#87896d'],
    nebbia: '#f3e7ce',
    terra: ['#a29262', '#685a3c'],
    sentiero: '#dac89c',
    erba: '#8c915a',
    foglia: ['#7f9152', '#576941'],
    fiore: '#e8c878',
    tronco: '#57452f',
    muro: ['#d0b48a', '#a08260'],
    tela: ['#c4a26a', '#a8604b', '#7a8a86'],
    velo: ['#d8c090', 0.08],
    rilievo: 9,
  },
};

export function tavolozza(id: string): Tavolozza {
  const t = TAVOLOZZE[id];
  if (!t) throw new Error(`Ambiente sconosciuto: ${id}`);
  return t;
}

export const AMBIENTI = Object.keys(TAVOLOZZE);

const tre = (a: [string, string, string], b: [string, string, string], t: number): [string, string, string] => [
  mescola(a[0], b[0], t),
  mescola(a[1], b[1], t),
  mescola(a[2], b[2], t),
];

/** Sfuma da una tavolozza all’altra (usato per la visione). */
export function sfuma(a: Tavolozza, b: Tavolozza, t: number): Tavolozza {
  if (t <= 0) return a;
  if (t >= 1) return b;
  return {
    cielo: tre(a.cielo, b.cielo, t),
    astro: {
      x: interpola(a.astro.x, b.astro.x, t),
      y: interpola(a.astro.y, b.astro.y, t),
      r: interpola(a.astro.r, b.astro.r, t),
      colore: mescola(a.astro.colore, b.astro.colore, t),
      alone: mescola(a.astro.alone, b.astro.alone, t),
    },
    stelle: interpola(a.stelle, b.stelle, t),
    nuvole: mescola(a.nuvole, b.nuvole, t),
    monti: tre(a.monti, b.monti, t),
    nebbia: mescola(a.nebbia, b.nebbia, t),
    terra: [mescola(a.terra[0], b.terra[0], t), mescola(a.terra[1], b.terra[1], t)],
    sentiero: mescola(a.sentiero, b.sentiero, t),
    erba: mescola(a.erba, b.erba, t),
    foglia: [mescola(a.foglia[0], b.foglia[0], t), mescola(a.foglia[1], b.foglia[1], t)],
    fiore: mescola(a.fiore, b.fiore, t),
    tronco: mescola(a.tronco, b.tronco, t),
    muro: [mescola(a.muro[0], b.muro[0], t), mescola(a.muro[1], b.muro[1], t)],
    tela: tre(a.tela, b.tela, t),
    velo: [mescola(a.velo[0], b.velo[0], t), interpola(a.velo[1], b.velo[1], t)],
    rilievo: interpola(a.rilievo, b.rilievo, t),
  };
}

const BASE_TERRENO = 420;

/** Profili del terreno propri di alcuni ambienti. */
function profilo(ambiente: string, x: number, larghezza: number): number {
  switch (ambiente) {
    case 'altura':
      return -78 * gradino(0, 560, x) * (1 - 0.8 * gradino(larghezza - 760, larghezza - 60, x));
    case 'mattino':
      return -46 * Math.exp(-(((x - 2080) / 380) ** 2));
    default:
      return 0;
  }
}

/** Quota del terreno (coordinate logiche, y verso il basso) in un punto della scena. */
export function quota(ambiente: string, rilievo: number, seme: number, larghezza: number, x: number): number {
  const s = seme * 0.37;
  const onde =
    Math.sin(x / 260 + s) * 0.6 + Math.sin(x / 97 + s * 2.1) * 0.27 + Math.sin(x / 41 + s * 3.3) * 0.13;
  return BASE_TERRENO + onde * rilievo + profilo(ambiente, x, larghezza);
}
