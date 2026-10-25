import { describe, expect, it } from 'vitest';
import { CREATURES, PERKS, RECIPES, STRUCTURES } from '../src/catalog';
import { ITEMS } from '../src/items';
import { biomeAt, generateNodes, heightAt, valleyCenter } from '../src/world';
import { PLAYER } from '../src/constants';

describe('complete game catalog', () => {
  it('uses the documented recipes and station requirements', () => {
    expect(Object.keys(RECIPES)).toHaveLength(11);
    expect(RECIPES.uplink).toEqual({
      id: 'uplink',
      cost: { scrap: 5, crystal: 3, biogel: 3, obsidian: 3, cryo: 3 },
      station: 'workbench',
    });
    expect(RECIPES.ration).toEqual({ id: 'ration', cost: { meat: 2, fiber: 1 }, station: 'campfire' });
    expect(RECIPES.filter.station).toBeNull();
    expect(RECIPES.oxycell.cost).toEqual({ crystal: 2, scrap: 1 });
    for (const [id, recipe] of Object.entries(RECIPES)) {
      expect(recipe.id).toBe(id);
      expect(ITEMS[id]).toBeDefined();
      for (const [material, cost] of Object.entries(recipe.cost)) {
        expect(ITEMS[material]).toBeDefined();
        expect(Number.isInteger(cost) && cost > 0).toBe(true);
      }
    }
  });

  it('defines all camp structures with their documented costs', () => {
    expect(Object.keys(STRUCTURES)).toHaveLength(6);
    expect(STRUCTURES.beacon.cost).toEqual({ scrap: 4, crystal: 2 });
    expect(STRUCTURES.oxygenator.cost).toEqual({ scrap: 5, crystal: 3 });
    expect(STRUCTURES.workbench.cost).toEqual({ scrap: 6, fiber: 3 });
    expect(STRUCTURES.campfire.cost).toEqual({ fiber: 4 });
    expect(STRUCTURES.turret.cost).toEqual({ scrap: 8, crystal: 4 });
    expect(STRUCTURES.barricade).toMatchObject({ cost: { scrap: 2, fiber: 2 }, hp: 150 });
    expect(
      Object.values(STRUCTURES)
        .filter((s) => s.requiresCamp)
        .map((s) => s.id),
    ).toEqual(['oxygenator', 'workbench', 'turret']);
  });

  it('preserves creature health/damage and laboratory prices from the design', () => {
    expect(Object.values(CREATURES).map(({ hp, damage }) => [hp, damage])).toEqual([
      [30, 0],
      [60, 8],
      [70, 12],
      [25, 5],
      [110, 16],
      [60, 10],
      [160, 20],
      [50, 9],
      [900, 30],
    ]);
    expect(CREATURES.hopper.hostile).toBe(false);
    expect(CREATURES.crab.hostile).toBe(false);
    expect(CREATURES.spitter.range).toBeGreaterThan(PLAYER.interactRange);
    expect(PERKS.supplies.cost).toBe(25);
    expect(PERKS.engineer.cost).toBe(60);
    expect(PERKS.blaster.cost).toBe(80);
    expect(PERKS.lungs.cost).toBe(30);
  });
});

describe('playable world resource distribution', () => {
  it('places three deterministic data caches in each biome', () => {
    const nodes = generateNodes(42);
    const caches = nodes.filter((node) => node.kind === 'cache');
    expect(caches).toHaveLength(12);
    for (let biome = 0; biome < 4; biome++) {
      expect(caches.filter((node) => biomeAt(node.z).id === biome)).toHaveLength(3);
    }
    expect(generateNodes(42).filter((node) => node.kind === 'cache')).toEqual(caches);
  });

  it('provides enough nearby wreck material for the first complete oxygen camp', () => {
    for (const seed of [0, 42, 98765]) {
      const near = generateNodes(seed).filter(
        (node) => Math.hypot(node.x - valleyCenter(seed, 0), node.z) <= 28,
      );
      const available = (kind: string) => near.filter((node) => node.kind === kind).length * 2;
      expect(available('scrap')).toBeGreaterThanOrEqual(15);
      expect(available('crystal')).toBeGreaterThanOrEqual(5);
      expect(available('fiber')).toBeGreaterThanOrEqual(3);
    }
  });

  it('keeps every biome resource on the route and does not grow fiber in the ice biome', () => {
    const seed = 98765;
    const nodes = generateNodes(seed);
    for (const [biome, resource] of ['crystal', 'biogel', 'obsidian', 'cryo'].entries()) {
      const routeResources = nodes.filter(
        (node) =>
          node.kind === resource &&
          biomeAt(node.z).id === biome &&
          Math.abs(node.x - valleyCenter(seed, node.z)) <= 15,
      );
      expect(routeResources.length).toBeGreaterThan(10);
    }
    expect(nodes.some((node) => node.kind === 'fiber' && biomeAt(node.z).id === 3)).toBe(false);
  });

  it('keeps the centre supply route walkable for a variety of world seeds', () => {
    for (const seed of [0, 1, 42, 98765, 0xffffffff]) {
      for (let z = 1; z <= 1560; z++) {
        const x = valleyCenter(seed, z);
        const px = valleyCenter(seed, z - 1);
        const rise = heightAt(seed, x, z) - heightAt(seed, px, z - 1);
        expect(rise).toBeLessThan(PLAYER.maxSlope * Math.hypot(x - px, 1));
      }
    }
  });
});
