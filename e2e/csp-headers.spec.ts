import { test, expect } from './helpers/test';
import { spawn, spawnSync, type ChildProcess } from 'node:child_process';
import { blockAnalytics } from './helpers/block-analytics';

// Content-Security-Policy は astro.config.mjs の security.csp により <meta> タグで配信される
// （public/_headers には frame-ancestors のみ）。`pnpm dev`（Astro dev server）では適用されない。
// そのため、このスペックだけは `pnpm build` 済みの dist を `wrangler dev` で実配信し、
// CSPが実際に出力されること、および connect-src（同一オリジン＋GA/Cloudflare計測のみ許可）の
// CSPによって既存機能（QRコード生成・ダウンロード、Markdownプレビュー、共有ボタンのコピー等）が
// 壊れていないことを確認する。

const PORT = 18787;
const BASE_URL = `http://127.0.0.1:${PORT}`;

let serverProcess: ChildProcess | undefined;

async function waitForServer(url: string, timeoutMs = 45000) {
  const start = Date.now();
  let lastError: unknown;
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.status < 500) return;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(
    `wrangler dev server did not become ready within ${timeoutMs}ms: ${String(lastError)}`,
  );
}

// `spawn(..., { shell: true })` の戻り値を `.kill()` しても、Windows では
// shell → pnpm → wrangler(node) → workerd(×2) という子プロセスツリーの末端までは
// 終了しない（wrangler がクラッシュとみなして workerd を自動再起動することさえある）。
// そのため Windows ではプロセスツリーごと終了する `taskkill /T /F` を使う。
function killServerTree(pid: number | undefined) {
  if (!pid) return;
  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/pid', String(pid), '/T', '/F']);
  } else {
    try {
      process.kill(-pid, 'SIGKILL');
    } catch {
      // プロセスグループが取れない場合は単体だけでも終了を試みる
      try {
        process.kill(pid, 'SIGKILL');
      } catch {
        // 既に終了している場合は何もしない
      }
    }
  }
}

