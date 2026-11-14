import type { Passo, Ruolo } from '../../tipi';
import { PAROLE, b } from './base';
import { pianura, tendaIael } from './scenari';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });

/**
 * Il punto di vista di Sisera, il nemico.
 *
 * Non è un modello da imitare: serve a vedere su che cosa contava chi opprimeva il
 * popolo di Dio (carri, alleanze, un nascondiglio) e come andò a finire. Le sue
 * parole sono quelle di Giudici 4:19, 20; la sua morte non viene mostrata.
 */
export const sisera: Ruolo = {
  id: 'sisera',
  nome: 'Sisera',
  titolo: 'Il nemico che contava sui suoi carri',
  descrizione:
    'Guarda il racconto dalla parte del nemico: i carri di ferro, la disfatta sotto la pioggia, la fuga, una tenda dove credi di essere al sicuro.',
  fedelta:
    'Giudici 4 e 5, Perspicacia e La Torre di Guardia 1/8/2015. Non è un modello da imitare: serve a capire su che cosa contava il nemico del popolo di Dio. Le sue parole sono quelle del testo; la sua morte non viene mostrata.',
  modo: 'cammina',
  stile: 'sisera',
  durata: '10-12 minuti',
  conclusione: 'Hai visto il racconto dalla parte del nemico',
  scene: [
    {
      id: 'sisera-carri',
      titolo: 'Novecento carri',
      luogo: 'Presso il torrente Chison',
      ...pianura(2800),
      inizioX: 2500,
      vars: { pioggia: 0 },
      folle: [
        { x0: 1600, x1: 2350, n: 14, seme: 71, armati: 0.9, comportamento: 'vaga' },
        { x0: 300, x1: 760, n: 10, seme: 73, armati: 0.5, piano: 'fondo', comportamento: 'vaga' },
      ],
      ingresso: [
        {
          t: 'narra',
          titolo: 'Sei Sisera',
          testo: 'Sei il capo dell’esercito di Iabin, re di Canaan.',
          certezza: 'scritto',
          fonti: [b('Giudici', 4, '2')],
        },
        {
          t: 'narra',
          testo:
            'Questo punto di vista non è un modello da imitare: serve a capire su che cosa contava il nemico del popolo di Dio. Cerca gli indizi intorno a te.',
        },
      ],
      punti: [
        {
          id: 'aroset',
          x: 2380,
          tipo: 'esamina',
          etichetta: 'Da dove vieni',
          passi: [det('aroset')],
        },
        {
          id: 'carri',
          x: 2020,
          tipo: 'esamina',
          etichetta: 'I tuoi carri',
          passi: [det('novecento'), det('falci')],
        },
        {
          id: 'terrore',
          x: 1760,
          tipo: 'esamina',
          etichetta: 'Il tuo nome',
          passi: [det('terrore')],
        },
        {
          id: 'notizia',
          x: 1360,
          tipo: 'ascolta',
          etichetta: 'Una notizia dal Tabor',
          richiede: ['aroset', 'carri', 'terrore'],
          passi: [det('radunati')],
        },
      ],
    },
    {
      id: 'sisera-fuga',
      titolo: 'La disfatta',
      luogo: 'Sotto la pioggia',
      ...pianura(2800),
      suono: 'pioggia',
      inizioX: 1360,
      vars: { pioggia: 1 },
      folle: [{ x0: 900, x1: 1100, n: 8, seme: 75, armati: 0.9, comportamento: 'insegue', distanza: [560, 320] }],
      ingresso: [
        {
          t: 'narra',
          testo: 'Geova ha gettato nello scompiglio te, tutti i tuoi carri e tutto il tuo esercito.',
          certezza: 'scritto',
          fonti: [b('Giudici', 4, '15')],
        },
      ],
      punti: [
        {
          id: 'pantano',
          x: 1480,
          tipo: 'esamina',
          etichetta: 'Il tuo carro',
          passi: [det('pioggia')],
        },
        {
          id: 'salta',
          x: 1560,
          tipo: 'agisci',
          etichetta: 'Salta giù dal carro',
          richiede: ['pantano'],
          passi: [det('abbandona')],
        },
        {
          id: 'forze',
          x: 1900,
          tipo: 'leggi',
          etichetta: 'Come è potuto succedere?',
          richiede: ['salta'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'classifica',
                id: 'forze',
                consegna: 'Su che cosa poteva contare ciascuno? Metti ogni forza dalla sua parte.',
                categorie: ['Con Sisera', 'Con Barac'],
                voci: [
                  { testo: '900 carri da guerra', cat: 0, fonti: [b('Giudici', 4, '13')] },
                  { testo: 'Le truppe e i re di Canaan', cat: 0, fonti: [b('Giudici', 4, '13'), b('Giudici', 5, '19')] },
                  { testo: '10.000 uomini di Neftali e Zabulon', cat: 1, fonti: [b('Giudici', 4, '10')] },
                  { testo: 'Né scudo né lancia fra quarantamila', cat: 1, fonti: [b('Giudici', 5, '8')] },
                  { testo: 'Geova, che va davanti', cat: 1, fonti: [b('Giudici', 4, '14')] },
                  { testo: 'La profetessa Debora', cat: 1, fonti: [b('Giudici', 4, '10')] },
                ],
                dettaglio: 'mal-equipaggiato',
              },
            },
          ],
        },
        {
          id: 'rifugio',
          x: 2500,
          tipo: 'agisci',
          etichetta: 'Dove andare?',
          richiede: ['forze'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'domanda',
                id: 'rifugio',
                domanda: 'Dove cerca rifugio Sisera?',
                opzioni: ['Ad Hazor, dal re Iabin', 'Ad Aroset-Goim, a casa sua', 'Alla tenda di Iael, moglie di Heber il chenita'],
                corretta: 2,
                dettaglio: 'pace-heber',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'sisera-tenda',
      titolo: 'Al sicuro, credi',
      luogo: 'Le tende di Heber il chenita',
      ...tendaIael(1500),
      inizioX: 1380,
      attori: [{ id: 'iael', x: 860, stile: 'iael', verso: 1 }],
      ingresso: [
        { t: 'fx', fx: { k: 'vai', chi: 'iael', x: 1060, vel: 90, attendi: true } },
      ],
      punti: [
        {
          id: 'invito',
          x: 1150,
          tipo: 'ascolta',
          etichetta: 'Una donna ti viene incontro',
          passi: [
            { t: 'fx', fx: { k: 'nastro', chi: 'iael', testo: PAROLE.invito, dur: 4.5 } },
            det('inconcepibile'),
            { t: 'fx', fx: { k: 'vai', chi: 'iael', x: 860, vel: 90 } },
          ],
        },
        {
          id: 'acqua',
          x: 800,
          tipo: 'agisci',
          etichetta: 'Chiedi da bere',
          richiede: ['invito'],
          passi: [
            { t: 'fx', fx: { k: 'nastro', chi: 'giocatore', testo: PAROLE.acqua, dur: 4 } },
            {
              t: 'narra',
              testo: 'Iael apre un otre di latte e ti dà da bere.',
              certezza: 'scritto',
              fonti: [b('Giudici', 4, '19')],
            },
            det('credendosi'),
          ],
        },
        {
          id: 'ordine',
          x: 800,
          tipo: 'agisci',
          etichetta: 'Dalle un ordine',
          richiede: ['acqua'],
          passi: [
            { t: 'fx', fx: { k: 'nastro', chi: 'giocatore', testo: PAROLE.entrata, dur: 3 } },
            { t: 'fx', fx: { k: 'nastro', chi: 'giocatore', testo: PAROLE.rispondi, dur: 5 } },
            senti('s-sicuro'),
          ],
        },
        {
          id: 'riposa',
          x: 770,
          tipo: 'agisci',
          etichetta: 'Riposa',
          richiede: ['ordine'],
          passi: [
            { t: 'fx', fx: { k: 'posa', chi: 'giocatore', posa: 'coperto' } },
            det('esausto'),
            { t: 'fx', fx: { k: 'dissolvi', a: 1, dur: 2.4 } },
          ],
        },
      ],
    },
  ],
  epilogo: [
    {
      t: 'narra',
      testo: 'Mentre Sisera dormiva, Iael prese un piolo da tenda e un martello. E Sisera morì.',
      certezza: 'scritto',
      fonti: [b('Giudici', 4, '21')],
    },
    det('nessuno'),
    senti('s-fine'),
  ],
};
