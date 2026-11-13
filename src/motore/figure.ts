import type { Posa } from '../content/tipi';
import { casuale } from './util';

export interface Stile {
  tipo: 'uomo' | 'donna' | 'bimbo';
  veste: string;
  fascia: string;
  pelle: string;
  capelli: string;
  barba?: boolean;
  velo?: string;
  accessorio?: 'bastone' | 'clava' | 'lancia' | 'torcia';
  scala: number;
}

export interface StatoFigura {
  x: number;
  y: number;
  verso: 1 | -1;
  posa: Posa;
  /** Fase del passo (radianti). */
  fase: number;
  /** Tempo, per le piccole animazioni. */
  t: number;
  /** Inclinazione in avanti (radianti). */
  chino?: number;
  alpha?: number;
}

export interface Luce {
  x: number;
  y: number;
  r: number;
}

/** Aspetto dei personaggi che hanno un ruolo nel racconto. */
export const STILI: Record<string, Stile> = {
  enoc: {
    tipo: 'uomo',
    veste: '#efe2c2',
    fascia: '#b4783a',
    pelle: '#b98a62',
    capelli: '#3a2a20',
    barba: true,
    accessorio: 'bastone',
    scala: 1,
  },
  matusalemme: {
    tipo: 'uomo',
    veste: '#6a9a94',
    fascia: '#e0c890',
    pelle: '#b98a62',
    capelli: '#3a2a20',
    barba: true,
    accessorio: 'bastone',
    scala: 1,
  },
  empio: {
    tipo: 'uomo',
    veste: '#8f3d30',
    fascia: '#2c2320',
    pelle: '#b5835a',
    capelli: '#241c18',
    barba: true,
    accessorio: 'clava',
    scala: 1,
  },
};

const VESTI = ['#8c6f56', '#6f5a4a', '#7a6a52', '#5f6b5a', '#8a5a48', '#6a5870', '#94805c', '#4f5d6b', '#7d4f3f', '#a08a68'];
const FASCE = ['#3d2e26', '#52403a', '#2f3a3a', '#5a3a2a', '#40384a'];
const PELLI = ['#c79a72', '#b5835a', '#a36f4a', '#8f5f40', '#d2a67e'];
const CAPELLI = ['#2a1f1a', '#3b2b22', '#1e1a18', '#5a4a3c', '#8a8078'];
const VELI = ['#9a7a5a', '#7a6a7a', '#a89270', '#6a7a70', '#8a5f50'];

/** Aspetto casuale ma stabile per una persona della folla. */
export function stileFolla(
  seme: number,
  opz: { donna?: boolean; bimbo?: boolean; armato?: boolean; torcia?: boolean } = {},
): Stile {
  const r = casuale(seme * 7919 + 13);
  const scegli = <T>(a: T[]): T => a[Math.floor(r() * a.length)];
  const tipo: Stile['tipo'] = opz.bimbo ? 'bimbo' : opz.donna ? 'donna' : 'uomo';
  const stile: Stile = {
    tipo,
    veste: scegli(VESTI),
    fascia: scegli(FASCE),
    pelle: scegli(PELLI),
    capelli: scegli(CAPELLI),
    barba: tipo === 'uomo' && r() < 0.75,
    velo: tipo === 'donna' ? scegli(VELI) : undefined,
    scala: tipo === 'bimbo' ? 0.58 + r() * 0.1 : 0.94 + r() * 0.12,
  };
  if (opz.torcia) stile.accessorio = 'torcia';
  else if (opz.armato) stile.accessorio = r() < 0.5 ? 'clava' : 'lancia';
  return stile;
}

type Tono = (colore: string) => string;

const H = 96;
const R = 9;
const Y_SPALLA = -H + 2 * R + 4;
const Y_ANCA = -40;

function braccio(
  ctx: CanvasRenderingContext2D,
  verso: number,
  sx: number,
  sy: number,
  angolo: number,
  piega: number,
  manica: string,
  pelle: string,
): { x: number; y: number } {
  // Angolo 0 = braccio lungo il fianco; positivo = in avanti e verso l’alto.
  const ax = sx + Math.sin(angolo) * 16 * verso;
  const ay = sy + Math.cos(angolo) * 16;
  const a2 = angolo + piega;
  const bx = ax + Math.sin(a2) * 15 * verso;
  const by = ay + Math.cos(a2) * 15;
  ctx.lineCap = 'round';
  ctx.strokeStyle = manica;
  ctx.lineWidth = 6.5;
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(ax, ay);
  ctx.stroke();
  ctx.strokeStyle = pelle;
  ctx.lineWidth = 4.6;
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(bx, by);
  ctx.stroke();
  ctx.fillStyle = pelle;
  ctx.beginPath();
  ctx.arc(bx, by, 2.9, 0, Math.PI * 2);
  ctx.fill();
  return { x: bx, y: by };
}

