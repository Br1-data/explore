import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { awardResearch, normalizeProfile, purchasePerk, type ProfileData } from '@segnale/shared';

export class ProfileStore {
  private readonly db: DatabaseSync;
  constructor(path = ':memory:') {
    if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
    this.db = new DatabaseSync(path);
    this.db.exec(
      'PRAGMA journal_mode = WAL; CREATE TABLE IF NOT EXISTS profiles (token TEXT PRIMARY KEY, data TEXT NOT NULL); CREATE TABLE IF NOT EXISTS settlements (run_id TEXT NOT NULL, token TEXT NOT NULL, PRIMARY KEY (run_id, token));',
    );
  }
  load(token: string): ProfileData {
    const row = this.db.prepare('SELECT data FROM profiles WHERE token = ?').get(token);
    if (!row) return normalizeProfile(null);
    try {
      return normalizeProfile(JSON.parse(String(row.data)));
    } catch {
      return normalizeProfile(null);
    }
  }
  private save(token: string, profile: ProfileData): void {
    this.db
      .prepare(
        'INSERT INTO profiles(token,data) VALUES(?,?) ON CONFLICT(token) DO UPDATE SET data=excluded.data',
      )
      .run(token, JSON.stringify(profile));
  }
  purchase(token: string, id: string): { profile: ProfileData; error: string | null } {
    this.db.exec('BEGIN IMMEDIATE');
    try {
      const profile = this.load(token);
      const error = purchasePerk(profile, id);
      if (!error) this.save(token, profile);
      this.db.exec('COMMIT');
      return { profile, error };
    } catch (error) {
      this.db.exec('ROLLBACK');
      throw error;
    }
  }
  settle(token: string, runId: string, research: number, won: boolean): ProfileData {
    this.db.exec('BEGIN IMMEDIATE');
    try {
      const profile = this.load(token);
      const exists = this.db
        .prepare('SELECT 1 FROM settlements WHERE run_id=? AND token=?')
        .get(runId, token);
      if (!exists) {
        awardResearch(profile, research, won);
        this.save(token, profile);
        this.db.prepare('INSERT INTO settlements(run_id,token) VALUES(?,?)').run(runId, token);
      }
      this.db.exec('COMMIT');
      return profile;
    } catch (error) {
      this.db.exec('ROLLBACK');
      throw error;
    }
  }
  close(): void {
    this.db.close();
  }
}
