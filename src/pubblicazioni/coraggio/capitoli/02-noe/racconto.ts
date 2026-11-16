import type { Attore, Fx, Passo, Scena } from '@/contenuti/tipi';
import { ararat, cantiere, diluvio } from './scenari';

/**
 * Il racconto del capitolo 2, uguale per tutti i punti di vista: le stesse scene, gli
 * stessi gesti, gli stessi suoni. Ogni ruolo ci mette il suo ingresso, i suoi punti e i
 * suoi dettagli (decisione 8). `io` è il personaggio impersonato: il suo attore non
 * compare, perché lo muove chi gioca.
 */

export type Palco = Omit<Scena, 'id' | 'titolo' | 'luogo' | 'punti' | 'ingresso'>;

const fx = (f: Fx): Passo => ({ t: 'fx', fx: f });
const attendi = (dur: number): Passo => fx({ k: 'attendi', dur });
const presenti = (io: string, lista: Attore[]): Attore[] => lista.filter((a) => a.id !== io);
const FAMIGLIA = ['noe', 'moglie', 'figlio'];

// ——— Il cantiere: l’arca prende forma (Genesi 6:14-22) ———

export function palcoCantiere(io: string): Palco {
  return {
    ...cantiere(2400),
    folle: [
      { x0: 900, x1: 1400, n: 6, seme: 205, donne: 0.5, comportamento: 'vaga' },
      { x0: 1800, x1: 2150, n: 7, seme: 207, comportamento: 'vaga' },
    ],
    attori: presenti(io, [{ id: 'noe', x: 980, stile: 'noe', verso: 1 }]),
  };
}

export const CANTIERE = {
  /** Anni di lavoro in pochi istanti: l’ossatura, le tavole, il catrame, la porta. */
  anni: (): Passo[] => [
    fx({ k: 'oggetto', id: 'arca', variante: 3 }),
    attendi(1),
    fx({ k: 'oggetto', id: 'arca', variante: 4 }),
    attendi(1),
    fx({ k: 'oggetto', id: 'arca', variante: 1 }),
    attendi(1),
  ],
  /** Noè avverte chi si ferma a guardare (2 Pietro 2:5). */
  avverte: (): Passo[] => [
    fx({ k: 'vai', chi: 'noe', x: 1800, vel: 110, attendi: true }),
    fx({ k: 'posa', chi: 'noe', posa: 'proclama' }),
    attendi(2.5),
    fx({ k: 'posa', chi: 'noe', posa: 'fermo' }),
  ],
};

// ——— Il giorno del diluvio: si entra, Geova chiude la porta, piove (7:13-17) ———

export function palcoIngresso(io: string): Palco {
  return {
    ...diluvio(2000),
    // Prima si entra, poi Geova chiude la porta, poi la pioggia (Genesi 7:13-17).
    vars: { pioggia: 0, livello: 0 },
    attori: presenti(io, [
      { id: 'noe', x: 1250, stile: 'noe', verso: -1 },
      { id: 'moglie', x: 1330, stile: 'moglie-noe', verso: -1 },
      { id: 'figlio', x: 1420, stile: 'figlio-noe', verso: -1 },
    ]),
  };
}

export const INGRESSO = {
  /** La famiglia entra nell’arca; chi gioca un familiare entra con loro. */
  entrano: (io: string): Passo[] => {
    const altri = FAMIGLIA.filter((id) => id !== io);
    return [
      ...altri.map((id, i) => fx({ k: 'vai', chi: id, x: 1120, vel: 90, attendi: i === altri.length - 1 })),
      ...altri.map((id) => fx({ k: 'visibile', chi: id, v: false })),
      ...(FAMIGLIA.includes(io) ? [fx({ k: 'visibile', chi: 'giocatore', v: false })] : []),
    ];
  },
  /** Non è la famiglia a chiudere la porta: la chiude Geova (7:16). */
  porta: (): Passo[] => [fx({ k: 'camera', x: 1000 }), attendi(0.8), fx({ k: 'oggetto', id: 'arca', variante: 2 }), attendi(1)],
  pioggia: (): Passo[] => [fx({ k: 'var', nome: 'pioggia', a: 1, dur: 2 })],
  /** L’acqua sale e solleva l’arca (7:17). */
  acqua: (): Passo[] => [fx({ k: 'var', nome: 'livello', a: 1, dur: 9 }), attendi(7)],
};

