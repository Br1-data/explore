import type { Passo, Ruolo } from '@/contenuti/tipi';
import { F, b } from './base';
import { INGRESSO, PATTO, USCITA, palcoIngresso, palcoPatto, palcoUscita } from './racconto';
import { arcaDentro, cantiere, mondo } from './scenari';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });
const io = 'noe';

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
    'Resta integro in un mondo pieno di violenza, costruisci l’arca e avverti le persone, entra con la tua famiglia prima che Geova chiuda la porta e, dopo più di un anno, esci a offrire un sacrificio e ricevi il patto dell’arcobaleno.',
  fedelta:
    'Genesi 6:1–8:22; 9:8-19, Ebrei 11:7 e 2 Pietro 2:5, come li spiega il capitolo 2 del libro con le pubblicazioni che cita (e Perspicacia alle voci «Arca», «Corvo» e «Patto»). La scelta nel cantiere e la vita nell’arca sono ricostruzioni dichiarate; a Noè non vengono attribuite parole.',
  modo: 'cammina',
  stile: 'noe',
  durata: '18-22 minuti',
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
        // Costruire con le proprie mani: il legname, poi lo scafo (Genesi 6:14). L’arca cambia aspetto.
        {
          id: 'legname',
          x: 470,
          tipo: 'agisci',
          etichetta: 'Prendi il legname',
          richiede: ['misure'],
          passi: [{ t: 'fx', fx: { k: 'carico', chi: 'giocatore', cosa: 'tavole' } }, det('cipresso')],
        },
        {
          id: 'scafo',
          x: 980,
          tipo: 'agisci',
          etichetta: 'Costruisci lo scafo',
          richiede: ['legname'],
          passi: [
            { t: 'fx', fx: { k: 'carico', chi: 'giocatore', cosa: null } },
            { t: 'fx', fx: { k: 'oggetto', id: 'arca', variante: 3 } },
            { t: 'fx', fx: { k: 'attendi', dur: 0.8 } },
            det('impresa'),
          ],
        },
        { id: 'anni', x: 760, tipo: 'esamina', etichetta: 'I segni di anni di lavoro', passi: [det('decenni')] },
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
      id: 'noe-ingresso',
      titolo: 'La porta si chiude',
      luogo: 'Il giorno del diluvio',
      ...palcoIngresso(io),
      inizioX: 1600,
      ingresso: [
        {
          t: 'narra',
          testo: 'Dio ti ha detto di entrare nell’arca con tutta la tua famiglia: fra sette giorni farà piovere sulla terra.',
          certezza: 'scritto',
          fonti: [b('Genesi', 7, '1, 4')],
        },
      ],
      punti: [
        {
          id: 'comando',
          x: 1500,
          tipo: 'leggi',
          etichetta: 'Quali animali prendere',
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'completa',
                id: 'animali-puri',
                consegna: 'Quanti esemplari di ogni animale? Completa le istruzioni di Dio.',
                verso: 'gen-7-2',
                testo:
                  'Di ogni animale puro devi prendere [[sette]] esemplari, il maschio e la sua compagna, mentre di ogni animale che non è puro solo [[due]], il maschio e la sua compagna. Anche di ogni creatura alata dei cieli devi prendere sette esemplari, maschio e femmina, perché la loro [[progenie]] sia conservata in vita su tutta la terra.',
                distrattori: ['dodici', 'cinque', 'ricchezza'],
              },
            },
            det('specie'),
          ],
        },
        {
          id: 'entra',
          x: 1180,
          tipo: 'agisci',
          etichetta: 'Entra con la tua famiglia',
          richiede: ['comando'],
          passi: [
            det('otto'),
            ...INGRESSO.entrano(io),
            {
              t: 'narra',
              testo: 'Entri nell’arca con tua moglie, i tuoi figli Sem, Cam e Iafet e le loro mogli.',
              certezza: 'scritto',
              fonti: [b('Genesi', 7, '13')],
            },
            // Non sei tu a chiudere la porta.
            ...INGRESSO.porta(),
            { t: 'narra', testo: 'Poi Geova chiude la porta dietro di te.', certezza: 'scritto', fonti: [b('Genesi', 7, '16')] },
            senti('n-porta'),
            // La pioggia, poi l’acqua che sale e solleva l’arca.
            ...INGRESSO.pioggia(),
            ...INGRESSO.acqua(),
            det('cassa'),
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
      // Noè e la sua famiglia sono ancora dentro l’arca: da qui fa volare gli uccelli e
      // toglie una parte del tetto. Si esce solo quando Dio lo dice (Genesi 8:6-18).
      ...palcoUscita(),
      inizioX: 700,
      ingresso: [
        {
          t: 'narra',
          testo: 'L’arca si è fermata sopra i monti di Ararat, e le acque continuano a calare. Tu e la tua famiglia siete ancora dentro l’arca.',
          certezza: 'scritto',
          fonti: [b('Genesi', 8, '4, 5')],
        },
      ],
      punti: [
        {
          id: 'corvo',
          x: 760,
          tipo: 'agisci',
          etichetta: 'Apri la finestra: fa’ volare il corvo',
          passi: [
            ...USCITA.corvo(),
            {
              t: 'narra',
              testo: 'Apri la finestra dell’arca e fai volare fuori un corvo. Il corvo va e torna, finché le acque sulla terra non si asciugano.',
              certezza: 'scritto',
              fonti: [b('Genesi', 8, '6, 7')],
            },
            det('corvo'),
          ],
        },
        {
          id: 'colomba',
          x: 940,
          tipo: 'agisci',
          etichetta: 'Fa’ volare la colomba',
          richiede: ['corvo'],
          passi: [
            ...USCITA.colomba(),
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
            ...USCITA.foglia(),
          ],
        },
        {
          id: 'tetto',
          x: 420,
          tipo: 'agisci',
          etichetta: 'Togli una parte del tetto',
          richiede: ['colomba'],
          passi: [
            ...USCITA.tetto(),
            {
              t: 'narra',
              testo: 'Nel 601º anno, il primo giorno del primo mese, togli una parte del tetto dell’arca: la superficie del suolo si sta asciugando.',
              certezza: 'scritto',
              fonti: [b('Genesi', 8, '13')],
            },
            det('ararat'),
          ],
        },
        {
          id: 'esci',
          x: 620,
          tipo: 'ascolta',
          etichetta: 'Dio ti dice di uscire',
          richiede: ['tetto'],
          passi: [
            {
              t: 'narra',
              testo: 'Quando la terra si è asciugata, Dio ti dice di uscire dall’arca con la tua famiglia e di far uscire tutti gli animali.',
              certezza: 'scritto',
              fonti: [b('Genesi', 8, '14-17')],
            },
            ...USCITA.esci(),
            det('adempiuto'),
          ],
        },
      ],
    },
    {
      id: 'noe-patto',
      titolo: 'Un patto per sempre',
      luogo: 'I monti di Ararat',
      ...palcoPatto(io),
      inizioX: 900,
      ingresso: [
        ...PATTO.arca(),
        {
          t: 'narra',
          testo: 'Sei uscito dall’arca con tua moglie, i tuoi figli e le loro mogli. Anche gli animali sono usciti, famiglia per famiglia.',
          certezza: 'scritto',
          fonti: [b('Genesi', 8, '18, 19')],
        },
      ],
      punti: [
        {
          id: 'altare',
          x: 1300,
          tipo: 'agisci',
          etichetta: 'Erigi un altare',
          passi: [
            ...PATTO.altare(),
            {
              t: 'narra',
              testo: 'Erigi un altare a Geova e offri olocausti di animali puri e di creature alate pure.',
              certezza: 'scritto',
              fonti: [b('Genesi', 8, '20')],
            },
            det('gratitudine'),
            senti('n-grato'),
          ],
        },
        {
          id: 'patto',
          x: 1050,
          tipo: 'ascolta',
          etichetta: 'Dio parla a te e ai tuoi figli',
          richiede: ['altare'],
          passi: [
            ...PATTO.arcobaleno(),
            {
              t: 'attivita',
              a: {
                tipo: 'trova',
                id: 'patto-noe',
                consegna: 'Dio stringe un patto con te e con i tuoi figli. Tocca le due cose che promette.',
                rif: 'Genesi 9:11',
                testo:
                  'Stringo con voi questo patto: [[nessun essere vivente sarà più distrutto]] dalle acque di un diluvio, e la terra [[non sarà mai più ridotta in rovina]] da un diluvio',
                spiegazione: 'Il patto non riguarda solo la tua famiglia: vale per ogni creatura vivente e per la terra (Genesi 9:10, 11).',
                dettaglio: 'per-sempre',
              },
            },
          ],
        },
        { id: 'babele', x: 1700, tipo: 'medita', etichetta: 'Gli anni che verranno', richiede: ['patto'], passi: [det('babele')] },
      ],
    },
  ],
  epilogo: [],
};
