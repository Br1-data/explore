import type { Attore, Capitolo, Folla, Fx, Oggetto, Passo, Posa, Punto, Ruolo, Scena, TipoPunto } from '@/contenuti/tipi';
import { disegnaFigura, STILE_BASE, stileFolla, type Luce, type Stile } from './figure';
import { disegnaOggetto, type Pennello } from './oggetti';
import { SUONI_OGGETTI, type Paesaggio, type SorgenteSonora } from './suono';
import { quota, sfuma, tavolozza, type Tavolozza } from './tavolozze';
import { alfa, casuale, interpola, limita, mescola } from './util';

/** Altezza logica della vista: tutte le misure di scena sono in queste unità. */
export const ALTEZZA = 540;
const VELOCITA = 168;
const VELOCITA_SGUARDO = 340;
const RAGGIO_PUNTO = 78;
/** Distanza entro cui un indizio («esamina») comincia a vedersi. */
const RAGGIO_INDIZIO = 230;
/** Un tocco sulla scena entro questa distanza da un punto lo sceglie. */
const RAGGIO_TOCCO = 70;
const PARALLASSE_FONDO = 0.55;
const PARALLASSE_PRIMO = 1.32;

export type PassoVisibile = Exclude<Passo, { t: 'fx' }>;

export interface StatoScena {
  indice: number;
  totale: number;
  titolo: string;
  luogo: string;
  fatti: number;
  obbligatori: number;
  facoltativiRimasti: number;
  completa: boolean;
  ultima: boolean;
  modo: 'cammina' | 'osserva';
  /** Indizi («esamina») trovati e totali nella scena. */
  indizi: [number, number];
  /** Colore del suolo in fondo alla scena, per raccordare la pagina alla tela. */
  suolo: string;
}

export interface Invito {
  id: string;
  testo: string;
  tipo: TipoPunto;
}

export interface Ascoltatori {
  mostra(passo: PassoVisibile, avanti: () => void): void;
  chiudiScheda(): void;
  invito(invito: Invito | null): void;
  stato(stato: StatoScena): void;
  scenaCompletata(indice: number): void;
  fine(): void;
  /** I passi di chi gioca. */
  passo?(): void;
  /** Un suono che avviene una volta, in un punto della scena (fx `suono`). */
  evento?(cosa: 'corno' | 'giare', x: number): void;
  /** Ciò che si sente nella scena: aggiornato più volte al secondo. */
  paesaggio?(p: Paesaggio): void;
}

interface Persona {
  stile: Stile;
  x: number;
  prof: number;
  verso: 1 | -1;
  posa: Posa;
  fase: number;
  folla: Folla;
  indice: number;
  meta: number;
  attesa: number;
  soglia: number;
  scarto: number;
  casa: number;
  parla: boolean;
}

interface AttoreVivo {
  def: Attore;
  stile: Stile;
  x: number;
  verso: 1 | -1;
  posa: Posa;
  fase: number;
  visibile: boolean;
  meta: { x: number; vel: number; fatto?: () => void } | null;
  giro: 1 | -1;
}

interface Nastro {
  chi: string;
  testo: string;
  t: number;
  dur: number;
}

interface Transizione {
  nome: string;
  da: number;
  a: number;
  t: number;
  dur: number;
  fatto?: () => void;
}

const COLORI_PUNTO: Record<TipoPunto, string> = {
  osserva: '#8fd0f8',
  ascolta: '#f6b56e',
  leggi: '#f4e3a8',
  agisci: '#ff9370',
  medita: '#cdacf2',
  esamina: '#a6ecc8',
};

export class Partita {
  private ctx: CanvasRenderingContext2D;
  private scena!: Scena;
  private indiceScena = 0;
  private persone: Persona[] = [];
  private attori = new Map<string, AttoreVivo>();
  private giocatore = { x: 0, verso: 1 as 1 | -1, posa: 'fermo' as Posa, fase: 0, visibile: true, bersaglio: null as number | null };
  private vars: Record<string, number> = {};
  /** Aspetto cambiato degli oggetti di scena (effetto `oggetto`), per `id`. */
  private varianti = new Map<string, number>();
  /** Che cosa ha in mano chi (effetto `carico`): «giocatore» o l’id di un attore. */
  private carichi = new Map<string, string>();
  private transizioni: Transizione[] = [];
  private nastri: Nastro[] = [];
  private fatti = new Set<string>();
  private camera = { x: 0, blocco: null as number | null };
  private modoGioco: 'esplora' | 'scheda' | 'transizione' = 'transizione';
  private direzione = 0;
  private attivo = false;
  private inPausa = false;
  private quadro = 0;
  private ultimo = 0;
  private t = 0;
  private vw = 960;
  private scalaVista = 1;
  private attese: { t: number; fatto: () => void }[] = [];
  private saltaAttesa: (() => void) | null = null;
  private invitoCorrente: string | null = null;
  /** Punto toccato sulla scena: si attiva appena lo si raggiunge. */
  private inArrivo: string | null = null;
  private stelle: { x: number; y: number; r: number; f: number }[] = [];
  private nuvole: { x: number; y: number; w: number; v: number }[] = [];
  private oggettiPerPiano: Record<'fondo' | 'medio' | 'primo', Oggetto[]> = { fondo: [], medio: [], primo: [] };
  private luci: Luce[] = [];
  private ultimoPasso = 0;
  /** Fra quanto comunicare di nuovo ciò che si sente. */
  private prossimoAscolto = 0;

  constructor(
    private tela: HTMLCanvasElement,
    readonly capitolo: Capitolo,
    readonly ruolo: Ruolo,
    private ui: Ascoltatori,
  ) {
    const ctx = tela.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D non disponibile');
    this.ctx = ctx;
    const r = casuale(4242);
    for (let i = 0; i < 90; i++) this.stelle.push({ x: r(), y: r() * 300, r: 0.5 + r() * 1.3, f: r() * 6 });
    for (let i = 0; i < 7; i++) this.nuvole.push({ x: r(), y: 50 + r() * 170, w: 90 + r() * 150, v: 0.004 + r() * 0.006 });
  }

  // ————————————————————————— Ciclo di vita —————————————————————————

  avvia(indice = 0): void {
    this.attivo = true;
    this.adatta();
    this.caricaScena(limita(indice, 0, this.ruolo.scene.length - 1));
    this.vars['dissolvi'] = 1;
    this.sfumaVar('dissolvi', 0, 0.9, () => this.entra());
    this.ultimo = performance.now();
    const giro = (ora: number): void => {
      if (!this.attivo) return;
      const dt = Math.min(0.05, (ora - this.ultimo) / 1000);
      this.ultimo = ora;
      if (!this.inPausa) this.aggiorna(dt);
      this.disegna();
      this.quadro = requestAnimationFrame(giro);
    };
    this.quadro = requestAnimationFrame(giro);
  }

  ferma(): void {
    this.attivo = false;
    cancelAnimationFrame(this.quadro);
  }

  pausa(v: boolean): void {
    this.inPausa = v;
    if (v) this.direzione = 0;
  }

  /** Adatta la risoluzione della tela allo spazio disponibile. */
  adatta(): void {
    const r = this.tela.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(1, Math.round(r.width * dpr));
    const h = Math.max(1, Math.round(r.height * dpr));
    if (this.tela.width !== w || this.tela.height !== h) {
      this.tela.width = w;
      this.tela.height = h;
    }
    this.scalaVista = h / ALTEZZA;
    this.vw = w / this.scalaVista;
  }

  /** Come si muove chi gioca: quello della scena, se lo dice, altrimenti quello del ruolo. */
  private get modo(): 'cammina' | 'osserva' {
    return this.scena?.modo ?? this.ruolo.modo;
  }

