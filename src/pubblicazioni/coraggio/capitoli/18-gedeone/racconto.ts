import { o } from '@/contenuti/scenografia';
import type { Attore, Fx, Passo, Scena } from '@/contenuti/tipi';
import { PAROLE } from './base';
import { campoMadian, harod, ofra, villaggio } from './scenari';

/**
 * Il racconto del capitolo 18, uguale per tutti i punti di vista: le stesse scene, le
 * stesse voci, gli stessi gesti e gli stessi suoni. Ogni ruolo ci mette il suo ingresso,
 * i suoi punti e i suoi dettagli (decisione 8). `io` è il personaggio impersonato: il
 * suo attore non compare, perché lo muove chi gioca, e i suoi gesti li fa il giocatore.
 */

/** Una scena senza ciò che è proprio di ogni ruolo. */
export type Palco = Omit<Scena, 'id' | 'titolo' | 'luogo' | 'punti' | 'ingresso'>;

const fx = (f: Fx): Passo => ({ t: 'fx', fx: f });
const dice = (chi: string, testo: string, dur = 4.5): Passo => fx({ k: 'nastro', chi, testo, dur });
const attendi = (dur: number): Passo => fx({ k: 'attendi', dur });

/** Gli attori in scena, tranne chi è impersonato. */
const presenti = (io: string, lista: Attore[]): Attore[] => lista.filter((a) => a.id !== io);
/** Chi fa un gesto o parla: il giocatore, se è lui. */
const chi = (io: string, id: string): string => (io === id ? 'giocatore' : id);
/** Un attore si sposta: se è chi gioca, non serve (si muove da sé). */
const va = (io: string, id: string, x: number, vel = 110, aspetta = false): Passo[] =>
  io === id ? [] : [fx({ k: 'vai', chi: id, x, vel, attendi: aspetta })];

// ——— Ofra, sotto il grande albero (Giudici 6:11-24) ———

/** L’angelo seduto sotto l’albero, Gedeone al torchio, la grande roccia, l’altare Geova-Shalom. */
export function palcoTorchio(io: string): Palco {
  const base = ofra(false, 2200);
  return {
    ...base,
    oggetti: [
      ...base.oggetti,
      o('roccia', 520, { scala: 1.3 }),
      o('fuoco', 520, { seVar: 'fuocoRoccia' }),
      o('altare', 420, { variante: 1, seVar: 'shalom' }),
    ],
    vars: { fuocoRoccia: 0, shalom: 0 },
    attori: presenti(io, [
      { id: 'angelo', x: 660, stile: 'angelo', verso: 1, posa: 'seduto', visibile: false },
      { id: 'gedeone', x: 980, stile: 'gedeone', verso: -1 },
    ]),
  };
}

export const TORCHIO = {
  /** «L’angelo di Geova gli apparve e gli disse…» (6:12). */
  appare: (): Passo[] => [fx({ k: 'visibile', chi: 'angelo', v: true }), attendi(1), dice('angelo', PAROLE.saluto, 3.5)],
  /** La domanda di Gedeone e la risposta (6:13, 14). */
  dialogo: (io: string): Passo[] => [dice(chi(io, 'gedeone'), PAROLE.perche, 5), dice('angelo', PAROLE.manda, 5.5)],
  /** Gedeone porta il dono sotto l’albero (6:19). */
  dono: (io: string): Passo[] => [
    fx({ k: 'carico', chi: chi(io, 'gedeone'), cosa: 'secchio' }),
    ...va(io, 'gedeone', 760, 110, true),
  ],
  /** Il dono sulla roccia, il bastone, il fuoco; l’angelo scompare (6:20-22). */
  fuoco: (io: string): Passo[] => [
    ...va(io, 'gedeone', 470, 110, true),
    fx({ k: 'carico', chi: chi(io, 'gedeone'), cosa: null }),
    fx({ k: 'posa', chi: 'angelo', posa: 'fermo' }),
    fx({ k: 'vai', chi: 'angelo', x: 590, vel: 60, attendi: true }),
    fx({ k: 'posa', chi: 'angelo', posa: 'indica' }),
    attendi(0.8),
    fx({ k: 'var', nome: 'fuocoRoccia', a: 1, dur: 0.3 }),
    attendi(2.5),
    fx({ k: 'visibile', chi: 'angelo', v: false }),
    fx({ k: 'var', nome: 'fuocoRoccia', a: 0, dur: 2 }),
    dice(chi(io, 'gedeone'), PAROLE.ohime, 4.5),
  ],
  /** L’altare Geova-Shalom (6:24). */
  altare: (): Passo[] => [fx({ k: 'var', nome: 'shalom', a: 1, dur: 1.5 }), attendi(1)],
};

