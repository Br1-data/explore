import type { Oggetto } from '../content/tipi';
import { fiamma, type Luce } from './figure';
import type { Tavolozza } from './tavolozze';
import { casuale, mescola } from './util';

export interface Pennello {
  ctx: CanvasRenderingContext2D;
  P: Tavolozza;
  t: number;
  /** Adatta un colore al piano (lontananza, primo piano) e all’ora del giorno. */
  tono: (colore: string) => string;
  luci: Luce[];
  /** Posizione a schermo dell’origine e scala applicata, per registrare le luci. */
  sx: number;
  sy: number;
  scala: number;
}

type Pittore = (p: Pennello, o: Oggetto) => void;

const cerchio = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void => {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
};

function rettTondo(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}

function luce(p: Pennello, x: number, y: number, r: number): void {
  p.luci.push({ x: p.sx + x * p.scala, y: p.sy + y * p.scala, r: r * p.scala });
}

const casa: Pittore = (p, o) => {
  const { ctx, P, tono } = p;
  const v = o.variante ?? 0;
  const [w, h] = v === 1 ? [112, 122] : v === 2 ? [152, 78] : v === 3 ? [124, 98] : [126, 86];
  const chiaro = tono(P.muro[0]);
  const scuro = tono(P.muro[1]);
  const buio = tono(mescola(P.muro[1], '#1a1210', 0.62));
  ctx.fillStyle = chiaro;
  ctx.fillRect(-w / 2, -h, w, h + 4);
  ctx.fillStyle = scuro;
  ctx.fillRect(w / 2 - w * 0.22, -h, w * 0.22, h + 4);
  // Tetto piano con travi sporgenti.
  ctx.fillRect(-w / 2 - 6, -h - 8, w + 12, 10);
  ctx.fillStyle = tono(P.tronco);
  for (let x = -w / 2 + 12; x < w / 2 - 6; x += 18) cerchio(ctx, x, -h + 9, 2.6);
  // Porta e finestre.
  ctx.fillStyle = buio;
  const px = v === 2 ? -w * 0.2 : -w * 0.12;
  rettTondo(ctx, px - 13, -50, 26, 54, 11);
  ctx.fillRect(px + 32, -h + 26, 13, 15);
  if (v === 1) {
    ctx.fillRect(-w / 2 + 14, -h + 26, 13, 15);
    ctx.fillRect(-w / 2 + 14, -h + 62, 13, 15);
    // Scala a pioli.
    ctx.strokeStyle = tono(P.tronco);
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(w / 2 + 6, 0);
    ctx.lineTo(w / 2 - 12, -h - 14);
    ctx.moveTo(w / 2 + 20, 0);
    ctx.lineTo(w / 2 + 2, -h - 14);
    for (let i = 1; i < 8; i++) {
      const k = i / 8;
      ctx.moveTo(w / 2 + 6 - 18 * k, -(h + 14) * k);
      ctx.lineTo(w / 2 + 20 - 18 * k, -(h + 14) * k);
    }
    ctx.stroke();
  }
  if (v === 2) {
    // Tettoia di tela.
    ctx.fillStyle = tono(P.tela[0]);
    ctx.beginPath();
    ctx.moveTo(px - 30, -62);
    ctx.lineTo(px + 34, -62);
    ctx.lineTo(px + 44, -44);
    ctx.lineTo(px - 40, -44);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = tono(P.tronco);
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(px - 38, -44);
    ctx.lineTo(px - 38, 0);
    ctx.moveTo(px + 42, -44);
    ctx.lineTo(px + 42, 0);
    ctx.stroke();
  }
  if (v === 3) {
    // Scala esterna in muratura.
    ctx.fillStyle = scuro;
    for (let i = 0; i < 6; i++) ctx.fillRect(w / 2 - 4 + i * 9, -h + 30 + i * 11, 12, h - 30 - i * 11 + 4);
  }
  // Qualche mattone accennato.
  ctx.strokeStyle = 'rgba(0,0,0,0.08)';
  ctx.lineWidth = 1;
  const r = casuale((o.x | 0) + 5);
  ctx.beginPath();
  for (let i = 0; i < 7; i++) {
    const bx = -w / 2 + 8 + r() * (w * 0.6);
    const by = -h + 14 + r() * (h - 30);
    ctx.moveTo(bx, by);
    ctx.lineTo(bx + 14, by);
  }
  ctx.stroke();
};

