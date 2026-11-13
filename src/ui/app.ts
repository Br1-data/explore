import { CAPITOLI, capitolo as trovaCapitolo, dettagliDelRuolo, sensazioniDelRuolo } from '../content';
import { colline } from '../content/capitoli/enoc/scenari';
import { PARTI, TOTALE_CAPITOLI, URL_LIBRO } from '../content/libro';
import type { Capitolo, Ruolo } from '../content/tipi';
import { Partita, type Ascoltatori, type Invito, type StatoScena } from '../motore/partita';
import { Suono } from '../motore/suono';
import { Salvataggio } from '../salvataggio';
import { esterno, h, icona, svuota } from './dom';
import { CERTEZZE, distintivo, ORDINE_CERTEZZE, PER_TE, VERBI } from './etichette';
import { creaQuaderno, sezioniStudio } from './quaderno';
import { conEvidenza, Scheda } from './schede';

const NOME_GIOCO = 'In cammino';

/** Una scena senza punti d’interesse, che scorre dietro al titolo. */
const RUOLO_VETRINA: Ruolo = {
  id: 'vetrina',
  nome: '',
  titolo: '',
  descrizione: '',
  fedelta: '',
  modo: 'cammina',
  stile: 'enoc',
  durata: '',
  conclusione: '',
  scene: [{ id: 'vetrina', titolo: '', luogo: '', ...colline(), inizioX: 240, punti: [] }],
  epilogo: [],
};

const ASCOLTATORI_MUTI: Ascoltatori = {
  mostra: (_p, avanti) => avanti(),
  chiudiScheda: () => {},
  invito: () => {},
  stato: () => {},
  scenaCompletata: () => {},
  fine: () => {},
};

export class App {
  private salvataggio = new Salvataggio();
  private suono = new Suono(this.salvataggio.muto);
  private schermo = h('main', { class: 'schermo', id: 'schermo' });
  private gioco = h('div', { class: 'gioco', id: 'gioco', hidden: true });
  private strato = h('div', { class: 'strato', id: 'strato', hidden: true });
  private partita: Partita | null = null;
  private vetrina: Partita | null = null;
  private scheda: Scheda | null = null;
  private tasti = new Set<string>();
  private smonta: (() => void)[] = [];
  private aggiornaConteggio: (() => void) | null = null;

  constructor(radice: HTMLElement) {
    radice.append(this.schermo, this.gioco, this.strato);
    window.addEventListener('hashchange', () => this.instrada());
    window.addEventListener('keydown', (e) => this.tastoGiu(e));
    window.addEventListener('keyup', (e) => this.tastoSu(e));
    window.addEventListener('blur', () => {
      this.tasti.clear();
      this.partita?.muovi(0);
    });
    window.addEventListener('pointerdown', () => this.suono.sblocca(), { passive: true });
    document.addEventListener('visibilitychange', () => {
      const nascosto = document.hidden;
      this.partita?.pausa(nascosto || !this.strato.hidden);
      this.suono.sospendi(nascosto);
    });
    this.instrada();
  }

  // ————————————————————————— Navigazione —————————————————————————

  private vai(percorso: string): void {
    if (location.hash === `#${percorso}`) this.instrada();
    else location.hash = percorso;
  }

  private instrada(): void {
    const parti = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    this.chiudiStrato();
    this.fermaTutto();
    const [dove, a, b] = parti;
    const cap = a ? trovaCapitolo(Number(a)) : undefined;
    const ruolo = cap && b ? cap.ruoli.find((r) => r.id === b) : undefined;
    if (dove === 'libro') this.schermoLibro();
    else if (dove === 'capitolo' && cap) this.schermoCapitolo(cap);
    else if (dove === 'gioca' && cap && ruolo) this.avviaGioco(cap, ruolo);
    else if (dove === 'fine' && cap && ruolo) this.schermoFine(cap, ruolo);
    else this.schermoIniziale();
    window.scrollTo(0, 0);
  }