function angoli(posa: Posa, fase: number, t: number): { av: number; pv: number; di: number; pd: number } {
  // av/pv: angolo e piega del braccio avanti; di/pd: del braccio dietro.
  switch (posa) {
    case 'cammina':
      return { av: Math.sin(fase + Math.PI) * 0.5, pv: 0.32, di: Math.sin(fase) * 0.5, pd: 0.32 };
    case 'parla':
      return { av: 0.75 + Math.sin(t * 3.1) * 0.22, pv: 1.0, di: -0.1, pd: 0.2 };
    case 'pugno':
      return { av: 2.55 + Math.sin(t * 9) * 0.14, pv: -0.35, di: -0.25, pd: 0.5 };
    case 'indica':
      return { av: 1.5 + Math.sin(t * 2) * 0.04, pv: 0.05, di: -0.15, pd: 0.25 };
    case 'alza':
      return { av: 2.65 + Math.sin(t * 2.1) * 0.12, pv: -0.18, di: 2.5 + Math.sin(t * 2.1 + 1) * 0.12, pd: -0.18 };
    case 'proclama':
      return { av: 1.95 + Math.sin(t * 2.2) * 0.12, pv: 0.3, di: 0.55 + Math.sin(t * 1.7) * 0.08, pd: 0.7 };
    default:
      return { av: 0.1 + Math.sin(t * 1.3) * 0.03, pv: 0.16, di: -0.12, pd: 0.16 };
  }
}

/**
 * Disegna una persona con i piedi in (x, y). Le figure non hanno volto:
 * contano la postura e i gesti. Restituisce l’eventuale luce di una torcia.
 */
