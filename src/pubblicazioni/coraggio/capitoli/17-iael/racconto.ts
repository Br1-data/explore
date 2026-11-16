import type { Attore, Fx, Passo, Scena } from '@/contenuti/tipi';
import { PAROLE } from './base';
import { accampamento, casaSisera, festa, tendaIael } from './scenari';

/**
 * Il racconto del capitolo 17, uguale per tutti i punti di vista: le stesse scene, le
 * stesse voci, gli stessi gesti. Ogni ruolo ci mette il suo ingresso, i suoi punti e i
 * suoi dettagli (decisione 8). `io` è il personaggio impersonato: il suo attore non
 * compare, perché lo muove chi gioca, e i suoi gesti li fa il giocatore.
 */

export type Palco = Omit<Scena, 'id' | 'titolo' | 'luogo' | 'punti' | 'ingresso'>;

const fx = (f: Fx): Passo => ({ t: 'fx', fx: f });
const dice = (chi: string, testo: string, dur = 4.5): Passo => fx({ k: 'nastro', chi, testo, dur });
const attendi = (dur: number): Passo => fx({ k: 'attendi', dur });
const presenti = (io: string, lista: Attore[]): Attore[] => lista.filter((a) => a.id !== io);
const chi = (io: string, id: string): string => (io === id ? 'giocatore' : id);
const va = (io: string, id: string, x: number, vel = 100, aspetta = false): Passo[] =>
  io === id ? [] : [fx({ k: 'vai', chi: id, x, vel, attendi: aspetta })];

/** Parole del canto (Giudici 5:24, 28, 29): Debora e Barac lo cantano insieme. */
export const CANTATO = {
  benedetta: 'Benedetta fra le donne è Iàel, moglie di Hèber il chenita',
  tende: 'benedetta fra le donne che vivono in tende',
  carro: 'Perché il suo carro ancora non arriva? Perché tarda tanto lo scalpitio dei suoi cavalli?',
  spoglie: 'Si staranno dividendo le spoglie',
};

// ——— Sisera arriva alle tende di Heber (Giudici 4:17, 18) ———

export function palcoArrivo(io: string): Palco {
  return {
    ...accampamento(2400),
    attori: presenti(io, [
      { id: 'sisera', x: 2330, stile: 'sisera', verso: -1 },
      { id: 'iael', x: 1880, stile: 'iael', verso: 1 },
    ]),
  };
}

export const ARRIVO = {
  arriva: (io: string): Passo[] => va(io, 'sisera', 2040, 130, true),
  /** «Iàel uscì incontro a Sìsera e gli disse…» (4:18). */
  incontro: (io: string): Passo[] => [...va(io, 'iael', 1980, 90, true), dice(chi(io, 'iael'), PAROLE.invito, 4.5)],
  entra: (io: string): Passo[] => [...va(io, 'sisera', 1830, 90), ...va(io, 'iael', 1860, 80)],
};

// ——— Nella tenda (4:18-21) ———

/** La tenda di Iael: Sisera si sdraia, la coperta è lì vicino (sparisce quando la si prende). */
export function palcoTenda(io: string): Palco {
  const base = tendaIael(1500);
  return {
    ...base,
    oggetti: [...base.oggetti, { tipo: 'coperta', x: 960, seVar: 'coperta' }],
    vars: { coperta: 1 },
    attori: presenti(io, [
      { id: 'sisera', x: 770, stile: 'sisera', verso: 1 },
      { id: 'iael', x: 880, stile: 'iael', verso: -1 },
    ]),
  };
}

