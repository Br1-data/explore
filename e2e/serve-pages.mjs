import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import { fileURLToPath, URL } from 'node:url';

// Serve exactly the built files under the same repository prefix as GitHub Pages.
// There is intentionally no gameplay server or WebSocket endpoint here.
const root = fileURLToPath(new URL('../packages/client/dist/', import.meta.url));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (!pathname.startsWith('/explore/')) {
      res.writeHead(404).end();
      return;
    }
    const file = resolve(root, pathname.slice('/explore/'.length) || 'index.html');
    if (!file.startsWith(root.endsWith(sep) ? root : root + sep)) {
      res.writeHead(403).end();
      return;
    }
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
}).listen(5176, '127.0.0.1');
