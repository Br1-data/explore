import type { Passo, Ruolo } from '@/contenuti/tipi';
import { F, b } from './base';
import { CANTIERE, INGRESSO, palcoCantiere, palcoIngresso } from './racconto';
import { mondo } from './scenari';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });
const io = 'contemporaneo';

/**
 * Il punto di vista di uno dei contemporanei di Noè: la Bibbia non dà nomi. Non è un
 * modello da imitare: serve a vedere il mondo che non ascoltò l’avvertimento
 * (Genesi 6:1-12; Matteo 24:37-39). Il diluvio non viene mostrato.
 */
export const contemporaneo: Ruolo = {
  id: 'contemporaneo',
  nome: 'Uno dei contemporanei di Noè',
  titolo: 'Il mondo che non si accorse di nulla',
  descrizione: 'Vivi in una civiltà progredita e violenta, senti l’avvertimento di Noè e continui la tua vita come se niente fosse.',
  fedelta:
    'Uno qualunque degli uomini di quel tempo: la Bibbia non dà nomi. Non è un modello da imitare: mostra il mondo che non ascoltò l’avvertimento, come lo descrivono Genesi 6, Gesù e le pubblicazioni citate dal capitolo 2. Il diluvio non viene mostrato.',
  modo: 'cammina',
  stile: 'empio',
  durata: '9-12 minuti',
  conclusione: 'Hai visto il racconto dalla parte di chi non ascoltò',
  scene: [
    {
      id: 'contemporaneo-mondo',
      titolo: 'Mangiavano e bevevano',
      luogo: 'Prima del diluvio',
      ...mondo(2400),
      inizioX: 200,
      folle: [
        { x0: 900, x1: 1200, n: 6, seme: 231, armati: 0.6, gruppo: 'rissa' },
        { x0: 1450, x1: 2100, n: 12, seme: 233, donne: 0.4, comportamento: 'vaga' },
      ],
      ingresso: [
        {
          t: 'narra',
          titolo: 'Sei uno dei contemporanei di Noè',
          testo: 'La Bibbia non dà nomi: sei uno degli uomini di quel tempo, in una terra piena di violenza.',
          certezza: 'scritto',
          fonti: [b('Genesi', 6, '11')],
        },
        { t: 'narra', testo: 'Questo punto di vista non è un modello da imitare: serve a capire il mondo che non ascoltò. Cerca gli indizi intorno a te.' },
      ],
      punti: [
        { id: 'fucina', x: 600, tipo: 'esamina', etichetta: 'Fucine e città', passi: [det('civilta')] },
        { id: 'giganti', x: 1050, tipo: 'esamina', etichetta: 'Uomini famosi', passi: [det('nefilim')] },
        { id: 'feste', x: 1600, tipo: 'esamina', etichetta: 'Feste e banchetti', passi: [det('intorpiditi')] },
      ],
    },
    {
      id: 'contemporaneo-cantiere',
      titolo: 'Un uomo costruisce un’arca',
      luogo: 'Il cantiere di Noè',
      ...palcoCantiere(io),
      inizioX: 2200,
      ingresso: [
        {
          t: 'narra',
          testo: 'Da anni Noè e i suoi figli costruiscono un’enorme arca di legno.',
          certezza: 'libro',
          fonti: [b('Genesi', 6, '14'), F.libro],
        },
      ],
      punti: [
        {
          id: 'avvertimento',
          x: 1900,
          tipo: 'ascolta',
          etichetta: 'Noè vi parla di un diluvio',
          passi: [
            ...CANTIERE.anni(),
            ...CANTIERE.avverte(),
            det('non-credevano'),
            {
              t: 'attivita',
              a: {
                tipo: 'domanda',
                id: 'quanti',
                domanda: 'Quante persone diedero ascolto all’avvertimento e si salvarono?',
                opzioni: ['Centinaia', 'Otto: Noè e altre sette persone', 'Nessuna'],
                corretta: 1,
                spiegazione: 'Dio salvò «Noè, predicatore di giustizia, e altre sette persone»: Noè, sua moglie, i tre figli e le loro mogli.',
                fonti: [b('2 Pietro', 2, '5'), F.w02],
              },
            },
          ],
        },
      ],
    },
    {
      id: 'contemporaneo-diluvio',
      titolo: 'Fino al giorno in cui Noè entrò nell’arca',
      luogo: 'Il giorno del diluvio',
      ...palcoIngresso(io),
      inizioX: 1750,
      ingresso: [
        {
          t: 'narra',
          testo: 'Noè e la sua famiglia entrano nell’arca, e con loro gli animali.',
          certezza: 'scritto',
          fonti: [b('Genesi', 7, '13-16')],
        },
        ...INGRESSO.entrano(io),
      ],
      punti: [
        {
          id: 'porta',
          x: 1500,
          tipo: 'osserva',
          etichetta: 'La porta dell’arca',
          passi: [
            ...INGRESSO.porta(),
            {
              t: 'attivita',
              a: {
                tipo: 'completa',
                id: 'giorni-di-noe',
                consegna: 'Gesù descriverà così la tua generazione. Completa le sue parole.',
                verso: 'mt-24-37',
                testo: 'Come furono i giorni di Noè, così sarà la presenza del Figlio dell’uomo. Infatti, come nei giorni prima del diluvio [[mangiavano]] e bevevano, gli uomini si sposavano e le donne erano date in moglie, fino al giorno in cui Noè entrò nell’arca, e non si [[accorsero]] di nulla finché venne il diluvio e li spazzò via tutti, così sarà la presenza del Figlio dell’uomo.',
                distrattori: ['pregavano', 'pentirono'],
              },
            },
            ...INGRESSO.pioggia(),
          ],
        },
      ],
    },
  ],
  epilogo: [
    { t: 'fx', fx: { k: 'dissolvi', a: 1, dur: 1.6 } },
    { t: 'narra', testo: 'Il diluvio venne, come Noè aveva avvertito.', certezza: 'scritto', fonti: [b('Genesi', 7, '10')] },
    senti('c-avvertimento'),
  ],
};
