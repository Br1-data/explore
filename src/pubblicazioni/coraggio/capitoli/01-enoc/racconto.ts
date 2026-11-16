import type { Fx, Passo, Scena } from '@/contenuti/tipi';
import { strada } from './scenari';

/**
 * Il racconto del capitolo 1 condiviso dai punti di vista (decisione 8): la strada dove
 * Enoc proclama il messaggio, con le stesse parole e la stessa folla per Enoc, per
 * l’empio che lo ascolta e per Geova che gli dà la forza. `io` è il personaggio
 * impersonato: il suo attore non compare, e le sue parole le dice il giocatore.
 */

export type Palco = Omit<Scena, 'id' | 'titolo' | 'luogo' | 'punti' | 'ingresso'>;

const fx = (f: Fx): Passo => ({ t: 'fx', fx: f });

/** Il messaggio diviso nei tre momenti in cui Enoc lo proclama in strada (Giuda 14, 15). */
export const NASTRO = [
  'Ecco, Geova è venuto con le sue sante miriadi per eseguire il giudizio contro tutti…',
  '…e dimostrare la colpevolezza di tutti gli empi per tutte le opere empie che hanno empiamente compiuto…',
  '…e per tutte le cose offensive che gli empi peccatori hanno detto contro di lui.',
];

/** Dove Enoc si ferma a parlare, e quanto si agita la folla a ogni parte del messaggio. */
const TAPPE = [
  { x: 1090, agitazione: 0.35, dur: 5 },
  { x: 1810, agitazione: 0.7, dur: 5.5 },
  { x: 2570, agitazione: 1, dur: 5 },
];

export function palcoStrada(io: string): Palco {
  return {
    ...strada(2900),
    vars: { agitazione: 0 },
    folle: [
      { x0: 780, x1: 1240, n: 13, seme: 31, reagisce: true, armati: 0.15, donne: 0.3, comportamento: 'vaga' },
      { x0: 1480, x1: 1980, n: 14, seme: 33, reagisce: true, armati: 0.3, donne: 0.25, comportamento: 'vaga' },
      { x0: 2220, x1: 2760, n: 15, seme: 35, reagisce: true, armati: 0.4, donne: 0.2, comportamento: 'vaga' },
      { x0: 600, x1: 2900, n: 14, seme: 37, piano: 'fondo', comportamento: 'vaga' },
    ],
    zone: io === 'enoc' ? [{ x0: 740, x1: 2700, tipo: 'pressione', forza: 0.3 }] : undefined,
    attori: io === 'enoc' ? [] : [{ id: 'enoc', x: TAPPE[0].x, stile: 'enoc', verso: -1 }],
  };
}

export const STRADA = {
  /** Enoc va al punto `i` della strada (chi lo impersona ci va da sé). */
  avanza: (io: string, i: number): Passo[] => (io === 'enoc' ? [] : [fx({ k: 'vai', chi: 'enoc', x: TAPPE[i].x, vel: 150, attendi: true })]),
  /** La parte `i` del messaggio, e la folla che si agita. */
  parla: (io: string, i: number): Passo[] => {
    const chi = io === 'enoc' ? 'giocatore' : 'enoc';
    return [
      fx({ k: 'posa', chi, posa: 'proclama' }),
      fx({ k: 'nastro', chi, testo: NASTRO[i], dur: TAPPE[i].dur }),
      fx({ k: 'var', nome: 'agitazione', a: TAPPE[i].agitazione, dur: 2.5 }),
      fx({ k: 'posa', chi, posa: 'fermo' }),
    ];
  },
};
