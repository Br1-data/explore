import type { Oggetto, Scena } from '../../tipi';

/**
 * Scenografie condivise dai punti di vista del capitolo.
 * Sono ambientazioni generiche dell’epoca: gli unici elementi presi dal testo
 * sono quelli che Genesi 4:17-22 menziona (città, tende, bestiame, metalli).
 */

type Base = Pick<Scena, 'larghezza' | 'ambiente' | 'seme' | 'oggetti' | 'suono'>;

function o(tipo: string, x: number, extra: Partial<Oggetto> = {}): Oggetto {
  return { tipo, x, ...extra };
}

function serie(tipo: string, xs: number[], extra: Partial<Oggetto> = {}): Oggetto[] {
  return xs.map((x, i) => ({ tipo, x, variante: i % 3, ...extra }));
}

/** Il mondo intorno a Enoc: un insediamento al tramonto. */
export function mondo(): Base {
  return {
    larghezza: 3600,
    ambiente: 'tramonto',
    seme: 11,
    suono: 'folla',
    oggetti: [
      ...serie('casa', [760, 1010, 1260, 1560, 1840, 2120, 2420, 2700, 2960], { piano: 'fondo', scala: 0.62 }),
      ...serie('palma', [900, 1700, 2560], { piano: 'fondo', scala: 0.6 }),
      o('albero', 110, { scala: 1.15 }),
      o('roccia', 250),
      o('cumulo', 380),
      o('cespuglio', 520),
      o('albero', 660, { variante: 1 }),
      o('tenda', 860, { variante: 1 }),
      o('recinto', 1010),
      o('pecora', 990),
      o('pecora', 1045, { variante: 1 }),
      o('casa', 1330, { variante: 1 }),
      o('bancarella', 1500),
      o('incudine', 1640),
      o('fuoco', 1700),
      o('casa', 1860, { variante: 2 }),
      o('palma', 2010),
      o('giare', 2090),
      o('idolo', 2260),
      o('casa', 2500, { variante: 0 }),
      o('tenda', 2740, { variante: 2 }),
      o('albero', 2940, { variante: 2 }),
      o('roccia', 3160),
      o('cipresso', 3320),
      o('cipresso', 3370, { scala: 0.85 }),
      o('albero', 3500, { variante: 1, scala: 1.1 }),
      ...serie('cespuglio', [180, 1080, 1940, 2640, 3260], { piano: 'primo', scala: 1.5 }),
      o('roccia', 1430, { piano: 'primo', scala: 1.6 }),
      o('roccia', 2860, { piano: 'primo', scala: 1.4 }),
    ],
  };
}

/** Lontano dalla folla: colline, la tenda di famiglia, un’altura. */
export function colline(): Base {
  return {
    larghezza: 3400,
    ambiente: 'mattino',
    seme: 23,
    suono: 'vento',
    oggetti: [
      ...serie('albero', [300, 820, 1380, 1900, 2480, 3020], { piano: 'fondo', scala: 0.6 }),
      ...serie('cipresso', [560, 1620, 2760], { piano: 'fondo', scala: 0.6 }),
      o('albero', 150, { variante: 1, scala: 1.1 }),
      o('tenda', 470, { variante: 0, scala: 1.1 }),
      o('fuoco', 610),
      o('giare', 360),
      o('recinto', 760),
      o('pecora', 730),
      o('pecora', 790, { variante: 1 }),
      o('pecora', 850),
      o('albero', 960, { variante: 2 }),
      o('cespuglio', 1120),
      o('campo', 1500),
      o('campo', 1760),
      o('albero', 2040, { variante: 0, scala: 1.25 }),
      o('roccia', 2150, { scala: 1.3 }),
      o('roccia', 2210),
      o('cipresso', 2540),
      o('cipresso', 2590, { scala: 0.8 }),
      o('roccia', 2660),
      o('cespuglio', 2880),
      o('albero', 3160, { variante: 1 }),
      ...serie('cespuglio', [240, 1260, 2330, 3060], { piano: 'primo', scala: 1.5 }),
      o('roccia', 1840, { piano: 'primo', scala: 1.5 }),
    ],
  };
}

