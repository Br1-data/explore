import type { Passo, Ruolo } from '@/contenuti/tipi';
import { F, b } from './base';
import { ARRIVO, TENDA, palcoArrivo, palcoTenda } from './racconto';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });
const io = 'sisera';

/**
 * Il punto di vista di Sisera, il nemico, in questo capitolo: la fuga dopo la
 * disfatta e la tenda dove crede di essere al sicuro (Giudici 4:17-21). Vive le stesse
 * scene di Iael (racconto.ts): lei che gli esce incontro, la coperta, il latte. I carri
 * e la battaglia sono il capitolo 16.
 *
 * Non è un modello da imitare: serve a vedere su che cosa contava chi opprimeva il
 * popolo di Dio e come andò a finire. Le sue parole sono quelle di Giudici 4:19, 20;
 * la sua morte non viene mostrata.
 */
export const sisera: Ruolo = {
  id: 'sisera',
  nome: 'Sisera',
  titolo: 'Il nemico che cercava un rifugio',
  descrizione:
    'Guarda il racconto dalla parte del nemico: la fuga dopo la disfatta, un alleato a cui chiedere rifugio, una tenda dove credi di essere al sicuro.',
  fedelta:
    'Giudici 4:17-21, Perspicacia e La Torre di Guardia 1/8/2015. Non è un modello da imitare: serve a capire su che cosa contava il nemico del popolo di Dio. Le parole sono quelle del testo; la sua morte non viene mostrata.',
  modo: 'cammina',
  stile: 'sisera',
  durata: '10-12 minuti',
  conclusione: 'Hai visto il racconto dalla parte del nemico',
  scene: [
    {
      id: 'sisera-fuga',
      titolo: 'In fuga',
      luogo: 'Le tende di Heber il chenita',
      ...palcoArrivo(io),
      inizioX: 2300,
      ingresso: [
        {
          t: 'narra',
          titolo: 'Sei Sisera',
          testo:
            'Sei Sisera, il capo dell’esercito di Iabin. Hai abbandonato i tuoi uomini e stai fuggendo dalla Valle di Izreel: pensi solo a trovare un posto per nasconderti.',
          certezza: 'libro',
          fonti: [F.libro, b('Giudici', 4, '17')],
        },
        {
          t: 'narra',
          testo:
            'Questo punto di vista non è un modello da imitare: serve a capire su che cosa contava il nemico del popolo di Dio.',
        },
      ],
      punti: [
        {
          id: 'sconfitta',
          x: 2270,
          tipo: 'medita',
          etichetta: 'Che cosa è successo',
          passi: [det('mal-equipaggiato')],
        },
        {
          id: 'rifugio',
          x: 2120,
          tipo: 'agisci',
          etichetta: 'Dove andare?',
          richiede: ['sconfitta'],
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
        {
          id: 'invito',
          x: 2040,
          tipo: 'ascolta',
          etichetta: 'Una donna ti viene incontro',
          richiede: ['rifugio'],
          passi: [...ARRIVO.incontro(io), det('inconcepibile'), ...ARRIVO.entra(io)],
        },
      ],
    },
    {
      id: 'sisera-tenda',
      titolo: 'Al sicuro, credi',
      luogo: 'Nella tenda di Iael',
      ...palcoTenda(io),
      inizioX: 770,
      ingresso: [
        {
          t: 'narra',
          testo: 'Sei entrato nella tenda di Iael e ti sei sdraiato.',
          certezza: 'scritto',
          fonti: [b('Giudici', 4, '18')],
        },
        { t: 'fx', fx: { k: 'posa', chi: 'giocatore', posa: 'sdraiato' } },
      ],
      punti: [
        {
          id: 'coperta',
          x: 790,
          tipo: 'osserva',
          etichetta: 'Iael prende una coperta',
          passi: [...TENDA.prendiCoperta(io), ...TENDA.copri(io), det('credendosi')],
        },
        {
          id: 'acqua',
          x: 790,
          tipo: 'agisci',
          etichetta: 'Chiedi da bere',
          richiede: ['coperta'],
          passi: [
            ...TENDA.acqua(io),
            ...TENDA.otre(io),
            ...TENDA.beve(io),
            {
              t: 'narra',
              testo: 'Iael ha aperto un otre di latte e ti ha dato da bere. Poi ti ha coperto di nuovo.',
              certezza: 'scritto',
              fonti: [b('Giudici', 4, '19')],
            },
          ],
        },
        {
          id: 'ordine',
          x: 790,
          tipo: 'agisci',
          etichetta: 'Dalle un ordine',
          richiede: ['acqua'],
          passi: [...TENDA.ordine(io), senti('s-sicuro')],
        },
        {
          id: 'riposa',
          x: 790,
          tipo: 'agisci',
          etichetta: 'Riposa',
          richiede: ['ordine'],
          passi: [det('esausto'), { t: 'fx', fx: { k: 'dissolvi', a: 1, dur: 2.4 } }],
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
    {
      t: 'attivita',
      a: {
        tipo: 'associa',
        id: 'chiesto',
        consegna: 'Ripensa a ciò che Sisera chiese a Iael. Che cosa avvenne invece?',
        coppie: [
          { a: '«dammi un po’ d’acqua da bere»', b: '«aprì dunque un otre contenente latte»', fonti: [b('Giudici', 4, '19')] },
          { a: '«Mettiti all’entrata della tenda»', b: 'Iael esce, ma per andare incontro a Barac', fonti: [b('Giudici', 4, '20'), b('Giudici', 4, '22')] },
          { a: '«rispondi di no»', b: '«Vieni, ti mostrerò l’uomo che stai cercando»', fonti: [b('Giudici', 4, '20'), b('Giudici', 4, '22')] },
        ],
        spiegazione: 'Sisera aveva dato ordini come se fosse al sicuro. Niente andò come aveva chiesto.',
      },
    },
    senti('s-fine'),
  ],
};
