import type { Passo, Ruolo } from '@/contenuti/tipi';
import { b } from './base';
import { festa, tendaIael } from './scenari';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });

/**
 * Il punto di vista di Geova, in questo capitolo: consegna Sisera nelle mani di una
 * donna, come aveva annunciato (Giudici 4:9, 21), e ispira il canto che loda Iael
 * (5:24-31). L’oppressione e la battaglia sono il capitolo 16.
 *
 * Geova non viene raffigurato e non gli vengono attribuite parole o pensieri oltre
 * al testo: chi gioca sposta lo sguardo e compie soltanto gli atti del racconto.
 */
export const geova: Ruolo = {
  id: 'geova',
  nome: 'Geova',
  titolo: 'Ciò che Geova vede e fa',
  descrizione:
    'Consegna il nemico nelle mani di una donna, come avevi annunciato, e ispira il canto che la chiama benedetta.',
  fedelta:
    'Geova non viene raffigurato. Compie solo gli atti che Giudici 4 e 5 gli attribuiscono, spiegati dal libro e dalle pubblicazioni che cita: nessuna parola e nessun pensiero gli vengono attribuiti oltre a ciò che è scritto.',
  modo: 'osserva',
  stile: 'nessuno',
  durata: '8-10 minuti',
  conclusione: 'Hai ripercorso ciò che fece Geova',
  scene: [
    {
      id: 'geova-tenda',
      titolo: 'Nelle mani di una donna',
      luogo: 'La tenda di Iael',
      ...tendaIael(1500),
      inizioX: 900,
      attori: [
        { id: 'sisera', x: 770, stile: 'sisera', verso: 1, posa: 'coperto' },
        { id: 'iael', x: 880, stile: 'iael', verso: -1 },
      ],
      ingresso: [
        {
          t: 'narra',
          titolo: 'Il punto di vista di Geova',
          testo:
            'Qui non muovi un personaggio: sposti lo sguardo sulla scena. Le azioni che compirai sono soltanto quelle che il racconto attribuisce a Geova.',
        },
        {
          t: 'narra',
          testo: 'Sisera è fuggito fino alla tenda di Iael, la moglie di Heber il chenita. Ora dorme.',
          certezza: 'scritto',
          fonti: [b('Giudici', 4, '17-21')],
        },
      ],
      punti: [
        {
          id: 'tenda',
          x: 760,
          tipo: 'osserva',
          etichetta: 'La tenda di Iael',
          passi: [det('si-servi')],
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
            det('uguali'),
            det('guida'),
            senti('g-donna'),
          ],
        },
      ],
    },
    {
      id: 'geova-canto',
      titolo: 'Un canto ispirato',
      luogo: 'Quel giorno',
      ...festa(2000),
      inizioX: 400,
      folle: [
        { x0: 760, x1: 1000, n: 7, seme: 131, donne: 0.7, gruppo: 'danza' },
        { x0: 1100, x1: 1650, n: 9, seme: 133, donne: 0.4, bimbi: 0.2, comportamento: 'vaga' },
      ],
      ingresso: [
        {
          t: 'narra',
          testo: 'Debora e Barac intonano un canto di vittoria. Nel canto, Iael viene chiamata benedetta fra le donne.',
          certezza: 'scritto',
          fonti: [b('Giudici', 5, '1'), b('Giudici', 5, '24')],
        },
      ],
      punti: [
        {
          id: 'canto',
          x: 600,
          tipo: 'agisci',
          etichetta: 'Ispira il canto',
          passi: [
            det('ispirato'),
            { t: 'verso', id: 'gdc-5-31', evidenzia: ['quelli che ti amano siano come il sole che sorge nella sua gloria'] },
            senti('g-nemici'),
          ],
        },
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
  ],
  epilogo: [],
};
