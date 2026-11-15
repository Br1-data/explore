import type { Passo, Ruolo } from '@/contenuti/tipi';
import { F, PAROLE, b } from './base';
import { campoMadian, harod, villaggio } from './scenari';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });

/**
 * Il punto di vista di uno dei 300 uomini di Gedeone (Giudici 7:1–8:12). La Bibbia non dà
 * nomi: questo personaggio fa e dice solo ciò che il racconto dice dei 300. La scelta
 * davanti all’annuncio di Gedeone è una ricostruzione dichiarata.
 */
export const trecento: Ruolo = {
  id: 'trecento',
  nome: 'Uno dei 300',
  titolo: 'Un corno, una giara, una torcia',
  descrizione: 'Resta quando gli altri tornano a casa, bevi alla sorgente stando in guardia, circonda di notte l’accampamento nemico e insegui i madianiti fino allo stremo.',
  fedelta:
    'Uno qualunque dei 300: la Bibbia non ne riporta i nomi. Ciò che fa e grida è quanto Giudici 7 e 8 dicono di loro; la scelta davanti all’annuncio di Gedeone è una ricostruzione dichiarata.',
  modo: 'cammina',
  stile: 'trecento',
  durata: '10-12 minuti',
  conclusione: 'Hai vissuto il racconto nei panni di uno dei 300',
  scene: [
    {
      id: 'trecento-harod',
      titolo: 'Alla sorgente di Harod',
      luogo: 'L’accampamento di Gedeone',
      ...harod(2200),
      inizioX: 250,
      attori: [{ id: 'gedeone', x: 600, stile: 'gedeone', verso: 1 }],
      folle: [{ x0: 750, x1: 1500, n: 16, seme: 331, armati: 0.4, comportamento: 'vaga' }],
      ingresso: [
        {
          t: 'narra',
          titolo: 'Sei uno dei 300',
          testo: 'La Bibbia non riporta il tuo nome: sei uno degli uomini che hanno risposto al corno di Gedeone. Siete accampati presso la sorgente di Harod.',
          certezza: 'scritto',
          fonti: [b('Giudici', 6, '34, 35'), b('Giudici', 7, '1')],
        },
      ],
      punti: [
        {
          id: 'annuncio',
          x: 600,
          tipo: 'ascolta',
          etichetta: 'L’annuncio di Gedeone',
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'condotta',
                id: 'condotta-paura',
                situazione: 'Gedeone annuncia: «Chi ha paura e trema torni a casa». Di fronte c’è un esercito come uno sciame di locuste.',
                base: [b('Giudici', 7, '3'), b('Giudici', 7, '12')],
                opzioni: [
                  {
                    testo: 'Torni a casa.',
                    esito: 'Così fecero 22.000 uomini: rimasero in 10.000.',
                    fonti: [b('Giudici', 7, '3')],
                  },
                  { testo: 'Resti con Gedeone.', fedele: true, dettaglio: 'trecento' },
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
      ...campoMadian(2400),
      inizioX: 150,
      folle: [
        { x0: 60, x1: 260, n: 6, seme: 333, torce: 1, comportamento: 'insegue', distanza: [180, 120] },
        { x0: 900, x1: 2200, n: 18, seme: 335, armati: 0.6, comportamento: 'vaga' },
      ],
      ingresso: [
        {
          t: 'narra',
          testo: 'Gedeone vi ha divisi in tre schiere. Ognuno ha un corno e una grossa giara con dentro una torcia. «Guardate me e fate esattamente quello che faccio io».',
          certezza: 'scritto',
          fonti: [b('Giudici', 7, '16, 17')],
        },
      ],
      punti: [
        {
          id: 'mani',
          x: 500,
          tipo: 'leggi',
          etichetta: 'Che cosa hai in mano',
          passi: [
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
          x: 800,
          tipo: 'agisci',
          etichetta: 'Al segnale',
          richiede: ['mani'],
          passi: [
            { t: 'fx', fx: { k: 'carico', chi: 'giocatore', cosa: 'corno' } },
            { t: 'fx', fx: { k: 'nastro', chi: 'giocatore', testo: PAROLE.grido, dur: 3.5 } },
            det('corni'),
          ],
        },
      ],
    },
    {
      id: 'trecento-inseguimento',
      titolo: 'Stanchi, ma avanti',
      luogo: 'Oltre il Giordano, a Succot',
      ...villaggio(2400),
      inizioX: 200,
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
        { id: 'pane', x: 1100, tipo: 'ascolta', etichetta: 'I principi di Succot', richiede: ['fiato'], passi: [det('pane-negato'), senti('t-stanchi')] },
        { id: 'strada', x: 1700, tipo: 'medita', etichetta: 'Quanta strada', richiede: ['pane'], passi: [det('ottanta')] },
      ],
    },
  ],
  epilogo: [
    {
      t: 'narra',
      testo: 'Gedeone catturò i due re di Madian. E ai giorni di Gedeone il paese fu in pace per 40 anni.',
      certezza: 'scritto',
      fonti: [b('Giudici', 8, '12'), b('Giudici', 8, '28'), F.libro],
    },
  ],
};
