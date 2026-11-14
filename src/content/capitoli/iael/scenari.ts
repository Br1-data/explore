import { type Base, o, serie, taglia } from '../../scenografia';

/**
 * Scenografie del capitolo 17. Dal testo vengono le tende di Heber vicino al grande
 * albero di Zaanannim (Giudici 4:11), l’otre, la coppa, il martello e il piolo
 * (4:19, 21; 5:25), i carri con le falci di ferro, il torrente Chison e il monte
 * Tabor (4:13-15; 5:21), la finestra con la grata (5:28). Il resto è ambientazione.
 */

/** L’accampamento di Heber: alcune tende vicino a un grande albero, la tenda di Iael. */
export function accampamento(larghezza = 2400): Base {
  return taglia(
    {
      larghezza: 2400,
      ambiente: 'giorno',
      seme: 17,
      suono: 'vento',
      oggetti: [
        ...serie('albero', [300, 900, 1500, 2100], { piano: 'fondo', scala: 0.6 }),
        ...serie('casa', [1650, 1780, 1900], { piano: 'fondo', scala: 0.45 }),
        o('cespuglio', 140),
        o('albero', 420, { variante: 0, scala: 1.75 }),
        o('roccia', 600),
        o('tenda', 820, { variante: 1 }),
        o('giare', 940),
        o('recinto', 1080),
        o('pecora', 1050),
        o('pecora', 1110, { variante: 1 }),
        o('tenda', 1270, { variante: 2 }),
        o('fuoco', 1430),
        o('otre', 1520),
        o('tendone', 1820),
        o('martello', 1700),
        o('cespuglio', 2120),
        o('tenda', 2260, { variante: 0 }),
        ...serie('cespuglio', [260, 1180, 2000], { piano: 'primo', scala: 1.5 }),
        o('roccia', 1560, { piano: 'primo', scala: 1.5 }),
      ],
    },
    larghezza,
  );
}

/** Dentro la tenda di Iael. */
export function tendaIael(larghezza = 1500): Base {
  return taglia(
    {
      larghezza: 1500,
      ambiente: 'giorno',
      seme: 19,
      suono: 'quiete',
      oggetti: [
        ...serie('albero', [200, 700, 1250], { piano: 'fondo', scala: 0.6 }),
        o('albero', 120, { variante: 0, scala: 1.5 }),
        o('tenda', 290, { variante: 2 }),
        o('tendone', 760),
        o('martello', 585),
        o('otre', 650),
        o('coppa', 720),
        o('fuoco', 1110),
        o('tenda', 1290, { variante: 1 }),
        o('cespuglio', 1440, { piano: 'primo', scala: 1.5 }),
        o('roccia', 380, { piano: 'primo', scala: 1.4 }),
      ],
    },
    larghezza,
  );
}

/** La pianura del Chison, sotto il monte Tabor. Fango e acqua compaiono con la pioggia. */
export function pianura(larghezza = 2800): Base {
  return taglia(
    {
      larghezza: 2800,
      ambiente: 'giorno',
      seme: 29,
      suono: 'vento',
      oggetti: [
        o('tabor', 520, { piano: 'fondo' }),
        ...serie('albero', [1300, 1900, 2500], { piano: 'fondo', scala: 0.55 }),
        o('roccia', 160, { scala: 1.4 }),
        o('cespuglio', 330),
        o('albero', 520, { variante: 2 }),
        o('cespuglio', 760),
        o('carro', 1180),
        o('fango', 1300, { seVar: 'pioggia' }),
        o('carro', 1480, { variante: 1 }),
        o('carro', 1760),
        o('fango', 1880, { seVar: 'pioggia' }),
        o('carro', 2020, { variante: 1 }),
        o('acqua', 2400, { seVar: 'pioggia' }),
        o('roccia', 2640),
        ...serie('cespuglio', [420, 1640, 2300], { piano: 'primo', scala: 1.5 }),
        o('roccia', 980, { piano: 'primo', scala: 1.6 }),
      ],
    },
    larghezza,
  );
}

/** Un villaggio di Israele sotto l’oppressione: case vuote, un idolo, una porta. */
export function villaggio(larghezza = 2400): Base {
  return taglia(
    {
      larghezza: 2400,
      ambiente: 'quiete',
      seme: 31,
      suono: 'vento',
      oggetti: [
        ...serie('albero', [200, 760, 1400, 2000], { piano: 'fondo', scala: 0.6 }),
        o('porta', 330),
        o('casa', 640, { variante: 0 }),
        o('casa', 860, { variante: 2 }),
        o('campo', 1100),
        o('idolo', 1360),
        o('casa', 1560, { variante: 1 }),
        o('giare', 1700),
        o('casa', 1860, { variante: 3 }),
        o('albero', 2120, { variante: 3 }),
        o('roccia', 2280),
        ...serie('cespuglio', [500, 1250, 2050], { piano: 'primo', scala: 1.5 }),
      ],
    },
    larghezza,
  );
}

/** Dove si canta la vittoria, con il Tabor sullo sfondo. */
export function festa(larghezza = 2000): Base {
  return taglia(
    {
      larghezza: 2000,
      ambiente: 'giorno',
      seme: 43,
      suono: 'folla',
      oggetti: [
        o('tabor', 1100, { piano: 'fondo' }),
        ...serie('palma', [300, 1500], { piano: 'fondo', scala: 0.6 }),
        o('palma', 180),
        o('roccia', 420),
        o('cespuglio', 760),
        o('palma', 1260),
        o('giare', 1400),
        o('albero', 1700, { variante: 0, scala: 1.2 }),
        o('roccia', 1880),
        ...serie('cespuglio', [600, 1560], { piano: 'primo', scala: 1.5 }),
      ],
    },
    larghezza,
  );
}

/** La casa di Sisera ad Aroset, al tramonto: una sala con la finestra a grata. */
export function casaSisera(larghezza = 1700): Base {
  return taglia(
    {
      larghezza: 1700,
      ambiente: 'tramonto',
      seme: 47,
      suono: 'quiete',
      oggetti: [
        ...serie('casa', [200, 420, 1300, 1500], { piano: 'fondo', scala: 0.55 }),
        o('palma', 180),
        o('casa', 330, { variante: 3 }),
        o('sala', 820),
        o('palma', 1260),
        o('porta', 1480),
        o('giare', 1620),
        o('cespuglio', 140, { piano: 'primo', scala: 1.4 }),
      ],
    },
    larghezza,
  );
}
