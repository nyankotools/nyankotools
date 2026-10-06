import { test, expect } from './helpers/test';

test.describe('CSP・SRIハッシュ生成（日本語版）', () => {
  test('テキストからSRIのintegrityとタグを生成できる', async ({ page }) => {
    await page.goto('/tools/csp-sri-generator/');
    await expect(page.locator('#csp-sri-results')).toBeHidden();

    await page.locator('#csp-sri-text').fill('abc');
    await page.locator('#csp-sri-url').fill('https://cdn.example.com/app.js');
    await expect(page.locator('#csp-sri-integrity')).toHaveValue(
      'sha384-ywB1P0WjXou1oD1pmsZQBycsMqsO3tFjGotgWkP/W+2AhgcroefMI1i67KE0yCWn',
    );
    await expect(page.locator('#csp-sri-tag')).toHaveValue(
      '<script src="https://cdn.example.com/app.js" integrity="sha384-ywB1P0WjXou1oD1pmsZQBycsMqsO3tFjGotgWkP/W+2AhgcroefMI1i67KE0yCWn" crossorigin="anonymous"></script>',
    );

    await page.locator('#csp-sri-algo-sha256').check();
    await expect(page.locator('#csp-sri-integrity')).toHaveValue(
      /^sha256-ungWv48Bz\+pBQUDeXa4iI7ADYaOWF3qctBD\/YfIAFa0= sha384-/,
    );

    await page.locator('#csp-sri-kind').selectOption('stylesheet');
    await expect(page.locator('#csp-sri-tag')).toHaveValue(
      /^<link rel="stylesheet"/,
    );
  });

  test('ファイルを選ぶとSRIを計算する', async ({ page }) => {
    await page.goto('/tools/csp-sri-generator/');
    await page.locator('#csp-sri-file-input').setInputFiles({
      name: 'a.js',
      mimeType: 'text/javascript',
      buffer: Buffer.from('abc'),
    });
    await expect(page.locator('#csp-sri-source')).toContainText('a.js');
    await expect(page.locator('#csp-sri-integrity')).toHaveValue(
      /^sha384-ywB1P0Wj/,
    );
  });

  test('プリセットからCSPを生成し、形式を切り替えられる', async ({ page }) => {
    await page.goto('/tools/csp-sri-generator/');
    await page.locator('#csp-preset').selectOption('strict');
    await expect(page.locator('#csp-output')).toHaveValue(
      /^Content-Security-Policy: default-src 'none'; script-src 'self'/,
    );

    await page.locator('#csp-format').selectOption('nginx');
    await expect(page.locator('#csp-output')).toHaveValue(
      /^add_header Content-Security-Policy "default-src 'none'.*" always;$/,
    );

    await page.locator('#csp-format').selectOption('meta');
    await page.locator('#csp-report-only').check();
    await expect(page.locator('#csp-note')).toBeVisible();
    await expect(page.locator('#csp-output')).toHaveValue(/^<meta http-equiv/);
  });

  test('弱い設定を診断し、引用符を自動で補う', async ({ page }) => {
    await page.goto('/tools/csp-sri-generator/');
    await expect(page.locator('#csp-warnings')).toBeHidden();

    await page.locator('#csp-d-script-src').fill('self unsafe-inline *');
    await expect(page.locator('#csp-output')).toHaveValue(
      "Content-Security-Policy: script-src 'self' 'unsafe-inline' *",
    );
    await expect(page.locator('#csp-warnings')).toBeVisible();
    await expect(page.locator('#csp-warning-list')).toContainText(
      "script-src の 'unsafe-inline'",
    );
  });
});

test.describe('CSP & SRI Hash Generator (English)', () => {
  test('generates an SRI hash and a CSP', async ({ page }) => {
    await page.goto('/en/tools/csp-sri-generator/');
    await page.locator('#csp-sri-text').fill('abc');
    await expect(page.locator('#csp-sri-integrity')).toHaveValue(
      /^sha384-ywB1P0Wj/,
    );
    await page.locator('#csp-d-default-src').fill("'self'");
    await page.locator('#csp-format').selectOption('apache');
    await expect(page.locator('#csp-output')).toHaveValue(
      `Header always set Content-Security-Policy "default-src 'self'"`,
    );
  });
});
