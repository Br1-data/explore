import { type Base, o, serie, taglia } from '@/contenuti/scenografia';

/** Il mondo prima del diluvio è lo stesso del capitolo 1. */
export { mondo } from '../01-enoc/scenari';

/**
 * Scenografie del capitolo 2. Dal testo vengono l’arca di legno resinoso coperta di
 * catrame, con la porta di lato (Genesi 6:14-16), l’acqua che copre i monti (7:19, 20),
 * i monti di Ararat, l’altare (8:4, 20) e l’arcobaleno (9:13). L’immagine del capitolo
 * mostra l’arca in costruzione e la famiglia con un carretto di provviste.
 */

/** Il cantiere dell’arca, tra gli alberi da cui viene il legno. */
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
        o('roccia', 330),
        o('giare', 500),
        o('arca', 1150, { variante: 0 }),
        o('fuoco', 1600),
        o('giare', 1720),
        o('albero', 1950, { variante: 0, scala: 1.3 }),
        o('cespuglio', 2200),
        ...serie('roccia', [420, 1820], { piano: 'primo', scala: 1.6 }),
      ],
    },
    larghezza,
  );
}

/** L’arca finita, con la porta aperta e la rampa: arrivano gli animali. */
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
        o('arca', 900, { variante: 1 }),
        o('pecora', 1240),
        o('pecora', 1300, { variante: 1 }),
        o('uccelli', 1200),
        o('giare', 1450),
        o('recinto', 1650),
        o('cespuglio', 1980),
        ...serie('roccia', [380, 1560], { piano: 'primo', scala: 1.6 }),
      ],
    },
    larghezza,
  );
}

/** Il diluvio: l’arca chiusa galleggia sulle acque. */
export function diluvio(larghezza = 2000): Base {
  return taglia(
    {
      larghezza: 2000,
      ambiente: 'quiete',
      seme: 41,
      suono: 'pioggia',
      oggetti: [o('arca', 1000, { variante: 2 }), ...serie('acqua', [150, 450, 750, 1050, 1350, 1650, 1900])],
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
