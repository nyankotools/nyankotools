import { test, expect } from './helpers/test';

const JEFE_SHA256 =
  '5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843';
const MESSAGE = 'what do ya want for nothing?';

test.describe('HMAC署名生成（日本語版）', () => {
  test('メッセージと鍵からHMAC-SHA256が計算され、署名の一致を確認できる', async ({
    page,
  }) => {
    await page.goto('/tools/hmac-generator/');
    await expect(page.locator('main h1')).toHaveText(
      'HMAC署名生成（SHA-256/SHA-512）',
    );

    await page.locator('#hmac-generator-message').fill(MESSAGE);
    await page.locator('#hmac-generator-key').fill('Jefe');
    await expect(page.locator('#hmac-generator-result')).toHaveValue(
      JEFE_SHA256,
    );

    await page
      .locator('#hmac-generator-expected')
      .fill(JEFE_SHA256.toUpperCase());
    await expect(page.locator('#hmac-generator-match')).toHaveText(
      '一致しました',
    );
    await page.locator('#hmac-generator-expected').fill('deadbeef');
    await expect(page.locator('#hmac-generator-match')).toHaveText(
      '一致しません',
    );
  });

  test('アルゴリズムと出力形式を切り替えられる', async ({ page }) => {
    await page.goto('/tools/hmac-generator/');
    await page.locator('#hmac-generator-message').fill(MESSAGE);
    await page.locator('#hmac-generator-key').fill('Jefe');
    await page.locator('#hmac-generator-algorithm').selectOption('SHA-1');
    await expect(page.locator('#hmac-generator-result')).toHaveValue(
      'effcdf6ae5eb2fa2d27416d5f184df9c259a7c79',
    );
    await page.locator('#hmac-generator-output-format').selectOption('base64');
    await expect(page.locator('#hmac-generator-result')).toHaveValue(
      '7/zfauXrL6LSdBbV8YTfnCWafHk=',
    );
  });

  test('不正な16進数の鍵はエラーを表示し、結果を空にする', async ({ page }) => {
    await page.goto('/tools/hmac-generator/');
    await page.locator('#hmac-generator-message').fill('a');
    await page.locator('#hmac-generator-key-format').selectOption('hex');
    await page.locator('#hmac-generator-key').fill('xyz');
    await expect(page.locator('#hmac-generator-error')).toBeVisible();
    await expect(page.locator('#hmac-generator-result')).toHaveValue('');
  });

  test('コピーボタンで署名をコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/hmac-generator/');
    await page.locator('#hmac-generator-message').fill(MESSAGE);
    await page.locator('#hmac-generator-key').fill('Jefe');
    await expect(page.locator('#hmac-generator-result')).toHaveValue(
      JEFE_SHA256,
    );
    await page.locator('#hmac-generator-copy-button').click();
    await expect(page.locator('#hmac-generator-status')).toHaveText(
      'コピーしました',
    );
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      JEFE_SHA256,
    );
  });
});

test.describe('HMAC Generator (English)', () => {
  test('英語版が表示され、署名が計算される', async ({ page }) => {
    await page.goto('/en/tools/hmac-generator/');
    await expect(page.locator('main h1')).toHaveText(
      'HMAC Generator (SHA-256/SHA-512)',
    );
    await page.locator('#hmac-generator-message').fill(MESSAGE);
    await page.locator('#hmac-generator-key').fill('Jefe');
    await expect(page.locator('#hmac-generator-result')).toHaveValue(
      JEFE_SHA256,
    );
    await expect(
      page.getByRole('heading', { level: 2, name: 'Glossary' }),
    ).toBeVisible();
  });
});
