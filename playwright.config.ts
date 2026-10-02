import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // ローカルは出力が短いレポーター（失敗時のみ詳細）。TTYなら1行で上書きされる line、
  // 非TTY（エージェント実行・リダイレクト）では line が1テスト1行を出力して肥大するため dot にする
  // （共通E2E310件で line 約61KB / dot 約0.7KB）。
  // CIはログ確認用の list に加え、失敗時にartifactとして取得できるHTMLレポートも残す
  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never' }]]
    : process.stdout.isTTY
      ? 'line'
      : 'dot',
  // デフォルト5000msだと、favicon-generator等のCanvas処理が重いツールで
  // CI実行時の並列負荷下ではギリギリ足りず稀に失敗することを実測で確認したため延長する。
  expect: { timeout: 10000 },
  use: {
    baseURL: 'http://localhost:4322',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    // 静的サイトなので本番と同じビルド済み成果物を配信する（`astro dev`のオンデマンド
    // コンパイルはルートごとに初回アクセス時の変換待ちが発生し、E2Eが遅くなるため使わない）。
    // 開発サーバー(4321)とはポートを分ける。astro devはCSPを送出しないため、4321を再利用すると
    // CSP違反（wasm/fetchのブロック等）を見逃す（pdf-password-protectorで実際に発生）。
    // `pnpm qa` は直前にビルド済みなので E2E_SKIP_BUILD=1 でビルドを省略する（ビルド二重実行の回避）。
    command: `${process.env.E2E_SKIP_BUILD ? '' : 'pnpm build && '}pnpm preview --port 4322 --ignore-lock`,
    url: 'http://localhost:4322',
    reuseExistingServer: !process.env.CI,
  },
});
