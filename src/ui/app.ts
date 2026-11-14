import { capitoloDi, pubblicazione } from '@/contenuti';
import { Suono } from '@/motore/suono';
import { Salvataggio } from '@/salvataggio';
import { NOME_GIOCO, type Contesto } from './contesto';
import { h, svuota } from './dom';
import { daVecchioIndirizzo, partiIndirizzo } from './indirizzi';
import { apriGuida, apriQuaderno, chiediUscita } from './pannelli';
import { schermoAccesso } from './schermate/accesso';
import { schermoCapitolo } from './schermate/capitolo';
import { schermoFine } from './schermate/fine';
import { avviaGioco, type SessioneGioco } from './schermate/gioco';
import { schermoIndice } from './schermate/indice';
import { schermoIniziale } from './schermate/inizio';

/**
 * Il guscio dell’app: instrada gli indirizzi verso le schermate (ui/schermate), tiene
 * lo strato dei pannelli, la tastiera e gli aggiornamenti. Le schermate ricevono
 * l’app come `Contesto`.
 */
export class App implements Contesto {
  readonly salvataggio = new Salvataggio();
  readonly suono = new Suono(this.salvataggio.muto);
  readonly schermo = h('main', { class: 'schermo', id: 'schermo' });
  readonly gioco = h('div', { class: 'gioco', id: 'gioco', hidden: true });
  readonly strato = h('div', { class: 'strato', id: 'strato', hidden: true });
  private sessione: SessioneGioco | null = null;
  private tasti = new Set<string>();
  private smonta: (() => void)[] = [];
  private nuovaVersione = false;
  private avvisoAccesso: string | null = null;

  constructor(radice: HTMLElement) {
    radice.append(this.schermo, this.gioco, this.strato);
    window.addEventListener('hashchange', () => this.instrada());
    window.addEventListener('keydown', (e) => this.tastoGiu(e));
    window.addEventListener('keyup', (e) => this.tastoSu(e));
    window.addEventListener('blur', () => {
      this.tasti.clear();
      this.sessione?.partita.muovi(0);
    });
    window.addEventListener('pointerdown', () => this.suono.sblocca(), { passive: true });
    document.addEventListener('visibilitychange', () => {
      const nascosto = document.hidden;
      this.sessione?.partita.pausa(nascosto || !this.strato.hidden);
      this.suono.sospendi(nascosto);
      if (nascosto) this.salvataggio.salvaOra(true);
      else void this.cercaAggiornamento();
    });
    this.schermo.append(h('p', { class: 'inizio__testo' }, 'Apro i tuoi progressi…'));
    void this.salvataggio.riprendi().then((avviso) => {
      this.avvisoAccesso = avviso;
      this.suono.muto = this.salvataggio.muto;
      this.instrada();
    });
    void this.cercaAggiornamento();
  }

  /**
   * Installato sulla schermata Home, il gioco si riapre senza ricaricarsi: all'avvio e a
   * ogni ritorno si guarda se è uscita una versione nuova e la si carica, ma non durante
   * un racconto o con un pannello aperto (si aspetta il prossimo cambio di schermata).
   */
  private async cercaAggiornamento(): Promise<void> {
    const modulo = (d: Document) => d.querySelector('script[type="module"][src]')?.getAttribute('src');
    try {
      const testo = await (await fetch(location.pathname, { cache: 'no-cache' })).text();
      const nuovo = modulo(new DOMParser().parseFromString(testo, 'text/html'));
      // Una sola ricarica per versione: se la cache ridà la vecchia, niente giri a vuoto.
      if (!nuovo || nuovo === modulo(document) || sessionStorage.getItem('nei-loro-panni.versione') === nuovo) return;
      sessionStorage.setItem('nei-loro-panni.versione', nuovo);
      this.nuovaVersione = true;
      if (!this.sessione && this.strato.hidden) location.reload();
    } catch {
      // Senza rete si riprova al prossimo ritorno.
    }
  }

  // ————————————————————————— Navigazione —————————————————————————

  vai(percorso: string): void {
    if (location.hash === `#${percorso}`) this.instrada();
    else location.hash = percorso;
  }

