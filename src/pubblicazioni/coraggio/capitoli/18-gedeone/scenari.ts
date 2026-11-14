import { type Base, o, serie, taglia } from '@/contenuti/scenografia';

/** Succot, dove ai 300 fu negato il pane, è un villaggio come quelli del capitolo 16. */
export { villaggio } from '../16-barac-debora/scenari';

/**
 * Scenografie del capitolo 18. Dal testo vengono il grande albero di Ofra, il torchio
 * per il vino e la grande roccia (Giudici 6:11, 20, 21), l’altare di Baal (6:25), la
 * sorgente di Harod e il colle di More (7:1), l’accampamento nella pianura (7:12).
 */

/** Ofra: il grande albero di Ioas, il torchio scavato nella roccia, la casa. */
export function ofra(notte: boolean, larghezza = 2200): Base {
  return taglia(
    {
      larghezza: 2200,
      ambiente: notte ? 'notte' : 'giorno',
      seme: 61,
      suono: notte ? 'notte' : 'vento',
      oggetti: [
        ...serie('casa', [300, 1800, 2000], { piano: 'fondo', scala: 0.5 }),
        o('campo', 260),
        o('albero', 620, { variante: 0, scala: 1.8 }),
        o('roccia', 900, { scala: 1.9 }),
        o('giare', 1020),
        o('casa', 1350, { variante: 1 }),
        o('idolo', 1650),
        o('roccia', 1750),
        o('cespuglio', 2050),
        ...serie('cespuglio', [480, 1500], { piano: 'primo', scala: 1.5 }),
      ],
    },
    larghezza,
  );
}

/** La sorgente di Harod; a nord, il colle di More e la pianura. */
export function harod(larghezza = 2200): Base {
  return taglia(
    {
      larghezza: 2200,
      ambiente: 'giorno',
      seme: 67,
      suono: 'vento',
      oggetti: [
        o('tabor', 1500, { piano: 'fondo', scala: 0.8 }),
        ...serie('albero', [300, 900], { piano: 'fondo', scala: 0.55 }),
        o('roccia', 200, { scala: 1.4 }),
        o('albero', 450, { variante: 1 }),
        o('acqua', 1000),
        o('acqua', 1200),
        o('roccia', 1450),
        o('cespuglio', 1800),
        ...serie('roccia', [700, 1650], { piano: 'primo', scala: 1.6 }),
      ],
    },
    larghezza,
  );
}

/** L’accampamento di Madian nella pianura, di notte: tende a perdita d’occhio. */
export function campoMadian(larghezza = 2400): Base {
  return taglia(
    {
      larghezza: 2400,
      ambiente: 'notte',
      seme: 71,
      suono: 'notte',
      oggetti: [
        ...serie('tenda', [200, 500, 800, 1100, 1400, 1700, 2000, 2250], { piano: 'fondo', scala: 0.5 }),
        o('tenda', 400, { variante: 1 }),
        o('fuoco', 650),
        o('tenda', 900, { variante: 2 }),
        o('tenda', 1350, { variante: 0 }),
        o('fuoco', 1600),
        o('tenda', 1900, { variante: 1 }),
        o('giare', 2150),
      ],
    },
    larghezza,
  );
}
