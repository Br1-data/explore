import { describe, expect, it } from 'vitest';
import { normalizza } from '../src/salvataggio';

describe('salvataggi', () => {
  it('porta i salvataggi della versione 1 (un solo libro) alle chiavi per pubblicazione', () => {
    const d = normalizza({
      v: 1,
      dettagli: { '16': ['tabor'] },
      sensazioni: { '1': { solo: 'appunto' } },
      risposte: {},
      versi: { '17': ['gdc-4-9'] },
      ruoli: { '16:barac': { scena: 2, finito: false } },
      muto: true,
      guidaVista: true,
    } as { v: number });
    expect(d.v).toBe(2);
    expect(d.dettagli).toEqual({ 'coraggio:16': ['tabor'] });
    expect(d.sensazioni).toEqual({ 'coraggio:1': { solo: 'appunto' } });
    expect(d.versi).toEqual({ 'coraggio:17': ['gdc-4-9'] });
    expect(d.ruoli).toEqual({ 'coraggio:16:barac': { scena: 2, finito: false } });
    expect(d.muto && d.guidaVista).toBe(true);
  });

  it('lascia com’è la versione attuale e svuota ciò che non riconosce', () => {
    expect(normalizza({ v: 2, dettagli: { 'coraggio:1': ['x'] } } as { v: number }).dettagli).toEqual({ 'coraggio:1': ['x'] });
    expect(normalizza(null).v).toBe(2);
    expect(normalizza({ v: 9 }).dettagli).toEqual({});
  });
});