const tenda: Pittore = (p, o) => {
  const { ctx, P, tono } = p;
  const tela = P.tela[(o.variante ?? 0) % 3];
  ctx.strokeStyle = tono(P.tronco);
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(-52, -52);
  ctx.lineTo(-104, 0);
  ctx.moveTo(52, -52);
  ctx.lineTo(104, 0);
  ctx.stroke();
  ctx.fillStyle = tono(tela);
  ctx.beginPath();
  ctx.moveTo(-80, 2);
  ctx.lineTo(-54, -52);
  ctx.quadraticCurveTo(-26, -58, 0, -76);
  ctx.quadraticCurveTo(26, -58, 54, -52);
  ctx.lineTo(80, 2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = tono(mescola(tela, '#000000', 0.2));
  ctx.beginPath();
  ctx.moveTo(0, -76);
  ctx.quadraticCurveTo(26, -58, 54, -52);
  ctx.lineTo(80, 2);
  ctx.lineTo(34, 2);
  ctx.closePath();
  ctx.fill();
  // Strisce tessute.
  ctx.strokeStyle = tono(mescola(tela, '#2a1a12', 0.35));
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(-66, -26);
  ctx.quadraticCurveTo(0, -44, 66, -26);
  ctx.stroke();
  // Ingresso.
  ctx.fillStyle = tono(mescola(tela, '#120c0a', 0.75));
  ctx.beginPath();
  ctx.moveTo(-15, 2);
  ctx.lineTo(-1, -46);
  ctx.lineTo(15, 2);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = tono(P.tronco);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, -74);
  ctx.lineTo(0, -88);
  ctx.stroke();
};

const albero: Pittore = (p, o) => {
  const { ctx, P, tono, t } = p;
  const v = o.variante ?? 0;
  const r = casuale((o.x | 0) * 3 + v);
  const vento = Math.sin(t * 0.7 + o.x * 0.01) * 2.2;
  const tronco = tono(P.tronco);
  ctx.fillStyle = tronco;
  if (v === 3) {
    // Albero spoglio.
    ctx.strokeStyle = tronco;
    ctx.lineCap = 'round';
    const ramo = (x: number, y: number, ang: number, lung: number, spess: number, prof: number): void => {
      const x2 = x + Math.sin(ang) * lung;
      const y2 = y - Math.cos(ang) * lung;
      ctx.lineWidth = spess;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      if (prof > 0) {
        ramo(x2, y2, ang - 0.45 - r() * 0.3, lung * 0.68, spess * 0.62, prof - 1);
        ramo(x2, y2, ang + 0.4 + r() * 0.3, lung * 0.64, spess * 0.62, prof - 1);
      }
    };
    ramo(0, 0, 0.06, 56, 9, 3);
    return;
  }
  const alto = v === 2 ? 52 : 78;
  ctx.beginPath();
  ctx.moveTo(-8, 2);
  ctx.quadraticCurveTo(-3 + (v === 2 ? 8 : 0), -alto * 0.5, -4, -alto);
  ctx.lineTo(5, -alto);
  ctx.quadraticCurveTo(4 + (v === 2 ? 10 : 0), -alto * 0.5, 9, 2);
  ctx.closePath();
  ctx.fill();
  const chiome: [number, number, number][] =
    v === 1
      ? [
          [-14, -108, 30],
          [16, -122, 28],
          [2, -146, 26],
          [-6, -92, 24],
        ]
      : v === 2
        ? [
            [-34, -70, 28],
            [0, -84, 34],
            [36, -68, 28],
            [-12, -58, 22],
            [18, -56, 22],
          ]
        : [
            [-30, -104, 32],
            [4, -124, 40],
            [36, -100, 30],
            [-6, -88, 30],
            [20, -84, 24],
          ];
  ctx.fillStyle = tono(P.foglia[1]);
  for (const [x, y, rr] of chiome) cerchio(ctx, x + vento, y, rr);
  ctx.fillStyle = tono(P.foglia[0]);
  for (const [x, y, rr] of chiome) cerchio(ctx, x - 6 + vento * 1.2, y - 7, rr * 0.72);
  if (v === 4) {
    // Albero in fiore e in frutto.
    for (let i = 0; i < 22; i++) {
      const [cx, cy, cr] = chiome[i % chiome.length];
      const a = r() * Math.PI * 2;
      const d = r() * cr * 0.85;
      ctx.fillStyle = tono(i % 3 === 0 ? '#fff4d8' : i % 3 === 1 ? P.fiore : '#f6b23c');
      cerchio(ctx, cx + Math.cos(a) * d + vento, cy + Math.sin(a) * d, 2.6 + r() * 1.6);
    }
  }
};

const palma: Pittore = (p, o) => {
  const { ctx, P, tono, t } = p;
  const piega = ((o.x | 0) % 2 === 0 ? 1 : -1) * 16;
  const vento = Math.sin(t * 0.8 + o.x * 0.02) * 3;
  ctx.strokeStyle = tono(P.tronco);
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, 2);
  ctx.quadraticCurveTo(piega, -80, piega * 0.6, -150);
  ctx.stroke();
  const cx = piega * 0.6;
  const cy = -152;
  ctx.lineWidth = 6;
  for (let i = 0; i < 8; i++) {
    const a = -Math.PI * 0.94 + (i / 7) * Math.PI * 0.88;
    ctx.strokeStyle = tono(i % 2 ? P.foglia[0] : P.foglia[1]);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.quadraticCurveTo(
      cx + Math.cos(a) * 34 + vento,
      cy + Math.sin(a) * 34 - 12,
      cx + Math.cos(a) * 62 + vento * 1.6,
      cy + Math.sin(a) * 30 + 22,
    );
    ctx.stroke();
  }
};

