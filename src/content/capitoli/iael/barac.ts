import type { Passo, Ruolo } from '../../tipi';
import { PAROLE, b } from './base';
import { pianura, tendaIael } from './scenari';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });

/**
 * Il punto di vista di Barac, in questo capitolo: l’inseguimento e la profezia
 * di Debora che si adempie davanti ai suoi occhi. (La sua fede e la chiamata di
 * Debora sono il tema del capitolo 16.)
 */
export const barac: Ruolo = {
  id: 'barac',
  nome: 'Barac',
  titolo: 'Il comandante che vide adempiersi la profezia',
  descrizione:
    'Insegui il nemico dopo la vittoria che Geova ti ha dato, ricorda le parole di Debora e scopri a chi va la gloria.',
  fedelta:
    'Giudici 4:9, 16, 22-24 e il capitolo 17 del libro, con Perspicacia. Le parole di Iael sono quelle del testo; ciò che Barac vede nella tenda non viene mostrato.',
  modo: 'cammina',
  stile: 'barac',
  durata: '6-8 minuti',
  conclusione: 'Hai vissuto il racconto nei panni di Barac',
  scene: [
    {
      id: 'barac-inseguimento',
      titolo: 'All’inseguimento',
      luogo: 'Dal monte Tabor verso Aroset-Goim',
      ...pianura(2800),
      inizioX: 320,
      vars: { pioggia: 0.35 },
      folle: [{ x0: 120, x1: 300, n: 9, seme: 81, armati: 0.9, comportamento: 'insegue', distanza: [210, 150] }],
      ingresso: [
        {
          t: 'narra',
          titolo: 'Sei Barac',
          testo:
            'Sei Barac, figlio di Abinoam. Geova ha gettato nello scompiglio l’esercito di Sisera e lo ha consegnato alla tua spada: ora insegui il nemico.',
          certezza: 'scritto',
          fonti: [b('Giudici', 4, '6'), b('Giudici', 4, '15')],
        },
      ],
      punti: [
        {
          id: 'tabor',
          x: 520,
          tipo: 'esamina',
          etichetta: 'Il monte da cui sei sceso',
          passi: [det('tabor')],
        },
        {
          id: 'profezia',
          x: 900,
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
            det('bellezza'),
          ],
        },
        {
          id: 'carri',
          x: 1480,
          tipo: 'esamina',
          etichetta: 'Carri abbandonati',
          passi: [det('inseguimento')],
        },
      ],
    },
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
          testo: 'Inseguendo Sisera, arrivi a un accampamento di tende.',
          certezza: 'scritto',
          fonti: [b('Giudici', 4, '22')],
        },
        { t: 'fx', fx: { k: 'vai', chi: 'iael', x: 1150, vel: 120, attendi: true } },
      ],
      punti: [
        {
          id: 'iael',
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
        {
          id: 'dopo',
          x: 1140,
          tipo: 'medita',
          etichetta: 'Che cosa ne fu di Iabin',
          richiede: ['entra'],
          passi: [det('annientato'), { t: 'verso', id: 'ebr-11-32', evidenzia: ['di Bàrac', 'misero in fuga eserciti invasori'] }],
        },
      ],
    },
  ],
  epilogo: [],
};
