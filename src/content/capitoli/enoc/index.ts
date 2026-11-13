import type { Capitolo } from '../../tipi';
import { APPROFONDISCI, DETTAGLI, SENSAZIONI, STUDIO, URL_CAPITOLO, VERSI } from './base';
import { empio } from './empio';
import { enoc } from './enoc';
import { geova } from './geova';
import { matusalemme } from './matusalemme';

export const capitoloEnoc: Capitolo = {
  numero: 1,
  slug: 'enoc',
  nome: 'Enoc',
  titolo: 'Camminò con Dio',
  url: URL_CAPITOLO,
  date: '3404-3039 a.E.V.',
  passiDaLeggere: ['gen-5-21', 'ebr-11-5', 'giuda-14'],
  versi: VERSI,
  dettagli: DETTAGLI,
  sensazioni: SENSAZIONI,
  ruoli: [enoc, geova, matusalemme, empio],
  studio: STUDIO,
  approfondisci: APPROFONDISCI,
};