  private instrada(): void {
    if (this.nuovaVersione) return location.reload();
    const parti = partiIndirizzo();
    const nuovo = daVecchioIndirizzo(parti);
    if (nuovo) return location.replace(`#${nuovo}`);
    this.chiudiStrato();
    this.fermaTutto();
    const [idPub, numero, idRuolo, fine] = parti;
    const pub = idPub ? pubblicazione(idPub) : undefined;
    const cap = pub && numero ? capitoloDi(pub, Number(numero)) : undefined;
    const ruolo = cap && idRuolo ? cap.ruoli.find((r) => r.id === idRuolo) : undefined;
    if (!this.salvataggio.utente) {
      schermoAccesso(this, this.avvisoAccesso, () => {
        this.suono.muto = this.salvataggio.muto;
        this.instrada();
      });
      this.avvisoAccesso = null;
    } else if (cap && ruolo && fine === 'fine') schermoFine(this, cap, ruolo);
    else if (cap && ruolo) {
      this.sessione = avviaGioco(this, cap, ruolo);
      if (!this.salvataggio.guidaVista) apriGuida(this, () => {});
    } else if (pub && cap) schermoCapitolo(this, pub, cap);
    else if (pub) schermoIndice(this, pub);
    else schermoIniziale(this);
    window.scrollTo(0, 0);
  }

  private fermaTutto(): void {
    for (const f of this.smonta) f();
    this.smonta = [];
    this.sessione = null;
    this.tasti.clear();
    this.gioco.hidden = true;
    svuota(this.gioco);
    this.schermo.hidden = false;
    svuota(this.schermo);
    this.schermo.className = 'schermo';
    this.suono.silenzio();
    document.title = NOME_GIOCO;
  }

  allUscita(f: () => void): void {
    this.smonta.push(f);
  }

  osservaTela(tela: HTMLCanvasElement, adatta: () => void): void {
    const oss = new ResizeObserver(adatta);
    oss.observe(tela);
    this.smonta.push(() => oss.disconnect());
  }

  // ————————————————————————— Sovrapposizioni —————————————————————————

  apriStrato(pannello: HTMLElement): void {
    svuota(this.strato);
    const fondo = h('div', { class: 'strato__fondo', onclick: () => this.chiudiStrato() });
    this.strato.append(fondo, pannello);
    this.strato.hidden = false;
    this.sessione?.partita.pausa(true);
    this.tasti.clear();
    (pannello.querySelector('button, a, textarea') as HTMLElement | null)?.focus({ preventScroll: true });
  }

  chiudiStrato(): void {
    if (this.strato.hidden) return;
    this.strato.hidden = true;
    svuota(this.strato);
    this.sessione?.partita.pausa(false);
    this.sessione?.aggiornaConteggio();
  }

  // ————————————————————————— Tastiera —————————————————————————

  private scrivendo(e: KeyboardEvent): boolean {
    const el = e.target as HTMLElement | null;
    return !!el && (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT');
  }

  private direzione(): number {
    const sx = this.tasti.has('ArrowLeft') || this.tasti.has('KeyA');
    const dx = this.tasti.has('ArrowRight') || this.tasti.has('KeyD');
    return sx === dx ? 0 : sx ? -1 : 1;
  }

  private tastoGiu(e: KeyboardEvent): void {
    const s = this.sessione;
    if (e.key === 'Escape') {
      if (!this.strato.hidden) this.chiudiStrato();
      else if (s) chiediUscita(this, s.partita.capitolo);
      return;
    }
    if (!s || !this.strato.hidden || e.metaKey || e.ctrlKey || e.altKey) return;
    if (this.scrivendo(e)) return;
    if (['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD'].includes(e.code)) {
      this.tasti.add(e.code);
      s.partita.muovi(this.direzione());
      e.preventDefault();
      return;
    }
    if (e.repeat) return;
    if (e.code === 'KeyQ') {
      apriQuaderno(this, s.partita.capitolo);
      return;
    }
    if (['KeyE', 'Enter', 'Space', 'ArrowUp'].includes(e.code)) {
      // Su un pulsante a fuoco, Invio e Spazio fanno già il loro lavoro.
      const suBottone = (e.target as HTMLElement | null)?.tagName === 'BUTTON' && (e.code === 'Enter' || e.code === 'Space');
      if (suBottone) return;
      e.preventDefault();
      if (s.scheda.aperta) s.scheda.conferma();
      else s.partita.azione();
    }
  }

  private tastoSu(e: KeyboardEvent): void {
    if (!this.tasti.delete(e.code)) return;
    this.sessione?.partita.muovi(this.direzione());
  }
}
