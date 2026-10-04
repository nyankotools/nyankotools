import { test, expect } from './helpers/test';

const HEADERS = [
  'HTTP/2 200',
  'server: nginx/1.24.0',
  'x-content-type-options: nosniff',
  'set-cookie: sid=SECRETVALUE; Path=/',
].join('\n');

test('HTTPヘッダー解析: 日本語版で診断結果と推奨設定が表示される', async ({
  page,
}) => {
  await page.goto('/tools/http-header-analyzer/');

  await page.locator('#hha-input').fill(HEADERS);
  await page.locator('#hha-analyze-button').click();

  await expect(page.locator('#hha-results')).toBeVisible();
  await expect(page.locator('#hha-summary')).toContainText('良好');
  await expect(page.locator('#hha-findings')).toContainText(
    'Strict-Transport-Security',
  );
  await expect(page.locator('#hha-findings')).toContainText('バージョン番号');
  await expect(page.locator('#hha-recommend')).toHaveValue(
    /Strict-Transport-Security: max-age=31536000/,
  );
});

test('HTTPヘッダー解析: Cookieの値は画面に表示されない', async ({ page }) => {
  await page.goto('/tools/http-header-analyzer/');

  await page.locator('#hha-input').fill(HEADERS);
  await page.locator('#hha-analyze-button').click();

  await expect(page.locator('#hha-results')).toBeVisible();
  await expect(page.locator('#hha-results')).not.toContainText('SECRETVALUE');
});

test('HTTPヘッダー解析: 出力形式を切り替えられる', async ({ page }) => {
  await page.goto('/tools/http-header-analyzer/');

  await page.locator('#hha-sample-button').click();
  await page.locator('#hha-format [data-format="nginx"]').click();

  await expect(page.locator('#hha-recommend')).toHaveValue(
    /add_header .* always;/,
  );

  await page.locator('#hha-format [data-format="apache"]').click();
  await expect(page.locator('#hha-recommend')).toHaveValue(
    /Header always set /,
  );
});

test('HTTPヘッダー解析: 空入力でエラーが表示される', async ({ page }) => {
  await page.goto('/tools/http-header-analyzer/');

  await page.locator('#hha-analyze-button').click();

  await expect(page.locator('#hha-error')).not.toHaveText('');
  await expect(page.locator('#hha-results')).toBeHidden();
});

test('HTTPヘッダー解析: コピーボタンが機能する', async ({ page }) => {
  await page.goto('/tools/http-header-analyzer/');

  await page.locator('#hha-sample-button').click();
  await page.locator('#hha-copy-button').click();

  await expect(page.locator('#hha-copy-status')).not.toHaveText('');
});

test('HTTPヘッダー解析: 英語版で診断できる', async ({ page }) => {
  await page.goto('/en/tools/http-header-analyzer/');

  await page.locator('#hha-sample-button').click();

  await expect(page.locator('#hha-summary')).toContainText('good');
  await expect(page.locator('#hha-findings')).toContainText('unsafe-inline');
});

test('HTTPヘッダー解析: RFC 822折り返し行に対応する', async ({ page }) => {
  await page.goto('/tools/http-header-analyzer/');

  const headersWithContinuation = [
    'HTTP/2 200',
    'Content-Security-Policy: script-src',
    "  'self'",
    "  'unsafe-inline'",
  ].join('\n');

  await page.locator('#hha-input').fill(headersWithContinuation);
  await page.locator('#hha-analyze-button').click();

  await expect(page.locator('#hha-findings')).toBeVisible();
  await expect(page.locator('#hha-findings')).toContainText('unsafe-inline');
});

test('HTTPヘッダー解析: 複数の大量ヘッダーを処理できる', async ({ page }) => {
  await page.goto('/tools/http-header-analyzer/');

  // 複数の大量カスタムヘッダーを生成
  const headers: string[] = ['HTTP/2 200'];
  for (let i = 0; i < 50; i++) {
    headers.push(`X-Custom-${i}: value-${i}`);
  }
  headers.push('X-Content-Type-Options: nosniff');

  const input = headers.join('\n');
  await page.locator('#hha-input').fill(input);
  await page.locator('#hha-analyze-button').click();

  await expect(page.locator('#hha-results')).toBeVisible();
  await expect(page.locator('#hha-summary')).toBeVisible();
});
