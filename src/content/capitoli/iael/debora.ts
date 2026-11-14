import type { Passo, Ruolo } from '../../tipi';
import { b } from './base';
import { festa } from './scenari';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });

const TRIBU = (v: string) => [b('Giudici', 5, v)];

/**
 * Il punto di vista di Debora, in questo capitolo: il canto di vittoria
 * (Giudici 5) e la lode a Iael. (La sua chiamata di Barac e il suo incarico di
 * profetessa sono il tema del capitolo 16.)
 */
export const debora: Ruolo = {
  id: 'debora',
  nome: 'Debora',
  titolo: 'La profetessa che lodò Iael',
  descrizione:
    'Intona il canto di vittoria con Barac, ricorda chi rispose alla chiamata e chi no, confronta il racconto e il canto e loda un’altra donna senza invidia.',
  fedelta:
    'Giudici 5, Perspicacia e La Torre di Guardia 1/8/2015, citata dal libro. Le parole del canto sono quelle della Bibbia; nessun’altra parola le viene attribuita.',
  modo: 'cammina',
  stile: 'debora',
  durata: '8-10 minuti',
  conclusione: 'Hai vissuto il racconto nei panni di Debora',
  scene: [
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
          titolo: 'Sei Debora',
          testo: 'Sei Debora, profetessa. Quel giorno, dopo la vittoria, intoni un canto insieme a Barac.',
          certezza: 'scritto',
          fonti: [b('Giudici', 4, '4'), b('Giudici', 5, '1')],
        },
      ],
      punti: [
        {
          id: 'intona',
          x: 420,
          tipo: 'agisci',
          etichetta: 'Intona il canto con Barac',
          passi: [{ t: 'fx', fx: { k: 'posa', chi: 'barac', posa: 'alza' } }, det('prima-persona'), det('madre')],
        },
        {
          id: 'danze',
          x: 880,
          tipo: 'esamina',
          etichetta: 'Danze e tamburelli',
          passi: [det('celebrare')],
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
                  'La Bibbia descrive questi fatti due volte: nel racconto di Giudici 4 e nel tuo canto, in Giudici 5. Dove si trova ciascun particolare?',
                categorie: ['Solo nel racconto (Giudici 4)', 'Solo nel canto (Giudici 5)'],
                voci: [
                  { testo: 'Barac ha con sé 10.000 uomini', cat: 0, fonti: [b('Giudici', 4, '10')] },
                  { testo: 'Iael copre Sisera con una coperta', cat: 0, fonti: [b('Giudici', 4, '18')] },
                  { testo: 'Sisera le chiede di rispondere di no', cat: 0, fonti: [b('Giudici', 4, '20')] },
                  { testo: 'Iael va incontro a Barac', cat: 0, fonti: [b('Giudici', 4, '22')] },
                  { testo: 'Dal cielo combatterono le stelle', cat: 1, fonti: [b('Giudici', 5, '20')] },
                  { testo: 'Una splendida coppa', cat: 1, fonti: [b('Giudici', 5, '25')] },
                  { testo: 'La madre di Sisera alla finestra', cat: 1, fonti: [b('Giudici', 5, '28')] },
                  { testo: 'Le tribù che rimasero lontane', cat: 1, fonti: [b('Giudici', 5, '15-17')] },
                ],
                dettaglio: 'complementari',
              },
            },
          ],
        },
        {
          id: 'loda',
          x: 1760,
          tipo: 'agisci',
          etichetta: 'Loda Iael',
          richiede: ['danze', 'tribu', 'racconti'],
          passi: [det('prodiga'), senti('d-lode')],
        },
      ],
    },
  ],
  epilogo: [],
};