const cipresso: Pittore = (p, o) => {
  const { ctx, P, tono, t } = p;
  const vento = Math.sin(t * 0.6 + o.x * 0.013) * 1.6;
  ctx.fillStyle = tono(P.tronco);
  ctx.fillRect(-3, -14, 6, 16);
  ctx.fillStyle = tono(P.foglia[1]);
  ctx.beginPath();
  ctx.moveTo(-16, -12);
  ctx.quadraticCurveTo(-20, -90, vento, -168);
  ctx.quadraticCurveTo(20, -90, 16, -12);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = tono(P.foglia[0]);
  ctx.beginPath();
  ctx.moveTo(-13, -16);
  ctx.quadraticCurveTo(-17, -90, vento, -162);
  ctx.quadraticCurveTo(-2, -90, -3, -16);
  ctx.closePath();
  ctx.fill();
};

const cespuglio: Pittore = (p) => {
  const { ctx, P, tono } = p;
  ctx.fillStyle = tono(P.foglia[1]);
  cerchio(ctx, -14, -9, 14);
  cerchio(ctx, 4, -15, 18);
  cerchio(ctx, 20, -8, 13);
  ctx.fillStyle = tono(P.foglia[0]);
  cerchio(ctx, -16, -13, 9);
  cerchio(ctx, 1, -20, 12);
};

const roccia: Pittore = (p, o) => {
  const { ctx, P, tono } = p;
  const r = casuale((o.x | 0) + 91);
  const base = mescola(P.terra[0], '#8c8a88', 0.4);
  const w = 26 + r() * 14;
  const h = 18 + r() * 14;
  ctx.fillStyle = tono(base);
  ctx.beginPath();
  ctx.moveTo(-w, 3);
  ctx.lineTo(-w * 0.75, -h * 0.6);
  ctx.lineTo(-w * 0.2, -h);
  ctx.lineTo(w * 0.45, -h * 0.85);
  ctx.lineTo(w, -h * 0.25);
  ctx.lineTo(w * 1.05, 3);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = tono(mescola(base, '#ffffff', 0.18));
  ctx.beginPath();
  ctx.moveTo(-w * 0.75, -h * 0.6);
  ctx.lineTo(-w * 0.2, -h);
  ctx.lineTo(w * 0.45, -h * 0.85);
  ctx.lineTo(-w * 0.1, -h * 0.5);
  ctx.closePath();
  ctx.fill();
};

const cumulo: Pittore = (p) => {
  const { ctx, P, tono } = p;
  const base = mescola(P.terra[0], '#9a9692', 0.45);
  const pietre: [number, number, number, number][] = [
    [-22, -6, 15, 10],
    [4, -7, 17, 11],
    [26, -5, 12, 8],
    [-8, -20, 14, 9],
    [14, -19, 12, 8],
    [2, -31, 10, 7],
  ];
  pietre.forEach(([x, y, rx, ry], i) => {
    ctx.fillStyle = tono(mescola(base, i % 2 ? '#ffffff' : '#000000', 0.1));
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  });
};

const idolo: Pittore = (p) => {
  const { ctx, P, tono, t } = p;
  const base = mescola(P.terra[0], '#a09890', 0.5);
  ctx.fillStyle = tono(mescola(base, '#000000', 0.2));
  ctx.fillRect(-26, -10, 52, 12);
  ctx.fillStyle = tono(base);
  ctx.beginPath();
  ctx.moveTo(-15, -10);
  ctx.lineTo(-13, -78);
  ctx.lineTo(-17, -84);
  ctx.lineTo(-11, -104);
  ctx.lineTo(11, -104);
  ctx.lineTo(17, -84);
  ctx.lineTo(13, -78);
  ctx.lineTo(15, -10);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = tono(mescola(base, '#000000', 0.45));
  ctx.fillRect(-7, -96, 4, 5);
  ctx.fillRect(3, -96, 4, 5);
  ctx.fillRect(-6, -70, 12, 3);
  ctx.fillRect(-6, -58, 12, 3);
  // Ciotola con fumo.
  ctx.fillStyle = tono('#8a5a3a');
  ctx.beginPath();
  ctx.ellipse(34, -6, 12, 7, 0, 0, Math.PI);
  ctx.fill();
  ctx.strokeStyle = 'rgba(230,225,220,0.25)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    const k = (t * 0.25 + i / 3) % 1;
    ctx.moveTo(34 + Math.sin(k * 6 + i) * 5, -10 - k * 60);
    ctx.lineTo(34 + Math.sin(k * 6 + i + 0.6) * 6, -18 - k * 60);
  }
  ctx.stroke();
};