test.describe('Content-Security-Policy ヘッダー（wrangler dev 実配信での確認）', () => {
  // このファイルは固定ポートで wrangler dev を1つだけ起動して使い回すため、
  // fullyParallel でテスト単位が別ワーカーに分散されてポートが競合しないよう直列実行に固定する。
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(async () => {
    serverProcess = spawn(
      'pnpm',
      ['exec', 'wrangler', 'dev', '--port', String(PORT)],
      {
        shell: true,
        stdio: 'ignore',
        detached: process.platform !== 'win32',
      },
    );
    await waitForServer(BASE_URL);
  });

  test.afterAll(() => {
    killServerTree(serverProcess?.pid);
  });

  test("HTTPレスポンスヘッダーには frame-ancestors 'none' のみが返る", async () => {
    // frame-ancestors は <meta> 経由では無視されるためHTTPヘッダーでのみ配信する。
    // 一方 script-src/style-src はページごとに実インラインコンテンツのハッシュを
    // 含める必要があるため、Astroの security.csp が生成する <meta> タグ側で配信する
    // （下記の別テストで確認）。同じCSPを両方に重複して載せると、ハッシュを持たない
    // ヘッダー側のポリシーが独立してインラインscript/styleをブロックしてしまうため。
    const response = await fetch(BASE_URL);
    const csp = response.headers.get('content-security-policy');
    expect(csp).toBe("frame-ancestors 'none'");
  });

  test('<meta> タグにハッシュ付きの script-src/style-src と default-src 等が出力される', async ({
    browser,
  }) => {
    const context = await browser.newContext({ baseURL: BASE_URL });
    await blockAnalytics(context);
    const page = await context.newPage();
    await page.goto('/tools/char-counter/');

    const metaCsp = await page
      .locator('meta[http-equiv="content-security-policy" i]')
      .getAttribute('content');

    expect(metaCsp).toBeTruthy();
    expect(metaCsp).toContain("connect-src 'self'");
    expect(metaCsp).toContain("default-src 'self'");
    expect(metaCsp).toContain("object-src 'none'");
    expect(metaCsp).toMatch(
      /script-src 'self' 'wasm-unsafe-eval'(?: https:\/\/www\.googletagmanager\.com)?(?: https:\/\/static\.cloudflareinsights\.com)?(?: 'sha256-[^']+')+/,
    );
    expect(metaCsp).toMatch(/style-src 'self'(?: 'sha256-[^']+')+/);

    await context.close();
  });

  test('qr-generator: CSP適用下でもQRコード生成・PNGダウンロードが機能する', async ({
    browser,
  }) => {
    const context = await browser.newContext({ baseURL: BASE_URL });
    await blockAnalytics(context);
    const page = await context.newPage();
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(String(err)));

    await page.goto('/tools/qr-generator/');
    await page.locator('#qr-generator-input').fill('https://example.com');
    await expect(page.locator('#qr-generator-download-button')).toBeEnabled();

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#qr-generator-download-button').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('qrcode.png');

    expect(consoleErrors).toEqual([]);
    await context.close();
  });

  test('markdown-preview: CSP適用下でもプレビュー変換が機能する', async ({
    browser,
  }) => {
    const context = await browser.newContext({ baseURL: BASE_URL });
    await blockAnalytics(context);
    const page = await context.newPage();
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(String(err)));

    await page.goto('/tools/markdown-preview/');
    await page
      .locator('#markdown-preview-input')
      .fill('# 見出し\n\n**太字**のテキストです。');
    await expect(page.locator('#markdown-preview-render')).toContainText(
      '見出し',
    );

    expect(consoleErrors).toEqual([]);
    await context.close();
  });

  test('共有ボタン: CSP適用下でもURLコピーが機能する', async ({ browser }) => {
    const context = await browser.newContext({
      baseURL: BASE_URL,
      permissions: ['clipboard-read', 'clipboard-write'],
    });
    await blockAnalytics(context);
    const page = await context.newPage();
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(String(err)));

    await page.goto('/tools/char-counter/');
    await page.locator('[data-share-copy]').click();
    await expect(page.locator('[data-share-status]')).toHaveText(
      'コピーしました',
    );

    expect(consoleErrors).toEqual([]);
    await context.close();
  });

  test('テーマの切り替え: CSP適用下でもライト/ダークを切り替えられ、選択が保存される', async ({
    browser,
  }) => {
    const context = await browser.newContext({ baseURL: BASE_URL });
    await blockAnalytics(context);
    const page = await context.newPage();
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(String(err)));

    await page.goto('/tools/char-counter/');

    const html = page.locator('html');
    const darkButton = page.locator('[data-theme-option="dark"]');
    const lightButton = page.locator('[data-theme-option="light"]');

    // 切り替えの処理（src/lib/layout-nav.ts の initTheme）は、ビルドがHTMLに埋め込む
    // インラインscriptで、<meta> のCSPがハッシュで許可している。ヘッダー側に
    // script-src 'self' が残ると、このscriptがブロックされてクリックが効かなくなる。
    await darkButton.click();
    await expect(html).toHaveClass(/\bdark\b/);
    await expect(darkButton).toHaveAttribute('aria-pressed', 'true');

    // 再読み込み後の選択の復元は、外部ファイルの public/theme-init.js（描画前）と、
    // initTheme()（読み込み時に保存値を適用）のどちらでも行われる。
    // このテストは、どちらか一方でも復元されれば通る。
    await page.reload();
    await expect(html).toHaveClass(/\bdark\b/);

    await lightButton.click();
    await expect(html).not.toHaveClass(/\bdark\b/);
    await expect(lightButton).toHaveAttribute('aria-pressed', 'true');

    expect(consoleErrors).toEqual([]);
    await context.close();
  });

  test('モバイル幅でハンバーガーメニューからサイドバーを開閉できる', async ({
    browser,
  }) => {
    const context = await browser.newContext({
      baseURL: BASE_URL,
      viewport: { width: 375, height: 700 },
    });
    await blockAnalytics(context);
    const page = await context.newPage();
    await page.goto('/tools/char-counter/');

    const toggle = page.locator('#sidebar-toggle');

    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    await context.close();
  });
});