// ——— Ofra, di notte: l’altare di Baal (6:25-27) ———

export function palcoNotte(io: string): Palco {
  return {
    ...ofra(true, 2200, 'notte'),
    vars: { altareGeova: 0 },
    // I dieci servitori che Gedeone prese con sé (Giudici 6:27).
    folle: [{ x0: 1150, x1: 1450, n: 10, seme: 301, comportamento: 'vaga' }],
    attori: presenti(io, [{ id: 'gedeone', x: 1300, stile: 'gedeone', verso: 1 }]),
  };
}

export const NOTTE = {
  demolisci: (io: string): Passo[] => [...va(io, 'gedeone', 1600, 110, true), fx({ k: 'oggetto', id: 'baal', variante: 3 }), attendi(1.2)],
  erigi: (io: string): Passo[] => [...va(io, 'gedeone', 1740, 110, true), fx({ k: 'var', nome: 'altareGeova', a: 1, dur: 1.5 }), attendi(1)],
};

// ——— Ofra, il mattino dopo (6:28-32) ———

/** Gedeone è in casa: la città se la prende con suo padre. */
export function palcoMattino(io: string): Palco {
  return {
    ...ofra(false, 2200, 'demolito'),
    vars: { agitazione: 0 },
    folle: [{ x0: 1820, x1: 2120, n: 10, seme: 321, comportamento: 'vaga', reagisce: true }],
    attori: presenti(io, [
      { id: 'ioas', x: 1560, stile: 'ioas', verso: 1 },
      { id: 'cittadino', x: 1760, stile: 'abitante', verso: -1 },
    ]),
  };
}

export const MATTINO = {
  accusa: (): Passo[] => [
    fx({ k: 'var', nome: 'agitazione', a: 1, dur: 1.5 }),
    dice('cittadino', PAROLE.chi, 3),
    dice('cittadino', PAROLE.stato, 3),
    dice('cittadino', PAROLE.portaFuori, 6),
  ],
  difesa: (io: string): Passo[] => [
    dice(chi(io, 'ioas'), PAROLE.difendere, 4.5),
    dice(chi(io, 'ioas'), PAROLE.siDifenda, 4.5),
    fx({ k: 'var', nome: 'agitazione', a: 0, dur: 2 }),
  ],
};

// ——— Il corno e il vello nell’aia (6:33-40) ———

export function palcoVello(io: string): Palco {
  const base = ofra(true, 2200, 'demolito');
  return {
    ...base,
    oggetti: [...base.oggetti, { tipo: 'vello', x: 1100, id: 'vello', seVar: 'steso' }],
    // La notte sfuma nel mattino con `visione` (Giudici 6:38: «il giorno dopo si alzò di buon’ora»).
    ambiente2: 'mattino',
    vars: { radunati: 0, steso: 0, visione: 0 },
    folle: [{ x0: 200, x1: 800, n: 12, seme: 305, armati: 0.4, comportamento: 'vaga', seVar: 'radunati' }],
    attori: presenti(io, [{ id: 'gedeone', x: 520, stile: 'gedeone', verso: -1 }]),
  };
}

