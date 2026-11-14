import type { Capitolo } from '@/contenuti/tipi';
import { PERSONAGGI } from './personaggi';

/** Id della pubblicazione: negli indirizzi (#/coraggio/16) e nelle chiavi dei salvataggi. */
export const ID = 'coraggio';

/** Completa un capitolo del libro con ciò che è uguale per tutti: la pubblicazione e i personaggi. */
export function capitolo(c: Omit<Capitolo, 'pubblicazione' | 'personaggi'>): Capitolo {
  return { ...c, pubblicazione: ID, personaggi: PERSONAGGI };
}
