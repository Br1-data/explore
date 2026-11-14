import type { Passo, Ruolo } from '@/contenuti/tipi';
import { b } from './base';
import { arcaPronta, cantiere } from './scenari';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });

/**
 * Il punto di vista della moglie di Noè. La Bibbia non ne riporta il nome né le
 * parole: dice che entrò nell’arca e ne uscì con Noè (Genesi 6:18; 7:7, 13; 8:16, 18).
 * Il resto viene dal libro, che parla della famiglia di Noè.
 */
export const moglie: Ruolo = {
  id: 'moglie',
  nome: 'La moglie di Noè',
  titolo: 'Una famiglia diversa da tutte le altre',
  descrizione: 'Cresci i tuoi figli in un mondo violento, prepara le provviste per la famiglia e gli animali, entra nell’arca mentre la gente vi deride.',
  fedelta:
    'La Bibbia non ne riporta il nome né le parole: dice che entrò nell’arca con Noè. Ciò che fa qui è quanto il capitolo 2 del libro dice della famiglia di Noè, con le pubblicazioni che cita.',
  modo: 'cammina',
  stile: 'moglie-noe',
  durata: '8-10 minuti',
  conclusione: 'Hai vissuto il racconto nei panni della moglie di Noè',
  scene: [
    {
      id: 'moglie-cantiere',
      titolo: 'La tua famiglia',
      luogo: 'Il cantiere dell’arca',
      ...cantiere(2400),
      inizioX: 250,
      attori: [{ id: 'noe', x: 1050, stile: 'noe', verso: -1 }],
      folle: [{ x0: 1300, x1: 1500, n: 5, seme: 221, donne: 0.5, comportamento: 'vaga' }],
      ingresso: [
        {
          t: 'narra',
          titolo: 'Sei la moglie di Noè',
          testo: 'La Bibbia non riporta il tuo nome. Dio ha detto a Noè che entrerai nell’arca con lui, con i vostri figli e le loro mogli.',
          certezza: 'scritto',
          fonti: [b('Genesi', 6, '18')],
        },
      ],
      punti: [
        { id: 'figli', x: 1400, tipo: 'esamina', etichetta: 'I tuoi figli al lavoro', passi: [det('educati')] },
        { id: 'nuore', x: 1520, tipo: 'esamina', etichetta: 'Le mogli dei tuoi figli', passi: [det('adulti')] },
        { id: 'vicini', x: 2100, tipo: 'esamina', etichetta: 'Chi vive intorno a voi', passi: [det('prepotenti')] },
        {
          id: 'cibo',
          x: 1700,
          tipo: 'agisci',
          etichetta: 'Prepara le provviste',
          richiede: ['figli', 'nuore'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'completa',
                id: 'cibo',
                consegna: 'Che cosa bisogna portare nell’arca? Completa le parole di Dio a Noè.',
                verso: 'gen-6-21',
                testo: 'E tu devi raccogliere e portare con te [[cibo]] di ogni tipo: servirà per nutrire te e gli [[animali]]”.',
                distrattori: ['oro', 'vicini'],
              },
            },
            det('provviste'),
          ],
        },
      ],
    },
    {
      id: 'moglie-ingresso',
      titolo: 'A due a due',
      luogo: 'Davanti all’arca',
      ...arcaPronta(2200),
      inizioX: 1900,
      folle: [{ x0: 1700, x1: 2100, n: 8, seme: 223, comportamento: 'vaga' }],
      ingresso: [
        {
          t: 'narra',
          testo: 'Mancano sette giorni al diluvio: è il momento di entrare nell’arca.',
          certezza: 'scritto',
          fonti: [b('Genesi', 7, '1-4')],
        },
      ],
      punti: [
        {
          id: 'animali',
          x: 1280,
          tipo: 'osserva',
          etichetta: 'Arrivano gli animali',
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'domanda',
                id: 'a-due',
                domanda: 'Come arrivano gli animali all’arca?',
                opzioni: ['Li cacciate e li portate voi', 'Vanno nell’arca da Noè a due a due', 'Li porta un vicino in cambio di un posto'],
                corretta: 1,
                dettaglio: 'spontanei',
              },
            },
          ],
        },
        { id: 'gente', x: 1850, tipo: 'ascolta', etichetta: 'La gente vi guarda', richiede: ['animali'], passi: [det('derisi'), senti('m-derisa')] },
        {
          id: 'entra',
          x: 1100,
          tipo: 'agisci',
          etichetta: 'Entra nell’arca',
          richiede: ['gente'],
          passi: [
            {
              t: 'narra',
              testo: 'Entri nell’arca con Noè, i vostri figli e le loro mogli. Poi Geova chiude la porta.',
              certezza: 'scritto',
              fonti: [b('Genesi', 7, '13'), b('Genesi', 7, '16')],
            },
            { t: 'fx', fx: { k: 'dissolvi', a: 1, dur: 1.6 } },
          ],
        },
      ],
    },
  ],
  epilogo: [
    {
      t: 'narra',
      testo: 'Più di un anno dopo, Dio disse a Noè di uscire dall’arca con la moglie, i figli e le mogli dei figli. E uscirono.',
      certezza: 'scritto',
      fonti: [b('Genesi', 8, '15-18')],
    },
  ],
};
