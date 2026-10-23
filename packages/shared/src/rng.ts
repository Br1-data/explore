/** Small, fast, deterministic PRNG. Returns floats in [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Integer hash of a seed and up to three integer coordinates. */
export function hashInts(seed: number, a = 0, b = 0, c = 0): number {
  let h = (seed ^ 0x9e3779b9) >>> 0;
  h = Math.imul(h ^ (a + 0x7f4a7c15), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13) ^ (b + 0x165667b1), 0xc2b2ae35);
  h = Math.imul(h ^ (h >>> 16) ^ (c + 0x27d4eb2f), 0x27d4eb2d);
  h ^= h >>> 15;
  return h >>> 0;
}

export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export const randRange = (rng: () => number, lo: number, hi: number): number => lo + (hi - lo) * rng();

export const randInt = (rng: () => number, lo: number, hi: number): number =>
  lo + Math.floor(rng() * (hi - lo + 1));

/** Pick a key from a weight table. Returns undefined if all weights are zero. */
export function pickWeighted<K extends string>(
  rng: () => number,
  weights: Partial<Record<K, number>>,
): K | undefined {
  let total = 0;
  for (const k in weights) total += weights[k] ?? 0;
  if (total <= 0) return undefined;
  let r = rng() * total;
  for (const k in weights) {
    r -= weights[k] ?? 0;
    if (r < 0) return k;
  }
  return undefined;
}
