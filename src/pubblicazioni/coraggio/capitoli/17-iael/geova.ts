import type { Passo, Ruolo } from '@/contenuti/tipi';
import { b } from './base';
import {
  ARRIVO,
  BARAC,
  CANTO,
  FINESTRA,
  TENDA,
  palcoArrivo,
  palcoBarac,
  palcoCanto,
  palcoFinestra,
  palcoTenda,
} from './racconto';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });
const io = 'geova';

/**
 * Il punto di vista di Geova, in questo capitolo: vede tutte le scene del racconto
 * (racconto.ts), consegna Sisera nelle mani di una donna, come aveva annunciato
 * (Giudici 4:9, 21), e ispira il canto che loda Iael (5:24-31). L’oppressione e la
 * battaglia sono il capitolo 16.
 *
 * Geova non viene raffigurato e non gli vengono attribuite parole o pensieri oltre
 * al testo: chi gioca sposta lo sguardo e compie soltanto gli atti del racconto.
 */
export const geova: Ruolo = {
  id: 'geova',
  nome: 'Geova',
  titolo: 'Ciò che Geova vede e fa',
  descrizione:
    'Guarda il nemico arrivare alla tenda di Iael, consegnalo nelle mani di una donna come avevi annunciato, e ispira il canto che la chiama benedetta.',
  fedelta:
    'Geova non viene raffigurato. Compie solo gli atti che Giudici 4 e 5 gli attribuiscono, spiegati dal libro e dalle pubblicazioni che cita: nessuna parola e nessun pensiero gli vengono attribuiti oltre a ciò che è scritto.',
  modo: 'osserva',
  stile: 'nessuno',
  durata: '14-18 minuti',
  conclusione: 'Hai ripercorso ciò che fece Geova',
  scene: [
    {
      id: 'geova-arrivo',
      titolo: 'Verso la tenda di Iael',
      luogo: 'Le tende di Heber il chenita',
      ...palcoArrivo(io),
      inizioX: 2100,
      ingresso: [
        {
          t: 'narra',
          titolo: 'Il punto di vista di Geova',
          testo:
            'Qui non muovi un personaggio: sposti lo sguardo sulla scena. Le azioni che compirai sono soltanto quelle che il racconto attribuisce a Geova.',
        },
        {
          t: 'narra',
          testo: 'Sisera fugge fino alla tenda di Iael, moglie di Heber il chenita: fra Iabin e la casa di Heber c’è pace.',
          certezza: 'scritto',
          fonti: [b('Giudici', 4, '17')],
        },
      ],
      punti: [
        {
          id: 'arriva',
          x: 2040,
          tipo: 'osserva',
          etichetta: 'Un uomo in fuga',
          passi: [...ARRIVO.arriva(io), ...ARRIVO.incontro(io), ...ARRIVO.entra(io), det('guida')],
        },
      ],
    },
    {
      id: 'geova-tenda',
      titolo: 'Nelle mani di una donna',
      luogo: 'La tenda di Iael',
      ...palcoTenda(io),
      inizioX: 820,
      ingresso: [
        {
          t: 'narra',
          testo: 'Sisera è entrato nella tenda di Iael.',
          certezza: 'scritto',
          fonti: [b('Giudici', 4, '18')],
        },
      ],
      punti: [
        {
          id: 'tenda',
          x: 820,
          tipo: 'osserva',
          etichetta: 'La tenda di Iael',
          passi: [
            ...TENDA.prendiCoperta(io),
            ...TENDA.copri(io),
            ...TENDA.acqua(io),
            ...TENDA.otre(io),
            ...TENDA.beve(io),
            ...TENDA.ordine(io),
            {
              t: 'narra',
              testo: 'Sisera si addormenta profondamente.',
              certezza: 'scritto',
              fonti: [b('Giudici', 4, '21')],
            },
            det('si-servi'),
          ],
        },
        {
          id: 'consegna',
          x: 760,
          tipo: 'agisci',
          etichetta: 'Consegna Sisera nelle mani di una donna',
          richiede: ['tenda'],
          passi: [
            { t: 'fx', fx: { k: 'dissolvi', a: 1, dur: 1.6 } },
            {
              t: 'narra',
              testo: 'Mentre Sisera dorme, Iael lo colpisce con un piolo da tenda. Sisera muore.',
              certezza: 'scritto',
              fonti: [b('Giudici', 4, '21')],
            },
            { t: 'fx', fx: { k: 'dissolvi', a: 0, dur: 1.6 } },
            senti('g-donna'),
          ],
        },
      ],
    },
    {
      id: 'geova-barac',
      titolo: 'L’uomo che stai cercando',
      luogo: 'Arriva Barac',
      ...palcoBarac(io),
      inizioX: 1100,
      ingresso: [
        {
          t: 'narra',
          testo: 'Barac arriva alla tenda di Iael, all’inseguimento di Sisera.',
          certezza: 'scritto',
          fonti: [b('Giudici', 4, '22')],
        },
      ],
      punti: [
        {
          id: 'barac',
          x: 1100,
          tipo: 'osserva',
          etichetta: 'Barac e Iael',
          passi: [...BARAC.arriva(io), ...BARAC.incontro(io), ...BARAC.entra(io), det('uguali')],
        },
      ],
    },
    {
      id: 'geova-canto',
      titolo: 'Un canto ispirato',
      luogo: 'Quel giorno',
      ...palcoCanto(io),
      inizioX: 600,
      ingresso: [
        {
          t: 'narra',
          testo: 'Debora e Barac intonano un canto di vittoria. Nel canto, Iael viene chiamata benedetta fra le donne.',
          certezza: 'scritto',
          fonti: [b('Giudici', 5, '1'), b('Giudici', 5, '24')],
        },
      ],
      punti: [
        { id: 'canto', x: 600, tipo: 'agisci', etichetta: 'Ispira il canto', passi: [...CANTO.lode(io), det('ispirato')] },
        {
          id: 'meghiddo',
          x: 1250,
          tipo: 'medita',
          etichetta: 'Un nome per il futuro',
          richiede: ['canto'],
          passi: [
            det('armaghedon'),
            {
              t: 'attivita',
              a: {
                tipo: 'domanda',
                id: 'differenza',
                domanda: 'Che cosa sarà diverso ad Armaghedon rispetto alla battaglia di Barac?',
                opzioni: [
                  'I servitori di Dio non combatteranno',
                  'I nemici di Dio non saranno distrutti',
                  'Combatterà solo una parte del popolo di Dio',
                ],
                corretta: 0,
                dettaglio: 'differenza',
              },
            },
          ],
        },
        {
          id: 'salmo',
          x: 1750,
          tipo: 'medita',
          etichetta: 'Secoli dopo',
          richiede: ['meghiddo'],
          passi: [{ t: 'verso', id: 'sal-83-9', evidenzia: ['come facesti a Sìsera e a Iàbin'] }, det('fede-rafforzata')],
        },
      ],
    },
    {
      id: 'geova-finestra',
      titolo: 'Un’attesa vana',
      luogo: 'Ad Aroset, come la descrive il canto',
      ...palcoFinestra(io),
      inizioX: 850,
      ingresso: [
        {
          t: 'narra',
          testo: 'Il canto si sposta nella casa di Sisera: sua madre aspetta il suo ritorno.',
          certezza: 'scritto',
          fonti: [b('Giudici', 5, '28')],
        },
      ],
      punti: [
        {
          id: 'attesa',
          x: 850,
          tipo: 'osserva',
          etichetta: 'Alla finestra',
          passi: [
            ...FINESTRA.attesa(io),
            ...FINESTRA.dame(io),
            {
              t: 'attivita',
              a: {
                tipo: 'completa',
                id: 'sole',
                consegna: 'Il canto si chiude con una preghiera. Completa il versetto.',
                verso: 'gdc-5-31',
                testo:
                  'Così, o Geova, muoiano tutti i tuoi [[nemici]], ma quelli che ti [[amano]] siano come il [[sole]] che sorge nella sua gloria”. E il paese fu in pace per 40 anni.',
                distrattori: ['popoli', 'temono', 'fuoco'],
              },
            },
            senti('g-nemici'),
          ],
        },
      ],
    },
  ],
  epilogo: [],
};
