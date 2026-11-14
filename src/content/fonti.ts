import type { Fonte, Verso } from './tipi';

/** Indirizzi e strumenti per le fonti, comuni a tutti i capitoli. */

export const BIBBIA = 'https://www.jw.org/it/biblioteca-digitale/bibbia/bibbia-per-lo-studio/libri';
export const RIVISTE = 'https://www.jw.org/it/biblioteca-digitale/riviste';
export const LIBRO_BASE = 'https://www.jw.org/it/biblioteca-digitale/libri/cammina-coraggiosamente-con-dio';
const PERSPICACIA = 'https://www.jw.org/it/biblioteca-digitale/libri/Perspicacia-nello-studio-delle-Scritture';

/** Libri biblici citati finora: indirizzo su jw.org e numero (per l’ancora del versetto). */
const LIBRI: Record<string, [slug: string, numero: number]> = {
  Genesi: ['genesi', 1],
  Esodo: ['esodo', 2],
  Deuteronomio: ['deuteronomio', 5],
  Giudici: ['giudici', 7],
  Salmo: ['salmi', 19],
  Proverbi: ['proverbi', 20],
  Giovanni: ['giovanni', 43],
  Romani: ['romani', 45],
  Galati: ['galati', 48],
  '2 Timoteo': ['2-timoteo', 55],
  Ebrei: ['ebrei', 58],
  '2 Pietro': ['2-pietro', 61],
  Giuda: ['giuda', 65],
  Rivelazione: ['rivelazione', 66],
};

/** Fonte biblica con collegamento al versetto su jw.org. */
export function b(libro: string, capitolo: number, versetti: string): Fonte {
  const voce = LIBRI[libro];
  if (!voce) throw new Error(`Libro biblico non previsto: ${libro}`);
  const [slug, numero] = voce;
  const primo = parseInt(versetti, 10);
  const ancora = `v${numero}${String(capitolo).padStart(3, '0')}${String(primo).padStart(3, '0')}`;
  const rif = libro === 'Giuda' ? `Giuda ${versetti}` : `${libro} ${capitolo}:${versetti}`;
  return { rif, url: `${BIBBIA}/${slug}/${capitolo}/#${ancora}` };
}

/** Un versetto citato alla lettera, con le note in calce utili. */
export function verso(rif: string, fonte: Fonte, testo: string, note?: string[]): Verso {
  return { rif, testo, note, url: fonte.url ?? '' };
}

/** Una voce di «Perspicacia nello studio delle Scritture». */
export function perspicacia(voce: string): Fonte {
  return { rif: `Perspicacia nello studio delle Scritture, «${voce}»`, url: `${PERSPICACIA}/${voce}/` };
}
