import type { Passo, Ruolo } from '@/contenuti/tipi';
import { b } from './base';
import { ararat, diluvio, mondo } from './scenari';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });

/**
 * Il punto di vista di Geova. Non viene raffigurato e non gli vengono attribuite parole
 * oltre al testo: chi gioca compie soltanto gli atti che Genesi 6–9 gli attribuisce
 * (vede, stabilisce il tempo, approva Noè, chiude la porta, si ricorda di Noè, stringe
 * il patto e mette l’arcobaleno nelle nuvole).
 */
export const geova: Ruolo = {
  id: 'geova',
  nome: 'Geova',
  titolo: 'Ciò che Geova vede e fa',
  descrizione: 'Guarda una terra piena di violenza, approva l’unico uomo giusto, chiudi la porta dell’arca e metti l’arcobaleno nelle nuvole.',
  fedelta:
    'Geova non viene raffigurato. Compie solo gli atti che Genesi 6:1–8:22 e 9:8-19 gli attribuiscono, spiegati dal libro e dalle pubblicazioni che cita: nessuna parola e nessun pensiero gli vengono attribuiti oltre a ciò che è scritto.',
  modo: 'osserva',
  stile: 'nessuno',
  durata: '10-12 minuti',
  conclusione: 'Hai ripercorso ciò che fece Geova',
  scene: [
    {
      id: 'geova-terra',
      titolo: 'Una terra rovinata',
      luogo: 'Prima del diluvio',
      ...mondo(2400),
      inizioX: 700,
      folle: [
        { x0: 900, x1: 1200, n: 6, seme: 211, armati: 0.6, gruppo: 'rissa' },
        { x0: 1500, x1: 2100, n: 10, seme: 213, donne: 0.4, comportamento: 'vaga' },
      ],
      ingresso: [
        {
          t: 'narra',
          titolo: 'Il punto di vista di Geova',
          testo: 'Qui non muovi un personaggio: sposti lo sguardo sulla terra. Le azioni che compirai sono soltanto quelle che il racconto attribuisce a Geova.',
        },
      ],
      punti: [
        {
          id: 'vede',
          x: 1050,
          tipo: 'osserva',
          etichetta: 'Guarda il cuore degli uomini',
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'completa',
                id: 'malvagita',
                consegna: 'Che cosa vede Geova, e che cosa prova? Completa il versetto.',
                verso: 'gen-6-5',
                testo: 'Geova vide quindi che la malvagità degli uomini era [[grande]] sulla terra e che nel loro cuore erano inclini a nutrire sempre e solo pensieri [[cattivi]]. Geova si rammaricò di aver fatto gli uomini sulla terra, e se ne [[rattristò]] nel suo cuore.',
                distrattori: ['poca', 'buoni', 'rallegrò'],
              },
            },
            det('giudizio'),
          ],
        },
        {
          id: 'tempo',
          x: 1500,
          tipo: 'agisci',
          etichetta: 'Stabilisci un tempo',
          richiede: ['vede'],
          passi: [{ t: 'verso', id: 'gen-6-3', evidenzia: ['Pertanto vivrà 120 anni'] }, det('decreto')],
        },
        {
          id: 'approva',
          x: 1900,
          tipo: 'agisci',
          etichetta: 'Approva l’unico uomo giusto',
          richiede: ['tempo'],
          passi: [
            { t: 'narra', testo: 'Noè invece ebbe l’approvazione di Geova.', certezza: 'scritto', fonti: [b('Genesi', 6, '8')] },
            senti('g-uno'),
          ],
        },
      ],
    },
    {
      id: 'geova-diluvio',
      titolo: 'Le cateratte dei cieli',
      luogo: 'Il diluvio',
      ...diluvio(2000),
      inizioX: 1000,
      vars: { pioggia: 0.3 },
      ingresso: [
        {
          t: 'narra',
          testo: 'Noè e la sua famiglia sono entrati nell’arca, e con loro gli animali, a due a due.',
          certezza: 'scritto',
          fonti: [b('Genesi', 7, '13-16')],
        },
      ],
      punti: [
        {
          id: 'porta',
          x: 1180,
          tipo: 'agisci',
          etichetta: 'Chiudi la porta',
          passi: [{ t: 'verso', id: 'gen-7-16', evidenzia: ['Poi Geova chiuse la porta dietro di lui'] }, det('porta')],
        },
        {
          id: 'pioggia',
          x: 700,
          tipo: 'agisci',
          etichetta: 'Fa’ piovere',
          richiede: ['porta'],
          passi: [
            { t: 'fx', fx: { k: 'var', nome: 'pioggia', a: 1, dur: 3 } },
            {
              t: 'narra',
              testo: 'Piove a dirotto per 40 giorni e 40 notti. L’arca galleggia, e le acque coprono i monti più alti.',
              certezza: 'scritto',
              fonti: [b('Genesi', 7, '12'), b('Genesi', 7, '17-19')],
            },
            det('tempi'),
          ],
        },
        {
          id: 'ricorda',
          x: 1400,
          tipo: 'agisci',
          etichetta: 'Ricordati di Noè',
          richiede: ['pioggia'],
          passi: [
            { t: 'fx', fx: { k: 'var', nome: 'pioggia', a: 0, dur: 4 } },
            {
              t: 'narra',
              testo: 'Dio non si è dimenticato di Noè né degli animali con lui. Fa soffiare un vento, e le acque cominciano ad abbassarsi.',
              certezza: 'scritto',
              fonti: [b('Genesi', 8, '1')],
            },
          ],
        },
      ],
    },
    {
      id: 'geova-patto',
      titolo: 'Un segno nelle nuvole',
      luogo: 'I monti di Ararat',
      ...ararat(true, 2000),
      inizioX: 1100,
      attori: [{ id: 'noe', x: 1240, stile: 'noe', verso: 1, posa: 'alza' }],
      ingresso: [
        {
          t: 'narra',
          testo: 'Noè è uscito dall’arca con la sua famiglia e ha offerto olocausti sull’altare.',
          certezza: 'scritto',
          fonti: [b('Genesi', 8, '18-20')],
        },
      ],
      punti: [
        { id: 'odore', x: 1300, tipo: 'osserva', etichetta: 'Un odore gradevole', passi: [det('promessa')] },
        {
          id: 'arcobaleno',
          x: 1100,
          tipo: 'agisci',
          etichetta: 'Metti l’arcobaleno nelle nuvole',
          richiede: ['odore'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'completa',
                id: 'arcobaleno',
                consegna: 'Il segno del patto. Completa il versetto.',
                verso: 'gen-9-13',
                testo: 'metto nelle [[nuvole]] il mio [[arcobaleno]], che servirà da segno del [[patto]] tra me e la terra.',
                distrattori: ['stelle', 'fuoco', 'regno'],
              },
            },
            senti('g-segno'),
          ],
        },
        { id: 'futuro', x: 1600, tipo: 'medita', etichetta: 'Un modello per il futuro', richiede: ['arcobaleno'], passi: [det('modello')] },
      ],
    },
  ],
  epilogo: [],
};
