import { type Base, o, serie, taglia } from '@/contenuti/scenografia';

/**
 * Scenografie del capitolo 16, usate anche dal 17 (la festa del canto). Dal testo
 * vengono la palma di Debora fra Rama e Betel (Giudici 4:5), il monte Tabor e il
 * torrente Chison, i carri con le falci di ferro (4:6, 13-15; 5:21), i villaggi
 * spopolati (5:6, 7). L’immagine del capitolo mostra dal Tabor l’esercito di Sisera
 * che avanza con i carri. Il resto è ambientazione.
 */

/** La palma di Debora, nella regione montuosa di Efraim; in lontananza Rama e Betel. */
export function palma(larghezza = 2000): Base {
  return taglia(
    {
      larghezza: 2000,
      ambiente: 'mattino',
      seme: 53,
      suono: 'vento',
      oggetti: [
        ...serie('casa', [240, 380, 1660, 1800], { piano: 'fondo', scala: 0.45 }),
        ...serie('albero', [700, 1250], { piano: 'fondo', scala: 0.55 }),
        o('roccia', 150, { scala: 1.3 }),
        o('cespuglio', 420),
        o('palma', 880, { scala: 1.6 }),
        o('roccia', 1000),
        o('pecora', 1180),
        o('pecora', 1240, { variante: 1 }),
        o('albero', 1520, { variante: 1 }),
        o('cespuglio', 1760),
        ...serie('roccia', [560, 1400], { piano: 'primo', scala: 1.6 }),
      ],
    },
    larghezza,
  );
}

/**
 * Chedes, nella regione montuosa di Neftali (Giosuè 20:7), su un’altura che dà su una
 * piccola pianura fertile (Perspicacia «Chedes»): la città dove Barac convoca i suoi uomini.
 */
export function chedes(larghezza = 2000): Base {
  return taglia(
    {
      larghezza: 2000,
      ambiente: 'mattino',
      seme: 61,
      suono: 'vento',
      oggetti: [
        ...serie('casa', [180, 330, 480], { piano: 'fondo', scala: 0.5 }),
        ...serie('albero', [900, 1500], { piano: 'fondo', scala: 0.55 }),
        o('casa', 200, { variante: 0 }),
        o('casa', 400, { variante: 2 }),
        o('giare', 520),
        o('porta', 680),
        o('campo', 1400),
        o('albero', 1760, { variante: 1 }),
        o('roccia', 1900),
        ...serie('cespuglio', [820, 1620], { piano: 'primo', scala: 1.5 }),
      ],
    },
    larghezza,
  );
}

/** La cima del Tabor: in basso, lontano, la pianura con i carri di Sisera. */
export function cimaTabor(larghezza = 2200): Base {
  return taglia(
    {
      larghezza: 2200,
      ambiente: 'giorno',
      seme: 59,
      suono: 'vento',
      oggetti: [
        ...serie('carro', [1240, 1340, 1440, 1540, 1640, 1740, 1840], { piano: 'fondo', scala: 0.42 }),
        ...serie('albero', [300, 900], { piano: 'fondo', scala: 0.5 }),
        o('roccia', 140, { scala: 1.5 }),
        o('albero', 330, { variante: 0, scala: 1.3 }),
        o('cespuglio', 560),
        o('roccia', 820, { scala: 1.2 }),
        o('cespuglio', 1080),
        o('roccia', 1500),
        o('albero', 1850, { variante: 2 }),
        o('roccia', 2060, { scala: 1.4 }),
        ...serie('roccia', [480, 1300], { piano: 'primo', scala: 1.7 }),
        o('cespuglio', 1700, { piano: 'primo', scala: 1.5 }),
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
