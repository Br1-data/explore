import type { Passo, Ruolo } from '@/contenuti/tipi';
import { PAROLE, b } from './base';
import { tendaIael } from './scenari';

const senti = (id: string): Passo => ({ t: 'senti', id });

/**
 * Il punto di vista di Barac, in questo capitolo: arriva alla tenda di Iael
 * inseguendo Sisera e vede adempiersi la profezia di Debora (Giudici 4:9, 22).
 * La chiamata, il Tabor, la battaglia e l’inseguimento sono il capitolo 16.
 */
export const barac: Ruolo = {
  id: 'barac',
  nome: 'Barac',
  titolo: 'Il comandante che vide adempiersi la profezia',
  descrizione: 'Arrivi alla tenda di Iael inseguendo Sisera, ricordi le parole di Debora e scopri a chi va la gloria.',
  fedelta:
    'Giudici 4:9, 22 e il capitolo 17 del libro. Le parole di Iael sono quelle del testo; ciò che Barac vede nella tenda non viene mostrato.',
  modo: 'cammina',
  stile: 'barac',
  durata: '4-5 minuti',
  conclusione: 'Hai vissuto il racconto nei panni di Barac',
  scene: [
    {
      id: 'barac-tenda',
      titolo: 'L’uomo che cerchi',
      luogo: 'Le tende di Heber il chenita',
      ...tendaIael(1500),
      inizioX: 1380,
      attori: [
        { id: 'sisera', x: 770, stile: 'sisera', verso: 1, posa: 'coperto' },
        { id: 'iael', x: 900, stile: 'iael', verso: 1 },
      ],
      ingresso: [
        {
          t: 'narra',
          titolo: 'Sei Barac',
          testo: 'Sei Barac, figlio di Abinoam. Inseguendo Sisera, arrivi a un accampamento di tende.',
          certezza: 'scritto',
          fonti: [b('Giudici', 4, '6'), b('Giudici', 4, '22')],
        },
      ],
      punti: [
        {
          id: 'profezia',
          x: 1300,
          tipo: 'medita',
          etichetta: 'Le parole di Debora',
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'completa',
                id: 'gloria',
                consegna: 'Prima della battaglia Debora ti aveva detto qualcosa. Completa le sue parole.',
                verso: 'gdc-4-9',
                testo:
                  'E lei gli disse: “Verrò senz’altro. Ma non ti procurerai [[gloria]] tramite questa impresa, perché sarà nelle mani di una [[donna]] che Geova consegnerà Sìsera”. Dopodiché Debora si alzò e andò con Bàrac a Chèdes.',
                distrattori: ['vittoria', 'profetessa'],
              },
            },
            { t: 'fx', fx: { k: 'vai', chi: 'iael', x: 1150, vel: 120, attendi: true } },
          ],
        },
        {
          id: 'iael',
          richiede: ['profezia'],
          x: 1230,
          tipo: 'ascolta',
          etichetta: 'Una donna ti viene incontro',
          passi: [
            { t: 'fx', fx: { k: 'nastro', chi: 'iael', testo: PAROLE.mostra, dur: 4.5 } },
            { t: 'fx', fx: { k: 'vai', chi: 'iael', x: 930, vel: 90 } },
          ],
        },
        {
          id: 'entra',
          x: 860,
          tipo: 'agisci',
          etichetta: 'Entra nella tenda',
          richiede: ['iael'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'domanda',
                id: 'a-chi',
                domanda: 'A chi è andata la gloria della vittoria su Sisera?',
                opzioni: ['A Barac, il comandante dell’esercito', 'A Debora, la profetessa', 'A Iael, una donna'],
                corretta: 2,
                dettaglio: 'adempiute',
              },
            },
            senti('b-gloria'),
          ],
        },
      ],
    },
  ],
  epilogo: [],
};
