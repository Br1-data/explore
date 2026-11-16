/**
 * Suoni del mondo, generati al momento con Web Audio (nessun file).
 *
 * Regola (decisione del committente): si sente soltanto ciò che in quella scena si
 * poteva sentire davvero — vento, pioggia, tuoni, voci, passi, fuoco, animali,
 * tamburelli e canti dove il racconto li mette — e lo si sente dov’è la sua
 * sorgente: più forte e più nitido da vicino, a sinistra o a destra. Niente musica
 * di sottofondo né note sintetiche. Anche i segnali dell’interfaccia usano suoni
 * dell’epoca: il fruscio di un rotolo, una corda pizzicata.
 */

/** Che cosa produce suono in una scena: viene da oggetti, folle e attori. */
export type TipoSorgente =
  | 'fuoco'
  | 'torcia'
  | 'pecora'
  | 'acqua'
  | 'incudine'
  | 'folla'
  | 'rissa'
  | 'invoca'
  | 'danza'
  | 'insegue'
  | 'passi'
  /** I 300 intorno all’accampamento: corni e grida di guerra (Giudici 7:20-22). */
  | 'assalto'
  /** Un accampamento che fugge: gente che corre e urla (Giudici 7:21). */
  | 'fuga';

/** Gli oggetti di scena che suonano, e come. */
export const SUONI_OGGETTI: Record<string, TipoSorgente> = {
  fuoco: 'fuoco',
  // Il fuoco degli olocausti crepita come un fuoco (Genesi 8:20).
  altare: 'fuoco',
  torcia: 'torcia',
  pecora: 'pecora',
  acqua: 'acqua',
  incudine: 'incudine',
};

export interface SorgenteSonora {
  /** Identifica la sorgente da un aggiornamento all’altro. */
  chiave: string;
  tipo: TipoSorgente;
  x: number;
  /** 0..1: quante persone, quanto è visibile. */
  forza: number;
  /** Una folla che reagisce a chi parla (variabile «agitazione»). */
  agitata?: boolean;
}

/** Ciò che si sente in un momento della scena. */
export interface Paesaggio {
  /** Il luogo: vento (aperto), folla (abitato), quiete, notte, pioggia. */
  base: string;
  luce: 'giorno' | 'crepuscolo' | 'notte';
  /** Dove si trova chi ascolta e quanto è larga la vista (unità di scena). */
  ascolto: number;
  vista: number;
  pioggia: number;
  agitazione: number;
  /** Uccelli, grilli e gufi del luogo (0..1): 0 dove non c’è più vita, es. dopo il diluvio. */
  animali: number;
  sorgenti: SorgenteSonora[];
}

// ————————————————————————— Ricette —————————————————————————

/** Ciò che serve alle ricette: il contesto e due rumori già pronti. */
export interface Banco {
  ac: BaseAudioContext;
  bianco: AudioBuffer;
  marrone: AudioBuffer;
}

export function creaBanco(ac: BaseAudioContext): Banco {
  const n = ac.sampleRate * 2;
  const bianco = ac.createBuffer(1, n, ac.sampleRate);
  const marrone = ac.createBuffer(1, n, ac.sampleRate);
  const b = bianco.getChannelData(0);
  const m = marrone.getChannelData(0);
  let ultimo = 0;
  for (let i = 0; i < n; i++) {
    b[i] = Math.random() * 2 - 1;
    ultimo = (ultimo + 0.02 * b[i]) / 1.02;
    m[i] = ultimo * 3.5;
  }
  return { ac, bianco, marrone };
}

const caso = (a: number, b: number): number => a + Math.random() * (b - a);
const scegli = <T>(v: T[]): T => v[Math.floor(Math.random() * v.length)];

/** Un inviluppo: sale in `attacco`, resta, scende a zero entro `dur`. */
function inviluppo(g: GainNode, t: number, vol: number, dur: number, attacco = 0.005, coda = dur * 0.6): void {
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + attacco);
  g.gain.setValueAtTime(vol, t + Math.max(attacco, dur - coda));
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
}

/** Un soffio di rumore filtrato: la materia prima di passi, gocce, crepitii, tuoni. */
function soffio(
  b: Banco,
  dest: AudioNode,
  t: number,
  dur: number,
  o: { vol: number; filtro?: BiquadFilterType; f?: number; q?: number; marrone?: boolean; attacco?: number; coda?: number },
): void {
  const { ac } = b;
  const src = ac.createBufferSource();
  src.buffer = o.marrone ? b.marrone : b.bianco;
  const g = ac.createGain();
  inviluppo(g, t, o.vol, dur, o.attacco ?? 0.002, o.coda);
  let catena: AudioNode = src;
  if (o.filtro) {
    const f = ac.createBiquadFilter();
    f.type = o.filtro;
    f.frequency.value = o.f ?? 1000;
    f.Q.value = o.q ?? 0.7;
    catena = catena.connect(f);
  }
  catena.connect(g).connect(dest);
  src.start(t, Math.random() * 1.5);
  src.stop(t + dur + 0.05);
}

/** Un fischio breve che scivola di frequenza (uccelli, grilli, gorgoglii). */
function fischio(b: Banco, dest: AudioNode, t: number, da: number, a: number, dur: number, vol: number): void {
  const { ac } = b;
  const o = ac.createOscillator();
  o.frequency.setValueAtTime(da, t);
  o.frequency.exponentialRampToValueAtTime(a, t + dur);
  const g = ac.createGain();
  inviluppo(g, t, vol, dur, Math.min(0.01, dur / 4), dur * 0.5);
  o.connect(g).connect(dest);
  o.start(t);
  o.stop(t + dur + 0.02);
}

