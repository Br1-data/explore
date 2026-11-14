import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      'apps/desktop/out/**',
      'apps/desktop/app/**',
      'playwright-report/**',
      'test-results/**',
      'carro-celeste/web/app.bundle.js',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  {
    files: ['apps/desktop/**/*.cjs', 'apps/desktop/**/*.js'],
    languageOptions: {
      globals: { require: 'readonly', module: 'writable', __dirname: 'readonly', process: 'readonly' },
    },
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  {
    // Model generator and dev scripts: Node.
    files: ['carro-celeste/src/**/*.mjs', 'carro-celeste/scripts/**/*.mjs'],
    languageOptions: { globals: { console: 'readonly', URL: 'readonly' } },
  },
  {
    files: ['carro-celeste/scripts/**/*.cjs'],
    languageOptions: {
      globals: {
        require: 'readonly',
        __dirname: 'readonly',
        process: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        window: 'readonly',
      },
    },
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  {
    // Web viewer: browser.
    files: ['carro-celeste/web/src/**/*.js'],
    languageOptions: {
      globals: {
        window: 'readonly',
        document: 'readonly',
        location: 'readonly',
        history: 'readonly',
        performance: 'readonly',
        devicePixelRatio: 'readonly',
        matchMedia: 'readonly',
        requestAnimationFrame: 'readonly',
        setTimeout: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        ResizeObserver: 'readonly',
        TextEncoder: 'readonly',
        Blob: 'readonly',
        Response: 'readonly',
        DecompressionStream: 'readonly',
        atob: 'readonly',
      },
    },
  },
);
