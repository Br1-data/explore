import type { Passo, Ruolo } from '../../tipi';
import { b } from './base';
import { stradaDegliAnni } from './scenari';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });

/** Le tappe della vita di Matusalemme che Genesi 5 permette di datare. */
const PIETRE = [
  { x: 420, testo: '0' },
  { x: 1150, testo: '187' },
  { x: 1800, testo: '243' },
  { x: 2480, testo: '300' },
  { x: 3220, testo: '369' },
  { x: 4320, testo: '969' },
];

/**
 * Il punto di vista di Matusalemme, figlio di Enoc.
 *
 * Di lui la Bibbia dà solo nomi e numeri. Il percorso non inventa scene: fa
 * camminare lungo gli anni di Genesi 5 e mostra che cosa quei numeri rivelano.
 */
export const matusalemme: Ruolo = {
  id: 'matusalemme',
  nome: 'Matusalemme',
  titolo: 'Il figlio: gli anni di Genesi 5',
  descrizione:
    'Percorri gli anni che la Bibbia conta: nasci quando tuo padre ha 65 anni, ne hai 300 quando non si trova più, vivi fino all’anno del Diluvio.',
  fedelta:
    'Di Matusalemme la Bibbia riporta nomi e numeri (Genesi 5:21-27). Qui trovi solo quelli e ciò che se ne ricava con un calcolo. Che cosa provò non è scritto: le domande sono per te.',
  modo: 'cammina',
  stile: 'matusalemme',
  durata: '8-10 minuti',
  conclusione: 'Hai percorso gli anni di Matusalemme',
  scene: [
    {
      id: 'matusalemme-anni',
      titolo: 'La strada degli anni',
      luogo: 'Genesi 5, percorsa a piedi',
      ...stradaDegliAnni(PIETRE),
      inizioX: 140,
      attori: [{ id: 'enoc', x: 700, stile: 'enoc', percorso: [560, 2260] }],
      ingresso: [
        {
          t: 'narra',
          titolo: 'Sei Matusalemme',
          testo:
            'Ogni pietra lungo la strada porta un numero: sono i tuoi anni nei momenti che Genesi 5 permette di datare. Di te la Bibbia non dice altro.',
          certezza: 'scritto',
          fonti: [b('Genesi', 5, '21-27')],
        },
      ],
      punti: [
        {
          id: 'nascita',
          x: PIETRE[0].x,
          tipo: 'leggi',
          etichetta: 'Anno 0 · Nasci',
          passi: [
            { t: 'verso', id: 'gen-5-21', evidenzia: ['all’età di 65 anni generò Matusalemme', 'per 300 anni'] },
            det('a-65'),
            det('trecento'),
            det('due-volte'),
            senti('m-padre'),
          ],
        },
        {
          id: 'lamec',
          x: PIETRE[1].x,
          tipo: 'leggi',
          etichetta: 'Anno 187 · Nasce tuo figlio Lamec',
          passi: [{ t: 'verso', id: 'gen-5-25' }, det('nipote'), det('lamec-fede')],
        },
        {
          id: 'adamo',
          x: PIETRE[2].x,
          tipo: 'medita',
          etichetta: 'Anno 243 · Muore Adamo',
          passi: [{ t: 'schema', id: 'vite' }, det('m-adamo'), det('adamo-vivo')],
        },
        {
          id: 'vuoto',
          x: PIETRE[3].x,
          tipo: 'leggi',
          etichetta: 'Anno 300 · Tuo padre non si trova più',
          richiede: ['nascita'],
          passi: [
            { t: 'fx', fx: { k: 'visibile', chi: 'enoc', v: false } },
            { t: 'verso', id: 'gen-5-24', evidenzia: ['Poi nessuno lo vide più, perché Dio lo prese'] },
            det('m-300'),
            det('prese'),
            det('anni-365'),
            det('m-antenati'),
            { t: 'schema', id: 'poi-mori' },
            det('m-poi-mori'),
            senti('m-vuoto'),
          ],
        },
        {
          id: 'noe',
          x: PIETRE[4].x,
          tipo: 'leggi',
          etichetta: 'Anno 369 · Nasce tuo nipote Noè',
          passi: [
            { t: 'verso', id: 'gen-5-28' },
            det('m-lamec-parole'),
            det('m-noe'),
            { t: 'verso', id: 'gen-6-9', evidenzia: ['Noè camminò con il vero Dio'] },
          ],
        },
        {
          id: 'fine',
          x: PIETRE[5].x,
          tipo: 'leggi',
          etichetta: 'Anno 969',
          richiede: ['vuoto', 'noe'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'ordina',
                id: 'ordine-anni',
                consegna: 'Hai percorso tutta la strada. Rimetti gli avvenimenti nell’ordine in cui accaddero.',
                voci: [
                  { testo: 'Nasce Matusalemme', nota: 'Enoc ha 65 anni' },
                  { testo: 'Nasce Lamec', nota: 'Matusalemme ha 187 anni' },
                  { testo: 'Muore Adamo', nota: 'a 930 anni' },
                  { testo: 'Enoc non si trova più', nota: 'a 365 anni' },
                  { testo: 'Nasce Noè', nota: '69 anni dopo' },
                  { testo: 'Il Diluvio', nota: 'Noè ha 600 anni' },
                ],
                spiegazione: 'Tutte queste date si ricavano sommando gli anni indicati in Genesi 5 e 7:6.',
              },
            },
            det('m-969'),
            { t: 'verso', id: 'gen-7-6' },
            det('m-diluvio'),
            senti('m-diluvio'),
          ],
        },
        {
          id: 'silenzio',
          x: 4840,
          tipo: 'medita',
          etichetta: 'Ciò che la Bibbia non dice',
          richiede: ['fine'],
          passi: [det('m-silenzio')],
        },
      ],
    },
  ],
  epilogo: [det('non-cielo'), det('memoria')],
};
