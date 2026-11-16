import type { Passo, Ruolo } from '@/contenuti/tipi';
import { F, PAROLE, b } from './base';
import {
  CAMPO,
  GOVERNO,
  HAROD,
  MATTINO,
  NOTTE,
  SUCCOT,
  TORCHIO,
  VELLO,
  palcoCampo,
  palcoGoverno,
  palcoHarod,
  palcoMattino,
  palcoNotte,
  palcoSuccot,
  palcoTorchio,
  palcoVello,
} from './racconto';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });
const io = 'gedeone';

/**
 * Il punto di vista di Gedeone: coraggioso e cauto (Giudici 6:11–8:23). Vive tutto il
 * racconto (racconto.ts) e fa con le sue mani ciò che il testo dice che fece: batte il
 * grano, porta il dono, erige l’altare, demolisce quello di Baal, suona il corno, stende e
 * strizza il vello, fracassa la giara. Il mattino dopo la notte dell’altare sta in casa:
 * la scena si guarda senza muoverlo.
 */
export const gedeone: Ruolo = {
  id: 'gedeone',
  nome: 'Gedeone',
  titolo: 'Coraggioso e cauto',
  descrizione:
    'Batti il grano di nascosto, ricevi l’incarico dall’angelo e il segno del fuoco, demolisci di notte l’altare di Baal, chiedi il segno del vello, riduci l’esercito a 300 uomini, ascolti il sogno nell’accampamento di Madian, attacchi e rifiuti di diventare re.',
  fedelta:
    'Giudici 6:11–7:22, 8:4-23 e 8:28, come li spiega il capitolo 18 del libro con le pubblicazioni che cita. Le parole sono quelle del testo; la situazione in cui scegli è un momento che il racconto descrive.',
  modo: 'cammina',
  stile: 'gedeone',
  durata: '25-30 minuti',
  conclusione: 'Hai vissuto il racconto nei panni di Gedeone',
  scene: [
    {
      id: 'gedeone-torchio',
      titolo: 'Il grano nel torchio',
      luogo: 'Ofra, sotto il grande albero',
      ...palcoTorchio(io),
      inizioX: 200,
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
            ...TORCHIO.appare(),
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
          x: 780,
          tipo: 'ascolta',
          etichetta: 'Un incarico più grande di te',
          richiede: ['torchio'],
          passi: [
            ...TORCHIO.dialogo(io),
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
              testo: 'Chiedi all’angelo un segno e di aspettarti. Rientri in casa e prepari il dono: un capretto e del pane senza lievito. Metti la carne nel cesto e il brodo nella pentola.',
              certezza: 'scritto',
              fonti: [b('Giudici', 6, '17-19')],
            },
            ...TORCHIO.dono(io),
            det('efa'),
          ],
        },
        {
          id: 'roccia',
          x: 520,
          tipo: 'agisci',
          etichetta: 'Metti il dono sulla roccia',
          richiede: ['dono'],
          passi: [
            {
              t: 'narra',
              testo: 'L’angelo ti dice di mettere la carne e il pane senza lievito sulla grande roccia e di versare il brodo. Poi stende il bastone e con la punta li tocca.',
              certezza: 'scritto',
              fonti: [b('Giudici', 6, '20, 21')],
            },
            ...TORCHIO.fuoco(io),
            {
              t: 'narra',
              testo: 'Ma Geova ti dice: «La pace sia con te. Non aver paura; non morirai».',
              certezza: 'scritto',
              fonti: [b('Giudici', 6, '23')],
            },
          ],
        },
        {
          id: 'altare',
          x: 440,
          tipo: 'agisci',
          etichetta: 'Erigi un altare a Geova',
          richiede: ['roccia'],
          passi: [...TORCHIO.altare(), det('shalom')],
        },
      ],
    },
    {
      id: 'gedeone-notte',
      titolo: 'L’altare di Baal',
      luogo: 'Ofra, di notte',
      ...palcoNotte(io),
      inizioX: 1300,
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
            ...NOTTE.demolisci(io),
            det('tagliatore'),
          ],
        },
        {
          id: 'erigi',
          x: 1800,
          tipo: 'agisci',
          etichetta: 'Erigi l’altare a Geova',
          richiede: ['demolisci'],
          passi: [...NOTTE.erigi(io), det('toro')],
        },
      ],
    },
    {
      id: 'gedeone-mattino',
      titolo: '«Porta fuori tuo figlio!»',
      luogo: 'Ofra, il mattino dopo: sei in casa',
      ...palcoMattino(io),
      // Gedeone è in casa: si guarda la scena senza muoverlo (Giudici 6:30).
      modo: 'osserva',
      inizioX: 1600,
      ingresso: [
        {
          t: 'narra',
          testo: 'Al mattino gli uomini della città si alzano presto e vedono l’altare di Baal demolito, il palo sacro abbattuto e il toro offerto sul nuovo altare. Tu sei in casa.',
          certezza: 'scritto',
          fonti: [b('Giudici', 6, '28')],
        },
      ],
      punti: [
        { id: 'accusa', x: 1800, tipo: 'ascolta', etichetta: 'Gli uomini della città', passi: MATTINO.accusa() },
        {
          id: 'difesa',
          x: 1600,
          tipo: 'ascolta',
          etichetta: 'Tuo padre risponde',
          richiede: ['accusa'],
          passi: [...MATTINO.difesa(io), det('contenda'), senti('ge-padre')],
        },
      ],
    },
    {
      id: 'gedeone-vello',
      titolo: 'Il vello nell’aia',
      luogo: 'L’aia, di notte e al mattino',
      ...palcoVello(io),
      inizioX: 300,
      ingresso: [
        {
          t: 'narra',
          testo: 'Madian, Amalec e gli orientali hanno unito le forze, hanno attraversato il fiume e si sono accampati nella Valle di Izreel.',
          certezza: 'scritto',
          fonti: [b('Giudici', 6, '33')],
        },
      ],
      punti: [
        { id: 'corno', x: 480, tipo: 'agisci', etichetta: 'Suona il corno', passi: [...VELLO.corno(io), det('radunati')] },
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
            ...VELLO.stendi(io),
          ],
        },
        {
          id: 'strizza',
          x: 1160,
          tipo: 'agisci',
          etichetta: 'Al mattino, strizza il vello',
          richiede: ['vello'],
          passi: [...VELLO.rugiada(), det('scodella')],
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
            ...VELLO.asciutto(),
            senti('ge-segni'),
          ],
        },
      ],
    },
    {
      id: 'gedeone-harod',
      titolo: 'Troppi uomini',
      luogo: 'La sorgente di Harod',
      ...palcoHarod(io),
      inizioX: 400,
      ingresso: [
        {
          t: 'narra',
          testo: 'Ti sei alzato presto e ti sei accampato presso la sorgente di Harod con tutti quelli che hanno risposto alla chiamata. L’accampamento di Madian è a nord, nella pianura.',
          certezza: 'scritto',
          fonti: [b('Giudici', 7, '1')],
        },
      ],
      punti: [
        { id: 'pianura', x: 1850, tipo: 'esamina', etichetta: 'La pianura', passi: [det('quattro-volte')] },
        {
          id: 'annuncio',
          x: 620,
          tipo: 'agisci',
          etichetta: 'Fai l’annuncio',
          richiede: ['pianura'],
          passi: [
            {
              t: 'narra',
              testo: 'Geova ti dice che hai troppi uomini con te: Israele potrebbe vantarsi di essersi salvato da solo. Ti dice di annunciare che chi ha paura torni a casa.',
              certezza: 'scritto',
              fonti: [b('Giudici', 7, '2, 3')],
            },
            ...HAROD.annuncio(io),
          ],
        },
        {
          id: 'acqua',
          x: 1100,
          tipo: 'agisci',
          etichetta: 'Fai scendere gli uomini all’acqua',
          richiede: ['annuncio'],
          passi: [
            {
              t: 'narra',
              testo: '«Sono ancora troppi», ti dice Geova. All’acqua li metterà alla prova per te: verrà con te chi si porta l’acqua con la mano alla bocca, non chi si inginocchia per bere.',
              certezza: 'scritto',
              fonti: [b('Giudici', 7, '4-6')],
            },
            ...HAROD.acqua(),
            {
              t: 'narra',
              testo: 'Geova ti dice: vi salverò tramite i 300 uomini che hanno leccato l’acqua dalla mano. Gli altri tornino a casa.',
              certezza: 'scritto',
              fonti: [b('Giudici', 7, '7')],
            },
          ],
        },
        {
          id: 'conta',
          x: 1300,
          tipo: 'medita',
          etichetta: 'Come Geova ha ridotto l’esercito',
          richiede: ['acqua'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'ordina',
                id: 'riduzione',
                consegna: 'Rimetti in ordine come si è ridotto il tuo esercito. Una cosa non è successa: scartala.',
                voci: [
                  { testo: 'Annunci: «Chi ha paura e trema torni a casa»', nota: 'Giudici 7:3' },
                  { testo: 'In 22.000 tornano a casa; ne restano 10.000', nota: 'Giudici 7:3' },
                  { testo: 'Fai scendere gli uomini all’acqua', nota: 'Giudici 7:4, 5' },
                  { testo: 'In 300 si portano l’acqua con la mano alla bocca', nota: 'Giudici 7:6' },
                  { testo: 'Gli altri tornano a casa; i 300 prendono le provviste e i corni', nota: 'Giudici 7:8' },
                ],
                distrattori: ['Scegli i più forti per la battaglia'],
                spiegazione: 'È la sequenza di Giudici 7:3-8. A scegliere fu Geova, non la forza degli uomini.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'gedeone-campo',
      titolo: '«Per Geova e per Gedeone!»',
      luogo: 'L’accampamento di Madian, di notte',
      ...palcoCampo(io),
      inizioX: 300,
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
            ...CAMPO.scendi(io),
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
          passi: [...CAMPO.sogno(io), det('adora')],
        },
        {
          id: 'istruzioni',
          x: 520,
          tipo: 'leggi',
          etichetta: 'Torna dai tuoi uomini',
          richiede: ['sogno'],
          passi: [
            ...CAMPO.ritorno(io),
            { t: 'fx', fx: { k: 'nastro', chi: 'giocatore', testo: PAROLE.alzatevi, dur: 4.5 } },
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
            { t: 'fx', fx: { k: 'nastro', chi: 'giocatore', testo: PAROLE.guardate, dur: 4 } },
            { t: 'fx', fx: { k: 'carico', chi: 'giocatore', cosa: 'giara' } },
            ...CAMPO.schierati(),
          ],
        },
        {
          id: 'attacco',
          x: 620,
          tipo: 'agisci',
          etichetta: 'Suona il corno e fracassa la giara',
          richiede: ['istruzioni'],
          passi: [...CAMPO.attacco(io), det('esempio')],
        },
      ],
    },
    {
      id: 'gedeone-succot',
      titolo: 'Stanchi, ma avanti',
      luogo: 'Oltre il Giordano, a Succot',
      ...palcoSuccot(io),
      inizioX: 300,
      ingresso: [
        {
          t: 'narra',
          testo: 'Hai attraversato il Giordano con i tuoi 300 uomini: siete stanchi, ma continuate a inseguire Zeba e Zalmunna, i re di Madian.',
          certezza: 'scritto',
          fonti: [b('Giudici', 8, '4, 5')],
        },
      ],
      punti: [
        { id: 'efraim', x: 700, tipo: 'ascolta', etichetta: 'Gli uomini di Efraim', passi: [det('mite')] },
        { id: 'pane', x: 1250, tipo: 'agisci', etichetta: 'Chiedi pane per i tuoi uomini', richiede: ['efraim'], passi: SUCCOT.pane(io) },
        { id: 'carcor', x: 1750, tipo: 'medita', etichetta: 'I re di Madian', richiede: ['pane'], passi: [det('catturati')] },
      ],
    },
    {
      id: 'gedeone-dopo',
      titolo: 'Sarà Geova a governarvi',
      luogo: 'Dopo la vittoria',
      ...palcoGoverno(io),
      inizioX: 300,
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
        {
          id: 're',
          x: 1250,
          tipo: 'agisci',
          etichetta: 'Ti chiedono di governare',
          richiede: ['segni'],
          passi: [
            ...GOVERNO.richiesta(),
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
            ...GOVERNO.risposta(io),
            det('umile'),
          ],
        },
        { id: 'pace', x: 1700, tipo: 'medita', etichetta: 'Quarant’anni', richiede: ['re'], passi: [det('pace')] },
      ],
    },
  ],
  epilogo: [],
};
