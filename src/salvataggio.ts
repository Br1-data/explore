/**
 * Progressi e quaderno di studio di chi gioca, salvati nel suo account dentro l’archivio:
 * lo script Google di `archivio/Codice.gs`, che tiene un JSON per utente.
 * Sul dispositivo resta solo la sessione (nome e chiave), per non rifare l’accesso.
 */

/** Indirizzo dell’app web dell’archivio (Apps Script → Distribuisci → App web). */
export const URL_ARCHIVIO = 'https://script.google.com/macros/s/DA-CONFIGURARE/exec';
const SESSIONE = 'nei-loro-panni.sessione';
/** Progressi salvati nel browser prima degli account: passano al primo account creato. */
const VECCHI = 'nei-loro-panni.v1';
const SENZA_RETE = 'Non riesco a raggiungere l’archivio dei salvataggi. Controlla la connessione e riprova.';

interface Sessione {
  utente: string;
  chiave: string;
}

interface Risposta {
  ok: boolean;
  errore?: string;
  chiave?: string;
  dati?: Partial<Dati> | null;
}

async function archivio(corpo: object, chiudendo = false): Promise<Risposta> {
  // Corpo in testo semplice: niente richiesta preliminare CORS, che Apps Script non gestisce.
  const r = await fetch(URL_ARCHIVIO, { method: 'POST', body: JSON.stringify(corpo), keepalive: chiudendo });
  return (await r.json()) as Risposta;
}

function locale<T>(chiave: string): T | null {
  try {
    return JSON.parse(localStorage.getItem(chiave) ?? 'null') as T | null;
  } catch {
    return null;
  }
}

function ricorda(chiave: string, valore: unknown): void {
  try {
    if (valore === null) localStorage.removeItem(chiave);
    else localStorage.setItem(chiave, JSON.stringify(valore));
  } catch {
    // Archiviazione del browser non disponibile: si rifarà l’accesso la prossima volta.
  }
}

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

function completa(d: Partial<Dati> | null | undefined): Dati {
  return d?.v === 1 ? { ...vuoto(), ...d } : vuoto();
}

export class Salvataggio {
  private d: Dati = vuoto();
  private sessione: Sessione | null = null;
  private sporco = false;
  private inVolo = false;
  private timer = 0;

  /** Chi ha fatto l’accesso; null finché non entra nessuno. */
  get utente(): string | null {
    return this.sessione?.utente ?? null;
  }

  /** Riprende la sessione di questo dispositivo; restituisce l’avviso da mostrare, se c’è. */
  async riprendi(): Promise<string | null> {
    const s = locale<Sessione>(SESSIONE);
    if (!s) return null;
    try {
      const r = await archivio({ azione: 'entra', ...s });
      if (!r.ok) {
        ricorda(SESSIONE, null);
        return r.errore ?? null;
      }
      this.apri(s, r.dati);
      return null;
    } catch {
      return SENZA_RETE;
    }
  }

  /** Entra o crea l’account; restituisce l’errore da mostrare, o null se è andata. */
  async entra(utente: string, password: string, nuovo: boolean): Promise<string | null> {
    const vecchi = nuovo ? locale<Dati>(VECCHI) : null;
    try {
      const r = await archivio({ azione: nuovo ? 'registra' : 'entra', utente, password, dati: completa(vecchi) });
      if (!r.ok || !r.chiave) return r.errore ?? 'Qualcosa non è andato: riprova.';
      this.apri({ utente: utente.trim().toLowerCase(), chiave: r.chiave }, r.dati);
      if (vecchi) ricorda(VECCHI, null);
      return null;
    } catch {
      return SENZA_RETE;
    }
  }

  esci(): void {
    this.salvaOra(true);
    this.sessione = null;
    ricorda(SESSIONE, null);
  }

  private apri(s: Sessione, dati: Partial<Dati> | null | undefined): void {
    this.sessione = s;
    this.d = completa(dati);
    ricorda(SESSIONE, s);
  }

  private scrivi(): void {
    this.sporco = true;
    clearTimeout(this.timer);
    this.timer = window.setTimeout(() => this.salvaOra(), 1500);
  }

  /** Manda subito i dati all’archivio; `chiudendo` se la pagina sta per essere lasciata. */
  salvaOra(chiudendo = false): void {
    clearTimeout(this.timer);
    if (!this.sporco || !this.sessione || this.inVolo) return;
    this.sporco = false;
    this.inVolo = true;
    // Uno alla volta: un salvataggio vecchio non può arrivare dopo uno nuovo.
    archivio({ azione: 'salva', ...this.sessione, dati: this.d }, chiudendo)
      .then((r) => {
        if (!r.ok) throw new Error(r.errore);
      })
      .catch(() => {
        this.sporco = true;
      })
      .finally(() => {
        this.inVolo = false;
        if (this.sporco) this.timer = window.setTimeout(() => this.salvaOra(), 3000);
      });
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
