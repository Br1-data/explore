/**
 * Progressi e quaderno di studio, conservati nel browser (localStorage).
 * Nessun dato lascia il dispositivo.
 */

const CHIAVE = 'in-cammino.v1';

export interface ProgressoRuolo {
  /** Indice della prima scena non ancora completata. */
  scena: number;
  finito: boolean;
}

interface Dati {
  v: 1;
  dettagli: Record<string, string[]>;
  /** Sensazioni incontrate, con l’eventuale appunto. */
  sensazioni: Record<string, Record<string, string>>;
  risposte: Record<string, Record<string, string>>;
  versi: Record<string, string[]>;
  ruoli: Record<string, ProgressoRuolo>;
  muto: boolean;
  guidaVista: boolean;
}

function vuoto(): Dati {
  return { v: 1, dettagli: {}, sensazioni: {}, risposte: {}, versi: {}, ruoli: {}, muto: false, guidaVista: false };
}

function leggi(): Dati {
  try {
    const grezzo = localStorage.getItem(CHIAVE);
    if (!grezzo) return vuoto();
    const d = JSON.parse(grezzo) as Partial<Dati>;
    if (d.v !== 1) return vuoto();
    return { ...vuoto(), ...d };
  } catch {
    return vuoto();
  }
}

export class Salvataggio {
  private d: Dati = leggi();

  private scrivi(): void {
    try {
      localStorage.setItem(CHIAVE, JSON.stringify(this.d));
    } catch {
      // Archiviazione non disponibile (navigazione privata, spazio esaurito): si gioca lo stesso.
    }
  }

  /** Registra un dettaglio; restituisce true se è nuovo. */
  scopri(capitolo: number, id: string): boolean {
    const lista = (this.d.dettagli[capitolo] ??= []);
    if (lista.includes(id)) return false;
    lista.push(id);
    this.scrivi();
    return true;
  }

  dettagli(capitolo: number): string[] {
    return this.d.dettagli[capitolo] ?? [];
  }

  leggiVerso(capitolo: number, id: string): void {
    const lista = (this.d.versi[capitolo] ??= []);
    if (!lista.includes(id)) {
      lista.push(id);
      this.scrivi();
    }
  }

  versi(capitolo: number): string[] {
    return this.d.versi[capitolo] ?? [];
  }

  /** Registra una sensazione incontrata; `testo` undefined lascia l’appunto com’è. */
  senti(capitolo: number, id: string, testo?: string): void {
    const mappa = (this.d.sensazioni[capitolo] ??= {});
    if (testo !== undefined) mappa[id] = testo;
    else if (!(id in mappa)) mappa[id] = '';
    this.scrivi();
  }

  sensazioni(capitolo: number): Record<string, string> {
    return this.d.sensazioni[capitolo] ?? {};
  }

  rispondi(capitolo: number, id: string, testo: string): void {
    (this.d.risposte[capitolo] ??= {})[id] = testo;
    this.scrivi();
  }

  risposte(capitolo: number): Record<string, string> {
    return this.d.risposte[capitolo] ?? {};
  }

  ruolo(capitolo: number, ruolo: string): ProgressoRuolo {
    return this.d.ruoli[`${capitolo}:${ruolo}`] ?? { scena: 0, finito: false };
  }

  segnaScena(capitolo: number, ruolo: string, scena: number): void {
    const p = (this.d.ruoli[`${capitolo}:${ruolo}`] ??= { scena: 0, finito: false });
    p.scena = scena;
    this.scrivi();
  }

  segnaFinito(capitolo: number, ruolo: string): void {
    const p = (this.d.ruoli[`${capitolo}:${ruolo}`] ??= { scena: 0, finito: false });
    p.finito = true;
    p.scena = 0;
    this.scrivi();
  }

  get muto(): boolean {
    return this.d.muto;
  }
  set muto(v: boolean) {
    this.d.muto = v;
    this.scrivi();
  }

  get guidaVista(): boolean {
    return this.d.guidaVista;
  }
  set guidaVista(v: boolean) {
    this.d.guidaVista = v;
    this.scrivi();
  }

  azzera(): void {
    this.d = vuoto();
    this.scrivi();
  }
}
