import { chiave, dettagliDelRuolo } from '@/contenuti';
import type { Capitolo, Pubblicazione } from '@/contenuti/tipi';
import { NOME_GIOCO, type Contesto } from '../contesto';
import { esterno, h } from '../dom';
import { indirizzo } from '../indirizzi';
import { apriQuaderno, apriVerso, barra } from '../pannelli';
import { conteggi } from './indice';

/** «Il libro» per la barra: il nome breve della pubblicazione, con la maiuscola. */
export const comeTitolo = (pub: Pubblicazione): string => `${pub.breve[0].toUpperCase()}${pub.breve.slice(1)}`;

/** Un capitolo: i passi da leggere, i punti di vista, il quaderno. */
export function schermoCapitolo(cx: Contesto, pub: Pubblicazione, cap: Capitolo): void {
  document.title = `${cap.nome} · ${NOME_GIOCO}`;
  cx.schermo.className = 'schermo schermo--pagina';
  const { trovati, totali } = conteggi(cx, cap);
  const scoperti = new Set(cx.salvataggio.dettagli(chiave(cap)));
  cx.schermo.append(
    barra(cx, `Capitolo ${cap.numero}`, indirizzo.indice(pub.id), comeTitolo(pub)),
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
            h('button', { class: 'bottone bottone--pillola', type: 'button', onclick: () => apriVerso(cx, cap, id) }, cap.versi[id].rif),
          ),
          esterno('Il capitolo su jw.org', cap.url, 'passi__link'),
        ),
      ),
      h('h2', { class: 'pagina__sezione' }, 'Da quale punto di vista vuoi viverlo?'),
      h(
        'div',
        { class: 'ruoli' },
        cap.ruoli.map((ruolo) => {
          const prog = cx.salvataggio.ruolo(chiave(cap), ruolo.id);
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
              h('button', { class: 'bottone bottone--primario', type: 'button', onclick: () => cx.vai(indirizzo.gioca(cap, ruolo)) }, etichetta),
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
        h('button', { class: 'bottone', type: 'button', onclick: () => apriQuaderno(cx, cap) }, 'Apri il quaderno'),
      ),
    ),
  );
}
