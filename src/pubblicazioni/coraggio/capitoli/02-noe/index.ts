import { capitolo } from '../../comune';
import { APPROFONDISCI, DETTAGLI, SENSAZIONI, STUDIO, URL_CAPITOLO, VERSI } from './base';
import { contemporaneo } from './contemporaneo';
import { figlio } from './figlio';
import { geova } from './geova';
import { moglie } from './moglie';
import { noe } from './noe';

export const capitoloNoe = capitolo({
  numero: 2,
  slug: 'noe',
  nome: 'Noè',
  titolo: 'Condannò il mondo',
  url: URL_CAPITOLO,
  date: 'Il diluvio: 2370 a.E.V.',
  passiDaLeggere: ['gen-6-1', 'gen-7-1', 'gen-8-1', 'gen-9-8', 'ebr-11-7', '2pt-2-5'],
  versi: VERSI,
  dettagli: DETTAGLI,
  sensazioni: SENSAZIONI,
  ruoli: [noe, geova, moglie, figlio, contemporaneo],
  studio: STUDIO,
  approfondisci: APPROFONDISCI,
});