  private fermaTutto(): void {
    for (const f of this.smonta) f();
    this.smonta = [];
    this.partita?.ferma();
    this.partita = null;
    this.vetrina?.ferma();
    this.vetrina = null;
    this.scheda = null;
    this.tasti.clear();
    this.gioco.hidden = true;
    svuota(this.gioco);
    this.schermo.hidden = false;
    svuota(this.schermo);
    this.schermo.className = 'schermo';
    this.suono.ambiente('');
    document.title = NOME_GIOCO;
  }

  // ————————————————————————— Sovrapposizioni —————————————————————————

  private apriStrato(pannello: HTMLElement): void {
    svuota(this.strato);
    const fondo = h('div', { class: 'strato__fondo', onclick: () => this.chiudiStrato() });
    this.strato.append(fondo, pannello);
    this.strato.hidden = false;
    this.partita?.pausa(true);
    this.tasti.clear();
    (pannello.querySelector('button, a, textarea') as HTMLElement | null)?.focus({ preventScroll: true });
  }

  private chiudiStrato(): void {
    if (this.strato.hidden) return;
    this.strato.hidden = true;
    svuota(this.strato);
    this.partita?.pausa(false);
    this.aggiornaConteggio?.();
  }

  private apriQuaderno(cap: Capitolo): void {
    this.apriStrato(creaQuaderno(cap, this.salvataggio, () => this.chiudiStrato()));
  }

  private pannello(titolo: string, occhiello: string, corpo: (Node | string | null)[], piede?: Node[]): HTMLElement {
    return h(
      'div',
      { class: 'pannello', role: 'dialog', 'aria-modal': 'true', 'aria-label': titolo },
      h(
        'header',
        { class: 'pannello__testa' },
        h('div', null, h('span', { class: 'occhiello' }, occhiello), h('h2', null, titolo)),
        h('button', { class: 'bottone bottone--chiudi', type: 'button', onclick: () => this.chiudiStrato(), 'aria-label': 'Chiudi' }, '×'),
      ),
      h('div', { class: 'pannello__corpo' }, corpo),
      piede ? h('footer', { class: 'pannello__piede' }, piede) : null,
    );
  }

  private legenda(): HTMLElement {
    return h(
      'dl',
      { class: 'legenda' },
      ORDINE_CERTEZZE.flatMap((c) => [h('dt', null, distintivo(c)), h('dd', null, CERTEZZE[c].descrizione)]),
      h('dt', null, h('span', { class: 'distintivo distintivo--per-te' }, PER_TE.etichetta)),
      h('dd', null, PER_TE.descrizione),
    );
  }

  private apriGuida(alTermine?: () => void): void {
    const chiudi = (): void => {
      this.salvataggio.guidaVista = true;
      this.chiudiStrato();
      alTermine?.();
    };
    const p = this.pannello(
      'Come si gioca',
      'Guida',
      [
        h(
          'ul',
          { class: 'guida' },
          h('li', null, h('b', null, 'Muoviti. '), 'Frecce ← → oppure A e D. Con il mouse o il dito: tocca la scena o usa i pulsanti in basso.'),
          h('li', null, h('b', null, 'Avvicinati ai segnali. '), 'Quando compare l’invito, premi E, Invio o toccalo.'),
          h('li', null, h('b', null, 'Nota i dettagli. '), 'Ogni cosa che scopri finisce nel quaderno di studio (tasto Q), con la sua fonte.'),
          h('li', null, h('b', null, 'Il racconto non cambia. '), 'Non ci sono scelte che lo modificano: si gioca per osservare, capire e immedesimarsi.'),
        ),
        h('h3', null, 'Da dove viene ciò che leggi'),
        h('p', null, 'Ogni scheda porta un contrassegno, così distingui sempre ciò che la Bibbia dice da ciò che se ne deduce.'),
        this.legenda(),
      ],
      [h('button', { class: 'bottone bottone--primario', type: 'button', onclick: chiudi }, alTermine ? 'Inizia' : 'Ho capito')],
    );
    this.apriStrato(p);
    // Chi chiude in altro modo non deve restare bloccato.
    if (alTermine) (this.strato.querySelector('.strato__fondo') as HTMLElement).onclick = chiudi;
    (p.querySelector('.bottone--chiudi') as HTMLElement).onclick = chiudi;
  }

