// Prova dal vero: gioca per intero ogni punto di vista dei capitoli giocabili e
// verifica che si arrivi alla conclusione con tutti i dettagli, senza errori in console.
//
//   npm run build && npm run e2e
//   BASE_URL=http://localhost:5173 npm run e2e      (server già avviato)
//   SCHERMATE=e2e/schermate npm run e2e             (salva le schermate)
//   VISTA=390x844 npm run e2e                       (prova a misura di telefono)
//   CAPITOLI=17 npm run e2e                         (solo alcuni capitoli)
//   RUOLI=iael,geova npm run e2e                    (solo alcuni punti di vista)
//   CHROMIUM=/percorso/chromium npm run e2e         (browser già installato altrove)

import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';
import { archivioFinto } from '../archivio/finto.mjs';

/** I punti di vista di ogni capitolo giocabile (src/content/index.ts). */
const PERCORSI = {
  1: ['enoc', 'geova', 'matusalemme', 'empio'],
  16: ['debora', 'barac', 'geova', 'volontario', 'sisera'],
  17: ['iael', 'geova', 'sisera', 'barac', 'debora', 'madre'],
};

/**
 * Che cosa si deve sentire in alcune scene: le sorgenti che vi stanno davvero
 * (oggetti, folle), la luce, la pioggia. Per ogni nuovo capitolo aggiungere le
 * scene con sorgenti caratteristiche.
 */
const SUONI_ATTESI = {
  '1/enoc-mondo': { sorgenti: ['folla', 'fuoco', 'incudine', 'invoca', 'pecora', 'rissa'], luce: 'giorno' },
  '1/enoc-strada': { sorgenti: ['folla', 'torcia'] },
  '1/enoc-pericolo': { luce: 'notte' },
  '1/empio-caccia': { sorgenti: ['insegue', 'torcia'], luce: 'notte' },
  '16/debora-palma': { sorgenti: ['pecora', 'folla'], luce: 'giorno' },
  '16/debora-canto': { sorgenti: ['danza', 'folla'] },
  '16/geova-oppressione': { sorgenti: ['invoca'] },
  '16/geova-chison': { sorgenti: ['folla'] },
  '16/barac-inseguimento': { sorgenti: ['insegue'], pioggia: true },
  '16/sisera-disfatta': { sorgenti: ['insegue'], pioggia: true },
  '16/volontario-battaglia': { sorgenti: ['insegue', 'folla'] },
  '17/iael-accampamento': { sorgenti: ['fuoco', 'pecora'], luce: 'giorno' },
  '17/iael-tenda': { sorgenti: ['fuoco'] },
  '17/sisera-fuga': { sorgenti: ['fuoco', 'pecora'] },
  '17/geova-canto': { sorgenti: ['danza'] },
  '17/debora-lode': { sorgenti: ['danza', 'folla'] },
  '17/madre-finestra': { sorgenti: ['folla'] },
};
/** Ciò che si sentiva all’inizio di ogni scena giocata. */
const ascoltati = new Map();
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

const stato = (pagina) => pagina.evaluate(() => window.__partita?.istantanea());
let lineaMisurata = false;

/** L’archivio dei salvataggi: il vero Codice.gs, con un Google finto al posto di quello vero. */
const archivio = archivioFinto();
const collegaArchivio = (contesto) =>
  contesto.route('https://script.google.com/macros/**', (route) =>
    route.fulfill({
      contentType: 'application/json',
      headers: { 'access-control-allow-origin': '*' },
      body: archivio.richiesta(route.request().postData() ?? ''),
    }),
  );
const salvati = (utente) => JSON.parse(archivio.file.get(`${utente}.json`) ?? 'null')?.dati;

