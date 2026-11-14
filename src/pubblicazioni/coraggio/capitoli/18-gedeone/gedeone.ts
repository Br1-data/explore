import type { Passo, Ruolo } from '@/contenuti/tipi';
import { F, b } from './base';
import { ofra } from './scenari';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });

/**
 * Il punto di vista di Gedeone: coraggioso e cauto (Giudici 6:11–8:23). L’angelo non
 * viene raffigurato come un personaggio: le sue parole si leggono nel versetto.
 */
export const gedeone: Ruolo = {
  id: 'gedeone',
  nome: 'Gedeone',
  titolo: 'Coraggioso e cauto',
  descrizione:
    'Batti il grano di nascosto, ricevi l’incarico di salvare Israele, demolisci di notte l’altare di Baal di tuo padre, rifiuta di diventare re.',
  fedelta:
    'Giudici 6:11–8:23 e 8:28, come li spiega il capitolo 18 del libro con le pubblicazioni che cita. La situazione in cui scegli è un momento che il racconto descrive.',
  modo: 'cammina',
  stile: 'gedeone',
  durata: '12-15 minuti',
  conclusione: 'Hai vissuto il racconto nei panni di Gedeone',
  scene: [
    {
      id: 'gedeone-torchio',
      titolo: 'Il grano nel torchio',
      luogo: 'Ofra, sotto il grande albero',
      ...ofra(false, 2200),
      inizioX: 200,
      ingresso: [
        {
          t: 'narra',
          titolo: 'Sei Gedeone',
          testo: 'Sei Gedeone, figlio di Ioas l’abiezerita. Cerca gli indizi intorno a te: alcune cose non hanno un segnale, ma luccicano quando ti avvicini.',
          certezza: 'scritto',
          fonti: [b('Giudici', 6, '11')],
        },
      ],
      punti: [
        { id: 'colline', x: 360, tipo: 'esamina', etichetta: 'Il campo', passi: [det('nascosti')] },
        {
          id: 'torchio',
          x: 900,
          tipo: 'esamina',
          etichetta: 'Il torchio nella roccia',
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'completa',
                id: 'torchio',
                consegna: 'Dove ti trova l’angelo, e che cosa ti dice? Completa il versetto.',
                verso: 'gdc-6-11',
                testo: 'In seguito venne l’angelo di Geova, e si sedette sotto il grande albero che era a Ofra e che apparteneva a Iòas l’abiezerita. Suo figlio Gedeone stava battendo il [[grano]] nel [[torchio]] per il vino, in modo da nasconderlo alla vista di Màdian. L’angelo di Geova gli apparve e gli disse: “Geova è con te, potente [[guerriero]]”.',
                distrattori: ['orzo', 'granaio', 'profeta'],
              },
            },
            det('cauto'),
          ],
        },
        {
          id: 'incarico',
          x: 620,
          tipo: 'ascolta',
          etichetta: 'Un incarico più grande di te',
          richiede: ['torchio'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'completa',
                id: 'piu-piccola',
                consegna: 'Come rispondi a Geova? Completa il versetto.',
                verso: 'gdc-6-15',
                testo: 'Gedeone gli rispose: “Perdonami, Geova. Come posso salvare Israele? Ecco, la mia famiglia è la più [[piccola]] di Manasse, e io sono il più [[insignificante]] della casa di mio padre”. Ma Geova gli disse: “Dato che io sarò con te, abbatterai Màdian come se fosse un uomo [[solo]]”.',
                distrattori: ['forte', 'giovane', 'esercito'],
              },
            },
            det('modesto'),
          ],
        },
      ],
    },
    {
      id: 'gedeone-notte',
      titolo: 'L’altare di Baal',
      luogo: 'Ofra, di notte',
      ...ofra(true, 2200),
      inizioX: 1300,
      folle: [{ x0: 1150, x1: 1300, n: 4, seme: 301, comportamento: 'vaga' }],
      ingresso: [
        {
          t: 'narra',
          testo: 'Quella notte Geova ti dice di demolire l’altare di Baal che appartiene a tuo padre, di abbattere il palo sacro e di erigere un altare a Geova.',
          certezza: 'scritto',
          fonti: [b('Giudici', 6, '25, 26')],
        },
      ],
      punti: [
        {
          id: 'altare',
          x: 1650,
          tipo: 'agisci',
          etichetta: 'L’altare di tuo padre',
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'condotta',
                id: 'condotta-notte',
                narrata: true,
                situazione: 'Geova ti ha detto di demolire l’altare di Baal di tuo padre. Tutta la città lo adora.',
                base: [b('Giudici', 6, '25-27'), F.libro],
                opzioni: [
                  {
                    testo: 'Lasci stare: è l’altare di tuo padre.',
                    esito: 'Gedeone invece fece proprio come Geova gli aveva detto.',
                    fonti: [b('Giudici', 6, '27')],
                  },
                  {
                    testo: 'Lo fai di giorno, davanti a tutti.',
                    esito: 'Gedeone aveva troppo timore della casa di suo padre e degli uomini della città per farlo di giorno.',
                    fonti: [b('Giudici', 6, '27')],
                  },
                  { testo: 'Lo fai di notte, con dieci servitori.', fedele: true, dettaglio: 'discrezione' },
                ],
              },
            },
            senti('ge-cauto'),
          ],
        },
      ],
    },
    {
      id: 'gedeone-dopo',
      titolo: 'Sarà Geova a governarvi',
      luogo: 'Dopo la vittoria',
      ...ofra(false, 2200),
      inizioX: 300,
      folle: [{ x0: 900, x1: 1500, n: 12, seme: 303, comportamento: 'vaga' }],
      ingresso: [
        {
          t: 'narra',
          testo: 'Geova ha dato Madian nelle tue mani. Gli uomini d’Israele ti si radunano intorno.',
          certezza: 'scritto',
          fonti: [b('Giudici', 7, '22'), b('Giudici', 8, '22')],
        },
      ],
      punti: [
        {
          id: 'segni',
          x: 600,
          tipo: 'medita',
          etichetta: 'I segni che hai ricevuto',
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'ordina',
                id: 'segni',
                consegna: 'Geova ti ha dato più di un segno. Mettili nell’ordine in cui li hai ricevuti.',
                voci: [
                  { testo: 'Un fuoco divampa dalla roccia e consuma l’offerta', nota: 'Giudici 6:21' },
                  { testo: 'La rugiada è solo sul vello, il terreno è asciutto', nota: 'Giudici 6:38' },
                  { testo: 'Il vello è asciutto, il terreno è bagnato', nota: 'Giudici 6:40' },
                  { testo: 'Un madianita racconta il sogno del pane d’orzo', nota: 'Giudici 7:13, 14' },
                ],
                distrattori: ['Un arcobaleno nelle nuvole'],
                spiegazione: 'Geova assecondò con pazienza ogni richiesta di Gedeone, e gli diede anche un segno che non aveva chiesto.',
              },
            },
            senti('ge-segni'),
          ],
        },
        { id: 'efraim', x: 1000, tipo: 'ascolta', etichetta: 'Gli uomini di Efraim', richiede: ['segni'], passi: [det('mite')] },
        {
          id: 're',
          x: 1300,
          tipo: 'agisci',
          etichetta: 'Ti chiedono di governare',
          richiede: ['efraim'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'completa',
                id: 'governare',
                consegna: 'Che cosa rispondi? Completa il versetto.',
                verso: 'gdc-8-22',
                testo: 'In seguito gli uomini d’Israele dissero a Gedeone: “Governa su di noi, tu e tuo figlio e tuo nipote, dato che ci hai salvato dalla mano di Màdian”. Ma Gedeone disse loro: “Non sarò io a governarvi, né vi governerà mio [[figlio]]. Sarà [[Geova]] a governarvi”.',
                distrattori: ['fratello', 'Efraim'],
              },
            },
            det('umile'),
          ],
        },
        { id: 'pace', x: 1700, tipo: 'medita', etichetta: 'Quarant’anni', richiede: ['re'], passi: [det('pace')] },
      ],
    },
  ],
  epilogo: [],
};