  private caricaScena(indice: number): void {
    this.indiceScena = indice;
    const s = (this.scena = this.ruolo.scene[indice]);
    this.fatti.clear();
    this.vars = { dissolvi: this.vars['dissolvi'] ?? 0, ...(s.vars ?? {}) };
    this.varianti.clear();
    this.carichi.clear();
    this.transizioni = this.transizioni.filter((x) => x.nome === 'dissolvi');
    this.nastri = [];
    this.attese = [];
    this.camera.blocco = null;
    this.invitoCorrente = null;
    this.inArrivo = null;
    this.ui.invito(null);

    const g = this.giocatore;
    g.x = s.inizioX ?? 120;
    g.verso = 1;
    g.posa = 'fermo';
    g.visibile = this.modo === 'cammina';
    g.bersaglio = null;
    this.camera.x = g.x;

    this.oggettiPerPiano = { fondo: [], medio: [], primo: [] };
    for (const o of s.oggetti) this.oggettiPerPiano[o.piano ?? 'medio'].push(o);

    this.persone = [];
    for (const folla of s.folle ?? []) this.popola(folla);

    this.attori.clear();
    for (const def of s.attori ?? []) {
      this.attori.set(def.id, {
        def,
        stile: this.capitolo.personaggi[def.stile] ?? STILE_BASE,
        x: def.x,
        verso: def.verso ?? 1,
        posa: def.posa ?? 'fermo',
        fase: 0,
        visibile: def.visibile ?? true,
        meta: null,
        giro: 1,
      });
    }
    this.prossimoAscolto = 0;
    this.notificaStato();
  }

  private popola(folla: Folla): void {
    const r = casuale(folla.seme * 101 + 7);
    const centro = (folla.x0 + folla.x1) / 2;
    for (let i = 0; i < folla.n; i++) {
      const k = folla.n === 1 ? 0.5 : i / (folla.n - 1);
      const u = r();
      const donna = u < (folla.donne ?? 0);
      const bimbo = !donna && u < (folla.donne ?? 0) + (folla.bimbi ?? 0);
      const u2 = r();
      const torcia = !donna && !bimbo && u2 < (folla.torce ?? 0);
      const armato = !donna && !bimbo && !torcia && u2 < (folla.torce ?? 0) + (folla.armati ?? 0);
      const giara = !donna && !bimbo && !torcia && !armato && u2 < (folla.torce ?? 0) + (folla.armati ?? 0) + (folla.giare ?? 0);
      let x = interpola(folla.x0, folla.x1, k * 0.86 + r() * 0.14);
      let verso: 1 | -1 = r() < 0.5 ? 1 : -1;
      let posa: Posa = 'fermo';
      if (folla.gruppo === 'invoca') {
        // Disposti ai due lati, rivolti verso il centro.
        const lato = i % 2 === 0 ? -1 : 1;
        x = centro + lato * (46 + Math.floor(i / 2) * 30 + r() * 8);
        verso = lato < 0 ? 1 : -1;
        posa = 'alza';
      } else if (folla.gruppo === 'rissa') {
        const lato = i % 2 === 0 ? -1 : 1;
        x = centro + lato * (20 + Math.floor(i / 2) * 34 + r() * 6);
        verso = lato < 0 ? 1 : -1;
        posa = i < 4 ? 'pugno' : 'indica';
      } else if (folla.gruppo === 'danza' || folla.gruppo === 'assalto') {
        posa = 'alza';
      }
      this.persone.push({
        stile: stileFolla(folla.seme * 31 + i, { donna, bimbo, armato, torcia, giara }),
        x,
        prof: -7 + r() * 14,
        verso,
        posa,
        fase: r() * 6,
        folla,
        indice: i,
        meta: x,
        attesa: r() * 4,
        soglia: 0.06 + r() * 0.82,
        scarto: (k - 0.5) * (folla.x1 - folla.x0) * (folla.comportamento === 'insegue' ? 1 : 0) + (r() - 0.5) * 20,
        casa: x,
        parla: r() < 0.45,
      });
    }
  }

  private entra(): void {
    const passi = this.scena.ingresso ?? [];
    if (passi.length) this.esegui(passi, () => this.libera());
    else this.libera();
  }

  private libera(): void {
    this.modoGioco = 'esplora';
    this.ui.chiudiScheda();
    this.notificaStato();
  }

  // ————————————————————————— Comandi —————————————————————————

  /** Direzione tenuta premuta: -1 sinistra, 1 destra, 0 fermo. */
  muovi(dir: number): void {
    this.direzione = dir;
    if (dir !== 0) {
      this.giocatore.bersaglio = null;
      this.inArrivo = null;
    }
  }

  /** Va fino a un punto della tela (coordinate CSS); se lì c’è un punto d’interesse, lo attiva. */
  vaiVerso(xCss: number, larghezzaCss: number): void {
    if (this.modoGioco !== 'esplora') return;
    const x = this.camera.x - this.vw / 2 + (xCss / larghezzaCss) * this.vw;
    const g = this.giocatore;
    let scelto: Punto | null = null;
    for (const p of this.scena.punti) {
      if (!this.visibile(p) || Math.abs(p.x - x) > RAGGIO_TOCCO) continue;
      // Un indizio si può toccare solo quando lo si vede già.
      if (p.tipo === 'esamina' && Math.abs(p.x - g.x) > RAGGIO_INDIZIO) continue;
      if (!scelto || Math.abs(p.x - x) < Math.abs(scelto.x - x)) scelto = p;
    }
    this.inArrivo = scelto?.id ?? null;
    if (scelto && Math.abs(scelto.x - g.x) < RAGGIO_PUNTO) {
      this.attiva(scelto);
      return;
    }
    g.bersaglio = limita(scelto?.x ?? x, 40, this.scena.larghezza - 40);
  }

  /** Tasto azione: interagisce con il punto vicino o salta un’attesa. */
  azione(): void {
    if (this.azioneSeInAttesa()) return;
    if (this.modoGioco !== 'esplora') return;
    const p = this.puntoVicino();
    if (p) this.attiva(p);
  }

  /** Se il racconto è in una pausa, la salta; restituisce true se l’ha fatto. */
  azioneSeInAttesa(): boolean {
    if (!this.saltaAttesa) return false;
    const f = this.saltaAttesa;
    this.saltaAttesa = null;
    f();
    return true;
  }

  /** Passa alla scena successiva, se questa è completa. */
  prosegui(): void {
    if (this.modoGioco !== 'esplora' || !this.completa()) return;
    this.modoGioco = 'transizione';
    this.ui.invito(null);
    const dopo = (): void => {
      this.ui.scenaCompletata(this.indiceScena);
      if (this.indiceScena + 1 < this.ruolo.scene.length) {
        this.sfumaVar('dissolvi', 1, 0.7, () => {
          this.caricaScena(this.indiceScena + 1);
          this.vars['dissolvi'] = 1;
          this.sfumaVar('dissolvi', 0, 0.9, () => this.entra());
        });
      } else {
        this.esegui(this.ruolo.epilogo, () => {
          this.ui.chiudiScheda();
          this.sfumaVar('dissolvi', 1, 1.2, () => this.ui.fine());
        });
      }
    };
    const uscita = this.scena.uscita ?? [];
    if (uscita.length) this.esegui(uscita, dopo);
    else dopo();
  }

  // ————————————————————————— Punti d’interesse —————————————————————————

  private visibile(p: Punto): boolean {
    return !this.fatti.has(p.id) && (p.richiede ?? []).every((id) => this.fatti.has(id));
  }

  private puntoVicino(): Punto | null {
    let migliore: Punto | null = null;
    let dist = RAGGIO_PUNTO;
    for (const p of this.scena.punti) {
      if (!this.visibile(p)) continue;
      const d = Math.abs(p.x - this.giocatore.x);
      if (d < dist) {
        dist = d;
        migliore = p;
      }
    }
    return migliore;
  }

