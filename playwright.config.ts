import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    headless: false,
    trace: 'on-first-retry', // ✅ Enables trace on first failure
  },
});