/** Un’altura da cui si vede in lontananza l’abitato. */
export function altura(): Base {
  return {
    larghezza: 2600,
    ambiente: 'altura',
    seme: 37,
    suono: 'vento',
    oggetti: [
      ...serie('casa', [1850, 2010, 2160, 2300, 2450], { piano: 'fondo', scala: 0.5 }),
      ...serie('palma', [1940, 2380], { piano: 'fondo', scala: 0.5 }),
      o('roccia', 180, { scala: 1.4 }),
      o('cespuglio', 330),
      o('albero', 470, { variante: 0, scala: 1.2 }),
      o('roccia', 760),
      o('cespuglio', 980),
      o('roccia', 1240, { scala: 1.6 }),
      o('roccia', 1310),
      o('cipresso', 1500),
      o('cespuglio', 1760),
      o('roccia', 2080, { scala: 1.2 }),
      o('albero', 2440, { variante: 2 }),
      ...serie('roccia', [620, 1620, 2260], { piano: 'primo', scala: 1.7 }),
      o('cespuglio', 1080, { piano: 'primo', scala: 1.6 }),
    ],
  };
}

/** La strada affollata dell’immagine d’apertura del capitolo. */
export function strada(): Base {
  return {
    larghezza: 3400,
    ambiente: 'giorno',
    seme: 41,
    suono: 'folla',
    oggetti: [
      ...serie('casa', [520, 760, 1040, 1290, 1560, 1830, 2090, 2360, 2640, 2900, 3140], { piano: 'fondo', scala: 0.66 }),
      ...serie('palma', [660, 1700, 2500], { piano: 'fondo', scala: 0.62 }),
      o('albero', 90, { variante: 1 }),
      o('porta', 330),
      o('casa', 640, { variante: 0 }),
      o('bancarella', 800),
      o('casa', 960, { variante: 1 }),
      o('giare', 1120),
      o('casa', 1290, { variante: 2 }),
      o('bancarella', 1460),
      o('casa', 1640, { variante: 3 }),
      o('torcia', 1790),
      o('casa', 1960, { variante: 0 }),
      o('bancarella', 2130),
      o('casa', 2300, { variante: 1 }),
      o('giare', 2440),
      o('casa', 2620, { variante: 2 }),
      o('torcia', 2790),
      o('casa', 2940, { variante: 3 }),
      o('palma', 3180),
      o('cespuglio', 3300),
      o('giare', 1560, { piano: 'primo', scala: 1.7 }),
      o('giare', 2760, { piano: 'primo', scala: 1.6 }),
      o('cespuglio', 420, { piano: 'primo', scala: 1.5 }),
    ],
  };
}

/** Fuori dall’abitato, di notte. */
export function notte(larghezza = 3200): Base {
  return {
    larghezza,
    ambiente: 'notte',
    seme: 53,
    suono: 'notte',
    oggetti: [
      ...serie('casa', [60, 220, 380], { piano: 'fondo', scala: 0.6 }),
      ...serie('albero', [900, 1500, 2200, 2800], { piano: 'fondo', scala: 0.6, variante: 3 }),
      o('porta', 170),
      o('torcia', 330),
      o('roccia', 520, { scala: 1.3 }),
      o('albero', 700, { variante: 3 }),
      o('cespuglio', 880),
      o('roccia', 1080),
      o('albero', 1280, { variante: 3, scala: 1.2 }),
      o('roccia', 1460, { scala: 1.5 }),
      o('cespuglio', 1660),
      o('cipresso', 1850),
      o('roccia', 2060),
      o('albero', 2280, { variante: 3 }),
      o('cespuglio', 2440),
      o('roccia', 2620, { scala: 1.4 }),
      o('albero', 2860, { variante: 0, scala: 1.25 }),
      o('roccia', 3040),
      ...serie('roccia', [420, 1380, 2360], { piano: 'primo', scala: 1.8 }),
      o('cespuglio', 1960, { piano: 'primo', scala: 1.6 }),
    ].filter((x) => x.x < larghezza),
  };
}

