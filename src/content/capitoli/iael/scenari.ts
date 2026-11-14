import { type Base, o, serie, taglia } from '../../scenografia';

/** La festa del canto è la stessa del capitolo 16. */
export { festa } from '../barac/scenari';

/**
 * Scenografie del capitolo 17. Dal testo vengono le tende di Heber vicino al grande
 * albero di Zaanannim (Giudici 4:11), l’otre, la coppa, il martello e il piolo
 * (4:19, 21; 5:25), la finestra con la grata (5:28). Il resto è ambientazione.
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
