import type { Passo, Ruolo } from '@/contenuti/tipi';
import { F, b } from './base';
import { ararat, arcaDentro, cantiere } from './scenari';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });

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
  durata: '8-10 minuti',
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
      id: 'figlio-uscita',
      titolo: 'Di nuovo sulla terra',
      luogo: 'I monti di Ararat',
      ...ararat(true, 2000),
      inizioX: 700,
      attori: [{ id: 'noe', x: 1240, stile: 'noe', verso: -1 }],
      ingresso: [
        {
          t: 'narra',
          testo: 'Dio ha detto a tuo padre di uscire dall’arca con tutta la famiglia e con gli animali.',
          certezza: 'scritto',
          fonti: [b('Genesi', 8, '15-17')],
        },
      ],
      punti: [
        {
          id: 'calendario',
          x: 900,
          tipo: 'leggi',
          etichetta: 'Quanto siete rimasti nell’arca',
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