/** Risolve l’attività della scheda aperta, come farebbe chi gioca. */
async function risolviAttivita(scheda, attivita) {
  switch (attivita) {
    case 'componi':
    case 'ordina': {
      const n = await scheda.locator('.pezzo[data-indice]').count();
      for (let i = 0; i < n; i++) await scheda.locator(`.pezzo[data-indice="${i}"]`).click();
      break;
    }
    case 'trova': {
      const bersagli = scheda.locator('[data-bersaglio]');
      const n = await bersagli.count();
      for (let i = 0; i < n; i++) await bersagli.nth(i).click();
      break;
    }
    case 'domanda':
      await scheda.locator('[data-corretta]').click();
      break;
    case 'condotta':
      // Prima una scelta diversa da quella del personaggio, per vedere come agivano gli altri.
      await scheda.locator('.opzione:not([data-fedele])').first().click();
      await scheda.locator('.esito-scelta__testo').waitFor();
      await scheda.locator('[data-fedele]').click();
      break;
    case 'completa': {
      const n = await scheda.locator('.lacuna').count();
      for (let i = 0; i < n; i++) await scheda.locator(`.pezzo[data-ordine="${i}"]`).click();
      break;
    }
    case 'classifica':
      while (await scheda.locator('.classifica__scelte [data-giusta]').count()) {
        await scheda.locator('.classifica__scelte [data-giusta]').click();
      }
      break;
    case 'linea': {
      const cursore = scheda.locator('.linea__scorri');
      await cursore.evaluate((el) => {
        el.value = el.dataset.meta;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      });
      // Sull’anno scelto, la linea rossa e il pomello del cursore cadono dove cadono le barre.
      const m = await scheda.evaluate((el) => {
        const input = el.querySelector('.linea__scorri');
        const r = input.getBoundingClientRect();
        const pomo = parseFloat(getComputedStyle(input).getPropertyValue('--pomo'));
        const frazione = (input.value - input.min) / (input.max - input.min);
        const traccia = el.querySelector('.vita__traccia').getBoundingClientRect();
        const linea = el.querySelector('.linea__cursore').getBoundingClientRect();
        return {
          anno: traccia.left + traccia.width * frazione,
          linea: linea.left + 1,
          pomello: r.left + pomo / 2 + (r.width - pomo) * frazione,
        };
      });
      const scarto = Math.max(Math.abs(m.linea - m.anno), Math.abs(m.pomello - m.anno));
      if (!lineaMisurata || scarto >= 1) {
        lineaMisurata = true;
        verifica(scarto < 1, `linea del tempo: barre, linea rossa e cursore allineati (scarto ${scarto.toFixed(1)} px)`);
      }
      await scheda.locator('.linea__fissa').click();
      break;
    }
    default:
      throw new Error(`Attività sconosciuta: ${attivita}`);
  }
}

/** Risolve la scheda aperta e prosegue. */
async function risolviScheda(pagina, visti, ruolo) {
  const scheda = pagina.locator('.scheda');
  const tipo = await scheda.getAttribute('data-passo');
  const attivita = await scheda.getAttribute('data-attivita');
  const chiave = attivita ? `attivita-${attivita}` : tipo;
  if (tipo === 'attivita') {
    if (!visti.has(chiave)) await scatta(pagina, `${ruolo}-scheda-${chiave}-prima`);
    await risolviAttivita(scheda, attivita);
    if ((await scheda.locator('.bottone--primario').isDisabled())) throw new Error(`${ruolo}: attività ${attivita} non risolta`);
  } else if (tipo === 'senti') {
    await scheda.locator('textarea').fill('Appunto di prova.');
  }
  if (!visti.has(chiave)) {
    visti.add(chiave);
    await scatta(pagina, `${ruolo}-scheda-${chiave}`);
  }
  await scheda.locator('.bottone--primario').click();
}