  private apriFonti(): void {
    const azzera = h('button', { class: 'bottone bottone--pericolo', type: 'button' }, 'Azzera progressi e quaderno');
    azzera.addEventListener('click', () => {
      if (azzera.dataset['conferma']) {
        this.salvataggio.azzera();
        this.chiudiStrato();
        this.vai('/');
      } else {
        azzera.dataset['conferma'] = '1';
        azzera.textContent = 'Tocca di nuovo per cancellare tutto';
      }
    });
    this.apriStrato(
      this.pannello('Fonti e fedeltà', 'Il progetto', [
        h(
          'p',
          null,
          `«${NOME_GIOCO}» è un progetto di studio personale, non ufficiale. Si basa sul libro `,
          esterno('«Cammina coraggiosamente con Dio»', URL_LIBRO),
          ', pubblicato dai Testimoni di Geova, ma non è realizzato né approvato dai suoi editori.',
        ),
        h('h3', null, 'Le regole che il gioco si dà'),
        h(
          'ul',
          { class: 'guida' },
          h('li', null, h('b', null, 'Nessuna aggiunta al racconto. '), 'Niente episodi, dialoghi o pensieri inventati. Dove la Bibbia tace, il gioco lo dice.'),
          h('li', null, h('b', null, 'Ogni affermazione ha la sua fonte. '), 'Versetto, capitolo del libro o pubblicazione citata dal libro, con il collegamento a jw.org.'),
          h('li', null, h('b', null, 'Geova non viene raffigurato. '), 'Quando lo si impersona, si compiono soltanto gli atti che il racconto gli attribuisce.'),
          h('li', null, h('b', null, 'Le sensazioni sono domande. '), 'Che cosa provarono i personaggi, se non è scritto, viene chiesto a te.'),
        ),
        h('h3', null, 'Testi e immagini'),
        h(
          'p',
          null,
          'Le citazioni bibliche sono tratte dalla Traduzione del Nuovo Mondo delle Sacre Scritture (edizione per lo studio), consultabile su jw.org. Il testo del libro non è riprodotto: viene riassunto e sempre collegato all’originale. Le illustrazioni sono originali e generiche; non riproducono quelle del libro.',
        ),
        h('h3', null, 'I tuoi dati'),
        h('p', null, 'Progressi e appunti restano solo in questo browser. Nulla viene inviato altrove.'),
        azzera,
      ]),
    );
  }

  private apriVerso(cap: Capitolo, id: string): void {
    const v = cap.versi[id];
    this.salvataggio.leggiVerso(cap.numero, id);
    this.apriStrato(
      this.pannello(v.rif, 'Leggi', [
        h('blockquote', { class: 'verso verso--grande' }, conEvidenza(v.testo, undefined)),
        v.note?.length ? h('ul', { class: 'note' }, v.note.map((n) => h('li', null, n))) : null,
        h('p', { class: 'fonti' }, esterno('Apri nella Bibbia per lo studio su jw.org', v.url)),
      ]),
    );
  }

  // ————————————————————————— Schermate —————————————————————————

  private conteggi(cap: Capitolo): { trovati: number; totali: number } {
    return { trovati: this.salvataggio.dettagli(cap.numero).length, totali: Object.keys(cap.dettagli).length };
  }

  private inCorso(): { cap: Capitolo; ruolo: Ruolo; scena: number } | null {
    for (const cap of Object.values(CAPITOLI)) {
      for (const ruolo of cap.ruoli) {
        const p = this.salvataggio.ruolo(cap.numero, ruolo.id);
        if (p.scena > 0 && !p.finito) return { cap, ruolo, scena: p.scena };
      }
    }
    return null;
  }

