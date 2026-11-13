import { defineConfig } from 'vite';

// Base relativa: il gioco funziona sia in locale sia sotto un sottopercorso (GitHub Pages).
export default defineConfig({
  base: './',
  build: { target: 'es2022', sourcemap: false },
  server: { host: true, port: 5173 },
  preview: { host: true, port: 4173 },
});