export const TENDA = {
  prendiCoperta: (io: string): Passo[] => [
    ...va(io, 'iael', 960, 90, true),
    fx({ k: 'var', nome: 'coperta', a: 0, dur: 0.3 }),
    fx({ k: 'carico', chi: chi(io, 'iael'), cosa: 'coperta' }),
  ],
  /** «…e lei lo coprì con una coperta» (4:18). */
  copri: (io: string): Passo[] => [
    ...va(io, 'iael', 840, 90, true),
    fx({ k: 'carico', chi: chi(io, 'iael'), cosa: null }),
    fx({ k: 'posa', chi: chi(io, 'sisera'), posa: 'coperto' }),
    attendi(1.2),
  ],
  acqua: (io: string): Passo[] => [dice(chi(io, 'sisera'), PAROLE.acqua, 4)],
  /** L’otre di latte e la coppa (4:19; 5:25). */
  otre: (io: string): Passo[] => [...va(io, 'iael', 650, 90, true), fx({ k: 'carico', chi: chi(io, 'iael'), cosa: 'coppa' })],
  /** Gli dà da bere e lo copre di nuovo (4:19): la coppa resta a lui. */
  beve: (io: string): Passo[] => [...va(io, 'iael', 840, 90, true), fx({ k: 'carico', chi: chi(io, 'iael'), cosa: null }), attendi(0.8)],
  ordine: (io: string): Passo[] => [dice(chi(io, 'sisera'), PAROLE.entrata, 3), dice(chi(io, 'sisera'), PAROLE.rispondi, 5)],
};

// ——— Arriva Barac (4:22) ———

export function palcoBarac(io: string): Palco {
  return {
    ...tendaIael(1500),
    attori: presenti(io, [
      // Sisera giace a terra, coperto (Giudici 4:22): il gioco non mostra di più.
      { id: 'sisera', x: 770, stile: 'sisera', verso: 1, posa: 'coperto' },
      { id: 'iael', x: 940, stile: 'iael', verso: 1 },
      { id: 'barac', x: 1460, stile: 'barac', verso: -1 },
    ]),
  };
}

export const BARAC = {
  arriva: (io: string): Passo[] => va(io, 'barac', 1180, 150, true),
  /** «Andandogli incontro, Iàel gli disse…» (4:22). */
  incontro: (io: string): Passo[] => [...va(io, 'iael', 1120, 120, true), dice(chi(io, 'iael'), PAROLE.mostra, 4.5)],
  entra: (io: string): Passo[] => [...va(io, 'iael', 930, 90), ...va(io, 'barac', 860, 100, true)],
};

// ——— Il canto di vittoria (5:24-27) ———

/** Debora e Barac cantano; intorno si danza con i tamburelli. */
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
  /** «Benedetta fra le donne è Iàel…» (5:24): lo cantano insieme. */
  lode: (io: string): Passo[] => [
    fx({ k: 'posa', chi: chi(io, 'debora'), posa: 'proclama' }),
    dice(chi(io, 'debora'), CANTATO.benedetta, 4.5),
    dice(chi(io, 'barac'), CANTATO.tende, 4),
    fx({ k: 'posa', chi: chi(io, 'debora'), posa: 'fermo' }),
  ],
};

// ——— Alla finestra di Aroset, come la descrive il canto (5:28-30) ———

export function palcoFinestra(io: string): Palco {
  return {
    ...casaSisera(1700),
    folle: [{ x0: 1080, x1: 1150, n: 2, seme: 97, donne: 1 }],
    attori: presenti(io, [
      { id: 'madre', x: 690, stile: 'madre', verso: -1 },
      { id: 'dama', x: 1010, stile: 'dama', verso: -1 },
    ]),
  };
}

export const FINESTRA = {
  attesa: (io: string): Passo[] => [dice(chi(io, 'madre'), CANTATO.carro, 5)],
  /** Le dame le rispondono (il canto non riporta le loro parole), e lei ripete a sé stessa… (5:29, 30). */
  dame: (io: string): Passo[] => [
    fx({ k: 'posa', chi: 'dama', posa: 'parla' }),
    attendi(2.5),
    fx({ k: 'posa', chi: 'dama', posa: 'fermo' }),
    dice(chi(io, 'madre'), CANTATO.spoglie, 3.5),
  ],
};
