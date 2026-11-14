import type { Passo, Ruolo } from '@/contenuti/tipi';
import { b } from './base';
import { pianura, villaggio } from './scenari';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });

/**
 * Il punto di vista di Geova.
 *
 * Geova non viene raffigurato e non gli vengono attribuite parole o pensieri oltre
 * al testo. Chi gioca sposta lo sguardo e compie soltanto gli atti che Giudici 4 e 5
 * e il libro attribuiscono a Geova: dà Israele in mano a Iabin, ascolta il grido del
 * popolo, comanda tramite Debora, va davanti a Barac, getta nello scompiglio Sisera,
 * sottomette Iabin.
 */
export const geova: Ruolo = {
  id: 'geova',
  nome: 'Geova',
  titolo: 'Ciò che Geova vede e fa',
  descrizione:
    'Guarda Israele oppresso, rispondi al suo grido, manda il tuo comando tramite Debora e interveni presso il torrente Chison.',
  fedelta:
    'Geova non viene raffigurato. Compie solo gli atti che Giudici 4 e 5 gli attribuiscono, spiegati dal libro e dalle pubblicazioni che cita: nessuna parola e nessun pensiero gli vengono attribuiti oltre a ciò che è scritto.',
  modo: 'osserva',
  stile: 'nessuno',
  durata: '10-12 minuti',
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
          id: 'comanda',
          x: 2120,
          tipo: 'agisci',
          etichetta: 'Manda il tuo comando tramite Debora',
          richiede: ['grido', 'dei'],
          passi: [
            {
              t: 'narra',
              testo:
                'Tramite la profetessa Debora, Geova comanda a Barac di radunare 10.000 uomini sul monte Tabor, e promette di dargli in mano Sisera.',
              certezza: 'scritto',
              fonti: [b('Giudici', 4, '6, 7')],
            },
            det('una-donna'),
          ],
        },
      ],
    },
    {
      id: 'geova-chison',
      titolo: 'Presso il torrente Chison',
      luogo: 'La pianura sotto il monte Tabor',
      ...pianura(2800),
      inizioX: 640,
      vars: { pioggia: 0 },
      folle: [
        { x0: 300, x1: 760, n: 11, seme: 65, armati: 0.4, comportamento: 'vaga' },
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
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'trova',
                id: 'tre-attribuzioni',
                consegna: 'In questi due versetti la vittoria viene attribuita a Geova tre volte. Tocca le tre frasi.',
                rif: 'Giudici 4:14, 15',
                testo:
                  'Debora disse ora a Bàrac: “Va’, perché questo è il giorno in cui [[Geova ti darà in mano Sìsera]]. [[Geova non sta forse andando davanti a te?]]” E Bàrac scese dal monte Tàbor alla testa dei 10.000 uomini. Allora [[Geova gettò nello scompiglio Sìsera]], tutti i suoi carri da guerra e tutto l’esercito, consegnandoli alla spada di Bàrac. Infine Sìsera saltò giù dal carro e fuggì a piedi.',
                spiegazione: 'Il racconto lo dice prima che la battaglia cominci e mentre si combatte.',
                dettaglio: 'tre-volte',
              },
            },
          ],
        },
        {
          id: 'scompiglio',
          x: 1500,
          tipo: 'agisci',
          etichetta: 'Getta nello scompiglio l’esercito di Sisera',
          richiede: ['davanti'],
          passi: [
            { t: 'fx', fx: { k: 'var', nome: 'pioggia', a: 1, dur: 3 } },
            {
              t: 'attivita',
              a: {
                tipo: 'completa',
                id: 'stelle',
                consegna: 'Debora e Barac canteranno questo momento. Completa le parole del canto.',
                verso: 'gdc-5-20',
                testo:
                  'Dal cielo combatterono le [[stelle]], dalle loro orbite combatterono contro Sìsera. Il Chìson li [[spazzò]] via, l’antico torrente, il torrente Chìson. Calpestasti i [[forti]], anima mia.',
                distrattori: ['nubi', 'portò', 'carri'],
              },
            },
            det('stelle'),
            det('chison'),
          ],
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
          id: 'volontari',
          x: 2150,
          tipo: 'medita',
          etichetta: 'Diecimila volontari',
          richiede: ['merito'],
          passi: [det('sforzi'), senti('g-sforzi')],
        },
        {
          id: 'sottometti',
          x: 2450,
          tipo: 'agisci',
          etichetta: 'Sottometti Iabin',
          richiede: ['volontari'],
          passi: [{ t: 'verso', id: 'gdc-4-23', evidenzia: ['Dio sottomise Iàbin'] }],
        },
      ],
    },
  ],
  epilogo: [],
};
