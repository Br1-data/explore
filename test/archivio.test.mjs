import { describe, expect, it } from 'vitest';
import { archivioFinto } from '../archivio/finto.mjs';

describe('archivio dei salvataggi (Codice.gs)', () => {
  const a = archivioFinto();
  const chiedi = (corpo) => JSON.parse(a.richiesta(JSON.stringify(corpo)));

  it('registra, entra con password o chiave, salva', () => {
    const r = chiedi({ azione: 'registra', utente: ' Bruno ', password: 'abcd', dati: { v: 1, muto: true } });
    expect(r).toMatchObject({ ok: true, dati: { muto: true } });
    expect(a.file.get('bruno.json')).not.toContain('abcd');
    expect(chiedi({ azione: 'entra', utente: 'bruno', password: 'abcd' })).toMatchObject({ ok: true, chiave: r.chiave });
    expect(chiedi({ azione: 'salva', utente: 'BRUNO', chiave: r.chiave, dati: { v: 1, muto: false } }).ok).toBe(true);
    expect(chiedi({ azione: 'entra', utente: 'bruno', chiave: r.chiave }).dati).toEqual({ v: 1, muto: false });
  });

  it('rifiuta nomi presi, password e chiavi sbagliate, nomi non validi', () => {
    expect(chiedi({ azione: 'registra', utente: 'bruno', password: 'xxxx' }).ok).toBe(false);
    expect(chiedi({ azione: 'entra', utente: 'bruno', password: 'abce' }).ok).toBe(false);
    expect(chiedi({ azione: 'entra', utente: 'nessuno', password: 'abcd' }).ok).toBe(false);
    expect(chiedi({ azione: 'salva', utente: 'bruno', chiave: 'falsa', dati: {} }).ok).toBe(false);
    expect(chiedi({ azione: 'salva', utente: 'bruno', chiave: '', password: 'abce', dati: {} }).ok).toBe(false);
    expect(chiedi({ azione: 'registra', utente: 'a b', password: 'abcd' }).ok).toBe(false);
    expect(chiedi({ azione: 'registra', utente: 'nuovo', password: 'abc' }).ok).toBe(false);
    expect(JSON.parse(a.richiesta('non è json')).ok).toBe(false);
  });
});
