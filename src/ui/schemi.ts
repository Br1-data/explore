import { h } from './dom';

/**
 * Schemi di studio mostrati nelle schede. I numeri vengono da Genesi 5;
 * le date di Adamo, Enoc e Noè dalla linea del tempo del libro, le altre
 * sono calcolate a partire da quelle.
 */

/** [nome, nascita a.E.V., morte a.E.V., anni] */
export const VITE: [string, number, number, number][] = [
  ['Adamo', 4026, 3096, 930],
  ['Set', 3896, 2984, 912],
  ['Enos', 3791, 2886, 905],
  ['Chenan', 3701, 2791, 910],
  ['Maalalel', 3631, 2736, 895],
  ['Iared', 3566, 2604, 962],
  ['Enoc', 3404, 3039, 365],
  ['Matusalemme', 3339, 2370, 969],
  ['Lamec', 3152, 2375, 777],
  ['Noè', 2970, 2020, 950],
];

const LINEA_SET = ['Adamo', 'Set', 'Enos', 'Chenan', 'Maalalel', 'Iared', 'Enoc'];
const LINEA_CAINO = ['Adamo', 'Caino', 'Enoc*', 'Irad', 'Mehuiael', 'Metusael', 'Lamec'];

function fila(nomi: string[], titolo: string): HTMLElement {
  return h(
    'div',
    { class: 'fila' },
    h('span', { class: 'fila__titolo' }, titolo),
    h(
      'ol',
      { class: 'fila__voci' },
      nomi.map((n, i) =>
        h('li', { class: i === nomi.length - 1 ? 'pietra pietra--evidenza' : 'pietra' }, h('b', null, i + 1), h('span', null, n)),
      ),
    ),
  );
}

function generazioni(): HTMLElement {
  return h(
    'figure',
    { class: 'schema' },
    fila(LINEA_SET, 'Da Adamo a Enoc'),
    h(
      'figcaption',
      null,
      'Adamo: 4026-3096 a.E.V. Enoc: 3404-3039 a.E.V. Le due vite si sovrappongono per 308 anni.',
    ),
  );
}

function dueLinee(): HTMLElement {
  return h(
    'figure',
    { class: 'schema' },
    fila(LINEA_SET, 'Linea di Set'),
    fila(LINEA_CAINO, 'Linea di Caino'),
    h(
      'figcaption',
      null,
      '* Un altro Enoc: il figlio di Caino (Genesi 4:17). Genesi 4:17, 18; 5:3-18.',
    ),
  );
}

function vite(): HTMLElement {
  const inizio = 4026;
  const fine = 2020;
  const durata = inizio - fine;
  const pos = (anno: number): number => ((inizio - anno) / durata) * 100;
  const righe = VITE.map(([nome, nasce, muore, anni]) =>
    h(
      'div',
      { class: nome === 'Enoc' ? 'vita vita--evidenza' : 'vita' },
      h('span', { class: 'vita__nome' }, nome),
      h(
        'span',
        { class: 'vita__traccia' },
        h('span', { class: 'vita__barra', style: `left:${pos(nasce)}%;width:${pos(muore) - pos(nasce)}%` }),
      ),
      h('span', { class: 'vita__anni' }, anni),
    ),
  );
  return h(
    'figure',
    { class: 'schema schema--vite' },
    h(
      'div',
      { class: 'vite' },
      righe,
      h(
        'div',
        { class: 'vite__segni', 'aria-hidden': 'true' },
        h('span', { class: 'segno', style: `left:${pos(3039)}%` }, h('i', null, 'Enoc è preso · 3039')),
        h('span', { class: 'segno segno--b', style: `left:${pos(2370)}%` }, h('i', null, 'Diluvio · 2370')),
      ),
    ),
    h(
      'figcaption',
      null,
      'Anni di vita secondo Genesi 5 e 9:29. Date a.E.V.: Adamo, Enoc e Noè dalla linea del tempo del libro; le altre sono calcolate.',
    ),
  );
}

function poiMori(): HTMLElement {
  const elenco = VITE.slice(0, 9).map(([nome, , , anni]) =>
    h(
      'li',
      { class: nome === 'Enoc' ? 'formula formula--evidenza' : 'formula' },
      h('span', { class: 'formula__nome' }, nome),
      h('span', { class: 'formula__anni' }, `${anni} anni`),
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
  generazioni,
  'due-linee': dueLinee,
  vite,
  'poi-mori': poiMori,
};

export const ID_SCHEMI = Object.keys(SCHEMI);

export function creaSchema(id: string): HTMLElement | null {
  return SCHEMI[id]?.() ?? null;
}