/** Formanti approssimative delle vocali (voce adulta). */
const VOCALI: Record<string, [number, number]> = {
  a: [760, 1260],
  e: [480, 1850],
  i: [330, 2250],
  o: [520, 920],
  u: [360, 780],
};

/** Una sillaba di voce umana: corde vocali (dente di sega) filtrate dalle formanti. */
export function sillaba(
  b: Banco,
  dest: AudioNode,
  t: number,
  o: { f0: number; dur: number; vol: number; vocale?: string; scivola?: number; donna?: boolean; consonante?: boolean },
): void {
  const { ac } = b;
  const osc = ac.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(o.f0, t);
  osc.frequency.linearRampToValueAtTime(o.f0 * (1 + (o.scivola ?? 0)), t + o.dur);
  const [f1, f2] = VOCALI[o.vocale ?? scegli(Object.keys(VOCALI))];
  const k = o.donna ? 1.15 : 1;
  const voce = ac.createGain();
  inviluppo(voce, t, o.vol, o.dur, 0.035, Math.min(0.12, o.dur * 0.4));
  // Le formanti strette tolgono molta energia: il guadagno la restituisce.
  for (const [f, q, livello] of [
    [f1 * k, 5, 4],
    [f2 * k, 8, 2.2],
  ]) {
    const bp = ac.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = f;
    bp.Q.value = q;
    const g = ac.createGain();
    g.gain.value = livello;
    osc.connect(bp).connect(g).connect(voce);
  }
  voce.connect(dest);
  osc.start(t);
  osc.stop(t + o.dur + 0.03);
  if (o.consonante) soffio(b, dest, t - 0.03, 0.04, { vol: o.vol * 0.35, filtro: 'highpass', f: 3000 });
}

/** Corde pizzicate (Karplus-Strong): la cetra, che esisteva fin dai giorni di Genesi 4:21. */
const corde = new WeakMap<BaseAudioContext, Map<string, AudioBuffer>>();
function corda(ac: BaseAudioContext, f: number, smorzata: boolean): AudioBuffer {
  let cache = corde.get(ac);
  if (!cache) corde.set(ac, (cache = new Map()));
  const chiave = `${f}:${smorzata}`;
  const pronta = cache.get(chiave);
  if (pronta) return pronta;
  const sr = ac.sampleRate;
  const dur = smorzata ? 0.35 : 1.6;
  const n = Math.floor(sr * dur);
  const periodo = Math.max(2, Math.round(sr / f));
  const buf = ac.createBuffer(1, n, sr);
  const y = buf.getChannelData(0);
  let prec = 0;
  for (let i = 0; i < periodo; i++) {
    // Un pizzico morbido: rumore già un poco filtrato.
    prec = prec * 0.5 + (Math.random() * 2 - 1) * 0.5;
    y[i] = prec;
  }
  const perdita = smorzata ? 0.965 : 0.996;
  for (let i = periodo; i < n; i++) y[i] = perdita * 0.5 * (y[i - periodo] + (i > periodo ? y[i - periodo - 1] : 0));
  cache.set(chiave, buf);
  return buf;
}

export function pizzico(b: Banco, dest: AudioNode, t: number, f: number, vol: number, smorzata = false): void {
  const src = b.ac.createBufferSource();
  src.buffer = corda(b.ac, f, smorzata);
  const g = b.ac.createGain();
  g.gain.value = vol;
  src.connect(g).connect(dest);
  src.start(t);
}

