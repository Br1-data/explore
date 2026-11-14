import type { Passo, Ruolo, Schema } from '@/contenuti/tipi';
import { VITE, b } from './base';
import { colline } from './scenari';

/** Come Genesi 5 conclude ogni vita, da Adamo a Lamec: «poi morì», tranne per Enoc. */
const POI_MORI: Schema = {
  righe: VITE.slice(0, 9).map(({ nome, nasce, muore }) => ({
    nome,
    dato: `${muore - nasce} anni`,
    formula: nome === 'Enoc' ? '«Dio lo prese»' : '«poi morì»',
    evidenza: nome === 'Enoc',
  })),
  didascalia: 'Come Genesi 5 conclude ogni vita, da Adamo a Lamec (Genesi 5:5-31).',
};

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });

const FAMIGLIA = VITE.filter((v) => ['Adamo', 'Iared', 'Enoc', 'Matusalemme', 'Lamec', 'Noè'].includes(v.nome));
const GENESI_5 = [b('Genesi', 5, '3-32')];

/**
 * Il punto di vista di Matusalemme, figlio di Enoc.
 *
 * Di lui la Bibbia dà solo nomi e numeri. Il percorso non inventa scene:
 * con la linea del tempo di Genesi 5 si scopre che cosa quei numeri rivelano.
 */
export const matusalemme: Ruolo = {
  id: 'matusalemme',
  nome: 'Matusalemme',
  titolo: 'Il figlio: i numeri di Genesi 5',
  descrizione:
    'Con la linea del tempo di Genesi 5 scopri che cosa dicono i numeri: quanti anni hai quando muore Adamo, quando tuo padre non si trova più, quando arriva il Diluvio.',
  fedelta:
    'Di Matusalemme la Bibbia riporta nomi e numeri (Genesi 5:21-27). Qui trovi solo quelli e ciò che se ne ricava con un calcolo. Che cosa provò non è scritto: le domande sono per te.',
  modo: 'cammina',
  stile: 'matusalemme',
  durata: '10-12 minuti',
  conclusione: 'Hai letto gli anni di Matusalemme',
  scene: [
    {
      id: 'matusalemme-casa',
      titolo: 'Gli anni di Genesi 5',
      luogo: 'La tenda di famiglia',
      ...colline(2900),
      inizioX: 140,
      attori: [{ id: 'enoc', x: 1800, stile: 'enoc', percorso: [1700, 2100] }],
      folle: [{ x0: 380, x1: 900, n: 4, seme: 61, donne: 0.5, bimbi: 0.5, comportamento: 'vaga' }],
      ingresso: [
        {
          t: 'narra',
          titolo: 'Sei Matusalemme',
          testo: 'Di te la Bibbia riporta nomi e numeri, nient’altro. Ma i numeri dicono molto.',
          certezza: 'scritto',
          fonti: [b('Genesi', 5, '21-27')],
        },
      ],
      punti: [
        {
          id: 'nascita',
          x: 420,
          tipo: 'leggi',
          etichetta: 'Tuo padre ha 65 anni',
          passi: [det('a-65'), senti('m-padre')],
        },
        {
          id: 'anni',
          x: 800,
          tipo: 'leggi',
          etichetta: 'I tuoi anni',
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'completa',
                id: 'completa-matusalemme',
                consegna: 'Genesi 5 riassume la tua vita in tre numeri. Rimettili al loro posto.',
                verso: 'gen-5-25',
                testo:
                  'Quanto a Matusalemme, all’età di [[187]] anni generò Làmec. Dopo la nascita di Làmec, Matusalemme visse [[782]] anni. E generò figli e figlie. L’intera vita di Matusalemme fu dunque di [[969]] anni; poi morì.',
                distrattori: ['65', '300', '365'],
              },
            },
            det('m-969'),
          ],
        },
        {
          id: 'adamo',
          x: 1150,
          tipo: 'leggi',
          etichetta: 'Il primo uomo',
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'linea',
                id: 'linea-adamo',
                consegna: 'Adamo vive 930 anni. Porta il cursore sull’anno della sua morte: quanti anni hai tu?',
                persone: FAMIGLIA,
                meta: -3096,
                fonti: GENESI_5,
                dettaglio: 'm-adamo',
              },
            },
          ],
        },
        {
          id: 'figlio',
          x: 1450,
          tipo: 'osserva',
          etichetta: 'Nasce tuo figlio Lamec',
          passi: [det('nipote'), det('lamec-fede')],
        },
        {
          id: 'padre',
          x: 1900,
          tipo: 'leggi',
          etichetta: 'Tuo padre',
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'linea',
                id: 'linea-padre',
                consegna: 'Porta il cursore sull’anno in cui tuo padre «non fu più».',
                persone: FAMIGLIA,
                meta: -3039,
                fonti: GENESI_5,
                dettaglio: 'm-300',
              },
            },
            { t: 'fx', fx: { k: 'visibile', chi: 'enoc', v: false } },
            { t: 'schema', schema: POI_MORI, intro: 'Così Genesi 5 conclude ogni vita.' },
            det('m-poi-mori'),
            det('anni-365'),
            det('m-antenati'),
            senti('m-vuoto'),
          ],
        },
        {
          id: 'noe',
          x: 2250,
          tipo: 'osserva',
          etichetta: 'Nasce tuo nipote Noè',
          richiede: ['padre'],
          passi: [det('m-lamec-parole'), det('m-noe')],
        },
        {
          id: 'diluvio',
          x: 2550,
          tipo: 'leggi',
          etichetta: 'L’ultimo dei tuoi anni',
          richiede: ['noe'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'linea',
                id: 'linea-diluvio',
                consegna: 'Porta il cursore sull’ultimo anno della tua vita.',
                persone: FAMIGLIA,
                meta: -2370,
                fonti: GENESI_5,
                dettaglio: 'm-diluvio',
              },
            },
            { t: 'verso', id: 'gen-7-6' },
            senti('m-diluvio'),
          ],
        },
        {
          id: 'silenzio',
          x: 2780,
          tipo: 'medita',
          etichetta: 'Ciò che la Bibbia non dice',
          richiede: ['diluvio'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'classifica',
                id: 'silenzio',
                consegna: 'Che cosa dice di te Genesi 5, e che cosa no?',
                categorie: ['Genesi 5 lo dice', 'Non è scritto'],
                voci: [
                  { testo: 'A che età nacque tuo figlio Lamec', cat: 0, fonti: [b('Genesi', 5, '25')] },
                  { testo: 'Che generasti figli e figlie', cat: 0, fonti: [b('Genesi', 5, '26')] },
                  { testo: 'Quanti anni vivesti in tutto', cat: 0, fonti: [b('Genesi', 5, '27')] },
                  { testo: 'Che cosa provasti quando tuo padre non si trovò più', cat: 1, fonti: [b('Genesi', 5, '21-27')] },
                  { testo: 'Se camminasti con Dio come tuo padre', cat: 1, fonti: [b('Genesi', 5, '21-27')] },
                  { testo: 'Che lavoro facevi', cat: 1, fonti: [b('Genesi', 5, '21-27')] },
                ],
                dettaglio: 'm-silenzio',
              },
            },
          ],
        },
      ],
    },
  ],
  epilogo: [],
};
