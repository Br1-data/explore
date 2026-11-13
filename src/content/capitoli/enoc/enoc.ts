import type { Passo, Ruolo } from '../../tipi';
import { F, MESSAGGIO, VERSI, b } from './base';
import { altura, colline, mondo, notte, quiete, strada } from './scenari';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });

/** Giuda 15 con le quattro ricorrenze da trovare tra [[ ]]. */
export const GIUDA_15_DA_TROVARE =
  '…per eseguire il giudizio contro tutti e dimostrare la colpevolezza di tutti gli [[empi]] per tutte le opere [[empie]] che hanno [[empiamente]] compiuto e per tutte le cose offensive che gli [[empi]] peccatori hanno detto contro di lui.';

export const NASTRO = [
  'Ecco, Geova è venuto con le sue sante miriadi per eseguire il giudizio contro tutti…',
  '…e dimostrare la colpevolezza di tutti gli empi per tutte le opere empie che hanno empiamente compiuto…',
  '…e per tutte le cose offensive che gli empi peccatori hanno detto contro di lui.',
];

export const DOMANDA_PASSATO: Passo = {
  t: 'attivita',
  a: {
    tipo: 'domanda',
    id: 'tempo-profezia',
    domanda: 'Rileggi l’inizio del messaggio. In che tempo è formulata la profezia?',
    opzioni: ['Al futuro: «Geova verrà»', 'Al passato: «Geova è venuto»', 'Al presente: «Geova viene»'],
    corretta: 1,
    spiegazione:
      'La profezia è formulata al passato, come se Dio avesse già portato quel giudizio: tanto era certo che si sarebbe adempiuta.',
    fonti: [F.libro, b('Giuda', 1, '14')],
  },
};

