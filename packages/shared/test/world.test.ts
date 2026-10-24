import { describe, expect, it } from 'vitest';
import { PLAYER, WORLD } from '../src/constants';
import { biomeAt, generateNodes, heightAt, valleyCenter } from '../src/world';

describe('procedural world', () => {
  it('recreates the same terrain and node IDs for a room seed', () => {
    const seed = 29423;
    const first = generateNodes(seed);
    expect(generateNodes(seed)).toEqual(first);
    expect(new Set(first.map((node) => node.id)).size).toBe(first.length);
    expect(first.length).toBeGreaterThan(300);
    expect(first.length).toBeLessThan(500);
    expect(generateNodes(seed + 1)).not.toEqual(first);

    const height = heightAt(seed, 30, 300);
    for (let other = 0; other < 20; other++) heightAt(other, 30, 300);
    expect(heightAt(seed, 30, 300)).toBe(height);
    expect(heightAt(seed + 1, 30, 300)).not.toBe(height);
  });

  it('provides reachable landing supplies for different seeds', () => {
    for (const seed of [0, 1, 42, 1234, 0xffffffff]) {
      const nodes = generateNodes(seed);
      const x = valleyCenter(seed, WORLD.crashZ);
      expect(heightAt(seed, x, WORLD.crashZ)).toBe(0);
      for (const kind of ['scrap', 'crystal']) {
        expect(
          nodes.some(
            (node) =>
              node.kind === kind && Math.hypot(node.x - x, node.z - WORLD.crashZ) <= PLAYER.interactRange,
          ),
        ).toBe(true);
      }
      expect(nodes.some((node) => node.kind === 'oxygen' && Math.hypot(node.x - x, node.z) < 8)).toBe(true);
      for (const node of nodes) {
        expect(node.z).toBeGreaterThanOrEqual(WORLD.zMin);
        expect(node.z).toBeLessThanOrEqual(WORLD.zMax);
        expect(Math.abs(node.x - valleyCenter(seed, node.z))).toBeLessThan(WORLD.halfWidth);
      }
    }
  });

  it('assigns all four biomes and clamps the landing and extraction edges', () => {
    expect(biomeAt(-120).id).toBe(0);
    expect(biomeAt(399).id).toBe(0);
    expect(biomeAt(400).id).toBe(1);
    expect(biomeAt(800).id).toBe(2);
    expect(biomeAt(1200).id).toBe(3);
    expect(biomeAt(1640).id).toBe(3);
  });
});
