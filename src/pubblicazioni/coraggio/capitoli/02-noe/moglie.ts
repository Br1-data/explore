import type { Passo, Ruolo } from '@/contenuti/tipi';
import { F, b } from './base';
import { arcaDentro, arcaPronta, cantiere } from './scenari';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });

/**
 * Il punto di vista della moglie di Noè. La Bibbia non ne riporta il nome né le
 * parole: dice che entrò nell’arca e ne uscì con Noè (Genesi 6:18; 7:7, 13; 8:16, 18).
 * Il resto viene dal libro, che parla della famiglia di Noè.
 */
export const moglie: Ruolo = {
  id: 'moglie',
  nome: 'La moglie di Noè',
  titolo: 'Una famiglia diversa da tutte le altre',
  descrizione: 'Cresci i tuoi figli in un mondo violento, prepara le provviste per la famiglia e gli animali, entra nell’arca mentre la gente vi deride.',
  fedelta:
    'La Bibbia non ne riporta il nome né le parole: dice che entrò nell’arca con Noè. Ciò che fa qui è quanto il capitolo 2 del libro dice della famiglia di Noè, con le pubblicazioni che cita.',
  modo: 'cammina',
  stile: 'moglie-noe',
  durata: '8-10 minuti',
  conclusione: 'Hai vissuto il racconto nei panni della moglie di Noè',
  scene: [
    {
      id: 'moglie-cantiere',
      titolo: 'La tua famiglia',
      luogo: 'Il cantiere dell’arca',
      ...cantiere(2400),
      inizioX: 250,
      attori: [{ id: 'noe', x: 1050, stile: 'noe', verso: -1 }],
      folle: [{ x0: 1300, x1: 1500, n: 5, seme: 221, donne: 0.5, comportamento: 'vaga' }],
      ingresso: [
        {
          t: 'narra',
          titolo: 'Sei la moglie di Noè',
          testo: 'La Bibbia non riporta il tuo nome. Dio ha detto a Noè che entrerai nell’arca con lui, con i vostri figli e le loro mogli.',
          certezza: 'scritto',
          fonti: [b('Genesi', 6, '18')],
        },
      ],
      punti: [
        { id: 'figli', x: 1400, tipo: 'esamina', etichetta: 'I tuoi figli al lavoro', passi: [det('educati')] },
        { id: 'nuore', x: 1520, tipo: 'esamina', etichetta: 'Le mogli dei tuoi figli', passi: [det('adulti')] },
        { id: 'vicini', x: 2100, tipo: 'esamina', etichetta: 'Chi vive intorno a voi', passi: [det('prepotenti')] },
      ],
    },
    {
      id: 'moglie-ingresso',
      titolo: 'A due a due',
      luogo: 'Davanti all’arca',
      ...arcaPronta(2200),
      inizioX: 1900,
      vars: { cibo: 0, foraggio: 0 },
      folle: [
        // Le nuore e i figli caricano con te.
        { x0: 1350, x1: 1550, n: 4, seme: 225, donne: 0.5, comportamento: 'vaga' },
        { x0: 1900, x1: 2100, n: 7, seme: 223, comportamento: 'vaga' },
      ],
      ingresso: [
        {
          t: 'narra',
          testo: 'L’arca è finita. Ora bisogna caricare le provviste per voi e per tutti gli animali.',
          certezza: 'libro',
          fonti: [F.libro, b('Genesi', 6, '21')],
        },
      ],
      punti: [
        {
          id: 'dispensa',
          x: 1500,
          tipo: 'agisci',
          etichetta: 'Prendi le provviste',
          passi: [{ t: 'fx', fx: { k: 'carico', chi: 'giocatore', cosa: 'giare' } }],
        },
        {
          id: 'cibo',
          x: 1080,
          tipo: 'agisci',
          etichetta: 'Portale nell’arca',
          richiede: ['dispensa'],
          passi: [
            { t: 'fx', fx: { k: 'carico', chi: 'giocatore', cosa: null } },
            { t: 'fx', fx: { k: 'var', nome: 'cibo', a: 1, dur: 0.6 } },
            {
              t: 'attivita',
              a: {
                tipo: 'completa',
                id: 'cibo',
                consegna: 'Per chi è il cibo che portate? Completa le parole di Dio a Noè.',
                verso: 'gen-6-21',
                testo: 'E tu devi raccogliere e portare con te [[cibo]] di ogni tipo: servirà per nutrire te e gli [[animali]]”.',
                distrattori: ['oro', 'vicini'],
              },
            },
            det('provviste'),
          ],
        },
        {
          id: 'fieno',
          x: 1620,
          tipo: 'agisci',
          etichetta: 'Prendi il foraggio',
          richiede: ['cibo'],
          passi: [{ t: 'fx', fx: { k: 'carico', chi: 'giocatore', cosa: 'fieno' } }],
        },
        {
          id: 'foraggio',
          x: 1140,
          tipo: 'agisci',
          etichetta: 'Portalo nell’arca',
          richiede: ['fieno'],
          passi: [
            { t: 'fx', fx: { k: 'carico', chi: 'giocatore', cosa: null } },
            { t: 'fx', fx: { k: 'var', nome: 'foraggio', a: 1, dur: 0.6 } },
            det('scorte'),
          ],
        },
        {
          id: 'animali',
          x: 1280,
          tipo: 'osserva',
          etichetta: 'Arrivano gli animali',
          richiede: ['foraggio'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'domanda',
                id: 'a-due',
                domanda: 'Come arrivano gli animali all’arca?',
                opzioni: ['Li cacciate e li portate voi', 'Vanno nell’arca da Noè a due a due', 'Li porta un vicino in cambio di un posto'],
                corretta: 1,
                dettaglio: 'spontanei',
              },
            },
          ],
        },
        { id: 'gente', x: 1850, tipo: 'ascolta', etichetta: 'La gente vi guarda', richiede: ['animali'], passi: [det('derisi'), senti('m-derisa')] },
        {
          id: 'entra',
          x: 1100,
          tipo: 'agisci',
          etichetta: 'Entra nell’arca',
          richiede: ['gente'],
          passi: [
            {
              t: 'narra',
              testo: 'Entri nell’arca con Noè, i vostri figli e le loro mogli. Poi Geova chiude la porta.',
              certezza: 'scritto',
              fonti: [b('Genesi', 7, '13'), b('Genesi', 7, '16')],
            },
            { t: 'fx', fx: { k: 'oggetto', id: 'arca', variante: 2 } },
            { t: 'fx', fx: { k: 'attendi', dur: 1 } },
          ],
        },
      ],
    },
    {
      id: 'moglie-arca',
      titolo: 'Una lampada nel buio',
      luogo: 'Dentro l’arca',
      ...arcaDentro(2000),
      inizioX: 1300,
      vars: { pioggiaFuori: 1 },
      attori: [
        { id: 'noe', x: 700, stile: 'noe', verso: 1 },
        { id: 'figlio', x: 400, stile: 'figlio-noe', verso: 1 },
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
        {
          id: 'lampada',
          x: 980,
          tipo: 'agisci',
          etichetta: 'Accendi la lampada',
          passi: [{ t: 'fx', fx: { k: 'oggetto', id: 'lampada', variante: 1 } }, det('lampada')],
        },
        { id: 'tetto', x: 1500, tipo: 'ascolta', etichetta: 'La pioggia sul tetto', richiede: ['lampada'], passi: [det('assordante')] },
        {
          id: 'insieme',
          x: 800,
          tipo: 'agisci',
          etichetta: 'Riunisci la famiglia',
          richiede: ['tetto'],
          passi: [
            { t: 'fx', fx: { k: 'vai', chi: 'figlio', x: 640, vel: 90 } },
            { t: 'fx', fx: { k: 'posa', chi: 'noe', posa: 'alza' } },
            det('preghiera'),
            senti('m-arca'),
          ],
        },
      ],
    },
  ],
  epilogo: [
    {
      t: 'narra',
      testo: 'Più di un anno dopo, Dio disse a Noè di uscire dall’arca con la moglie, i figli e le mogli dei figli. E uscirono.',
      certezza: 'scritto',
      fonti: [b('Genesi', 8, '15-18')],
    },
  ],
};
