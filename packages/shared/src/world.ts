import { createNoise2D } from 'simplex-noise';
import { WORLD } from './constants';
import { clamp, smoothstep } from './math';
import { hashInts, mulberry32, randRange } from './rng';

export type NodeKind =
  | 'scrap'
  | 'crystal'
  | 'fiber'
  | 'oxygen'
  | 'fruit'
  | 'biogel'
  | 'obsidian'
  | 'cryo'
  | 'cache';

export interface WorldNode {
  id: string;
  kind: NodeKind;
  x: number;
  z: number;
}

export interface Biome {
  id: number;
  name: string;
  color: string;
  accent: string;
}

export const BIOMES: readonly Biome[] = [
  { id: 0, name: 'Prateria Cristallina', color: '#357e77', accent: '#ff83cc' },
  { id: 1, name: 'Giungla Fungina', color: '#55476d', accent: '#e7b66e' },
  { id: 2, name: 'Distese di Vetro', color: '#b28b58', accent: '#514568' },
  { id: 3, name: 'Picchi Ghiacciati', color: '#adc6ce', accent: '#7fe8ff' },
];

export function biomeAt(z: number): Biome {
  return BIOMES[clamp(Math.floor(z / WORLD.biomeLength), 0, BIOMES.length - 1)];
}

/** Shared by terrain, resources and simulation; never depends on generation order. */
export function valleyCenter(seed: number, z: number): number {
  const phase = ((hashInts(seed, 17) % 10000) / 10000) * Math.PI * 2;
  return Math.sin(z / 230 + phase) * 34 + Math.sin(z / 89 + phase * 0.7) * 12;
}

const noises = new Map<number, ReturnType<typeof createNoise2D>>();

function noiseFor(seed: number): ReturnType<typeof createNoise2D> {
  const existing = noises.get(seed);
  if (existing) return existing;
  const noise = createNoise2D(mulberry32(seed));
  // Bound the cache when a long-running server has hosted many different worlds.
  if (noises.size >= 16) noises.delete(noises.keys().next().value!);
  noises.set(seed, noise);
  return noise;
}

/** Ground/feet height in metres. The landing zone is deliberately gentle. */
export function heightAt(seed: number, x: number, z: number): number {
  const noise = noiseFor(seed);
  const centre = valleyCenter(seed, z);
  // Keep a gentle central route through every biome; taller relief belongs at the sides.
  const pathBlend = smoothstep(10, 50, Math.abs(x - centre));
  const hills = noise(x * 0.009, z * 0.009) * 7 + noise(x * 0.035, z * 0.035) * (0.5 + pathBlend * 1.2);
  const crashDistance = Math.hypot(x - valleyCenter(seed, WORLD.crashZ), z - WORLD.crashZ);
  const landingBlend = smoothstep(10, 38, crashDistance);
  const walls = smoothstep(WORLD.halfWidth - 22, WORLD.halfWidth + 38, Math.abs(x - centre));
  return hills * landingBlend + walls * (45 + noise(x * 0.02, z * 0.02) * 9);
}

/** Stable node IDs let snapshots transmit depletion instead of every static object. */
export function generateNodes(seed: number): WorldNode[] {
  const nodes: WorldNode[] = [];
  const add = (kind: NodeKind, offsetX: number, z: number) => {
    nodes.push({ id: `node-${nodes.length}`, kind, x: valleyCenter(seed, z) + offsetX, z });
  };

  // The first craft can be completed without searching an entire biome.
  add('scrap', -2, 1.5);
  add('crystal', 2, 1.5);
  add('fiber', -4, 4);
  add('oxygen', 4, 4);
  add('fruit', 0, 7);
  add('crystal', -3, 8);
  add('scrap', 5, 10);

  // The wreck supplies enough material for a beacon, workbench and oxygenator.
  // Keep node-0 and node-1 fixed: the first oxygen cell remains an easy tutorial.
  for (let i = 0; i < 8; i++) add('scrap', Math.sin(i * 1.9) * 12, 10 + i * 1.7);
  for (let i = 0; i < 4; i++) add('fiber', -7 - i * 1.8, 12 + i * 2.3);
  for (let i = 0; i < 3; i++) add('crystal', 7 + i * 2, 13 + i * 3);

  const rng = mulberry32(hashInts(seed, 41));
  for (let row = 0; row < 56; row++) {
    const z = 30 + row * 27;
    const biome = biomeAt(z).id;
    const resource: NodeKind = ['crystal', 'biogel', 'obsidian', 'cryo'][biome] as NodeKind;
    if (row % (biome >= 2 ? 2 : 1) === 0) add('oxygen', randRange(rng, -8, 8), z);
    if (biome < 2 && row % 2 === 0) add('fruit', randRange(rng, -12, 12), z + 5);
    // Rare materials are always available near the route, not only far off-screen.
    add(resource, randRange(rng, -14, 14), z + 7);
    add('scrap', randRange(rng, -18, 18), z - 4);
    for (let i = 0; i < 4; i++) {
      const roll = rng();
      let kind: NodeKind = roll < 0.25 ? 'scrap' : roll < 0.45 && biome < 3 ? 'fiber' : resource;
      // A few off-biome finds support tools and healing before the next region.
      if ((biome === 0 || biome === 2) && roll > 0.97) kind = 'biogel';
      if (biome === 1 && roll > 0.9) kind = 'crystal';
      add(
        kind,
        randRange(rng, -72, 72),
        clamp(
          z + randRange(rng, -10, 10),
          biome * WORLD.biomeLength + 1,
          (biome + 1) * WORLD.biomeLength - 1,
        ),
      );
    }
  }
  // Three shared research caches per biome. Cache IDs remain deterministic.
  for (let biome = 0; biome < 4; biome++) {
    for (let i = 0; i < 3; i++) {
      add('cache', randRange(rng, -30, 30), biome * WORLD.biomeLength + 90 + i * 110);
    }
  }
  return nodes;
}