  private schermoIniziale(): void {
    this.schermo.className = 'schermo schermo--inizio';
    const tela = h('canvas', { class: 'inizio__tela', 'aria-hidden': 'true' });
    const ripresa = this.inCorso();
    this.schermo.append(
      tela,
      h(
        'div',
        { class: 'inizio' },
        h('p', { class: 'occhiello' }, 'Avventura di studio'),
        h('h1', { class: 'inizio__titolo' }, NOME_GIOCO),
        h(
          'p',
          { class: 'inizio__testo' },
          'Rivivi i racconti del libro «Cammina coraggiosamente con Dio» dal punto di vista di chi c’era. Per notare i dettagli, e sentire che cosa ci voleva per avere coraggio.',
        ),
        h(
          'div',
          { class: 'inizio__azioni' },
          h('button', { class: 'bottone bottone--primario bottone--grande', type: 'button', onclick: () => this.vai('/libro') }, 'Apri il libro'),
          ripresa
            ? h(
                'button',
                { class: 'bottone bottone--grande', type: 'button', onclick: () => this.vai(`/gioca/${ripresa.cap.numero}/${ripresa.ruolo.id}`) },
                `Riprendi: ${ripresa.ruolo.nome}, tappa ${ripresa.scena + 1}`,
              )
            : null,
        ),
        h(
          'div',
          { class: 'inizio__secondarie' },
          h('button', { class: 'bottone bottone--testo', type: 'button', onclick: () => this.apriGuida() }, 'Come si gioca'),
          h('button', { class: 'bottone bottone--testo', type: 'button', onclick: () => this.apriFonti() }, 'Fonti e fedeltà'),
        ),
      ),
      h('p', { class: 'inizio__nota' }, 'Progetto di studio personale, non ufficiale. Testo, audio e immagini del libro si trovano su jw.org.'),
    );
    this.vetrina = new Partita(tela, CAPITOLI[1], RUOLO_VETRINA, {
      ...ASCOLTATORI_MUTI,
      fine: () => {
        this.vetrina?.ferma();
        this.vetrina?.avvia(0);
        this.vetrina?.muovi(1);
      },
    });
    this.vetrina.avvia(0);
    this.vetrina.muovi(1);
    this.osservaTela(tela, () => this.vetrina?.adatta());
  }

  private osservaTela(tela: HTMLCanvasElement, adatta: () => void): void {
    const oss = new ResizeObserver(adatta);
    oss.observe(tela);
    this.smonta.push(() => oss.disconnect());
  }

  private barra(titolo: string, indietro: string, etichettaIndietro: string): HTMLElement {
    return h(
      'header',
      { class: 'barra' },
      h('button', { class: 'bottone bottone--testo', type: 'button', onclick: () => this.vai(indietro) }, `‹ ${etichettaIndietro}`),
      h('span', { class: 'barra__titolo' }, titolo),
      h('button', { class: 'bottone bottone--testo', type: 'button', onclick: () => this.apriFonti() }, 'Fonti'),
    );
  }

  private schermoLibro(): void {
    document.title = `Il libro · ${NOME_GIOCO}`;
    this.schermo.className = 'schermo schermo--pagina';
    const giocabili = Object.keys(CAPITOLI).length;
    this.schermo.append(
      this.barra(NOME_GIOCO, '/', 'Inizio'),
      h(
        'div',
        { class: 'pagina' },
        h(
          'header',
          { class: 'pagina__testa' },
          h('p', { class: 'occhiello' }, `${TOTALE_CAPITOLI} capitoli · ${giocabili} ${giocabili === 1 ? 'giocabile' : 'giocabili'}`),
          h('h1', null, 'Cammina coraggiosamente con Dio'),
          h(
            'p',
            { class: 'pagina__intro' },
            'Ogni capitolo del libro diventa un racconto da percorrere, scegliendo da quale punto di vista viverlo. Per ora si può giocare il primo; gli altri arriveranno con la stessa struttura. ',
            esterno('Il libro su jw.org', URL_LIBRO),
          ),
        ),
        PARTI.map((parte) =>
          h(
            'section',
            { class: 'parte' },
            h('header', { class: 'parte__testa' }, h('span', { class: 'occhiello' }, `Parte ${parte.numero}`), h('h2', null, parte.titolo), h('p', null, parte.periodo)),
            h(
              'ol',
              { class: 'capitoli' },
              parte.capitoli.map((voce) => {
                const cap = CAPITOLI[voce.numero];
                if (cap) {
                  const { trovati, totali } = this.conteggi(cap);
                  return h(
                    'li',
                    null,
                    h(
                      'button',
                      { class: 'capitolo capitolo--attivo', type: 'button', onclick: () => this.vai(`/capitolo/${cap.numero}`) },
                      h('span', { class: 'capitolo__numero' }, voce.numero),
                      h('span', { class: 'capitolo__nome' }, voce.nome),
                      h('span', { class: 'capitolo__titolo' }, voce.titolo),
                      h('span', { class: 'capitolo__stato' }, trovati ? `${trovati} dettagli su ${totali}` : 'Gioca'),
                    ),
                  );
                }
                return h(
                  'li',
                  null,
                  h(
                    'div',
                    { class: 'capitolo' },
                    h('span', { class: 'capitolo__numero' }, voce.numero),
                    h('span', { class: 'capitolo__nome' }, voce.nome),
                    h('span', { class: 'capitolo__titolo' }, voce.titolo),
                    h('span', { class: 'capitolo__stato' }, 'In preparazione · ', esterno('leggi su jw.org', voce.url)),
                  ),
                );
              }),
            ),
          ),
        ),
      ),
    );
  }

