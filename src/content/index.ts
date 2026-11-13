import { capitoloEnoc } from './capitoli/enoc';
import type { Capitolo, Passo, Ruolo } from './tipi';

/** I capitoli giocabili, per numero. Gli altri compaiono nell’indice come «in preparazione». */
export const CAPITOLI: Record<number, Capitolo> = {
  1: capitoloEnoc,
};

export function capitolo(numero: number): Capitolo | undefined {
  return CAPITOLI[numero];
}

/** Tutti i passi di un ruolo, nell’ordine in cui possono comparire. */
export function passiDelRuolo(ruolo: Ruolo): Passo[] {
  const passi: Passo[] = [];
  for (const scena of ruolo.scene) {
    passi.push(...(scena.ingresso ?? []));
    for (const punto of scena.punti) passi.push(...punto.passi);
    passi.push(...(scena.uscita ?? []));
  }
  passi.push(...ruolo.epilogo);
  return passi;
}

/** Gli identificativi dei dettagli che un ruolo permette di scoprire. */
export function dettagliDelRuolo(ruolo: Ruolo): string[] {
  const ids = new Set<string>();
  for (const p of passiDelRuolo(ruolo)) if (p.t === 'dettaglio') ids.add(p.id);
  return [...ids];
}

export function sensazioniDelRuolo(ruolo: Ruolo): string[] {
  const ids = new Set<string>();
  for (const p of passiDelRuolo(ruolo)) if (p.t === 'senti') ids.add(p.id);
  return [...ids];
}