  private attiva(p: Punto): void {
    this.giocatore.bersaglio = null;
    this.inArrivo = null;
    this.direzione = 0;
    if (this.modo === 'cammina' && Math.abs(p.x - this.giocatore.x) > 4) {
      this.giocatore.verso = p.x > this.giocatore.x ? 1 : -1;
    }
    this.ui.invito(null);
    this.invitoCorrente = null;
    this.esegui(p.passi, () => {
      this.fatti.add(p.id);
      this.libera();
    });
  }

  private completa(): boolean {
    return this.scena.punti.every((p) => p.facoltativo || this.fatti.has(p.id));
  }

  private tavolozzaCorrente(): Tavolozza {
    const s = this.scena;
    return s.ambiente2
      ? sfuma(tavolozza(s.ambiente), tavolozza(s.ambiente2), this.vars['visione'] ?? 0)
      : tavolozza(s.ambiente);
  }

  private coloreSuolo(): string {
    const P = this.tavolozzaCorrente();
    return mescola(P.terra[1], P.velo[0], P.velo[1]);
  }

  private notificaStato(): void {
    const obbl = this.scena.punti.filter((p) => !p.facoltativo);
    const indizi = this.scena.punti.filter((p) => p.tipo === 'esamina');
    this.ui.stato({
      indice: this.indiceScena,
      totale: this.ruolo.scene.length,
      titolo: this.scena.titolo,
      luogo: this.scena.luogo,
      fatti: obbl.filter((p) => this.fatti.has(p.id)).length,
      obbligatori: obbl.length,
      facoltativiRimasti: this.scena.punti.filter((p) => p.facoltativo && !this.fatti.has(p.id)).length,
      completa: this.completa() && this.modoGioco === 'esplora',
      ultima: this.indiceScena === this.ruolo.scene.length - 1,
      modo: this.modo,
      indizi: [indizi.filter((p) => this.fatti.has(p.id)).length, indizi.length],
      suolo: this.coloreSuolo(),
    });
  }

  // ————————————————————————— Sequenze —————————————————————————

  private esegui(passi: Passo[], alTermine: () => void): void {
    this.modoGioco = 'scheda';
    this.notificaStato();
    let i = 0;
    const prossimo = (): void => {
      if (!this.attivo) return;
      if (i >= passi.length) {
        alTermine();
        return;
      }
      const passo = passi[i++];
      if (passo.t === 'fx') {
        this.ui.chiudiScheda();
        this.effetto(passo.fx, prossimo);
      } else {
        this.ui.mostra(passo, prossimo);
      }
    };
    prossimo();
  }

  private attendi(dur: number, fatto: () => void, saltabile = false): void {
    const voce = { t: dur, fatto };
    this.attese.push(voce);
    if (saltabile) {
      this.saltaAttesa = () => {
        this.attese = this.attese.filter((a) => a !== voce);
        fatto();
      };
    }
  }

  private sfumaVar(nome: string, a: number, dur: number, fatto?: () => void): void {
    this.transizioni = this.transizioni.filter((x) => x.nome !== nome);
    if (dur <= 0) {
      this.vars[nome] = a;
      fatto?.();
      return;
    }
    this.transizioni.push({ nome, da: this.vars[nome] ?? 0, a, t: 0, dur, fatto });
  }

  private effetto(fx: Fx, avanti: () => void): void {
    switch (fx.k) {
      case 'var':
        this.sfumaVar(fx.nome, fx.a, fx.dur ?? 0);
        // Le variabili di scena cambiano mentre il racconto prosegue; una breve pausa lascia vedere l’effetto.
        if ((fx.dur ?? 0) > 0) this.attendi(Math.min(fx.dur ?? 0, 1.4), avanti, true);
        else avanti();
        break;
      case 'posa': {
        if (fx.chi === 'giocatore') this.giocatore.posa = fx.posa;
        else {
          const a = this.attori.get(fx.chi);
          if (a) a.posa = fx.posa;
        }
        avanti();
        break;
      }
      case 'vai': {
        const a = this.attori.get(fx.chi);
        if (!a) {
          avanti();
          break;
        }
        a.meta = { x: fx.x, vel: fx.vel ?? 120, fatto: fx.attendi ? avanti : undefined };
        if (!fx.attendi) avanti();
        break;
      }
      case 'nastro': {
        const dur = fx.dur ?? 4;
        // Una nuova frase dello stesso personaggio prende il posto della precedente.
        this.nastri = this.nastri.filter((n) => n.chi !== fx.chi);
        this.nastri.push({ chi: fx.chi, testo: fx.testo, t: 0, dur: dur + 0.6 });
        this.attendi(dur, avanti, true);
        break;
      }
      case 'dissolvi':
        this.sfumaVar('dissolvi', fx.a, fx.dur ?? 1, avanti);
        break;
      case 'attendi':
        this.attendi(fx.dur, avanti, true);
        break;
      case 'oggetto':
        this.varianti.set(fx.id, fx.variante);
        avanti();
        break;
      case 'carico':
        if (fx.cosa) this.carichi.set(fx.chi, fx.cosa);
        else this.carichi.delete(fx.chi);
        avanti();
        break;
      case 'suono':
        this.ui.evento?.(fx.cosa, fx.x ?? this.camera.x);
        avanti();
        break;
      case 'visibile': {
        if (fx.chi === 'giocatore') this.giocatore.visibile = fx.v;
        else {
          const a = this.attori.get(fx.chi);
          if (a) a.visibile = fx.v;
        }
        avanti();
        break;
      }
      case 'camera':
        this.camera.blocco = fx.x;
        if (fx.x !== null && (fx.dur ?? 0) === 0) this.camera.x = fx.x;
        avanti();
        break;
    }
  }

  // ————————————————————————— Aggiornamento —————————————————————————

  private terreno(x: number): number {
    return quota(this.scena.ambiente, tavolozza(this.scena.ambiente).rilievo, this.scena.seme, this.scena.larghezza, x);
  }

