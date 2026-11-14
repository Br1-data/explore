import type { Passo, Ruolo } from '@/contenuti/tipi';
import { F, PAROLE, b } from './base';
import { cimaTabor, palma, pianura } from './scenari';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });

/**
 * Il punto di vista di Barac: la chiamata, la condizione posta a Debora, il Tabor,
 * la discesa nella pianura, l’inseguimento (Giudici 4:6-16, 24). Le situazioni in cui
 * si sceglie sono momenti che il racconto descrive (`narrata`).
 */
export const barac: Ruolo = {
  id: 'barac',
  nome: 'Barac',
  titolo: 'L’uomo di fede che accettò l’aiuto di una donna',
  descrizione:
    'Ricevi da Debora il comando di Geova, decidi come rispondere, raduna i tuoi uomini sul Tabor e scegli se scendere nella pianura contro 900 carri.',
  fedelta:
    'Giudici 4:6-16, 24 ed Ebrei 11:32-34, come li spiega il capitolo 16 del libro con le pubblicazioni che cita. Le parole di Barac e di Debora sono quelle del testo; le scelte riguardano momenti che il racconto descrive.',
  modo: 'cammina',
  stile: 'barac',
  durata: '12-15 minuti',
  conclusione: 'Hai vissuto il racconto nei panni di Barac',
  scene: [
    {
      id: 'barac-chiamata',
      titolo: 'La chiamata',
      luogo: 'Dalla profetessa Debora',
      ...palma(2000),
      inizioX: 1700,
      attori: [{ id: 'debora', x: 900, stile: 'debora', verso: 1 }],
      ingresso: [
        {
          t: 'narra',
          titolo: 'Sei Barac',
          testo: 'Sei Barac, figlio di Abinoam, di Chedes-Neftali. La profetessa Debora ti ha mandato a chiamare.',
          certezza: 'scritto',
          fonti: [b('Giudici', 4, '6')],
        },
      ],
      punti: [
        {
          id: 'comando',
          x: 1020,
          tipo: 'ascolta',
          etichetta: 'Debora ti parla',
          passi: [
            { t: 'fx', fx: { k: 'nastro', chi: 'debora', testo: PAROLE.comando, dur: 5.5 } },
            { t: 'fx', fx: { k: 'nastro', chi: 'debora', testo: PAROLE.promessa, dur: 5.5 } },
            det('stupore'),
          ],
        },
        {
          id: 'condizione',
          x: 1020,
          tipo: 'agisci',
          etichetta: 'Rispondi',
          richiede: ['comando'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'condotta',
                id: 'condotta-condizione',
                narrata: true,
                situazione:
                  'Una donna ti trasmette il comando di Geova: affrontare Sisera e i suoi 900 carri con 10.000 uomini, mentre Israele è praticamente disarmato.',
                base: [b('Giudici', 4, '6-8'), F.libro],
                opzioni: [
                  {
                    testo: 'Ti offendi: le istruzioni te le dà una donna.',
                    esito: 'Barac non si offese perché a trasmettergli le istruzioni era una donna, e non si mostrò orgoglioso.',
                    fonti: [F.libro],
                  },
                  {
                    testo: 'Chiedi prima a Geova più armi.',
                    esito: 'Barac non pregò Dio per ricevere più armi, anche se Israele non aveva un esercito.',
                    fonti: [F.wp15],
                  },
                  {
                    testo: 'Rifiuti: contro quei carri non c’è speranza.',
                    esito: 'Barac non rifiutò l’incarico e non disubbidì a Geova.',
                    fonti: [F.w03],
                  },
                  { testo: 'Chiedi a Debora di venire con te.', fedele: true, dettaglio: 'fede' },
                ],
              },
            },
            { t: 'fx', fx: { k: 'nastro', chi: 'giocatore', testo: PAROLE.condizione, dur: 4.5 } },
            { t: 'fx', fx: { k: 'nastro', chi: 'debora', testo: PAROLE.verro, dur: 3 } },
            det('altri-uomini'),
            senti('b-aiuto'),
          ],
        },
        {
          id: 'gloria',
          x: 760,
          tipo: 'medita',
          etichetta: 'A chi andrà la gloria',
          richiede: ['condizione'],
          passi: [det('bellezza')],
        },
      ],
    },
    {
      id: 'barac-tabor',
      titolo: 'Sul monte Tabor',
      luogo: 'Con 10.000 uomini',
      ...cimaTabor(2200),
      inizioX: 300,
      attori: [{ id: 'debora', x: 700, stile: 'debora', verso: 1 }],
      folle: [
        { x0: 820, x1: 1260, n: 14, seme: 111, armati: 0.3, comportamento: 'vaga' },
        { x0: 1250, x1: 1900, n: 16, seme: 113, armati: 0.9, piano: 'fondo', comportamento: 'vaga' },
      ],
      ingresso: [
        {
          t: 'narra',
          testo: 'Hai convocato Zabulon e Neftali a Chedes: 10.000 uomini ti hanno seguito, e Debora è salita con te.',
          certezza: 'scritto',
          fonti: [b('Giudici', 4, '10')],
        },
      ],
      punti: [
        {
          id: 'incarico',
          x: 160,
          tipo: 'esamina',
          etichetta: 'Il tuo incarico',
          passi: [det('salvatore')],
        },
        {
          id: 'monte',
          x: 480,
          tipo: 'esamina',
          etichetta: 'Il monte',
          passi: [det('tabor')],
        },
        {
          id: 'uomini',
          x: 1040,
          tipo: 'esamina',
          etichetta: 'I tuoi uomini',
          passi: [det('raduno')],
        },
        {
          id: 'scendi',
          x: 1500,
          tipo: 'agisci',
          etichetta: 'L’esercito di Sisera si avvicina',
          richiede: ['incarico', 'monte', 'uomini'],
          passi: [
            { t: 'fx', fx: { k: 'nastro', chi: 'debora', testo: PAROLE.va, dur: 4.5 } },
            {
              t: 'attivita',
              a: {
                tipo: 'condotta',
                id: 'condotta-pianura',
                narrata: true,
                situazione:
                  'Sisera avanza nella pianura con i suoi carri. Sulle pendici del Tabor i carri sarebbero più lenti; in pianura sono nel loro terreno. Debora ti dice di andare.',
                base: [b('Giudici', 4, '14'), F.libro],
                opzioni: [
                  {
                    testo: 'Aspetti sulle pendici, dove i carri sarebbero più lenti.',
                    esito:
                      'Da un punto di vista militare poteva sembrare la scelta migliore: su un terreno in pendenza i carri sarebbero stati più lenti, e gli uomini di Barac probabilmente in vantaggio. Ma l’istruzione di Geova era un’altra.',
                    fonti: [F.libro, F.wp15],
                  },
                  { testo: 'Scendi nella pianura con i tuoi uomini.', fedele: true, dettaglio: 'ubbidienza' },
                ],
              },
            },
            senti('b-istruzioni'),
          ],
        },
      ],
    },
    {
      id: 'barac-inseguimento',
      titolo: 'All’inseguimento',
      luogo: 'Dal monte Tabor verso Aroset-Goim',
      ...pianura(2800),
      inizioX: 320,
      vars: { pioggia: 0.35 },
      folle: [{ x0: 120, x1: 300, n: 9, seme: 81, armati: 0.6, comportamento: 'insegue', distanza: [210, 150] }],
      ingresso: [
        {
          t: 'narra',
          testo: 'Geova ha gettato nello scompiglio l’esercito di Sisera e lo ha consegnato alla tua spada: ora insegui il nemico.',
          certezza: 'scritto',
          fonti: [b('Giudici', 4, '15'), b('Giudici', 4, '16')],
        },
      ],
      punti: [
        {
          id: 'carri',
          x: 1480,
          tipo: 'esamina',
          etichetta: 'Carri abbandonati',
          passi: [det('inseguimento')],
        },
        {
          id: 'campo',
          x: 1900,
          tipo: 'esamina',
          etichetta: 'Il campo di battaglia',
          passi: [det('nessuno')],
        },
        {
          id: 'dopo',
          x: 2350,
          tipo: 'medita',
          etichetta: 'Che cosa ne fu di Iabin',
          richiede: ['carri', 'campo'],
          passi: [det('annientato'), { t: 'verso', id: 'ebr-11-32', evidenzia: ['di Bàrac', 'misero in fuga eserciti invasori'] }],
        },
      ],
    },
  ],
  epilogo: [
    {
      t: 'narra',
      testo:
        'Sisera però era saltato giù dal carro ed era fuggito. Geova, che guardava dai cieli, aveva già in mente qualcosa per lui: lo racconta il capitolo 17, «Benedetta fra le donne».',
      certezza: 'libro',
      fonti: [b('Giudici', 4, '15'), F.libro],
    },
  ],
};