  private schermoCapitolo(cap: Capitolo): void {
    document.title = `${cap.nome} · ${NOME_GIOCO}`;
    this.schermo.className = 'schermo schermo--pagina';
    const { trovati, totali } = this.conteggi(cap);
    const scoperti = new Set(this.salvataggio.dettagli(cap.numero));
    this.schermo.append(
      this.barra(`Capitolo ${cap.numero}`, '/libro', 'Il libro'),
      h(
        'div',
        { class: 'pagina' },
        h(
          'header',
          { class: 'pagina__testa' },
          h('p', { class: 'occhiello' }, `Capitolo ${cap.numero}${cap.date ? ` · ${cap.date}` : ''}`),
          h('h1', null, cap.nome),
          h('p', { class: 'pagina__sottotitolo' }, cap.titolo),
          h(
            'div',
            { class: 'passi' },
            h('span', { class: 'passi__titolo' }, 'Leggi questi passi'),
            cap.passiDaLeggere.map((id) =>
              h('button', { class: 'bottone bottone--pillola', type: 'button', onclick: () => this.apriVerso(cap, id) }, cap.versi[id].rif),
            ),
            esterno('Il capitolo su jw.org', cap.url, 'passi__link'),
          ),
        ),
        h('h2', { class: 'pagina__sezione' }, 'Da quale punto di vista vuoi viverlo?'),
        h(
          'div',
          { class: 'ruoli' },
          cap.ruoli.map((ruolo) => {
            const prog = this.salvataggio.ruolo(cap.numero, ruolo.id);
            const suoi = dettagliDelRuolo(ruolo);
            const fatti = suoi.filter((id) => scoperti.has(id)).length;
            const etichetta = prog.scena > 0 && !prog.finito ? `Riprendi dalla tappa ${prog.scena + 1}` : prog.finito ? 'Rivivi il racconto' : 'Inizia';
            return h(
              'article',
              { class: `ruolo ruolo--${ruolo.id}`, 'data-ruolo': ruolo.id },
              h('header', null, h('h3', null, ruolo.nome), h('p', { class: 'ruolo__titolo' }, ruolo.titolo)),
              h('p', { class: 'ruolo__descrizione' }, ruolo.descrizione),
              h('p', { class: 'ruolo__fedelta' }, h('b', null, 'Su che cosa si basa. '), ruolo.fedelta),
              h(
                'footer',
                null,
                h(
                  'span',
                  { class: 'ruolo__dati' },
                  `${ruolo.scene.length} ${ruolo.scene.length === 1 ? 'tappa' : 'tappe'} · ${ruolo.durata} · ${fatti} di ${suoi.length} dettagli`,
                  prog.finito ? h('span', { class: 'ruolo__fatto' }, ' · Completato') : null,
                ),
                h(
                  'button',
                  { class: 'bottone bottone--primario', type: 'button', onclick: () => this.vai(`/gioca/${cap.numero}/${ruolo.id}`) },
                  etichetta,
                ),
              ),
            );
          }),
        ),
        h(
          'section',
          { class: 'riquadro' },
          h(
            'div',
            null,
            h('h2', null, 'Quaderno di studio'),
            h('p', null, `${trovati} dettagli su ${totali}, con fonti, passi letti, le tue riflessioni e le domande del capitolo.`),
          ),
          h('button', { class: 'bottone', type: 'button', onclick: () => this.apriQuaderno(cap) }, 'Apri il quaderno'),
        ),
      ),
    );
  }