export function disegnaFigura(ctx: CanvasRenderingContext2D, s: Stile, f: StatoFigura, tono: Tono): Luce | null {
  const alpha = f.alpha ?? 1;
  if (alpha <= 0.01) return null;
  const v = f.verso;
  const veste = tono(s.veste);
  const pelle = tono(s.pelle);
  const capelli = tono(s.capelli);
  const fascia = tono(s.fascia);
  const sdraiato = f.posa === 'sdraiato';
  const cammina = f.posa === 'cammina';
  let luce: Luce | null = null;

  ctx.save();
  ctx.globalAlpha *= alpha;

  // Ombra a terra.
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.ellipse(f.x, f.y + 1, (sdraiato ? 44 : 17) * s.scala, 4 * s.scala, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.translate(f.x, f.y);
  ctx.scale(s.scala, s.scala);
  if (sdraiato) {
    ctx.translate(0, -7);
    ctx.rotate((-v * Math.PI) / 2);
  } else {
    const respiro = Math.sin(f.t * 1.6 + f.x * 0.01) * 0.6;
    const sobbalzo = cammina ? Math.abs(Math.sin(f.fase)) * -1.6 : respiro * 0.5;
    ctx.translate(0, sobbalzo);
    if (f.chino) ctx.rotate(f.chino * v);
  }

  const testa = s.tipo === 'bimbo' ? R * 1.25 : R;
  const yTesta = -H + R;
  const orlo = s.tipo === 'donna' ? -5 : -17;
  const ondeggia = cammina ? Math.sin(f.fase) * 1.6 : 0;
  const a = angoli(sdraiato ? 'fermo' : f.posa, f.fase, f.t);
  const torcia = s.accessorio === 'torcia' && !sdraiato;
  if (torcia) {
    a.av = 2.2 + Math.sin(f.t * 1.4 + f.x) * 0.06;
    a.pv = -0.25;
  }

  // Gambe.
  const passo = cammina ? Math.sin(f.fase) * 10 : 0;
  ctx.lineCap = 'round';
  ctx.strokeStyle = pelle;
  ctx.lineWidth = 5.4;
  for (const lato of [-1, 1] as const) {
    const px = lato * passo * v + lato * 3.2;
    const alza = cammina ? Math.max(0, Math.sin(f.fase + (lato > 0 ? Math.PI / 2 : -Math.PI / 2))) * 3.2 : 0;
    ctx.beginPath();
    ctx.moveTo(lato * 3.2, Y_ANCA + 8);
    ctx.lineTo(px, -alza - 1.5);
    ctx.stroke();
    ctx.fillStyle = tono('#4a3828');
    ctx.beginPath();
    ctx.ellipse(px + 2.4 * v, -alza - 1, 4.6, 2.3, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Bastone o lancia, dietro al corpo.
  if (!sdraiato && (s.accessorio === 'bastone' || s.accessorio === 'lancia')) {
    const lungo = s.accessorio === 'lancia';
    const bx = (lungo ? -13 : 15) * v + (cammina ? Math.sin(f.fase) * 2 * v : 0);
    ctx.strokeStyle = tono('#5d4a34');
    ctx.lineWidth = lungo ? 2.6 : 3;
    ctx.beginPath();
    ctx.moveTo(bx, 0);
    ctx.lineTo(bx + (lungo ? 0 : 1.5 * v), lungo ? -H - 30 : Y_SPALLA + 2);
    ctx.stroke();
    if (lungo) {
      ctx.fillStyle = tono('#8a8f98');
      ctx.beginPath();
      ctx.moveTo(bx, -H - 44);
      ctx.lineTo(bx - 3.6, -H - 28);
      ctx.lineTo(bx + 3.6, -H - 28);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Braccio dietro.
  braccio(ctx, v, -7 * v, Y_SPALLA + 5, a.di, a.pd, tono(piuScuro(s.veste)), pelle);

  // Veste.
  ctx.fillStyle = veste;
  ctx.beginPath();
  ctx.moveTo(-10.5, Y_SPALLA + 3);
  ctx.quadraticCurveTo(0, Y_SPALLA - 6, 10.5, Y_SPALLA + 3);
  ctx.lineTo(12.5 + ondeggia, orlo);
  ctx.quadraticCurveTo(0 + ondeggia, orlo + 3, -12.5 + ondeggia, orlo);
  ctx.closePath();
  ctx.fill();
  // Piega in ombra sul lato opposto alla luce.
  ctx.fillStyle = 'rgba(0,0,0,0.13)';
  ctx.beginPath();
  ctx.moveTo(-10.5 * v, Y_SPALLA + 3);
  ctx.lineTo(-12.5 * v + ondeggia, orlo);
  ctx.lineTo(-4.5 * v + ondeggia, orlo + 1.5);
  ctx.lineTo(-3 * v, Y_SPALLA);
  ctx.closePath();
  ctx.fill();
  // Fascia in vita.
  ctx.fillStyle = fascia;
  ctx.fillRect(-11.6, Y_ANCA - 5, 23.2, 5.2);

  // Testa.
  if (s.velo) {
    ctx.fillStyle = tono(s.velo);
    ctx.beginPath();
    ctx.ellipse(-1 * v, yTesta + 3, 11.5, 13.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-11, yTesta + 6);
    ctx.lineTo(-12.5, Y_SPALLA + 16);
    ctx.lineTo(12.5, Y_SPALLA + 16);
    ctx.lineTo(11, yTesta + 6);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillStyle = capelli;
    ctx.beginPath();
    ctx.arc(-1.6 * v, yTesta - 1.2, testa + 0.8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = pelle;
  ctx.beginPath();
  ctx.arc(1.8 * v, yTesta + 1, testa - 1.2, 0, Math.PI * 2);
  ctx.fill();
  if (s.barba) {
    ctx.fillStyle = capelli;
    ctx.beginPath();
    ctx.ellipse(3.4 * v, yTesta + 7.5, 5.6, 6.2, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Braccio avanti, con ciò che tiene in mano.
  const mano = braccio(ctx, v, 7.5 * v, Y_SPALLA + 5, a.av, a.pv, veste, pelle);
  if (!sdraiato && s.accessorio === 'clava') {
    ctx.strokeStyle = tono('#4f3c2a');
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(mano.x - 2 * v, mano.y + 3);
    ctx.lineTo(mano.x + 9 * v, mano.y - 21);
    ctx.stroke();
    ctx.lineWidth = 7.5;
    ctx.beginPath();
    ctx.moveTo(mano.x + 7 * v, mano.y - 16);
    ctx.lineTo(mano.x + 9.5 * v, mano.y - 22);
    ctx.stroke();
  }
  if (torcia) {
    const tx = mano.x + 2 * v;
    const ty = mano.y - 24;
    ctx.strokeStyle = '#3d2c1e';
    ctx.lineWidth = 3.4;
    ctx.beginPath();
    ctx.moveTo(mano.x, mano.y + 4);
    ctx.lineTo(tx, ty);
    ctx.stroke();
    fiamma(ctx, tx, ty, 1, f.t + f.x);
    luce = { x: f.x + tx * s.scala, y: f.y + (ty - 6) * s.scala, r: 120 * s.scala };
  }

  ctx.restore();
  return luce;
}

/** Manica in ombra: stessa tinta, un poco più scura. */
function piuScuro(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const c = (sh: number) => Math.round(((n >> sh) & 255) * 0.82);
  return `#${((1 << 24) | (c(16) << 16) | (c(8) << 8) | c(0)).toString(16).slice(1)}`;
}

/** Fiamma tremolante (torce e fuochi). */
export function fiamma(ctx: CanvasRenderingContext2D, x: number, y: number, scala: number, t: number): void {
  const g = Math.sin(t * 11) * 1.4 + Math.sin(t * 17.3) * 0.9;
  const h = (15 + Math.sin(t * 7.1) * 2.6) * scala;
  const w = 5.6 * scala;
  for (const [colore, k] of [
    ['#e8622a', 1],
    ['#f8b040', 0.66],
    ['#fff0b0', 0.36],
  ] as const) {
    ctx.fillStyle = colore;
    ctx.beginPath();
    ctx.moveTo(x - w * k, y);
    ctx.quadraticCurveTo(x - w * k * 1.2, y - h * k * 0.55, x + g * k * scala, y - h * k);
    ctx.quadraticCurveTo(x + w * k * 1.2, y - h * k * 0.55, x + w * k, y);
    ctx.quadraticCurveTo(x, y + 3 * k * scala, x - w * k, y);
    ctx.fill();
  }
}
