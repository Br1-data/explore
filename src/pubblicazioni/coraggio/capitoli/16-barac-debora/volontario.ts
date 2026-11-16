import type { Passo, Ruolo } from '@/contenuti/tipi';
import { F, b } from './base';
import { CHEDES, PIANURA, TABOR, palcoChedes, palcoPianura, palcoTabor } from './racconto';
import { villaggio } from './scenari';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });
const io = 'volontario';

/**
 * Il punto di vista di uno dei 10.000 uomini di Zabulon e di Neftali che seguirono
 * Barac (Giudici 4:10; 5:18). La Bibbia non dà nomi né storie personali: questo
 * personaggio non dice nulla e non fa nulla che il racconto non dica degli uomini di
 * Barac. La scelta di offrirsi è una ricostruzione dichiarata; le altre opzioni sono
 * ciò che il canto dice delle tribù rimaste lontane.
 */
export const volontario: Ruolo = {
  id: 'volontario',
  nome: 'Uno dei 10.000',
  titolo: 'Un volontario di Zabulon o di Neftali',
  descrizione:
    'Vivi nel paese oppresso da Sisera, rispondi alla chiamata di Barac e scendi nella pianura contro i carri: vedi con i tuoi occhi che cosa fa Geova.',
  fedelta:
    'Uno qualunque degli uomini che seguirono Barac: la Bibbia non ne riporta i nomi. Ciò che vede e fa è quanto Giudici 4 e 5 e le pubblicazioni dicono degli israeliti di quel tempo; la scelta di offrirsi è una ricostruzione dichiarata.',
  modo: 'cammina',
  stile: 'volontario',
  durata: '12-15 minuti',
  conclusione: 'Hai vissuto il racconto nei panni di uno dei 10.000',
  scene: [
    {
      id: 'volontario-villaggio',
      titolo: 'Il paese oppresso',
      luogo: 'Un villaggio di Israele',
      ...villaggio(2400),
      inizioX: 200,
      folle: [{ x0: 1780, x1: 1960, n: 4, seme: 121, donne: 0.5, bimbi: 0.25 }],
      ingresso: [
        {
          t: 'narra',
          titolo: 'Sei uno dei 10.000',
          testo:
            'La Bibbia non riporta il tuo nome: sei uno degli uomini di Zabulon o di Neftali. Da 20 anni Iabin e Sisera opprimono duramente Israele.',
          certezza: 'scritto',
          fonti: [b('Giudici', 4, '3'), b('Giudici', 4, '10')],
        },
        {
          t: 'narra',
          testo: 'Cerca gli indizi intorno a te: alcune cose non hanno un segnale, ma luccicano quando ti avvicini.',
        },
      ],
      punti: [
        {
          id: 'strade',
          x: 330,
          tipo: 'esamina',
          etichetta: 'La porta e la strada',
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'completa',
                id: 'strade',
                consegna: 'Il canto di Debora descriverà questi anni. Completa le sue parole.',
                verso: 'gdc-5-6',
                testo:
                  'Ai giorni di Samgàr, figlio di Anàt, ai giorni di Iàel, le strade erano [[deserte]]; si viaggiava per sentieri isolati. Non c’erano più abitanti nei [[villaggi]] d’Israele; non ce n’erano più, finché sorsi io, Debora, finché sorsi come madre in Israele. Si scelsero nuovi dèi, e allora ci fu guerra alle porte. Non si vedeva né [[scudo]] né lancia tra quarantamila in Israele.',
                distrattori: ['affollate', 'campi', 'spada'],
              },
            },
            det('paura'),
          ],
        },
        {
          id: 'campo',
          x: 1100,
          tipo: 'esamina',
          etichetta: 'Il campo',
          passi: [det('disarmati')],
        },
        {
          id: 'case',
          x: 1560,
          tipo: 'esamina',
          etichetta: 'Le case vuote',
          passi: [det('razzie')],
        },
        {
          id: 'chiamata',
          x: 2000,
          tipo: 'agisci',
          etichetta: 'La chiamata di Barac',
          richiede: ['strade', 'campo', 'case'],
          passi: [
            {
              t: 'narra',
              testo: 'Barac convoca a Chedes gli uomini di Zabulon e di Neftali.',
              certezza: 'scritto',
              fonti: [b('Giudici', 4, '10')],
            },
            {
              t: 'attivita',
              a: {
                tipo: 'condotta',
                id: 'condotta-chiamata',
                situazione: 'Barac cerca uomini per affrontare Sisera e i suoi 900 carri. Andare vuol dire rischiare la vita.',
                base: [b('Giudici', 4, '10'), b('Giudici', 5, '18'), F.w17],
                opzioni: [
                  {
                    testo: 'Resti fra le greggi ad ascoltare i flauti.',
                    esito:
                      'Così fece Ruben: il canto gli chiede perché rimase seduto fra le due bisacce ad ascoltare il suono dei flauti per le greggi.',
                    fonti: [b('Giudici', 5, '15, 16'), F.w17],
                  },
                  {
                    testo: 'Resti con le navi, presso i porti.',
                    esito: 'Così fecero Dan e Aser, più attenti ai loro interessi materiali che all’opera di Geova.',
                    fonti: [b('Giudici', 5, '17'), F.w17],
                  },
                  {
                    testo: 'Resti a casa, seduto sui tuoi tappeti.',
                    esito:
                      'Il canto si rivolge anche a chi sedeva su tappeti pregiati o cavalcava asine rossicce e scelse la via più comoda: «Riflettete!»',
                    fonti: [b('Giudici', 5, '10'), F.w17],
                  },
                  { testo: 'Ti offri volontario e vai a Chedes.', fedele: true, dettaglio: 'volontari' },
                ],
              },
            },
            senti('v-offrirsi'),
          ],
        },
      ],
    },
    {
      id: 'volontario-chedes',
      titolo: 'A Chedes',
      luogo: 'Nella regione montuosa di Neftali',
      ...palcoChedes(io),
      inizioX: 1000,
      ingresso: [
        {
          t: 'narra',
          testo: 'Sei arrivato a Chedes, dove Barac ha convocato gli uomini di Zabulon e di Neftali. Con lui c’è la profetessa Debora.',
          certezza: 'scritto',
          fonti: [b('Giudici', 4, '9, 10')],
        },
      ],
      punti: [
        {
          id: 'convocati',
          x: 1100,
          tipo: 'ascolta',
          etichetta: 'Gli uomini arrivano',
          passi: [
            ...CHEDES.convoca(),
            {
              t: 'narra',
              testo: 'Siete in 10.000 a seguire Barac.',
              certezza: 'scritto',
              fonti: [b('Giudici', 4, '10')],
            },
          ],
        },
        {
          id: 'armi',
          x: 1250,
          tipo: 'agisci',
          etichetta: 'Ricevi le armi',
          richiede: ['convocati'],
          passi: [...CHEDES.arma(io), senti('v-armi')],
        },
      ],
    },
    {
      id: 'volontario-tabor',
      titolo: 'Sul monte Tabor',
      luogo: 'Con Barac e Debora',
      ...palcoTabor(io),
      inizioX: 950,
      ingresso: [
        {
          t: 'narra',
          testo: 'Siete saliti sul monte Tabor con Barac, e Debora è salita con voi. Laggiù, presso il torrente Chison, Sisera ha radunato tutti i suoi carri.',
          certezza: 'scritto',
          fonti: [b('Giudici', 4, '10'), b('Giudici', 4, '12, 13')],
        },
      ],
      punti: [
        { id: 'compagni', x: 1050, tipo: 'esamina', etichetta: 'I tuoi compagni', passi: [det('dura-prova')] },
        {
          id: 'segnale',
          x: 720,
          tipo: 'ascolta',
          etichetta: 'Debora parla a Barac',
          richiede: ['compagni'],
          passi: [...TABOR.segnale(io), ...TABOR.scende(io)],
        },
      ],
    },
    {
      id: 'volontario-battaglia',
      titolo: 'Nella pianura',
      luogo: 'Presso il torrente Chison',
      ...palcoPianura(),
      inizioX: 320,
      folle: [
        { x0: 120, x1: 300, n: 9, seme: 123, armati: 0.3, comportamento: 'insegue', distanza: [200, 140] },
        { x0: 1300, x1: 2150, n: 12, seme: 125, armati: 0.9, comportamento: 'vaga' },
      ],
      ingresso: [
        {
          t: 'narra',
          testo: 'Hai seguito Barac giù dal monte Tabor, verso la pianura dove aspettano i carri di Sisera.',
          certezza: 'scritto',
          fonti: [b('Giudici', 4, '14')],
        },
      ],
      punti: [
        {
          id: 'carri',
          x: 1000,
          tipo: 'osserva',
          etichetta: 'I carri',
          passi: [det('svantaggio')],
        },
        {
          id: 'cielo',
          x: 1250,
          tipo: 'agisci',
          etichetta: 'Il cielo si oscura',
          richiede: ['carri'],
          passi: [
            ...PIANURA.scompiglio(),
            {
              t: 'narra',
              testo: 'Geova getta nello scompiglio Sisera, tutti i suoi carri e tutto l’esercito.',
              certezza: 'scritto',
              fonti: [b('Giudici', 4, '15')],
            },
            det('niente-panico'),
          ],
        },
        {
          id: 'fango',
          x: 1760,
          tipo: 'esamina',
          etichetta: 'Un carro nel fango',
          richiede: ['cielo'],
          passi: [det('corpo-a-corpo')],
        },
        {
          id: 'racconta',
          x: 2300,
          tipo: 'medita',
          etichetta: 'Che cosa hai visto',
          richiede: ['fango'],
          passi: [det('raccontare'), senti('v-visto')],
        },
      ],
    },
  ],
  epilogo: [],
};
