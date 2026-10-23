import { defineConfig } from 'vite';

const serverPort = Number(process.env.SERVER_PORT ?? 2567);

export default defineConfig({
  // Relative base so the same build works from the server and inside the Electron app.
  base: './',
  server: {
    port: 5173,
    proxy: {
      '/ws': { target: `ws://localhost:${serverPort}`, ws: true },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1200,
  },
});
