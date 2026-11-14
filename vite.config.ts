import { defineConfig } from 'vite';

// Base relativa: il gioco funziona sia in locale sia sotto un sottopercorso (GitHub Pages).
// «@/» è la cartella src: gli import non dipendono da quanto è annidato un file.
export default defineConfig({
  base: './',
  resolve: { alias: [{ find: /^@\//, replacement: '/src/' }] },
  build: { target: 'es2022', sourcemap: false },
  server: { host: true, port: 5173 },
  preview: { host: true, port: 4173 },
});
