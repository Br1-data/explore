import { type Base, o, serie, taglia } from '@/contenuti/scenografia';

/** Il mondo prima del diluvio è lo stesso del capitolo 1. */
export { mondo } from '../01-enoc/scenari';

/**
 * Scenografie del capitolo 2. Dal testo vengono l’arca di legno resinoso coperta di
 * catrame, con la porta di lato e la luce sotto il tetto (Genesi 6:14-16), le acque che
 * salgono (7:17-20), i monti di Ararat, l’altare (8:4, 20) e l’arcobaleno (9:13).
 * L’immagine del capitolo mostra l’arca in costruzione e la famiglia con un carretto di
 * provviste. L’interno dell’arca è una ricostruzione (vedi i ruoli che lo usano).
 *
 * L’arca ha `id: 'arca'`: l’effetto `oggetto` ne cambia l’aspetto mentre la si costruisce
 * (0 ossatura, 3 tavole, 4 catrame, 1 finita con la porta aperta, 2 chiusa).
 */

/** Il cantiere dell’arca: gli alberi, le tavole pronte, il catrame. */
export function cantiere(larghezza = 2400): Base {
  return taglia(
    {
      larghezza: 2400,
      ambiente: 'giorno',
      seme: 23,
      suono: 'vento',
      oggetti: [
        ...serie('albero', [200, 700, 1700, 2200], { piano: 'fondo', scala: 0.6 }),
        o('albero', 150, { variante: 1, scala: 1.4 }),
        o('albero', 330, { variante: 0, scala: 1.2 }),
        o('tavole', 470),
        o('giare', 560),
        o('arca', 1150, { variante: 0, id: 'arca' }),
        o('fuoco', 1620),
        o('secchio', 1700),
        o('giare', 1790),
        o('albero', 1980, { variante: 0, scala: 1.3 }),
        o('cespuglio', 2200),
        ...serie('roccia', [420, 1860], { piano: 'primo', scala: 1.6 }),
      ],
    },
    larghezza,
  );
}

/** L’arca finita, con la porta aperta e la rampa; la dispensa da cui portare le provviste. */
export function arcaPronta(larghezza = 2200): Base {
  return taglia(
    {
      larghezza: 2200,
      ambiente: 'giorno',
      seme: 27,
      suono: 'vento',
      oggetti: [
        ...serie('albero', [250, 1800], { piano: 'fondo', scala: 0.6 }),
        o('albero', 140, { variante: 2, scala: 1.3 }),
        o('arca', 900, { variante: 1, id: 'arca' }),
        // Le provviste caricate compaiono davanti alla porta.
        o('giare', 1060, { seVar: 'cibo', scala: 0.8 }),
        o('fieno', 1120, { seVar: 'foraggio' }),
        o('pecora', 1240),
        o('pecora', 1300, { variante: 1 }),
        o('uccelli', 1200),
        o('giare', 1500),
        o('fieno', 1620),
        o('recinto', 1720),
        o('cespuglio', 1980),
        ...serie('roccia', [380, 1560], { piano: 'primo', scala: 1.6 }),
      ],
    },
    larghezza,
  );
}

/** Il diluvio: all’inizio la terra è asciutta; con la variabile `livello` l’acqua sale e l’arca galleggia. */
export function diluvio(larghezza = 2000): Base {
  return taglia(
    {
      larghezza: 2000,
      ambiente: 'quiete',
      seme: 41,
      suono: 'vento',
      oggetti: [
        ...serie('albero', [300, 1600], { piano: 'fondo', scala: 0.55 }),
        o('albero', 250, { variante: 1 }),
        o('arca', 1000, { variante: 1, id: 'arca', galleggia: true }),
        o('roccia', 1500),
        o('cespuglio', 1750),
      ],
    },
    larghezza,
  );
}

/** Dentro l’arca: pareti di tavole, recinti, fieno, giare, una lampada a olio (ricostruzione). */
export function arcaDentro(larghezza = 2000): Base {
  return taglia(
    {
      larghezza: 2000,
      ambiente: 'stiva',
      seme: 53,
      suono: 'quiete',
      oggetti: [
        ...serie('stiva', [450, 1350, 1900]),
        o('recinto', 300),
        o('pecora', 280),
        o('pecora', 350, { variante: 1 }),
        o('fieno', 560),
        o('giare', 760),
        o('lampada', 980, { id: 'lampada' }),
        o('secchio', 1150),
        o('recinto', 1450),
        o('pecora', 1430, { variante: 1 }),
        o('giare', 1700),
        o('fieno', 1850),
      ],
    },
    larghezza,
  );
}

/** I monti di Ararat: l’arca ferma, l’altare, e (se c’è) l’arcobaleno nelle nuvole. */
export function ararat(conArcobaleno: boolean, larghezza = 2000): Base {
  return taglia(
    {
      larghezza: 2000,
      ambiente: 'mattino',
      seme: 47,
      suono: 'vento',
      oggetti: [
        ...(conArcobaleno ? [o('arcobaleno', 1150, { piano: 'fondo', scala: 0.8 })] : []),
        ...serie('roccia', [300, 1500, 1850], { piano: 'fondo', scala: 0.8 }),
        o('arca', 520, { variante: 2 }),
        o('roccia', 1000, { scala: 1.4 }),
        o('altare', 1300),
        o('uccelli', 1500),
        o('cespuglio', 1700),
        o('roccia', 1900),
        ...serie('roccia', [880, 1600], { piano: 'primo', scala: 1.6 }),
      ],
    },
    larghezza,
  );
}