// ——— Sui monti di Ararat, ancora dentro l’arca (8:4-18) ———

/**
 * Si guarda da dentro (`modo: 'osserva'`, per tutti): nessuno esce finché Dio non lo dice,
 * e fuori non c’è vita. Gli attori della famiglia ci sono tutti, nascosti nell’arca:
 * compaiono quando escono, anche il personaggio impersonato.
 */
export function palcoUscita(): Palco {
  const base = ararat({ altare: false, uccelli: false });
  return {
    ...base,
    oggetti: [
      ...base.oggetti,
      // Il corvo e la colomba escono dalla finestra e tornano a posarsi sull’arca.
      { tipo: 'uccello', x: 700, variante: 0, seVar: 'corvo' },
      { tipo: 'uccello', x: 740, variante: 1, seVar: 'colomba', id: 'colomba' },
    ],
    modo: 'osserva',
    vars: { animali: 0, corvo: 0, colomba: 0 },
    attori: [
      { id: 'noe', x: 640, stile: 'noe', verso: 1, visibile: false },
      { id: 'moglie', x: 640, stile: 'moglie-noe', verso: 1, visibile: false },
      { id: 'figlio', x: 640, stile: 'figlio-noe', verso: 1, visibile: false },
    ],
  };
}

export const USCITA = {
  corvo: (): Passo[] => [fx({ k: 'var', nome: 'corvo', a: 1, dur: 0.5 }), attendi(2.5)],
  colomba: (): Passo[] => [fx({ k: 'var', nome: 'colomba', a: 1, dur: 0.5 }), attendi(2.5)],
  /** Torna con la foglia d’olivo nel becco (8:11). */
  foglia: (): Passo[] => [fx({ k: 'oggetto', id: 'colomba', variante: 2 }), attendi(2)],
  tetto: (): Passo[] => [fx({ k: 'oggetto', id: 'arca', variante: 5 }), attendi(0.8)],
  /** Solo ora la porta si riapre ed escono tutti, con gli animali (8:18, 19). */
  esci: (): Passo[] => [
    fx({ k: 'oggetto', id: 'arca', variante: 6 }),
    ...FAMIGLIA.map((id) => fx({ k: 'visibile', chi: id, v: true })),
    fx({ k: 'var', nome: 'animali', a: 1, dur: 3 }),
    fx({ k: 'vai', chi: 'noe', x: 860, vel: 80 }),
    fx({ k: 'vai', chi: 'moglie', x: 940, vel: 80 }),
    fx({ k: 'vai', chi: 'figlio', x: 1020, vel: 80, attendi: true }),
  ],
};

// ——— L’altare e il patto (8:20–9:17) ———

export function palcoPatto(io: string): Palco {
  return {
    ...ararat({ arcobaleno: 'poi', altare: 'poi' }),
    vars: { altare: 0, arcobaleno: 0 },
    attori: presenti(io, [
      { id: 'noe', x: 1240, stile: 'noe', verso: 1 },
      { id: 'moglie', x: 1150, stile: 'moglie-noe', verso: 1 },
      { id: 'figlio', x: 1100, stile: 'figlio-noe', verso: 1 },
    ]),
  };
}

export const PATTO = {
  /** L’arca resta come l’hanno lasciata: tetto aperto, porta aperta. */
  arca: (): Passo[] => [fx({ k: 'oggetto', id: 'arca', variante: 6 })],
  altare: (): Passo[] => [fx({ k: 'var', nome: 'altare', a: 1, dur: 1.5 }), attendi(1)],
  arcobaleno: (): Passo[] => [fx({ k: 'var', nome: 'arcobaleno', a: 1, dur: 3 }), attendi(1)],
};
