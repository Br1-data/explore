import { chiave, dettagliDelRuolo, sensazioniDelRuolo } from '@/contenuti';
import type { Capitolo, Ruolo } from '@/contenuti/tipi';
import { NOME_GIOCO, type Contesto } from '../contesto';
import { h } from '../dom';
import { indirizzo } from '../indirizzi';
import { apriQuaderno, barra } from '../pannelli';
import { sezioniStudio } from '../quaderno';
import { conteggi } from './indice';

/** La conclusione di un racconto: che cosa si è scoperto, gli altri punti di vista, le domande di studio. */
export function schermoFine(cx: Contesto, cap: Capitolo, ruolo: Ruolo): void {
  document.title = `${ruolo.nome} · ${NOME_GIOCO}`;
  cx.schermo.className = 'schermo schermo--pagina';
  const scoperti = new Set(cx.salvataggio.dettagli(chiave(cap)));
  const suoi = dettagliDelRuolo(ruolo);
  const fatti = suoi.filter((id) => scoperti.has(id)).length;
  const { trovati, totali } = conteggi(cx, cap);
  const sens = sensazioniDelRuolo(ruolo).length;
  const altri = cap.ruoli.filter((r) => r.id !== ruolo.id && !cx.salvataggio.ruolo(chiave(cap), r.id).finito);
  const mancanti = suoi.length - fatti;
  cx.schermo.append(
    barra(cx, `Capitolo ${cap.numero} · ${cap.nome}`, indirizzo.capitolo(cap), 'Il capitolo'),
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
              `Ti ${mancanti === 1 ? 'è sfuggito un dettaglio facoltativo' : `sono sfuggiti ${mancanti} dettagli facoltativi`}: cercali tra i segnali con il bordo tratteggiato.`,
            )
          : h('p', { class: 'pagina__intro' }, 'Hai colto tutti i dettagli di questo punto di vista.'),
        h(
          'div',
          { class: 'azioni' },
          h('button', { class: 'bottone bottone--primario', type: 'button', onclick: () => apriQuaderno(cx, cap) }, 'Apri il quaderno'),
          h('button', { class: 'bottone', type: 'button', onclick: () => cx.vai(indirizzo.capitolo(cap)) }, 'Scegli un altro punto di vista'),
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
                  { class: 'bottone bottone--pillola', type: 'button', onclick: () => cx.vai(indirizzo.gioca(cap, r)) },
                  `${r.nome} · ${dettagliDelRuolo(r).filter((id) => !scoperti.has(id)).length} dettagli nuovi`,
                ),
              ),
            ),
          )
        : null,
      h('h2', { class: 'pagina__sezione' }, 'Ora fermati sul racconto'),
      h('p', { class: 'pagina__intro' }, 'Le domande seguono le sezioni di studio del capitolo. Le risposte restano nel tuo quaderno.'),
      sezioniStudio(cap, cx.salvataggio),
    ),
  );
}
