import type { Passo, Ruolo } from '@/contenuti/tipi';
import { F, b } from './base';
import { ararat, arcaDentro, cantiere, mondo } from './scenari';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });

/**
 * Il punto di vista di Noè: giusto in un mondo violento, costruttore dell’arca e
 * predicatore di giustizia, fino all’altare dopo il diluvio (Genesi 6–8; Ebrei 11:7;
 * 2 Pietro 2:5). Non gli vengono attribuite parole: la Bibbia non ne riporta in questi capitoli.
 */
export const noe: Ruolo = {
  id: 'noe',
  nome: 'Noè',
  titolo: 'L’uomo giusto che condannò il mondo',
  descrizione:
    'Resta integro in un mondo pieno di violenza, costruisci l’arca e avverti le persone, e dopo più di un anno nell’arca offri un sacrificio a Geova.',
  fedelta:
    'Genesi 6:1–8:22, Ebrei 11:7 e 2 Pietro 2:5, come li spiega il capitolo 2 del libro con le pubblicazioni che cita. La situazione in cui scegli è una ricostruzione dichiarata; a Noè non vengono attribuite parole.',
  modo: 'cammina',
  stile: 'noe',
  durata: '12-15 minuti',
  conclusione: 'Hai vissuto il racconto nei panni di Noè',
  scene: [
    {
      id: 'noe-mondo',
      titolo: 'Un mondo rovinato',
      luogo: 'Prima del diluvio',
      ...mondo(2400),
      inizioX: 200,
      folle: [
        { x0: 900, x1: 1200, n: 6, seme: 201, armati: 0.6, gruppo: 'rissa' },
        { x0: 1500, x1: 2100, n: 10, seme: 203, donne: 0.4, comportamento: 'vaga' },
      ],
      ingresso: [
        {
          t: 'narra',
          titolo: 'Sei Noè',
          testo: 'Sei Noè, pronipote di Enoc. Cerca gli indizi intorno a te: alcune cose non hanno un segnale, ma luccicano quando ti avvicini.',
          certezza: 'libro',
          fonti: [F.libro],
        },
      ],
      punti: [
        { id: 'violenza', x: 1050, tipo: 'esamina', etichetta: 'Una rissa', passi: [det('violenza')] },
        {
          id: 'giusto',
          x: 1700,
          tipo: 'medita',
          etichetta: 'Che cosa dice Dio di te',
          richiede: ['violenza'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'completa',
                id: 'giusto',
                consegna: 'Così la Bibbia presenta Noè. Completa il versetto.',
                verso: 'gen-6-9',
                testo: 'Questa è la storia di Noè. Noè fu un uomo [[giusto]]. Si dimostrò [[integro]] tra i suoi contemporanei. Noè [[camminò]] con il vero Dio. Generò tre figli: Sem, Cam e Iàfet.',
                distrattori: ['ricco', 'famoso', 'parlò'],
              },
            },
            det('integro'),
            senti('n-integro'),
          ],
        },
      ],
    },
    {
      id: 'noe-cantiere',
      titolo: 'L’arca prende forma',
      luogo: 'Il cantiere',
      ...cantiere(2400),
      inizioX: 250,
      folle: [
        { x0: 900, x1: 1400, n: 6, seme: 205, donne: 0.5, comportamento: 'vaga' },
        { x0: 1800, x1: 2150, n: 7, seme: 207, comportamento: 'vaga' },
      ],
      ingresso: [
        {
          t: 'narra',
          testo: 'Dio ti ha detto che porterà un diluvio e che devi costruire un’arca per salvare la tua famiglia.',
          certezza: 'scritto',
          fonti: [b('Genesi', 6, '13-18')],
        },
      ],
      punti: [
        {
          id: 'misure',
          x: 1150,
          tipo: 'leggi',
          etichetta: 'Le istruzioni di Dio',
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'associa',
                id: 'misure',
                consegna: 'Dio ti ha dato le misure in cubiti. Unisci ogni parte alla sua misura.',
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
        { id: 'anni', x: 800, tipo: 'esamina', etichetta: 'Le impalcature', passi: [det('decenni')] },
        {
          id: 'avverti',
          x: 1950,
          tipo: 'agisci',
          etichetta: 'Alcuni si fermano a guardare',
          richiede: ['anni'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'condotta',
                id: 'condotta-avverti',
                situazione: 'Mentre lavori all’arca, alcuni si fermano a guardarti e ridono di te.',
                base: [F.libro, b('2 Pietro', 2, '5')],
                opzioni: [
                  {
                    testo: 'Taci e pensi solo al lavoro.',
                    esito: 'Noè non si limitò a costruire: avvertì le persone di ciò che stava per accadere.',
                    fonti: [F.libro, b('2 Pietro', 2, '5')],
                  },
                  {
                    testo: 'Rispondi con la forza, come fanno tutti.',
                    esito: 'Era ciò che riempiva la terra: la violenza. Noè invece si dimostrò integro tra i suoi contemporanei.',
                    fonti: [b('Genesi', 6, '9'), b('Genesi', 6, '11')],
                  },
                  { testo: 'Spieghi che cosa sta per accadere e continui a lavorare.', fedele: true, dettaglio: 'predicatore' },
                ],
              },
            },
          ],
        },
        {
          id: 'cosi',
          x: 1250,
          tipo: 'medita',
          etichetta: 'Fino in fondo',
          richiede: ['avverti'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'completa',
                id: 'fece-cosi',
                consegna: 'Genesi riassume così tutto il tuo lavoro. Completa il versetto.',
                verso: 'gen-6-22',
                testo: 'E Noè fece [[tutto]] ciò che Dio gli aveva [[comandato]]. Fece proprio così.',
                distrattori: ['metà', 'chiesto'],
              },
            },
            det('condanno'),
          ],
        },
      ],
    },
    {
      id: 'noe-arca',
      titolo: 'Più di un anno nell’arca',
      luogo: 'Durante il diluvio',
      ...arcaDentro(2000),
      inizioX: 700,
      vars: { pioggiaFuori: 1 },
      attori: [
        { id: 'moglie', x: 1150, stile: 'moglie-noe', verso: -1 },
        { id: 'figlio', x: 1700, stile: 'figlio-noe', verso: -1 },
      ],
      ingresso: [
        {
          t: 'narra',
          titolo: 'Ricostruzione',
          testo:
            'La Bibbia non descrive la vita nell’arca. Questa scena si basa su ciò che ne dicono le pubblicazioni, spesso come cosa probabile. Fuori piove a dirotto.',
          ricostruzione: true,
          fonti: [F.w13, F.w01, b('Genesi', 7, '12')],
        },
      ],
      punti: [
        { id: 'travi', x: 450, tipo: 'esamina', etichetta: 'Le travi', passi: [det('fiducia'), senti('n-arca')] },
        {
          id: 'conto',
          x: 980,
          tipo: 'leggi',
          etichetta: 'Tieni il conto dei giorni',
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'associa',
                id: 'giorni',
                consegna: 'Genesi conserva i tempi del diluvio. Unisci ogni fatto al suo tempo.',
                coppie: [
                  { a: 'La pioggia', b: '«per 40 giorni e 40 notti»', fonti: [b('Genesi', 7, '12')] },
                  { a: 'Le acque sopra i monti', b: '«si alzarono di 15 cubiti»', fonti: [b('Genesi', 7, '20')] },
                  { a: 'Le acque che sommergono la terra', b: '«per 150 giorni»', fonti: [b('Genesi', 7, '24')] },
                  { a: 'Prima di aprire la finestra', b: '«Dopo 40 giorni»', fonti: [b('Genesi', 8, '6')] },
                  { a: 'Fra un volo della colomba e l’altro', b: '«altri sette giorni»', fonti: [b('Genesi', 8, '10')] },
                ],
                dettaglio: 'annotazioni',
              },
            },
          ],
        },
        {
          id: 'famiglia',
          x: 1400,
          tipo: 'agisci',
          etichetta: 'Parla con la tua famiglia',
          richiede: ['travi', 'conto'],
          passi: [det('culto')],
        },
      ],
    },
    {
      id: 'noe-ararat',
      titolo: 'Una foglia d’olivo',
      luogo: 'I monti di Ararat',
      ...ararat(false, 2000),
      inizioX: 820,
      attori: [
        { id: 'moglie', x: 700, stile: 'moglie-noe', verso: 1 },
        { id: 'figlio', x: 760, stile: 'figlio-noe', verso: 1 },
      ],
      ingresso: [
        {
          t: 'narra',
          testo: 'L’arca si è fermata sopra i monti di Ararat, e le acque continuano a calare.',
          certezza: 'scritto',
          fonti: [b('Genesi', 8, '4, 5')],
        },
      ],
      punti: [
        {
          id: 'colomba',
          x: 980,
          tipo: 'agisci',
          etichetta: 'Fa’ volare la colomba',
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'completa',
                id: 'colomba',
                consegna: 'Che cosa riporta la colomba? Completa il versetto.',
                verso: 'gen-8-10',
                testo: 'Aspettò altri [[sette]] giorni, e poi fece di nuovo volare la colomba fuori dall’arca. Verso sera la colomba tornò da lui, ed ecco che nel becco aveva una foglia fresca d’[[olivo]]! Così Noè capì che le acque erano diminuite sulla terra.',
                distrattori: ['tre', 'fico'],
              },
            },
          ],
        },
        {
          id: 'altare',
          x: 1300,
          tipo: 'agisci',
          etichetta: 'Erigi un altare',
          richiede: ['colomba'],
          passi: [
            {
              t: 'narra',
              testo: 'Uscito dall’arca, Noè erige un altare a Geova e offre olocausti di animali puri.',
              certezza: 'scritto',
              fonti: [b('Genesi', 8, '18-20')],
            },
            det('gratitudine'),
            senti('n-grato'),
          ],
        },
        { id: 'babele', x: 1700, tipo: 'medita', etichetta: 'Gli anni che verranno', richiede: ['altare'], passi: [det('babele')] },
      ],
    },
  ],
  epilogo: [],
};
