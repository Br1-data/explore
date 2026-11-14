import type { Passo, Ruolo } from '@/contenuti/tipi';
import { F, b } from './base';
import { ararat, cantiere } from './scenari';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });

/**
 * Il punto di vista di uno dei figli di Noè: Sem, Cam o Iafet. In questi capitoli la
 * Bibbia ne riporta i nomi ma non distingue che cosa fece ciascuno: qui si fa solo ciò
 * che dice della famiglia di Noè (Genesi 6:10, 18; 7:13; 8:16-18; 9:8-19).
 */
export const figlio: Ruolo = {
  id: 'figlio',
  nome: 'Uno dei figli di Noè',
  titolo: 'Sem, Cam o Iafet',
  descrizione: 'Lavora con tuo padre all’arca, misurala con i cubiti, resta più di un anno nell’arca e scendi sulla terra di nuovo asciutta.',
  fedelta:
    'La Bibbia riporta i nomi dei tre figli di Noè, Sem, Cam e Iafet, ma in questi capitoli non dice che cosa fece ciascuno: qui c’è solo ciò che dice della famiglia di Noè, spiegato dal libro e dalle pubblicazioni che cita.',
  modo: 'cammina',
  stile: 'figlio-noe',
  durata: '8-10 minuti',
  conclusione: 'Hai vissuto il racconto nei panni di uno dei figli di Noè',
  scene: [
    {
      id: 'figlio-cantiere',
      titolo: 'Al lavoro con tuo padre',
      luogo: 'Il cantiere dell’arca',
      ...cantiere(2400),
      inizioX: 2100,
      attori: [{ id: 'noe', x: 1300, stile: 'noe', verso: 1 }],
      ingresso: [
        {
          t: 'narra',
          titolo: 'Sei uno dei figli di Noè',
          testo: 'I figli di Noè sono Sem, Cam e Iafet: tu sei uno di loro. Con tuo padre e la tua famiglia lavori alla costruzione dell’arca.',
          certezza: 'libro',
          fonti: [b('Genesi', 6, '10'), F.libro],
        },
      ],
      punti: [
        { id: 'legno', x: 1700, tipo: 'esamina', etichetta: 'Il legno e il catrame', passi: [det('resinoso')] },
        { id: 'tetto', x: 1000, tipo: 'esamina', etichetta: 'Sotto il tetto', passi: [det('tsohar')] },
        {
          id: 'misure',
          x: 1400,
          tipo: 'leggi',
          etichetta: 'Le misure dell’arca',
          richiede: ['legno', 'tetto'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'associa',
                id: 'misure',
                consegna: 'Dio ha dato le misure in cubiti. Unisci ogni parte alla sua misura.',
                coppie: [
                  { a: 'Lunghezza', b: '«lunga 300 cubiti»', fonti: [b('Genesi', 6, '15')] },
                  { a: 'Larghezza', b: '«larga 50 cubiti»', fonti: [b('Genesi', 6, '15')] },
                  { a: 'Altezza', b: '«alta 30 cubiti»', fonti: [b('Genesi', 6, '15')] },
                  { a: 'La finestra per la luce', b: '«A un cubito da dove comincia il tetto»', fonti: [b('Genesi', 6, '16')] },
                ],
                dettaglio: 'dimensioni',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'figlio-uscita',
      titolo: 'Di nuovo sulla terra',
      luogo: 'I monti di Ararat',
      ...ararat(true, 2000),
      inizioX: 700,
      attori: [{ id: 'noe', x: 1240, stile: 'noe', verso: -1 }],
      ingresso: [
        {
          t: 'narra',
          testo: 'Dio ha detto a tuo padre di uscire dall’arca con tutta la famiglia e con gli animali.',
          certezza: 'scritto',
          fonti: [b('Genesi', 8, '15-17')],
        },
      ],
      punti: [
        {
          id: 'calendario',
          x: 900,
          tipo: 'leggi',
          etichetta: 'Quanto siete rimasti nell’arca',
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'ordina',
                id: 'calendario',
                consegna: 'Genesi annota le date del diluvio. Mettile in ordine.',
                voci: [
                  { testo: 'Le cateratte dei cieli si spalancano', nota: '600º anno, 2º mese, 17º giorno' },
                  { testo: 'Piove a dirotto per 40 giorni e 40 notti', nota: 'Genesi 7:12' },
                  { testo: 'Le acque sommergono la terra per 150 giorni', nota: 'Genesi 7:24' },
                  { testo: 'L’arca si ferma sui monti di Ararat', nota: '7º mese, 17º giorno' },
                  { testo: 'Appaiono le cime dei monti', nota: '10º mese, 1º giorno' },
                  { testo: 'Le acque sono defluite dalla terra', nota: '601º anno, 1º mese, 1º giorno' },
                  { testo: 'La terra si è asciugata', nota: '2º mese, 27º giorno' },
                ],
                spiegazione: 'Sono le date di Genesi 7:11–8:14.',
              },
            },
            det('un-anno'),
          ],
        },
        {
          id: 'popolazione',
          x: 1500,
          tipo: 'medita',
          etichetta: 'Da voi tre',
          richiede: ['calendario'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'completa',
                id: 'popolazione',
                consegna: 'Che cosa verrà da voi tre? Completa il versetto.',
                verso: 'gen-9-18',
                testo: 'I figli di Noè che uscirono dall’arca furono [[Sem]], Cam e Iàfet. In seguito Cam generò Cànaan. Questi tre furono i figli di Noè, e da loro venne e si diffuse tutta la [[popolazione]] della terra.',
                distrattori: ['Set', 'famiglia'],
              },
            },
            det('discendenti'),
            senti('f-diverso'),
          ],
        },
      ],
    },
  ],
  epilogo: [],
};
