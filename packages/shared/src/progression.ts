import { PERKS } from './catalog';
import type { ProfileData } from './game-types';

export function normalizeProfile(value: unknown): ProfileData {
  const raw = value && typeof value === 'object' ? (value as Partial<ProfileData>) : {};
  const integer = (n: unknown) =>
    typeof n === 'number' && Number.isSafeInteger(n) && n >= 0 ? Math.min(n, 100_000_000) : 0;
  return {
    research: integer(raw.research),
    runs: integer(raw.runs),
    wins: integer(raw.wins),
    unlocks: [
      ...new Set(
        Array.isArray(raw.unlocks)
          ? raw.unlocks.filter((id): id is string => typeof id === 'string' && Object.hasOwn(PERKS, id))
          : [],
      ),
    ],
  };
}

/** Mutate only after every purchase requirement has passed. */
export function purchasePerk(profile: ProfileData, id: string): string | null {
  const perk = Object.hasOwn(PERKS, id) ? PERKS[id] : undefined;
  if (!perk) return 'Questo progetto di ricerca non esiste.';
  if (profile.unlocks.includes(id)) return 'Progetto già sbloccato.';
  if (profile.research < perk.cost) return 'Dati di Ricerca insufficienti.';
  profile.research -= perk.cost;
  profile.unlocks.push(id);
  return null;
}

export function awardResearch(profile: ProfileData, research: number, won: boolean): void {
  if (!Number.isSafeInteger(research) || research < 0) return;
  profile.research = Math.min(100_000_000, profile.research + research);
  profile.runs += 1;
  if (won) profile.wins += 1;
}
