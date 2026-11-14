import type { Schema } from '@/contenuti/tipi';
import { h } from './dom';

/** Disegna uno schema di studio: le righe con la loro formula (i dati li dà il capitolo). */
export function creaSchema(schema: Schema): HTMLElement {
  return h(
    'figure',
    { class: 'schema' },
    h(
      'ul',
      { class: 'formule' },
      schema.righe.map((r) =>
        h(
          'li',
          { class: r.evidenza ? 'formula formula--evidenza' : 'formula' },
          h('span', { class: 'formula__nome' }, r.nome),
          h('span', { class: 'formula__anni' }, r.dato),
          h('span', { class: 'formula__fine' }, r.formula),
        ),
      ),
    ),
    h('figcaption', null, schema.didascalia),
  );
}
