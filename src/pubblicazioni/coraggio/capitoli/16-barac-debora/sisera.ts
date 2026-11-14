import type { Passo, Ruolo } from '@/contenuti/tipi';
import { F, b } from './base';
import { pianura } from './scenari';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });

/**
 * Il punto di vista di Sisera, il nemico, fino alla disfatta (Giudici 4:2-15).
 * Non è un modello da imitare: serve a vedere su che cosa contava chi opprimeva il
 * popolo di Dio. La sua fuga verso la tenda di Iael è il capitolo 17.
 */
export const sisera: Ruolo = {
  id: 'sisera',
  nome: 'Sisera',
  titolo: 'Il nemico che contava sui suoi carri',
  descrizione: 'Guarda il racconto dalla parte del nemico: i carri di ferro, la notizia dal Tabor, la disfatta sotto la pioggia.',
  fedelta:
    'Giudici 4 e 5, Perspicacia e le pubblicazioni citate dal capitolo 16. Non è un modello da imitare: serve a capire su che cosa contava il nemico del popolo di Dio. Non gli vengono attribuite parole.',
  modo: 'cammina',
  stile: 'sisera',
  durata: '8-10 minuti',
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
        { x0: 300, x1: 760, n: 10, seme: 73, armati: 0.3, piano: 'fondo', comportamento: 'vaga' },
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
      id: 'sisera-disfatta',
      titolo: 'La disfatta',
      luogo: 'Sotto la pioggia',
      ...pianura(2800),
      suono: 'pioggia',
      inizioX: 1360,
      vars: { pioggia: 1 },
      folle: [{ x0: 900, x1: 1100, n: 8, seme: 75, armati: 0.6, comportamento: 'insegue', distanza: [560, 320] }],
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
          id: 'forze',
          x: 1900,
          tipo: 'leggi',
          etichetta: 'Come è potuto succedere?',
          richiede: ['pantano'],
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
                dettaglio: 'causa-disfatta',
              },
            },
          ],
        },
        {
          id: 're',
          x: 1700,
          tipo: 'leggi',
          etichetta: 'I re che vennero con te',
          richiede: ['pantano'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'domanda',
                id: 're-di-canaan',
                domanda: 'Il canto di Debora ricorderà i re di Canaan che combatterono a Taanac, presso le acque di Meghiddo. Che cosa dice che ottennero?',
                opzioni: ['Un grande bottino di carri e cavalli', 'Nessun bottino d’argento', 'Le terre di Zabulon e Neftali'],
                corretta: 1,
                spiegazione: '«Vennero re e combatterono […] Non presero alcun bottino d’argento.»',
                fonti: [b('Giudici', 5, '19')],
              },
            },
          ],
        },
        {
          id: 'salta',
          x: 2300,
          tipo: 'agisci',
          etichetta: 'Salta giù dal carro',
          richiede: ['forze', 're'],
          passi: [det('abbandona')],
        },
      ],
    },
  ],
  epilogo: [
    {
      t: 'narra',
      testo:
        'Forse Sisera pensava di essere ormai in salvo. Ma Barac si lanciò all’inseguimento, e dove andò a nascondersi lo racconta il capitolo 17, «Benedetta fra le donne».',
      certezza: 'libro',
      fonti: [F.libro],
    },
    senti('s-carri'),
  ],
};
