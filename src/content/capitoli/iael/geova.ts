import type { Passo, Ruolo } from '../../tipi';
import { b } from './base';
import { pianura, tendaIael, villaggio } from './scenari';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });

/**
 * Il punto di vista di Geova.
 *
 * Geova non viene raffigurato e non gli vengono attribuite parole o pensieri oltre
 * al testo. Chi gioca sposta lo sguardo e compie soltanto gli atti che Giudici 4 e 5
 * e il libro attribuiscono a Geova: dà Israele in mano a Iabin, ispira la profezia,
 * va davanti a Barac, getta nello scompiglio Sisera, lo consegna nelle mani di una
 * donna, sottomette Iabin, ispira il canto.
 */
export const geova: Ruolo = {
  id: 'geova',
  nome: 'Geova',
  titolo: 'Ciò che Geova vede e fa',
  descrizione:
    'Guarda Israele oppresso, rispondi al suo grido, interveni presso le acque di Meghiddo e consegna il nemico nelle mani di una donna, come avevi annunciato.',
  fedelta:
    'Geova non viene raffigurato. Compie solo gli atti che Giudici 4 e 5 gli attribuiscono, spiegati dal libro e dalle pubblicazioni che cita: nessuna parola e nessun pensiero gli vengono attribuiti oltre a ciò che è scritto.',
  modo: 'osserva',
  stile: 'nessuno',
  durata: '12-15 minuti',
  conclusione: 'Hai ripercorso ciò che fece Geova',
  scene: [
    {
      id: 'geova-oppressione',
      titolo: 'Venti anni',
      luogo: 'Israele sotto Iabin, re di Canaan',
      ...villaggio(2400),
      inizioX: 700,
      folle: [
        { x0: 1300, x1: 1420, n: 5, seme: 61, gruppo: 'invoca' },
        { x0: 1780, x1: 1960, n: 4, seme: 63, donne: 0.5, bimbi: 0.25 },
      ],
      ingresso: [
        {
          t: 'narra',
          titolo: 'Il punto di vista di Geova',
          testo:
            'Qui non muovi un personaggio: sposti lo sguardo sul paese. Le azioni che compirai sono soltanto quelle che il racconto attribuisce a Geova.',
        },
        {
          t: 'narra',
          testo: 'Dopo la morte di Eud, gli israeliti hanno ricominciato a fare ciò che è male agli occhi di Geova.',
          certezza: 'scritto',
          fonti: [b('Giudici', 4, '1')],
        },
      ],
      punti: [
        {
          id: 'mani',
          x: 860,
          tipo: 'leggi',
          etichetta: 'In mano a Iabin',
          passi: [{ t: 'verso', id: 'gdc-4-2', evidenzia: ['Geova li diede dunque in mano a Iàbin', 'implorarono Geova'] }],
        },
        {
          id: 'dei',
          x: 1360,
          tipo: 'esamina',
          etichetta: 'Nuovi dèi',
          passi: [det('nuovi-dei')],
        },
        {
          id: 'grido',
          x: 1870,
          tipo: 'ascolta',
          etichetta: 'Il popolo implora aiuto',
          richiede: ['mani'],
          passi: [det('disposti'), senti('g-scelta')],
        },
        {
          id: 'profezia',
          x: 2120,
          tipo: 'agisci',
          etichetta: 'Ispira Debora a profetizzare',
          richiede: ['grido', 'dei'],
          passi: [det('una-donna')],
        },
      ],
    },
    {
      id: 'geova-chison',
      titolo: 'Presso le acque di Meghiddo',
      luogo: 'La pianura del Chison, sotto il monte Tabor',
      ...pianura(2800),
      inizioX: 640,
      vars: { pioggia: 0 },
      folle: [
        { x0: 300, x1: 760, n: 11, seme: 65, armati: 0.6, comportamento: 'vaga' },
        { x0: 1150, x1: 2150, n: 14, seme: 67, armati: 0.9, comportamento: 'vaga' },
      ],
      ingresso: [
        {
          t: 'narra',
          testo:
            'È il giorno della battaglia. Barac è sul monte Tabor con 10.000 uomini; presso il torrente Chison c’è Sisera con tutti i suoi carri.',
          certezza: 'scritto',
          fonti: [b('Giudici', 4, '10'), b('Giudici', 4, '13, 14')],
        },
      ],
      punti: [
        {
          id: 'davanti',
          x: 600,
          tipo: 'agisci',
          etichetta: 'Va’ davanti a Barac',
          passi: [{ t: 'verso', id: 'gdc-4-14', evidenzia: ['Geova non sta forse andando davanti a te?'] }],
        },
        {
          id: 'scompiglio',
          x: 1500,
          tipo: 'agisci',
          etichetta: 'Getta nello scompiglio l’esercito di Sisera',
          richiede: ['davanti'],
          passi: [{ t: 'fx', fx: { k: 'var', nome: 'pioggia', a: 1, dur: 3 } }, det('stelle'), det('chison')],
        },
        {
          id: 'merito',
          x: 1900,
          tipo: 'leggi',
          etichetta: 'Chi fa che cosa',
          richiede: ['scompiglio'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'classifica',
                id: 'chi-agisce',
                consegna: 'Nel racconto alcune cose le fa Geova, altre il suo popolo. Metti ognuna al suo posto.',
                categorie: ['Lo fa Geova', 'Lo fa il popolo'],
                voci: [
                  { testo: 'Fa ciò che è male agli occhi di Geova', cat: 1, fonti: [b('Giudici', 4, '1')] },
                  { testo: 'Dà il popolo in mano a Iabin', cat: 0, fonti: [b('Giudici', 4, '2')] },
                  { testo: 'Implora aiuto', cat: 1, fonti: [b('Giudici', 4, '3')] },
                  { testo: 'Si sceglie nuovi dèi', cat: 1, fonti: [b('Giudici', 5, '8')] },
                  { testo: 'Promette di dare Sisera in mano a Barac', cat: 0, fonti: [b('Giudici', 4, '6, 7')] },
                  { testo: 'Si offre spontaneamente', cat: 1, fonti: [b('Giudici', 5, '2')] },
                  { testo: 'Va davanti a Barac', cat: 0, fonti: [b('Giudici', 4, '14')] },
                  { testo: 'Getta nello scompiglio l’esercito nemico', cat: 0, fonti: [b('Giudici', 4, '15')] },
                ],
                dettaglio: 'merito',
              },
            },
          ],
        },
        {
          id: 'meghiddo',
          x: 2400,
          tipo: 'medita',
          etichetta: 'Un nome per il futuro',
          richiede: ['merito'],
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
      ],
    },
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
        {
          id: 'sottometti',
          x: 1100,
          tipo: 'agisci',
          etichetta: 'Sottometti Iabin',
          richiede: ['consegna'],
          passi: [{ t: 'verso', id: 'gdc-4-23' }],
        },
        {
          id: 'canto',
          x: 1260,
          tipo: 'agisci',
          etichetta: 'Ispira il canto',
          richiede: ['sottometti'],
          passi: [
            det('ispirato'),
            { t: 'verso', id: 'gdc-5-31', evidenzia: ['quelli che ti amano siano come il sole che sorge nella sua gloria'] },
            senti('g-nemici'),
          ],
        },
        {
          id: 'salmo',
          x: 380,
          tipo: 'medita',
          etichetta: 'Secoli dopo',
          richiede: ['canto'],
          passi: [{ t: 'verso', id: 'sal-83-9', evidenzia: ['come facesti a Sìsera e a Iàbin'] }, det('fede-rafforzata')],
        },
      ],
    },
  ],
  epilogo: [],
};