  private schermoFine(cap: Capitolo, ruolo: Ruolo): void {
    document.title = `${ruolo.nome} · ${NOME_GIOCO}`;
    this.schermo.className = 'schermo schermo--pagina';
    const scoperti = new Set(this.salvataggio.dettagli(cap.numero));
    const suoi = dettagliDelRuolo(ruolo);
    const fatti = suoi.filter((id) => scoperti.has(id)).length;
    const { trovati, totali } = this.conteggi(cap);
    const sens = sensazioniDelRuolo(ruolo).length;
    const altri = cap.ruoli.filter((r) => r.id !== ruolo.id && !this.salvataggio.ruolo(cap.numero, r.id).finito);
    const mancanti = suoi.length - fatti;
    this.schermo.append(
      this.barra(`Capitolo ${cap.numero} · ${cap.nome}`, `/capitolo/${cap.numero}`, 'Il capitolo'),
      h(
        'div',
        { class: 'pagina' },
        h(
          'header',
          { class: 'pagina__testa' },
          h('p', { class: 'occhiello' }, 'Racconto concluso'),
          h('h1', null, ruolo.conclusione),
          h(
            'div',
            { class: 'esito' },
            h('div', null, h('b', null, `${fatti} / ${suoi.length}`), h('span', null, 'dettagli di questo punto di vista')),
            h('div', null, h('b', null, `${trovati} / ${totali}`), h('span', null, 'dettagli del capitolo')),
            h('div', null, h('b', null, sens), h('span', null, 'momenti per immedesimarti')),
          ),
          mancanti > 0
            ? h(
                'p',
                { class: 'pagina__intro' },
                `Ti ${mancanti === 1 ? 'è sfuggito un dettaglio facoltativo' : `sono sfuggiti ${mancanti} dettagli facoltativi`}: sono i segnali con il bordo tratteggiato.`,
              )
            : h('p', { class: 'pagina__intro' }, 'Hai colto tutti i dettagli di questo punto di vista.'),
          h(
            'div',
            { class: 'azioni' },
            h('button', { class: 'bottone bottone--primario', type: 'button', onclick: () => this.apriQuaderno(cap) }, 'Apri il quaderno'),
            h('button', { class: 'bottone', type: 'button', onclick: () => this.vai(`/capitolo/${cap.numero}`) }, 'Scegli un altro punto di vista'),
          ),
        ),
        altri.length
          ? h(
              'section',
              { class: 'riquadro riquadro--colonna' },
              h('h2', null, 'Lo stesso racconto, visto da altri'),
              h(
                'div',
                { class: 'altri' },
                altri.map((r) =>
                  h(
                    'button',
                    { class: 'bottone bottone--pillola', type: 'button', onclick: () => this.vai(`/gioca/${cap.numero}/${r.id}`) },
                    `${r.nome} · ${dettagliDelRuolo(r).filter((id) => !scoperti.has(id)).length} dettagli nuovi`,
                  ),
                ),
              ),
            )
          : null,
        h('h2', { class: 'pagina__sezione' }, 'Ora fermati sul racconto'),
        h('p', { class: 'pagina__intro' }, 'Le domande seguono le sezioni di studio del capitolo. Le risposte restano nel tuo quaderno.'),
        sezioniStudio(cap, this.salvataggio),
      ),
    );
  }

  // ————————————————————————— Gioco —————————————————————————

