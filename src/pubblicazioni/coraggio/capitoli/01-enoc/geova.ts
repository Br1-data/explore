import type { Passo, Ruolo } from '@/contenuti/tipi';
import { F, b } from './base';
import { altura, mondo, notte, paradiso } from './scenari';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });

/**
 * Il punto di vista di Geova.
 *
 * Geova non viene raffigurato e non gli vengono attribuite parole o pensieri
 * che il racconto non riporta. Chi gioca sposta lo sguardo sulla scena e compie
 * soltanto gli atti che la Bibbia e il libro attribuiscono a Geova in questo
 * episodio: affida l’incarico, dà la forza, dà la conferma, prende Enoc.
 * I dettagli sono quelli che riguardano Geova: ciò che approva, ciò che fa,
 * perché lo fa.
 */
export const geova: Ruolo = {
  id: 'geova',
  nome: 'Geova',
  titolo: 'Ciò che Geova vede e fa',
  descrizione:
    'Guarda la terra, riconosci l’uomo che Geova approva e compi gli atti che il racconto gli attribuisce: affidare l’incarico, dare la forza, confermare, sottrarre al pericolo, ricordare.',
  fedelta:
    'Geova non viene raffigurato. Agisce solo come il racconto dice che agì: nessuna parola e nessun pensiero gli vengono attribuiti oltre a ciò che è scritto o che il libro spiega.',
  modo: 'osserva',
  stile: 'nessuno',
  durata: '12-15 minuti',
  conclusione: 'Hai ripercorso ciò che fece Geova',
  scene: [
    {
      id: 'geova-terra',
      titolo: 'Una sfida',
      luogo: 'La terra, sette generazioni dopo Adamo',
      ...mondo(3000),
      inizioX: 700,
      folle: [
        { x0: 1080, x1: 1250, n: 5, seme: 3, armati: 0.8, gruppo: 'rissa' },
        { x0: 1400, x1: 1800, n: 6, seme: 5, donne: 0.4, bimbi: 0.15, comportamento: 'vaga' },
        { x0: 2170, x1: 2360, n: 7, seme: 7, gruppo: 'invoca' },
        { x0: 2420, x1: 2600, n: 5, seme: 9, armati: 0.3, donne: 0.3, comportamento: 'vaga' },
        { x0: 900, x1: 2900, n: 12, seme: 13, piano: 'fondo', comportamento: 'vaga' },
      ],
      attori: [{ id: 'enoc', x: 2740, stile: 'enoc', percorso: [2660, 2860] }],
      ingresso: [
        {
          t: 'narra',
          titolo: 'Il punto di vista di Geova',
          testo:
            'Qui non muovi un personaggio: sposti lo sguardo sulla terra. Le azioni che compirai sono soltanto quelle che il racconto attribuisce a Geova.',
        },
        det('contesa'),
        {
          t: 'narra',
          testo:
            'Tra tutte queste persone ce n’è una che Geova approva. Sposta lo sguardo e cercala: quando ti avvicini, luccica.',
        },
      ],
      punti: [
        {
          id: 'cinque',
          x: 760,
          tipo: 'medita',
          etichetta: 'Dopo Abele',
          passi: [det('cinque-secoli')],
        },
        {
          id: 'trovato',
          x: 2760,
          tipo: 'esamina',
          etichetta: 'Un uomo diverso',
          passi: [
            det('settanta'),
            { t: 'verso', id: 'prov-27-11' },
            {
              t: 'attivita',
              a: {
                tipo: 'domanda',
                id: 'cuore',
                domanda: 'Secondo questo versetto, perché a Geova fa piacere che il suo «figlio» sia saggio?',
                opzioni: [
                  'Perché possa rispondere a chi lo accusa',
                  'Perché possa ricompensarlo',
                  'Perché la prova finisca prima',
                ],
                corretta: 0,
                dettaglio: 'rallegra',
              },
            },
            senti('g-rallegra'),
          ],
        },
      ],
    },
    {
      id: 'geova-incarico',
      titolo: 'Geova affida un incarico',
      luogo: 'Per la prima volta a un essere umano',
      ...altura(2000),
      inizioX: 700,
      attori: [{ id: 'enoc', x: 900, stile: 'enoc', verso: 1 }],
      ingresso: [
        {
          t: 'narra',
          testo: 'Geova dà a Enoc un incarico speciale: quello di profeta.',
          certezza: 'libro',
          fonti: [F.libro],
        },
      ],
      punti: [
        {
          id: 'incarico',
          x: 900,
          tipo: 'agisci',
          etichetta: 'Affida a Enoc l’incarico di profeta',
          passi: [det('primo-profeta'), det('spirito')],
        },
        {
          id: 'atti',
          x: 1300,
          tipo: 'leggi',
          etichetta: 'Chi fa che cosa',
          richiede: ['incarico'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'classifica',
                id: 'atti',
                consegna: 'In questo racconto alcune cose le fa Geova, altre le fa Enoc. Metti ognuna al suo posto.',
                categorie: ['Lo fa Geova', 'Lo fa Enoc'],
                voci: [
                  { testo: 'Affida l’incarico di profeta', cat: 0, fonti: [F.libro] },
                  { testo: 'Proclama il messaggio di giudizio', cat: 1, fonti: [F.libro] },
                  { testo: 'Dà la forza di proclamarlo', cat: 0, fonti: [F.w01] },
                  { testo: 'Rifiuta di adeguarsi al mondo malvagio', cat: 1, fonti: [F.libro] },
                  { testo: 'Conferma di essergli gradito', cat: 0, fonti: [b('Ebrei', 11, '5')] },
                  { testo: 'Non si fa intimidire', cat: 1, fonti: [F.w01] },
                  { testo: 'Lo sottrae al pericolo', cat: 0, fonti: [F.libro] },
                  { testo: 'Ama e rispetta il santo nome di Dio', cat: 1, fonti: [F.libro] },
                ],
                spiegazione: 'Il racconto distingue con cura ciò che fece Enoc da ciò che fece Geova per lui.',
              },
            },
          ],
        },
        {
          id: 'forza',
          x: 900,
          tipo: 'agisci',
          etichetta: 'Dagli la forza di proclamarlo',
          richiede: ['atti'],
          passi: [det('forza'), senti('g-incarico'), { t: 'fx', fx: { k: 'vai', chi: 'enoc', x: 1900, vel: 120 } }],
        },
        {
          id: 'parole',
          x: 1600,
          tipo: 'leggi',
          etichetta: 'Dove sono scritte le sue parole',
          facoltativo: true,
          passi: [det('solo-giuda')],
        },
      ],
    },
    {
      id: 'geova-interviene',
      titolo: 'Geova interviene',
      luogo: 'Spinto dall’amore',
      ...notte(3000),
      // Gli oggetti della visione compaiono attorno al punto in cui si trova Enoc.
      oggetti: [...notte(3000).oggetti, ...paradiso(880, 2760)],
      ambiente2: 'paradiso',
      inizioX: 1500,
      vars: { visione: 0, incalzo: 0 },
      folle: [
        {
          x0: 500,
          x1: 760,
          n: 9,
          seme: 43,
          armati: 0.7,
          torce: 0.5,
          comportamento: 'insegue',
          bersaglio: 'enoc',
          distanza: [1150, 330],
        },
      ],
      attori: [{ id: 'enoc', x: 2050, stile: 'enoc', verso: 1 }],
      ingresso: [
        {
          t: 'narra',
          testo:
            'Sembra che Enoc sia perseguitato dalle persone malvagie del suo tempo. La Bibbia non descrive la scena: dice che cosa fece Geova.',
          certezza: 'sembra',
          fonti: [F.libro],
        },
      ],
      punti: [
        {
          id: 'pericolo',
          x: 1150,
          tipo: 'osserva',
          etichetta: 'Chi vuole farlo tacere',
          passi: [{ t: 'fx', fx: { k: 'var', nome: 'incalzo', a: 0.45, dur: 3 } }, det('cura')],
        },
        {
          id: 'conferma',
          x: 2050,
          tipo: 'agisci',
          etichetta: 'Conferma a Enoc che ti è gradito',
          richiede: ['pericolo'],
          passi: [det('regalo'), { t: 'fx', fx: { k: 'var', nome: 'visione', a: 1, dur: 5 } }],
        },
        {
          id: 'prendi',
          x: 2050,
          tipo: 'agisci',
          etichetta: 'Prendi Enoc',
          richiede: ['conferma'],
          passi: [
            { t: 'fx', fx: { k: 'posa', chi: 'enoc', posa: 'sdraiato' } },
            { t: 'fx', fx: { k: 'attendi', dur: 1.6 } },
            det('amore'),
            det('addormentato'),
            { t: 'fx', fx: { k: 'dissolvi', a: 1, dur: 2.2 } },
            { t: 'fx', fx: { k: 'visibile', chi: 'enoc', v: false } },
            { t: 'fx', fx: { k: 'var', nome: 'visione', a: 0, dur: 0 } },
            { t: 'fx', fx: { k: 'var', nome: 'incalzo', a: 1, dur: 0 } },
            { t: 'fx', fx: { k: 'dissolvi', a: 0, dur: 2.2 } },
            det('prese'),
            det('corpo'),
            det('sottratto'),
            senti('g-protegge'),
          ],
        },
        {
          id: 'dove',
          x: 2300,
          tipo: 'leggi',
          etichetta: 'Dove lo porta',
          richiede: ['prendi'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'domanda',
                id: 'dove',
                domanda: 'Dove portò Enoc, Geova?',
                opzioni: [
                  'In cielo, dove continuò a vivere',
                  'Nel sonno della morte, al sicuro nella sua memoria',
                  'In un luogo nascosto, dove visse ancora',
                ],
                corretta: 1,
                dettaglio: 'non-cielo',
              },
            },
            det('verbo-greco'),
          ],
        },
        {
          id: 'memoria',
          x: 2520,
          tipo: 'agisci',
          etichetta: 'Custodiscilo nella memoria',
          richiede: ['dove'],
          passi: [det('memoria'), det('risurrezione'), det('ricompensa'), senti('g-memoria')],
        },
      ],
    },
  ],
  epilogo: [],
};
