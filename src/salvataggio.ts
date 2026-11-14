/**
 * Progressi e quaderno di studio di chi gioca, salvati nel suo account dentro l’archivio:
 * lo script Google di `archivio/Codice.gs`, che tiene un JSON per utente.
 * Sul dispositivo resta solo la sessione (nome e chiave), per non rifare l’accesso.
 */

/** Indirizzo dell’app web dell’archivio (Apps Script → Distribuisci → App web). */
export const URL_ARCHIVIO = 'https://script.google.com/macros/s/AKfycbxqt4EBY6zrTTL0tQkDci5eE1J4KxEKFf_q27Wm-2XA-FXnWeuk2WfPmtpqFjfouhY-/exec';
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
  dati?: { v?: number } | null;
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

/**
 * I dati di un account. Le mappe sono per capitolo, con la chiave «pubblicazione:numero»
 * (es. «coraggio:16»); i progressi dei ruoli con «pubblicazione:numero:ruolo».
 */
interface Dati {
  v: 2;
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
  return { v: 2, dettagli: {}, sensazioni: {}, risposte: {}, versi: {}, ruoli: {}, muto: false, guidaVista: false };
}

/** Nella versione 1 c’era un solo libro e le chiavi erano solo numeri («16», «16:barac»). */
const PRIMA_PUBBLICAZIONE = 'coraggio';

/** Porta dati di qualunque versione a quella attuale; ciò che non si riconosce diventa vuoto. */
export function normalizza(d: { v?: number } | null | undefined): Dati {
  if (d?.v === 1) {
    const v1 = d as Omit<Dati, 'v'>;
    const prefissa = <T>(m: Record<string, T> | undefined): Record<string, T> =>
      Object.fromEntries(Object.entries(m ?? {}).map(([k, x]) => [`${PRIMA_PUBBLICAZIONE}:${k}`, x]));
    d = {
      ...v1,
      v: 2,
      dettagli: prefissa(v1.dettagli),
      sensazioni: prefissa(v1.sensazioni),
      risposte: prefissa(v1.risposte),
      versi: prefissa(v1.versi),
      ruoli: prefissa(v1.ruoli),
    } as Dati;
  }
  return d?.v === 2 ? { ...vuoto(), ...(d as Partial<Dati>) } : vuoto();
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
    const vecchi = nuovo ? locale<{ v?: number }>(VECCHI) : null;
    try {
      const r = await archivio({ azione: nuovo ? 'registra' : 'entra', utente, password, dati: normalizza(vecchi) });
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

  private apri(s: Sessione, dati: { v?: number } | null | undefined): void {
    this.sessione = s;
    this.d = normalizza(dati);
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
  scopri(cap: string, id: string): boolean {
    const lista = (this.d.dettagli[cap] ??= []);
    if (lista.includes(id)) return false;
    lista.push(id);
    this.scrivi();
    return true;
  }

  dettagli(cap: string): string[] {
    return this.d.dettagli[cap] ?? [];
  }

  leggiVerso(cap: string, id: string): void {
    const lista = (this.d.versi[cap] ??= []);
    if (!lista.includes(id)) {
      lista.push(id);
      this.scrivi();
    }
  }

  versi(cap: string): string[] {
    return this.d.versi[cap] ?? [];
  }

  /** Registra una sensazione incontrata; `testo` undefined lascia l’appunto com’è. */
  senti(cap: string, id: string, testo?: string): void {
    const mappa = (this.d.sensazioni[cap] ??= {});
    if (testo !== undefined) mappa[id] = testo;
    else if (!(id in mappa)) mappa[id] = '';
    this.scrivi();
  }

  sensazioni(cap: string): Record<string, string> {
    return this.d.sensazioni[cap] ?? {};
  }

  rispondi(cap: string, id: string, testo: string): void {
    (this.d.risposte[cap] ??= {})[id] = testo;
    this.scrivi();
  }

  risposte(cap: string): Record<string, string> {
    return this.d.risposte[cap] ?? {};
  }

  ruolo(cap: string, ruolo: string): ProgressoRuolo {
    return this.d.ruoli[`${cap}:${ruolo}`] ?? { scena: 0, finito: false };
  }

  segnaScena(cap: string, ruolo: string, scena: number): void {
    const p = (this.d.ruoli[`${cap}:${ruolo}`] ??= { scena: 0, finito: false });
    p.scena = scena;
    this.scrivi();
  }

  segnaFinito(cap: string, ruolo: string): void {
    const p = (this.d.ruoli[`${cap}:${ruolo}`] ??= { scena: 0, finito: false });
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
