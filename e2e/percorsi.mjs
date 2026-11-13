// Prova dal vero: gioca per intero ogni punto di vista del capitolo e verifica
// che si arrivi alla conclusione con tutti i dettagli, senza errori in console.
//
//   npm run build && npm run e2e
//   BASE_URL=http://localhost:5173 npm run e2e      (server già avviato)
//   SCHERMATE=e2e/schermate npm run e2e             (salva le schermate)
//   VISTA=390x844 npm run e2e                       (prova a misura di telefono)
//   RUOLI=enoc,geova npm run e2e                    (solo alcuni punti di vista)
//   CHROMIUM=/percorso/chromium npm run e2e         (browser già installato altrove)

import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const RUOLI = ['enoc', 'geova', 'matusalemme', 'empio'];
const PORTA = 4317;
const schermate = process.env.SCHERMATE;
const [larghezza, altezza] = (process.env.VISTA ?? '1280x720').split('x').map(Number);
let base = process.env.BASE_URL;
let server;

async function attendiServer(url) {
  for (let i = 0; i < 80; i++) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {
      /* non ancora pronto */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`Il server non risponde: ${url}`);
}

if (!base) {
  server = spawn('npx', ['vite', 'preview', '--port', String(PORTA), '--strictPort'], {
    stdio: 'ignore',
    shell: process.platform === 'win32',
  });
  base = `http://localhost:${PORTA}`;
  await attendiServer(base);
}
if (schermate) mkdirSync(schermate, { recursive: true });

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const errori = [];
let fallito = false;

function verifica(condizione, messaggio) {
  if (condizione) {
    console.log(`  ✓ ${messaggio}`);
  } else {
    console.error(`  ✗ ${messaggio}`);
    fallito = true;
  }
}

async function scatta(pagina, nome) {
  if (schermate) await pagina.screenshot({ path: `${schermate}/${nome}.png` });
}

const stato = (pagina) => pagina.evaluate(() => window.__incammino?.istantanea());

/** Risolve la scheda aperta e prosegue. */
async function risolviScheda(pagina, visti, ruolo) {
  const scheda = pagina.locator('.scheda');
  const tipo = await scheda.getAttribute('data-passo');
  const attivita = await scheda.getAttribute('data-attivita');
  const chiave = attivita ? `attivita-${attivita}` : tipo;
  if (tipo === 'attivita') {
    if (!visti.has(chiave)) await scatta(pagina, `${ruolo}-scheda-${chiave}-prima`);
    if (attivita === 'componi' || attivita === 'ordina') {
      const n = await scheda.locator('.pezzo').count();
      for (let i = 0; i < n; i++) await scheda.locator(`.pezzo[data-indice="${i}"]`).click();
    } else if (attivita === 'trova') {
      const bersagli = scheda.locator('[data-bersaglio]');
      const n = await bersagli.count();
      for (let i = 0; i < n; i++) await bersagli.nth(i).click();
    } else {
      await scheda.locator('[data-corretta]').click();
    }
  } else if (tipo === 'senti') {
    await scheda.locator('textarea').fill('Appunto di prova.');
  }
  if (!visti.has(chiave)) {
    visti.add(chiave);
    await scatta(pagina, `${ruolo}-scheda-${chiave}`);
  }
  await scheda.locator('.bottone--primario').click();
}

