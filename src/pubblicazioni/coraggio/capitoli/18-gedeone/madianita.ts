import type { Passo, Ruolo } from '@/contenuti/tipi';
import { PAROLE, b } from './base';
import { campoMadian } from './scenari';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });

/**
 * Il punto di vista del soldato madianita che spiegò il sogno del compagno (Giudici
 * 7:13, 14). La Bibbia non ne dà il nome. Non è un modello da imitare: serve a vedere
 * l’oppressore e come finì. Le sue parole sono quelle del testo; le morti non si mostrano.
 */
export const madianita: Ruolo = {
  id: 'madianita',
  nome: 'Un soldato madianita',
  titolo: 'Il nemico che spiegò il sogno',
  descrizione: 'Dalla parte degli invasori: le incursioni nei campi d’Israele, un esercito come locuste, un sogno strano nella notte e un risveglio di corni e di luci.',
  fedelta:
    'Il compagno che spiegò il sogno: la Bibbia non ne riporta il nome. Non è un modello da imitare. Le sue parole sono quelle del testo; ciò che accade nell’accampamento è quanto dicono Giudici 6–8 e il libro.',
  modo: 'cammina',
  stile: 'madianita',
  durata: '6-8 minuti',
  conclusione: 'Hai visto il racconto dalla parte del nemico',
  scene: [
    {
      id: 'madianita-campo',
      titolo: 'Un pane d’orzo',
      luogo: 'L’accampamento di Madian, di notte',
      ...campoMadian(2400),
      inizioX: 2200,
      attori: [{ id: 'compagno', x: 1700, stile: 'madianita', verso: 1 }],
      folle: [{ x0: 400, x1: 1500, n: 16, seme: 341, armati: 0.6, comportamento: 'vaga' }],
      ingresso: [
        {
          t: 'narra',
          titolo: 'Sei un soldato madianita',
          testo: 'La Bibbia non riporta il tuo nome. Con gli amalechiti e gli orientali siete accampati nella pianura di Izreel.',
          certezza: 'scritto',
          fonti: [b('Giudici', 6, '33'), b('Giudici', 7, '12')],
        },
        { t: 'narra', testo: 'Questo punto di vista non è un modello da imitare: serve a capire l’oppressore e come finì. Cerca gli indizi intorno a te.' },
      ],
      punti: [
        { id: 'bottino', x: 2150, tipo: 'esamina', etichetta: 'Ciò che avete preso', passi: [det('incursioni')] },
        { id: 'campo', x: 1900, tipo: 'esamina', etichetta: 'Il vostro accampamento', passi: [det('locuste')] },
        {
          id: 'sogno',
          x: 1600,
          tipo: 'ascolta',
          etichetta: 'Il tuo compagno ha fatto un sogno',
          richiede: ['bottino', 'campo'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'completa',
                id: 'sogno',
                consegna: 'Il tuo compagno racconta il sogno, e tu lo spieghi. Completa il versetto.',
                verso: 'gdc-7-13',
                testo: 'Quando Gedeone arrivò, c’era un uomo che raccontava un sogno al suo compagno e diceva: “Questo è il sogno che ho fatto. C’era un pane rotondo d’[[orzo]] che entrava rotolando nell’accampamento di Màdian. Ha raggiunto una [[tenda]] e l’ha colpita così forte da farla cadere. La tenda si è rovesciata ed è crollata a terra”. Il suo compagno gli rispose: “Non può essere altro che la [[spada]] di Gedeone, figlio di Iòas, un uomo d’Israele. Dio gli ha dato in mano Màdian e tutto l’accampamento”.',
                distrattori: ['frumento', 'torre', 'lancia'],
              },
            },
            { t: 'fx', fx: { k: 'nastro', chi: 'giocatore', testo: PAROLE.spada, dur: 4.5 } },
            det('orzo'),
            senti('m-sogno'),
          ],
        },
        {
          id: 'corni',
          x: 1200,
          tipo: 'ascolta',
          etichetta: 'Nella notte, corni e luci',
          richiede: ['sogno'],
          passi: [
            {
              t: 'narra',
              testo: 'All’improvviso, tutt’intorno all’accampamento, suonano i corni, si rompono giare, compaiono torce, e si sente gridare: «La spada di Geova e di Gedeone!»',
              certezza: 'scritto',
              fonti: [b('Giudici', 7, '19, 20')],
            },
            det('panico'),
          ],
        },
      ],
    },
  ],
  epilogo: [
    { t: 'fx', fx: { k: 'dissolvi', a: 1, dur: 1.6 } },
    det('quindicimila'),
  ],
};