/** Le ricette degli eventi sonori, una per ciascuna cosa che si sente. */
export const EVENTI = {
  passo(b: Banco, dest: AudioNode, t: number, vol: number, bagnato = false): void {
    // Un sandalo sulla terra battuta: un tonfo e un po’ di sabbia.
    fischio(b, dest, t, 110, 55, 0.07, vol * 0.5);
    soffio(b, dest, t, 0.05, { vol: vol * 0.35, filtro: 'bandpass', f: 1700, q: 0.9 });
    if (bagnato) soffio(b, dest, t + 0.01, 0.14, { vol: vol * 0.45, filtro: 'bandpass', f: 850, q: 1.1, coda: 0.1 });
  },
  uccello(b: Banco, dest: AudioNode, t: number, vol: number): number {
    // Una frase di pochi cinguettii.
    const base = caso(2800, 4600);
    const n = Math.floor(caso(2, 7));
    let tt = t;
    for (let i = 0; i < n; i++) {
      const dur = caso(0.04, 0.11);
      fischio(b, dest, tt, base * caso(0.85, 1.15), base * caso(0.7, 1.35), dur, vol * caso(0.6, 1));
      tt += dur + caso(0.03, 0.09);
    }
    return tt - t;
  },
  grillo(b: Banco, dest: AudioNode, t: number, vol: number): void {
    const f = caso(4200, 4800);
    for (let i = 0; i < 3; i++) fischio(b, dest, t + i * 0.042, f, f * 1.01, 0.02, vol);
  },
  gufo(b: Banco, dest: AudioNode, t: number, vol: number): void {
    for (const [d, dur] of [
      [0, 0.38],
      [0.75, 0.22],
      [1.02, 0.42],
    ]) {
      fischio(b, dest, t + d, 380, 340, dur, vol);
    }
  },
  goccia(b: Banco, dest: AudioNode, t: number, vol: number): void {
    soffio(b, dest, t, caso(0.006, 0.018), { vol, filtro: 'bandpass', f: caso(1800, 5200), q: 2 });
  },
  tuono(b: Banco, dest: AudioNode, t: number, vol: number): void {
    // Un brontolio lontano: il temporale del giorno della battaglia.
    const dur = caso(3.5, 6);
    soffio(b, dest, t, dur, { vol, filtro: 'lowpass', f: caso(140, 240), q: 0.5, marrone: true, attacco: 0.25, coda: dur * 0.75 });
    soffio(b, dest, t + caso(0.4, 1.2), dur * 0.6, { vol: vol * 0.7, filtro: 'lowpass', f: 320, marrone: true, attacco: 0.1 });
  },
  crepitio(b: Banco, dest: AudioNode, t: number, vol: number): void {
    const forte = Math.random() < 0.08;
    soffio(b, dest, t, forte ? 0.02 : caso(0.003, 0.008), { vol: vol * (forte ? 1.8 : caso(0.4, 1)), filtro: 'highpass', f: forte ? 900 : 1800 });
  },
  belato(b: Banco, dest: AudioNode, t: number, vol: number): void {
    // «Beee-eh»: voce acuta e tremolante di una pecora.
    const { ac } = b;
    const dur = caso(0.55, 0.9);
    const osc = ac.createOscillator();
    osc.type = 'sawtooth';
    const f0 = caso(300, 380);
    osc.frequency.setValueAtTime(f0, t);
    osc.frequency.linearRampToValueAtTime(f0 * 0.85, t + dur);
    const tremolo = ac.createOscillator();
    tremolo.frequency.value = caso(6, 8);
    const profondita = ac.createGain();
    profondita.gain.value = vol * 0.45;
    const g = ac.createGain();
    inviluppo(g, t, vol * 0.55, dur, 0.05, dur * 0.4);
    tremolo.connect(profondita).connect(g.gain);
    const f1 = ac.createBiquadFilter();
    f1.type = 'bandpass';
    f1.frequency.value = 620;
    f1.Q.value = 4;
    const f2 = ac.createBiquadFilter();
    f2.type = 'bandpass';
    f2.frequency.value = 1750;
    f2.Q.value = 6;
    osc.connect(f1).connect(g);
    osc.connect(f2).connect(g);
    g.connect(dest);
    osc.start(t);
    tremolo.start(t);
    osc.stop(t + dur + 0.05);
    tremolo.stop(t + dur + 0.05);
  },
  colpo(b: Banco, dest: AudioNode, t: number, vol: number): void {
    // Martello su metallo: parziali inarmoniche che si spengono.
    for (const [f, k] of [
      [1530, 1],
      [2480, 0.6],
      [3920, 0.4],
      [5300, 0.25],
    ]) {
      fischio(b, dest, t, f, f * 0.998, caso(0.35, 0.6), vol * k * 0.4);
    }
    soffio(b, dest, t, 0.02, { vol: vol * 0.6, filtro: 'highpass', f: 2000 });
  },
  tamburo(b: Banco, dest: AudioNode, t: number, vol: number): void {
    // Il colpo grave al centro del tamburello.
    fischio(b, dest, t, 115, 62, 0.32, vol);
    soffio(b, dest, t, 0.05, { vol: vol * 0.5, filtro: 'bandpass', f: 800, q: 1 });
  },
  tek(b: Banco, dest: AudioNode, t: number, vol: number): void {
    // Il colpo secco sul bordo.
    soffio(b, dest, t, 0.035, { vol, filtro: 'bandpass', f: 2800, q: 1.4 });
    fischio(b, dest, t, 420, 380, 0.03, vol * 0.4);
  },
  battimano(b: Banco, dest: AudioNode, t: number, vol: number): void {
    for (let i = 0; i < 3; i++) soffio(b, dest, t + i * 0.006 + caso(0, 0.004), 0.012, { vol, filtro: 'bandpass', f: 1300, q: 1.2 });
  },
  corno(b: Banco, dest: AudioNode, t: number, vol: number): number {
    // Un corno di montone: una nota rauca che sale, si regge e a volte salta più in alto.
    const { ac } = b;
    const dur = caso(1.1, 1.9);
    const f0 = caso(190, 250);
    const osc = ac.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(f0 * 0.72, t);
    osc.frequency.exponentialRampToValueAtTime(f0, t + 0.14);
    if (Math.random() < 0.5) {
      osc.frequency.setValueAtTime(f0, t + dur * 0.55);
      osc.frequency.exponentialRampToValueAtTime(f0 * 1.5, t + dur * 0.62);
    }
    const vibrato = ac.createOscillator();
    vibrato.frequency.value = caso(4, 6);
    const ampiezza = ac.createGain();
    ampiezza.gain.value = f0 * 0.012;
    vibrato.connect(ampiezza).connect(osc.frequency);
    const corpo = ac.createBiquadFilter();
    corpo.type = 'bandpass';
    corpo.frequency.value = caso(800, 1000);
    corpo.Q.value = 1.3;
    const morbido = ac.createBiquadFilter();
    morbido.type = 'lowpass';
    morbido.frequency.value = 2600;
    const g = ac.createGain();
    inviluppo(g, t, vol, dur, 0.07, 0.18);
    osc.connect(corpo).connect(morbido).connect(g).connect(dest);
    osc.start(t);
    vibrato.start(t);
    osc.stop(t + dur + 0.05);
    vibrato.stop(t + dur + 0.05);
    // Il fiato.
    soffio(b, dest, t, dur, { vol: vol * 0.08, filtro: 'bandpass', f: 1300, q: 0.8, attacco: 0.06 });
    return dur;
  },
  cocci(b: Banco, dest: AudioNode, t: number, vol: number): void {
    // Una giara di terracotta che va in pezzi: un colpo sordo e una pioggia di frammenti.
    fischio(b, dest, t, 160, 70, 0.09, vol * 0.7);
    soffio(b, dest, t, 0.06, { vol: vol * 0.8, filtro: 'bandpass', f: 900, q: 0.8 });
    const n = Math.floor(caso(5, 9));
    for (let i = 0; i < n; i++) {
      soffio(b, dest, t + caso(0.01, 0.35), caso(0.008, 0.03), { vol: vol * caso(0.25, 0.6), filtro: 'bandpass', f: caso(1800, 6000), q: caso(2, 5) });
    }
  },
  fruscio(b: Banco, dest: AudioNode, t: number, vol: number): void {
    // Un rotolo che si svolge.
    for (let i = 0; i < 3; i++) {
      soffio(b, dest, t + i * caso(0.025, 0.04), caso(0.02, 0.045), { vol: vol * caso(0.6, 1), filtro: 'bandpass', f: caso(3200, 5500), q: 0.8 });
    }
  },
};

