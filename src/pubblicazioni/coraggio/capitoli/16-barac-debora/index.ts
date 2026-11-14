import { capitolo } from '../../comune';
import { barac } from './barac';
import { APPROFONDISCI, DETTAGLI, SENSAZIONI, STUDIO, URL_CAPITOLO, VERSI } from './base';
import { debora } from './debora';
import { geova } from './geova';
import { sisera } from './sisera';
import { volontario } from './volontario';

export const capitoloBarac = capitolo({
  numero: 16,
  slug: 'barac-debora',
  nome: 'Barac e Debora',
  titolo: 'Verrò senz’altro',
  url: URL_CAPITOLO,
  date: 'Periodo dei giudici, 1450-1120 a.E.V. circa',
  passiDaLeggere: ['gdc-4-1', 'gdc-4-23', 'gdc-5-1'],
  versi: VERSI,
  dettagli: DETTAGLI,
  sensazioni: SENSAZIONI,
  ruoli: [debora, barac, geova, volontario, sisera],
  studio: STUDIO,
  approfondisci: APPROFONDISCI,
});
