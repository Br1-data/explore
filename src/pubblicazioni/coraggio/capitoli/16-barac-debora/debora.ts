import type { Passo, Ruolo } from '@/contenuti/tipi';
import { F, b } from './base';
import { CANTO, CHEDES, PALMA, TABOR, palcoCanto, palcoChedes, palcoPalma, palcoTabor } from './racconto';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });
const io = 'debora';

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
    'Giudica sotto la tua palma, trasmetti a Barac il comando di Geova, decidi se seguirlo verso la battaglia, sali con lui e con i suoi uomini da Chedes al Tabor, dagli il segnale e intona il canto di vittoria.',
  fedelta:
    'Giudici 4:4-14 e 5:1-23, come li spiega il capitolo 16 del libro con le pubblicazioni che cita. Le parole di Debora e di Barac sono quelle del testo; la scelta riguarda un momento che il racconto descrive.',
  modo: 'cammina',
  stile: 'debora',
  durata: '18-22 minuti',
  conclusione: 'Hai vissuto il racconto nei panni di Debora',
  scene: [
    {
      id: 'debora-palma',
      titolo: 'Sotto la palma',
      luogo: 'Fra Rama e Betel, nella regione montuosa di Efraim',
      ...palcoPalma(io),
      inizioX: 300,
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
          passi: [...PALMA.arriva(io), ...PALMA.comando(io), det('non-autorita')],
        },
        {
          id: 'risposta',
          x: 980,
          tipo: 'agisci',
          etichetta: 'Barac ti risponde',
          richiede: ['chiama'],
          passi: [
            ...PALMA.condizione(io),
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
            {
              t: 'attivita',
              a: {
                tipo: 'completa',
                id: 'verro',
                consegna: 'Che cosa rispondi a Barac? Completa le parole del racconto.',
                verso: 'gdc-4-8',
                testo:
                  'Bàrac le rispose: “Se verrai con me, ci andrò; ma se non verrai, non ci andrò”. E lei gli disse: “Verrò [[senz’altro]]. Ma non ti procurerai [[gloria]] tramite questa impresa, perché sarà nelle mani di una [[donna]] che Geova consegnerà Sìsera”. Dopodiché Debora si alzò e andò con Bàrac a Chèdes.',
                distrattori: ['subito', 'vittoria', 'profetessa'],
              },
            },
            ...PALMA.verro(io),
            senti('d-coraggio'),
          ],
        },
      ],
    },
    {
      id: 'debora-chedes',
      titolo: 'A Chedes',
      luogo: 'Con Barac, nella regione montuosa di Neftali',
      ...palcoChedes(io),
      inizioX: 400,
      ingresso: [
        {
          t: 'narra',
          testo: 'Ti sei alzata e sei andata con Barac a Chedes.',
          certezza: 'scritto',
          fonti: [b('Giudici', 4, '9')],
        },
      ],
      punti: [
        { id: 'barac', x: 820, tipo: 'esamina', etichetta: 'Tu e Barac', passi: [det('lappidot')] },
        {
          id: 'convoca',
          x: 1100,
          tipo: 'osserva',
          etichetta: 'Barac convoca Zabulon e Neftali',
          richiede: ['barac'],
          passi: [
            ...CHEDES.convoca(),
            {
              t: 'narra',
              testo: 'Diecimila uomini seguono Barac. E Barac li arma come può.',
              certezza: 'libro',
              fonti: [b('Giudici', 4, '10'), F.libro],
            },
            ...CHEDES.arma(io),
          ],
        },
      ],
    },
    {
      id: 'debora-tabor',
      titolo: 'Sul monte Tabor',
      luogo: 'Con Barac e i suoi uomini',
      ...palcoTabor(io),
      inizioX: 300,
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
            ...TABOR.segnale(io),
            ...TABOR.scende(io),
            { t: 'verso', id: 'gdc-4-14', evidenzia: ['E Bàrac scese dal monte Tàbor alla testa dei 10.000 uomini'] },
          ],
        },
      ],
    },
    {
      id: 'debora-canto',
      titolo: 'Il canto di vittoria',
      luogo: 'Quel giorno',
      ...palcoCanto(io),
      inizioX: 170,
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
            ...CANTO.intona(io),
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
                tipo: 'associa',
                id: 'tribu',
                consegna: 'Nel canto ricordi le tribù di Israele: alcune scesero a combattere, altre rimasero lontane. Che cosa dici di ciascuna?',
                coppie: [
                  { a: 'Machir', b: '«scesero i comandanti»', fonti: TRIBU('14') },
                  { a: 'Issacar', b: '«furono con Debora»', fonti: TRIBU('15') },
                  { a: 'Ruben', b: '«grande fu l’indecisione dei cuori»', fonti: TRIBU('15, 16') },
                  { a: 'Galaad', b: '«restò al di là del Giordano»', fonti: TRIBU('17') },
                  { a: 'Dan', b: '«perché rimase con le navi?»', fonti: TRIBU('17') },
                  { a: 'Aser', b: '«se ne stette inerte sulla riva del mare»', fonti: TRIBU('17') },
                  { a: 'Zabulon', b: '«disprezzò la propria vita di fronte alla morte»', fonti: TRIBU('18') },
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