const fuoco: Pittore = (p, o) => {
  const { ctx, tono, t } = p;
  ctx.fillStyle = tono('#6a625c');
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.ellipse(-20 + i * 8, 1 - (i % 2) * 2, 6, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = tono('#3a2a1e');
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-14, -2);
  ctx.lineTo(12, -10);
  ctx.moveTo(14, -2);
  ctx.lineTo(-12, -10);
  ctx.stroke();
  fiamma(ctx, 0, -8, 1.7, t + o.x);
  luce(p, 0, -22, 170);
};

const torcia: Pittore = (p, o) => {
  const { ctx, P, tono, t } = p;
  ctx.strokeStyle = tono(P.tronco);
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 2);
  ctx.lineTo(0, -96);
  ctx.stroke();
  ctx.fillStyle = tono('#3a2c22');
  ctx.fillRect(-5, -104, 10, 10);
  fiamma(ctx, 0, -104, 1.15, t + o.x);
  luce(p, 0, -112, 120);
};

const bancarella: Pittore = (p) => {
  const { ctx, P, tono } = p;
  ctx.strokeStyle = tono(P.tronco);
  ctx.lineWidth = 3.4;
  ctx.beginPath();
  ctx.moveTo(-46, 0);
  ctx.lineTo(-46, -86);
  ctx.moveTo(46, 0);
  ctx.lineTo(46, -86);
  ctx.stroke();
  ctx.fillStyle = tono(P.tela[1]);
  ctx.beginPath();
  ctx.moveTo(-56, -88);
  ctx.lineTo(56, -88);
  ctx.lineTo(62, -68);
  ctx.quadraticCurveTo(0, -60, -62, -68);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = tono(P.tronco);
  ctx.fillRect(-50, -36, 100, 6);
  ctx.fillRect(-44, -30, 5, 30);
  ctx.fillRect(39, -30, 5, 30);
  // Merci.
  const merci: [number, string][] = [
    [-32, '#a8663c'],
    [-10, '#c9a84a'],
    [12, '#8a5a3a'],
    [32, '#b98a52'],
  ];
  for (const [x, c] of merci) {
    ctx.fillStyle = tono(c);
    ctx.beginPath();
    ctx.ellipse(x, -42, 9, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }
};

const giare: Pittore = (p) => {
  const { ctx, tono } = p;
  const vasi: [number, number, string][] = [
    [-18, 1, '#a8663c'],
    [6, 1.25, '#96573a'],
    [28, 0.8, '#b87848'],
  ];
  for (const [x, k, c] of vasi) {
    ctx.fillStyle = tono(c);
    ctx.beginPath();
    ctx.ellipse(x, -15 * k, 11 * k, 16 * k, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x - 5 * k, -36 * k, 10 * k, 8 * k);
    ctx.fillStyle = tono(mescola(c, '#000000', 0.5));
    ctx.beginPath();
    ctx.ellipse(x, -36 * k, 5 * k, 2 * k, 0, 0, Math.PI * 2);
    ctx.fill();
  }
};

const recinto: Pittore = (p) => {
  const { ctx, P, tono } = p;
  ctx.strokeStyle = tono(P.tronco);
  ctx.lineCap = 'round';
  ctx.lineWidth = 3.6;
  ctx.beginPath();
  for (let x = -84; x <= 84; x += 42) {
    ctx.moveTo(x, 2);
    ctx.lineTo(x + 2, -34);
  }
  ctx.stroke();
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.moveTo(-86, -26);
  ctx.lineTo(88, -24);
  ctx.moveTo(-86, -12);
  ctx.lineTo(88, -11);
  ctx.stroke();
};

const pecora: Pittore = (p, o) => {
  const { ctx, tono, t } = p;
  const v = (o.variante ?? 0) % 2 ? -1 : 1;
  const bruca = Math.sin(t * 0.9 + o.x) * 0.5 + 0.5;
  ctx.save();
  ctx.scale(v, 1);
  ctx.strokeStyle = tono('#3a3028');
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (const x of [-10, -4, 8, 13]) {
    ctx.moveTo(x, -10);
    ctx.lineTo(x, 1);
  }
  ctx.stroke();
  ctx.fillStyle = tono('#e9e2d2');
  cerchio(ctx, -9, -19, 10);
  cerchio(ctx, 2, -22, 11);
  cerchio(ctx, 12, -18, 9);
  cerchio(ctx, 0, -14, 10);
  ctx.fillStyle = tono('#3a3028');
  ctx.beginPath();
  ctx.ellipse(22, -18 + bruca * 12, 6, 7.5, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

const campo: Pittore = (p, o) => {
  const { ctx, P, tono, t } = p;
  const r = casuale((o.x | 0) + 17);
  ctx.lineCap = 'round';
  for (let i = 0; i < 46; i++) {
    const x = -130 + i * 5.8 + r() * 3;
    const h = 26 + r() * 14;
    const vento = Math.sin(t * 1.2 + x * 0.04 + o.x) * 4;
    ctx.strokeStyle = tono(i % 3 === 0 ? mescola('#c9a84a', P.erba, 0.4) : '#c9a84a');
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, 2);
    ctx.quadraticCurveTo(x + vento * 0.3, -h * 0.6, x + vento, -h);
    ctx.stroke();
    ctx.fillStyle = tono('#dcc060');
    ctx.beginPath();
    ctx.ellipse(x + vento, -h - 3, 2, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
};

const incudine: Pittore = (p) => {
  const { ctx, P, tono } = p;
  ctx.fillStyle = tono(P.tronco);
  ctx.fillRect(-13, -22, 26, 24);
  ctx.fillStyle = tono('#4a4c56');
  ctx.beginPath();
  ctx.moveTo(-26, -36);
  ctx.lineTo(20, -36);
  ctx.lineTo(30, -30);
  ctx.lineTo(12, -28);
  ctx.lineTo(10, -22);
  ctx.lineTo(-10, -22);
  ctx.lineTo(-12, -28);
  ctx.lineTo(-22, -28);
  ctx.closePath();
  ctx.fill();
  // Arnesi di rame e di ferro.
  ctx.strokeStyle = tono('#b87038');
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(34, 0);
  ctx.lineTo(44, -34);
  ctx.moveTo(48, 0);
  ctx.lineTo(54, -30);
  ctx.stroke();
  ctx.fillStyle = tono('#8a8f98');
  ctx.fillRect(40, -42, 10, 9);
  ctx.beginPath();
  ctx.moveTo(54, -30);
  ctx.lineTo(50, -44);
  ctx.lineTo(60, -40);
  ctx.closePath();
  ctx.fill();
};

const porta: Pittore = (p) => {
  const { ctx, P, tono } = p;
  const chiaro = tono(P.muro[0]);
  const scuro = tono(P.muro[1]);
  const buio = tono(mescola(P.muro[1], '#14100e', 0.68));
  ctx.fillStyle = scuro;
  ctx.fillRect(-190, -92, 130, 96);
  ctx.fillRect(60, -92, 130, 96);
  for (let x = -186; x < 190; x += 26) {
    if (x > -70 && x < 50) continue;
    ctx.fillRect(x, -104, 14, 14);
  }
  ctx.fillStyle = chiaro;
  ctx.fillRect(-78, -172, 46, 176);
  ctx.fillRect(32, -172, 46, 176);
  ctx.fillStyle = scuro;
  ctx.fillRect(-36, -172, 8, 176);
  ctx.fillRect(74, -172, 8, 176);
  ctx.fillRect(-84, -182, 58, 12);
  ctx.fillRect(26, -182, 58, 12);
  ctx.fillRect(-40, -132, 80, 16);
  ctx.fillStyle = buio;
  ctx.fillRect(-62, -150, 10, 16);
  ctx.fillRect(50, -150, 10, 16);
  ctx.beginPath();
  ctx.moveTo(-32, 4);
  ctx.lineTo(-32, -92);
  ctx.quadraticCurveTo(0, -122, 32, -92);
  ctx.lineTo(32, 4);
  ctx.closePath();
  ctx.fill();
};

const acqua: Pittore = (p) => {
  const { ctx, P, tono, t } = p;
  const colore = mescola(P.cielo[1], '#3a8ec4', 0.55);
  ctx.fillStyle = tono(colore);
  ctx.beginPath();
  ctx.ellipse(0, 6, 170, 13, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  for (let i = 0; i < 7; i++) {
    const x = -130 + i * 42 + Math.sin(t * 0.8 + i) * 8;
    const y = 3 + (i % 3) * 3;
    ctx.moveTo(x, y);
    ctx.lineTo(x + 22, y);
  }
  ctx.stroke();
};

const fiori: Pittore = (p, o) => {
  const { ctx, P, tono, t } = p;
  const r = casuale((o.x | 0) + 29);
  const colori = [P.fiore, '#ffffff', '#ffd75a', '#c68cf0'];
  for (let i = 0; i < 16; i++) {
    const x = -80 + r() * 160;
    const h = 8 + r() * 12;
    const vento = Math.sin(t * 1.4 + x * 0.1) * 1.6;
    ctx.strokeStyle = tono(P.foglia[0]);
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(x, 2);
    ctx.lineTo(x + vento, -h);
    ctx.stroke();
    ctx.fillStyle = tono(colori[i % colori.length]);
    cerchio(ctx, x + vento, -h, 3 + r() * 1.6);
  }
};

const uccelli: Pittore = (p, o) => {
  const { ctx, t } = p;
  const v = o.variante ?? 0;
  const deriva = ((t * 26 + v * 170) % 520) - 260;
  ctx.strokeStyle = 'rgba(40,50,60,0.75)';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const x = deriva + i * 22 - (i % 2) * 8;
    const y = -250 - v * 34 - (i % 3) * 12;
    const ala = Math.sin(t * 7 + i) * 4;
    ctx.moveTo(x - 7, y - ala);
    ctx.quadraticCurveTo(x - 3, y - 4 + ala, x, y);
    ctx.quadraticCurveTo(x + 3, y - 4 + ala, x + 7, y - ala);
  }
  ctx.stroke();
};

const ovale = (ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, rot = 0): void => {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
  ctx.fill();
};

/** Una grande tenda di pelo di capra, aperta sul davanti: si vede l’interno (Giudici 4:18-21). */
const tendone: Pittore = (p) => {
  const { ctx, P, tono } = p;
  const pelo = tono(mescola('#3e3430', P.tela[0], 0.14));
  const dentro = tono(mescola('#2a211e', P.tela[0], 0.06));
  const tronco = tono(P.tronco);
  const tetto = (y: number): void => {
    // Il telo poggia sui pali e si abbassa un poco fra l’uno e l’altro.
    ctx.moveTo(-236, -108 + y);
    ctx.quadraticCurveTo(-160, -112 + y, -80, -140 + y);
    ctx.quadraticCurveTo(0, -128 + y, 80, -140 + y);
    ctx.quadraticCurveTo(160, -112 + y, 236, -108 + y);
  };
  // Corde e pioli.
  ctx.strokeStyle = tono(mescola(P.tronco, '#c8b48a', 0.45));
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  for (const s of [-1, 1]) {
    ctx.moveTo(236 * s, -108);
    ctx.lineTo(318 * s, 0);
    ctx.moveTo(80 * s, -140);
    ctx.lineTo(276 * s, 0);
  }
  ctx.stroke();
  ctx.fillStyle = tronco;
  for (const x of [-318, -276, 276, 318]) ctx.fillRect(x - 2, -9, 4, 11);
  // Il fondo, in ombra.
  ctx.fillStyle = dentro;
  ctx.beginPath();
  ctx.moveTo(-226, 2);
  tetto(4);
  ctx.lineTo(226, 2);
  ctx.closePath();
  ctx.fill();
  // Teli laterali.
  ctx.fillStyle = pelo;
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(236 * s, -108);
    ctx.lineTo(266 * s, 2);
    ctx.lineTo(222 * s, 2);
    ctx.closePath();
    ctx.fill();
  }
  // Stuoia sul pavimento.
  ctx.fillStyle = tono('#b39a68');
  ctx.fillRect(-196, -3, 300, 6);
  ctx.fillStyle = tono('#8f7a4e');
  for (let x = -190; x < 100; x += 22) ctx.fillRect(x, -3, 2, 6);
  // Telo divisorio fra i due scompartimenti.
  ctx.fillStyle = tono(mescola(P.tela[1], '#3a2a20', 0.25));
  ctx.beginPath();
  ctx.moveTo(122, -134);
  ctx.lineTo(196, -118);
  ctx.lineTo(200, 2);
  ctx.lineTo(118, 2);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = tono(mescola(P.tela[0], '#2a1a12', 0.2));
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (const y of [-96, -70, -44, -18]) {
    ctx.moveTo(119, y);
    ctx.lineTo(199, y + 4);
  }
  ctx.stroke();
  // Pali.
  ctx.strokeStyle = tronco;
  ctx.lineWidth = 4;
  ctx.beginPath();
  for (const [x, h] of [
    [-220, 110],
    [-80, 140],
    [80, 140],
    [220, 110],
  ]) {
    ctx.moveTo(x, 2);
    ctx.lineTo(x, -h);
  }
  ctx.stroke();
  // Il tetto, a strisce cucite insieme.
  ctx.strokeStyle = pelo;
  ctx.lineWidth = 18;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  tetto(-6);
  ctx.stroke();
  ctx.strokeStyle = tono(mescola('#5a4c44', P.tela[0], 0.1));
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  tetto(-10);
  ctx.stroke();
};

/** Un otre di pelle per il latte (Giudici 4:19). */
const otre: Pittore = (p) => {
  const { ctx, tono } = p;
  ctx.fillStyle = tono('#8a5a3a');
  ovale(ctx, 0, -11, 20, 11, -0.08);
  ovale(ctx, 21, -17, 6, 4, -0.6);
  ctx.strokeStyle = tono('#3d2a1e');
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(18, -21);
  ctx.lineTo(23, -13);
  ctx.stroke();
  ctx.strokeStyle = tono('#6a432c');
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  for (const x of [-12, 10]) {
    ctx.moveTo(x, -3);
    ctx.lineTo(x - 3, 1);
  }
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ovale(ctx, -4, -16, 10, 3, -0.1);
};

/** Una coppa splendida, con il latte (Giudici 5:25). */
const coppa: Pittore = (p) => {
  const { ctx, tono } = p;
  ctx.fillStyle = tono('#9a6a3a');
  ctx.fillRect(-4, -7, 8, 7);
  ovale(ctx, 0, 0, 9, 2.5);
  ctx.fillStyle = tono('#b98a4a');
  ctx.beginPath();
  ctx.moveTo(-17, -17);
  ctx.quadraticCurveTo(0, 2, 17, -17);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = tono('#f2ead8');
  ovale(ctx, 0, -17, 17, 3.4);
  ctx.strokeStyle = tono('#e0b850');
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(-14, -12);
  ctx.quadraticCurveTo(0, -4, 14, -12);
  ctx.stroke();
};

/** Un martello di legno e un piolo da tenda (Giudici 4:21; immagine del capitolo). */
const martello: Pittore = (p) => {
  const { ctx, tono } = p;
  const legno = tono('#8a6a44');
  ctx.fillStyle = legno;
  ctx.beginPath();
  ctx.moveTo(16, -4);
  ctx.lineTo(48, -1);
  ctx.lineTo(16, 2);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(10, -5, 7, 8);
  ctx.save();
  ctx.rotate(-0.35);
  ctx.strokeStyle = tono('#5e4630');
  ctx.lineWidth = 3.4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-8, 0);
  ctx.lineTo(-8, -34);
  ctx.stroke();
  ctx.fillStyle = legno;
  rettTondo(ctx, -20, -47, 24, 14, 4);
  ctx.restore();
};

/** Un carro da guerra con una falce di ferro che sporge dal mozzo; variante 1: impantanato. */
const carro: Pittore = (p, o) => {
  const { ctx, P, tono } = p;
  const impantanato = (o.variante ?? 0) === 1;
  const legno = tono(mescola(P.tronco, '#8a5a34', 0.4));
  ctx.save();
  if (impantanato) {
    ctx.translate(0, 10);
    ctx.rotate(-0.15);
  }
  // Timone.
  ctx.strokeStyle = legno;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(20, -30);
  ctx.quadraticCurveTo(70, -32, 98, -50);
  ctx.stroke();
  // Cassa.
  ctx.fillStyle = legno;
  ctx.beginPath();
  ctx.moveTo(-34, -30);
  ctx.lineTo(26, -30);
  ctx.lineTo(30, -64);
  ctx.quadraticCurveTo(0, -72, -30, -58);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = tono(mescola(P.tela[0], '#000000', 0.2));
  ctx.fillRect(-28, -50, 54, 6);
  // Falce di ferro.
  ctx.fillStyle = tono('#80868f');
  ctx.beginPath();
  ctx.moveTo(-6, -27);
  ctx.lineTo(-60, -31);
  ctx.quadraticCurveTo(-68, -26, -61, -20);
  ctx.lineTo(-6, -21);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.fillRect(-56, -30, 46, 1.6);
  // Ruota.
  ctx.strokeStyle = tono('#4a3828');
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(-6, -24, 24, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3 + 0.3;
    ctx.moveTo(-6, -24);
    ctx.lineTo(-6 + Math.cos(a) * 23, -24 + Math.sin(a) * 23);
  }
  ctx.stroke();
  ctx.restore();
  if (impantanato) {
    ctx.fillStyle = tono(mescola(P.terra[1], '#2a2018', 0.55));
    ovale(ctx, -4, 4, 62, 9);
  }
};

/** Pozze di fango sotto la pioggia. */
const fango: Pittore = (p, o) => {
  const { ctx, P, tono, t } = p;
  const r = casuale((o.x | 0) + 7);
  const xs: number[] = [];
  for (let i = 0; i < 3; i++) {
    const x = -80 + i * 70 + r() * 20;
    const w = 28 + r() * 30;
    xs.push(x);
    ctx.fillStyle = tono(mescola(P.terra[1], '#2a2018', 0.55));
    ovale(ctx, x, 4, w, 5);
    ctx.fillStyle = 'rgba(180,195,215,0.22)';
    ovale(ctx, x - w * 0.2, 3, w * 0.45, 1.6);
  }
  ctx.strokeStyle = 'rgba(210,220,235,0.4)';
  ctx.lineWidth = 1;
  xs.forEach((x, i) => {
    const k = (t * 1.3 + i / 3 + o.x * 0.01) % 1;
    ctx.beginPath();
    ctx.ellipse(x, 4, 3 + k * 12, 1 + k * 3, 0, 0, Math.PI * 2);
    ctx.stroke();
  });
};

/** Il monte Tabor: un grande cono con la cima smussata (da mettere sullo sfondo). */
const tabor: Pittore = (p) => {
  const { ctx, P, tono } = p;
  const base = mescola(P.monti[2], P.foglia[1], 0.35);
  ctx.fillStyle = tono(base);
  ctx.beginPath();
  ctx.moveTo(-560, 10);
  ctx.bezierCurveTo(-380, -40, -260, -250, -150, -292);
  ctx.quadraticCurveTo(0, -316, 150, -292);
  ctx.bezierCurveTo(260, -250, 380, -40, 560, 10);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.beginPath();
  ctx.moveTo(60, -300);
  ctx.quadraticCurveTo(110, -298, 150, -292);
  ctx.bezierCurveTo(260, -250, 380, -40, 560, 10);
  ctx.lineTo(200, 10);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = tono(mescola(base, P.foglia[1], 0.5));
  const r = casuale(311);
  for (let i = 0; i < 30; i++) {
    const k = r();
    const y = -286 + k * 280;
    const meta = 150 + 410 * Math.pow(k, 1.6);
    ovale(ctx, (r() * 2 - 1) * meta * 0.85, y, 14 + r() * 16, 7 + r() * 5);
  }
};

/** L’interno di una casa signorile, aperto sul davanti, con una finestra a grata (Giudici 5:28). */
const sala: Pittore = (p, o) => {
  const { ctx, P, tono, t } = p;
  const muro = tono(P.muro[1]);
  const interno = tono(mescola(P.muro[0], '#2a1e18', 0.42));
  // Muri esterni e tetto piano.
  ctx.fillStyle = muro;
  ctx.fillRect(-334, -246, 668, 18);
  ctx.fillRect(-334, -232, 26, 236);
  ctx.fillRect(308, -232, 26, 236);
  for (let x = -330; x < 330; x += 30) ctx.fillRect(x, -258, 16, 14);
  // Parete di fondo.
  ctx.fillStyle = interno;
  ctx.fillRect(-308, -228, 616, 232);
  // Finestra a grata, da cui si vede fuori.
  const fx = -150;
  const cielo = ctx.createLinearGradient(0, -196, 0, -86);
  cielo.addColorStop(0, P.cielo[1]);
  cielo.addColorStop(1, P.cielo[2]);
  ctx.fillStyle = cielo;
  ctx.fillRect(fx - 70, -196, 140, 110);
  ctx.fillStyle = P.monti[1];
  ctx.beginPath();
  ctx.moveTo(fx - 70, -86);
  for (let x = -70; x <= 70; x += 10) ctx.lineTo(fx + x, -110 - Math.sin(x * 0.05) * 8);
  ctx.lineTo(fx + 70, -86);
  ctx.fill();
  ctx.save();
  ctx.beginPath();
  ctx.rect(fx - 70, -196, 140, 110);
  ctx.clip();
  ctx.strokeStyle = tono(P.tronco);
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  for (let d = -200; d <= 200; d += 18) {
    ctx.moveTo(fx + d - 60, -196);
    ctx.lineTo(fx + d + 60, -86);
    ctx.moveTo(fx + d + 60, -196);
    ctx.lineTo(fx + d - 60, -86);
  }
  ctx.stroke();
  ctx.restore();
  ctx.fillStyle = muro;
  ctx.fillRect(fx - 80, -88, 160, 10);
  ctx.fillRect(fx - 76, -204, 152, 10);
  // Stoffe tinte appese.
  const stoffe = ['#7a2a5a', '#b04a2a', '#c9a040', '#4a3a7a'];
  stoffe.forEach((c, i) => {
    const x = 70 + i * 34;
    const onda = Math.sin(t * 0.8 + i) * 1.5;
    ctx.fillStyle = tono(c);
    ctx.beginPath();
    ctx.moveTo(x, -190);
    ctx.lineTo(x + 26, -190);
    ctx.lineTo(x + 26 + onda, -70);
    ctx.lineTo(x + onda, -70);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(255,240,200,0.25)';
    for (let y = -176; y < -76; y += 22) ctx.fillRect(x + 3, y, 20, 3);
  });
  ctx.fillStyle = tono(P.tronco);
  ctx.fillRect(62, -196, 146, 6);
  // Tappeto.
  ctx.fillStyle = tono('#7a2a2a');
  ctx.fillRect(-250, -3, 500, 6);
  ctx.fillStyle = tono('#c9a040');
  for (let x = -244; x < 250; x += 26) ctx.fillRect(x, -2, 10, 3);
  // Lucerna su un sostegno.
  if (o.variante !== 1) {
    ctx.fillStyle = tono(P.tronco);
    ctx.fillRect(250, -70, 5, 72);
    ctx.fillStyle = tono('#9a6a3a');
    ovale(ctx, 252, -74, 12, 5);
    fiamma(ctx, 260, -78, 0.6, t + o.x);
    luce(p, 260, -86, 120);
  }
};

const PITTORI: Record<string, Pittore> = {
  tendone,
  otre,
  coppa,
  martello,
  carro,
  fango,
  tabor,
  sala,
  casa,
  tenda,
  albero,
  palma,
  cipresso,
  cespuglio,
  roccia,
  cumulo,
  idolo,
  fuoco,
  torcia,
  bancarella,
  giare,
  recinto,
  pecora,
  campo,
  incudine,
  porta,
  acqua,
  fiori,
  uccelli,
};

export const TIPI_OGGETTO = Object.keys(PITTORI);

export function disegnaOggetto(p: Pennello, o: Oggetto): void {
  const pittore = PITTORI[o.tipo];
  if (!pittore) return;
  p.ctx.save();
  p.ctx.translate(p.sx, p.sy);
  p.ctx.scale(p.scala, p.scala);
  pittore(p, o);
  p.ctx.restore();
}
