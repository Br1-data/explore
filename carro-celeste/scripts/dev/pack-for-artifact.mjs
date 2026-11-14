// Development aid: prepares the files for publishing the viewer as a claude.ai Artifact.
// Artifacts do not serve .stl or .glb, so every model is gzipped and written as base64 text
// (`<name>.gz.b64.txt`); the viewer reads those when it runs inside an Artifact.
// The page itself is index.html without its <html>/<head>/<body> wrappers.
//
//   node scripts/dev/pack-for-artifact.mjs <output directory>
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const root = fileURLToPath(new URL('../../', import.meta.url));
const out = process.argv[2];
if (!out) throw new Error('usage: node scripts/dev/pack-for-artifact.mjs <output directory>');

const html = readFileSync(join(root, 'index.html'), 'utf8');
const pick = (pattern) => html.match(pattern)[0];
const page = [
  pick(/<title>[\s\S]*?<\/title>/),
  pick(/<meta name="claude:viewport-fit-sides"[^>]*>/),
  pick(/<link\s+rel="stylesheet"[\s\S]*?\/>/),
  pick(/<style>[\s\S]*?<\/style>/),
  html.match(/<body>([\s\S]*?)<\/body>/)[1].trim(),
].join('\n');
mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'carro-celeste.html'), page + '\n');

const models = [
  'carro-celeste.glb',
  'carro-celeste.stl',
  ...readdirSync(join(root, 'modelli/kit')).map((f) => `kit/${f}`),
];
const files = { 'web/app.bundle.js': join(root, 'web/app.bundle.js') };
for (const name of models) {
  const packed = gzipSync(readFileSync(join(root, 'modelli', name)), { level: 9 }).toString('base64');
  const target = join(out, 'modelli', `${name}.gz.b64.txt`);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, packed);
  files[`modelli/${name}.gz.b64.txt`] = target;
  console.log(name, (packed.length / 1e6).toFixed(2), 'MB packed');
}
// The `files` argument for the Artifact tool: published path -> source file.
writeFileSync(join(out, 'files.json'), JSON.stringify(files, null, 2) + '\n');
