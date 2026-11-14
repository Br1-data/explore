import { chiave, PUBBLICAZIONI } from '@/contenuti';
import type { Capitolo } from '@/contenuti/tipi';
import { NOME_GIOCO, type Contesto } from './contesto';
import { esterno, h } from './dom';
import { CERTEZZE, distintivo, distintivoRicostruzione, ORDINE_CERTEZZE, PER_TE, RICOSTRUZIONE } from './etichette';
import { indirizzo } from './indirizzi';
import { creaQuaderno } from './quaderno';
import { conEvidenza } from './schede';

/** Pannelli sovrapposti (guida, fonti, versetti, quaderno, pausa) e la barra delle pagine. */

export function pannello(cx: Contesto, titolo: string, occhiello: string, corpo: (Node | string | null)[], piede?: Node[]): HTMLElement {
  return h(
    'div',
    { class: 'pannello', role: 'dialog', 'aria-modal': 'true', 'aria-label': titolo },
    h(
      'header',
      { class: 'pannello__testa' },
      h('div', null, h('span', { class: 'occhiello' }, occhiello), h('h2', null, titolo)),
      h('button', { class: 'bottone bottone--chiudi', type: 'button', onclick: () => cx.chiudiStrato(), 'aria-label': 'Chiudi' }, '×'),
    ),
    h('div', { class: 'pannello__corpo' }, corpo),
    piede ? h('footer', { class: 'pannello__piede' }, piede) : null,
  );
}

/** La barra in cima alle pagine: indietro, titolo, fonti. */
export function barra(cx: Contesto, titolo: string, indietro: string, etichettaIndietro: string): HTMLElement {
  return h(
    'header',
    { class: 'barra' },
    h('button', { class: 'bottone bottone--testo', type: 'button', onclick: () => cx.vai(indietro) }, `‹ ${etichettaIndietro}`),
    h('span', { class: 'barra__titolo' }, titolo),
    h('button', { class: 'bottone bottone--testo', type: 'button', onclick: () => apriFonti(cx) }, 'Fonti'),
  );
}

function legenda(): HTMLElement {
  return h(
    'dl',
    { class: 'legenda' },
    ORDINE_CERTEZZE.flatMap((c) => [h('dt', null, distintivo(c)), h('dd', null, CERTEZZE[c].descrizione)]),
    h('dt', null, distintivoRicostruzione()),
    h('dd', null, RICOSTRUZIONE.descrizione),
    h('dt', null, h('span', { class: 'distintivo distintivo--per-te' }, PER_TE.etichetta)),
    h('dd', null, PER_TE.descrizione),
  );
}

/** Come si gioca. Con `alTermine` è la guida d’ingresso: chiuderla in qualunque modo prosegue. */
export function apriGuida(cx: Contesto, alTermine?: () => void): void {
  const chiudi = (): void => {
    cx.salvataggio.guidaVista = true;
    cx.chiudiStrato();
    alTermine?.();
  };
  const p = pannello(
    cx,
    'Come si gioca',
    'Guida',
    [
      h(
        'ul',
        { class: 'guida' },
        h('li', null, h('b', null, 'Muoviti. '), 'Frecce ← → oppure A e D. Con il mouse o il dito: tocca la scena o usa i pulsanti in basso.'),
        h('li', null, h('b', null, 'Segnali. '), 'Toccane uno, oppure avvicinati e premi E o Invio.'),
        h('li', null, h('b', null, 'Indizi. '), 'Alcune cose non hanno un segnale: avvicinandoti vedrai un luccichio. Esaminale per scoprire i dettagli.'),
        h('li', null, h('b', null, 'Mettiti nei suoi panni. '), 'Nelle situazioni segnate «Ricostruzione» scegli che cosa fare: scopri che cosa fece il personaggio secondo le fonti, e come agivano gli altri.'),
        h('li', null, h('b', null, 'Il racconto non cambia. '), 'Le scelte servono a capire, non a cambiare la storia. Ogni dettaglio finisce nel quaderno di studio (tasto Q), con la sua fonte.'),
      ),
      h('h3', null, 'Da dove viene ciò che leggi'),
      h('p', null, 'Ogni scheda porta un contrassegno, così distingui sempre ciò che la Bibbia dice da ciò che se ne deduce.'),
      legenda(),
    ],
    [h('button', { class: 'bottone bottone--primario', type: 'button', onclick: chiudi }, alTermine ? 'Inizia' : 'Ho capito')],
  );
  cx.apriStrato(p);
  // Chi chiude in altro modo non deve restare bloccato.
  if (alTermine) (cx.strato.querySelector('.strato__fondo') as HTMLElement).onclick = chiudi;
  (p.querySelector('.bottone--chiudi') as HTMLElement).onclick = chiudi;
}