// ————————————————————————— Il mixer —————————————————————————

interface Voce {
  tipo: TipoSorgente;
  ingresso: GainNode;
  filtro: BiquadFilterNode;
  pan: StereoPannerNode | null;
  volume: number;
  agitata: boolean;
  /** Prossimo evento in programma (tempo del contesto audio). */
  prossimo: number;
  /** Per le sorgenti ritmiche: a che punto del giro si è. */
  giro: number;
  continui: AudioScheduledSourceNode[];
}

interface Letto {
  vento: GainNode;
  fischioVento: GainNode;
  pioggia: GainNode;
  pioggiaCorpo: GainNode;
  nodi: AudioScheduledSourceNode[];
}

/** Volume di base di ogni sorgente, prima della distanza. */
const VOLUMI: Record<TipoSorgente, number> = {
  fuoco: 0.4,
  torcia: 0.22,
  pecora: 0.5,
  acqua: 0.55,
  incudine: 0.35,
  folla: 0.5,
  rissa: 0.6,
  invoca: 0.55,
  danza: 0.6,
  insegue: 0.6,
  passi: 0.35,
  assalto: 0.7,
  fuga: 0.65,
};

/** Quanto vento si sente in ciascun luogo. */
const VENTO: Record<string, number> = { vento: 0.15, folla: 0.06, quiete: 0.05, notte: 0.045, pioggia: 0.14 };

export class Suono {
  private ac: AudioContext | null = null;
  private banco: Banco | null = null;
  private uscita: GainNode | null = null;
  private mondo: GainNode | null = null;
  private interfaccia: GainNode | null = null;
  private letto: Letto | null = null;
  private voci = new Map<string, Voce>();
  private paesaggioCorrente: Paesaggio | null = null;
  private prossimi: Record<string, number> = {};
  private punti: AudioNode[] = [];
  private lontani: AudioNode[] = [];
  /** I suoni singoli (fx `suono`) sentiti finora, in ordine: li controllano le prove automatiche. */
  private uditi: string[] = [];
  private _muto = false;

  constructor(muto: boolean) {
    this._muto = muto;
  }

  get muto(): boolean {
    return this._muto;
  }

  set muto(v: boolean) {
    this._muto = v;
    if (this.uscita && this.ac) this.uscita.gain.setTargetAtTime(v ? 0 : 0.9, this.ac.currentTime, 0.08);
  }