export const enoc: Ruolo = {
  id: 'enoc',
  nome: 'Enoc',
  titolo: 'Il profeta che camminò con Dio',
  descrizione:
    'Vivi il racconto dal suo punto di vista: un mondo violento, trecento anni di cammino, un messaggio da portare, il pericolo, la conferma di essere gradito a Dio.',
  fedelta:
    'Genesi 5:21-24, Ebrei 11:5 e Giuda 14, 15, come li racconta il capitolo 1 del libro. Dove la Bibbia tace, il gioco lo dice.',
  modo: 'cammina',
  stile: 'enoc',
  durata: '15-20 minuti',
  conclusione: 'Hai vissuto il racconto come Enoc',
  scene: [
    {
      id: 'enoc-mondo',
      titolo: 'Un mondo diverso da te',
      luogo: 'La settima generazione da Adamo',
      ...mondo(),
      inizioX: 140,
      folle: [
        { x0: 1080, x1: 1250, n: 5, seme: 3, armati: 0.8, gruppo: 'rissa' },
        { x0: 1400, x1: 1800, n: 6, seme: 5, donne: 0.4, bimbi: 0.15, comportamento: 'vaga' },
        { x0: 2170, x1: 2360, n: 7, seme: 7, gruppo: 'invoca' },
        { x0: 2420, x1: 2760, n: 6, seme: 9, armati: 0.3, donne: 0.3, comportamento: 'vaga' },
        { x0: 900, x1: 2800, n: 12, seme: 13, piano: 'fondo', comportamento: 'vaga' },
      ],
      zone: [{ x0: 1040, x1: 2780, tipo: 'pressione', forza: 0.3 }],
      ingresso: [
        {
          t: 'narra',
          titolo: 'Sei Enoc',
          testo:
            'Sei molto diverso dai tuoi contemporanei, e sai che cosa significa sentirsi soli. Attraversa il mondo in cui vivi e osserva che cosa lo distingue da te.',
          certezza: 'libro',
          fonti: [F.libro],
        },
      ],
      punti: [
        {
          id: 'generazioni',
          x: 380,
          tipo: 'medita',
          etichetta: 'La settima generazione',
          passi: [
            { t: 'schema', id: 'generazioni', intro: 'La tua generazione è la settima a partire da Adamo ed Eva.' },
            det('settimo'),
            det('adamo-vivo'),
            det('spirito-ribelle'),
          ],
        },
        {
          id: 'violenza',
          x: 1160,
          tipo: 'osserva',
          etichetta: 'Lo spirito violento del tempo',
          passi: [
            det('norma'),
            {
              t: 'narra',
              testo: 'Nei campi, Caino aveva aggredito suo fratello Abele e lo aveva ucciso.',
              arte: 'caino-abele',
              certezza: 'scritto',
              fonti: [b('Genesi', 4, '8')],
            },
            det('caino-abele'),
            { t: 'verso', id: 'gen-4-23', intro: 'La Bibbia conserva le parole di un discendente di Caino.' },
            det('lamec-versi'),
            { t: 'schema', id: 'due-linee' },
            det('due-settimi'),
            senti('pacifico'),
          ],
        },
        {
          id: 'citta',
          x: 1650,
          tipo: 'osserva',
          etichetta: 'Ciò che gli uomini costruiscono',
          facoltativo: true,
          passi: [det('citta'), det('cinque-secoli')],
        },
        {
          id: 'nome',
          x: 2230,
          tipo: 'ascolta',
          etichetta: 'Il nome di Dio sulle loro labbra',
          passi: [
            { t: 'verso', id: 'gen-4-26', evidenzia: ['si cominciò a invocare il nome di Geova'] },
            det('nome-profanato'),
            det('quattro-secoli'),
            det('nome-come'),
            det('rifiuto-nome'),
            senti('nome'),
          ],
        },
        {
          id: 'oltre',
          x: 3080,
          tipo: 'medita',
          etichetta: 'Continui a essere un uomo pacifico',
          richiede: ['violenza', 'nome'],
          passi: [det('pacifico'), det('solo'), det('antenati'), senti('solo')],
        },
      ],
    },
    {
      id: 'enoc-cammino',
      titolo: 'Continuò a camminare',
      luogo: 'Trecento anni',
      ...colline(),
      inizioX: 160,
      folle: [{ x0: 380, x1: 700, n: 5, seme: 21, donne: 0.4, bimbi: 0.6, comportamento: 'vaga' }],
      ingresso: [
        {
          t: 'narra',
          testo:
            'Ti rifiuti di adeguarti al mondo che ti circonda. La Bibbia riassume la tua vita in poche parole: «continuò a camminare con il vero Dio».',
          certezza: 'libro',
          fonti: [F.libro, b('Genesi', 5, '22')],
        },
      ],
      punti: [
        {
          id: 'casa',
          x: 520,
          tipo: 'osserva',
          etichetta: 'La tua famiglia',
          passi: [
            { t: 'verso', id: 'gen-5-21', evidenzia: ['all’età di 65 anni generò Matusalemme', 'generò figli e figlie'] },
            det('a-65'),
            det('trecento'),
            det('famiglia'),
            senti('famiglia'),
          ],
        },
        {
          id: 'discendenza',
          x: 980,
          tipo: 'osserva',
          etichetta: 'Figli, e figli dei figli',
          facoltativo: true,
          passi: [{ t: 'schema', id: 'vite' }, det('nipote'), det('lamec-fede')],
        },
        {
          id: 'sentiero',
          x: 1420,
          tipo: 'leggi',
          etichetta: '«Continuò a camminare»',
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'trova',
                id: 'due-volte',
                consegna: 'In questi versetti una frase è scritta due volte. Toccala entrambe le volte.',
                rif: 'Genesi 5:22-24',
                testo:
                  'Dopo la nascita di Matusalemme, Ènoc [[continuò a camminare con il vero Dio]] per 300 anni. E generò figli e figlie. L’intera vita di Ènoc fu dunque di 365 anni. Ènoc [[continuò a camminare con il vero Dio]]. Poi nessuno lo vide più, perché Dio lo prese.',
                spiegazione: 'La stessa frase apre e chiude il racconto dei suoi trecento anni.',
              },
            },
            det('due-volte'),
            det('verbo'),
            det('familiarita'),
            det('due-modi'),
            senti('trecento'),
          ],
        },
        {
          id: 'meditare',
          x: 2080,
          tipo: 'medita',
          etichetta: 'Ciò che è accaduto ai tuoi antenati',
          passi: [
            { t: 'verso', id: 'gen-3-24', intro: 'Il giardino di Eden non è più accessibile.' },
            {
              t: 'narra',
              testo: 'Il giardino di Eden, protetto da cherubini e da una spada fiammeggiante.',
              arte: 'eden',
              certezza: 'scritto',
              fonti: [b('Genesi', 3, '24')],
            },
            {
              t: 'narra',
              testo: 'Adamo ed Eva, invecchiati.',
              arte: 'anziani',
              certezza: 'libro',
              fonti: [F.immagineA],
            },
            {
              t: 'narra',
              testo: 'Caino, in piedi accanto al corpo di suo fratello Abele.',
              arte: 'caino-abele',
              certezza: 'scritto',
              fonti: [b('Genesi', 4, '8')],
            },
            det('eden'),
            { t: 'verso', id: 'gen-3-15', intro: 'In Eden Geova aveva parlato di un’ostilità che sarebbe durata.' },
            det('ostilita'),
            det('adamo-info'),
            senti('medita'),
          ],
        },
        {
          id: 'aiuto',
          x: 2640,
          tipo: 'medita',
          etichetta: 'Che cosa ti aiuta a restare fedele',
          facoltativo: true,
          passi: [det('aiuto'), det('settanta')],
        },
      ],
    },
    {
      id: 'enoc-incarico',
      titolo: 'Un incarico speciale',
      luogo: 'Il secondo modo di camminare con Dio',
      ...altura(),
      inizioX: 140,
      ingresso: [
        {
          t: 'narra',
          testo:
            'C’è un secondo modo in cui cammini con Dio: fai quello che lui ti chiede di fare. E ciò che ti chiede adesso richiede ancora più coraggio.',
          certezza: 'libro',
          fonti: [F.libro],
        },
        det('profeta'),
      ],
      punti: [
        {
          id: 'incarico',
          x: 520,
          tipo: 'medita',
          etichetta: 'Profeta: mai nessuno prima',
          passi: [det('primo-profeta'), det('spirito')],
        },
        {
          id: 'dove',
          x: 900,
          tipo: 'leggi',
          etichetta: 'Dove sono scritte le tue parole',
          facoltativo: true,
          passi: [det('solo-giuda')],
        },
        {
          id: 'messaggio',
          x: 1240,
          tipo: 'leggi',
          etichetta: 'Il messaggio',
          passi: [
            { t: 'verso', id: 'giuda-14', intro: 'Questo è il messaggio che devi portare.' },
            {
              t: 'attivita',
              a: {
                tipo: 'componi',
                id: 'componi-messaggio',
                consegna: 'Fissalo nella mente: ricomponi il messaggio nell’ordine del testo.',
                rif: VERSI['giuda-14'].rif,
                pezzi: MESSAGGIO,
              },
            },
            det('messaggio'),
            det('miriadi'),
          ],
        },
        {
          id: 'passato',
          x: 1620,
          tipo: 'leggi',
          etichetta: '«È venuto»',
          richiede: ['messaggio'],
          passi: [DOMANDA_PASSATO, det('al-passato')],
        },
        {
          id: 'quattro',
          x: 1960,
          tipo: 'leggi',
          etichetta: 'Una parola che ritorna',
          richiede: ['messaggio'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'trova',
                id: 'quattro-volte',
                consegna: 'Nel messaggio un concetto ritorna più volte. Tocca ogni parola che lo esprime.',
                rif: 'Giuda 15',
                testo: GIUDA_15_DA_TROVARE,
                spiegazione: 'Il concetto di empietà è ripetuto ben quattro volte.',
              },
            },
            det('quattro-volte'),
            det('empi-significato'),
            det('opere-parole'),
          ],
        },
        {
          id: 'scendere',
          x: 2330,
          tipo: 'medita',
          etichetta: 'Prima di scendere tra la gente',
          richiede: ['messaggio', 'passato', 'quattro'],
          passi: [det('forza'), senti('incarico')],
        },
      ],
    },
    {
      id: 'enoc-strada',
      titolo: 'In una strada affollata',
      luogo: 'Persone molto diverse da te',
      ...strada(),
      inizioX: 150,
      vars: { agitazione: 0 },
      folle: [
        { x0: 780, x1: 1240, n: 13, seme: 31, reagisce: true, armati: 0.15, donne: 0.3, comportamento: 'vaga' },
        { x0: 1480, x1: 1980, n: 14, seme: 33, reagisce: true, armati: 0.3, donne: 0.25, comportamento: 'vaga' },
        { x0: 2220, x1: 2760, n: 15, seme: 35, reagisce: true, armati: 0.4, donne: 0.2, comportamento: 'vaga' },
        { x0: 600, x1: 3000, n: 14, seme: 37, piano: 'fondo', comportamento: 'vaga' },
      ],
      zone: [{ x0: 740, x1: 2800, tipo: 'pressione', forza: 0.3 }],
      ingresso: [
        {
          t: 'narra',
          testo:
            'Devi portare il messaggio a persone che hanno un atteggiamento e un comportamento molto diversi dai tuoi.',
          certezza: 'libro',
          fonti: [F.libro],
        },
        det('strada'),
      ],
      punti: [
        {
          id: 'parla-1',
          x: 1010,
          tipo: 'agisci',
          etichetta: 'Proclama il messaggio',
          passi: [
            { t: 'fx', fx: { k: 'posa', chi: 'giocatore', posa: 'proclama' } },
            { t: 'fx', fx: { k: 'nastro', chi: 'giocatore', testo: NASTRO[0], dur: 5 } },
            { t: 'fx', fx: { k: 'var', nome: 'agitazione', a: 0.35, dur: 2.5 } },
            det('infastiditi'),
            { t: 'fx', fx: { k: 'posa', chi: 'giocatore', posa: 'fermo' } },
          ],
        },
        {
          id: 'parla-2',
          x: 1730,
          tipo: 'agisci',
          etichetta: 'Continua: non hai detto tutto',
          richiede: ['parla-1'],
          passi: [
            { t: 'fx', fx: { k: 'posa', chi: 'giocatore', posa: 'proclama' } },
            { t: 'fx', fx: { k: 'nastro', chi: 'giocatore', testo: NASTRO[1], dur: 5.5 } },
            { t: 'fx', fx: { k: 'var', nome: 'agitazione', a: 0.7, dur: 2.5 } },
            {
              t: 'narra',
              testo: 'Quattro volte lo stesso concetto: empietà. Di sicuro parole così non risultano gradite a chi ascolta.',
              certezza: 'libro',
              fonti: [F.libro],
            },
            { t: 'fx', fx: { k: 'posa', chi: 'giocatore', posa: 'fermo' } },
          ],
        },
        {
          id: 'parla-3',
          x: 2490,
          tipo: 'agisci',
          etichetta: 'Di’ tutto ciò che Geova vuole che sappiano',
          richiede: ['parla-2'],
          passi: [
            { t: 'fx', fx: { k: 'posa', chi: 'giocatore', posa: 'proclama' } },
            { t: 'fx', fx: { k: 'nastro', chi: 'giocatore', testo: NASTRO[2], dur: 5 } },
            { t: 'fx', fx: { k: 'var', nome: 'agitazione', a: 1, dur: 2.5 } },
            det('non-gradite'),
            { t: 'fx', fx: { k: 'posa', chi: 'giocatore', posa: 'fermo' } },
          ],
        },
        {
          id: 'detto-tutto',
          x: 3080,
          tipo: 'medita',
          etichetta: 'Hai detto tutto',
          richiede: ['parla-3'],
          passi: [det('reazione'), senti('strada')],
        },
      ],
    },
    {
      id: 'enoc-pericolo',
      titolo: 'In grave pericolo',
      luogo: 'La Bibbia lo lascia intendere',
      ...notte(),
      inizioX: 420,
      folle: [
        {
          x0: 0,
          x1: 200,
          n: 9,
          seme: 43,
          armati: 0.7,
          torce: 0.5,
          comportamento: 'insegue',
          distanza: [470, 250],
        },
      ],
      ingresso: [
        {
          t: 'narra',
          testo:
            'Sembra che tu sia perseguitato dalle persone malvagie del tuo tempo. La Bibbia non descrive la scena: dice soltanto come finì.',
          certezza: 'sembra',
          fonti: [F.libro],
        },
      ],
      punti: [
        {
          id: 'dietro',
          x: 900,
          tipo: 'ascolta',
          etichetta: 'Alle tue spalle',
          passi: [det('scherni')],
        },
        {
          id: 'abele',
          x: 1680,
          tipo: 'medita',
          etichetta: 'Non ti fai intimidire',
          passi: [det('come-abele'), senti('pericolo')],
        },
        {
          id: 'cura',
          x: 2620,
          tipo: 'medita',
          etichetta: 'Non ti raggiungono',
          richiede: ['dietro', 'abele'],
          passi: [det('amore'), det('cura')],
        },
      ],
    },
    {
      id: 'enoc-gradito',
      titolo: 'Gradito a Dio',
      luogo: 'Prima di essere portato via',
      ...quiete(),
      ambiente2: 'paradiso',
      inizioX: 150,
      vars: { visione: 0, ricerca: 0 },
      folle: [
        {
          x0: 1350,
          x1: 2150,
          n: 7,
          seme: 47,
          armati: 0.6,
          torce: 0.6,
          comportamento: 'cerca',
          seVar: 'ricerca',
        },
      ],
      ingresso: [
        {
          t: 'narra',
          testo: 'Prima di portarti via, Geova ti fa un regalo speciale.',
          certezza: 'libro',
          fonti: [F.libro],
        },
      ],
      punti: [
        {
          id: 'conferma',
          x: 620,
          tipo: 'leggi',
          etichetta: 'La conferma',
          passi: [
            { t: 'verso', id: 'ebr-11-5', evidenzia: ['prima che fosse portato via ebbe la conferma di essere gradito a Dio'] },
            det('conferma'),
            det('regalo'),
          ],
        },
        {
          id: 'visione',
          x: 1400,
          tipo: 'osserva',
          etichetta: 'Ciò che ti aspetta',
          richiede: ['conferma'],
          passi: [
            {
              t: 'narra',
              testo:
                'Le Scritture non rivelano in che modo ricevi quella conferma. Forse Geova ti fa avere una visione di ciò che ti aspetta.',
              certezza: 'sembra',
              fonti: [F.libro, F.w01],
            },
            { t: 'fx', fx: { k: 'var', nome: 'visione', a: 1, dur: 5 } },
            det('visione'),
            senti('conferma'),
          ],
        },
        {
          id: 'prese',
          x: 1730,
          tipo: 'agisci',
          etichetta: 'Chiudi gli occhi',
          richiede: ['visione'],
          passi: [
            { t: 'fx', fx: { k: 'posa', chi: 'giocatore', posa: 'sdraiato' } },
            { t: 'fx', fx: { k: 'attendi', dur: 1.6 } },
            det('addormentato'),
            { t: 'fx', fx: { k: 'dissolvi', a: 1, dur: 2.2 } },
            { t: 'fx', fx: { k: 'visibile', chi: 'giocatore', v: false } },
            { t: 'fx', fx: { k: 'var', nome: 'visione', a: 0, dur: 0 } },
            { t: 'fx', fx: { k: 'var', nome: 'ricerca', a: 1, dur: 0 } },
            { t: 'fx', fx: { k: 'camera', x: 1730, dur: 0 } },
            { t: 'fx', fx: { k: 'dissolvi', a: 0, dur: 2.2 } },
            { t: 'verso', id: 'gen-5-24', evidenzia: ['Poi nessuno lo vide più, perché Dio lo prese'] },
            det('prese'),
            det('non-trovato'),
            det('corpo'),
          ],
        },
      ],
    },
  ],
  epilogo: [
    det('non-cielo'),
    det('verbo-greco'),
    det('anni-365'),
    det('per-fede'),
    det('memoria'),
    det('risurrezione'),
  ],
};