async function gioca(cap, id) {
  // Nelle schermate e nei messaggi: «17-geova».
  const ruolo = `${cap}-${id}`;
  console.log(`\n${ruolo}`);
  const contesto = await browser.newContext({
    viewport: { width: larghezza, height: altezza },
    hasTouch: larghezza < 600,
    isMobile: larghezza < 600,
  });
  // Un account per ogni punto di vista, già entrato (l’accesso lo prova provaComandi).
  await collegaArchivio(contesto);
  const utente = `prova-${ruolo}`;
  const { chiave } = JSON.parse(archivio.richiesta(JSON.stringify({ azione: 'registra', utente, password: 'prova' })));
  await contesto.addInitScript((s) => localStorage.setItem('nei-loro-panni.sessione', s), JSON.stringify({ utente, chiave }));
  const pagina = await contesto.newPage();
  pagina.on('console', (m) => m.type() === 'error' && errori.push(`${ruolo}: ${m.text()}`));
  pagina.on('pageerror', (e) => errori.push(`${ruolo}: ${e.message}`));

  await pagina.goto(`${base}/#/gioca/${cap}/${id}`);
  await pagina.waitForFunction(() => !!window.__partita);
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
      // Il tempo per far arrivare all’audio ciò che c’è in scena.
      await pagina.waitForTimeout(schermate ? 500 : 400);
      ascoltati.set(`${cap}/${s.scena}`, await pagina.evaluate(() => window.__suono?.istantanea()));
      await scatta(pagina, `${ruolo}-${scena + 1}-${s.scena}`);
    }
    const prossimo = s.punti.find((p) => p.visibile);
    if (prossimo) {
      await pagina.evaluate((x) => window.__partita.teletrasporta(x), prossimo.x);
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
  // …e l’archivio li conserva nell’account.
  await pagina.waitForTimeout(2500);
  const nellArchivio = salvati(utente)?.dettagli?.[cap]?.length ?? 0;
  verifica(nellArchivio === fatti && salvati(utente).ruoli[`${cap}:${id}`]?.finito, `l’account conserva i ${nellArchivio} dettagli e il racconto finito`);
  await contesto.close();
}

async function provaComandi() {
  console.log('\ncomandi');
  const pagina = await browser.newPage({ viewport: { width: larghezza, height: altezza } });
  pagina.on('pageerror', (e) => errori.push(`comandi: ${e.message}`));
  await collegaArchivio(pagina);
  await pagina.goto(`${base}/`);
  // Senza account non si entra: lo si crea.
  await pagina.locator('.accesso').waitFor();
  verifica((await pagina.locator('.esci').count()) === 0, 'senza account si vede solo l’accesso');
  await pagina.locator('input[name="utente"]').fill('Prova');
  await pagina.locator('input[name="password"]').fill('abcd');
  await pagina.locator('button[value="crea"]').click();
  await pagina.locator('.esci').waitFor();
  verifica(!!salvati('prova'), 'creando un account si entra, e l’archivio lo registra');
  await scatta(pagina, 'accesso-entrato');
  await pagina.waitForLoadState('networkidle');
  // Esce una versione nuova mentre il gioco è aperto (webapp sulla schermata Home):
  // tornandoci, si ricarica da sé.
  const indice = new URL(pagina.url()).pathname;
  await pagina.route(
    (u) => u.pathname === indice,
    async (route) => {
      const r = await route.fetch();
      const html = (await r.text()).replace(/(<script[^>]+type="module"[^>]+src="[^"]+)/, '$1?v=nuova');
      await route.fulfill({ response: r, body: html });
    },
    { times: 1 },
  );
  const ricaricata = pagina.waitForEvent('load', { timeout: 5000 }).then(() => true, () => false);
  await pagina.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  verifica(await ricaricata, 'con una versione nuova pubblicata, tornando nel gioco si aggiorna');
  await pagina.locator('.inizio .bottone--primario').click();
  await pagina.locator('.capitolo').first().waitFor();
  verifica((await pagina.locator('.capitolo').count()) === 54, 'l’indice elenca i 54 capitoli del libro');
  const attivi = await pagina.locator('.capitolo--attivo').count();
  verifica(attivi === Object.keys(PERCORSI).length, `l’indice segna come giocabili ${attivi} capitoli`);
  await pagina.locator('.capitolo--attivo').first().click();
  await pagina.locator('.ruolo').first().waitFor();
  verifica((await pagina.locator('.ruolo').count()) === 4, 'il capitolo di Enoc offre quattro punti di vista');
  await pagina.locator('.ruolo[data-ruolo="enoc"] .bottone--primario').click();
  await pagina.waitForFunction(() => !!window.__partita);
  await pagina.locator('.pannello .bottone--primario').click();
  await pagina.locator('.scheda .bottone--primario').click();
  await pagina.waitForFunction(() => window.__partita.istantanea().modo === 'esplora');
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
  // Toccare un segnale porta lì e lo apre.
  await pagina.evaluate(() => window.__partita.teletrasporta(160));
  await pagina.waitForTimeout(1200);
  const s = await stato(pagina);
  const punto = s.punti.find((p) => p.visibile && p.x > s.camera - s.vista / 2 + 80);
  await pagina.mouse.click(tela.x + ((punto.x - (s.camera - s.vista / 2)) / s.vista) * tela.width, tela.y + tela.height * 0.5);
  await pagina.locator('.scheda').waitFor({ timeout: 5000 });
  verifica(true, `toccando un segnale ci si va e si apre (${punto.id})`);
  // Uscire e rientrare: la password sbagliata non apre, quella giusta sì.
  await pagina.goto(`${base}/#/`);
  await pagina.locator('.esci').click();
  await pagina.locator('input[name="utente"]').fill('prova');
  await pagina.locator('input[name="password"]').fill('abce');
  await pagina.locator('button[value="entra"]').click();
  await pagina.locator('.accesso__avviso', { hasText: 'sbagliati' }).waitFor();
  await scatta(pagina, 'accesso-sbagliato');
  await pagina.locator('input[name="password"]').fill('abcd');
  await pagina.locator('button[value="entra"]').click();
  await pagina.locator('.esci').waitFor();
  verifica(salvati('prova')?.guidaVista === true, 'si esce e si rientra; l’account ricorda la guida già vista');
  await pagina.close();
}

