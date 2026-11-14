import type { Stile } from '@/contenuti/tipi';

/**
 * L’aspetto dei personaggi del libro che hanno un ruolo o compaiono come attori
 * (`stile` nei ruoli e negli attori). Ogni capitolo li riceve tramite `capitolo()`
 * in comune.ts: aggiungere qui chi compare in un capitolo nuovo.
 */
export const PERSONAGGI: Record<string, Stile> = {
  enoc: {
    tipo: 'uomo',
    veste: '#efe2c2',
    fascia: '#b4783a',
    pelle: '#b98a62',
    capelli: '#3a2a20',
    barba: true,
    accessorio: 'bastone',
    scala: 1,
  },
  matusalemme: {
    tipo: 'uomo',
    veste: '#6a9a94',
    fascia: '#e0c890',
    pelle: '#b98a62',
    capelli: '#3a2a20',
    barba: true,
    accessorio: 'bastone',
    scala: 1,
  },
  empio: {
    tipo: 'uomo',
    veste: '#8f3d30',
    fascia: '#2c2320',
    pelle: '#b5835a',
    capelli: '#241c18',
    barba: true,
    accessorio: 'clava',
    scala: 1,
  },
  // Capitolo 16: uno dei 10.000, quasi senza armi (Giudici 5:8).
  volontario: {
    tipo: 'uomo',
    veste: '#7d6a4e',
    fascia: '#4a3a2c',
    pelle: '#a36f4a',
    capelli: '#2a1f1a',
    barba: true,
    scala: 0.98,
  },
  // Capitoli 16 e 17.
  iael: {
    tipo: 'donna',
    veste: '#6a4f7a',
    fascia: '#c08a4a',
    pelle: '#b98a62',
    capelli: '#2a1f1a',
    velo: '#c9a77a',
    scala: 0.97,
  },
  sisera: {
    tipo: 'uomo',
    veste: '#7a2a24',
    fascia: '#c9a84a',
    pelle: '#b5835a',
    capelli: '#1e1a18',
    barba: true,
    scala: 1.04,
  },
  barac: {
    tipo: 'uomo',
    veste: '#8a7a52',
    fascia: '#3d4a3a',
    pelle: '#a36f4a',
    capelli: '#2a1f1a',
    barba: true,
    accessorio: 'lancia',
    scala: 1,
  },
  debora: {
    tipo: 'donna',
    veste: '#e6d6b0',
    fascia: '#6a8a5a',
    pelle: '#b98a62',
    capelli: '#3a2a20',
    velo: '#9fb59a',
    scala: 0.97,
  },
  madre: {
    tipo: 'donna',
    veste: '#5a2f4a',
    fascia: '#d0a040',
    pelle: '#c79a72',
    capelli: '#8a8078',
    velo: '#8a4a6a',
    scala: 0.95,
  },
};