  /** Da chiamare dopo un gesto di chi gioca: i browser non avviano l’audio prima. */
  sblocca(): void {
    if (this.ac) {
      if (this.ac.state === 'suspended') void this.ac.resume();
      return;
    }
    const Classe = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Classe) return;
    try {
      this.ac = new Classe();
    } catch {
      return;
    }
    const ac = this.ac;
    this.banco = creaBanco(ac);
    this.uscita = ac.createGain();
    this.uscita.gain.value = this._muto ? 0 : 0.9;
    const limitatore = ac.createDynamicsCompressor();
    limitatore.threshold.value = -10;
    limitatore.ratio.value = 6;
    this.uscita.connect(limitatore).connect(ac.destination);
    this.mondo = ac.createGain();
    this.mondo.connect(this.uscita);
    this.interfaccia = ac.createGain();
    this.interfaccia.gain.value = 0.7;
    this.interfaccia.connect(this.uscita);
    this.letto = this.creaLetto();
    this.creaPunti();
    // L’audio vive quanto la pagina: l’orologio non va mai fermato.
    window.setInterval(() => this.aggiorna(), 60);
  }

  sospendi(v: boolean): void {
    if (!this.ac) return;
    if (v && this.ac.state === 'running') void this.ac.suspend();
    if (!v && this.ac.state === 'suspended') void this.ac.resume();
  }

  /** Ciò che si sente ora nella scena (lo aggiorna la partita più volte al secondo). */
  paesaggio(p: Paesaggio | null): void {
    this.paesaggioCorrente = p;
  }

  /** Fuori dal gioco: si spegne tutto, con dolcezza. */
  silenzio(): void {
    this.paesaggioCorrente = null;
  }

  /** Per le prove automatiche: che cosa sta suonando adesso, e i suoni singoli già sentiti. */
  istantanea(): { stato: string; luogo: string | null; luce: string | null; pioggia: number; sorgenti: string[]; eventi: string[] } {
    const p = this.paesaggioCorrente;
    return {
      stato: this.ac?.state ?? 'spento',
      luogo: p?.base ?? null,
      luce: p?.luce ?? null,
      pioggia: p ? Math.max(p.pioggia, p.base === 'pioggia' ? 1 : 0) : 0,
      sorgenti: [...new Set([...this.voci.values()].map((v) => v.tipo))].sort(),
      eventi: [...this.uditi],
    };
  }

  /** Un suono che avviene una volta, nel punto `x` della scena: più forte e centrato se è vicino. */
  evento(cosa: 'corno' | 'giare', x: number): void {
    this.uditi = [...this.uditi.slice(-49), cosa];
    const p = this.paesaggioCorrente;
    if (!this.ac || !this.banco || !this.mondo || !p || this._muto) return;
    const ac = this.ac;
    const vicinanza = Math.max(0.15, 1 - Math.abs(x - p.ascolto) / (p.vista * 1.1));
    const g = ac.createGain();
    g.gain.value = vicinanza;
    let catena: AudioNode = g;
    if (ac.createStereoPanner) {
      const pan = ac.createStereoPanner();
      pan.pan.value = Math.max(-1, Math.min(1, (x - p.ascolto) / (p.vista * 0.6))) * 0.85;
      catena = catena.connect(pan);
    }
    catena.connect(this.mondo);
    const t = ac.currentTime + 0.03;
    if (cosa === 'corno') EVENTI.corno(this.banco, g, t, 0.5);
    // Più giare che vanno in pezzi quasi insieme.
    else for (let i = 0; i < 5; i++) EVENTI.cocci(this.banco, g, t + caso(0, 0.25), 0.45);
    window.setTimeout(() => g.disconnect(), 4000);
  }

  // ——— Il letto: vento e pioggia, che ci sono sempre e cambiano intensità ———

  private creaLetto(): Letto {
    const ac = this.ac!;
    const b = this.banco!;
    const nodi: AudioScheduledSourceNode[] = [];
    const strato = (buf: AudioBuffer, tipo: BiquadFilterType, f: number, q: number, dopo?: [BiquadFilterType, number]): GainNode => {
      const src = ac.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      const filtro = ac.createBiquadFilter();
      filtro.type = tipo;
      filtro.frequency.value = f;
      filtro.Q.value = q;
      const g = ac.createGain();
      g.gain.value = 0;
      let catena: AudioNode = src.connect(filtro);
      if (dopo) {
        const f2 = ac.createBiquadFilter();
        f2.type = dopo[0];
        f2.frequency.value = dopo[1];
        catena = catena.connect(f2);
      }
      catena.connect(g).connect(this.mondo!);
      src.start(0, Math.random() * 1.5);
      nodi.push(src);
      return g;
    };
    return {
      vento: strato(b.marrone, 'lowpass', 520, 0.6),
      fischioVento: strato(b.bianco, 'bandpass', 1150, 2.2),
      pioggia: strato(b.bianco, 'highpass', 900, 0.5, ['lowpass', 7000]),
      pioggiaCorpo: strato(b.marrone, 'lowpass', 420, 0.5),
      nodi,
    };
  }

  // ——— L’aggiornamento: distanze, eventi in programma ———

  private aggiorna(): void {
    const ac = this.ac;
    const b = this.banco;
    const letto = this.letto;
    if (!ac || !b || !letto || !this.mondo || ac.state !== 'running') return;
    const ora = ac.currentTime;
    const p = this.paesaggioCorrente;
    const avanti = ora + 0.2;

    // Vento a raffiche, pioggia secondo la scena.
    const pioggia = p ? Math.max(p.pioggia, p.base === 'pioggia' ? 1 : 0) : 0;
    const vento = p ? VENTO[p.base] ?? 0.08 : 0;
    if (this.dovuto('raffica', ora)) {
      const raffica = vento * caso(0.45, 1.35) + pioggia * 0.06;
      letto.vento.gain.setTargetAtTime(raffica, ora, caso(0.8, 2));
      letto.fischioVento.gain.setTargetAtTime(raffica * caso(0.05, 0.25), ora, caso(0.8, 2));
      this.prossimi['raffica'] = ora + caso(1.2, 3.5);
    }
    letto.pioggia.gain.setTargetAtTime(pioggia * 0.13, ora, 0.6);
    letto.pioggiaCorpo.gain.setTargetAtTime(pioggia * 0.18, ora, 0.6);

    if (p && !this._muto) this.ambiente(p, pioggia, ora, avanti);
    this.sorgenti(p, ora, avanti);
  }

  private dovuto(nome: string, ora: number): boolean {
    return (this.prossimi[nome] ?? 0) <= ora;
  }

  /** Suoni sparsi del luogo: uccelli di giorno, grilli e gufi di notte, gocce, tuoni, voci lontane. */
  private ambiente(p: Paesaggio, pioggia: number, ora: number, avanti: number): void {
    const b = this.banco!;
    const sparso = (): AudioNode => scegli(this.punti);
    if (this.dovuto('uccelli', ora)) {
      const quanti = (p.luce === 'giorno' ? 1 : p.luce === 'crepuscolo' ? 0.45 : 0) * p.animali;
      const tempo = pioggia > 0.25 || quanti === 0 ? 0 : EVENTI.uccello(b, sparso(), ora + 0.05, 0.03 * quanti);
      this.prossimi['uccelli'] = ora + tempo + caso(2.5, 8) / Math.max(0.3, quanti);
    }
    if (this.dovuto('grilli', ora)) {
      const quanti = (p.luce === 'notte' ? 1 : p.luce === 'crepuscolo' ? 0.35 : 0) * p.animali;
      if (quanti > 0 && pioggia < 0.3) {
        for (let i = 0; i < 3; i++) if (Math.random() < quanti) EVENTI.grillo(b, sparso(), ora + caso(0.05, 0.5), 0.016);
      }
      this.prossimi['grilli'] = ora + caso(0.55, 1.1);
    }
    if (this.dovuto('gufo', ora)) {
      if (p.luce === 'notte' && p.animali > 0.5 && pioggia < 0.3 && this.prossimi['gufo'] !== undefined) EVENTI.gufo(b, sparso(), ora + 0.1, 0.035);
      this.prossimi['gufo'] = ora + caso(25, 55);
    }
    if (pioggia > 0.02) {
      let t = Math.max(this.prossimi['goccia'] ?? ora, ora);
      while (t < avanti) {
        EVENTI.goccia(b, sparso(), t, 0.05 * caso(0.3, 1) * Math.min(1, pioggia * 1.5));
        t += caso(0.02, 0.09) / pioggia;
      }
      this.prossimi['goccia'] = t;
    }
    if (this.dovuto('tuono', ora)) {
      if (pioggia > 0.6 && this.prossimi['tuono'] !== undefined) EVENTI.tuono(b, sparso(), ora + 0.1, 0.45);
      this.prossimi['tuono'] = ora + caso(14, 34);
    }
    if (p.base === 'folla' && this.dovuto('voci', ora)) {
      // Il brusio lontano di un luogo abitato.
      EVENTI_SORGENTE.folla(b, scegli(this.lontani), ora + 0.05, false, 0);
      this.prossimi['voci'] = ora + caso(0.3, 0.9);
    }
  }

  /** Punti stereo fissi per i suoni sparsi del luogo; i «lontani» sono più fiochi e ovattati. */
  private creaPunti(): void {
    const ac = this.ac!;
    for (const dove of [-0.85, -0.45, 0, 0.45, 0.85]) {
      for (const lontano of [false, true]) {
        const g = ac.createGain();
        g.gain.value = lontano ? 0.17 : 1;
        let catena: AudioNode = g;
        if (lontano) {
          const f = ac.createBiquadFilter();
          f.type = 'lowpass';
          f.frequency.value = 900;
          catena = catena.connect(f);
        }
        if (ac.createStereoPanner) {
          const pan = ac.createStereoPanner();
          pan.pan.value = dove;
          catena = catena.connect(pan);
        }
        catena.connect(this.mondo!);
        (lontano ? this.lontani : this.punti).push(g);
      }
    }
  }

  /** Le sorgenti in scena: volume e posizione secondo la distanza da chi ascolta. */
  private sorgenti(p: Paesaggio | null, ora: number, avanti: number): void {
    const b = this.banco!;
    const presenti = new Set<string>();
    for (const s of p?.sorgenti ?? []) {
      presenti.add(s.chiave);
      let v = this.voci.get(s.chiave);
      if (!v) v = this.nuovaVoce(s, ora);
      const distanza = Math.abs(s.x - p!.ascolto);
      const raggio = p!.vista * 1.1;
      const vicinanza = Math.max(0, 1 - distanza / raggio);
      v.volume = VOLUMI[s.tipo] * Math.min(1, s.forza) * vicinanza * vicinanza * (s.agitata ? 1 + p!.agitazione : 1);
      v.agitata = !!s.agitata && p!.agitazione > 0.05;
      v.ingresso.gain.setTargetAtTime(v.volume, ora, 0.15);
      // Da lontano si perdono gli acuti.
      v.filtro.frequency.setTargetAtTime(900 + vicinanza * vicinanza * 9000, ora, 0.2);
      v.pan?.pan.setTargetAtTime(Math.max(-1, Math.min(1, (s.x - p!.ascolto) / (p!.vista * 0.6))) * 0.85, ora, 0.15);
      if (v.volume < 0.005 || this._muto) {
        v.prossimo = Math.max(v.prossimo, ora);
        continue;
      }
      while (v.prossimo < avanti) {
        const t = Math.max(v.prossimo, ora + 0.02);
        v.prossimo = t + RITMI[v.tipo](v, b, t, p!.agitazione);
      }
    }
    for (const [chiave, v] of this.voci) {
      if (presenti.has(chiave)) continue;
      v.ingresso.gain.setTargetAtTime(0, ora, 0.3);
      this.voci.delete(chiave);
      window.setTimeout(() => {
        for (const n of v.continui) {
          try {
            n.stop();
          } catch {
            /* già fermo */
          }
        }
        v.ingresso.disconnect();
      }, 2000);
    }
  }

  private nuovaVoce(s: SorgenteSonora, ora: number): Voce {
    const ac = this.ac!;
    const ingresso = ac.createGain();
    ingresso.gain.value = 0;
    const filtro = ac.createBiquadFilter();
    filtro.type = 'lowpass';
    filtro.frequency.value = 4000;
    let catena: AudioNode = ingresso.connect(filtro);
    const pan = ac.createStereoPanner ? ac.createStereoPanner() : null;
    if (pan) catena = catena.connect(pan);
    catena.connect(this.mondo!);
    const v: Voce = {
      tipo: s.tipo,
      ingresso,
      filtro,
      pan,
      volume: 0,
      agitata: false,
      prossimo: ora + caso(0.05, 1.5),
      giro: 0,
      continui: [],
    };
    // Le sorgenti con un suono continuo, sotto gli eventi.
    if (s.tipo === 'fuoco' || s.tipo === 'torcia') v.continui.push(this.continuo(ingresso, 'lowpass', 260, 0.18, true));
    if (s.tipo === 'acqua') {
      v.continui.push(this.continuo(ingresso, 'bandpass', 520, 0.5, true));
      v.continui.push(this.continuo(ingresso, 'bandpass', 1400, 0.1, false, 1.2));
    }
    this.voci.set(s.chiave, v);
    return v;
  }

  private continuo(dest: AudioNode, tipo: BiquadFilterType, f: number, vol: number, marrone: boolean, q = 0.7): AudioScheduledSourceNode {
    const ac = this.ac!;
    const src = ac.createBufferSource();
    src.buffer = marrone ? this.banco!.marrone : this.banco!.bianco;
    src.loop = true;
    const filtro = ac.createBiquadFilter();
    filtro.type = tipo;
    filtro.frequency.value = f;
    filtro.Q.value = q;
    const g = ac.createGain();
    g.gain.value = vol;
    src.connect(filtro).connect(g).connect(dest);
    src.start(0, Math.random() * 1.5);
    return src;
  }

  // ——— Segnali dell’interfaccia e passi di chi gioca ———

  passo(): void {
    if (!this.ac || !this.banco || !this.mondo) return;
    const bagnato = (this.paesaggioCorrente?.pioggia ?? 0) > 0.3 || this.paesaggioCorrente?.base === 'pioggia';
    EVENTI.passo(this.banco, this.mondo, this.ac.currentTime, caso(0.18, 0.26), bagnato);
  }

  /** Un dettaglio scoperto: due note di cetra. */
  scoperta(): void {
    if (!this.ac || !this.banco || !this.interfaccia) return;
    const t = this.ac.currentTime;
    pizzico(this.banco, this.interfaccia, t, 293.66, 0.22);
    pizzico(this.banco, this.interfaccia, t + 0.13, 440, 0.2);
  }

  giusto(): void {
    if (!this.ac || !this.banco || !this.interfaccia) return;
    pizzico(this.banco, this.interfaccia, this.ac.currentTime, 392, 0.2);
  }

  /** Una corda smorzata: non una punizione, solo un «non così». */
  sbagliato(): void {
    if (!this.ac || !this.banco || !this.interfaccia) return;
    pizzico(this.banco, this.interfaccia, this.ac.currentTime, 146.83, 0.3, true);
  }

  pagina(): void {
    if (!this.ac || !this.banco || !this.interfaccia) return;
    EVENTI.fruscio(this.banco, this.interfaccia, this.ac.currentTime, 0.12);
  }
}