export const VELLO = {
  /** Il corno, e gli abiezeriti che si radunano (6:34). */
  corno: (io: string): Passo[] => [
    fx({ k: 'carico', chi: chi(io, 'gedeone'), cosa: 'corno' }),
    fx({ k: 'suono', cosa: 'corno', x: 520 }),
    attendi(1.2),
    fx({ k: 'var', nome: 'radunati', a: 1, dur: 2 }),
    attendi(1.5),
    fx({ k: 'carico', chi: chi(io, 'gedeone'), cosa: null }),
  ],
  stendi: (io: string): Passo[] => [...va(io, 'gedeone', 1040, 110, true), fx({ k: 'var', nome: 'steso', a: 1, dur: 0.6 })],
  /** Il primo mattino: rugiada solo sul vello (6:38). */
  rugiada: (): Passo[] => [fx({ k: 'var', nome: 'visione', a: 1, dur: 3 }), fx({ k: 'oggetto', id: 'vello', variante: 1 }), attendi(1.5)],
  /** La seconda notte e il secondo mattino: il vello asciutto, il terreno bagnato (6:40). */
  asciutto: (): Passo[] => [
    fx({ k: 'var', nome: 'visione', a: 0, dur: 1.5 }),
    fx({ k: 'oggetto', id: 'vello', variante: 0 }),
    attendi(1),
    fx({ k: 'var', nome: 'visione', a: 1, dur: 3 }),
    fx({ k: 'oggetto', id: 'vello', variante: 2 }),
    attendi(1.5),
  ],
};

// ——— La sorgente di Harod: da 32.000 a 300 (7:1-8) ———

export function palcoHarod(io: string): Palco {
  return {
    ...harod(2200),
    vars: { tutti: 1, diecimila: 0, trecento: 0 },
    folle: [
      { x0: 450, x1: 1750, n: 24, seme: 311, armati: 0.4, comportamento: 'vaga', seVar: 'tutti' },
      { x0: 650, x1: 1500, n: 11, seme: 313, armati: 0.4, comportamento: 'vaga', seVar: 'diecimila' },
      { x0: 850, x1: 1300, n: 4, seme: 315, armati: 0.3, comportamento: 'vaga', seVar: 'trecento' },
    ],
    attori: presenti(io, [{ id: 'gedeone', x: 620, stile: 'gedeone', verso: 1 }]),
  };
}

export const HAROD = {
  /** «Chi ha paura e trema torni a casa»: 22.000 se ne vanno (7:3). */
  annuncio: (io: string): Passo[] => [
    dice(chi(io, 'gedeone'), PAROLE.paura, 3.5),
    fx({ k: 'var', nome: 'diecimila', a: 1, dur: 2 }),
    fx({ k: 'var', nome: 'tutti', a: 0, dur: 2.5 }),
    attendi(1.5),
  ],
  /** All’acqua restano soltanto i 300 (7:5-8). */
  acqua: (): Passo[] => [fx({ k: 'var', nome: 'trecento', a: 1, dur: 2 }), fx({ k: 'var', nome: 'diecimila', a: 0, dur: 2.5 }), attendi(1.5)],
};

// ——— L’accampamento di Madian: il sogno e l’attacco (7:9-22) ———

/**
 * La pianura di notte. A sinistra le giare dei 300 (variabile `giare`) e poi le loro torce
 * (`luci`); nell’accampamento la quiete (`quiete`) e poi la fuga (`fuga`).
 */
export function palcoCampo(io: string): Palco {
  const base = campoMadian(2400);
  const trecento = { x0: 60, x1: 560, n: 9, seme: 351, comportamento: 'fermo' as const };
  const madian = { x0: 820, x1: 2250, n: 16, seme: 341, armati: 0.6 };
  return {
    ...base,
    // I 300 aspettano al buio, ai margini: niente fuochi accanto a loro (Giudici 7:19).
    oggetti: [...base.oggetti.filter((x) => !(x.tipo === 'fuoco' && x.x < 900)), ...[110, 250, 390, 520].map((x) => o('cocci', x, { seVar: 'luci' }))],
    vars: { giare: 0, luci: 0, quiete: 1, fuga: 0 },
    folle: [
      { ...trecento, giare: 1, seVar: 'giare' },
      { ...trecento, torce: 1, gruppo: 'assalto', seVar: 'luci' },
      { ...madian, comportamento: 'vaga', seVar: 'quiete' },
      { ...madian, gruppo: 'fuga', seVar: 'fuga' },
    ],
    attori: presenti(io, [
      { id: 'gedeone', x: 440, stile: 'gedeone', verso: 1 },
      { id: 'pura', x: 380, stile: 'pura', verso: 1 },
      { id: 'sognatore', x: 1420, stile: 'madianita', verso: 1 },
      { id: 'madianita', x: 1500, stile: 'madianita', verso: -1 },
    ]),
  };
}

