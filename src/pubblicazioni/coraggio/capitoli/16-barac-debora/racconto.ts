import type { Attore, Fx, Passo, Scena } from '@/contenuti/tipi';
import { PAROLE } from './base';
import { chedes, cimaTabor, festa, palma, pianura } from './scenari';

/**
 * Il racconto del capitolo 16, uguale per tutti i punti di vista: le stesse scene, le
 * stesse voci, gli stessi gesti. Ogni ruolo ci mette il suo ingresso, i suoi punti e i
 * suoi dettagli (decisione 8). `io` è il personaggio impersonato: il suo attore non
 * compare, perché lo muove chi gioca, e le sue parole le dice il giocatore.
 */

export type Palco = Omit<Scena, 'id' | 'titolo' | 'luogo' | 'punti' | 'ingresso'>;

const fx = (f: Fx): Passo => ({ t: 'fx', fx: f });
const dice = (chi: string, testo: string, dur = 4.5): Passo => fx({ k: 'nastro', chi, testo, dur });
const attendi = (dur: number): Passo => fx({ k: 'attendi', dur });
const presenti = (io: string, lista: Attore[]): Attore[] => lista.filter((a) => a.id !== io);
const chi = (io: string, id: string): string => (io === id ? 'giocatore' : id);
const va = (io: string, id: string, x: number, vel = 110, aspetta = false): Passo[] =>
  io === id ? [] : [fx({ k: 'vai', chi: id, x, vel, attendi: aspetta })];

// ——— Sotto la palma di Debora (Giudici 4:4-9) ———

/** Debora siede sotto la palma (4:5); chi viene per il giudizio; Barac che arriva. */
export function palcoPalma(io: string): Palco {
  return {
    ...palma(2000),
    folle: [
      { x0: 1080, x1: 1150, n: 2, seme: 101 },
      { x0: 1400, x1: 1700, n: 2, seme: 103, donne: 0.5, comportamento: 'vaga' },
    ],
    attori: presenti(io, [
      { id: 'debora', x: 880, stile: 'debora', verso: 1, posa: 'seduto' },
      { id: 'barac', x: 1980, stile: 'barac', verso: -1 },
    ]),
  };
}

export const PALMA = {
  /** Debora lo manda a chiamare (4:6). */
  arriva: (io: string): Passo[] => va(io, 'barac', 1080, 150, true),
  comando: (io: string): Passo[] => [dice(chi(io, 'debora'), PAROLE.comando, 5.5), dice(chi(io, 'debora'), PAROLE.promessa, 5.5)],
  condizione: (io: string): Passo[] => [dice(chi(io, 'barac'), PAROLE.condizione, 4.5)],
  verro: (io: string): Passo[] => [dice(chi(io, 'debora'), PAROLE.verro, 3)],
};

// ——— A Chedes: la convocazione (4:9, 10) ———

/** Gli stessi uomini, prima disarmati e poi con le armi che Barac riesce a dar loro. */
export function palcoChedes(io: string): Palco {
  const uomini = { x0: 1080, x1: 1700, n: 16, seme: 131, comportamento: 'fermo' as const };
  return {
    ...chedes(2000),
    vars: { radunati: 0, armati: 0 },
    folle: [
      { ...uomini, seVar: 'radunati' },
      { ...uomini, armati: 0.6, seVar: 'armati' },
    ],
    attori: presenti(io, [
      { id: 'debora', x: 600, stile: 'debora', verso: 1 },
      { id: 'barac', x: 900, stile: 'barac', verso: 1 },
    ]),
  };
}

export const CHEDES = {
  /** Zabulon e Neftali rispondono: 10.000 uomini (4:10). */
  convoca: (): Passo[] => [fx({ k: 'var', nome: 'radunati', a: 1, dur: 4 }), attendi(2)],
  /** Barac li arma come meglio può (libro, cap. 16). */
  arma: (io: string): Passo[] => [
    ...va(io, 'barac', 1250, 110, true),
    fx({ k: 'var', nome: 'armati', a: 1, dur: 2 }),
    fx({ k: 'var', nome: 'radunati', a: 0, dur: 0 }),
  ],
};

// ——— Sul monte Tabor (4:12-14) ———

export function palcoTabor(io: string): Palco {
  return {
    ...cimaTabor(2200),
    folle: [
      { x0: 820, x1: 1260, n: 14, seme: 111, armati: 0.3, comportamento: 'vaga' },
      { x0: 1250, x1: 1900, n: 16, seme: 113, armati: 0.9, piano: 'fondo', comportamento: 'vaga' },
    ],
    attori: presenti(io, [
      { id: 'barac', x: 520, stile: 'barac', verso: 1 },
      { id: 'debora', x: 700, stile: 'debora', verso: -1 },
    ]),
  };
}

export const TABOR = {
  /** «Va’, perché questo è il giorno…» (4:14). */
  segnale: (io: string): Passo[] => [dice(chi(io, 'debora'), PAROLE.va, 4.5), dice(chi(io, 'debora'), PAROLE.davanti, 3.5)],
  /** Barac scende dal Tabor alla testa dei 10.000 (4:14). */
  scende: (io: string): Passo[] => va(io, 'barac', 2140, 160),
};

// ——— Nella pianura del Chison (4:15, 16; 5:20, 21) ———

/** La pianura: la pioggia arriva quando Geova getta nello scompiglio l’esercito di Sisera. */
export function palcoPianura(): Palco {
  return { ...pianura(2800), vars: { pioggia: 0 } };
}

export const PIANURA = {
  scompiglio: (): Passo[] => [fx({ k: 'var', nome: 'pioggia', a: 1, dur: 3 })],
};

// ——— Il canto di vittoria (5:1-23) ———

export function palcoCanto(io: string): Palco {
  return {
    ...festa(2000),
    folle: [
      { x0: 760, x1: 1000, n: 7, seme: 91, donne: 0.7, gruppo: 'danza' },
      { x0: 1100, x1: 1650, n: 9, seme: 93, donne: 0.4, bimbi: 0.2, comportamento: 'vaga' },
      { x0: 300, x1: 1900, n: 12, seme: 95, piano: 'fondo', comportamento: 'vaga' },
    ],
    attori: presenti(io, [
      { id: 'debora', x: 400, stile: 'debora', verso: 1 },
      { id: 'barac', x: 480, stile: 'barac', verso: -1 },
    ]),
  };
}

export const CANTO = {
  /** «Quel giorno Debora intonò questo canto insieme a Bàrac» (5:1-3). */
  intona: (io: string): Passo[] => [
    fx({ k: 'posa', chi: chi(io, 'barac'), posa: 'alza' }),
    dice(chi(io, 'debora'), PAROLE.lodate, 5.5),
    dice(chi(io, 'barac'), PAROLE.ascoltate, 3.5),
    fx({ k: 'posa', chi: chi(io, 'barac'), posa: 'fermo' }),
  ],
};
