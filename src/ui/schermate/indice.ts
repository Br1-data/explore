import { capitoloDi, chiave, totaleCapitoli } from '@/contenuti';
import type { Capitolo, Pubblicazione } from '@/contenuti/tipi';
import { NOME_GIOCO, type Contesto } from '../contesto';
import { esterno, h } from '../dom';
import { indirizzo } from '../indirizzi';
import { barra } from '../pannelli';

/** Quanti dettagli del capitolo sono stati scoperti, su quanti. */
export function conteggi(cx: Contesto, cap: Capitolo): { trovati: number; totali: number } {
  return { trovati: cx.salvataggio.dettagli(chiave(cap)).length, totali: Object.keys(cap.dettagli).length };
}

/** L’indice di una pubblicazione: tutti i capitoli, giocabili e in preparazione. */
export function schermoIndice(cx: Contesto, pub: Pubblicazione): void {
  document.title = `${pub.titolo} · ${NOME_GIOCO}`;
  cx.schermo.className = 'schermo schermo--pagina';
  const giocabili = pub.capitoli.length;
  cx.schermo.append(
    barra(cx, NOME_GIOCO, indirizzo.inizio(), 'Inizio'),
    h(
      'div',
      { class: 'pagina' },
      h(
        'header',
        { class: 'pagina__testa' },
        h('p', { class: 'occhiello' }, `${totaleCapitoli(pub)} capitoli · ${giocabili} ${giocabili === 1 ? 'giocabile' : 'giocabili'}`),
        h('h1', null, pub.titolo),
        h('p', { class: 'pagina__intro' }, `${pub.descrizione} `, esterno(`${pub.breve[0].toUpperCase()}${pub.breve.slice(1)} su jw.org`, pub.url)),
      ),
      pub.parti.map((parte) =>
        h(
          'section',
          { class: 'parte' },
          h('header', { class: 'parte__testa' }, h('span', { class: 'occhiello' }, `Parte ${parte.numero}`), h('h2', null, parte.titolo), h('p', null, parte.periodo)),
          h(
            'ol',
            { class: 'capitoli' },
            parte.capitoli.map((voce) => {
              const cap = capitoloDi(pub, voce.numero);
              const contenuto = [
                h('span', { class: 'capitolo__numero' }, voce.numero),
                h('span', { class: 'capitolo__nome' }, voce.nome),
                h('span', { class: 'capitolo__titolo' }, voce.titolo),
              ];
              if (!cap) {
                return h(
                  'li',
                  null,
                  h('div', { class: 'capitolo' }, contenuto, h('span', { class: 'capitolo__stato' }, 'In preparazione · ', esterno('leggi su jw.org', voce.url))),
                );
              }
              const { trovati, totali } = conteggi(cx, cap);
              return h(
                'li',
                null,
                h(
                  'button',
                  { class: 'capitolo capitolo--attivo', type: 'button', onclick: () => cx.vai(indirizzo.capitolo(cap)) },
                  contenuto,
                  h('span', { class: 'capitolo__stato' }, trovati ? `${trovati} dettagli su ${totali}` : 'Gioca'),
                ),
              );
            }),
          ),
        ),
      ),
    ),
  );
}
