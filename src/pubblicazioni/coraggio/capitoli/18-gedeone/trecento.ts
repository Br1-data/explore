import type { Passo, Ruolo } from '@/contenuti/tipi';
import { F, PAROLE, b } from './base';
import {
  CAMPO,
  GOVERNO,
  HAROD,
  SUCCOT,
  VELLO,
  palcoCampo,
  palcoGoverno,
  palcoHarod,
  palcoSuccot,
  palcoVello,
} from './racconto';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });
const io = 'trecento';

/**
 * Il punto di vista di uno dei 300 uomini di Gedeone (Giudici 6:34–8:23). La Bibbia non
 * dà nomi: questo personaggio vive le scene del racconto in cui c’erano i 300
 * (racconto.ts) e fa e dice solo ciò che il testo dice di loro. Non era con Gedeone
 * all’accampamento nemico quando sentì il sogno. La scelta davanti all’annuncio di
 * Gedeone è una ricostruzione dichiarata.
 */
export const trecento: Ruolo = {
  id: 'trecento',
  nome: 'Uno dei 300',
  titolo: 'Un corno, una giara, una torcia',
  descrizione:
    'Rispondi al corno di Gedeone, resta quando gli altri tornano a casa, bevi alla sorgente stando in guardia, circonda di notte l’accampamento nemico e insegui i madianiti fino allo stremo.',
  fedelta:
    'Uno qualunque dei 300: la Bibbia non ne riporta i nomi. Ciò che fa e grida è quanto Giudici 6–8 dicono di loro; la scelta davanti all’annuncio di Gedeone è una ricostruzione dichiarata.',
  modo: 'cammina',
  stile: 'trecento',
  durata: '15-18 minuti',
  conclusione: 'Hai vissuto il racconto nei panni di uno dei 300',
  scene: [
    {
      id: 'trecento-raduno',
      titolo: 'Il suono del corno',
      luogo: 'Ofra, di notte',
      ...palcoVello(io),
      inizioX: 900,
      ingresso: [
        {
          t: 'narra',
          titolo: 'Sei uno dei 300',
          testo: 'La Bibbia non riporta il tuo nome. Madian, Amalec e gli orientali si sono accampati nella Valle di Izreel.',
          certezza: 'scritto',
          fonti: [b('Giudici', 6, '33')],
        },
      ],
      punti: [
        {
          id: 'corno',
          x: 620,
          tipo: 'ascolta',
          etichetta: 'Gedeone suona il corno',
          passi: [
            ...VELLO.corno(io),
            {
              t: 'narra',
              testo: 'Gli abiezeriti si radunano dietro a Gedeone. I suoi messaggeri chiamano tutto Manasse, e poi Aser, Zabulon e Neftali.',
              certezza: 'scritto',
              fonti: [b('Giudici', 6, '34, 35')],
            },
            senti('t-chiamata'),
          ],
        },
      ],
    },
    {
      id: 'trecento-harod',
      titolo: 'Alla sorgente di Harod',
      luogo: 'L’accampamento di Gedeone',
      ...palcoHarod(io),
      inizioX: 250,
      ingresso: [
        {
          t: 'narra',
          testo: 'Siete accampati presso la sorgente di Harod. L’accampamento di Madian è a nord, nella pianura.',
          certezza: 'scritto',
          fonti: [b('Giudici', 7, '1')],
        },
      ],
      punti: [
        {
          id: 'annuncio',
          x: 700,
          tipo: 'ascolta',
          etichetta: 'L’annuncio di Gedeone',
          passi: [
            ...HAROD.annuncio(io),
            {
              t: 'attivita',
              a: {
                tipo: 'condotta',
                id: 'condotta-paura',
                situazione: 'Gedeone ha annunciato: «Chi ha paura e trema torni a casa». Di fronte c’è un esercito come uno sciame di locuste.',
                base: [b('Giudici', 7, '3'), b('Giudici', 7, '12')],
                opzioni: [
                  {
                    testo: 'Torni a casa.',
                    esito: 'Così fecero 22.000 uomini: rimasero in 10.000.',
                    fonti: [b('Giudici', 7, '3')],
                  },
                  { testo: 'Resti con Gedeone.', fedele: true, dettaglio: 'trentaduemila' },
                ],
              },
            },
            senti('t-paura'),
          ],
        },
        {
          id: 'acqua',
          x: 1100,
          tipo: 'agisci',
          etichetta: 'Scendi a bere',
          richiede: ['annuncio'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'classifica',
                id: 'chi-resta',
                consegna: 'Geova mette alla prova gli uomini all’acqua. Chi resta con Gedeone e chi torna a casa?',
                categorie: ['Resta con Gedeone', 'Torna a casa'],
                voci: [
                  { testo: 'Chi ha paura e trema', cat: 1, fonti: [b('Giudici', 7, '3')] },
                  { testo: 'Chi per bere si inginocchia', cat: 1, fonti: [b('Giudici', 7, '6')] },
                  { testo: 'Chi si porta l’acqua con la mano alla bocca', cat: 0, fonti: [b('Giudici', 7, '6')] },
                  { testo: 'Chi per bere abbassa la testa', cat: 1, fonti: [F.libro, b('Giudici', 7, '6')] },
                ],
                spiegazione: 'Rimasero 300 uomini: quelli che si portarono l’acqua con la mano alla bocca.',
              },
            },
            ...HAROD.acqua(),
            det('trecento'),
          ],
        },
        {
          id: 'corni',
          x: 1500,
          tipo: 'agisci',
          etichetta: 'Prendi un corno da chi torna a casa',
          richiede: ['acqua'],
          passi: [{ t: 'fx', fx: { k: 'carico', chi: 'giocatore', cosa: 'corno' } }, det('provviste')],
        },
      ],
    },
    {
      id: 'trecento-notte',
      titolo: 'La spada di Geova e di Gedeone',
      luogo: 'Intorno all’accampamento di Madian',
      ...palcoCampo(io),
      // I 300 sono già al loro posto, con le giare (Giudici 7:19).
      vars: { ...palcoCampo(io).vars, giare: 1 },
      inizioX: 250,
      ingresso: [
        {
          t: 'narra',
          testo: 'Gedeone è tornato dall’accampamento nemico e vi ha svegliati. Vi ha divisi in tre schiere: ognuno ha un corno e una grossa giara con dentro una torcia.',
          certezza: 'scritto',
          fonti: [b('Giudici', 7, '15, 16')],
        },
        { t: 'fx', fx: { k: 'nastro', chi: 'gedeone', testo: PAROLE.alzatevi, dur: 4.5 } },
        { t: 'fx', fx: { k: 'carico', chi: 'giocatore', cosa: 'giara' } },
      ],
      punti: [
        {
          id: 'mani',
          x: 500,
          tipo: 'leggi',
          etichetta: 'Che cosa hai in mano',
          passi: [
            { t: 'fx', fx: { k: 'nastro', chi: 'gedeone', testo: PAROLE.guardate, dur: 4 } },
            {
              t: 'attivita',
              a: {
                tipo: 'associa',
                id: 'mani',
                consegna: 'Al segnale, che cosa fate? Unisci ogni cosa a ciò che dice il racconto.',
                coppie: [
                  { a: 'Le grosse giare', b: '«fracassarono le grosse giare»', fonti: [b('Giudici', 7, '20')] },
                  { a: 'La mano sinistra', b: '«Tenendo la torcia nella mano sinistra»', fonti: [b('Giudici', 7, '20')] },
                  { a: 'La mano destra', b: '«suonarono il corno che avevano nella destra»', fonti: [b('Giudici', 7, '20')] },
                  { a: 'Il vostro posto', b: '«Rimasero ciascuno al suo posto, intorno all’accampamento»', fonti: [b('Giudici', 7, '21')] },
                ],
                dettaglio: 'giare',
              },
            },
          ],
        },
        {
          id: 'segnale',
          x: 340,
          tipo: 'agisci',
          etichetta: 'Al segnale',
          richiede: ['mani'],
          passi: [...CAMPO.attacco(io), det('corni')],
        },
      ],
    },
    {
      id: 'trecento-inseguimento',
      titolo: 'Stanchi, ma avanti',
      luogo: 'Oltre il Giordano, a Succot',
      ...palcoSuccot(io),
      inizioX: 400,
      ingresso: [
        {
          t: 'narra',
          testo: 'Avete attraversato il Giordano dietro a Gedeone, inseguendo i re di Madian.',
          certezza: 'scritto',
          fonti: [b('Giudici', 8, '4, 5')],
        },
      ],
      punti: [
        { id: 'fiato', x: 500, tipo: 'esamina', etichetta: 'I tuoi compagni', passi: [det('stanchi')] },
        {
          id: 'pane',
          x: 1250,
          tipo: 'ascolta',
          etichetta: 'I principi di Succot',
          richiede: ['fiato'],
          passi: [...SUCCOT.pane(io), det('pane-negato'), senti('t-stanchi')],
        },
        { id: 'strada', x: 1750, tipo: 'medita', etichetta: 'Quanta strada', richiede: ['pane'], passi: [det('ottanta')] },
      ],
    },
    {
      id: 'trecento-governo',
      titolo: '«Governa su di noi»',
      luogo: 'Dopo la vittoria',
      ...palcoGoverno(io),
      inizioX: 900,
      ingresso: [
        {
          t: 'narra',
          testo: 'Gedeone ha catturato i due re di Madian. Gli uomini d’Israele si radunano intorno a lui.',
          certezza: 'scritto',
          fonti: [b('Giudici', 8, '12'), b('Giudici', 8, '22')],
        },
      ],
      punti: [
        {
          id: 'governo',
          x: 1250,
          tipo: 'ascolta',
          etichetta: 'Che cosa chiedono a Gedeone',
          passi: [...GOVERNO.richiesta(), ...GOVERNO.risposta(io), senti('t-re')],
        },
      ],
    },
  ],
  epilogo: [
    {
      t: 'narra',
      testo: 'Madian non sfidò più Israele. E ai giorni di Gedeone il paese fu in pace per 40 anni.',
      certezza: 'scritto',
      fonti: [b('Giudici', 8, '28'), F.libro],
    },
  ],
};
