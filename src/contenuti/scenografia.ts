import type { Base, Oggetto } from './tipi';

/** Strumenti per comporre le scenografie dei capitoli. */

export type { Base };

export function o(tipo: string, x: number, extra: Partial<Oggetto> = {}): Oggetto {
  return { tipo, x, ...extra };
}

export function serie(tipo: string, xs: number[], extra: Partial<Oggetto> = {}): Oggetto[] {
  return xs.map((x, i) => ({ tipo, x, variante: i % 3, ...extra }));
}

/** Accorcia una scenografia: scene brevi, poca strada tra un’azione e l’altra. */
export function taglia(base: Base, larghezza: number): Base {
  return { ...base, larghezza, oggetti: base.oggetti.filter((x) => x.x < larghezza - 30) };
}
