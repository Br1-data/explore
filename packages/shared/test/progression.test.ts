import { describe, expect, it } from 'vitest';
import { awardResearch, normalizeProfile, purchasePerk } from '../src/progression';

describe('research economy', () => {
  it('rejects invalid and duplicate purchases without losing funds', () => {
    const profile = normalizeProfile({ research: 30, unlocks: [], wins: 0, runs: 0 });
    expect(purchasePerk(profile, 'lungs')).toBeNull();
    expect(profile).toMatchObject({ research: 0, unlocks: ['lungs'] });
    expect(purchasePerk(profile, 'lungs')).toMatch(/già/);
    expect(purchasePerk(profile, 'armor')).toMatch(/insufficienti/);
    expect(purchasePerk(profile, '__proto__')).toMatch(/non esiste/);
    expect(profile.research).toBe(0);
  });
  it('sanitizes broken saves and counts completed runs and wins', () => {
    const profile = normalizeProfile({ research: NaN, unlocks: ['lungs', 'lungs', '__proto__'], runs: -1 });
    expect(profile).toEqual({ research: 0, unlocks: ['lungs'], runs: 0, wins: 0 });
    awardResearch(profile, 55, true);
    awardResearch(profile, 5, false);
    expect(profile).toMatchObject({ research: 60, runs: 2, wins: 1 });
  });
});