  private aggiorna(dt: number): void {
    this.t += dt;
    const s = this.scena;

    // Attese e transizioni.
    for (const a of [...this.attese]) {
      a.t -= dt;
      if (a.t <= 0) {
        this.attese = this.attese.filter((x) => x !== a);
        this.saltaAttesa = null;
        a.fatto();
      }
    }
    for (const tr of [...this.transizioni]) {
      tr.t += dt;
      const k = limita(tr.t / tr.dur, 0, 1);
      this.vars[tr.nome] = interpola(tr.da, tr.a, k * k * (3 - 2 * k));
      if (k >= 1) {
        this.transizioni = this.transizioni.filter((x) => x !== tr);
        tr.fatto?.();
      }
    }
    for (const n of this.nastri) n.t += dt;
    this.nastri = this.nastri.filter((n) => n.t < n.dur);

    // Chi gioca.
    const g = this.giocatore;
    const osserva = this.modo === 'osserva';
    let dir = 0;
    if (this.modoGioco === 'esplora') {
      dir = this.direzione;
      if (dir === 0 && g.bersaglio !== null) {
        const d = g.bersaglio - g.x;
        if (Math.abs(d) < 6) g.bersaglio = null;
        else dir = Math.sign(d);
      }
    }
    if (dir !== 0) {
      let vel = osserva ? VELOCITA_SGUARDO : VELOCITA;
      if (!osserva) {
        for (const z of s.zone ?? []) if (g.x >= z.x0 && g.x <= z.x1) vel *= 1 - z.forza;
      }
      const prima = g.x;
      g.x = limita(g.x + dir * vel * dt, 40, s.larghezza - 40);
      g.verso = dir > 0 ? 1 : -1;
      if (!osserva) {
        g.fase += Math.abs(g.x - prima) * 0.064;
        if (g.posa !== 'proclama' && g.posa !== 'sdraiato' && g.posa !== 'coperto') g.posa = 'cammina';
        if (this.t - this.ultimoPasso > 0.34 && g.x !== prima) {
          this.ultimoPasso = this.t;
          this.ui.passo?.();
        }
        // Arrivati in fondo a una scena completa, si prosegue.
        if (g.x >= s.larghezza - 44 && this.completa()) this.prosegui();
      }
    } else if (g.posa === 'cammina') {
      g.posa = 'fermo';
    }
    if (this.inArrivo && this.modoGioco === 'esplora' && g.bersaglio === null) {
      const p = this.scena.punti.find((x) => x.id === this.inArrivo);
      this.inArrivo = null;
      if (p && this.visibile(p) && Math.abs(p.x - g.x) < RAGGIO_PUNTO) this.attiva(p);
    }

    // Attori con un ruolo nel racconto.
    for (const a of this.attori.values()) {
      if (a.meta) {
        const d = a.meta.x - a.x;
        if (Math.abs(d) < 3) {
          const fatto = a.meta.fatto;
          a.meta = null;
          a.posa = 'fermo';
          fatto?.();
        } else {
          const passo = Math.sign(d) * Math.min(Math.abs(d), a.meta.vel * dt);
          a.x += passo;
          a.verso = d > 0 ? 1 : -1;
          a.fase += Math.abs(passo) * 0.064;
          a.posa = 'cammina';
        }
      } else if (a.def.percorso && a.posa !== 'sdraiato' && a.posa !== 'coperto' && a.posa !== 'proclama') {
        const [x0, x1] = a.def.percorso;
        const passo = a.giro * 42 * dt;
        a.x += passo;
        if (a.x > x1) a.giro = -1;
        if (a.x < x0) a.giro = 1;
        a.verso = a.giro;
        a.fase += Math.abs(passo) * 0.064;
        a.posa = 'cammina';
      }
    }

    this.aggiornaFolla(dt);

    this.prossimoAscolto -= dt;
    if (this.prossimoAscolto <= 0 && this.ui.paesaggio) {
      this.prossimoAscolto = 0.1;
      this.ui.paesaggio(this.paesaggio());
    }

    // Camera.
    const bersaglio = this.camera.blocco ?? g.x + (osserva ? 0 : g.verso * 70);
    const meta = limita(bersaglio, Math.min(this.vw / 2, s.larghezza / 2), Math.max(s.larghezza - this.vw / 2, s.larghezza / 2));
    this.camera.x += (meta - this.camera.x) * Math.min(1, dt * (osserva ? 9 : 3.2));

    // Invito a interagire.
    if (this.modoGioco === 'esplora') {
      const p = this.puntoVicino();
      const id = p?.id ?? null;
      if (id !== this.invitoCorrente) {
        this.invitoCorrente = id;
        this.ui.invito(p ? { id: p.id, testo: p.etichetta, tipo: p.tipo } : null);
      }
    }
  }

  /**
   * Ciò che si sente: il luogo (`suono` della scena), la luce, la pioggia, e le
   * sorgenti che ci sono davvero in scena — oggetti che suonano, folle, attori che
   * camminano — con la loro posizione.
   */
  private paesaggio(): Paesaggio {
    const s = this.scena;
    const sorgenti: SorgenteSonora[] = [];
    s.oggetti.forEach((o, i) => {
      const tipo = SUONI_OGGETTI[o.tipo];
      if (!tipo) return;
      // Un altare senza fuoco (variante 1) non crepita.
      if (o.tipo === 'altare' && ((o.id !== undefined ? this.varianti.get(o.id) : undefined) ?? o.variante) === 1) return;
      const forza = (o.seVar ? this.vars[o.seVar] ?? 0 : 1) * ((o.piano ?? 'medio') === 'medio' ? 1 : 0.3);
      if (forza > 0.02) sorgenti.push({ chiave: `${s.id}:o${i}`, tipo, x: o.x, forza });
    });
    const folle = new Map<Folla, { x: number; n: number }>();
    for (const p of this.persone) {
      const f = folle.get(p.folla) ?? { x: 0, n: 0 };
      f.x += p.x;
      f.n++;
      folle.set(p.folla, f);
    }
    (s.folle ?? []).forEach((f, i) => {
      const somma = folle.get(f);
      if (!somma) return;
      const visibile = f.seVar ? this.vars[f.seVar] ?? 0 : 1;
      const lontana = f.piano === 'fondo';
      const forza = Math.min(1, somma.n / 8) * visibile * (lontana ? 0.35 : 1);
      if (forza < 0.02) return;
      const x = somma.x / somma.n;
      const tipo = lontana ? 'folla' : f.gruppo ?? (f.comportamento === 'insegue' ? 'insegue' : 'folla');
      sorgenti.push({ chiave: `${s.id}:f${i}`, tipo, x, forza, agitata: !!f.reagisce });
      if (f.torce && !lontana) sorgenti.push({ chiave: `${s.id}:t${i}`, tipo: 'torcia', x, forza: f.torce });
    });
    for (const [id, a] of this.attori) {
      if (a.visibile && a.meta) sorgenti.push({ chiave: `${s.id}:a${id}`, tipo: 'passi', x: a.x, forza: 1 });
    }
    // L’acqua che sale si sente intorno a chi ascolta.
    const livello = this.vars['livello'] ?? 0;
    if (livello > 0.02) sorgenti.push({ chiave: `${s.id}:livello`, tipo: 'acqua', x: this.camera.x, forza: Math.min(1, livello * 1.5) });
    const P = this.tavolozzaCorrente();
    return {
      base: s.suono ?? 'vento',
      luce: P.stelle >= 0.9 ? 'notte' : P.stelle >= 0.4 ? 'crepuscolo' : 'giorno',
      ascolto: this.camera.x,
      vista: this.vw,
      // `pioggiaFuori`: la pioggia che si sente da dentro (es. nell’arca), senza vederla.
      pioggia: Math.max(this.vars['pioggia'] ?? 0, this.vars['pioggiaFuori'] ?? 0),
      agitazione: this.vars['agitazione'] ?? 0,
      animali: this.vars['animali'] ?? 1,
      sorgenti,
    };
  }

  private oratore(): number {
    return this.attori.get('enoc')?.x ?? this.giocatore.x;
  }

