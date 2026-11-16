import type { Passo, Ruolo } from '@/contenuti/tipi';
import { F, b } from './base';
import { BARAC, CANTO, palcoBarac, palcoCanto } from './racconto';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });
const io = 'barac';

/**
 * Il punto di vista di Barac, in questo capitolo: arriva alla tenda di Iael
 * inseguendo Sisera e vede adempiersi la profezia di Debora (Giudici 4:9, 22); poi, nel
 * canto di vittoria, loda Iael con Debora (5:24; libro). Sono le stesse scene che vivono
 * Iael, Debora e Geova (racconto.ts). La chiamata, il Tabor, la battaglia e
 * l’inseguimento sono il capitolo 16.
 */
export const barac: Ruolo = {
  id: 'barac',
  nome: 'Barac',
  titolo: 'Il comandante che vide adempiersi la profezia',
  descrizione: 'Arrivi alla tenda di Iael inseguendo Sisera, ricordi le parole di Debora, scopri a chi va la gloria e la lodi nel canto di vittoria.',
  fedelta:
    'Giudici 4:9, 22; 5:24 e il capitolo 17 del libro. Le parole di Iael e del canto sono quelle del testo; ciò che Barac vede nella tenda non viene mostrato.',
  modo: 'cammina',
  stile: 'barac',
  durata: '7-9 minuti',
  conclusione: 'Hai vissuto il racconto nei panni di Barac',
  scene: [
    {
      id: 'barac-tenda',
      titolo: 'L’uomo che cerchi',
      luogo: 'Le tende di Heber il chenita',
      ...palcoBarac(io),
      inizioX: 1380,
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
          ],
        },
        {
          id: 'iael',
          richiede: ['profezia'],
          x: 1230,
          tipo: 'ascolta',
          etichetta: 'Una donna ti viene incontro',
          passi: BARAC.incontro(io),
        },
        {
          id: 'entra',
          x: 860,
          tipo: 'agisci',
          etichetta: 'Entra nella tenda',
          richiede: ['iael'],
          passi: [
            ...BARAC.entra(io),
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
    {
      id: 'barac-canto',
      titolo: 'Benedetta fra le donne',
      luogo: 'Il canto di vittoria',
      ...palcoCanto(io),
      inizioX: 560,
      ingresso: [
        {
          t: 'narra',
          testo: 'Dopo la vittoria, nel canto che intoni con Debora, lodate Iael.',
          certezza: 'libro',
          fonti: [F.libro, b('Giudici', 5, '24')],
        },
      ],
      punti: [{ id: 'canto', x: 560, tipo: 'agisci', etichetta: 'Canta con Debora', passi: [...CANTO.lode(io), det('esaltata')] }],
    },
  ],
  epilogo: [],
};
