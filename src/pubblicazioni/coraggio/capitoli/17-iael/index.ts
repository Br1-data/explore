import { capitolo } from '../../comune';
import { barac } from './barac';
import { APPROFONDISCI, DETTAGLI, SENSAZIONI, STUDIO, URL_CAPITOLO, VERSI } from './base';
import { debora } from './debora';
import { geova } from './geova';
import { iael } from './iael';
import { madre } from './madre';
import { sisera } from './sisera';

export const capitoloIael = capitolo({
  numero: 17,
  slug: 'iael',
  nome: 'Iael',
  titolo: 'Benedetta fra le donne',
  url: URL_CAPITOLO,
  date: 'Periodo dei giudici, 1450-1120 a.E.V. circa',
  passiDaLeggere: ['gdc-4-9', 'gdc-4-11', 'gdc-4-17', 'gdc-5-24-31'],
  versi: VERSI,
  dettagli: DETTAGLI,
  sensazioni: SENSAZIONI,
  ruoli: [iael, geova, sisera, barac, debora, madre],
  studio: STUDIO,
  approfondisci: APPROFONDISCI,
});
