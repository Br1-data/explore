import { coraggio } from '@/pubblicazioni/coraggio';
import type { Capitolo, Pubblicazione } from './tipi';

export * from './passi';

/**
 * Le pubblicazioni del gioco. Per aggiungerne una: una cartella in src/pubblicazioni
 * (sul modello di coraggio/) e una voce qui.
 */
export const PUBBLICAZIONI: Pubblicazione[] = [coraggio];

export function pubblicazione(id: string): Pubblicazione | undefined {
  return PUBBLICAZIONI.find((p) => p.id === id);
}

export function capitoloDi(pub: Pubblicazione, numero: number): Capitolo | undefined {
  return pub.capitoli.find((c) => c.numero === numero);
}

/** Tutti i capitoli giocabili, di tutte le pubblicazioni. */
export function tuttiICapitoli(): Capitolo[] {
  return PUBBLICAZIONI.flatMap((p) => p.capitoli);
}

/** La chiave di un capitolo nei salvataggi: «coraggio:16». */
export function chiave(cap: Capitolo): string {
  return `${cap.pubblicazione}:${cap.numero}`;
}

/** Quanti capitoli ha la pubblicazione in tutto (anche quelli non ancora giocabili). */
export function totaleCapitoli(pub: Pubblicazione): number {
  return pub.parti.reduce((n, p) => n + p.capitoli.length, 0);
}
