import type { Certezza, Fonte, TipoPunto } from '../content/tipi';
import { esterno, h } from './dom';

export const CERTEZZE: Record<Certezza, { etichetta: string; descrizione: string }> = {
  scritto: { etichetta: 'È scritto', descrizione: 'Lo dice il testo biblico.' },
  numeri: {
    etichetta: 'Dai numeri',
    descrizione: 'Si ricava con un calcolo dagli anni e dalle date che la Bibbia e il libro indicano.',
  },
  libro: {
    etichetta: 'Lo spiega il libro',
    descrizione: 'Lo afferma il libro, una nota della Bibbia per lo studio o una pubblicazione che il libro cita.',
  },
  sembra: {
    etichetta: 'Sembra che',
    descrizione:
      'Le pubblicazioni stesse lo presentano come probabile o possibile: la Bibbia non lo dice apertamente.',
  },
};

export const ORDINE_CERTEZZE: Certezza[] = ['scritto', 'numeri', 'libro', 'sembra'];

export const PER_TE = {
  etichetta: 'Per te',
  descrizione: 'Una domanda rivolta a te. Non è un fatto del racconto: la Bibbia non dice che cosa provarono.',
};

export const RICOSTRUZIONE = {
  etichetta: 'Ricostruzione',
  descrizione:
    'Scena non narrata: è costruita su ciò che le fonti dicono di quel tempo. Ciò che fa il personaggio viene sempre dalle fonti; nessuna parola gli è messa in bocca.',
};

export function distintivoRicostruzione(): HTMLElement {
  return h('span', { class: 'distintivo distintivo--ricostruzione', title: RICOSTRUZIONE.descrizione }, RICOSTRUZIONE.etichetta);
}

export const VERBI: Record<TipoPunto, string> = {
  osserva: 'Osserva',
  ascolta: 'Ascolta',
  leggi: 'Leggi',
  agisci: 'Agisci',
  medita: 'Rifletti',
  esamina: 'Esamina',
};

export function distintivo(certezza: Certezza): HTMLElement {
  const c = CERTEZZE[certezza];
  return h('span', { class: `distintivo distintivo--${certezza}`, title: c.descrizione }, c.etichetta);
}

export function elencoFonti(fonti: Fonte[] | undefined, titolo = 'Fonti: '): HTMLElement | null {
  if (!fonti?.length) return null;
  const voci: (Node | string)[] = [];
  fonti.forEach((f, i) => {
    if (i) voci.push(' · ');
    voci.push(f.url ? esterno(f.rif, f.url) : f.rif);
  });
  return h('p', { class: 'fonti' }, h('span', { class: 'fonti__titolo' }, titolo), voci);
}