/** Oggetti che compaiono solo durante la visione (variabile «visione»). */
export function paradiso(x0: number, x1: number): Oggetto[] {
  const w = x1 - x0;
  const p = (f: number) => Math.round(x0 + w * f);
  return [
    o('acqua', p(0.42), { seVar: 'visione' }),
    ...[0.08, 0.2, 0.33, 0.62, 0.74, 0.9].map((f) => o('fiori', p(f), { seVar: 'visione' })),
    o('albero', p(0.14), { variante: 4, seVar: 'visione', scala: 1.15 }),
    o('albero', p(0.68), { variante: 4, seVar: 'visione' }),
    o('albero', p(0.95), { variante: 4, seVar: 'visione', scala: 1.2 }),
    o('pecora', p(0.26), { seVar: 'visione' }),
    o('pecora', p(0.3), { variante: 1, seVar: 'visione' }),
    o('uccelli', p(0.5), { seVar: 'visione' }),
    o('uccelli', p(0.82), { seVar: 'visione', variante: 1 }),
  ];
}

/** Un luogo tranquillo, prima dell’alba. */
export function quiete(): Base {
  return {
    larghezza: 2400,
    ambiente: 'quiete',
    seme: 67,
    suono: 'quiete',
    oggetti: [
      ...serie('albero', [240, 760, 1320, 1980], { piano: 'fondo', scala: 0.6 }),
      o('roccia', 140, { scala: 1.3 }),
      o('albero', 330, { variante: 3 }),
      o('cespuglio', 560),
      o('roccia', 800),
      o('cespuglio', 1380),
      o('albero', 1790, { variante: 0, scala: 1.35 }),
      o('roccia', 1900),
      o('cespuglio', 2140),
      o('roccia', 2280, { scala: 1.2 }),
      ...paradiso(350, 2300),
      o('roccia', 980, { piano: 'primo', scala: 1.6 }),
      o('cespuglio', 2060, { piano: 'primo', scala: 1.6 }),
    ],
  };
}

/** La strada degli anni: Genesi 5 percorsa a piedi. */
export function stradaDegliAnni(pietre: { x: number; testo: string }[]): Base {
  return {
    larghezza: 5200,
    ambiente: 'anni',
    seme: 79,
    suono: 'vento',
    oggetti: [
      ...serie('albero', [420, 1180, 1900, 2700, 3500, 4200, 4900], { piano: 'fondo', scala: 0.6 }),
      ...serie('cipresso', [800, 2300, 3900], { piano: 'fondo', scala: 0.6 }),
      o('tenda', 170, { variante: 0, scala: 1.1 }),
      o('giare', 60),
      o('albero', 560, { variante: 1 }),
      o('recinto', 760),
      o('pecora', 740),
      o('pecora', 800, { variante: 1 }),
      o('cespuglio', 1240),
      o('albero', 1380, { variante: 2 }),
      o('roccia', 1840),
      o('campo', 2000),
      o('albero', 2560, { variante: 0, scala: 1.2 }),
      o('cespuglio', 2800),
      o('roccia', 3340),
      o('cipresso', 3560),
      o('albero', 3780, { variante: 1 }),
      o('campo', 3980),
      o('roccia', 4520),
      o('albero', 4640, { variante: 3 }),
      o('cespuglio', 5020),
      ...pietre.map((p) => o('stele', p.x + 46, { testo: p.testo })),
      ...serie('cespuglio', [320, 1560, 2960, 4100], { piano: 'primo', scala: 1.5 }),
      o('roccia', 2240, { piano: 'primo', scala: 1.6 }),
      o('roccia', 4760, { piano: 'primo', scala: 1.5 }),
    ],
  };
}
