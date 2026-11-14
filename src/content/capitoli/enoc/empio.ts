import type { Passo, Ruolo } from '../../tipi';
import { F, b } from './base';
import { NASTRO } from './enoc';
import { mondo, notte, strada } from './scenari';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });

const LINEE = [b('Genesi', 4, '17, 18'), b('Genesi', 5, '3-18')];

/**
 * Il punto di vista di uno dei contemporanei di Enoc.
 *
 * La Bibbia non riporta nomi né episodi: li chiama «empi» e dice che cosa
 * facevano e dicevano. Qui si indaga il loro mondo, si ascolta il messaggio
 * che li riguardava e si cerca un uomo che non si trova più.
 */
export const empio: Ruolo = {
  id: 'empio',
  nome: 'Uno degli empi',
  titolo: 'Dalla parte di chi ascoltò il messaggio',
  descrizione:
    'Indaga il mondo violento che sembra normale, ascolta un messaggio che parla di te, cerca un uomo che a un certo punto non si trova più.',
  fedelta:
    'La Bibbia non dà nomi né storie a queste persone: riporta ciò che facevano e dicevano (Giuda 14, 15; Genesi 4). Qui non c’è altro, e le ricerche notturne sono una ricostruzione dichiarata. Non è un modello da imitare: serve a capire a chi parlava Enoc.',
  modo: 'cammina',
  stile: 'empio',
  durata: '12-15 minuti',
  conclusione: 'Hai visto il racconto dalla parte degli empi',
  scene: [
    {
      id: 'empio-mondo',
      titolo: 'Il tuo mondo',
      luogo: 'Ciò che qui è normale',
      ...mondo(3000),
      inizioX: 140,
      folle: [
        { x0: 1080, x1: 1250, n: 5, seme: 3, armati: 0.8, gruppo: 'rissa' },
        { x0: 1400, x1: 1800, n: 6, seme: 5, donne: 0.4, bimbi: 0.15, comportamento: 'vaga' },
        { x0: 2170, x1: 2360, n: 7, seme: 7, gruppo: 'invoca' },
        { x0: 900, x1: 2900, n: 12, seme: 13, piano: 'fondo', comportamento: 'vaga' },
      ],
      attori: [{ id: 'enoc', x: 2800, stile: 'enoc', percorso: [2740, 2920] }],
      ingresso: [
        {
          t: 'narra',
          titolo: 'Sei uno dei contemporanei di Enoc',
          testo:
            'La Bibbia non riporta il tuo nome. Dice che cosa fa e che cosa dice la gente come te. Indaga: cerca gli indizi di ciò che, qui, è diventato normale.',
          certezza: 'scritto',
          fonti: [b('Giuda', 1, '15')],
        },
      ],
      punti: [
        {
          id: 'origini',
          x: 520,
          tipo: 'esamina',
          etichetta: 'Il primo omicidio',
          passi: [
            {
              t: 'narra',
              testo: 'Nei campi, Caino aveva aggredito suo fratello Abele e lo aveva ucciso.',
              arte: 'caino-abele',
              certezza: 'scritto',
              fonti: [b('Genesi', 4, '8')],
            },
            det('caino-abele'),
            det('spirito-ribelle'),
          ],
        },
        {
          id: 'rissa',
          x: 1160,
          tipo: 'esamina',
          etichetta: 'Così si regolano i conti',
          passi: [det('norma'), { t: 'verso', id: 'gen-4-23', intro: 'Parole di un discendente di Caino, conservate nella Bibbia.' }, det('lamec-versi')],
        },
        {
          id: 'fucina',
          x: 1660,
          tipo: 'esamina',
          etichetta: 'Ciò che sapete costruire',
          passi: [det('citta')],
        },
        {
          id: 'idolo',
          x: 2260,
          tipo: 'esamina',
          etichetta: 'Il nome di Dio sulle vostre labbra',
          passi: [
            { t: 'verso', id: 'gen-4-26', evidenzia: ['si cominciò a invocare il nome di Geova'] },
            det('nome-profanato'),
            det('quattro-secoli'),
            det('nome-come'),
            senti('e-mondo'),
          ],
        },
        {
          id: 'linee',
          x: 2560,
          tipo: 'leggi',
          etichetta: 'Due discendenze',
          richiede: ['origini', 'rissa', 'fucina', 'idolo'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'classifica',
                id: 'linee',
                consegna:
                  'Da Adamo partono due discendenze: quella di Caino e quella di Set. Metti ogni nome nella sua. Attento: un nome compare in entrambe.',
                categorie: ['Linea di Caino', 'Linea di Set'],
                voci: [
                  { testo: 'Caino', cat: 0, fonti: LINEE },
                  { testo: 'Set', cat: 1, fonti: LINEE },
                  { testo: 'Enoc, figlio di Caino', cat: 0, fonti: LINEE },
                  { testo: 'Enos', cat: 1, fonti: LINEE },
                  { testo: 'Irad', cat: 0, fonti: LINEE },
                  { testo: 'Chenan', cat: 1, fonti: LINEE },
                  { testo: 'Mehuiael', cat: 0, fonti: LINEE },
                  { testo: 'Maalalel', cat: 1, fonti: LINEE },
                  { testo: 'Metusael', cat: 0, fonti: LINEE },
                  { testo: 'Iared', cat: 1, fonti: LINEE },
                  { testo: 'Lamec, figlio di Metusael', cat: 0, fonti: LINEE },
                  { testo: 'Enoc, figlio di Iared', cat: 1, fonti: LINEE },
                ],
              },
            },
            det('due-settimi'),
          ],
        },
      ],
    },
    {
      id: 'empio-strada',
      titolo: 'Quell’uomo parla in strada',
      luogo: 'Un messaggio che ti riguarda',
      ...strada(2900),
      inizioX: 620,
      vars: { agitazione: 0 },
      folle: [
        { x0: 780, x1: 1240, n: 13, seme: 31, reagisce: true, armati: 0.15, donne: 0.3, comportamento: 'vaga' },
        { x0: 1480, x1: 1980, n: 14, seme: 33, reagisce: true, armati: 0.3, donne: 0.25, comportamento: 'vaga' },
        { x0: 2220, x1: 2760, n: 15, seme: 35, reagisce: true, armati: 0.4, donne: 0.2, comportamento: 'vaga' },
        { x0: 600, x1: 2900, n: 14, seme: 37, piano: 'fondo', comportamento: 'vaga' },
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
            det('infastiditi'),
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
                testo:
                  '…per eseguire il giudizio contro tutti e dimostrare la colpevolezza di tutti gli [[empi]] per tutte le opere [[empie]] che hanno [[empiamente]] compiuto e per tutte le cose offensive che gli [[empi]] peccatori hanno detto contro di lui.',
                spiegazione: 'Quattro parole, un solo concetto.',
              },
            },
            det('quattro-volte'),
            det('empi-significato'),
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
            det('opere-parole'),
            senti('e-parole'),
            { t: 'fx', fx: { k: 'posa', chi: 'enoc', posa: 'fermo' } },
          ],
        },
        {
          id: 'reazioni',
          x: 2740,
          tipo: 'esamina',
          etichetta: 'Che cosa succede intorno a te',
          richiede: ['ascolta-3'],
          passi: [det('reazione')],
        },
      ],
    },
    {
      id: 'empio-caccia',
      titolo: 'Farlo tacere',
      luogo: 'La Bibbia lo lascia intendere',
      ...notte(3000),
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
          id: 'cerca-1',
          x: 1080,
          tipo: 'esamina',
          etichetta: 'Tra le rocce',
          passi: [
            {
              t: 'narra',
              testo: 'Lo cercate tra le rocce, con le torce.',
              ricostruzione: true,
              fonti: [F.w01, F.libro],
            },
            det('scherni'),
          ],
        },
        {
          id: 'cerca-2',
          x: 1680,
          tipo: 'esamina',
          etichetta: 'Lungo il sentiero',
          passi: [
            {
              t: 'narra',
              testo: 'Lo cercate lungo il sentiero. Nessuna traccia.',
              ricostruzione: true,
              fonti: [b('Ebrei', 11, '5')],
            },
            det('non-trovato'),
            senti('e-vuoto'),
          ],
        },
        {
          id: 'resta',
          x: 2500,
          tipo: 'medita',
          etichetta: 'Il messaggio resta',
          richiede: ['cerca-1', 'cerca-2'],
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
  epilogo: [],
};
