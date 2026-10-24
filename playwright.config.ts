import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 90_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: 'http://127.0.0.1:5174',
    viewport: { width: 1100, height: 720 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
      args: ['--enable-unsafe-swiftshader'],
    },
  },
  webServer: [
    {
      command: 'npm run build -w @segnale/client && node e2e/serve-pages.mjs',
      env: { VITE_SERVER_URL: '' },
      url: 'http://127.0.0.1:5176/explore/',
      reuseExistingServer: false,
    },
    {
      command: 'npm run dev -w @segnale/server',
      env: { PORT: '2570' },
      url: 'http://localhost:2570/health',
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run dev -w @segnale/client -- --host 127.0.0.1 --port 5174 --strictPort',
      env: { SERVER_PORT: '2570' },
      url: 'http://127.0.0.1:5174',
      reuseExistingServer: !process.env.CI,
    },
  ],
});