export function apriFonti(cx: Contesto): void {
  const azzera = h('button', { class: 'bottone bottone--pericolo', type: 'button' }, 'Azzera progressi e quaderno');
  azzera.addEventListener('click', () => {
    if (azzera.dataset['conferma']) {
      cx.salvataggio.azzera();
      cx.chiudiStrato();
      cx.vai(indirizzo.inizio());
    } else {
      azzera.dataset['conferma'] = '1';
      azzera.textContent = 'Tocca di nuovo per cancellare tutto';
    }
  });
  const pubblicazioni = PUBBLICAZIONI.flatMap((p, i) => [i ? ', ' : '', esterno(`«${p.titolo}»`, p.url)]);
  cx.apriStrato(
    pannello(cx, 'Fonti e fedeltà', 'Il progetto', [
      h(
        'p',
        null,
        `«${NOME_GIOCO}» è un progetto di studio personale, non ufficiale. Si basa su pubblicazioni dei Testimoni di Geova (`,
        ...pubblicazioni,
        '), ma non è realizzato né approvato dai loro editori.',
      ),
      h('h3', null, 'Le regole che il gioco si dà'),
      h(
        'ul',
        { class: 'guida' },
        h('li', null, h('b', null, 'Nessuna aggiunta al racconto. '), 'Niente episodi, dialoghi o pensieri inventati. Dove la Bibbia tace, il gioco lo dice.'),
        h('li', null, h('b', null, 'Le ricostruzioni sono dichiarate. '), 'Le scene tipiche del tempo, non narrate, sono segnate «Ricostruzione» e indicano le fonti su cui si basano.'),
        h('li', null, h('b', null, '«Camminare con Dio» non è un percorso. '), 'Nella Bibbia significa seguire la condotta che Dio approva: nel gioco lo mostrano le scelte, non gli spostamenti.'),
        h('li', null, h('b', null, 'Ogni affermazione ha la sua fonte. '), 'Versetto, capitolo della pubblicazione o pubblicazione che essa cita, con il collegamento a jw.org.'),
        h('li', null, h('b', null, 'Geova non viene raffigurato. '), 'Quando lo si impersona, si compiono soltanto gli atti che il racconto gli attribuisce.'),
        h('li', null, h('b', null, 'Le sensazioni sono domande. '), 'Che cosa provarono i personaggi, se non è scritto, viene chiesto a te.'),
      ),
      h('h3', null, 'Testi e immagini'),
      h(
        'p',
        null,
        'Le citazioni bibliche sono tratte dalla Traduzione del Nuovo Mondo delle Sacre Scritture (edizione per lo studio), consultabile su jw.org. Il testo delle pubblicazioni non è riprodotto: viene riassunto e sempre collegato all’originale. Le illustrazioni sono originali e generiche; non riproducono quelle delle pubblicazioni.',
      ),
      h('h3', null, 'I tuoi dati'),
      h(
        'p',
        null,
        'Progressi e appunti sono salvati nel tuo account, in un archivio privato del progetto su Google Drive: li ritrovi su ogni dispositivo entrando con nome utente e password. La password non viene conservata, solo una sua impronta.',
      ),
      azzera,
    ]),
  );
}

export function apriVerso(cx: Contesto, cap: Capitolo, id: string): void {
  const v = cap.versi[id];
  cx.salvataggio.leggiVerso(chiave(cap), id);
  cx.apriStrato(
    pannello(cx, v.rif, 'Leggi', [
      h('blockquote', { class: 'verso verso--grande' }, conEvidenza(v.testo, undefined)),
      v.note?.length ? h('ul', { class: 'note' }, v.note.map((n) => h('li', null, n))) : null,
      h('p', { class: 'fonti' }, esterno('Apri nella Bibbia per lo studio su jw.org', v.url)),
    ]),
  );
}

export function apriQuaderno(cx: Contesto, cap: Capitolo): void {
  cx.apriStrato(creaQuaderno(cap, cx.salvataggio, () => cx.chiudiStrato()));
}

export function chiediUscita(cx: Contesto, cap: Capitolo): void {
  cx.apriStrato(
    pannello(
      cx,
      'Vuoi uscire dal racconto?',
      'Pausa',
      [h('p', null, 'I dettagli scoperti restano nel quaderno. Riprenderai dall’inizio di questa tappa.')],
      [
        h('button', { class: 'bottone bottone--primario', type: 'button', onclick: () => cx.chiudiStrato() }, 'Continua'),
        h('button', { class: 'bottone', type: 'button', onclick: () => cx.vai(indirizzo.capitolo(cap)) }, 'Esci'),
      ],
    ),
  );
}
