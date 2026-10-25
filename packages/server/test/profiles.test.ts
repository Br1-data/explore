import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ProfileStore } from '../src/profiles';

describe('persistent research profiles', () => {
  it('settles a run once, charges unlocks once, and preserves independent profiles on restart', () => {
    const dir = mkdtempSync(join(tmpdir(), 'segnale-profiles-'));
    const path = join(dir, 'profiles.sqlite');
    let profiles = new ProfileStore(path);
    try {
      expect(profiles.purchase('ada-token', 'supplies').error).toMatch(/insufficienti/);
      expect(profiles.settle('ada-token', 'run-1', 60, true)).toMatchObject({
        research: 60,
        runs: 1,
        wins: 1,
      });
      expect(profiles.settle('ada-token', 'run-1', 60, true).research).toBe(60);
      expect(profiles.purchase('ada-token', 'supplies')).toMatchObject({
        error: null,
        profile: { research: 35, unlocks: ['supplies'] },
      });
      expect(profiles.purchase('ada-token', 'supplies').error).toMatch(/già/);
      expect(profiles.purchase('ada-token', '__proto__').error).toMatch(/non esiste/);
      expect(profiles.load('bruno-token')).toMatchObject({ research: 0, unlocks: [], runs: 0 });
      profiles.close();
      profiles = new ProfileStore(path);
      expect(profiles.load('ada-token')).toMatchObject({
        research: 35,
        unlocks: ['supplies'],
        runs: 1,
        wins: 1,
      });
      expect(profiles.settle('ada-token', 'run-1', 60, true).research).toBe(35);
    } finally {
      profiles.close();
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