async function gioca(ruolo) {
  console.log(`\n${ruolo}`);
  const contesto = await browser.newContext({
    viewport: { width: larghezza, height: altezza },
    hasTouch: larghezza < 600,
    isMobile: larghezza < 600,
  });
  const pagina = await contesto.newPage();
  pagina.on('console', (m) => m.type() === 'error' && errori.push(`${ruolo}: ${m.text()}`));
  pagina.on('pageerror', (e) => errori.push(`${ruolo}: ${e.message}`));

  await pagina.goto(`${base}/#/gioca/1/${ruolo}`);
  await pagina.waitForFunction(() => !!window.__incammino);
  const guida = pagina.locator('.pannello .bottone--primario');
  if (await guida.count()) await guida.click();

  const visti = new Set();
  let scena = -1;
  let passi = 0;
  const limite = Date.now() + 240_000;
  while (!pagina.url().includes('#/fine/')) {
    if (Date.now() > limite) throw new Error(`${ruolo}: tempo scaduto (scena ${scena})`);
    if (await pagina.locator('.scheda').count()) {
      await risolviScheda(pagina, visti, ruolo);
      passi++;
      await pagina.waitForTimeout(40);
      continue;
    }
    const s = await stato(pagina);
    if (!s) break;
    if (s.attesa) {
      // Una pausa del racconto: si può saltare con il tasto azione.
      await pagina.waitForTimeout(schermate ? 900 : 60);
      if (schermate && !visti.has(`pausa-${s.scena}`)) {
        visti.add(`pausa-${s.scena}`);
        await scatta(pagina, `${ruolo}-${s.indice + 1}-${s.scena}-racconto`);
      }
      await pagina.keyboard.press('KeyE');
      continue;
    }
    if (s.modo !== 'esplora') {
      await pagina.waitForTimeout(80);
      continue;
    }
    if (s.indice !== scena) {
      scena = s.indice;
      await pagina.waitForTimeout(schermate ? 500 : 0);
      await scatta(pagina, `${ruolo}-${scena + 1}-${s.scena}`);
    }
    const prossimo = s.punti.find((p) => p.visibile);
    if (prossimo) {
      await pagina.evaluate((x) => window.__incammino.teletrasporta(x), prossimo.x);
      await pagina.locator(`.invito[data-punto="${prossimo.id}"]`).waitFor({ timeout: 5000 });
      if (schermate) {
        await pagina.waitForTimeout(350);
        await scatta(pagina, `${ruolo}-${scena + 1}-${s.scena}-${prossimo.id}`);
      }
      await pagina.keyboard.press('KeyE');
      await pagina.waitForTimeout(60);
    } else if (s.completa) {
      await pagina.locator('.prosegui').click();
      await pagina.waitForTimeout(120);
    } else {
      await pagina.waitForTimeout(80);
    }
  }

  await pagina.locator('.esito').waitFor({ timeout: 10_000 });
  const [fatti, totali] = (await pagina.locator('.esito b').first().innerText()).split('/').map((x) => Number(x.trim()));
  verifica(totali > 0 && fatti === totali, `racconto concluso con ${fatti} dettagli su ${totali} (${passi} schede)`);
  await scatta(pagina, `${ruolo}-fine`);

  // Il quaderno conserva ciò che si è scoperto.
  await pagina.locator('.pagina__testa .bottone--primario').click();
  const voci = await pagina.locator('.quaderno .voce').count();
  verifica(voci >= fatti, `il quaderno elenca i dettagli scoperti (${voci})`);
  await scatta(pagina, `${ruolo}-quaderno`);
  await contesto.close();
}

async function provaComandi() {
  console.log('\ncomandi');
  const pagina = await browser.newPage({ viewport: { width: larghezza, height: altezza } });
  pagina.on('pageerror', (e) => errori.push(`comandi: ${e.message}`));
  await pagina.goto(`${base}/`);
  await pagina.locator('.inizio .bottone--primario').click();
  await pagina.locator('.capitolo').first().waitFor();
  verifica((await pagina.locator('.capitolo').count()) === 54, 'l’indice elenca i 54 capitoli del libro');
  await pagina.locator('.capitolo--attivo').click();
  await pagina.locator('.ruolo').first().waitFor();
  verifica((await pagina.locator('.ruolo').count()) === 4, 'il capitolo di Enoc offre quattro punti di vista');
  await pagina.locator('.ruolo[data-ruolo="enoc"] .bottone--primario').click();
  await pagina.waitForFunction(() => !!window.__incammino);
  await pagina.locator('.pannello .bottone--primario').click();
  await pagina.locator('.scheda .bottone--primario').click();
  await pagina.waitForFunction(() => window.__incammino.istantanea().modo === 'esplora');
  const prima = (await stato(pagina)).x;
  await pagina.keyboard.down('ArrowRight');
  await pagina.waitForTimeout(700);
  await pagina.keyboard.up('ArrowRight');
  const dopo = (await stato(pagina)).x;
  verifica(dopo > prima + 60, `la freccia destra fa camminare (${Math.round(prima)} → ${Math.round(dopo)})`);
  await pagina.waitForTimeout(200);
  const fermo = (await stato(pagina)).x;
  await pagina.waitForTimeout(300);
  verifica(Math.abs((await stato(pagina)).x - fermo) < 1, 'rilasciando il tasto ci si ferma');
  const tela = await pagina.locator('.gioco__tela').boundingBox();
  await pagina.mouse.click(tela.x + tela.width * 0.9, tela.y + tela.height * 0.6);
  await pagina.waitForTimeout(900);
  verifica((await stato(pagina)).x > fermo + 60, 'un clic sulla scena indica dove andare');
  await pagina.keyboard.press('KeyQ');
  verifica((await pagina.locator('.quaderno').count()) === 1, 'il tasto Q apre il quaderno');
  await pagina.keyboard.press('Escape');
  verifica((await pagina.locator('.quaderno').count()) === 0, 'Esc lo chiude');
  await pagina.close();
}

try {
  await provaComandi();
  for (const ruolo of process.env.RUOLI?.split(',') ?? RUOLI) await gioca(ruolo);
  verifica(errori.length === 0, `nessun errore in console${errori.length ? `: ${errori.join(' | ')}` : ''}`);
} catch (e) {
  console.error(e);
  fallito = true;
} finally {
  await browser.close();
  server?.kill();
}
process.exit(fallito ? 1 : 0);
