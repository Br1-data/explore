import type { Passo, Ruolo } from '../../tipi';
import { F, MESSAGGIO, VERSI } from './base';
import { DOMANDA_PASSATO, NASTRO } from './enoc';
import { altura, mondo, notte, paradiso, strada } from './scenari';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });

/**
 * Il punto di vista di Geova.
 *
 * Geova non viene raffigurato e non gli vengono attribuite parole o pensieri
 * che il racconto non riporta. Chi gioca sposta lo sguardo sulla scena e compie
 * soltanto gli atti che la Bibbia e il libro attribuiscono a Geova in questo
 * episodio: affida l’incarico, dà la forza, dà la conferma, prende Enoc.
 */
export const geova: Ruolo = {
  id: 'geova',
  nome: 'Geova',
  titolo: 'Ciò che Geova fa in questo racconto',
  descrizione:
    'Ripercorri il racconto compiendo gli atti che la Bibbia attribuisce a Geova: affida a Enoc l’incarico di profeta, gli dà la forza, gli conferma di essergli gradito, lo sottrae al pericolo.',
  fedelta:
    'Geova non viene raffigurato. Agisce solo come il racconto dice che agì: nessuna parola e nessun pensiero gli vengono attribuiti oltre a ciò che è scritto o che il libro spiega.',
  modo: 'osserva',
  stile: 'nessuno',
  durata: '10-12 minuti',
  conclusione: 'Hai ripercorso ciò che fece Geova',
  scene: [
    {
      id: 'geova-terra',
      titolo: 'Ciò che Geova vede',
      luogo: 'La settima generazione da Adamo',
      ...mondo(),
      inizioX: 700,
      folle: [
        { x0: 1080, x1: 1250, n: 5, seme: 3, armati: 0.8, gruppo: 'rissa' },
        { x0: 1400, x1: 1800, n: 6, seme: 5, donne: 0.4, bimbi: 0.15, comportamento: 'vaga' },
        { x0: 2170, x1: 2360, n: 7, seme: 7, gruppo: 'invoca' },
        { x0: 2420, x1: 2760, n: 6, seme: 9, armati: 0.3, donne: 0.3, comportamento: 'vaga' },
        { x0: 900, x1: 2800, n: 12, seme: 13, piano: 'fondo', comportamento: 'vaga' },
      ],
      attori: [{ id: 'enoc', x: 2950, stile: 'enoc', percorso: [2880, 3300] }],
      ingresso: [
        {
          t: 'narra',
          titolo: 'Il punto di vista di Geova',
          testo:
            'Qui non muovi un personaggio: sposti lo sguardo sulla scena. Le azioni che compirai sono soltanto quelle che il racconto attribuisce a Geova.',
        },
        det('spirito-ribelle'),
      ],
      punti: [
        {
          id: 'violenza',
          x: 1160,
          tipo: 'osserva',
          etichetta: 'Una terra violenta',
          passi: [det('norma'), det('caino-abele'), { t: 'verso', id: 'gen-4-23' }, det('lamec-versi')],
        },
        {
          id: 'nome',
          x: 2260,
          tipo: 'ascolta',
          etichetta: 'Il suo nome profanato',
          passi: [
            { t: 'verso', id: 'gen-4-26', evidenzia: ['si cominciò a invocare il nome di Geova'] },
            det('nome-profanato'),
            det('nome-come'),
          ],
        },
        {
          id: 'enoc',
          x: 3080,
          tipo: 'osserva',
          etichetta: 'Un uomo che cammina con lui',
          richiede: ['violenza', 'nome'],
          passi: [
            det('rifiuto-nome'),
            det('pacifico'),
            { t: 'verso', id: 'prov-27-11', evidenzia: ['rallegra il mio cuore'] },
            det('rallegra'),
            det('solo'),
            senti('g-rallegra'),
          ],
        },
      ],
    },
    {
      id: 'geova-incarico',
      titolo: 'Geova affida un incarico',
      luogo: 'Per la prima volta a un essere umano',
      ...altura(),
      inizioX: 700,
      attori: [{ id: 'enoc', x: 1240, stile: 'enoc', verso: 1 }],
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
          x: 1240,
          tipo: 'agisci',
          etichetta: 'Affida a Enoc il messaggio',
          passi: [
            det('profeta'),
            det('primo-profeta'),
            { t: 'verso', id: 'giuda-14', intro: 'Questo è il messaggio che Geova vuole far conoscere.' },
            {
              t: 'attivita',
              a: {
                tipo: 'componi',
                id: 'componi-messaggio',
                consegna: 'Ricomponi il messaggio nell’ordine del testo: è ciò che Enoc dovrà dire.',
                rif: VERSI['giuda-14'].rif,
                pezzi: MESSAGGIO,
              },
            },
            det('messaggio'),
            det('spirito'),
          ],
        },
        {
          id: 'certezza',
          x: 1700,
          tipo: 'leggi',
          etichetta: 'Un giudizio certo',
          richiede: ['incarico'],
          passi: [DOMANDA_PASSATO, det('al-passato'), det('miriadi'), det('opere-parole')],
        },
        {
          id: 'forza',
          x: 1240,
          tipo: 'agisci',
          etichetta: 'Dagli la forza di proclamarlo',
          richiede: ['incarico', 'certezza'],
          passi: [
            det('forza'),
            senti('g-incarico'),
            { t: 'fx', fx: { k: 'vai', chi: 'enoc', x: 2480, vel: 120 } },
          ],
        },
      ],
    },
    {
      id: 'geova-strada',
      titolo: 'Tutto ciò che Geova voleva che sapessero',
      luogo: 'Enoc porta il messaggio',
      ...strada(),
      inizioX: 900,
      vars: { agitazione: 0 },
      folle: [
        { x0: 780, x1: 1240, n: 13, seme: 31, reagisce: true, armati: 0.15, donne: 0.3, comportamento: 'vaga' },
        { x0: 1480, x1: 1980, n: 14, seme: 33, reagisce: true, armati: 0.3, donne: 0.25, comportamento: 'vaga' },
        { x0: 2220, x1: 2760, n: 15, seme: 35, reagisce: true, armati: 0.4, donne: 0.2, comportamento: 'vaga' },
        { x0: 600, x1: 3000, n: 14, seme: 37, piano: 'fondo', comportamento: 'vaga' },
      ],
      attori: [{ id: 'enoc', x: 1010, stile: 'enoc', verso: 1 }],
      ingresso: [
        {
          t: 'narra',
          testo:
            'Enoc deve portare il messaggio a persone che hanno un atteggiamento e un comportamento molto diversi dai suoi.',
          certezza: 'libro',
          fonti: [F.libro],
        },
      ],
      punti: [
        {
          id: 'ascolta-1',
          x: 1010,
          tipo: 'ascolta',
          etichetta: 'Enoc proclama il messaggio',
          passi: [
            { t: 'fx', fx: { k: 'posa', chi: 'enoc', posa: 'proclama' } },
            { t: 'fx', fx: { k: 'nastro', chi: 'enoc', testo: NASTRO[0], dur: 5 } },
            { t: 'fx', fx: { k: 'var', nome: 'agitazione', a: 0.35, dur: 2.5 } },
            det('strada'),
            { t: 'fx', fx: { k: 'vai', chi: 'enoc', x: 1730, vel: 130 } },
          ],
        },
        {
          id: 'ascolta-2',
          x: 1730,
          tipo: 'ascolta',
          etichetta: 'Enoc continua',
          richiede: ['ascolta-1'],
          passi: [
            { t: 'fx', fx: { k: 'posa', chi: 'enoc', posa: 'proclama' } },
            { t: 'fx', fx: { k: 'nastro', chi: 'enoc', testo: NASTRO[1], dur: 5.5 } },
            { t: 'fx', fx: { k: 'var', nome: 'agitazione', a: 0.7, dur: 2.5 } },
            det('quattro-volte'),
            det('infastiditi'),
            { t: 'fx', fx: { k: 'vai', chi: 'enoc', x: 2490, vel: 130 } },
          ],
        },
        {
          id: 'ascolta-3',
          x: 2490,
          tipo: 'ascolta',
          etichetta: 'Enoc dice tutto',
          richiede: ['ascolta-2'],
          passi: [
            { t: 'fx', fx: { k: 'posa', chi: 'enoc', posa: 'proclama' } },
            { t: 'fx', fx: { k: 'nastro', chi: 'enoc', testo: NASTRO[2], dur: 5 } },
            { t: 'fx', fx: { k: 'var', nome: 'agitazione', a: 1, dur: 2.5 } },
            det('non-gradite'),
            det('reazione'),
            { t: 'fx', fx: { k: 'posa', chi: 'enoc', posa: 'fermo' } },
          ],
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
          passi: [det('scherni'), { t: 'fx', fx: { k: 'var', nome: 'incalzo', a: 0.45, dur: 3 } }, det('come-abele')],
        },
        {
          id: 'conferma',
          x: 2050,
          tipo: 'agisci',
          etichetta: 'Conferma a Enoc che ti è gradito',
          richiede: ['pericolo'],
          passi: [
            { t: 'verso', id: 'ebr-11-5', evidenzia: ['prima che fosse portato via ebbe la conferma di essere gradito a Dio'] },
            det('conferma'),
            det('regalo'),
            {
              t: 'narra',
              testo:
                'Le Scritture non rivelano in che modo Geova gli diede quella conferma. Forse gli fece avere una visione di ciò che lo aspettava.',
              certezza: 'sembra',
              fonti: [F.libro, F.w01],
            },
            { t: 'fx', fx: { k: 'var', nome: 'visione', a: 1, dur: 5 } },
            det('visione'),
          ],
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
            { t: 'verso', id: 'gen-5-24', evidenzia: ['Poi nessuno lo vide più, perché Dio lo prese'] },
            det('prese'),
            det('non-trovato'),
            det('corpo'),
            senti('g-protegge'),
          ],
        },
        {
          id: 'memoria',
          x: 2520,
          tipo: 'agisci',
          etichetta: 'Custodiscilo nella memoria',
          richiede: ['prendi'],
          passi: [det('memoria'), det('risurrezione'), { t: 'verso', id: 'ebr-11-6' }, det('ricompensa'), senti('g-memoria')],
        },
      ],
    },
  ],
  epilogo: [det('non-cielo'), det('per-fede'), det('cura')],
};
