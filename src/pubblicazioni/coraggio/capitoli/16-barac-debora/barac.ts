import type { Passo, Ruolo } from '@/contenuti/tipi';
import { F, b } from './base';
import { CANTO, CHEDES, PALMA, PIANURA, TABOR, palcoCanto, palcoChedes, palcoPalma, palcoPianura, palcoTabor } from './racconto';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });
const io = 'barac';

/**
 * Il punto di vista di Barac: la chiamata, la condizione posta a Debora, il Tabor,
 * la discesa nella pianura, l’inseguimento (Giudici 4:6-16, 24). Le situazioni in cui
 * si sceglie sono momenti che il racconto descrive (`narrata`).
 */
export const barac: Ruolo = {
  id: 'barac',
  nome: 'Barac',
  titolo: 'L’uomo di fede che accettò l’aiuto di una donna',
  descrizione:
    'Ricevi da Debora il comando di Geova, decidi come rispondere, convoca e arma i tuoi uomini a Chedes, sali sul Tabor, scegli se scendere nella pianura contro 900 carri e canta con Debora la vittoria.',
  fedelta:
    'Giudici 4:6-16, 24 ed Ebrei 11:32-34, come li spiega il capitolo 16 del libro con le pubblicazioni che cita. Le parole di Barac e di Debora sono quelle del testo; le scelte riguardano momenti che il racconto descrive.',
  modo: 'cammina',
  stile: 'barac',
  durata: '16-20 minuti',
  conclusione: 'Hai vissuto il racconto nei panni di Barac',
  scene: [
    {
      id: 'barac-chiamata',
      titolo: 'La chiamata',
      luogo: 'Dalla profetessa Debora',
      ...palcoPalma(io),
      inizioX: 1700,
      ingresso: [
        {
          t: 'narra',
          titolo: 'Sei Barac',
          testo: 'Sei Barac, figlio di Abinoam, di Chedes-Neftali. La profetessa Debora ti ha mandato a chiamare.',
          certezza: 'scritto',
          fonti: [b('Giudici', 4, '6')],
        },
      ],
      punti: [
        {
          id: 'comando',
          x: 1020,
          tipo: 'ascolta',
          etichetta: 'Debora ti parla',
          passi: [...PALMA.comando(io), det('stupore')],
        },
        {
          id: 'condizione',
          x: 1020,
          tipo: 'agisci',
          etichetta: 'Rispondi',
          richiede: ['comando'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'condotta',
                id: 'condotta-condizione',
                narrata: true,
                situazione:
                  'Una donna ti trasmette il comando di Geova: affrontare Sisera e i suoi 900 carri con 10.000 uomini, mentre Israele è praticamente disarmato.',
                base: [b('Giudici', 4, '6-8'), F.libro],
                opzioni: [
                  {
                    testo: 'Ti offendi: le istruzioni te le dà una donna.',
                    esito: 'Barac non si offese perché a trasmettergli le istruzioni era una donna, e non si mostrò orgoglioso.',
                    fonti: [F.libro],
                  },
                  {
                    testo: 'Chiedi prima a Geova più armi.',
                    esito: 'Barac non pregò Dio per ricevere più armi, anche se Israele non aveva un esercito.',
                    fonti: [F.wp15],
                  },
                  {
                    testo: 'Rifiuti: contro quei carri non c’è speranza.',
                    esito: 'Barac non rifiutò l’incarico e non disubbidì a Geova.',
                    fonti: [F.w03],
                  },
                  { testo: 'Chiedi a Debora di venire con te.', fedele: true, dettaglio: 'fede' },
                ],
              },
            },
            ...PALMA.condizione(io),
            ...PALMA.verro(io),
            det('altri-uomini'),
            senti('b-aiuto'),
          ],
        },
        {
          id: 'gloria',
          x: 760,
          tipo: 'medita',
          etichetta: 'A chi andrà la gloria',
          richiede: ['condizione'],
          passi: [det('bellezza')],
        },
      ],
    },
    {
      id: 'barac-chedes',
      titolo: 'A Chedes',
      luogo: 'Nella regione montuosa di Neftali',
      ...palcoChedes(io),
      inizioX: 300,
      ingresso: [
        {
          t: 'narra',
          testo: 'Debora si è alzata ed è venuta con te a Chedes.',
          certezza: 'scritto',
          fonti: [b('Giudici', 4, '9')],
        },
      ],
      punti: [
        { id: 'citta', x: 420, tipo: 'esamina', etichetta: 'La città', passi: [det('chedes')] },
        {
          id: 'convoca',
          x: 960,
          tipo: 'agisci',
          etichetta: 'Convoca Zabulon e Neftali',
          richiede: ['citta'],
          passi: [
            ...CHEDES.convoca(),
            {
              t: 'attivita',
              a: {
                tipo: 'completa',
                id: 'convocazione',
                consegna: 'Chi rispose alla tua chiamata? Completa il versetto.',
                verso: 'gdc-4-10',
                testo: 'Bàrac convocò [[Zàbulon]] e [[Nèftali]] a Chèdes, e [[10.000]] uomini lo seguirono. Anche Debora salì con lui.',
                distrattori: ['Ruben', 'Àser', '900'],
              },
            },
          ],
        },
        {
          id: 'arma',
          x: 1300,
          tipo: 'agisci',
          etichetta: 'Arma i tuoi uomini',
          richiede: ['convoca'],
          passi: [...CHEDES.arma(io), det('armi')],
        },
      ],
    },
    {
      id: 'barac-tabor',
      titolo: 'Sul monte Tabor',
      luogo: 'Con 10.000 uomini',
      ...palcoTabor(io),
      inizioX: 300,
      ingresso: [
        {
          t: 'narra',
          testo: 'Con i 10.000 uomini sei salito sul monte Tabor, e Debora è salita con te.',
          certezza: 'scritto',
          fonti: [b('Giudici', 4, '10'), b('Giudici', 4, '12')],
        },
      ],
      punti: [
        {
          id: 'incarico',
          x: 160,
          tipo: 'esamina',
          etichetta: 'Il tuo incarico',
          passi: [det('salvatore')],
        },
        {
          id: 'monte',
          x: 480,
          tipo: 'esamina',
          etichetta: 'Il monte',
          passi: [det('tabor')],
        },
        {
          id: 'uomini',
          x: 1040,
          tipo: 'esamina',
          etichetta: 'I tuoi uomini',
          passi: [det('raduno')],
        },
        {
          id: 'scendi',
          x: 1500,
          tipo: 'agisci',
          etichetta: 'L’esercito di Sisera si avvicina',
          richiede: ['incarico', 'monte', 'uomini'],
          passi: [
            ...TABOR.segnale(io),
            {
              t: 'attivita',
              a: {
                tipo: 'condotta',
                id: 'condotta-pianura',
                narrata: true,
                situazione:
                  'Sisera avanza nella pianura con i suoi carri. Sulle pendici del Tabor i carri sarebbero più lenti; in pianura sono nel loro terreno. Debora ti dice di andare.',
                base: [b('Giudici', 4, '14'), F.libro],
                opzioni: [
                  {
                    testo: 'Aspetti sulle pendici, dove i carri sarebbero più lenti.',
                    esito:
                      'Da un punto di vista militare poteva sembrare la scelta migliore: su un terreno in pendenza i carri sarebbero stati più lenti, e gli uomini di Barac probabilmente in vantaggio. Ma l’istruzione di Geova era un’altra.',
                    fonti: [F.libro, F.wp15],
                  },
                  { testo: 'Scendi nella pianura con i tuoi uomini.', fedele: true, dettaglio: 'ubbidienza' },
                ],
              },
            },
            senti('b-istruzioni'),
          ],
        },
      ],
    },
    {
      id: 'barac-inseguimento',
      titolo: 'All’inseguimento',
      luogo: 'Dal monte Tabor verso Aroset-Goim',
      ...palcoPianura(),
      inizioX: 320,
      folle: [{ x0: 120, x1: 300, n: 9, seme: 81, armati: 0.6, comportamento: 'insegue', distanza: [210, 150] }],
      ingresso: [
        {
          t: 'narra',
          testo: 'Sei sceso dal monte Tabor alla testa dei 10.000 uomini, verso la pianura dove aspettano i carri di Sisera.',
          certezza: 'scritto',
          fonti: [b('Giudici', 4, '14')],
        },
      ],
      punti: [
        {
          id: 'cielo',
          x: 700,
          tipo: 'agisci',
          etichetta: 'Avanti, contro i carri',
          passi: [
            ...PIANURA.scompiglio(),
            {
              t: 'narra',
              testo: 'Geova getta nello scompiglio Sisera, tutti i suoi carri e tutto l’esercito, e li consegna alla tua spada: ora insegui il nemico.',
              certezza: 'scritto',
              fonti: [b('Giudici', 4, '15'), b('Giudici', 4, '16')],
            },
          ],
        },
        {
          id: 'carri',
          x: 1480,
          tipo: 'esamina',
          etichetta: 'Carri abbandonati',
          richiede: ['cielo'],
          passi: [det('inseguimento')],
        },
        {
          id: 'campo',
          x: 1900,
          tipo: 'esamina',
          etichetta: 'Il campo di battaglia',
          richiede: ['cielo'],
          passi: [det('nessuno')],
        },
        {
          id: 'giornata',
          x: 2200,
          tipo: 'medita',
          etichetta: 'Ripensa a com’è andata',
          richiede: ['carri', 'campo'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'ordina',
                id: 'giornata',
                consegna: 'Rimetti in ordine ciò che è successo, dalla chiamata all’inseguimento. Due cose non le hai fatte: scartale.',
                voci: [
                  { testo: 'Debora ti manda a chiamare', nota: 'Giudici 4:6' },
                  { testo: 'Chiedi a Debora di venire con te', nota: 'Giudici 4:8' },
                  { testo: 'Convochi Zabulon e Neftali a Chedes', nota: 'Giudici 4:10' },
                  { testo: 'Sisera raduna i carri presso il Chison', nota: 'Giudici 4:13' },
                  { testo: 'Debora ti dice: «Va’»', nota: 'Giudici 4:14' },
                  { testo: 'Scendi dal Tabor con i 10.000', nota: 'Giudici 4:14' },
                  { testo: 'Geova getta nello scompiglio l’esercito', nota: 'Giudici 4:15' },
                  { testo: 'Insegui il nemico fino ad Aroset-Goim', nota: 'Giudici 4:16' },
                ],
                distrattori: ['Chiedi a Geova più armi', 'Aspetti il nemico sulle pendici'],
                spiegazione: 'È la sequenza di Giudici 4:6-16. Ciò che hai scartato è proprio ciò che Barac non fece.',
              },
            },
            det('annientato'),
          ],
        },
        {
          id: 'fede',
          x: 2450,
          tipo: 'leggi',
          etichetta: 'Ricordato per la sua fede',
          richiede: ['giornata'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'completa',
                id: 'fede',
                consegna: 'Molti secoli dopo, l’apostolo Paolo ricorda Barac. Completa le sue parole.',
                verso: 'ebr-11-32',
                testo:
                  'E cos’altro posso dire? Non mi basterebbe il tempo se volessi raccontare di Gedeone, di [[Bàrac]], di Sansone, di Iefte, di Davide, di Samuele e degli altri profeti. Grazie alla [[fede]] sconfissero regni, stabilirono la giustizia, ottennero promesse, chiusero la bocca dei leoni, spensero la violenza del fuoco, sfuggirono al taglio della spada, da deboli furono resi forti, diventarono valorosi in guerra, misero in fuga eserciti [[invasori]].',
                distrattori: ['Debora', 'forza', 'nemici'],
              },
            },
          ],
        },
      ],
    },
    {
      id: 'barac-canto',
      titolo: 'Il canto di vittoria',
      luogo: 'Quel giorno',
      ...palcoCanto(io),
      inizioX: 560,
      ingresso: [
        {
          t: 'narra',
          testo: 'Quel giorno, dopo la vittoria, Debora intona un canto insieme a te.',
          certezza: 'scritto',
          fonti: [b('Giudici', 5, '1')],
        },
      ],
      punti: [
        { id: 'intona', x: 520, tipo: 'agisci', etichetta: 'Canta con Debora', passi: CANTO.intona(io) },
        {
          id: 'avanti',
          x: 760,
          tipo: 'leggi',
          etichetta: 'Il canto parla di te',
          richiede: ['intona'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'completa',
                id: 'avanti-barac',
                consegna: 'In un passo il canto si rivolge proprio a te. Completa il versetto.',
                verso: 'gdc-5-12',
                testo: 'Déstati, déstati, Debora! Déstati, déstati, intona un [[canto]]! Avanti, Bàrac! Conduci via i tuoi [[prigionieri]], figlio di Abinòam!',
                distrattori: ['salmo', 'soldati'],
              },
            },
          ],
        },
      ],
    },
  ],
  epilogo: [
    {
      t: 'narra',
      testo:
        'Sisera però era saltato giù dal carro ed era fuggito. Geova, che guardava dai cieli, aveva già in mente qualcosa per lui: lo racconta il capitolo 17, «Benedetta fra le donne».',
      certezza: 'libro',
      fonti: [b('Giudici', 4, '15'), F.libro],
    },
  ],
};
