/**
 * Schema dei contenuti.
 *
 * Regola del progetto: nessuna aggiunta al racconto. Ogni affermazione porta
 * la sua fonte e un livello di certezza, così chi gioca distingue sempre ciò
 * che la Bibbia dice da ciò che se ne deduce.
 */

import type { Stile } from '@/motore/figure';

export type { Stile };

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

/** «coperto»: sdraiato sotto una coperta. */
export type Posa = 'fermo' | 'cammina' | 'parla' | 'pugno' | 'indica' | 'alza' | 'sdraiato' | 'coperto' | 'proclama';

/** Una persona sulla linea del tempo. Anni a.E.V. negativi, E.V. positivi. */
export interface Vita {
  nome: string;
  nasce: number;
  muore: number;
}

/** Una scelta in una situazione di condotta. */
export interface Opzione {
  testo: string;
  /** La condotta che le fonti attribuiscono al personaggio: rivela `dettaglio`. */
  fedele?: boolean;
  dettaglio?: string;
  /** Per le altre scelte: come agivano altri, o perché non fu la sua condotta. */
  esito?: string;
  fonti?: Fonte[];
}

/**
 * Attività sul racconto. Nessuna cambia la storia: si risolvono tutte, e chi
 * sbaglia impara perché. `dettaglio`, dove previsto, viene rivelato alla fine
 * al posto della spiegazione, così la stessa cosa non si legge due volte.
 */
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
      /** Voci che non fanno parte della sequenza. */
      distrattori?: string[];
      spiegazione: string;
    }
  | {
      tipo: 'domanda';
      id: string;
      domanda: string;
      opzioni: string[];
      corretta: number;
      spiegazione?: string;
      fonti?: Fonte[];
      dettaglio?: string;
    }
  | {
      /**
       * Che cosa fai? Una situazione tipica del tempo, dichiarata come ricostruzione,
       * oppure (`narrata`) un momento che il racconto stesso descrive.
       */
      tipo: 'condotta';
      id: string;
      situazione: string;
      narrata?: boolean;
      /** Le fonti su cui si basa la ricostruzione, o che raccontano la situazione. */
      base: Fonte[];
      domanda?: string;
      opzioni: Opzione[];
    }
  | {
      /** Un versetto da completare: le parole mancanti tra [[ ]]. */
      tipo: 'completa';
      id: string;
      consegna: string;
      verso: string;
      testo: string;
      distrattori: string[];
    }
  | {
      /** Ogni voce va nella sua categoria. */
      tipo: 'classifica';
      id: string;
      consegna: string;
      categorie: [string, string];
      voci: { testo: string; cat: 0 | 1; fonti: Fonte[] }[];
      spiegazione?: string;
      dettaglio?: string;
    }
  | {
      /** Portare il cursore sull'anno giusto di una linea del tempo. */
      tipo: 'linea';
      id: string;
      consegna: string;
      persone: Vita[];
      meta: number;
      fonti: Fonte[];
      dettaglio?: string;
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
  | {
      t: 'narra';
      testo: string;
      titolo?: string;
      certezza?: Certezza;
      fonti?: Fonte[];
      arte?: string;
      /** Scena non narrata, costruita su ciò che `fonti` dicono di quel tempo. */
      ricostruzione?: boolean;
    }
  | { t: 'verso'; id: string; intro?: string; evidenzia?: string[] }
  | { t: 'dettaglio'; id: string }
  | { t: 'senti'; id: string }
  | { t: 'schema'; schema: Schema; intro?: string }
  | { t: 'attivita'; a: Attivita }
  | { t: 'fx'; fx: Fx };

/**
 * «esamina» è un indizio: non ha un segnale visibile da lontano, si scopre
 * avvicinandosi. Gli altri tipi mostrano il loro segnale.
 */
export type TipoPunto = 'osserva' | 'ascolta' | 'leggi' | 'agisci' | 'medita' | 'esamina';

/** Punto d'interesse nel mondo: ci si avvicina (o lo si tocca) e si interagisce. */
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
  gruppo?: 'rissa' | 'invoca' | 'danza';
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
  /** Variabili di scena (0..1). Il motore conosce «agitazione», «visione», «incalzo», «pioggia». */
  vars?: Record<string, number>;
  /**
   * Il luogo, per l’orecchio: vento (aperto), folla (abitato, con un brusio lontano),
   * quiete, notte, pioggia. Uccelli, grilli e gufi seguono la luce dell’ambiente;
   * fuoco, pecore, acqua, incudini, folle, passi e pioggia si sentono da soli dove
   * sono in scena (motore/suono.ts).
   */
  suono?: 'vento' | 'folla' | 'notte' | 'quiete' | 'pioggia';
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

/**
 * Uno schema di studio mostrato in una scheda: righe che si ripetono con una
 * formula (es. «poi morì» in Genesi 5), una riga può essere evidenziata.
 */
export interface Schema {
  righe: { nome: string; dato: string; formula: string; evidenza?: boolean }[];
  didascalia: string;
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
  /** Id della pubblicazione a cui appartiene: con il numero forma la chiave dei salvataggi. */
  pubblicazione: string;
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
  /** L’aspetto dei personaggi (`stile` di ruoli e attori), di solito quelli della pubblicazione. */
  personaggi: Record<string, Stile>;
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

/**
 * Una pubblicazione di base (per ora il libro «Cammina coraggiosamente con Dio»):
 * il suo indice completo e i capitoli già giocabili. Il gioco ne può avere più d’una.
 */
export interface Pubblicazione {
  /** Breve e stabile: compare negli indirizzi (#/coraggio/16) e nei salvataggi. */
  id: string;
  titolo: string;
  /** Come la si nomina nelle frasi e nei pulsanti: «il libro», «l’opuscolo»… */
  breve: string;
  url: string;
  /** Presentazione nella pagina dell’indice. */
  descrizione: string;
  /** L’indice completo, anche dei capitoli non ancora giocabili. */
  parti: ParteIndice[];
  capitoli: Capitolo[];
  /** Una scena senza punti che scorre dietro al titolo nella schermata iniziale. */
  vetrina: { capitolo: number; stile: string; scena: Base };
}

/** La scenografia di una scena, senza punti né sequenze (vedi contenuti/scenografia.ts). */
export type Base = Pick<Scena, 'larghezza' | 'ambiente' | 'seme' | 'oggetti' | 'suono'>;
