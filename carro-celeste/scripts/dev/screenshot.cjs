// Development aid: renders views of the viewer with headless Chromium so that the geometry
// can be checked by eye. Needs a `playwright` that Node can resolve (it is pre-installed in
// Claude Code cloud sessions; elsewhere: npm i -D playwright && npx playwright install chromium).
//
//   SHOT_DIR=/tmp/shots node scripts/dev/screenshot.cjs name=query [name=query ...]
//
// `query` is the viewer's query string, for example:
//   insieme=                                      the opening view, with the interface
//   testa=solo=cherubino_4&cam=52,-52,54&target=25,-25,52
//   stampa=mode=stampa
// cam/target are model millimetres (Z up). SHOT_SIZE=900x700 and SHOT_NOUI=1 are optional.
const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const path = require('node:path');

(async () => {
  const dir = process.env.SHOT_DIR || '.';
  const [width, height] = (process.env.SHOT_SIZE || '900x700').split('x').map(Number);
  const port = process.env.PORT || '5182';
  const server = spawn('node', [path.join(__dirname, '..', 'serve.mjs')], {
    env: { ...process.env, PORT: port },
    stdio: 'ignore',
  });
  await new Promise((resolve) => setTimeout(resolve, 500));
  const browser = await chromium.launch();
  for (const arg of process.argv.slice(2)) {
    const split = arg.indexOf('=');
    const name = arg.slice(0, split);
    const query = arg.slice(split + 1);
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push('PAGEERROR ' + error.message));
    await page.goto(`http://127.0.0.1:${port}/?still=1&${query}`);
    try {
      await page.waitForFunction(() => window.__ready === true, null, { timeout: 60000 });
      const frames = await page.evaluate(() => window.__frames);
      await page.waitForFunction((n) => window.__frames > n + 3, frames, { timeout: 60000 });
    } catch (error) {
      errors.push('TIMEOUT ' + error.message.split('\n')[0]);
    }
    if (process.env.SHOT_NOUI) await page.addStyleTag({ content: '.overlay{display:none!important}' });
    await page.screenshot({ path: path.join(dir, `${name}.png`) });
    if (errors.length) console.log(name, errors.join('\n'));
    await page.close();
  }
  await browser.close();
  server.kill();
})();
