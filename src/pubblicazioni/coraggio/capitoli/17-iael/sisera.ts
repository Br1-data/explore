import type { Passo, Ruolo } from '@/contenuti/tipi';
import { F, PAROLE, b } from './base';
import { accampamento, tendaIael } from './scenari';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });

/**
 * Il punto di vista di Sisera, il nemico, in questo capitolo: la fuga dopo la
 * disfatta e la tenda dove crede di essere al sicuro (Giudici 4:17-21). I carri e la
 * battaglia sono il capitolo 16.
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
    'Giudici 4:17-21, Perspicacia e La Torre di Guardia 1/8/2015. Non è un modello da imitare: serve a capire su che cosa contava il nemico del popolo di Dio. Le sue parole sono quelle del testo; la sua morte non viene mostrata.',
  modo: 'cammina',
  stile: 'sisera',
  durata: '8-10 minuti',
  conclusione: 'Hai visto il racconto dalla parte del nemico',
  scene: [
    {
      id: 'sisera-fuga',
      titolo: 'In fuga',
      luogo: 'Lontano dalla Valle di Izreel',
      ...accampamento(2400),
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
    senti('s-fine'),
  ],
};
