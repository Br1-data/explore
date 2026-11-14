import type { Passo, Ruolo } from '@/contenuti/tipi';
import { F, PAROLE, b } from './base';
import { cimaTabor, festa, palma } from './scenari';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });

const TRIBU = (v: string) => [b('Giudici', 5, v)];

/**
 * Il punto di vista di Debora: profetessa e giudice sotto la palma, messaggera del
 * comando di Geova, al fianco di Barac sul Tabor, autrice del canto (Giudici 4:4-14;
 * 5:1-23). Le sue parole sono quelle del testo.
 */
export const debora: Ruolo = {
  id: 'debora',
  nome: 'Debora',
  titolo: 'La profetessa che disse «Verrò senz’altro»',
  descrizione:
    'Giudica sotto la tua palma, trasmetti a Barac il comando di Geova, decidi se seguirlo verso la battaglia, dagli il segnale sul Tabor e intona il canto di vittoria.',
  fedelta:
    'Giudici 4:4-14 e 5:1-23, come li spiega il capitolo 16 del libro con le pubblicazioni che cita. Le parole di Debora e di Barac sono quelle del testo; la scelta riguarda un momento che il racconto descrive.',
  modo: 'cammina',
  stile: 'debora',
  durata: '15-18 minuti',
  conclusione: 'Hai vissuto il racconto nei panni di Debora',
  scene: [
    {
      id: 'debora-palma',
      titolo: 'Sotto la palma',
      luogo: 'Fra Rama e Betel, nella regione montuosa di Efraim',
      ...palma(2000),
      inizioX: 300,
      attori: [{ id: 'barac', x: 1980, stile: 'barac', verso: -1 }],
      folle: [
        { x0: 1080, x1: 1150, n: 2, seme: 101 },
        { x0: 1400, x1: 1700, n: 2, seme: 103, donne: 0.5, comportamento: 'vaga' },
      ],
      ingresso: [
        {
          t: 'narra',
          titolo: 'Sei Debora',
          testo:
            'Sei Debora, profetessa. Cerca gli indizi intorno a te: alcune cose non hanno un segnale, ma luccicano quando ti avvicini.',
          certezza: 'scritto',
          fonti: [b('Giudici', 4, '4')],
        },
      ],
      punti: [
        {
          id: 'incarico',
          x: 560,
          tipo: 'esamina',
          etichetta: 'Il tuo incarico',
          passi: [det('profetessa')],
        },
        {
          id: 'palma',
          x: 880,
          tipo: 'esamina',
          etichetta: 'La palma',
          passi: [{ t: 'verso', id: 'gdc-4-4', evidenzia: ['sotto la palma di Debora', 'gli israeliti salivano da lei per il giudizio'] }],
        },
        {
          id: 'disputa',
          x: 1110,
          tipo: 'esamina',
          etichetta: 'Due uomini e le loro pecore',
          passi: [det('dispute')],
        },
        {
          id: 'chiama',
          x: 980,
          tipo: 'agisci',
          etichetta: 'Manda a chiamare Barac',
          richiede: ['incarico', 'palma', 'disputa'],
          passi: [
            { t: 'fx', fx: { k: 'vai', chi: 'barac', x: 1080, vel: 150, attendi: true } },
            { t: 'fx', fx: { k: 'nastro', chi: 'giocatore', testo: PAROLE.comando, dur: 5.5 } },
            { t: 'fx', fx: { k: 'nastro', chi: 'giocatore', testo: PAROLE.promessa, dur: 5.5 } },
            det('non-autorita'),
          ],
        },
        {
          id: 'risposta',
          x: 980,
          tipo: 'agisci',
          etichetta: 'Barac ti risponde',
          richiede: ['chiama'],
          passi: [
            { t: 'fx', fx: { k: 'nastro', chi: 'barac', testo: PAROLE.condizione, dur: 4.5 } },
            {
              t: 'attivita',
              a: {
                tipo: 'condotta',
                id: 'condotta-verro',
                narrata: true,
                situazione:
                  'Barac accetta l’incarico di Geova a una condizione: che tu vada con lui, verso la guerra contro Sisera e i suoi 900 carri.',
                base: [b('Giudici', 4, '8, 9'), F.libro],
                opzioni: [
                  {
                    testo: 'Resti sotto la palma: andare in battaglia non è il tuo incarico.',
                    esito:
                      'Qui Debora era al sicuro. Per accompagnare Barac dovette lasciare la sua casa e seguirlo sul campo di battaglia: per questo le servì coraggio.',
                    fonti: [F.w03, F.riguarda],
                  },
                  {
                    testo: 'Prendi tu il comando dell’esercito.',
                    esito:
                      'Debora non cercò di prendere il comando: continuò a essere una modesta servitrice di Geova. Il giudice e salvatore che Geova aveva scelto era Barac.',
                    fonti: [F.w03, F.libro],
                  },
                  { testo: 'Gli dici che verrai.', fedele: true, dettaglio: 'coraggio' },
                ],
              },
            },
            { t: 'fx', fx: { k: 'nastro', chi: 'giocatore', testo: PAROLE.verro, dur: 3 } },
            { t: 'verso', id: 'gdc-4-8', evidenzia: ['Verrò senz’altro', 'sarà nelle mani di una donna che Geova consegnerà Sìsera'] },
            senti('d-coraggio'),
          ],
        },
      ],
    },
    {
      id: 'debora-tabor',
      titolo: 'Sul monte Tabor',
      luogo: 'Con Barac e i suoi uomini',
      ...cimaTabor(2200),
      inizioX: 300,
      attori: [{ id: 'barac', x: 520, stile: 'barac', verso: 1 }],
      folle: [
        { x0: 660, x1: 1220, n: 14, seme: 105, armati: 0.3, comportamento: 'vaga' },
        { x0: 1250, x1: 1900, n: 16, seme: 107, armati: 0.9, piano: 'fondo', comportamento: 'vaga' },
      ],
      ingresso: [
        {
          t: 'narra',
          testo: 'Barac ha convocato Zabulon e Neftali: 10.000 uomini lo hanno seguito, e anche tu sei salita con lui sul monte Tabor.',
          certezza: 'scritto',
          fonti: [b('Giudici', 4, '10'), b('Giudici', 4, '12')],
        },
      ],
      punti: [
        {
          id: 'soldati',
          x: 900,
          tipo: 'esamina',
          etichetta: 'Gli uomini di Barac',
          passi: [det('incoraggiamento')],
        },
        {
          id: 'pianura',
          x: 1560,
          tipo: 'osserva',
          etichetta: 'Laggiù, nella pianura',
          passi: [
            {
              t: 'narra',
              testo: 'Sisera ha radunato tutti i suoi carri da guerra e tutte le sue truppe presso il torrente Chison.',
              certezza: 'scritto',
              fonti: [b('Giudici', 4, '13'), F.immagine],
            },
            det('segnale'),
          ],
        },
        {
          id: 'segnale',
          x: 640,
          tipo: 'agisci',
          etichetta: 'Da’ il segnale a Barac',
          richiede: ['soldati', 'pianura'],
          passi: [
            { t: 'fx', fx: { k: 'nastro', chi: 'giocatore', testo: PAROLE.va, dur: 4.5 } },
            { t: 'fx', fx: { k: 'nastro', chi: 'giocatore', testo: PAROLE.davanti, dur: 3.5 } },
            { t: 'fx', fx: { k: 'vai', chi: 'barac', x: 2140, vel: 160 } },
            {
              t: 'narra',
              testo: 'E Barac scende dal monte Tabor alla testa dei 10.000 uomini.',
              certezza: 'scritto',
              fonti: [b('Giudici', 4, '14')],
            },
          ],
        },
      ],
    },
    {
      id: 'debora-canto',
      titolo: 'Il canto di vittoria',
      luogo: 'Quel giorno',
      ...festa(2000),
      inizioX: 170,
      attori: [{ id: 'barac', x: 470, stile: 'barac', verso: -1 }],
      folle: [
        { x0: 760, x1: 1000, n: 7, seme: 91, donne: 0.7, gruppo: 'danza' },
        { x0: 1100, x1: 1650, n: 9, seme: 93, donne: 0.4, bimbi: 0.2, comportamento: 'vaga' },
        { x0: 300, x1: 1900, n: 12, seme: 95, piano: 'fondo', comportamento: 'vaga' },
      ],
      ingresso: [
        {
          t: 'narra',
          testo: 'Quel giorno, dopo la vittoria, intoni un canto insieme a Barac.',
          certezza: 'scritto',
          fonti: [b('Giudici', 5, '1')],
        },
      ],
      punti: [
        {
          id: 'intona',
          x: 420,
          tipo: 'agisci',
          etichetta: 'Intona il canto con Barac',
          passi: [
            { t: 'fx', fx: { k: 'posa', chi: 'barac', posa: 'alza' } },
            { t: 'verso', id: 'gdc-5-1-3', evidenzia: ['a motivo del popolo che si offrì spontaneamente', 'A Geova io canterò'] },
            det('prima-persona'),
          ],
        },
        {
          id: 'madre',
          x: 660,
          tipo: 'medita',
          etichetta: '«Come madre in Israele»',
          richiede: ['intona'],
          passi: [det('madre'), senti('d-madre')],
        },
        {
          id: 'tribu',
          x: 1180,
          tipo: 'leggi',
          etichetta: 'Chi venne e chi no',
          richiede: ['intona'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'classifica',
                id: 'tribu',
                consegna: 'Nel canto ricordi le tribù di Israele. Quali scesero a combattere e quali rimasero lontane?',
                categorie: ['Scesero a combattere', 'Rimasero lontane'],
                voci: [
                  { testo: 'Efraim', cat: 0, fonti: TRIBU('14') },
                  { testo: 'Beniamino', cat: 0, fonti: TRIBU('14') },
                  { testo: 'Machir', cat: 0, fonti: TRIBU('14') },
                  { testo: 'Zabulon', cat: 0, fonti: TRIBU('14, 18') },
                  { testo: 'Issacar', cat: 0, fonti: TRIBU('15') },
                  { testo: 'Neftali', cat: 0, fonti: TRIBU('18') },
                  { testo: 'Ruben', cat: 1, fonti: TRIBU('15, 16') },
                  { testo: 'Galaad', cat: 1, fonti: TRIBU('17') },
                  { testo: 'Dan', cat: 1, fonti: TRIBU('17') },
                  { testo: 'Aser', cat: 1, fonti: TRIBU('17') },
                ],
                dettaglio: 'domande',
              },
            },
          ],
        },
        {
          id: 'racconti',
          x: 1460,
          tipo: 'leggi',
          etichetta: 'Il racconto e il canto',
          richiede: ['intona'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'classifica',
                id: 'resoconti',
                consegna:
                  'La Bibbia descrive la battaglia due volte: nel racconto di Giudici 4 e nel tuo canto, in Giudici 5. Dove si trova ciascun particolare?',
                categorie: ['Solo nel racconto (Giudici 4)', 'Solo nel canto (Giudici 5)'],
                voci: [
                  { testo: 'Debora siede sotto una palma', cat: 0, fonti: [b('Giudici', 4, '5')] },
                  { testo: 'Barac viene da Chedes-Neftali', cat: 0, fonti: [b('Giudici', 4, '6')] },
                  { testo: 'Barac ha con sé 10.000 uomini', cat: 0, fonti: [b('Giudici', 4, '10')] },
                  { testo: 'Sisera salta giù dal carro', cat: 0, fonti: [b('Giudici', 4, '15')] },
                  { testo: 'Si combatte a Taanac, presso le acque di Meghiddo', cat: 1, fonti: [b('Giudici', 5, '19')] },
                  { testo: 'Dal cielo combattono le stelle', cat: 1, fonti: [b('Giudici', 5, '20')] },
                  { testo: 'Il Chison spazza via i nemici', cat: 1, fonti: [b('Giudici', 5, '21')] },
                  { testo: 'Alcune tribù restano lontane', cat: 1, fonti: [b('Giudici', 5, '15-17')] },
                ],
                dettaglio: 'complementari',
              },
            },
          ],
        },
        {
          id: 'meroz',
          x: 1760,
          tipo: 'ascolta',
          etichetta: 'Una maledizione',
          richiede: ['tribu', 'racconti'],
          passi: [{ t: 'verso', id: 'gdc-5-23', evidenzia: ['perché non sono venuti in aiuto di Geova'] }, det('meroz')],
        },
      ],
    },
  ],
  epilogo: [],
};
