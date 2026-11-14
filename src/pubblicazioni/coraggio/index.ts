import type { Pubblicazione } from '@/contenuti/tipi';
import { capitoloEnoc } from './capitoli/01-enoc';
import { colline } from './capitoli/01-enoc/scenari';
import { capitoloNoe } from './capitoli/02-noe';
import { capitoloBarac } from './capitoli/16-barac-debora';
import { capitoloIael } from './capitoli/17-iael';
import { ID } from './comune';
import { PARTI, URL_LIBRO } from './indice';

/** Il libro «Cammina coraggiosamente con Dio»: 54 capitoli in tre parti. */
export const coraggio: Pubblicazione = {
  id: ID,
  titolo: 'Cammina coraggiosamente con Dio',
  breve: 'il libro',
  url: URL_LIBRO,
  descrizione:
    'Ogni capitolo del libro diventa un racconto da vivere nei panni di chi c’era, scegliendo il punto di vista. I capitoli non ancora pronti si possono leggere su jw.org.',
  parti: PARTI,
  // I capitoli giocabili, in ordine: per aggiungerne uno basta importarlo qui.
  capitoli: [capitoloEnoc, capitoloNoe, capitoloBarac, capitoloIael],
  vetrina: { capitolo: 1, stile: 'enoc', scena: colline() },
};
