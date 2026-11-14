import type { Passo, Ruolo } from '@/contenuti/tipi';
import { b } from './base';
import { festa } from './scenari';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });

/**
 * Il punto di vista di Debora, in questo capitolo: la parte del canto che loda Iael
 * (Giudici 5:24-31). La sua chiamata di Barac, il Tabor e la prima parte del canto
 * (5:1-23) sono il capitolo 16.
 */
export const debora: Ruolo = {
  id: 'debora',
  nome: 'Debora',
  titolo: 'La profetessa che lodò Iael',
  descrizione:
    'Nel canto di vittoria ricordi che cosa fece Iael: confronta il racconto e il canto e loda un’altra donna senza invidia.',
  fedelta:
    'Giudici 5:24-31, Perspicacia e La Torre di Guardia 1/8/2015, citata dal libro. Le parole del canto sono quelle della Bibbia; nessun’altra parola le viene attribuita.',
  modo: 'cammina',
  stile: 'debora',
  durata: '5-6 minuti',
  conclusione: 'Hai vissuto il racconto nei panni di Debora',
  scene: [
    {
      id: 'debora-lode',
      titolo: 'Benedetta fra le donne',
      luogo: 'Il canto di vittoria',
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
          testo: 'Sei Debora, profetessa. Nel canto che intoni con Barac, dopo la vittoria, ricordi anche Iael.',
          certezza: 'scritto',
          fonti: [b('Giudici', 4, '4'), b('Giudici', 5, '1'), b('Giudici', 5, '24')],
        },
      ],
      punti: [
        {
          id: 'danze',
          x: 880,
          tipo: 'esamina',
          etichetta: 'Danze e tamburelli',
          passi: [det('celebrare')],
        },
        {
          id: 'racconti',
          x: 1300,
          tipo: 'leggi',
          etichetta: 'Il racconto e il canto',
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'classifica',
                id: 'resoconti-tenda',
                consegna:
                  'Ciò che accadde nella tenda di Iael è descritto due volte: nel racconto di Giudici 4 e nel tuo canto, in Giudici 5. Dove si trova ciascun particolare?',
                categorie: ['Solo nel racconto (Giudici 4)', 'Solo nel canto (Giudici 5)'],
                voci: [
                  { testo: 'Iael copre Sisera con una coperta', cat: 0, fonti: [b('Giudici', 4, '18')] },
                  { testo: 'Iael apre un otre', cat: 0, fonti: [b('Giudici', 4, '19')] },
                  { testo: 'Sisera le chiede di rispondere di no', cat: 0, fonti: [b('Giudici', 4, '20')] },
                  { testo: 'Iael va incontro a Barac', cat: 0, fonti: [b('Giudici', 4, '22')] },
                  { testo: 'Una splendida coppa', cat: 1, fonti: [b('Giudici', 5, '25')] },
                  { testo: 'Un bottino di stoffe tinte', cat: 1, fonti: [b('Giudici', 5, '30')] },
                  { testo: 'La madre di Sisera alla finestra', cat: 1, fonti: [b('Giudici', 5, '28')] },
                  { testo: 'Le dame che la rassicurano', cat: 1, fonti: [b('Giudici', 5, '29')] },
                ],
                spiegazione:
                  'Il racconto e il canto si completano: ognuno riporta particolari che l’altro non menziona, e per avere un quadro completo vanno letti l’uno accanto all’altro.',
              },
            },
          ],
        },
        {
          id: 'loda',
          x: 1760,
          tipo: 'agisci',
          etichetta: 'Loda Iael',
          richiede: ['danze', 'racconti'],
          passi: [det('prodiga'), senti('d-lode')],
        },
      ],
    },
  ],
  epilogo: [],
};