/** I suoni seguono la scena: audio acceso ovunque, e le sorgenti attese presenti. */
function provaSuoni() {
  console.log('\nsuoni');
  const spenti = [...ascoltati].filter(([, a]) => a?.stato !== 'running').map(([k]) => k);
  verifica(ascoltati.size > 0 && spenti.length === 0, `audio attivo in ${ascoltati.size} scene${spenti.length ? ` (spento: ${spenti.join(', ')})` : ''}`);
  for (const [scena, attese] of Object.entries(SUONI_ATTESI)) {
    const a = ascoltati.get(scena);
    if (!a) continue; // scena non giocata in questa prova
    const mancano = (attese.sorgenti ?? []).filter((t) => !a.sorgenti.includes(t));
    const luce = !attese.luce || a.luce === attese.luce;
    const pioggia = !attese.pioggia || a.pioggia > 0;
    verifica(
      !mancano.length && luce && pioggia,
      `${scena}: ${a.sorgenti.join(', ') || 'nessuna sorgente'} · ${a.luce}${a.pioggia ? ` · pioggia ${a.pioggia}` : ''}${mancano.length ? ` (mancano: ${mancano.join(', ')})` : ''}`,
    );
  }
}

try {
  await provaComandi();
  const capitoli = process.env.CAPITOLI?.split(',') ?? Object.keys(PERCORSI);
  const soloRuoli = process.env.RUOLI?.split(',');
  for (const cap of capitoli) {
    for (const id of PERCORSI[cap] ?? []) if (!soloRuoli || soloRuoli.includes(id)) await gioca(cap, id);
  }
  provaSuoni();
  verifica(errori.length === 0, `nessun errore in console${errori.length ? `: ${errori.join(' | ')}` : ''}`);
} catch (e) {
  console.error(e);
  fallito = true;
} finally {
  await browser.close();
  server?.kill();
}
process.exit(fallito ? 1 : 0);
