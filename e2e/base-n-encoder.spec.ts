import { test, expect } from './helpers/test';

test.describe('Base-N エンコーダ（日本語版）', () => {
  test('形式を選んでエンコードできる', async ({ page }) => {
    await page.goto('/tools/base-n-encoder/');

    await page.locator('#bne-input').fill('foo');
    await page.locator('#bne-format').selectOption('base32');
    await expect(page.locator('#bne-output')).toHaveValue('MZXW6===');

    await page.locator('#bne-padding').uncheck();
    await expect(page.locator('#bne-output')).toHaveValue('MZXW6');

    await page.locator('#bne-format').selectOption('base16');
    await expect(page.locator('#bne-output')).toHaveValue('666f6f');
  });

  test('デコードできる', async ({ page }) => {
    await page.goto('/tools/base-n-encoder/');

    await page.locator('#bne-mode [data-mode="decode"]').click();
    await page.locator('#bne-format').selectOption('base58');
    await page.locator('#bne-input').fill('2NEpo7TZRRrLZSi2U');
    await expect(page.locator('#bne-output')).toHaveValue('Hello World!');
  });

  test('不正な文字の位置つきエラーが表示される', async ({ page }) => {
    await page.goto('/tools/base-n-encoder/');

    await page.locator('#bne-mode [data-mode="decode"]').click();
    await page.locator('#bne-format').selectOption('base58');
    await page.locator('#bne-input').fill('ab0');
    await expect(page.locator('#bne-error')).toBeVisible();
    await expect(page.locator('#bne-error')).toContainText('3文字目の「0」');
    await expect(page.locator('#bne-output')).toHaveValue('');
  });

  test('コピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/base-n-encoder/');

    await page.locator('#bne-input').fill('foo');
    await page.locator('#bne-copy-button').click();
    await expect(page.locator('#bne-status')).toHaveText('コピーしました');
  });
});

test.describe('Base-N Encoder (English)', () => {
  test('英語版でエンコードとエラー表示ができる', async ({ page }) => {
    await page.goto('/en/tools/base-n-encoder/');

    await page.locator('#bne-input').fill('foo');
    await page.locator('#bne-format').selectOption('base85');
    await expect(page.locator('#bne-output')).toHaveValue('AoDS');

    await page.locator('#bne-mode [data-mode="decode"]').click();
    await page.locator('#bne-format').selectOption('base62');
    await page.locator('#bne-input').fill('a+');
    await expect(page.locator('#bne-error')).toContainText('Character 2 ("+")');
  });
});
