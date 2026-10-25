const { cpSync, existsSync, mkdirSync, rmSync } = require('node:fs');
const path = require('node:path');

const source = path.resolve(__dirname, '../../packages/client/dist');
const destination = path.join(__dirname, 'app');
if (!existsSync(path.join(source, 'index.html'))) {
  throw new Error('Client non compilato. Esegui prima npm run build -w @segnale/client.');
}
rmSync(destination, { recursive: true, force: true });
mkdirSync(destination, { recursive: true });
cpSync(source, destination, { recursive: true });
