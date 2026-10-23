import { describe, expect, it } from 'vitest';
import { hashInts, mulberry32, pickWeighted } from '../src/rng';

describe('rng', () => {
  it('is deterministic for a given seed', () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    for (let i = 0; i < 100; i++) expect(a()).toBe(b());
  });

  it('stays within [0, 1)', () => {
    const r = mulberry32(7);
    for (let i = 0; i < 10_000; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('hashes coordinates differently', () => {
    expect(hashInts(1, 2, 3)).not.toBe(hashInts(1, 3, 2));
    expect(hashInts(1, 2, 3)).toBe(hashInts(1, 2, 3));
  });

  it('picks only keys with positive weight', () => {
    const r = mulberry32(3);
    for (let i = 0; i < 200; i++) {
      expect(pickWeighted(r, { a: 0, b: 1, c: 2 })).not.toBe('a');
    }
    expect(pickWeighted(r, { a: 0 })).toBeUndefined();
  });
});
