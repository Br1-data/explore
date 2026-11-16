import type { Passo, Ruolo } from '@/contenuti/tipi';
import { F, b } from './base';
import { INGRESSO, PATTO, USCITA, palcoIngresso, palcoPatto, palcoUscita } from './racconto';
import { arcaDentro, cantiere } from './scenari';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });
const io = 'figlio';

/**
 * Il punto di vista di uno dei figli di Noè: Sem, Cam o Iafet. In questi capitoli la
 * Bibbia ne riporta i nomi ma non distingue che cosa fece ciascuno: qui si fa solo ciò
 * che dice della famiglia di Noè (Genesi 6:10, 18; 7:13; 8:16-18; 9:8-19).
 */
export const figlio: Ruolo = {
  id: 'figlio',
  nome: 'Uno dei figli di Noè',
  titolo: 'Sem, Cam o Iafet',
  descrizione: 'Costruisci l’arca con tuo padre — legno, tavole, catrame, la porta — e per più di un anno prenditi cura degli animali, prima di scendere sulla terra di nuovo asciutta.',
  fedelta:
    'La Bibbia riporta i nomi dei tre figli di Noè, Sem, Cam e Iafet, ma in questi capitoli non dice che cosa fece ciascuno: qui c’è solo ciò che dice della famiglia di Noè, spiegato dal libro e dalle pubblicazioni che cita.',
  modo: 'cammina',
  stile: 'figlio-noe',
  durata: '14-17 minuti',
  conclusione: 'Hai vissuto il racconto nei panni di uno dei figli di Noè',
  scene: [
    {
      id: 'figlio-cantiere',
      titolo: 'Al lavoro con tuo padre',
      luogo: 'Il cantiere dell’arca',
      ...cantiere(2400),
      inizioX: 2100,
      attori: [{ id: 'noe', x: 1300, stile: 'noe', verso: 1 }],
      ingresso: [
        {
          t: 'narra',
          titolo: 'Sei uno dei figli di Noè',
          testo: 'I figli di Noè sono Sem, Cam e Iafet: tu sei uno di loro. Con tuo padre e la tua famiglia lavori alla costruzione dell’arca.',
          certezza: 'libro',
          fonti: [b('Genesi', 6, '10'), F.libro],
        },
      ],
      // Costruire l’arca un passo alla volta, come Dio l’aveva descritta (Genesi 6:14-16):
      // il legno, le tavole, il catrame, la porta. L’arca cambia aspetto a ogni passo.
      punti: [
        {
          id: 'legno',
          x: 470,
          tipo: 'agisci',
          etichetta: 'Prendi le tavole',
          passi: [{ t: 'fx', fx: { k: 'carico', chi: 'giocatore', cosa: 'tavole' } }, det('resinoso')],
        },
        {
          id: 'fasciame',
          x: 900,
          tipo: 'agisci',
          etichetta: 'Fissa le tavole all’ossatura',
          richiede: ['legno'],
          passi: [
            { t: 'fx', fx: { k: 'carico', chi: 'giocatore', cosa: null } },
            { t: 'fx', fx: { k: 'oggetto', id: 'arca', variante: 3 } },
            { t: 'fx', fx: { k: 'attendi', dur: 0.8 } },
            det('scompartimenti'),
          ],
        },
        {
          id: 'secchio',
          x: 1700,
          tipo: 'agisci',
          etichetta: 'Prendi il catrame',
          richiede: ['fasciame'],
          passi: [{ t: 'fx', fx: { k: 'carico', chi: 'giocatore', cosa: 'secchio' } }],
        },
        {
          id: 'catrame',
          x: 1250,
          tipo: 'agisci',
          etichetta: 'Copri l’arca di catrame',
          richiede: ['secchio'],
          passi: [
            { t: 'fx', fx: { k: 'carico', chi: 'giocatore', cosa: null } },
            { t: 'fx', fx: { k: 'oggetto', id: 'arca', variante: 4 } },
            { t: 'fx', fx: { k: 'attendi', dur: 0.8 } },
            det('catrame'),
          ],
        },
        {
          id: 'porta',
          x: 1360,
          tipo: 'agisci',
          etichetta: 'Fai la porta di lato',
          richiede: ['catrame'],
          passi: [{ t: 'fx', fx: { k: 'oggetto', id: 'arca', variante: 1 } }, { t: 'fx', fx: { k: 'attendi', dur: 0.8 } }, det('tsohar')],
        },
      ],
    },
    {
      id: 'figlio-porta',
      titolo: 'La porta si chiude',
      luogo: 'Il giorno del diluvio',
      ...palcoIngresso(io),
      inizioX: 1500,
      ingresso: [
        {
          t: 'narra',
          testo: 'Dio ha detto a tuo padre di entrare nell’arca con tutta la famiglia: fra sette giorni farà piovere.',
          certezza: 'scritto',
          fonti: [b('Genesi', 7, '1, 4')],
        },
      ],
      punti: [
        {
          id: 'entra',
          x: 1180,
          tipo: 'agisci',
          etichetta: 'Entra nell’arca',
          passi: [
            ...INGRESSO.entrano(io),
            {
              t: 'narra',
              testo: 'Entri nell’arca con tuo padre, tua madre, i tuoi fratelli e le vostre mogli.',
              certezza: 'scritto',
              fonti: [b('Genesi', 7, '13')],
            },
            ...INGRESSO.porta(),
            { t: 'narra', testo: 'Poi Geova chiude la porta.', certezza: 'scritto', fonti: [b('Genesi', 7, '16')] },
            ...INGRESSO.pioggia(),
            ...INGRESSO.acqua(),
          ],
        },
      ],
    },
    {
      id: 'figlio-arca',
      titolo: 'Dentro l’arca',
      luogo: 'Durante il diluvio',
      ...arcaDentro(2000),
      inizioX: 1000,
      vars: { pioggiaFuori: 1 },
      ingresso: [
        {
          t: 'narra',
          titolo: 'Ricostruzione',
          testo:
            'La Bibbia non descrive la vita nell’arca. Questa scena si basa su ciò che ne dicono le pubblicazioni, spesso come cosa probabile. Fuori piove a dirotto.',
          ricostruzione: true,
          fonti: [F.w01, F.w13, b('Genesi', 7, '12')],
        },
      ],
      punti: [
        {
          id: 'fieno',
          x: 560,
          tipo: 'agisci',
          etichetta: 'Prendi il fieno',
          passi: [{ t: 'fx', fx: { k: 'carico', chi: 'giocatore', cosa: 'fieno' } }],
        },
        {
          id: 'nutri',
          x: 330,
          tipo: 'agisci',
          etichetta: 'Nutri gli animali',
          richiede: ['fieno'],
          passi: [{ t: 'fx', fx: { k: 'carico', chi: 'giocatore', cosa: null } }, det('compiti')],
        },
        {
          id: 'acqua',
          x: 1150,
          tipo: 'agisci',
          etichetta: 'Prendi l’acqua',
          richiede: ['nutri'],
          passi: [{ t: 'fx', fx: { k: 'carico', chi: 'giocatore', cosa: 'secchio' } }],
        },
        {
          id: 'abbevera',
          x: 1450,
          tipo: 'agisci',
          etichetta: 'Abbevera gli animali',
          richiede: ['acqua'],
          passi: [{ t: 'fx', fx: { k: 'carico', chi: 'giocatore', cosa: null } }, det('tranquilli')],
        },
        {
          id: 'rifiuti',
          x: 1800,
          tipo: 'agisci',
          etichetta: 'Porta via i rifiuti',
          richiede: ['abbevera'],
          passi: [
            { t: 'fx', fx: { k: 'carico', chi: 'giocatore', cosa: 'secchio' } },
            { t: 'fx', fx: { k: 'attendi', dur: 0.8 } },
            { t: 'fx', fx: { k: 'carico', chi: 'giocatore', cosa: null } },
            det('occupati'),
            senti('f-lavoro'),
          ],
        },
      ],
    },
    {
      id: 'figlio-ararat',
      titolo: 'Una foglia d’olivo',
      luogo: 'I monti di Ararat, dentro l’arca',
      ...palcoUscita(),
      inizioX: 700,
      ingresso: [
        {
          t: 'narra',
          testo: 'L’arca si è fermata sopra i monti di Ararat. Siete ancora tutti dentro.',
          certezza: 'scritto',
          fonti: [b('Genesi', 8, '4')],
        },
      ],
      punti: [
        {
          id: 'finestra',
          x: 760,
          tipo: 'osserva',
          etichetta: 'Tuo padre apre la finestra',
          passi: [
            ...USCITA.corvo(),
            ...USCITA.colomba(),
            ...USCITA.foglia(),
            {
              t: 'narra',
              testo: 'Tuo padre fa volare fuori un corvo, poi una colomba: la seconda volta la colomba torna con una foglia d’olivo.',
              certezza: 'scritto',
              fonti: [b('Genesi', 8, '6-11')],
            },
          ],
        },
        {
          id: 'esci',
          x: 620,
          tipo: 'osserva',
          etichetta: 'Si esce dall’arca',
          richiede: ['finestra'],
          passi: [
            ...USCITA.tetto(),
            {
              t: 'narra',
              testo: 'Dio dice a tuo padre di uscire dall’arca con tutta la famiglia e con gli animali.',
              certezza: 'scritto',
              fonti: [b('Genesi', 8, '15-17')],
            },
            ...USCITA.esci(),
          ],
        },
      ],
    },
    {
      id: 'figlio-uscita',
      titolo: 'Di nuovo sulla terra',
      luogo: 'I monti di Ararat',
      ...palcoPatto(io),
      inizioX: 900,
      ingresso: [...PATTO.arca()],
      punti: [
        {
          id: 'altare',
          x: 1240,
          tipo: 'osserva',
          etichetta: 'L’altare e l’arcobaleno',
          passi: [
            ...PATTO.altare(),
            {
              t: 'narra',
              testo: 'Tuo padre erige un altare a Geova e offre olocausti. Poi Dio parla a lui e a voi figli, e mette l’arcobaleno nelle nuvole come segno del suo patto.',
              certezza: 'scritto',
              fonti: [b('Genesi', 8, '20'), b('Genesi', 9, '8'), b('Genesi', 9, '13')],
            },
            ...PATTO.arcobaleno(),
          ],
        },
        {
          id: 'calendario',
          x: 900,
          tipo: 'leggi',
          etichetta: 'Quanto siete rimasti nell’arca',
          richiede: ['altare'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'ordina',
                id: 'calendario',
                consegna: 'Genesi annota le date del diluvio. Mettile in ordine.',
                voci: [
                  { testo: 'Le cateratte dei cieli si spalancano', nota: '600º anno, 2º mese, 17º giorno' },
                  { testo: 'Piove a dirotto per 40 giorni e 40 notti', nota: 'Genesi 7:12' },
                  { testo: 'Le acque sommergono la terra per 150 giorni', nota: 'Genesi 7:24' },
                  { testo: 'L’arca si ferma sui monti di Ararat', nota: '7º mese, 17º giorno' },
                  { testo: 'Appaiono le cime dei monti', nota: '10º mese, 1º giorno' },
                  { testo: 'Le acque sono defluite dalla terra', nota: '601º anno, 1º mese, 1º giorno' },
                  { testo: 'La terra si è asciugata', nota: '2º mese, 27º giorno' },
                ],
                spiegazione: 'Sono le date di Genesi 7:11–8:14.',
              },
            },
            det('un-anno'),
          ],
        },
        {
          id: 'popolazione',
          x: 1500,
          tipo: 'medita',
          etichetta: 'Da voi tre',
          richiede: ['calendario'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'completa',
                id: 'popolazione',
                consegna: 'Che cosa verrà da voi tre? Completa il versetto.',
                verso: 'gen-9-18',
                testo: 'I figli di Noè che uscirono dall’arca furono [[Sem]], Cam e Iàfet. In seguito Cam generò Cànaan. Questi tre furono i figli di Noè, e da loro venne e si diffuse tutta la [[popolazione]] della terra.',
                distrattori: ['Set', 'famiglia'],
              },
            },
            det('discendenti'),
            senti('f-diverso'),
          ],
        },
      ],
    },
  ],
  epilogo: [],
};
