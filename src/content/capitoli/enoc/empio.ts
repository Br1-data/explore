import type { Passo, Ruolo } from '../../tipi';
import { F, b } from './base';
import { GIUDA_15_DA_TROVARE, NASTRO } from './enoc';
import { mondo, notte, strada } from './scenari';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });

/**
 * Il punto di vista di uno dei contemporanei di Enoc.
 *
 * La Bibbia non riporta nomi né episodi: li chiama «empi» e dice che cosa
 * facevano e dicevano. Il percorso mostra solo questo, per capire a chi era
 * rivolto il messaggio e perché serviva coraggio per portarlo.
 */
export const empio: Ruolo = {
  id: 'empio',
  nome: 'Uno degli empi',
  titolo: 'Dalla parte di chi ascoltò il messaggio',
  descrizione:
    'Guarda il racconto dalla parte sbagliata: il mondo violento che sembra normale, le parole di Enoc che ti riguardano, un uomo che a un certo punto non si trova più.',
  fedelta:
    'La Bibbia non dà nomi né storie a queste persone: riporta ciò che facevano e dicevano (Giuda 14, 15; Genesi 4). Qui non c’è altro. Non è un modello da imitare: serve a capire a chi parlava Enoc.',
  modo: 'cammina',
  stile: 'empio',
  durata: '8-10 minuti',
  conclusione: 'Hai visto il racconto dalla parte degli empi',
  scene: [
    {
      id: 'empio-mondo',
      titolo: 'Il tuo mondo',
      luogo: 'La settima generazione da Adamo',
      ...mondo(),
      inizioX: 700,
      folle: [
        { x0: 1080, x1: 1250, n: 5, seme: 3, armati: 0.8, gruppo: 'rissa' },
        { x0: 1400, x1: 1800, n: 6, seme: 5, donne: 0.4, bimbi: 0.15, comportamento: 'vaga' },
        { x0: 2170, x1: 2360, n: 7, seme: 7, gruppo: 'invoca' },
        { x0: 2420, x1: 2760, n: 6, seme: 9, armati: 0.3, donne: 0.3, comportamento: 'vaga' },
        { x0: 900, x1: 2800, n: 12, seme: 13, piano: 'fondo', comportamento: 'vaga' },
      ],
      attori: [{ id: 'enoc', x: 3000, stile: 'enoc', percorso: [2920, 3350] }],
      ingresso: [
        {
          t: 'narra',
          titolo: 'Sei uno dei contemporanei di Enoc',
          testo:
            'La Bibbia non riporta il tuo nome. Dice che cosa fa e che cosa dice la gente come te, e la chiama con una parola sola: «empi».',
          certezza: 'scritto',
          fonti: [b('Giuda', 1, '15')],
        },
        det('empi-significato'),
      ],
      punti: [
        {
          id: 'violenza',
          x: 1160,
          tipo: 'osserva',
          etichetta: 'Così si regolano i conti',
          passi: [
            det('norma'),
            det('caino-abele'),
            { t: 'verso', id: 'gen-4-23', intro: 'Parole di un discendente di Caino, conservate nella Bibbia.' },
            det('lamec-versi'),
          ],
        },
        {
          id: 'citta',
          x: 1650,
          tipo: 'osserva',
          etichetta: 'Ciò che sapete costruire',
          facoltativo: true,
          passi: [det('citta')],
        },
        {
          id: 'nome',
          x: 2230,
          tipo: 'ascolta',
          etichetta: 'Il nome di Dio sulle vostre labbra',
          passi: [
            { t: 'verso', id: 'gen-4-26', evidenzia: ['si cominciò a invocare il nome di Geova'] },
            det('nome-profanato'),
            det('nome-come'),
            det('spirito-ribelle'),
            senti('e-mondo'),
          ],
        },
        {
          id: 'uomo',
          x: 2900,
          tipo: 'osserva',
          etichetta: 'Un uomo che non fa come voi',
          richiede: ['violenza', 'nome'],
          passi: [det('rifiuto-nome'), det('pacifico'), det('solo')],
        },
      ],
    },
    {
      id: 'empio-strada',
      titolo: 'Quell’uomo parla in strada',
      luogo: 'Un messaggio che ti riguarda',
      ...strada(),
      inizioX: 620,
      vars: { agitazione: 0 },
      folle: [
        { x0: 780, x1: 1240, n: 13, seme: 31, reagisce: true, armati: 0.15, donne: 0.3, comportamento: 'vaga' },
        { x0: 1480, x1: 1980, n: 14, seme: 33, reagisce: true, armati: 0.3, donne: 0.25, comportamento: 'vaga' },
        { x0: 2220, x1: 2760, n: 15, seme: 35, reagisce: true, armati: 0.4, donne: 0.2, comportamento: 'vaga' },
        { x0: 600, x1: 3000, n: 14, seme: 37, piano: 'fondo', comportamento: 'vaga' },
      ],
      attori: [{ id: 'enoc', x: 1090, stile: 'enoc', verso: -1 }],
      ingresso: [
        {
          t: 'narra',
          testo:
            'Enoc ha un incarico da profeta. Porta il suo messaggio proprio a voi, che avete un atteggiamento e un comportamento molto diversi dai suoi.',
          certezza: 'libro',
          fonti: [F.libro],
        },
      ],
      punti: [
        {
          id: 'ascolta-1',
          x: 1000,
          tipo: 'ascolta',
          etichetta: 'Fermati ad ascoltare',
          passi: [
            { t: 'fx', fx: { k: 'posa', chi: 'enoc', posa: 'proclama' } },
            { t: 'fx', fx: { k: 'nastro', chi: 'enoc', testo: NASTRO[0], dur: 5 } },
            { t: 'fx', fx: { k: 'var', nome: 'agitazione', a: 0.35, dur: 2.5 } },
            det('messaggio'),
            det('miriadi'),
            { t: 'fx', fx: { k: 'vai', chi: 'enoc', x: 1810, vel: 150 } },
          ],
        },
        {
          id: 'ascolta-2',
          x: 1720,
          tipo: 'ascolta',
          etichetta: 'Parla di voi',
          richiede: ['ascolta-1'],
          passi: [
            { t: 'fx', fx: { k: 'posa', chi: 'enoc', posa: 'proclama' } },
            { t: 'fx', fx: { k: 'nastro', chi: 'enoc', testo: NASTRO[1], dur: 5.5 } },
            { t: 'fx', fx: { k: 'var', nome: 'agitazione', a: 0.7, dur: 2.5 } },
            {
              t: 'attivita',
              a: {
                tipo: 'trova',
                id: 'quattro-volte',
                consegna: 'Con quale parola vi descrive? Tocca ogni parola che esprime quel concetto.',
                rif: 'Giuda 15',
                testo: GIUDA_15_DA_TROVARE,
                spiegazione: 'Il concetto di empietà è ripetuto ben quattro volte.',
              },
            },
            det('quattro-volte'),
            det('opere-parole'),
            { t: 'fx', fx: { k: 'vai', chi: 'enoc', x: 2570, vel: 150 } },
          ],
        },
        {
          id: 'ascolta-3',
          x: 2480,
          tipo: 'ascolta',
          etichetta: 'Dice tutto, fino in fondo',
          richiede: ['ascolta-2'],
          passi: [
            { t: 'fx', fx: { k: 'posa', chi: 'enoc', posa: 'proclama' } },
            { t: 'fx', fx: { k: 'nastro', chi: 'enoc', testo: NASTRO[2], dur: 5 } },
            { t: 'fx', fx: { k: 'var', nome: 'agitazione', a: 1, dur: 2.5 } },
            det('al-passato'),
            det('non-gradite'),
            senti('e-parole'),
            { t: 'fx', fx: { k: 'posa', chi: 'enoc', posa: 'fermo' } },
          ],
        },
        {
          id: 'folla',
          x: 2960,
          tipo: 'osserva',
          etichetta: 'Arrabbiati, infastiditi, armati',
          richiede: ['ascolta-3'],
          passi: [det('strada'), det('infastiditi'), det('scherni')],
        },
      ],
    },
    {
      id: 'empio-caccia',
      titolo: 'Farlo tacere',
      luogo: 'La Bibbia lo lascia intendere',
      ...notte(),
      inizioX: 460,
      folle: [
        {
          x0: 300,
          x1: 520,
          n: 8,
          seme: 43,
          armati: 0.7,
          torce: 0.5,
          comportamento: 'insegue',
          distanza: [120, 120],
        },
      ],
      ingresso: [
        {
          t: 'narra',
          testo:
            'Sembra che Enoc sia perseguitato dalle persone malvagie del suo tempo. In questo percorso sei tra loro. La Bibbia non descrive la scena: dice soltanto come finì.',
          certezza: 'sembra',
          fonti: [F.libro],
        },
      ],
      punti: [
        {
          id: 'tracce',
          x: 980,
          tipo: 'osserva',
          etichetta: 'Lo cercate',
          passi: [det('reazione'), det('sottratto')],
        },
        {
          id: 'vuoto',
          x: 2050,
          tipo: 'osserva',
          etichetta: 'Non c’è più',
          richiede: ['tracce'],
          passi: [
            { t: 'verso', id: 'ebr-11-5', evidenzia: ['non fu più trovato perché Dio l’aveva portato via'] },
            det('non-trovato'),
            det('prese'),
            det('corpo'),
            det('amore'),
            senti('e-vuoto'),
          ],
        },
        {
          id: 'resta',
          x: 2780,
          tipo: 'medita',
          etichetta: 'Il messaggio resta',
          richiede: ['vuoto'],
          passi: [
            det('anche-loro'),
            det('adempimento'),
            { t: 'verso', id: '2pt-2-5', evidenzia: ['un mondo di empi'] },
            det('mondo-di-empi'),
          ],
        },
      ],
    },
  ],
  epilogo: [
    {
      t: 'narra',
      titolo: 'Due settimi',
      testo:
        'Enoc e Lamec vivono entrambi alla settima generazione da Adamo. Il libro rimanda a un video il cui titolo dice quale dei due imitare.',
      certezza: 'numeri',
      fonti: [F.libro],
    },
    { t: 'schema', id: 'due-linee' },
    det('due-settimi'),
    det('memoria'),
  ],
};
