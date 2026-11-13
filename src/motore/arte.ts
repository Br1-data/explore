import { disegnaFigura, fiamma, type Stile } from './figure';
import { disegnaOggetto, type Pennello } from './oggetti';
import { tavolozza, type Tavolozza } from './tavolozze';
import { alfa } from './util';

/**
 * Piccole illustrazioni per le schede: ciò su cui il racconto invita a
 * riflettere (Genesi 3:24; 4:8), tenuto distinto dal mondo che si esplora.
 */

const W = 640;
const H = 230;
const SUOLO = 196;

function sfondo(ctx: CanvasRenderingContext2D, P: Tavolozza): void {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, P.cielo[0]);
  g.addColorStop(0.6, P.cielo[1]);
  g.addColorStop(1, P.cielo[2]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = P.monti[1];
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 16) ctx.lineTo(x, 150 - Math.sin(x * 0.012 + 1) * 22 - Math.sin(x * 0.031) * 8);
  ctx.lineTo(W, H);
  ctx.fill();
  const t = ctx.createLinearGradient(0, SUOLO - 6, 0, H);
  t.addColorStop(0, P.terra[0]);
  t.addColorStop(1, P.terra[1]);
  ctx.fillStyle = t;
  ctx.fillRect(0, SUOLO - 4, W, H - SUOLO + 4);
}

function pennello(ctx: CanvasRenderingContext2D, P: Tavolozza): Pennello {
  return { ctx, P, t: 1.3, tono: (c) => c, luci: [], sx: 0, sy: SUOLO, scala: 1 };
}

function oggetto(p: Pennello, tipo: string, x: number, scala = 1, variante = 0): void {
  p.sx = x;
  p.sy = SUOLO;
  p.scala = scala;
  disegnaOggetto(p, { tipo, x, variante });
}

const ANZIANO: Stile = {
  tipo: 'uomo',
  veste: '#7a6a5a',
  fascia: '#3d2e26',
  pelle: '#b08a6a',
  capelli: '#cfc8bd',
  barba: true,
  accessorio: 'bastone',
  scala: 0.95,
};
const ANZIANA: Stile = {
  tipo: 'donna',
  veste: '#6f6470',
  fascia: '#40384a',
  pelle: '#b08a6a',
  capelli: '#cfc8bd',
  velo: '#8a7f78',
  scala: 0.9,
};
const UOMO_A: Stile = { tipo: 'uomo', veste: '#7d4f3f', fascia: '#2f2420', pelle: '#a36f4a', capelli: '#241c18', barba: true, scala: 1 };
const UOMO_B: Stile = { tipo: 'uomo', veste: '#b9ab8c', fascia: '#6a5a40', pelle: '#b5835a', capelli: '#3b2b22', barba: true, scala: 1 };

function cherubino(ctx: CanvasRenderingContext2D, x: number, verso: 1 | -1): void {
  // Sagoma alata, volutamente essenziale.
  ctx.save();
  ctx.translate(x, SUOLO);
  ctx.scale(verso, 1);
  ctx.fillStyle = 'rgba(28,22,40,0.88)';
  ctx.beginPath();
  ctx.moveTo(-10, 0);
  ctx.lineTo(-8, -86);
  ctx.quadraticCurveTo(0, -98, 8, -86);
  ctx.lineTo(10, 0);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, -104, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-6, -84);
  ctx.quadraticCurveTo(-62, -150, -54, -40);
  ctx.quadraticCurveTo(-34, -64, -8, -58);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

const DISEGNI: Record<string, (ctx: CanvasRenderingContext2D) => void> = {
  eden(ctx) {
    const P = tavolozza('paradiso');
    sfondo(ctx, P);
    const p = pennello(ctx, P);
    for (const [x, s, v] of [
      [170, 0.9, 4],
      [250, 1.05, 0],
      [330, 0.95, 4],
      [410, 1.1, 1],
      [480, 0.9, 4],
    ] as const) {
      oggetto(p, 'albero', x, s, v);
    }
    oggetto(p, 'fiori', 300, 1);
    // Fuori dal giardino il suolo è spoglio.
    const ombra = ctx.createLinearGradient(0, 0, 0, H);
    ombra.addColorStop(0, 'rgba(30,20,50,0.05)');
    ombra.addColorStop(1, 'rgba(30,20,50,0.3)');
    ctx.fillStyle = ombra;
    ctx.fillRect(0, 0, W, H);
    cherubino(ctx, 232, 1);
    cherubino(ctx, 408, -1);
    // La spada fiammeggiante che roteava di continuo.
    ctx.strokeStyle = alfa('#ffd27a', 0.5);
    ctx.lineWidth = 3;
    for (const r of [34, 46]) {
      ctx.beginPath();
      ctx.arc(320, 118, r, -2.6, 0.4);
      ctx.stroke();
    }
    ctx.save();
    ctx.translate(320, 118);
    ctx.rotate(0.5);
    ctx.fillStyle = '#fff3c0';
    ctx.beginPath();
    ctx.moveTo(-4, 14);
    ctx.lineTo(0, -52);
    ctx.lineTo(4, 14);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#6a4a2a';
    ctx.fillRect(-10, 14, 20, 4);
    ctx.fillRect(-2.5, 18, 5, 14);
    fiamma(ctx, 0, -18, 1.5, 0.4);
    ctx.restore();
    const alone = ctx.createRadialGradient(320, 110, 4, 320, 110, 120);
    alone.addColorStop(0, 'rgba(255,190,90,0.4)');
    alone.addColorStop(1, 'rgba(255,160,60,0)');
    ctx.fillStyle = alone;
    ctx.fillRect(180, 0, 280, H);
  },
  anziani(ctx) {
    const P = tavolozza('tramonto');
    sfondo(ctx, P);
    const p = pennello(ctx, P);
    oggetto(p, 'roccia', 150, 1.2);
    oggetto(p, 'albero', 520, 0.9, 3);
    oggetto(p, 'cespuglio', 430, 0.9);
    disegnaFigura(ctx, ANZIANO, { x: 290, y: SUOLO, verso: 1, posa: 'fermo', fase: 0, t: 0.4, chino: 0.2 }, (c) => c);
    disegnaFigura(ctx, ANZIANA, { x: 344, y: SUOLO, verso: -1, posa: 'fermo', fase: 0, t: 0.9, chino: 0.16 }, (c) => c);
  },
  'caino-abele'(ctx) {
    const P = tavolozza('altura');
    sfondo(ctx, P);
    const p = pennello(ctx, P);
    oggetto(p, 'campo', 190, 1);
    oggetto(p, 'campo', 470, 1);
    oggetto(p, 'roccia', 560, 1);
    disegnaFigura(ctx, UOMO_B, { x: 372, y: SUOLO + 2, verso: 1, posa: 'sdraiato', fase: 0, t: 0 }, (c) => c);
    disegnaFigura(ctx, UOMO_A, { x: 282, y: SUOLO, verso: 1, posa: 'fermo', fase: 0, t: 0.2 }, (c) => c);
  },
};

export const ARTI = Object.keys(DISEGNI);

/** Disegna un’illustrazione in una tela creata per la scheda. */
export function creaArte(id: string): HTMLCanvasElement | null {
  const disegna = DISEGNI[id];
  if (!disegna) return null;
  const tela = document.createElement('canvas');
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  tela.width = W * dpr;
  tela.height = H * dpr;
  tela.className = 'arte';
  const ctx = tela.getContext('2d');
  if (!ctx) return null;
  ctx.scale(dpr, dpr);
  disegna(ctx);
  return tela;
}