  private avviaGioco(cap: Capitolo, ruolo: Ruolo): void {
    document.title = `${ruolo.nome} · ${cap.nome} · ${NOME_GIOCO}`;
    this.schermo.hidden = true;
    this.gioco.hidden = false;
    this.gioco.dataset['modo'] = ruolo.modo;

    const tela = h('canvas', { class: 'gioco__tela', 'aria-label': 'La scena del racconto' });
    const luogo = h('span', { class: 'hud__luogo' });
    const titolo = h('strong', { class: 'hud__titolo' });
    const tappe = h('div', { class: 'tappe', 'aria-hidden': 'true' });
    const punti = h('span', { class: 'hud__punti' });
    const conta = h('b', null, '0');
    const audio = h('button', { class: 'tondo', type: 'button', 'aria-label': 'Audio' });
    const invito = h('button', { class: 'invito', type: 'button', hidden: true });
    const prosegui = h('button', { class: 'bottone bottone--primario prosegui', type: 'button', hidden: true }, 'Prosegui');
    const zonaScheda = h('div', { class: 'scheda-zona', hidden: true });
    const sinistra = h('button', { class: 'tondo tondo--grande', type: 'button', 'aria-label': 'Vai a sinistra' }, '‹');
    const destra = h('button', { class: 'tondo tondo--grande', type: 'button', 'aria-label': 'Vai a destra' }, '›');
    const aiuto = h(
      'p',
      { class: 'hud__aiuto' },
      ruolo.modo === 'osserva' ? '← → sposta lo sguardo · E interagisci · Q quaderno' : '← → cammina · E interagisci · Q quaderno',
    );

    const aggiornaAudio = (): void => {
      svuota(audio);
      audio.append(icona(this.suono.muto ? 'muto' : 'audio'));
      audio.setAttribute('aria-label', this.suono.muto ? 'Attiva l’audio' : 'Disattiva l’audio');
    };
    audio.addEventListener('click', () => {
      this.suono.muto = !this.suono.muto;
      this.salvataggio.muto = this.suono.muto;
      aggiornaAudio();
    });
    aggiornaAudio();

    const totali = Object.keys(cap.dettagli).length;
    this.aggiornaConteggio = (): void => {
      conta.textContent = `${this.salvataggio.dettagli(cap.numero).length}/${totali}`;
    };
    this.aggiornaConteggio();
    this.smonta.push(() => (this.aggiornaConteggio = null));

    this.gioco.append(
      tela,
      h(
        'div',
        { class: 'hud hud--alto' },
        h('button', { class: 'tondo', type: 'button', 'aria-label': 'Esci dal racconto', onclick: () => this.chiediUscita(cap) }, '‹'),
        h('div', { class: 'hud__scena' }, luogo, titolo, h('div', { class: 'hud__riga' }, tappe, punti)),
        h(
          'div',
          { class: 'hud__destra' },
          h(
            'button',
            { class: 'bottone bottone--hud', type: 'button', 'aria-label': 'Quaderno di studio', onclick: () => this.apriQuaderno(cap) },
            icona('quaderno'),
            h('span', { class: 'hud__etichetta' }, 'Quaderno'),
            conta,
          ),
          audio,
        ),
      ),
      h('div', { class: 'hud hud--basso' }, h('div', { class: 'comandi' }, sinistra, destra), invito, prosegui),
      aiuto,
      zonaScheda,
    );

    this.scheda = new Scheda(zonaScheda, {
      capitolo: cap,
      salvataggio: this.salvataggio,
      suono: this.suono,
      aggiornato: () => this.aggiornaConteggio?.(),
    });
    const scheda = this.scheda;

    const ascoltatori: Ascoltatori = {
      mostra: (passo, avanti) => {
        this.gioco.classList.add('gioco--scheda');
        scheda.mostra(passo, avanti);
      },
      chiudiScheda: () => {
        this.gioco.classList.remove('gioco--scheda');
        scheda.chiudi();
      },
      invito: (i: Invito | null) => {
        invito.hidden = !i;
        if (i) {
          svuota(invito);
          invito.dataset['tipo'] = i.tipo;
          invito.dataset['punto'] = i.id;
          invito.append(h('span', { class: 'invito__verbo' }, VERBI[i.tipo]), h('span', { class: 'invito__testo' }, i.testo), h('kbd', null, 'E'));
        }
      },
      stato: (s: StatoScena) => {
        luogo.textContent = `${ruolo.nome} · ${s.luogo}`;
        titolo.textContent = s.titolo;
        svuota(tappe);
        for (let i = 0; i < s.totale; i++) {
          tappe.append(h('i', { class: i < s.indice ? 'tappa tappa--fatta' : i === s.indice ? 'tappa tappa--ora' : 'tappa' }));
        }
        punti.textContent = `${s.fatti} di ${s.obbligatori}`;
        prosegui.hidden = !s.completa;
        prosegui.textContent = s.ultima ? 'Concludi il racconto' : 'Prosegui';
        if (s.completa && s.facoltativiRimasti > 0) {
          prosegui.title = `Qui c’è ancora ${s.facoltativiRimasti === 1 ? 'un dettaglio facoltativo' : `${s.facoltativiRimasti} dettagli facoltativi`}`;
        } else prosegui.removeAttribute('title');
        this.gioco.dataset['scena'] = String(s.indice);
        this.gioco.style.setProperty('--suolo', s.suolo);
      },
      scenaCompletata: (indice) => this.salvataggio.segnaScena(cap.numero, ruolo.id, indice + 1),
      fine: () => {
        this.salvataggio.segnaFinito(cap.numero, ruolo.id);
        this.vai(`/fine/${cap.numero}/${ruolo.id}`);
      },
      suono: (evento, valore) => {
        if (evento === 'passo') this.suono.passo();
        else this.suono.ambiente(valore ?? '');
      },
    };

    const partita = (this.partita = new Partita(tela, cap, ruolo, ascoltatori));
    // Appiglio per le prove automatiche (e2e/percorsi.mjs).
    (window as unknown as { __incammino?: unknown }).__incammino = partita;

    invito.addEventListener('click', () => partita.azione());
    prosegui.addEventListener('click', () => partita.prosegui());
    tela.addEventListener('pointerdown', (e) => {
      const r = tela.getBoundingClientRect();
      // Un tocco sulla scena salta le pause del racconto oppure indica dove andare.
      if (!partita.azioneSeInAttesa()) partita.vaiVerso(e.clientX - r.left, r.width);
    });
    for (const [bottone, dir] of [
      [sinistra, -1],
      [destra, 1],
    ] as const) {
      bottone.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        bottone.setPointerCapture(e.pointerId);
        partita.muovi(dir);
      });
      for (const fine of ['pointerup', 'pointercancel', 'lostpointercapture'] as const) {
        bottone.addEventListener(fine, () => partita.muovi(0));
      }
      bottone.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    this.osservaTela(tela, () => partita.adatta());