  private aggiornaFolla(dt: number): void {
    const agit = this.vars['agitazione'] ?? 0;
    const oratore = this.oratore();
    for (const p of this.persone) {
      const f = p.folla;
      if (f.seVar && (this.vars[f.seVar] ?? 0) < 0.02) continue;
      if (f.gruppo === 'rissa') {
        p.x = p.casa + Math.sin(this.t * 3.1 + p.indice * 1.7) * 5 * (p.verso > 0 ? 1 : -1);
        continue;
      }
      if (f.gruppo === 'invoca' || f.gruppo === 'assalto') continue;
      if (f.gruppo === 'fuga') {
        // Corrono di qua e di là senza fermarsi.
        if (Math.abs(p.meta - p.x) < 8) p.meta = interpola(f.x0, f.x1, casuale(Math.floor(this.t * 1000) + p.indice * 977 + f.seme)());
        const d = p.meta - p.x;
        const passo = Math.sign(d) * Math.min(Math.abs(d), (170 + (p.indice % 4) * 15) * dt);
        p.x += passo;
        p.fase += Math.abs(passo) * 0.064;
        p.verso = d > 0 ? 1 : -1;
        p.posa = 'cammina';
        continue;
      }
      if (f.gruppo === 'danza') {
        // Un girotondo sul posto, a braccia alzate o a passo di danza.
        const k = this.t * 1.5 + p.indice * 0.9;
        p.x = p.casa + Math.sin(k) * 22;
        p.verso = Math.cos(k) > 0 ? 1 : -1;
        p.fase += dt * 6;
        p.posa = Math.sin(this.t * 2.3 + p.indice * 1.3) > 0 ? 'alza' : 'cammina';
        continue;
      }

      if (f.reagisce && agit > p.soglia) {
        // Chi è toccato dal messaggio si volta verso chi parla.
        p.verso = oratore > p.x ? 1 : -1;
        p.posa = p.stile.tipo === 'uomo' ? (p.indice % 3 === 0 ? 'indica' : 'pugno') : 'fermo';
        continue;
      }

      if (f.comportamento === 'insegue') {
        const bers = f.bersaglio ? this.attori.get(f.bersaglio)?.x ?? this.giocatore.x : this.giocatore.x;
        const [d0, d1] = f.distanza ?? [420, 240];
        const avanz = f.bersaglio ? this.vars['incalzo'] ?? 0 : limita(this.giocatore.x / (this.scena.larghezza * 0.8), 0, 1);
        const meta = bers - interpola(d0, d1, avanz) + p.scarto * 0.28;
        const d = meta - p.x;
        if (Math.abs(d) > 8) {
          const passo = Math.sign(d) * Math.min(Math.abs(d), (f.bersaglio ? 190 : 176) * dt);
          p.x += passo;
          p.fase += Math.abs(passo) * 0.064;
          p.verso = d > 0 ? 1 : -1;
          p.posa = 'cammina';
        } else {
          p.verso = bers > p.x ? 1 : -1;
          p.posa = p.indice % 2 ? 'pugno' : 'indica';
        }
        continue;
      }

      if (f.comportamento === 'vaga' || f.comportamento === 'cerca') {
        const svelto = f.comportamento === 'cerca';
        const d = p.meta - p.x;
        if (Math.abs(d) > 4) {
          const passo = Math.sign(d) * Math.min(Math.abs(d), (svelto ? 96 : 34 + (p.indice % 3) * 9) * dt);
          p.x += passo;
          p.fase += Math.abs(passo) * 0.064;
          p.verso = d > 0 ? 1 : -1;
          p.posa = 'cammina';
        } else {
          p.attesa -= dt;
          p.posa = svelto ? (p.indice % 2 ? 'indica' : 'fermo') : p.parla ? 'parla' : 'fermo';
          if (p.attesa <= 0) {
            const r = casuale(Math.floor(this.t * 1000) + p.indice * 977 + f.seme);
            p.meta = interpola(f.x0, f.x1, r());
            p.attesa = svelto ? 0.4 + r() * 1.2 : 1.5 + r() * 5;
            p.parla = r() < 0.5;
            if (!svelto) p.verso = r() < 0.5 ? 1 : -1;
          }
        }
        continue;
      }
      p.posa = p.parla ? 'parla' : 'fermo';
    }
  }

  // ————————————————————————— Disegno —————————————————————————

