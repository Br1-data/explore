import type { Capitolo, Ruolo } from '@/contenuti/tipi';

/**
 * Gli indirizzi delle schermate (dopo il #):
 *   /                              inizio
 *   /coraggio                      indice di una pubblicazione
 *   /coraggio/16                   un capitolo
 *   /coraggio/16/barac             il racconto nei panni di un personaggio
 *   /coraggio/16/barac/fine        la conclusione
 */
export const indirizzo = {
  inizio: (): string => '/',
  indice: (pubblicazione: string): string => `/${pubblicazione}`,
  capitolo: (cap: Capitolo): string => `/${cap.pubblicazione}/${cap.numero}`,
  gioca: (cap: Capitolo, ruolo: Ruolo): string => `/${cap.pubblicazione}/${cap.numero}/${ruolo.id}`,
  fine: (cap: Capitolo, ruolo: Ruolo): string => `/${cap.pubblicazione}/${cap.numero}/${ruolo.id}/fine`,
};

/** Le parti dell’indirizzo attuale. */
export function partiIndirizzo(): string[] {
  return location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
}

/**
 * Gli indirizzi della prima versione, quando c’era un solo libro (#/libro, #/capitolo/16,
 * #/gioca/16/barac, #/fine/16/barac): chi li ha salvati arriva allo stesso posto.
 */
export function daVecchioIndirizzo([dove, n, ruolo]: string[]): string | null {
  const libro = 'coraggio';
  if (dove === 'libro') return `/${libro}`;
  if (dove === 'capitolo' && n) return `/${libro}/${n}`;
  if (dove === 'gioca' && n && ruolo) return `/${libro}/${n}/${ruolo}`;
  if (dove === 'fine' && n && ruolo) return `/${libro}/${n}/${ruolo}/fine`;
  return null;
}
