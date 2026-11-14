import type { Passo, Ruolo } from './tipi';

/** Strumenti per leggere i ruoli, comuni a tutte le pubblicazioni. */

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

/** I dettagli che un passo rivela: da una scheda o alla fine di un’attività. */
export function dettagliDelPasso(p: Passo): string[] {
  if (p.t === 'dettaglio') return [p.id];
  if (p.t !== 'attivita') return [];
  const a = p.a;
  if (a.tipo === 'condotta') return a.opzioni.flatMap((o) => (o.dettaglio ? [o.dettaglio] : []));
  if ('dettaglio' in a && a.dettaglio) return [a.dettaglio];
  return [];
}

/** Gli identificativi dei dettagli che un ruolo permette di scoprire. */
export function dettagliDelRuolo(ruolo: Ruolo): string[] {
  return [...new Set(passiDelRuolo(ruolo).flatMap(dettagliDelPasso))];
}

export function sensazioniDelRuolo(ruolo: Ruolo): string[] {
  const ids = new Set<string>();
  for (const p of passiDelRuolo(ruolo)) if (p.t === 'senti') ids.add(p.id);
  return [...ids];
}