  private disegna(): void {
    const { ctx } = this;
    const s = this.scena;
    const vw = this.vw;
    const P = this.tavolozzaCorrente();
    const cam = this.camera.x;
    const sinistra = cam - vw / 2;
    this.luci = [];

    ctx.setTransform(this.scalaVista, 0, 0, this.scalaVista, 0, 0);

    this.cielo(P);
    this.monti(P, cam);

    const tonoMedio = (c: string): string => mescola(c, P.velo[0], P.velo[1]);
    const tonoFondo = (c: string): string => mescola(tonoMedio(c), P.nebbia, 0.46);
    const tonoPrimo = (c: string): string => mescola(tonoMedio(c), '#07070d', 0.6);

    // Piano di fondo: un abitato o degli alberi in lontananza.
    const yFondo = (wx: number): number => 384 + Math.sin(wx / 310 + s.seme) * 7;
    ctx.fillStyle = mescola(mescola(P.terra[0], P.velo[0], P.velo[1]), P.nebbia, 0.42);
    ctx.beginPath();
    ctx.moveTo(0, ALTEZZA);
    for (let x = 0; x <= vw + 12; x += 12) {
      const wx = cam + (x - vw / 2) / PARALLASSE_FONDO;
      ctx.lineTo(x, yFondo(wx));
    }
    ctx.lineTo(vw + 12, ALTEZZA);
    ctx.closePath();
    ctx.fill();
    const pennello = (tono: (c: string) => string): Pennello => ({ ctx, P, t: this.t, tono, luci: this.luci, sx: 0, sy: 0, scala: 1 });
    const pf = pennello(tonoFondo);
    for (const o of this.oggettiPerPiano.fondo) {
      const sx = vw / 2 + (o.x - cam) * PARALLASSE_FONDO;
      if (sx < -160 || sx > vw + 160) continue;
      pf.sx = sx;
      pf.sy = yFondo(o.x) + 3;
      pf.scala = o.scala ?? 0.6;
      this.conAlfa(o, () => disegnaOggetto(pf, o));
    }
    for (const p of this.persone) {
      if (p.folla.piano !== 'fondo') continue;
      const sx = vw / 2 + (p.x - cam) * PARALLASSE_FONDO;
      if (sx < -40 || sx > vw + 40) continue;
      disegnaFigura(
        ctx,
        { ...p.stile, scala: p.stile.scala * 0.56, accessorio: undefined },
        { x: sx, y: yFondo(p.x) + 6, verso: p.verso, posa: p.posa, fase: p.fase, t: this.t },
        tonoFondo,
      );
    }

    // Terreno su cui si cammina.
    const gy = (wx: number): number => this.terreno(wx);
    const terra = ctx.createLinearGradient(0, 400, 0, ALTEZZA);
    terra.addColorStop(0, tonoMedio(P.terra[0]));
    terra.addColorStop(1, tonoMedio(P.terra[1]));
    ctx.fillStyle = terra;
    ctx.beginPath();
    ctx.moveTo(0, ALTEZZA);
    for (let x = 0; x <= vw + 8; x += 8) ctx.lineTo(x, gy(sinistra + x));
    ctx.lineTo(vw + 8, ALTEZZA);
    ctx.closePath();
    ctx.fill();
    // Il sentiero battuto.
    ctx.strokeStyle = alfa(tonoMedio(P.sentiero), 0.55);
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (let x = -8; x <= vw + 8; x += 8) {
      const y = gy(sinistra + x) + 7;
      if (x === -8) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    // Ciuffi d’erba.
    ctx.strokeStyle = tonoMedio(P.erba);
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    const passoErba = 34;
    for (let wx = Math.floor(sinistra / passoErba) * passoErba; wx < sinistra + vw + passoErba; wx += passoErba) {
      const h = Math.abs(Math.sin(wx * 12.9898)) * 43758.5453;
      const k = h - Math.floor(h);
      if (k < 0.35) continue;
      const x = wx + k * 20 - sinistra;
      const y = gy(wx + k * 20) + 1;
      const vento = Math.sin(this.t * 1.5 + wx * 0.05) * 1.6;
      for (const dx of [-3, 0, 3]) {
        ctx.moveTo(x + dx, y);
        ctx.lineTo(x + dx * 1.7 + vento, y - 6 - k * 6);
      }
    }
    ctx.stroke();

    // Sassi sparsi, per dare corpo al suolo.
    ctx.fillStyle = alfa(tonoMedio(mescola(P.terra[1], '#000000', 0.25)), 0.5);
    const passoSassi = 61;
    for (let wx = Math.floor(sinistra / passoSassi) * passoSassi; wx < sinistra + vw + passoSassi; wx += passoSassi) {
      const h1 = Math.abs(Math.sin(wx * 78.233)) * 12543.853;
      const k1 = h1 - Math.floor(h1);
      const h2 = Math.abs(Math.sin(wx * 39.425)) * 9431.117;
      const k2 = h2 - Math.floor(h2);
      const x = wx + k1 * 40 - sinistra;
      const y = gy(wx + k1 * 40) + 22 + k2 * 70;
      ctx.beginPath();
      ctx.ellipse(x, y, 3 + k2 * 7, 1.6 + k1 * 2.4, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Oggetti del piano principale. Chi galleggia sale con l’acqua (variabile `livello`).
    const pm = pennello(tonoMedio);
    const pelo = this.peloAcqua();
    for (const o of this.oggettiPerPiano.medio) {
      const sx = o.x - sinistra;
      if (sx < -480 || sx > vw + 480) continue;
      pm.sx = sx;
      pm.sy = gy(o.x) + 2;
      if (o.galleggia && pelo !== null) pm.sy = Math.min(pm.sy, pelo + 46 + Math.sin(this.t * 0.9 + o.x) * 3);
      pm.scala = o.scala ?? 1;
      const variante = o.id !== undefined ? this.varianti.get(o.id) : undefined;
      const disegnato = variante === undefined ? o : { ...o, variante };
      this.conAlfa(o, () => disegnaOggetto(pm, disegnato));
    }

    // Con l’acqua alta i segnali vanno sopra le onde, o non si vedrebbero.
    if (pelo === null) this.segnali(gy, sinistra);

    // Persone, in ordine di profondità.
    const figure: { prof: number; disegna: () => void }[] = [];
    for (const p of this.persone) {
      if (p.folla.piano === 'fondo') continue;
      const sx = p.x - sinistra;
      if (sx < -60 || sx > vw + 60) continue;
      const a = p.folla.seVar ? this.vars[p.folla.seVar] ?? 0 : 1;
      if (a < 0.02) continue;
      const agitato = p.folla.reagisce && (this.vars['agitazione'] ?? 0) > p.soglia;
      figure.push({
        prof: p.prof,
        disegna: () => {
          const l = disegnaFigura(
            ctx,
            p.stile,
            { x: sx, y: gy(p.x) + p.prof * 0.5 + 2, verso: p.verso, posa: p.posa, fase: p.fase, t: this.t + p.indice, chino: agitato ? 0.07 : 0, alpha: a },
            tonoMedio,
          );
          if (l) this.luci.push(l);
        },
      });
    }
    for (const [id, a] of this.attori) {
      if (!a.visibile) continue;
      const sx = a.x - sinistra;
      if (sx < -80 || sx > vw + 80) continue;
      figure.push({
        prof: 2,
        disegna: () => {
          disegnaFigura(ctx, a.stile, { x: sx, y: gy(a.x) + 3, verso: a.verso, posa: a.posa, fase: a.fase, t: this.t }, tonoMedio);
          this.disegnaCarico(pm, id, sx, gy(a.x) + 3, a.verso);
        },
      });
    }
    const g = this.giocatore;
    if (g.visibile) {
      const stile = this.capitolo.personaggi[this.ruolo.stile] ?? STILE_BASE;
      figure.push({
        prof: 3,
        disegna: () => {
          disegnaFigura(ctx, stile, { x: g.x - sinistra, y: gy(g.x) + 3.5, verso: g.verso, posa: g.posa, fase: g.fase, t: this.t }, tonoMedio);
          this.disegnaCarico(pm, 'giocatore', g.x - sinistra, gy(g.x) + 3.5, g.verso);
        },
      });
    }
    figure.sort((a, b) => a.prof - b.prof);
    for (const f of figure) f.disegna();
    this.indizi(gy, sinistra);
    this.acqua(sinistra);
    if (pelo !== null) this.segnali(gy, sinistra);

    // Primo piano, scuro e sfocato dalla vicinanza.
    const pp = pennello(tonoPrimo);
    for (const o of this.oggettiPerPiano.primo) {
      const sx = vw / 2 + (o.x - cam) * PARALLASSE_PRIMO;
      if (sx < -260 || sx > vw + 260) continue;
      pp.sx = sx;
      pp.sy = ALTEZZA + 6;
      pp.scala = o.scala ?? 1.5;
      disegnaOggetto(pp, o);
    }

    this.atmosfera(P);
    if (this.modo === 'osserva' && this.modoGioco === 'esplora') this.mirino(g.x - sinistra, gy(g.x));
    this.disegnaNastri(gy, sinistra);

    const buio = this.vars['dissolvi'] ?? 0;
    if (buio > 0.003) {
      ctx.fillStyle = `rgba(8,7,12,${buio})`;
      ctx.fillRect(0, 0, vw, ALTEZZA);
    }
  }

  /** Ciò che qualcuno ha in mano (effetto `carico`), disegnato all’altezza delle braccia. */
  private disegnaCarico(pm: Pennello, chi: string, x: number, y: number, verso: number): void {
    const cosa = this.carichi.get(chi);
    if (!cosa) return;
    pm.sx = x + verso * 14;
    pm.sy = y - 30;
    pm.scala = 0.42;
    disegnaOggetto(pm, { tipo: cosa, x: 0 });
  }

  /** Il pelo dell’acqua a schermo quando la variabile `livello` (0..1) è salita; null se è asciutto. */
  private peloAcqua(): number | null {
    const livello = this.vars['livello'] ?? 0;
    return livello < 0.002 ? null : ALTEZZA + 12 - livello * 270;
  }

  /** L’acqua che sale (variabile `livello`), con le onde in movimento, davanti a terreno e figure. */
  private acqua(sinistra: number): void {
    const pelo = this.peloAcqua();
    if (pelo === null) return;
    const { ctx, vw, t } = this;
    const onda = (x: number): number => pelo + Math.sin((x + sinistra) / 70 + t * 1.4) * 3.5 + Math.sin((x + sinistra) / 23 - t * 2.1) * 1.4;
    const colore = ctx.createLinearGradient(0, pelo, 0, ALTEZZA);
    colore.addColorStop(0, 'rgba(74,98,112,0.93)');
    colore.addColorStop(1, 'rgba(26,38,50,0.98)');
    ctx.fillStyle = colore;
    ctx.beginPath();
    ctx.moveTo(0, ALTEZZA);
    for (let x = 0; x <= vw + 10; x += 10) ctx.lineTo(x, onda(x));
    ctx.lineTo(vw + 10, ALTEZZA);
    ctx.closePath();
    ctx.fill();
    // La cresta delle onde, più chiara.
    ctx.strokeStyle = 'rgba(205,222,232,0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = 0; x <= vw + 10; x += 10) {
      if (x === 0) ctx.moveTo(x, onda(x));
      else ctx.lineTo(x, onda(x));
    }
    ctx.stroke();
  }

  private conAlfa(o: Oggetto, disegna: () => void): void {
    if (!o.seVar) {
      disegna();
      return;
    }
    const a = this.vars[o.seVar] ?? 0;
    if (a < 0.02) return;
    this.ctx.save();
    this.ctx.globalAlpha = a;
    disegna();
    this.ctx.restore();
  }

  private cielo(P: Tavolozza): void {
    const { ctx } = this;
    const vw = this.vw;
    const g = ctx.createLinearGradient(0, 0, 0, 430);
    g.addColorStop(0, P.cielo[0]);
    g.addColorStop(0.58, P.cielo[1]);
    g.addColorStop(1, P.cielo[2]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, vw, ALTEZZA);

    if (P.stelle > 0.02) {
      ctx.fillStyle = '#ffffff';
      for (const st of this.stelle) {
        const a = P.stelle * (0.45 + 0.55 * Math.sin(this.t * 1.3 + st.f)) * (1 - st.y / 380);
        if (a <= 0.02) continue;
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.arc(st.x * vw, st.y, st.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // Sole o luna, nascosti dalle nuvole quando piove.
    const coperto = this.vars['pioggia'] ?? 0;
    ctx.globalAlpha = 1 - coperto * 0.92;
    const ax = P.astro.x * vw;
    const alone = ctx.createRadialGradient(ax, P.astro.y, P.astro.r * 0.4, ax, P.astro.y, P.astro.r * 4.4);
    alone.addColorStop(0, alfa(P.astro.alone, 0.5));
    alone.addColorStop(1, alfa(P.astro.alone, 0));
    ctx.fillStyle = alone;
    ctx.fillRect(0, 0, vw, ALTEZZA);
    ctx.fillStyle = P.astro.colore;
    ctx.beginPath();
    ctx.arc(ax, P.astro.y, P.astro.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    if (coperto > 0.01) {
      // Una coltre grigia di nubi da pioggia.
      const nubi = ctx.createLinearGradient(0, 0, 0, 330);
      nubi.addColorStop(0, `rgba(58,64,78,${0.85 * coperto})`);
      nubi.addColorStop(1, `rgba(96,102,116,${0.45 * coperto})`);
      ctx.fillStyle = nubi;
      ctx.fillRect(0, 0, vw, 330);
    }

    // Nuvole lente.
    ctx.fillStyle = alfa(P.nuvole, 0.32);
    for (const n of this.nuvole) {
      const x = ((n.x + this.t * n.v - this.camera.x * 0.00004) % 1.3) * vw * 1.2 - n.w;
      for (const [dx, dy, k] of [
        [0, 0, 1],
        [n.w * 0.34, -9, 0.7],
        [-n.w * 0.3, 5, 0.6],
      ]) {
        ctx.beginPath();
        ctx.ellipse(x + dx, n.y + dy, n.w * 0.5 * k, 13 * k, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  private monti(P: Tavolozza, cam: number): void {
    const { ctx } = this;
    const vw = this.vw;
    const s = this.scena.seme;
    const strati: [number, number, number, number][] = [
      // parallasse, base, ampiezza, frequenza
      [0.06, 300, 78, 0.0052],
      [0.13, 338, 54, 0.0074],
      [0.24, 368, 36, 0.0105],
    ];
    strati.forEach(([par, base, amp, freq], i) => {
      ctx.fillStyle = P.monti[i];
      ctx.beginPath();
      ctx.moveTo(0, ALTEZZA);
      for (let x = 0; x <= vw + 10; x += 10) {
        const wx = x + cam * par + s * 53 * (i + 1);
        const a = Math.sin(wx * freq + i * 1.7);
        const b = Math.sin(wx * freq * 2.3 + s);
        const c = Math.sin(wx * freq * 5.1 + i);
        const h = (i === 0 ? Math.abs(a) * 1.25 - 0.3 : a * 0.65) + b * 0.28 + c * 0.09;
        ctx.lineTo(x, base - h * amp);
      }
      ctx.lineTo(vw + 10, ALTEZZA);
      ctx.closePath();
      ctx.fill();
    });
    // Foschia all’orizzonte.
    const f = ctx.createLinearGradient(0, 250, 0, 420);
    f.addColorStop(0, alfa(P.nebbia, 0));
    f.addColorStop(1, alfa(P.nebbia, 0.5));
    ctx.fillStyle = f;
    ctx.fillRect(0, 250, vw, 180);
  }

  private segnali(gy: (x: number) => number, sinistra: number): void {
    const { ctx } = this;
    if (this.modoGioco === 'transizione') return;
    const vicino = this.modoGioco === 'esplora' ? this.puntoVicino() : null;
    for (const p of this.scena.punti) {
      const sx = p.x - sinistra;
      if (sx < -40 || sx > this.vw + 40) continue;
      const fatto = this.fatti.has(p.id);
      if (!fatto && !this.visibile(p)) continue;
      const colore = COLORI_PUNTO[p.tipo];
      // Gli indizi si disegnano sopra le figure (vedi indizi()).
      if (p.tipo === 'esamina') continue;
      const y = gy(p.x) - (p.alt ?? 132);
      if (fatto) {
        ctx.fillStyle = alfa(colore, 0.4);
        ctx.beginPath();
        ctx.arc(sx, y + 6, 4, 0, Math.PI * 2);
        ctx.fill();
        continue;
      }
      const attivo = vicino === p;
      const onda = Math.sin(this.t * 2.6 + p.x * 0.01);
      const yy = y + onda * 3;
      const r = attivo ? 19 : 15;
      // Filo che lega il segnale al suolo.
      ctx.strokeStyle = alfa(colore, 0.28);
      ctx.lineWidth = 1.4;
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      ctx.moveTo(sx, yy + r + 3);
      ctx.lineTo(sx, gy(p.x) - 8);
      ctx.stroke();
      ctx.setLineDash([]);
      // Alone pulsante.
      ctx.strokeStyle = alfa(colore, 0.3 + 0.2 * onda);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(sx, yy, r + 6 + onda * 2.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(18,15,28,0.78)';
      ctx.beginPath();
      ctx.arc(sx, yy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = colore;
      ctx.lineWidth = attivo ? 3 : 2;
      if (p.facoltativo) ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(sx, yy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      this.icona(p.tipo, sx, yy, colore, attivo ? 1.2 : 1);
    }
  }

  private indizi(gy: (x: number) => number, sinistra: number): void {
    if (this.modoGioco === 'transizione') return;
    const vicino = this.modoGioco === 'esplora' ? this.puntoVicino() : null;
    for (const p of this.scena.punti) {
      if (p.tipo !== 'esamina') continue;
      const sx = p.x - sinistra;
      if (sx < -40 || sx > this.vw + 40) continue;
      const fatto = this.fatti.has(p.id);
      if (!fatto && !this.visibile(p)) continue;
      this.indizio(p, sx, gy(p.x) - (p.alt ?? 118), COLORI_PUNTO.esamina, fatto, vicino === p);
    }
  }

  /** Un indizio: invisibile da lontano, luccica man mano che ci si avvicina. */
  private indizio(p: Punto, sx: number, y: number, colore: string, fatto: boolean, attivo: boolean): void {
    const { ctx } = this;
    if (fatto) {
      ctx.fillStyle = alfa(colore, 0.35);
      ctx.beginPath();
      ctx.arc(sx, y, 3, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
    const vicinanza = 1 - Math.abs(p.x - this.giocatore.x) / RAGGIO_INDIZIO;
    if (vicinanza <= 0) return;
    const onda = Math.sin(this.t * 3.4 + p.x);
    ctx.save();
    ctx.globalAlpha = Math.min(1, vicinanza * 1.6);
    // Scintilla a quattro punte.
    const r = (attivo ? 15 : 10) + onda * 2;
    ctx.fillStyle = alfa(colore, 0.22);
    ctx.beginPath();
    ctx.arc(sx, y, r + 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = colore;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4 + this.t * 0.6;
      const rr = i % 2 ? r * 0.28 : r;
      ctx.lineTo(sx + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    ctx.closePath();
    ctx.fill();
    if (attivo) this.icona('esamina', sx, y - r - 20, colore, 1);
    ctx.restore();
  }

  private icona(tipo: TipoPunto, x: number, y: number, colore: string, k: number): void {
    const { ctx } = this;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(k, k);
    ctx.strokeStyle = colore;
    ctx.fillStyle = colore;
    ctx.lineWidth = 1.9;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    switch (tipo) {
      case 'osserva':
        ctx.beginPath();
        ctx.moveTo(-9, 0);
        ctx.quadraticCurveTo(0, -8, 9, 0);
        ctx.quadraticCurveTo(0, 8, -9, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 2.7, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'ascolta':
        ctx.beginPath();
        ctx.arc(-5, 0, 2.2, 0, Math.PI * 2);
        ctx.fill();
        for (const r of [5, 9]) {
          ctx.beginPath();
          ctx.arc(-5, 0, r + 1, -0.85, 0.85);
          ctx.stroke();
        }
        break;
      case 'leggi':
        ctx.strokeRect(-6.5, -8, 13, 16);
        ctx.beginPath();
        for (const yy of [-3.5, 0, 3.5]) {
          ctx.moveTo(-3.5, yy);
          ctx.lineTo(3.5, yy);
        }
        ctx.stroke();
        break;
      case 'agisci':
        ctx.beginPath();
        ctx.moveTo(-4.5, -7.5);
        ctx.lineTo(7, 0);
        ctx.lineTo(-4.5, 7.5);
        ctx.closePath();
        ctx.fill();
        break;
      case 'medita':
        ctx.beginPath();
        ctx.moveTo(0, 7);
        ctx.bezierCurveTo(-11, -1, -6, -9, 0, -3.5);
        ctx.bezierCurveTo(6, -9, 11, -1, 0, 7);
        ctx.fill();
        break;
      case 'esamina':
        // Lente.
        ctx.beginPath();
        ctx.arc(-2, -2, 5.5, 0, Math.PI * 2);
        ctx.moveTo(2.2, 2.2);
        ctx.lineTo(7.5, 7.5);
        ctx.stroke();
        break;
    }
    ctx.restore();
  }

  private atmosfera(P: Tavolozza): void {
    const { ctx } = this;
    const vw = this.vw;
    // Luce di torce e fuochi: conta soltanto quando è buio.
    const forza = limita(P.velo[1] * 1.5, 0, 0.8);
    if (forza > 0.05 && this.luci.length) {
      ctx.globalCompositeOperation = 'lighter';
      for (const l of this.luci) {
        const tremolio = 1 + Math.sin(this.t * 13 + l.x) * 0.05;
        const g = ctx.createRadialGradient(l.x, l.y, 2, l.x, l.y, l.r * tremolio);
        g.addColorStop(0, `rgba(255,170,80,${0.42 * forza})`);
        g.addColorStop(0.4, `rgba(255,120,50,${0.16 * forza})`);
        g.addColorStop(1, 'rgba(255,100,40,0)');
        ctx.fillStyle = g;
        ctx.fillRect(l.x - l.r * 1.1, l.y - l.r * 1.1, l.r * 2.2, l.r * 2.2);
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    // La tensione della folla tinge la scena.
    const agit = this.vars['agitazione'] ?? 0;
    if (agit > 0.02) {
      ctx.fillStyle = `rgba(150,30,20,${agit * 0.1})`;
      ctx.fillRect(0, 0, vw, ALTEZZA);
    }
    // Pioggia: cielo coperto e scrosci (variabile «pioggia»).
    const pioggia = this.vars['pioggia'] ?? 0;
    if (pioggia > 0.01) {
      ctx.fillStyle = `rgba(34,42,58,${pioggia * 0.36})`;
      ctx.fillRect(0, 0, vw, ALTEZZA);
      ctx.strokeStyle = `rgba(206,216,232,${0.42 * pioggia})`;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      const n = Math.round(170 * pioggia);
      for (let i = 0; i < n; i++) {
        const h = Math.abs(Math.sin(i * 12.9898)) * 43758.5453;
        const k = h - Math.floor(h);
        const x = (((i * 97.31 - this.camera.x * 0.9 + this.t * 70) % (vw + 60)) + vw + 60) % (vw + 60) - 30;
        const y = ((i * 53.7 + this.t * (820 + k * 300)) % (ALTEZZA + 60)) - 40;
        ctx.moveTo(x, y);
        ctx.lineTo(x - 5, y + 20 + k * 8);
      }
      ctx.stroke();
    }
    // Vignettatura, più stretta dove la folla preme.
    let pressione = 0;
    if (this.modo === 'cammina') {
      for (const z of this.scena.zone ?? []) {
        if (this.giocatore.x >= z.x0 && this.giocatore.x <= z.x1) pressione = Math.max(pressione, z.forza);
      }
    }
    const v = ctx.createRadialGradient(vw / 2, ALTEZZA * 0.52, ALTEZZA * (0.42 - pressione * 0.2), vw / 2, ALTEZZA * 0.52, Math.max(vw, ALTEZZA) * 0.78);
    v.addColorStop(0, 'rgba(0,0,0,0)');
    v.addColorStop(1, `rgba(6,5,12,${0.34 + pressione * 0.5 + agit * 0.14})`);
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, vw, ALTEZZA);
  }

  /** Nel punto di vista di chi osserva: indica dove si sta guardando. */
  private mirino(cx: number, suolo: number): void {
    const { ctx } = this;
    const vicino = this.puntoVicino() !== null;
    const cy = suolo - 72;
    const mx = vicino ? 62 : 74;
    const my = vicino ? 92 : 104;
    const braccio = 16;
    ctx.strokeStyle = vicino ? 'rgba(255,244,214,0.85)' : 'rgba(255,244,214,0.38)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (const [sx, sy] of [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1],
    ]) {
      ctx.moveTo(cx + sx * mx, cy + sy * (my - braccio));
      ctx.lineTo(cx + sx * mx, cy + sy * my);
      ctx.lineTo(cx + sx * (mx - braccio), cy + sy * my);
    }
    ctx.stroke();
  }

  private disegnaNastri(gy: (x: number) => number, sinistra: number): void {
    const { ctx } = this;
    for (const n of this.nastri) {
      const wx = n.chi === 'giocatore' ? this.giocatore.x : this.attori.get(n.chi)?.x ?? this.giocatore.x;
      const a = limita(Math.min(n.t / 0.35, (n.dur - n.t) / 0.5), 0, 1);
      ctx.font = 'italic 500 16.5px "Fraunces Variable", Georgia, serif';
      const massimo = Math.min(340, this.vw - 40);
      const righe: string[] = [];
      let riga = '';
      for (const parola of n.testo.split(' ')) {
        const prova = riga ? `${riga} ${parola}` : parola;
        if (ctx.measureText(prova).width > massimo - 32 && riga) {
          righe.push(riga);
          riga = parola;
        } else riga = prova;
      }
      if (riga) righe.push(riga);
      const larg = Math.max(...righe.map((r) => ctx.measureText(r).width)) + 32;
      const alt = righe.length * 22 + 20;
      const cx = limita(wx - sinistra, larg / 2 + 12, this.vw - larg / 2 - 12);
      const base = gy(wx) - 128;
      const y = Math.max(14, base - alt);
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle = 'rgba(252,246,230,0.96)';
      ctx.beginPath();
      ctx.roundRect(cx - larg / 2, y, larg, alt, 12);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(wx - sinistra - 9, y + alt - 1);
      ctx.lineTo(wx - sinistra + 9, y + alt - 1);
      ctx.lineTo(wx - sinistra, y + alt + 12);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#2a2018';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      righe.forEach((r, i) => ctx.fillText(r, cx, y + 21 + i * 22));
      ctx.restore();
    }
  }

  // ————————————————————————— Per i test automatici —————————————————————————

  istantanea(): {
    modo: string;
    scena: string;
    indice: number;
    x: number;
    /** Centro della vista e sua larghezza, in unità di scena. */
    camera: number;
    vista: number;
    larghezza: number;
    completa: boolean;
    attesa: boolean;
    punti: { id: string; x: number; fatto: boolean; visibile: boolean; facoltativo: boolean }[];
  } {
    return {
      modo: this.modoGioco,
      scena: this.scena.id,
      indice: this.indiceScena,
      x: this.giocatore.x,
      camera: this.camera.x,
      vista: this.vw,
      larghezza: this.scena.larghezza,
      completa: this.completa(),
      attesa: this.saltaAttesa !== null,
      punti: this.scena.punti.map((p) => ({
        id: p.id,
        x: p.x,
        fatto: this.fatti.has(p.id),
        visibile: this.visibile(p),
        facoltativo: !!p.facoltativo,
      })),
    };
  }

  /** Sposta subito chi gioca (solo per i test). */
  teletrasporta(x: number): void {
    this.giocatore.x = limita(x, 40, this.scena.larghezza - 40);
    this.giocatore.bersaglio = null;
    this.camera.x = this.giocatore.x;
  }
}