    const progresso = this.salvataggio.ruolo(cap.numero, ruolo.id);
    const inizio = progresso.finito ? 0 : progresso.scena;
    partita.avvia(inizio);
    if (!this.salvataggio.guidaVista) this.apriGuida(() => {});
  }

  private chiediUscita(cap: Capitolo): void {
    this.apriStrato(
      this.pannello(
        'Vuoi uscire dal racconto?',
        'Pausa',
        [h('p', null, 'I dettagli scoperti restano nel quaderno. Riprenderai dall’inizio di questa tappa.')],
        [
          h('button', { class: 'bottone bottone--primario', type: 'button', onclick: () => this.chiudiStrato() }, 'Continua'),
          h('button', { class: 'bottone', type: 'button', onclick: () => this.vai(`/capitolo/${cap.numero}`) }, 'Esci'),
        ],
      ),
    );
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
    if (e.key === 'Escape') {
      if (!this.strato.hidden) this.chiudiStrato();
      else if (this.partita) this.chiediUscita(this.partita.capitolo);
      return;
    }
    if (!this.partita || !this.strato.hidden || e.metaKey || e.ctrlKey || e.altKey) return;
    if (this.scrivendo(e)) return;
    if (['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD'].includes(e.code)) {
      this.tasti.add(e.code);
      this.partita.muovi(this.direzione());
      e.preventDefault();
      return;
    }
    if (e.repeat) return;
    if (e.code === 'KeyQ') {
      this.apriQuaderno(this.partita.capitolo);
      return;
    }
    if (['KeyE', 'Enter', 'Space', 'ArrowUp'].includes(e.code)) {
      // Su un pulsante a fuoco, Invio e Spazio fanno già il loro lavoro.
      const suBottone = (e.target as HTMLElement | null)?.tagName === 'BUTTON' && (e.code === 'Enter' || e.code === 'Space');
      if (suBottone) return;
      e.preventDefault();
      if (this.scheda?.aperta) this.scheda.conferma();
      else this.partita.azione();
    }
  }

  private tastoSu(e: KeyboardEvent): void {
    if (!this.tasti.delete(e.code)) return;
    this.partita?.muovi(this.direzione());
  }
}
