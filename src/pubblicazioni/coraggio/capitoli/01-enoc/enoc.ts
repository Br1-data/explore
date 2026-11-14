import type { Passo, Ruolo } from '@/contenuti/tipi';
import { F, MESSAGGIO, VERSI, b } from './base';
import { altura, colline, mondo, notte, quiete, strada } from './scenari';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });

/** Il messaggio diviso nei tre momenti in cui Enoc lo proclama in strada. */
export const NASTRO = [
  'Ecco, Geova è venuto con le sue sante miriadi per eseguire il giudizio contro tutti…',
  '…e dimostrare la colpevolezza di tutti gli empi per tutte le opere empie che hanno empiamente compiuto…',
  '…e per tutte le cose offensive che gli empi peccatori hanno detto contro di lui.',
];

/**
 * Il punto di vista di Enoc.
 *
 * «Camminare con Dio» qui non è un percorso: è la condotta di Enoc. Si vede nelle
 * situazioni in cui si sceglie che cosa fare (ricostruzioni dichiarate, con la
 * condotta di Enoc presa dalle fonti), in ciò che si scopre della sua casa e
 * della sua fede, nell’incarico che porta a termine.
 */
export const enoc: Ruolo = {
  id: 'enoc',
  nome: 'Enoc',
  titolo: 'Il profeta che camminò con Dio',
  descrizione:
    'Mettiti nei suoi panni: in un mondo violento scegli come comportarti, scopri che cosa voleva dire camminare con Dio, porta un messaggio di giudizio e affronta il pericolo.',
  fedelta:
    'Genesi 5:21-24, Ebrei 11:5 e Giuda 14, 15, come li spiega il capitolo 1 del libro. Le situazioni segnate «Ricostruzione» non sono narrate: rappresentano il suo tempo come lo descrivono le fonti, e la condotta di Enoc viene sempre dalle fonti.',
  modo: 'cammina',
  stile: 'enoc',
  durata: '20-25 minuti',
  conclusione: 'Hai vissuto il racconto nei panni di Enoc',
  scene: [
    {
      id: 'enoc-mondo',
      titolo: 'Un uomo diverso',
      luogo: 'La settima generazione da Adamo',
      ...mondo(2700),
      inizioX: 140,
      folle: [
        { x0: 1080, x1: 1250, n: 5, seme: 3, armati: 0.8, gruppo: 'rissa' },
        { x0: 1420, x1: 1780, n: 6, seme: 5, donne: 0.4, bimbi: 0.15, comportamento: 'vaga' },
        { x0: 2170, x1: 2360, n: 7, seme: 7, gruppo: 'invoca' },
        { x0: 900, x1: 2600, n: 12, seme: 13, piano: 'fondo', comportamento: 'vaga' },
      ],
      zone: [{ x0: 1040, x1: 2420, tipo: 'pressione', forza: 0.3 }],
      ingresso: [
        {
          t: 'narra',
          titolo: 'Sei Enoc',
          testo: 'Sei molto diverso dai tuoi contemporanei, e sai che cosa significa sentirsi soli.',
          certezza: 'libro',
          fonti: [F.libro],
        },
      ],
      punti: [
        {
          id: 'discendenza',
          x: 380,
          tipo: 'leggi',
          etichetta: 'Da Adamo a te',
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'ordina',
                id: 'discendenza',
                consegna:
                  'Giuda ti chiama «il settimo uomo nella discendenza di Adamo». Ricostruisci la tua discendenza, da Adamo a te. Attento: tre nomi non ne fanno parte.',
                voci: [
                  { testo: 'Adamo' },
                  { testo: 'Set' },
                  { testo: 'Enos' },
                  { testo: 'Chenan' },
                  { testo: 'Maalalel' },
                  { testo: 'Iared' },
                  { testo: 'Enoc' },
                ],
                distrattori: ['Caino', 'Abele', 'Lamec'],
                spiegazione: 'Genesi 5:3-18; Giuda 14.',
              },
            },
            det('settimo'),
            det('adamo-vivo'),
          ],
        },
        {
          id: 'rissa',
          x: 990,
          tipo: 'agisci',
          etichetta: 'Una rissa davanti a te',
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'condotta',
                id: 'condotta-violenza',
                situazione:
                  'Davanti a te scoppia una rissa. Chi è stato colpito risponde colpendo più forte, e la violenza si allarga.',
                base: [F.libro, b('Genesi', 4, '23, 24')],
                opzioni: [
                  {
                    testo: 'Ti schieri anche tu: chi colpisce deve pagarla.',
                    esito:
                      'Era lo spirito del tempo. Lamec, un discendente di Caino, si vantava: «Ho ucciso un uomo perché mi aveva ferito, ho ucciso un giovane perché mi aveva colpito».',
                    fonti: [b('Genesi', 4, '23')],
                  },
                  {
                    testo: 'Lasci stare, ma ti prometti di vendicarti un’altra volta.',
                    esito: 'Così ragionava Lamec: «Se Caino dev’essere vendicato sette volte, allora Làmec settantasette volte».',
                    fonti: [b('Genesi', 4, '24')],
                  },
                  { testo: 'Resti un uomo pacifico.', fedele: true, dettaglio: 'pacifico' },
                ],
              },
            },
            senti('pacifico'),
          ],
        },
        {
          id: 'nome',
          x: 2060,
          tipo: 'agisci',
          etichetta: 'Il nome di Dio, invocato così',
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'condotta',
                id: 'condotta-nome',
                situazione:
                  'Un gruppo invoca il nome di Geova davanti a un oggetto di culto. È una consuetudine che va avanti da generazioni, e passi proprio di lì.',
                base: [b('Genesi', 4, '26'), F.w01],
                opzioni: [
                  {
                    testo: 'Ti unisci: in fondo è il nome di Dio.',
                    esito:
                      'Non era vera adorazione. La nota in calce a Genesi 4:26 dice che quell’«invocare» va inteso «evidentemente nel senso di “profanare”».',
                    fonti: [b('Genesi', 4, '26')],
                  },
                  {
                    testo: 'Resti con loro, senza partecipare.',
                    esito:
                      'Senza dubbio Enoc non stava insieme a chi profanava il nome di Geova: non erano buone compagnie per un adoratore di Dio.',
                    fonti: [F.w01],
                  },
                  { testo: 'Te ne allontani: il nome di Dio è santo.', fedele: true, dettaglio: 'rifiuto-nome' },
                ],
              },
            },
            senti('nome'),
          ],
        },
        {
          id: 'solo',
          x: 2560,
          tipo: 'medita',
          etichetta: 'Nessun altro come te',
          richiede: ['rissa', 'nome'],
          passi: [det('solo'), det('antenati'), senti('solo')],
        },
      ],
    },
    {
      id: 'enoc-casa',
      titolo: 'Camminare con Dio',
      luogo: 'Trecento anni, giorno dopo giorno',
      ...colline(2500),
      inizioX: 160,
      folle: [{ x0: 380, x1: 700, n: 5, seme: 21, donne: 0.4, bimbi: 0.6, comportamento: 'vaga' }],
      ingresso: [
        {
          t: 'narra',
          testo:
            'Della tua vita la Bibbia dice: «continuò a camminare con il vero Dio». Che cosa vuol dire? Cerca gli indizi intorno a te: alcune cose non hanno un segnale, ma luccicano quando ti avvicini.',
          certezza: 'scritto',
          fonti: [b('Genesi', 5, '22')],
        },
      ],
      punti: [
        {
          id: 'famiglia',
          x: 520,
          tipo: 'esamina',
          etichetta: 'La tua famiglia',
          passi: [
            { t: 'verso', id: 'gen-5-21', evidenzia: ['per 300 anni', 'generò figli e figlie'] },
            det('famiglia'),
            det('casa'),
            senti('famiglia'),
          ],
        },
        {
          id: 'ricordi',
          x: 1180,
          tipo: 'esamina',
          etichetta: 'Ciò che è accaduto ai tuoi antenati',
          passi: [
            {
              t: 'narra',
              testo: 'Il giardino di Eden, protetto da cherubini e da una spada fiammeggiante.',
              arte: 'eden',
              certezza: 'scritto',
              fonti: [b('Genesi', 3, '24')],
            },
            {
              t: 'narra',
              testo: 'Adamo ed Eva, invecchiati.',
              arte: 'anziani',
              certezza: 'libro',
              fonti: [F.immagineA],
            },
            {
              t: 'narra',
              testo: 'Caino, in piedi accanto al corpo di suo fratello Abele.',
              arte: 'caino-abele',
              certezza: 'scritto',
              fonti: [b('Genesi', 4, '8')],
            },
            det('eden'),
            det('adamo-info'),
          ],
        },
        {
          id: 'promessa',
          x: 1420,
          tipo: 'medita',
          etichetta: 'Una promessa fatta in Eden',
          richiede: ['ricordi'],
          passi: [
            { t: 'verso', id: 'gen-3-15' },
            det('seme'),
            det('ostilita'),
            det('conoscenza'),
            senti('medita'),
          ],
        },
        {
          id: 'preghiera',
          x: 2120,
          tipo: 'esamina',
          etichetta: 'Un luogo tranquillo',
          passi: [det('preghiera')],
        },
        {
          id: 'significa',
          x: 1800,
          tipo: 'leggi',
          etichetta: 'Che cosa vuol dire camminare con Dio',
          richiede: ['famiglia', 'promessa', 'preghiera'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'classifica',
                id: 'camminare',
                consegna: '«Camminare con il vero Dio»: che cosa significa? Metti ogni frase al suo posto.',
                categorie: ['Lo dicono le fonti', 'Non è questo'],
                voci: [
                  { testo: 'Fare un lungo cammino al fianco di Dio, come con un compagno di viaggio', cat: 1, fonti: [F.w05p(5)] },
                  { testo: 'Seguire la condotta che Dio ha tracciato e che approva', cat: 0, fonti: [F.w05p(5)] },
                  { testo: 'Rifiutarsi di adeguarsi al mondo malvagio', cat: 0, fonti: [F.libro] },
                  { testo: 'Fare ciò che Dio chiede', cat: 0, fonti: [F.libro] },
                  { testo: 'Conoscere Dio, senza che questo cambi ciò che si fa', cat: 1, fonti: [F.w01] },
                ],
                dettaglio: 'linea-condotta',
              },
            },
            det('due-modi'),
            det('amicizia'),
            senti('amicizia'),
          ],
        },
        {
          id: 'continuo',
          x: 2360,
          tipo: 'leggi',
          etichetta: '«Continuò»',
          richiede: ['significa'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'trova',
                id: 'due-volte',
                consegna: 'In questi versetti una frase è scritta due volte. Toccala entrambe le volte.',
                rif: 'Genesi 5:22-24',
                testo:
                  'Dopo la nascita di Matusalemme, Ènoc [[continuò a camminare con il vero Dio]] per 300 anni. E generò figli e figlie. L’intera vita di Ènoc fu dunque di 365 anni. Ènoc [[continuò a camminare con il vero Dio]]. Poi nessuno lo vide più, perché Dio lo prese.',
                spiegazione: 'Trovate: Genesi 5:22 e 5:24.',
              },
            },
            det('due-volte'),
            det('verbo'),
            det('familiarita'),
            senti('trecento'),
          ],
        },
      ],
    },
    {
      id: 'enoc-incarico',
      titolo: 'Un incarico speciale',
      luogo: 'Il secondo modo di camminare con Dio',
      ...altura(2000),
      inizioX: 140,
      ingresso: [
        {
          t: 'narra',
          testo:
            'C’è un secondo modo in cui cammini con Dio: fai quello che lui ti chiede. E ciò che ti chiede adesso richiede ancora più coraggio.',
          certezza: 'libro',
          fonti: [F.libro],
        },
        det('profeta'),
      ],
      punti: [
        {
          id: 'messaggio',
          x: 640,
          tipo: 'leggi',
          etichetta: 'Il messaggio',
          passi: [
            { t: 'verso', id: 'giuda-14', intro: 'Questo è il messaggio che devi portare.' },
            {
              t: 'attivita',
              a: {
                tipo: 'componi',
                id: 'componi-messaggio',
                consegna: 'Fissalo nella mente: ricomponi il messaggio nell’ordine del testo.',
                rif: VERSI['giuda-14'].rif,
                pezzi: MESSAGGIO,
              },
            },
            det('messaggio'),
            det('miriadi'),
          ],
        },
        {
          id: 'passato',
          x: 1100,
          tipo: 'leggi',
          etichetta: '«È venuto»',
          richiede: ['messaggio'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'domanda',
                id: 'tempo-profezia',
                domanda: 'Rileggi l’inizio del messaggio. In che tempo è formulata la profezia?',
                opzioni: ['Al futuro: «Geova verrà»', 'Al passato: «Geova è venuto»', 'Al presente: «Geova viene»'],
                corretta: 1,
                dettaglio: 'al-passato',
              },
            },
          ],
        },
        {
          id: 'scendere',
          x: 1560,
          tipo: 'medita',
          etichetta: 'Prima di scendere tra la gente',
          richiede: ['passato'],
          passi: [senti('incarico')],
        },
      ],
    },
    {
      id: 'enoc-strada',
      titolo: 'In una strada affollata',
      luogo: 'Persone molto diverse da te',
      ...strada(2800),
      inizioX: 150,
      vars: { agitazione: 0 },
      folle: [
        { x0: 780, x1: 1240, n: 13, seme: 31, reagisce: true, armati: 0.15, donne: 0.3, comportamento: 'vaga' },
        { x0: 1480, x1: 1980, n: 14, seme: 33, reagisce: true, armati: 0.3, donne: 0.25, comportamento: 'vaga' },
        { x0: 2220, x1: 2700, n: 15, seme: 35, reagisce: true, armati: 0.4, donne: 0.2, comportamento: 'vaga' },
        { x0: 600, x1: 2800, n: 14, seme: 37, piano: 'fondo', comportamento: 'vaga' },
      ],
      zone: [{ x0: 740, x1: 2700, tipo: 'pressione', forza: 0.3 }],
      ingresso: [
        {
          t: 'narra',
          testo:
            'Devi portare il messaggio a persone che hanno un atteggiamento e un comportamento molto diversi dai tuoi.',
          certezza: 'libro',
          fonti: [F.libro],
        },
        det('strada'),
      ],
      punti: [
        {
          id: 'parla-1',
          x: 1010,
          tipo: 'agisci',
          etichetta: 'Proclama il messaggio',
          passi: [
            { t: 'fx', fx: { k: 'posa', chi: 'giocatore', posa: 'proclama' } },
            { t: 'fx', fx: { k: 'nastro', chi: 'giocatore', testo: NASTRO[0], dur: 5 } },
            { t: 'fx', fx: { k: 'var', nome: 'agitazione', a: 0.35, dur: 2.5 } },
            { t: 'fx', fx: { k: 'posa', chi: 'giocatore', posa: 'fermo' } },
          ],
        },
        {
          id: 'parla-2',
          x: 1730,
          tipo: 'agisci',
          etichetta: 'Continua: non hai detto tutto',
          richiede: ['parla-1'],
          passi: [
            { t: 'fx', fx: { k: 'posa', chi: 'giocatore', posa: 'proclama' } },
            { t: 'fx', fx: { k: 'nastro', chi: 'giocatore', testo: NASTRO[1], dur: 5.5 } },
            { t: 'fx', fx: { k: 'var', nome: 'agitazione', a: 0.7, dur: 2.5 } },
            { t: 'fx', fx: { k: 'posa', chi: 'giocatore', posa: 'fermo' } },
            {
              t: 'attivita',
              a: {
                tipo: 'condotta',
                id: 'condotta-tutto',
                situazione: 'La folla si agita intorno a te. Ti restano da dire le parole più dure del messaggio.',
                base: [F.immagine, F.libro],
                opzioni: [
                  {
                    testo: 'Ammorbidisci le parole più dure.',
                    esito:
                      'Il messaggio era molto forte, e doveva esserlo: ripeteva quattro volte il concetto di empietà. Era quello che Geova voleva far sapere.',
                    fonti: [F.libro, b('Giuda', 1, '15')],
                  },
                  {
                    testo: 'Ti fermi qui: non è il momento.',
                    esito:
                      'Enoc aveva ricevuto un incarico da profeta: il messaggio andava portato proprio a persone come queste.',
                    fonti: [F.libro],
                  },
                  { testo: 'Dici tutto ciò che Geova vuole che sappiano.', fedele: true, dettaglio: 'non-gradite' },
                ],
              },
            },
          ],
        },
        {
          id: 'parla-3',
          x: 2490,
          tipo: 'agisci',
          etichetta: 'Di’ tutto ciò che Geova vuole che sappiano',
          richiede: ['parla-2'],
          passi: [
            { t: 'fx', fx: { k: 'posa', chi: 'giocatore', posa: 'proclama' } },
            { t: 'fx', fx: { k: 'nastro', chi: 'giocatore', testo: NASTRO[2], dur: 5 } },
            { t: 'fx', fx: { k: 'var', nome: 'agitazione', a: 1, dur: 2.5 } },
            { t: 'fx', fx: { k: 'posa', chi: 'giocatore', posa: 'fermo' } },
            senti('strada'),
          ],
        },
      ],
    },
    {
      id: 'enoc-pericolo',
      titolo: 'In grave pericolo',
      luogo: 'La Bibbia lo lascia intendere',
      ...notte(2300),
      inizioX: 420,
      folle: [
        {
          x0: 0,
          x1: 200,
          n: 9,
          seme: 43,
          armati: 0.7,
          torce: 0.5,
          comportamento: 'insegue',
          distanza: [470, 250],
        },
      ],
      ingresso: [
        {
          t: 'narra',
          testo:
            'Sembra che tu sia perseguitato dalle persone malvagie del tuo tempo. La Bibbia non descrive la scena: dice soltanto come finì.',
          certezza: 'sembra',
          fonti: [F.libro],
        },
      ],
      punti: [
        {
          id: 'minacce',
          x: 1100,
          tipo: 'agisci',
          etichetta: 'Ti seguono',
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'condotta',
                id: 'condotta-minacce',
                situazione: 'Alcuni ti seguono nel buio, con torce e bastoni. Si sentono beffe e minacce.',
                base: [F.libro, F.w01],
                opzioni: [
                  {
                    testo: 'Ritratti il messaggio, per calmarli.',
                    esito: 'Enoc non lo fece: la Bibbia conserva la sua profezia così come la pronunciò.',
                    fonti: [b('Giuda', 1, '14, 15')],
                  },
                  {
                    testo: 'Ti difendi con la violenza.',
                    esito: 'Enoc era rimasto un uomo pacifico anche quando la violenza era la norma.',
                    fonti: [F.libro],
                  },
                  { testo: 'Non ti fai intimidire.', fedele: true, dettaglio: 'come-abele' },
                ],
              },
            },
            senti('pericolo'),
          ],
        },
      ],
    },
    {
      id: 'enoc-gradito',
      titolo: 'Gradito a Dio',
      luogo: 'Prima di essere portato via',
      ...quiete(2200),
      ambiente2: 'paradiso',
      inizioX: 150,
      vars: { visione: 0, ricerca: 0 },
      folle: [
        {
          x0: 1350,
          x1: 2050,
          n: 7,
          seme: 47,
          armati: 0.6,
          torce: 0.6,
          comportamento: 'cerca',
          seVar: 'ricerca',
        },
      ],
      ingresso: [
        {
          t: 'narra',
          testo: 'Prima di portarti via, Geova ti fa un regalo speciale.',
          certezza: 'libro',
          fonti: [F.libro],
        },
      ],
      punti: [
        {
          id: 'conferma',
          x: 620,
          tipo: 'leggi',
          etichetta: 'La conferma',
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'completa',
                id: 'completa-ebrei',
                consegna: 'Che cosa dice di te la lettera agli Ebrei? Completa il versetto.',
                verso: 'ebr-11-5',
                testo:
                  'Per [[fede]] Ènoc fu portato via in modo da non vedere la [[morte]], e non fu più trovato perché Dio l’aveva portato via; infatti prima che fosse portato via ebbe la [[conferma]] di essere [[gradito]] a Dio.',
                distrattori: ['paura', 'cielo', 'forza'],
              },
            },
            det('conferma'),
          ],
        },
        {
          id: 'visione',
          x: 1300,
          tipo: 'osserva',
          etichetta: 'Ciò che ti aspetta',
          richiede: ['conferma'],
          passi: [
            {
              t: 'narra',
              testo:
                'Le Scritture non rivelano in che modo ricevi quella conferma. Forse Geova ti fa avere una visione di ciò che ti aspetta.',
              certezza: 'sembra',
              fonti: [F.libro, F.w01],
            },
            { t: 'fx', fx: { k: 'var', nome: 'visione', a: 1, dur: 5 } },
            det('visione'),
            det('sguardo'),
            senti('conferma'),
          ],
        },
        {
          id: 'occhi',
          x: 1640,
          tipo: 'agisci',
          etichetta: 'Chiudi gli occhi',
          richiede: ['visione'],
          passi: [
            { t: 'fx', fx: { k: 'posa', chi: 'giocatore', posa: 'sdraiato' } },
            { t: 'fx', fx: { k: 'attendi', dur: 1.6 } },
            det('certezza-amore'),
            { t: 'fx', fx: { k: 'dissolvi', a: 1, dur: 2.2 } },
            { t: 'fx', fx: { k: 'visibile', chi: 'giocatore', v: false } },
            { t: 'fx', fx: { k: 'var', nome: 'visione', a: 0, dur: 0 } },
            { t: 'fx', fx: { k: 'var', nome: 'ricerca', a: 1, dur: 0 } },
            { t: 'fx', fx: { k: 'camera', x: 1640, dur: 0 } },
            { t: 'fx', fx: { k: 'dissolvi', a: 0, dur: 2.2 } },
            {
              t: 'attivita',
              a: {
                tipo: 'completa',
                id: 'preso',
                consegna: 'Così Genesi ricorda la tua vita. Completa il versetto.',
                verso: 'gen-5-24',
                testo: 'Ènoc continuò a [[camminare]] con il vero Dio. Poi nessuno lo vide più, perché Dio lo [[prese]].',
                distrattori: ['lavorare', 'chiamò'],
              },
            },
          ],
        },
      ],
    },
  ],
  epilogo: [det('per-fede')],
};
