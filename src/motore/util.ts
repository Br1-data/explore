/** Generatore pseudo-casuale deterministico (mulberry32): stessa scena, stesso aspetto. */
export function casuale(seme: number): () => number {
  let a = seme >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const limita = (v: number, min: number, max: number): number => Math.min(max, Math.max(min, v));
export const interpola = (a: number, b: number, t: number): number => a + (b - a) * t;

export function gradino(a: number, b: number, x: number): number {
  const t = limita((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

type RGB = [number, number, number];
const cacheRgb = new Map<string, RGB>();

export function rgb(hex: string): RGB {
  let v = cacheRgb.get(hex);
  if (!v) {
    const h = hex.replace('#', '');
    const n = parseInt(h.length === 3 ? h.replace(/./g, '$&$&') : h, 16);
    v = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    cacheRgb.set(hex, v);
  }
  return v;
}

/** Mescola due colori esadecimali; restituisce una stringa CSS. */
export function mescola(a: string, b: string, t: number): string {
  if (t <= 0) return a;
  if (t >= 1) return b;
  const x = rgb(a);
  const y = rgb(b);
  const c = (i: number) => Math.round(x[i] + (y[i] - x[i]) * t);
  return `#${((1 << 24) | (c(0) << 16) | (c(1) << 8) | c(2)).toString(16).slice(1)}`;
}

export function alfa(hex: string, a: number): string {
  const [r, g, bl] = rgb(hex);
  return `rgba(${r},${g},${bl},${a})`;
}
