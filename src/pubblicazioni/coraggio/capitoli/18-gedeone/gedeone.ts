import type { Passo, Ruolo } from '@/contenuti/tipi';
import { F, PAROLE, b } from './base';
import { campoMadian, ofra } from './scenari';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });

/**
 * Il punto di vista di Gedeone: coraggioso e cauto (Giudici 6:11–8:23). L’angelo non
 * viene raffigurato come un personaggio: le sue parole si leggono nel versetto. Gedeone
 * fa con le sue mani ciò che il racconto dice che fece: batte il grano, prepara il dono,
 * demolisce l’altare di Baal, stende e strizza il vello, suona il corno e fracassa la giara.
 */
export const gedeone: Ruolo = {
  id: 'gedeone',
  nome: 'Gedeone',
  titolo: 'Coraggioso e cauto',
  descrizione:
    'Batti il grano di nascosto, ricevi l’incarico e il segno del fuoco, demolisci di notte l’altare di Baal, chiedi il segno del vello, attacca l’accampamento di Madian con 300 uomini e rifiuta di diventare re.',
  fedelta:
    'Giudici 6:11–7:22, 8:4-23 e 8:28, come li spiega il capitolo 18 del libro con le pubblicazioni che cita. La situazione in cui scegli è un momento che il racconto descrive.',
  modo: 'cammina',
  stile: 'gedeone',
  durata: '18-22 minuti',
  conclusione: 'Hai vissuto il racconto nei panni di Gedeone',
  scene: [
    {
      id: 'gedeone-torchio',
      titolo: 'Il grano nel torchio',
      luogo: 'Ofra, sotto il grande albero',
      ...ofra(false, 2200),
      oggetti: [
        ...ofra(false, 2200).oggetti,
        // La grande roccia su cui Gedeone mette il dono, e il fuoco che ne divampa (Giudici 6:20, 21).
        { tipo: 'roccia', x: 520, scala: 1.3 },
        { tipo: 'fuoco', x: 520, seVar: 'fuocoRoccia' },
      ],
      inizioX: 200,
      vars: { fuocoRoccia: 0 },
      ingresso: [
        {
          t: 'narra',
          titolo: 'Sei Gedeone',
          testo: 'Sei Gedeone, figlio di Ioas l’abiezerita. Cerca gli indizi intorno a te: alcune cose non hanno un segnale, ma luccicano quando ti avvicini.',
          certezza: 'scritto',
          fonti: [b('Giudici', 6, '11')],
        },
      ],
      punti: [
        { id: 'colline', x: 360, tipo: 'esamina', etichetta: 'Il campo', passi: [det('nascosti')] },
        {
          id: 'grano',
          x: 260,
          tipo: 'agisci',
          etichetta: 'Prendi il grano mietuto',
          passi: [{ t: 'fx', fx: { k: 'carico', chi: 'giocatore', cosa: 'fieno' } }],
        },
        {
          id: 'torchio',
          x: 980,
          tipo: 'agisci',
          etichetta: 'Batti il grano nel torchio',
          richiede: ['grano'],
          passi: [
            { t: 'fx', fx: { k: 'carico', chi: 'giocatore', cosa: null } },
            {
              t: 'attivita',
              a: {
                tipo: 'completa',
                id: 'torchio',
                consegna: 'Dove ti trova l’angelo, e che cosa ti dice? Completa il versetto.',
                verso: 'gdc-6-11',
                testo: 'In seguito venne l’angelo di Geova, e si sedette sotto il grande albero che era a Ofra e che apparteneva a Iòas l’abiezerita. Suo figlio Gedeone stava battendo il [[grano]] nel [[torchio]] per il vino, in modo da nasconderlo alla vista di Màdian. L’angelo di Geova gli apparve e gli disse: “Geova è con te, potente [[guerriero]]”.',
                distrattori: ['orzo', 'granaio', 'profeta'],
              },
            },
            det('cauto'),
          ],
        },
        {
          id: 'incarico',
          x: 660,
          tipo: 'ascolta',
          etichetta: 'Un incarico più grande di te',
          richiede: ['torchio'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'completa',
                id: 'piu-piccola',
                consegna: 'Come rispondi a Geova? Completa il versetto.',
                verso: 'gdc-6-15',
                testo: 'Gedeone gli rispose: “Perdonami, Geova. Come posso salvare Israele? Ecco, la mia famiglia è la più [[piccola]] di Manasse, e io sono il più [[insignificante]] della casa di mio padre”. Ma Geova gli disse: “Dato che io sarò con te, abbatterai Màdian come se fosse un uomo [[solo]]”.',
                distrattori: ['forte', 'giovane', 'esercito'],
              },
            },
            det('modesto'),
          ],
        },
        // Il segno chiesto da Gedeone: il dono e il fuoco dalla roccia (Giudici 6:17-24).
        {
          id: 'dono',
          x: 1350,
          tipo: 'agisci',
          etichetta: 'Prepara un dono',
          richiede: ['incarico'],
          passi: [
            {
              t: 'narra',
              testo: 'Chiedi all’angelo un segno e di aspettarti. Rientri in casa e prepari il dono: un capretto e del pane senza lievito.',
              certezza: 'scritto',
              fonti: [b('Giudici', 6, '17-19')],
            },
            { t: 'fx', fx: { k: 'carico', chi: 'giocatore', cosa: 'secchio' } },
            det('efa'),
          ],
        },
        {
          id: 'roccia',
          x: 560,
          tipo: 'agisci',
          etichetta: 'Metti il dono sulla roccia',
          richiede: ['dono'],
          passi: [
            { t: 'fx', fx: { k: 'carico', chi: 'giocatore', cosa: null } },
            {
              t: 'narra',
              testo: 'L’angelo ti dice di mettere la carne e il pane senza lievito sulla grande roccia e di versare il brodo. Poi li tocca con la punta del bastone.',
              certezza: 'scritto',
              fonti: [b('Giudici', 6, '20, 21')],
            },
            { t: 'fx', fx: { k: 'var', nome: 'fuocoRoccia', a: 1, dur: 0.3 } },
            { t: 'fx', fx: { k: 'attendi', dur: 2.5 } },
            {
              t: 'narra',
              testo: 'Un fuoco divampa dalla roccia e consuma la carne e il pane. L’angelo scompare.',
              certezza: 'scritto',
              fonti: [b('Giudici', 6, '21')],
            },
            { t: 'fx', fx: { k: 'var', nome: 'fuocoRoccia', a: 0, dur: 2 } },
            det('shalom'),
          ],
        },
      ],
    },
    {
      id: 'gedeone-notte',
      titolo: 'L’altare di Baal',
      luogo: 'Ofra, di notte',
      ...ofra(true, 2200, 'notte'),
      inizioX: 1300,
      vars: { altareGeova: 0 },
      // I dieci servitori che Gedeone prese con sé (Giudici 6:27).
      folle: [{ x0: 1150, x1: 1450, n: 10, seme: 301, comportamento: 'vaga' }],
      ingresso: [
        {
          t: 'narra',
          testo: 'Quella notte Geova ti dice di demolire l’altare di Baal che appartiene a tuo padre, di abbattere il palo sacro e di erigere un altare a Geova.',
          certezza: 'scritto',
          fonti: [b('Giudici', 6, '25, 26')],
        },
      ],
      punti: [
        {
          id: 'altare',
          x: 1600,
          tipo: 'agisci',
          etichetta: 'L’altare di tuo padre',
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'condotta',
                id: 'condotta-notte',
                narrata: true,
                situazione: 'Geova ti ha detto di demolire l’altare di Baal di tuo padre. Tutta la città lo adora.',
                base: [b('Giudici', 6, '25-27'), F.libro],
                opzioni: [
                  {
                    testo: 'Lasci stare: è l’altare di tuo padre.',
                    esito: 'Gedeone invece fece proprio come Geova gli aveva detto.',
                    fonti: [b('Giudici', 6, '27')],
                  },
                  {
                    testo: 'Lo fai di giorno, davanti a tutti.',
                    esito: 'Gedeone aveva troppo timore della casa di suo padre e degli uomini della città per farlo di giorno.',
                    fonti: [b('Giudici', 6, '27')],
                  },
                  { testo: 'Lo fai di notte, con dieci servitori.', fedele: true, dettaglio: 'discrezione' },
                ],
              },
            },
            senti('ge-cauto'),
          ],
        },
        {
          id: 'demolisci',
          x: 1680,
          tipo: 'agisci',
          etichetta: 'Demolisci l’altare e abbatti il palo',
          richiede: ['altare'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'ordina',
                id: 'ordini-notte',
                consegna: 'Che cosa ti ha detto di fare Geova? Metti i suoi ordini in sequenza.',
                voci: [
                  { testo: 'Prendi il secondo giovane toro di tuo padre', nota: 'Giudici 6:25' },
                  { testo: 'Demolisci l’altare di Baal', nota: 'Giudici 6:25' },
                  { testo: 'Abbatti il palo sacro che gli sta accanto', nota: 'Giudici 6:25' },
                  { testo: 'Erigi un altare a Geova con pietre disposte in fila', nota: 'Giudici 6:26' },
                  { testo: 'Offri il toro sul legno del palo sacro', nota: 'Giudici 6:26' },
                ],
                distrattori: ['Brucia la casa di tuo padre'],
                spiegazione: 'Sono gli ordini di Giudici 6:25, 26, nell’ordine in cui Geova li diede.',
              },
            },
            { t: 'fx', fx: { k: 'oggetto', id: 'baal', variante: 3 } },
            { t: 'fx', fx: { k: 'attendi', dur: 1.2 } },
          ],
        },
        {
          id: 'erigi',
          x: 1800,
          tipo: 'agisci',
          etichetta: 'Erigi l’altare a Geova',
          richiede: ['demolisci'],
          passi: [{ t: 'fx', fx: { k: 'var', nome: 'altareGeova', a: 1, dur: 1.5 } }, { t: 'fx', fx: { k: 'attendi', dur: 1 } }, det('toro')],
        },
      ],
    },
    {
      id: 'gedeone-vello',
      titolo: 'Il vello nell’aia',
      luogo: 'L’aia, di notte e al mattino',
      ...ofra(true, 2200, 'demolito'),
      oggetti: [...ofra(true, 2200, 'demolito').oggetti, { tipo: 'vello', x: 1100, id: 'vello', seVar: 'steso' }],
      // La notte sfuma nel mattino con la variabile `visione` (Giudici 6:38: «il giorno dopo si alzò di buon’ora»).
      ambiente2: 'mattino',
      inizioX: 300,
      vars: { radunati: 0, steso: 0, visione: 0 },
      folle: [{ x0: 200, x1: 800, n: 12, seme: 305, armati: 0.4, comportamento: 'vaga', seVar: 'radunati' }],
      ingresso: [
        {
          t: 'narra',
          testo: 'Madian, Amalec e gli orientali hanno unito le forze, hanno attraversato il fiume e si sono accampati nella Valle di Izreel.',
          certezza: 'scritto',
          fonti: [b('Giudici', 6, '33')],
        },
      ],
      punti: [
        {
          id: 'corno',
          x: 480,
          tipo: 'agisci',
          etichetta: 'Suona il corno',
          passi: [
            { t: 'fx', fx: { k: 'carico', chi: 'giocatore', cosa: 'corno' } },
            { t: 'fx', fx: { k: 'var', nome: 'radunati', a: 1, dur: 2 } },
            { t: 'fx', fx: { k: 'attendi', dur: 1.5 } },
            { t: 'fx', fx: { k: 'carico', chi: 'giocatore', cosa: null } },
            det('radunati'),
          ],
        },
        {
          id: 'vello',
          x: 1050,
          tipo: 'agisci',
          etichetta: 'Stendi il vello nell’aia',
          richiede: ['corno'],
          passi: [
            {
              t: 'narra',
              testo: 'Dici a Dio: se ci sarà la rugiada solo sul vello e il terreno intorno sarà asciutto, saprai che salverà Israele tramite te, come ha promesso.',
              certezza: 'scritto',
              fonti: [b('Giudici', 6, '36, 37')],
            },
            { t: 'fx', fx: { k: 'var', nome: 'steso', a: 1, dur: 0.6 } },
          ],
        },
        {
          id: 'strizza',
          x: 1160,
          tipo: 'agisci',
          etichetta: 'Al mattino, strizza il vello',
          richiede: ['vello'],
          passi: [
            { t: 'fx', fx: { k: 'var', nome: 'visione', a: 1, dur: 3 } },
            { t: 'fx', fx: { k: 'oggetto', id: 'vello', variante: 1 } },
            { t: 'fx', fx: { k: 'attendi', dur: 1.5 } },
            det('scodella'),
          ],
        },
        {
          id: 'ancora',
          x: 1300,
          tipo: 'medita',
          etichetta: 'Chiedi un’altra prova',
          richiede: ['strizza'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'completa',
                id: 'vello-asciutto',
                consegna: 'Con rispetto, chiedi un secondo segno. Completa il versetto.',
                verso: 'gdc-6-39',
                testo: 'Comunque Gedeone disse al vero Dio: “Non si accenda la tua [[ira]] contro di me, ma permettimi di chiedere ancora una cosa. Lasciami fare, ti prego, solo un’altra prova con il vello. Ti prego, fa’ che resti [[asciutto]] solo il vello e che ci sia rugiada su tutto il terreno”. Quella notte Dio fece proprio così: solo il vello rimase asciutto e su tutto il terreno ci fu la [[rugiada]].',
                distrattori: ['mano', 'bagnato', 'pioggia'],
              },
            },
            // Un’altra notte, un altro mattino.
            { t: 'fx', fx: { k: 'var', nome: 'visione', a: 0, dur: 1.5 } },
            { t: 'fx', fx: { k: 'oggetto', id: 'vello', variante: 0 } },
            { t: 'fx', fx: { k: 'attendi', dur: 1 } },
            { t: 'fx', fx: { k: 'var', nome: 'visione', a: 1, dur: 3 } },
            { t: 'fx', fx: { k: 'oggetto', id: 'vello', variante: 2 } },
            { t: 'fx', fx: { k: 'attendi', dur: 1.5 } },
            senti('ge-segni'),
          ],
        },
      ],
    },
    {
      id: 'gedeone-campo',
      titolo: '«Per Geova e per Gedeone!»',
      luogo: 'L’accampamento di Madian, di notte',
      ...campoMadian(2400),
      inizioX: 200,
      vars: { luci: 0 },
      attori: [
        { id: 'pura', x: 280, stile: 'trecento', verso: 1 },
        { id: 'soldato', x: 1460, stile: 'madianita', verso: -1 },
      ],
      folle: [
        { x0: 900, x1: 2200, n: 16, seme: 341, armati: 0.6, comportamento: 'vaga' },
        // Le torce dei 300, che compaiono tutte insieme quando le giare vanno in pezzi.
        { x0: 60, x1: 700, n: 10, seme: 343, torce: 1, comportamento: 'fermo', seVar: 'luci' },
      ],
      ingresso: [
        {
          t: 'narra',
          testo: 'Ti sono rimasti 300 uomini. Quella notte Geova ti dice: se hai paura di attaccare, scendi all’accampamento con il tuo servitore Pura e ascolta ciò che diranno.',
          certezza: 'scritto',
          fonti: [b('Giudici', 7, '8-11')],
        },
      ],
      punti: [
        {
          id: 'scendi',
          x: 420,
          tipo: 'agisci',
          etichetta: 'Scendi con Pura',
          passi: [
            { t: 'fx', fx: { k: 'vai', chi: 'pura', x: 1250, vel: 110 } },
            {
              t: 'narra',
              testo: 'Tu e Pura scendete fino ai margini dell’accampamento. Le tende coprono la pianura come uno sciame di locuste.',
              certezza: 'scritto',
              fonti: [b('Giudici', 7, '11, 12')],
            },
          ],
        },
        {
          id: 'sogno',
          x: 1320,
          tipo: 'ascolta',
          etichetta: 'Due soldati parlano',
          richiede: ['scendi'],
          passi: [
            { t: 'fx', fx: { k: 'nastro', chi: 'soldato', testo: PAROLE.spada, dur: 4.5 } },
            { t: 'fx', fx: { k: 'attendi', dur: 2 } },
            det('adora'),
          ],
        },
        {
          id: 'istruzioni',
          x: 700,
          tipo: 'leggi',
          etichetta: 'Torna dai tuoi uomini',
          richiede: ['sogno'],
          passi: [
            { t: 'fx', fx: { k: 'vai', chi: 'pura', x: 560, vel: 130 } },
            {
              t: 'attivita',
              a: {
                tipo: 'domanda',
                id: 'quando-attaccare',
                domanda: 'Dividi i 300 in tre schiere, con i corni e le giare con dentro le torce. Quando arrivate ai margini dell’accampamento?',
                opzioni: [
                  'All’alba, con la prima luce',
                  'All’inizio della veglia intermedia, subito dopo il cambio delle sentinelle',
                  'A mezzogiorno, nell’ora più calda',
                ],
                corretta: 1,
                dettaglio: 'veglia',
              },
            },
          ],
        },
        {
          id: 'attacco',
          x: 900,
          tipo: 'agisci',
          etichetta: 'Suona il corno e fracassa la giara',
          richiede: ['istruzioni'],
          passi: [
            { t: 'fx', fx: { k: 'carico', chi: 'giocatore', cosa: 'corno' } },
            { t: 'fx', fx: { k: 'var', nome: 'luci', a: 1, dur: 0.4 } },
            { t: 'fx', fx: { k: 'nastro', chi: 'giocatore', testo: PAROLE.grido, dur: 3.5 } },
            { t: 'fx', fx: { k: 'attendi', dur: 2 } },
            det('esempio'),
          ],
        },
      ],
    },
    {
      id: 'gedeone-dopo',
      titolo: 'Sarà Geova a governarvi',
      luogo: 'Dopo la vittoria',
      ...ofra(false, 2200, 'demolito'),
      inizioX: 300,
      folle: [{ x0: 900, x1: 1500, n: 12, seme: 303, comportamento: 'vaga' }],
      ingresso: [
        {
          t: 'narra',
          testo: 'Geova ha dato Madian nelle tue mani. Gli uomini d’Israele ti si radunano intorno.',
          certezza: 'scritto',
          fonti: [b('Giudici', 7, '22'), b('Giudici', 8, '22')],
        },
      ],
      punti: [
        {
          id: 'segni',
          x: 600,
          tipo: 'medita',
          etichetta: 'I segni che hai ricevuto',
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'ordina',
                id: 'segni',
                consegna: 'Geova ti ha dato più di un segno. Mettili nell’ordine in cui li hai ricevuti.',
                voci: [
                  { testo: 'Un fuoco divampa dalla roccia e consuma l’offerta', nota: 'Giudici 6:21' },
                  { testo: 'La rugiada è solo sul vello, il terreno è asciutto', nota: 'Giudici 6:38' },
                  { testo: 'Il vello è asciutto, il terreno è bagnato', nota: 'Giudici 6:40' },
                  { testo: 'Un madianita racconta il sogno del pane d’orzo', nota: 'Giudici 7:13, 14' },
                ],
                distrattori: ['Un arcobaleno nelle nuvole'],
                spiegazione: 'Geova assecondò con pazienza ogni richiesta di Gedeone, e gli diede anche un segno che non aveva chiesto.',
              },
            },
          ],
        },
        { id: 'efraim', x: 1000, tipo: 'ascolta', etichetta: 'Gli uomini di Efraim', richiede: ['segni'], passi: [det('mite')] },
        { id: 'carcor', x: 1150, tipo: 'medita', etichetta: 'I re di Madian', richiede: ['efraim'], passi: [det('catturati')] },
        {
          id: 're',
          x: 1300,
          tipo: 'agisci',
          etichetta: 'Ti chiedono di governare',
          richiede: ['carcor'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'completa',
                id: 'governare',
                consegna: 'Che cosa rispondi? Completa il versetto.',
                verso: 'gdc-8-22',
                testo: 'In seguito gli uomini d’Israele dissero a Gedeone: “Governa su di noi, tu e tuo figlio e tuo nipote, dato che ci hai salvato dalla mano di Màdian”. Ma Gedeone disse loro: “Non sarò io a governarvi, né vi governerà mio [[figlio]]. Sarà [[Geova]] a governarvi”.',
                distrattori: ['fratello', 'Efraim'],
              },
            },
            det('umile'),
          ],
        },
        { id: 'pace', x: 1700, tipo: 'medita', etichetta: 'Quarant’anni', richiede: ['re'], passi: [det('pace')] },
      ],
    },
  ],
  epilogo: [],
};
