import { createServer } from 'node:http';
import { PROTOCOL_VERSION } from '@segnale/shared';

const port = Number(process.env.PORT ?? 2567);

createServer((_req, res) => {
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ ok: true, protocol: PROTOCOL_VERSION }));
}).listen(port, () => console.log(`Segnale Remoto server su http://localhost:${port}`));
