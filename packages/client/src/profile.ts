import { awardResearch, normalizeProfile, purchasePerk } from '@segnale/shared';
import type { ProfileData } from '@segnale/shared';

const PROFILE_KEY = 'segnale-profile-v1';
const SAVE_KEY = 'segnale-expedition-v1';
interface StoredProfile {
  profile: ProfileData;
  settled: string[];
}
export interface LocalRunSave {
  version: 1;
  id: string;
  data: unknown;
  savedAt: number;
}
let memory: StoredProfile = { profile: normalizeProfile(null), settled: [] };
let memorySave: LocalRunSave | null = null;

function readProfile(): StoredProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      const value = JSON.parse(raw) as Partial<StoredProfile>;
      memory = {
        profile: normalizeProfile(value.profile),
        settled: Array.isArray(value.settled)
          ? value.settled.filter((id): id is string => typeof id === 'string').slice(-128)
          : [],
      };
    }
  } catch {
    /* Keep a working in-memory profile when storage is unavailable. */
  }
  return { profile: normalizeProfile(memory.profile), settled: [...memory.settled] };
}
function storeProfile(value: StoredProfile): void {
  memory = value;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(value));
  } catch {
    /* Current session remains usable. */
  }
}
export function loadLocalProfile(): ProfileData {
  return readProfile().profile;
}
export function purchaseLocalPerk(id: string): { profile: ProfileData; error?: string } {
  const state = readProfile();
  const error = purchasePerk(state.profile, id);
  if (!error) storeProfile(state);
  return { profile: state.profile, ...(error ? { error } : {}) };
}
export function awardLocalRun(id: string, research: number, won: boolean): ProfileData {
  const state = readProfile();
  if (!state.settled.includes(id)) {
    awardResearch(state.profile, research, won);
    state.settled.push(id);
    state.settled = state.settled.slice(-128);
    storeProfile(state);
  }
  return state.profile;
}
export function readLocalRun(): LocalRunSave | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      if (raw.length > 5_000_000) return null;
      const saved = JSON.parse(raw) as Partial<LocalRunSave>;
      memorySave =
        saved.version === 1 &&
        typeof saved.id === 'string' &&
        saved.data &&
        typeof saved.data === 'object' &&
        typeof saved.savedAt === 'number'
          ? (saved as LocalRunSave)
          : null;
    } else memorySave = null;
  } catch {
    /* Use a current-session save if browser storage is blocked. */
  }
  return memorySave;
}
export function hasLocalSave(): boolean {
  return readLocalRun() !== null;
}
export function writeLocalRun(save: LocalRunSave): boolean {
  memorySave = save;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
    return true;
  } catch {
    return false;
  }
}
export function clearLocalSave(): void {
  memorySave = null;
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    /* Nothing persisted. */
  }
}
