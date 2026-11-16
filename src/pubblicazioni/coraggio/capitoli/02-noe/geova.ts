import type { Passo, Ruolo } from '@/contenuti/tipi';
import { b } from './base';
import { CANTIERE, INGRESSO, PATTO, USCITA, palcoCantiere, palcoIngresso, palcoPatto, palcoUscita } from './racconto';
import { mondo } from './scenari';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });
const io = 'geova';

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
  descrizione: 'Guarda una terra piena di violenza, approva l’unico uomo giusto, dagli le istruzioni per l’arca, chiudi la porta, fallo uscire sulla terra asciutta e metti l’arcobaleno nelle nuvole.',
  fedelta:
    'Geova non viene raffigurato. Compie solo gli atti che Genesi 6:1–8:22 e 9:8-19 gli attribuiscono, spiegati dal libro e dalle pubblicazioni che cita: nessuna parola e nessun pensiero gli vengono attribuiti oltre a ciò che è scritto.',
  modo: 'osserva',
  stile: 'nessuno',
  durata: '14-18 minuti',
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
      id: 'geova-cantiere',
      titolo: 'Un’arca di legno resinoso',
      luogo: 'Il cantiere',
      ...palcoCantiere(io),
      inizioX: 1150,
      ingresso: [
        {
          t: 'narra',
          testo: 'Dio dice a Noè che porterà un diluvio, e che deve costruire un’arca per salvare sé, la sua famiglia e gli animali.',
          certezza: 'scritto',
          fonti: [b('Genesi', 6, '13-21')],
        },
      ],
      punti: [
        {
          id: 'istruzioni',
          x: 1150,
          tipo: 'agisci',
          etichetta: 'Da’ a Noè le istruzioni per l’arca',
          passi: [
            {
              t: 'narra',
              testo: 'Un’arca di legno resinoso, con scompartimenti, coperta di catrame dentro e fuori, con una finestra sotto il tetto e la porta di lato, a tre piani.',
              certezza: 'scritto',
              fonti: [b('Genesi', 6, '14-16')],
            },
            ...CANTIERE.anni(),
            senti('g-istruzioni'),
          ],
        },
        {
          id: 'avverte',
          x: 1800,
          tipo: 'osserva',
          etichetta: 'Noè avverte chi lo guarda',
          richiede: ['istruzioni'],
          passi: CANTIERE.avverte(),
        },
      ],
    },
    {
      id: 'geova-diluvio',
      titolo: 'Le cateratte dei cieli',
      luogo: 'Il diluvio',
      ...palcoIngresso(io),
      inizioX: 1000,
      // Prima la porta, poi la pioggia: la terra è ancora asciutta (Genesi 7:10, 16, 17).
      vars: { ...palcoIngresso(io).vars, animali: 1 },
      ingresso: [
        {
          t: 'narra',
          testo: 'Noè e la sua famiglia entrano nell’arca, e con loro gli animali, a due a due.',
          certezza: 'scritto',
          fonti: [b('Genesi', 7, '13-16')],
        },
        ...INGRESSO.entrano(io),
      ],
      punti: [
        {
          id: 'porta',
          x: 1180,
          tipo: 'agisci',
          etichetta: 'Chiudi la porta',
          passi: [
            ...INGRESSO.porta(),
            { t: 'verso', id: 'gen-7-16', evidenzia: ['Poi Geova chiuse la porta dietro di lui'] },
            det('porta'),
          ],
        },
        {
          id: 'pioggia',
          x: 700,
          tipo: 'agisci',
          etichetta: 'Fa’ piovere',
          richiede: ['porta'],
          passi: [
            { t: 'fx', fx: { k: 'var', nome: 'pioggia', a: 1, dur: 2 } },
            // Fuori dall’arca non resta nessun essere vivente (Genesi 7:23): tacciono anche uccelli e grilli.
            { t: 'fx', fx: { k: 'var', nome: 'animali', a: 0 } },
            // L’acqua sale e solleva l’arca.
            { t: 'fx', fx: { k: 'var', nome: 'livello', a: 1, dur: 9 } },
            { t: 'fx', fx: { k: 'attendi', dur: 6 } },
            {
              t: 'narra',
              testo: 'Piove a dirotto per 40 giorni e 40 notti. Le acque sollevano l’arca, che galleggia, e coprono i monti più alti.',
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
            { t: 'fx', fx: { k: 'var', nome: 'livello', a: 0.75, dur: 6 } },
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
      id: 'geova-ararat',
      titolo: '«Esci dall’arca»',
      luogo: 'I monti di Ararat',
      ...palcoUscita(),
      inizioX: 700,
      ingresso: [
        {
          t: 'narra',
          testo: 'L’arca si è fermata sui monti di Ararat. Noè e la sua famiglia sono ancora dentro.',
          certezza: 'scritto',
          fonti: [b('Genesi', 8, '4')],
        },
      ],
      punti: [
        {
          id: 'uccelli',
          x: 760,
          tipo: 'osserva',
          etichetta: 'Il corvo e la colomba',
          passi: [
            ...USCITA.corvo(),
            ...USCITA.colomba(),
            ...USCITA.foglia(),
            {
              t: 'narra',
              testo: 'Noè fa volare fuori un corvo, poi una colomba. La seconda volta la colomba torna con una foglia fresca d’olivo nel becco.',
              certezza: 'scritto',
              fonti: [b('Genesi', 8, '6-11')],
            },
            ...USCITA.tetto(),
          ],
        },
        {
          id: 'esci',
          x: 620,
          tipo: 'agisci',
          etichetta: 'Di’ a Noè di uscire',
          richiede: ['uccelli'],
          passi: [
            {
              t: 'narra',
              testo: 'Dio dice a Noè di uscire dall’arca con la moglie, i figli e le mogli dei figli, e di far uscire ogni creatura vivente.',
              certezza: 'scritto',
              fonti: [b('Genesi', 8, '15-17')],
            },
            ...USCITA.esci(),
          ],
        },
      ],
    },
    {
      id: 'geova-patto',
      titolo: 'Un segno nelle nuvole',
      luogo: 'I monti di Ararat',
      ...palcoPatto(io),
      inizioX: 1150,
      ingresso: [
        ...PATTO.arca(),
        {
          t: 'narra',
          testo: 'Noè è uscito dall’arca con la sua famiglia. Erige un altare e offre olocausti.',
          certezza: 'scritto',
          fonti: [b('Genesi', 8, '18-20')],
        },
      ],
      punti: [
        { id: 'odore', x: 1300, tipo: 'osserva', etichetta: 'Un odore gradevole', passi: [...PATTO.altare(), det('promessa')] },
        {
          id: 'arcobaleno',
          x: 1100,
          tipo: 'agisci',
          etichetta: 'Metti l’arcobaleno nelle nuvole',
          richiede: ['odore'],
          passi: [
            ...PATTO.arcobaleno(),
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