// ————————————————————————— Le sorgenti, una per una —————————————————————————

/** Le voci di una folla: frammenti di parole a bassa voce, più forti e acuti se è agitata. */
const EVENTI_SORGENTE = {
  folla(b: Banco, dest: AudioNode, t: number, agitata: boolean, agitazione: number): number {
    const donna = Math.random() < 0.4;
    const f0 = (donna ? caso(185, 240) : caso(95, 145)) * (agitata ? 1 + agitazione * 0.3 : 1);
    const n = Math.floor(caso(1, 4));
    let tt = t;
    for (let i = 0; i < n; i++) {
      const dur = caso(0.11, 0.24) * (agitata ? 0.85 : 1);
      sillaba(b, dest, tt, { f0: f0 * caso(0.93, 1.07), dur, vol: (agitata ? 0.09 + agitazione * 0.08 : 0.07) * caso(0.6, 1), donna, scivola: caso(-0.12, 0.08), consonante: Math.random() < 0.4 });
      tt += dur + caso(0.01, 0.06);
    }
    return tt - t;
  },
};

/**
 * Per ogni tipo di sorgente: programma il prossimo evento al tempo `t` e
 * restituisce fra quanto programmare il successivo.
 */
const RITMI: Record<TipoSorgente, (v: Voce, b: Banco, t: number, agitazione: number) => number> = {
  fuoco: (v, b, t) => {
    EVENTI.crepitio(b, v.ingresso, t, 0.5);
    return caso(0.03, 0.22);
  },
  torcia: (v, b, t) => {
    EVENTI.crepitio(b, v.ingresso, t, 0.35);
    return caso(0.06, 0.35);
  },
  pecora: (v, b, t) => {
    if (v.giro++ > 0) EVENTI.belato(b, v.ingresso, t, 1);
    return caso(5, 14);
  },
  acqua: (v, b, t) => {
    // Gorgoglii sopra lo scorrere continuo.
    fischioAcqua(b, v.ingresso, t);
    return caso(0.15, 0.5);
  },
  incudine: (v, b, t) => {
    const colpi = Math.floor(caso(2, 5));
    for (let i = 0; i < colpi; i++) EVENTI.colpo(b, v.ingresso, t + i * caso(0.42, 0.55), 0.6);
    return colpi * 0.5 + caso(3, 7);
  },
  folla: (v, b, t, agitazione) => {
    const durata = EVENTI_SORGENTE.folla(b, v.ingresso, t, v.agitata, agitazione);
    // Più persone, più voci che si sovrappongono.
    return durata * caso(0.15, 0.6) / (v.agitata ? 1.6 : 1);
  },
  rissa: (v, b, t) => {
    if (Math.random() < 0.55) {
      sillaba(b, v.ingresso, t, { f0: caso(170, 270), dur: caso(0.22, 0.5), vol: 0.16, vocale: scegli(['a', 'o', 'e']), scivola: caso(-0.25, -0.05), consonante: true });
    } else {
      soffio(b, v.ingresso, t, caso(0.05, 0.1), { vol: 0.5, filtro: 'lowpass', f: 180, marrone: true });
      EVENTI.passo(b, v.ingresso, t + 0.05, 0.6);
    }
    return caso(0.25, 0.7);
  },
  invoca: (v, b, t) => {
    // Un’invocazione ripetuta a più voci, sullo stesso tono.
    const tono = 128;
    ['o', 'a', 'e'].forEach((vocale, i) => {
      for (let k = 0; k < 4; k++) {
        sillaba(b, v.ingresso, t + i * 0.42 + caso(0, 0.04), { f0: tono * caso(0.97, 1.03) * (i === 1 ? 1.12 : 1), dur: 0.4, vol: 0.05, vocale });
      }
    });
    return caso(2.4, 3.2);
  },
  danza: (v, b, t) => {
    // Tamburelli, battiti di mani e canto di donne: come si celebrava una vittoria.
    const mezzo = 60 / 104 / 2;
    const passo = v.giro % 8;
    if (passo === 0 || passo === 4) EVENTI.tamburo(b, v.ingresso, t, 0.3);
    if (passo === 2 || passo === 3 || passo === 6) EVENTI.tek(b, v.ingresso, t, 0.18);
    if (passo === 2 || passo === 6) EVENTI.battimano(b, v.ingresso, t + 0.01, 0.35);
    if (passo % 2 === 0) {
      // Una linea semplice, cantata all’unisono.
      const linea = [0, 2, 3, 2, 0, -2, 0, 0, 3, 5, 3, 2, 0, 2, 0, 0];
      const nota = linea[Math.floor(v.giro / 2) % linea.length];
      const f = 220 * 2 ** (nota / 12);
      const vocale = scegli(['a', 'e', 'o']);
      for (let k = 0; k < 3; k++) sillaba(b, v.ingresso, t + caso(0, 0.03), { f0: f * caso(0.99, 1.01), dur: mezzo * 1.9, vol: 0.07, vocale, donna: true });
    }
    v.giro++;
    return mezzo;
  },
  insegue: (v, b, t, agitazione) => {
    // Gente che corre: passi fitti, qualche grido.
    for (let i = 0; i < 3; i++) EVENTI.passo(b, v.ingresso, t + caso(0, 0.12), caso(0.25, 0.4));
    if (Math.random() < 0.12 + agitazione * 0.1) {
      sillaba(b, v.ingresso, t, { f0: caso(160, 240), dur: caso(0.25, 0.45), vol: 0.13, vocale: scegli(['a', 'o', 'e']), scivola: -0.15, consonante: true });
    }
    return caso(0.14, 0.2);
  },
  passi: (v, b, t) => {
    EVENTI.passo(b, v.ingresso, t, 0.5);
    return 0.36;
  },
  assalto: (v, b, t) => {
    // Corni che si sovrappongono, e a tratti il grido di guerra di molte voci.
    const giro = v.giro++ % 3;
    let durata = 0;
    for (let i = 0; i < 3; i++) durata = Math.max(durata, EVENTI.corno(b, v.ingresso, t + caso(0, 0.5), 0.22));
    if (giro === 2) {
      for (let k = 0; k < 6; k++) {
        sillaba(b, v.ingresso, t + caso(0, 0.08), { f0: caso(140, 210), dur: caso(0.35, 0.6), vol: 0.1, vocale: scegli(['a', 'e', 'o']), scivola: -0.1, consonante: true });
      }
    }
    return durata * caso(0.5, 0.8);
  },
  fuga: (v, b, t) => {
    // Gente che corre e urla nel buio.
    for (let i = 0; i < 4; i++) EVENTI.passo(b, v.ingresso, t + caso(0, 0.14), caso(0.25, 0.45));
    for (let k = 0; k < 2; k++) {
      if (Math.random() < 0.45) {
        sillaba(b, v.ingresso, t + caso(0, 0.1), { f0: caso(170, 300), dur: caso(0.25, 0.55), vol: 0.14, vocale: scegli(['a', 'o', 'e']), scivola: caso(-0.3, 0.1), consonante: true });
      }
    }
    return caso(0.12, 0.2);
  },
};

function fischioAcqua(b: Banco, dest: AudioNode, t: number): void {
  const f = caso(320, 700);
  const o = b.ac.createOscillator();
  o.frequency.setValueAtTime(f, t);
  o.frequency.exponentialRampToValueAtTime(f * caso(1.6, 2.4), t + 0.045);
  const g = b.ac.createGain();
  inviluppo(g, t, 0.05, 0.05, 0.005, 0.03);
  o.connect(g).connect(dest);
  o.start(t);
  o.stop(t + 0.07);
}
