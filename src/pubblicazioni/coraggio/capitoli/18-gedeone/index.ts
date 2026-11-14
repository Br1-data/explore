import { capitolo } from '../../comune';
import { APPROFONDISCI, DETTAGLI, SENSAZIONI, STUDIO, URL_CAPITOLO, VERSI } from './base';
import { gedeone } from './gedeone';
import { geova } from './geova';
import { ioas } from './ioas';
import { madianita } from './madianita';
import { trecento } from './trecento';

export const capitoloGedeone = capitolo({
  numero: 18,
  slug: 'gedeone',
  nome: 'Gedeone',
  titolo: 'Coraggioso e cauto',
  url: URL_CAPITOLO,
  date: 'Periodo dei giudici, 1450-1120 a.E.V. circa',
  passiDaLeggere: ['gdc-6-1', 'gdc-7-1', 'gdc-8-4', 'gdc-8-28'],
  versi: VERSI,
  dettagli: DETTAGLI,
  sensazioni: SENSAZIONI,
  ruoli: [gedeone, geova, ioas, trecento, madianita],
  studio: STUDIO,
  approfondisci: APPROFONDISCI,
});