export const CAMPO = {
  /** Gedeone e Pura scendono fino ai margini dell’accampamento (7:11). */
  scendi: (io: string): Passo[] => [...va(io, 'gedeone', 1250, 110), ...va(io, 'pura', 1200, 110, true)],
  /** Il sogno e la sua spiegazione, alla lettera (7:13, 14). */
  sogno: (io: string): Passo[] => [
    dice('sognatore', PAROLE.sogno, 5.5),
    dice('sognatore', PAROLE.tenda, 5.5),
    dice(chi(io, 'madianita'), PAROLE.spada, 5),
    dice(chi(io, 'madianita'), PAROLE.dato, 4),
  ],
  /** Gedeone torna dai suoi uomini (7:15). */
  ritorno: (io: string): Passo[] => [...va(io, 'gedeone', 440, 130), ...va(io, 'pura', 380, 130, true)],
  /** I 300 prendono posto intorno all’accampamento, con le giare (7:16-19). */
  schierati: (): Passo[] => [fx({ k: 'var', nome: 'giare', a: 1, dur: 2 }), attendi(1)],
  /**
   * Il segnale: il corno di Gedeone, poi tutti i corni, le giare in pezzi, le torce, il
   * grido; nell’accampamento tutti corrono e urlano (7:19-22).
   */
  attacco: (io: string): Passo[] => {
    const ge = chi(io, 'gedeone');
    return [
      fx({ k: 'carico', chi: ge, cosa: 'corno' }),
      fx({ k: 'suono', cosa: 'corno', x: 440 }),
      attendi(1),
      fx({ k: 'suono', cosa: 'giare', x: 300 }),
      fx({ k: 'var', nome: 'luci', a: 1, dur: 0.3 }),
      fx({ k: 'var', nome: 'giare', a: 0, dur: 0.2 }),
      fx({ k: 'carico', chi: ge, cosa: 'torcia' }),
      ...(io === 'trecento' ? [fx({ k: 'carico', chi: 'giocatore', cosa: 'torcia' })] : []),
      dice(ge, PAROLE.grido, 3.5),
      ...(io === 'trecento' ? [dice('giocatore', PAROLE.grido, 3.5)] : []),
      fx({ k: 'visibile', chi: 'sognatore', v: false }),
      ...(io === 'madianita' ? [] : [fx({ k: 'visibile', chi: 'madianita', v: false })]),
      fx({ k: 'var', nome: 'quiete', a: 0, dur: 1.5 }),
      fx({ k: 'var', nome: 'fuga', a: 1, dur: 1.5 }),
      attendi(2.5),
    ];
  },
};

// ——— Oltre il Giordano: Succot (8:4-6) ———

export function palcoSuccot(io: string): Palco {
  return {
    ...villaggio(2400),
    folle: [
      // I 300, stanchi; gli uomini di Succot.
      { x0: 200, x1: 700, n: 8, seme: 361, armati: 0.5, comportamento: 'vaga' },
      { x0: 1500, x1: 1800, n: 5, seme: 363, comportamento: 'fermo' },
    ],
    attori: presenti(io, [
      { id: 'gedeone', x: 1150, stile: 'gedeone', verso: 1 },
      { id: 'principe', x: 1380, stile: 'abitante', verso: -1 },
    ]),
  };
}

export const SUCCOT = {
  pane: (io: string): Passo[] => [dice(chi(io, 'gedeone'), PAROLE.pane, 6), dice('principe', PAROLE.rifiuto, 5)],
};

// ——— «Governa su di noi» (8:22, 23) ———

export function palcoGoverno(io: string): Palco {
  return {
    ...ofra(false, 2200, 'demolito'),
    folle: [{ x0: 900, x1: 1500, n: 12, seme: 303, comportamento: 'vaga' }],
    attori: presenti(io, [
      { id: 'gedeone', x: 1200, stile: 'gedeone', verso: 1 },
      { id: 'israelita', x: 1340, stile: 'abitante', verso: -1 },
    ]),
  };
}

export const GOVERNO = {
  richiesta: (): Passo[] => [dice('israelita', PAROLE.governa, 5)],
  /** La risposta di Gedeone; chi impersona Gedeone la ricompone nel versetto. */
  risposta: (io: string): Passo[] => (io === 'gedeone' ? [] : [dice('gedeone', PAROLE.geovaGoverna, 5)]),
};
