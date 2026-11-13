/**
 * Schema dei contenuti.
 *
 * Regola del progetto: nessuna aggiunta al racconto. Ogni affermazione porta
 * la sua fonte e un livello di certezza, così chi gioca distingue sempre ciò
 * che la Bibbia dice da ciò che se ne deduce.
 */

/** Quanto è certa un'affermazione, secondo le fonti stesse. */
export type Certezza =
  /** Lo dice il testo biblico. */
  | 'scritto'
  /** Si ricava con un calcolo dai dati biblici (età, date). */
  | 'numeri'
  /** Lo afferma o lo spiega il libro, o una pubblicazione che il libro cita. */
  | 'libro'
  /** Le pubblicazioni stesse lo presentano come probabile o possibile. */
  | 'sembra';

export interface Fonte {
  rif: string;
  url?: string;
}

export interface Dettaglio {
  id: string;
  titolo: string;
  testo: string;
  certezza: Certezza;
  fonti: Fonte[];
}

/** Domanda rivolta a chi gioca: non è un fatto del racconto. */
export interface Sensazione {
  id: string;
  domanda: string;
}

export interface Verso {
  rif: string;
  testo: string;
  note?: string[];
  url: string;
}

export type Posa = 'fermo' | 'cammina' | 'parla' | 'pugno' | 'indica' | 'alza' | 'sdraiato' | 'proclama';

export type Attivita =
  | {
      tipo: 'componi';
      id: string;
      consegna: string;
      rif: string;
      /** Pezzi nell'ordine corretto. */
      pezzi: string[];
    }
  | {
      tipo: 'trova';
      id: string;
      consegna: string;
      rif: string;
      /** Testo in cui cercare: le parti da trovare sono racchiuse tra [[ ]]. */
      testo: string;
      spiegazione: string;
    }
  | {
      tipo: 'ordina';
      id: string;
      consegna: string;
      /** Voci nell'ordine corretto. */
      voci: { testo: string; nota?: string }[];
      spiegazione: string;
    }
  | {
      tipo: 'domanda';
      id: string;
      domanda: string;
      opzioni: string[];
      corretta: number;
      spiegazione: string;
      fonti: Fonte[];
    };

export type Fx =
  | { k: 'var'; nome: string; a: number; dur?: number }
  | { k: 'posa'; chi: string; posa: Posa }
  | { k: 'vai'; chi: string; x: number; vel?: number; attendi?: boolean }
  | { k: 'nastro'; chi: string; testo: string; dur?: number }
  | { k: 'dissolvi'; a: number; dur?: number }
  | { k: 'attendi'; dur: number }
  | { k: 'visibile'; chi: string; v: boolean }
  | { k: 'camera'; x: number | null; dur?: number };

export type Passo =
  | { t: 'narra'; testo: string; titolo?: string; certezza?: Certezza; fonti?: Fonte[]; arte?: string }
  | { t: 'verso'; id: string; intro?: string; evidenzia?: string[] }
  | { t: 'dettaglio'; id: string }
  | { t: 'senti'; id: string }
  | { t: 'schema'; id: string; intro?: string }
  | { t: 'attivita'; a: Attivita }
  | { t: 'fx'; fx: Fx };

export type TipoPunto = 'osserva' | 'ascolta' | 'leggi' | 'agisci' | 'medita';

/** Punto d'interesse nel mondo: ci si avvicina e si interagisce. */
export interface Punto {
  id: string;
  x: number;
  /** Altezza del segnale sopra il terreno. */
  alt?: number;
  tipo: TipoPunto;
  etichetta: string;
  facoltativo?: boolean;
  /** Punti da completare prima che questo compaia. */
  richiede?: string[];
  passi: Passo[];
}

export interface Oggetto {
  tipo: string;
  x: number;
  piano?: 'fondo' | 'medio' | 'primo';
  scala?: number;
  variante?: number;
  testo?: string;
  /** Visibile in proporzione a una variabile di scena (0..1). */
  seVar?: string;
}

export interface Folla {
  x0: number;
  x1: number;
  n: number;
  seme: number;
  piano?: 'medio' | 'fondo';
  /** Frazioni 0..1 sul totale. */
  armati?: number;
  torce?: number;
  donne?: number;
  bimbi?: number;
  comportamento?: 'fermo' | 'vaga' | 'insegue' | 'cerca';
  /** Reagisce alla variabile «agitazione». */
  reagisce?: boolean;
  gruppo?: 'rissa' | 'invoca';
  /** Per «insegue»: distanza iniziale e finale dal bersaglio. */
  distanza?: [number, number];
  /** Per «insegue»: attore da seguire (se assente, chi gioca). */
  bersaglio?: string;
  seVar?: string;
}

export interface Attore {
  id: string;
  x: number;
  stile: string;
  posa?: Posa;
  verso?: 1 | -1;
  visibile?: boolean;
  /** Cammina lentamente avanti e indietro fra questi due punti. */
  percorso?: [number, number];
}

export interface Zona {
  x0: number;
  x1: number;
  tipo: 'pressione';
  forza: number;
}

export interface Scena {
  id: string;
  titolo: string;
  luogo: string;
  larghezza: number;
  ambiente: string;
  /** Ambiente verso cui sfumare quando la variabile «visione» sale a 1. */
  ambiente2?: string;
  seme: number;
  inizioX?: number;
  oggetti: Oggetto[];
  folle?: Folla[];
  attori?: Attore[];
  punti: Punto[];
  zone?: Zona[];
  ingresso?: Passo[];
  uscita?: Passo[];
  vars?: Record<string, number>;
  suono?: 'vento' | 'folla' | 'notte' | 'quiete';
}

export interface Ruolo {
  id: string;
  nome: string;
  titolo: string;
  descrizione: string;
  /** Su cosa si basa questo punto di vista: detto con chiarezza prima di iniziare. */
  fedelta: string;
  /** «cammina»: si muove un personaggio. «osserva»: si sposta lo sguardo sulla scena. */
  modo: 'cammina' | 'osserva';
  stile: string;
  durata: string;
  /** Titolo della schermata finale. */
  conclusione: string;
  scene: Scena[];
  epilogo: Passo[];
}

export interface DomandaStudio {
  id: string;
  testo: string;
  fonti?: Fonte[];
}

export interface SezioneStudio {
  id: string;
  titolo: string;
  nota?: string;
  domande: DomandaStudio[];
}

export interface Capitolo {
  numero: number;
  slug: string;
  nome: string;
  titolo: string;
  url: string;
  date?: string;
  passiDaLeggere: string[];
  versi: Record<string, Verso>;
  dettagli: Record<string, Dettaglio>;
  sensazioni: Record<string, Sensazione>;
  ruoli: Ruolo[];
  studio: SezioneStudio[];
  approfondisci: Fonte[];
}

export interface VoceIndice {
  numero: number;
  nome: string;
  titolo: string;
  url: string;
}

export interface ParteIndice {
  numero: number;
  titolo: string;
  periodo: string;
  capitoli: VoceIndice[];
}
