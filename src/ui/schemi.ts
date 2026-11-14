import { VITE } from '../content/capitoli/enoc/base';
import { h } from './dom';

/** Schemi di studio mostrati nelle schede. */

function poiMori(): HTMLElement {
  const elenco = VITE.slice(0, 9).map(({ nome, nasce, muore }) =>
    h(
      'li',
      { class: nome === 'Enoc' ? 'formula formula--evidenza' : 'formula' },
      h('span', { class: 'formula__nome' }, nome),
      h('span', { class: 'formula__anni' }, `${muore - nasce} anni`),
      h('span', { class: 'formula__fine' }, nome === 'Enoc' ? '«Dio lo prese»' : '«poi morì»'),
    ),
  );
  return h(
    'figure',
    { class: 'schema' },
    h('ul', { class: 'formule' }, elenco),
    h('figcaption', null, 'Come Genesi 5 conclude ogni vita, da Adamo a Lamec (Genesi 5:5-31).'),
  );
}

const SCHEMI: Record<string, () => HTMLElement> = {
  'poi-mori': poiMori,
};

export const ID_SCHEMI = Object.keys(SCHEMI);

export function creaSchema(id: string): HTMLElement | null {
  return SCHEMI[id]?.() ?? null;
}
