import type { Passo, Ruolo } from '../../tipi';
import { F, PAROLE, b } from './base';
import { accampamento, tendaIael } from './scenari';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });

/**
 * Il punto di vista di Iael.
 *
 * Le situazioni in cui si sceglie che cosa fare qui non sono ricostruzioni: le
 * racconta Giudici 4 (`narrata`). La scelta fedele è ciò che Iael fece; le altre
 * mostrano che cosa si aspettava Sisera, che cosa non avrebbe potuto fare e che
 * cosa fecero altri.
 */
export const iael: Ruolo = {
  id: 'iael',
  nome: 'Iael',
  titolo: 'La donna che si schierò dalla parte di Geova',
  descrizione:
    'Mettiti nei suoi panni: scopri da che parte sta ciascuno, decidi che cosa fare quando il nemico di Israele arriva alla tua tenda, agisci da sola e ascolta come ti chiama il canto di Debora.',
  fedelta:
    'Giudici 4:17-22 e 5:24-27, come li spiega il capitolo 17 del libro. Le scelte riguardano momenti che il racconto descrive: la scelta fedele è ciò che Iael fece secondo le fonti. Il momento in cui colpisce Sisera non viene mostrato.',
  modo: 'cammina',
  stile: 'iael',
  durata: '15-20 minuti',
  conclusione: 'Hai vissuto il racconto nei panni di Iael',
  scene: [
    {
      id: 'iael-accampamento',
      titolo: 'Le tende di Heber',
      luogo: 'Vicino al grande albero di Zaanannim',
      ...accampamento(2400),
      inizioX: 160,
      ingresso: [
        {
          t: 'narra',
          titolo: 'Sei Iael',
          testo:
            'Sei la moglie di Heber il chenita e vivi in tende. Oggi tuo marito non è nell’accampamento. Cerca gli indizi intorno a te: alcune cose non hanno un segnale, ma luccicano quando ti avvicini.',
          certezza: 'libro',
          fonti: [F.libro, b('Giudici', 4, '17')],
        },
      ],
      punti: [
        {
          id: 'albero',
          x: 420,
          tipo: 'esamina',
          etichetta: 'Il grande albero',
          passi: [
            { t: 'verso', id: 'gdc-4-11', evidenzia: ['si era separato dai cheniti', 'vicino al grande albero di Zaanannìm'] },
            det('cheniti'),
          ],
        },
        {
          id: 'famiglia',
          x: 820,
          tipo: 'esamina',
          etichetta: 'La famiglia di tuo marito',
          passi: [det('parentela')],
        },
        {
          id: 'accordi',
          x: 1270,
          tipo: 'esamina',
          etichetta: 'Gli accordi di tuo marito',
          passi: [det('alleato'), senti('i-casa')],
        },
        {
          id: 'alleanze',
          x: 1880,
          tipo: 'leggi',
          etichetta: 'Da che parte sta ciascuno',
          richiede: ['albero', 'famiglia', 'accordi'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'classifica',
                id: 'alleanze',
                consegna: 'In questi giorni ognuno ha scelto da che parte stare. Metti ciascuno dalla sua parte.',
                categorie: ['Con Israele', 'Con Iabin'],
                voci: [
                  { testo: 'I cheniti, in generale', cat: 0, fonti: [F.libro] },
                  { testo: 'Heber il chenita, tuo marito', cat: 1, fonti: [b('Giudici', 4, '17'), F.libro] },
                  { testo: 'Sisera, capo dell’esercito', cat: 1, fonti: [b('Giudici', 4, '2')] },
                  { testo: 'Barac, figlio di Abinoam', cat: 0, fonti: [b('Giudici', 4, '6')] },
                  { testo: 'Debora, la profetessa', cat: 0, fonti: [b('Giudici', 4, '4')] },
                  { testo: 'I re di Canaan', cat: 1, fonti: [b('Giudici', 5, '19')] },
                  { testo: 'Gli uomini di Zabulon e di Neftali', cat: 0, fonti: [b('Giudici', 4, '10')] },
                ],
                dettaglio: 'non-israelita',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'iael-arrivo',
      titolo: 'Un uomo in fuga',
      luogo: 'Davanti alla tua tenda',
      ...accampamento(2400),
      inizioX: 1640,
      attori: [{ id: 'sisera', x: 2330, stile: 'sisera', verso: -1 }],
      ingresso: [
        {
          t: 'narra',
          testo: 'Un uomo arriva da solo, in fuga, verso le tende di Heber. È Sisera, il capo dell’esercito di Iabin.',
          certezza: 'scritto',
          fonti: [b('Giudici', 4, '17')],
        },
        { t: 'fx', fx: { k: 'vai', chi: 'sisera', x: 2040, vel: 130, attendi: true } },
      ],
      punti: [
        {
          id: 'riconosci',
          x: 1960,
          tipo: 'osserva',
          etichetta: 'Chi è quell’uomo',
          passi: [det('pericoloso'), det('profezia-forse')],
        },
        {
          id: 'decidi',
          x: 1960,
          tipo: 'agisci',
          etichetta: 'Che cosa fai?',
          richiede: ['riconosci'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'condotta',
                id: 'condotta-rifugio',
                narrata: true,
                situazione:
                  'Sisera è a pochi passi. È un guerriero forte ed esperto, e tu sei sola nell’accampamento. Tuo marito è in pace con il suo re.',
                base: [b('Giudici', 4, '17'), F.libro],
                opzioni: [
                  {
                    testo: 'Gli offri rifugio, come vorrebbe l’alleanza di tuo marito.',
                    esito:
                      'È ciò che Sisera si aspettava: pensava di trovare rifugio nell’accampamento di Heber. Evidentemente non immaginava che la moglie potesse pensarla diversamente dal marito.',
                    fonti: [F.libro],
                  },
                  {
                    testo: 'Lo affronti subito, prima che entri.',
                    esito:
                      'Iael sapeva che in un combattimento corpo a corpo non avrebbe mai avuto la meglio: Sisera era senz’altro un guerriero forte ed esperto.',
                    fonti: [F.libro],
                  },
                  {
                    testo: 'Ti nascondi e lo lasci passare oltre.',
                    esito:
                      'Forse fecero così gli abitanti di Meroz, se Sisera passò di lì. Il canto di Debora li ricorda come maledetti, «perché non sono venuti in aiuto di Geova».',
                    fonti: [F.it('Meroz'), b('Giudici', 5, '23')],
                  },
                  { testo: 'Gli vai incontro e lo inviti a entrare.', fedele: true, dettaglio: 'schierata' },
                ],
              },
            },
          ],
        },
        {
          id: 'invito',
          x: 1960,
          tipo: 'agisci',
          etichetta: 'Invitalo a entrare',
          richiede: ['decidi'],
          passi: [
            { t: 'fx', fx: { k: 'nastro', chi: 'giocatore', testo: PAROLE.invito, dur: 4.5 } },
            { t: 'verso', id: 'gdc-4-18', evidenzia: ['Non aver paura'] },
            { t: 'fx', fx: { k: 'vai', chi: 'sisera', x: 1830, vel: 90 } },
            senti('i-decisione'),
          ],
        },
      ],
    },
    {
      id: 'iael-tenda',
      titolo: 'Nella tua tenda',
      luogo: 'Un guerriero stanco',
      ...tendaIael(1500),
      inizioX: 900,
      attori: [{ id: 'sisera', x: 770, stile: 'sisera', verso: 1 }],
      ingresso: [
        {
          t: 'narra',
          testo: 'Sisera è entrato nella tua tenda.',
          certezza: 'scritto',
          fonti: [b('Giudici', 4, '18')],
        },
      ],
      punti: [
        {
          id: 'coperta',
          x: 840,
          tipo: 'agisci',
          etichetta: 'Coprilo con una coperta',
          passi: [
            { t: 'fx', fx: { k: 'posa', chi: 'sisera', posa: 'coperto' } },
            { t: 'fx', fx: { k: 'attendi', dur: 1.2 } },
          ],
        },
        {
          id: 'acqua',
          x: 840,
          tipo: 'ascolta',
          etichetta: 'Ti chiede qualcosa',
          richiede: ['coperta'],
          passi: [{ t: 'fx', fx: { k: 'nastro', chi: 'sisera', testo: PAROLE.acqua, dur: 4 } }],
        },
        {
          id: 'otre',
          x: 650,
          tipo: 'agisci',
          etichetta: 'Apri l’otre',
          richiede: ['acqua'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'completa',
                id: 'latte',
                consegna: 'Il canto di Debora ricorda che cosa gli desti. Completa il versetto.',
                verso: 'gdc-5-25',
                testo: 'Lui chiese [[acqua]], lei gli diede [[latte]]; in una splendida [[coppa]] gli offrì latte cagliato.',
                distrattori: ['vino', 'pane', 'brocca'],
              },
            },
            det('coppa-latte'),
          ],
        },
        {
          id: 'ordine',
          x: 840,
          tipo: 'ascolta',
          etichetta: 'Ti dà un ordine',
          richiede: ['otre'],
          passi: [
            { t: 'fx', fx: { k: 'nastro', chi: 'sisera', testo: PAROLE.entrata, dur: 3 } },
            { t: 'fx', fx: { k: 'nastro', chi: 'sisera', testo: PAROLE.rispondi, dur: 5 } },
            {
              t: 'narra',
              testo: 'Poi Sisera si addormenta.',
              certezza: 'scritto',
              fonti: [b('Giudici', 4, '21')],
            },
          ],
        },
        {
          id: 'attrezzi',
          x: 585,
          tipo: 'esamina',
          etichetta: 'Un martello e un piolo',
          richiede: ['ordine'],
          passi: [det('attrezzi')],
        },
        {
          id: 'agire',
          x: 700,
          tipo: 'agisci',
          etichetta: 'È il momento di agire',
          richiede: ['attrezzi'],
          passi: [
            { t: 'fx', fx: { k: 'dissolvi', a: 1, dur: 1.6 } },
            {
              t: 'narra',
              testo:
                'Iael si avvicina senza far rumore e si china accanto alla testa di Sisera. È questione di un attimo: Sisera muore.',
              certezza: 'libro',
              fonti: [b('Giudici', 4, '21'), F.libro],
            },
            det('nessun-errore'),
            det('non-lo-dice'),
            { t: 'fx', fx: { k: 'dissolvi', a: 0, dur: 1.6 } },
            senti('i-coraggio'),
          ],
        },
      ],
    },
    {
      id: 'iael-barac',
      titolo: 'L’uomo che stai cercando',
      luogo: 'Arriva Barac',
      ...tendaIael(1500),
      inizioX: 940,
      attori: [
        { id: 'sisera', x: 770, stile: 'sisera', verso: 1, posa: 'coperto' },
        { id: 'barac', x: 1460, stile: 'barac', verso: -1 },
      ],
      ingresso: [
        {
          t: 'narra',
          testo: 'Arriva Barac, all’inseguimento di Sisera.',
          certezza: 'scritto',
          fonti: [b('Giudici', 4, '22')],
        },
        { t: 'fx', fx: { k: 'vai', chi: 'barac', x: 1180, vel: 150, attendi: true } },
      ],
      punti: [
        {
          id: 'incontro',
          x: 1080,
          tipo: 'agisci',
          etichetta: 'Barac è qui',
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'condotta',
                id: 'condotta-barac',
                narrata: true,
                situazione: 'Barac sta inseguendo Sisera. Nella tua tenda c’è l’uomo che cerca.',
                base: [b('Giudici', 4, '22')],
                opzioni: [
                  {
                    testo: 'Resti all’entrata e rispondi di no, come ti aveva detto Sisera.',
                    esito:
                      'Era proprio ciò che Sisera le aveva ordinato: «Se qualcuno viene a chiederti: ‘C’è un uomo qui?’, rispondi di no».',
                    fonti: [b('Giudici', 4, '20')],
                  },
                  {
                    testo: 'Aspetti che sia Barac a cercare nella tenda.',
                    esito: 'Il racconto dice invece che fu Iael ad andargli incontro. Ebbe spirito d’iniziativa e coraggio.',
                    fonti: [b('Giudici', 4, '22'), F.donne],
                  },
                  { testo: 'Gli vai incontro.', fedele: true, dettaglio: 'uomo-cercato' },
                ],
              },
            },
            { t: 'fx', fx: { k: 'nastro', chi: 'giocatore', testo: PAROLE.mostra, dur: 4 } },
            { t: 'fx', fx: { k: 'vai', chi: 'barac', x: 860, vel: 100, attendi: true } },
          ],
        },
        {
          id: 'canto',
          x: 1000,
          tipo: 'leggi',
          etichetta: 'Che cosa dirà di te il canto',
          richiede: ['incontro'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'completa',
                id: 'benedetta',
                consegna: 'Nel canto di vittoria, Debora e Barac parlano di te. Completa il versetto.',
                verso: 'gdc-5-24',
                testo: 'Benedetta fra le [[donne]] è Iàel, moglie di Hèber il chenita; benedetta fra le donne che vivono in [[tende]].',
                distrattori: ['profetesse', 'città'],
              },
            },
            det('non-malvagia'),
          ],
        },
        {
          id: 'limiti',
          x: 1280,
          tipo: 'medita',
          etichetta: 'Ciò che potevi fare',
          richiede: ['canto'],
          passi: [det('tutto-cio-che-poteva'), det('oggi'), senti('i-limiti')],
        },
      ],
    },
  ],
  epilogo: [],
};
