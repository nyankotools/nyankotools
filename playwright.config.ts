import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // ローカルは出力が短い line（成功時は1行進捗、失敗時のみ詳細）。
  // CIはログ確認用の list に加え、失敗時にartifactとして取得できるHTMLレポートも残す
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'line',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
  },
});
