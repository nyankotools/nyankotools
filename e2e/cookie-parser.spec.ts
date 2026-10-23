import { test, expect } from './helpers/test';

const SET_COOKIE =
  'Set-Cookie: sid=SECRETVALUE123; Domain=example.com; Path=/; Max-Age=3600; HttpOnly; SameSite=None';

test('Cookie解析: Set-Cookieの属性が分解され、値はマスクされる', async ({
  page,
}) => {
  await page.goto('/tools/cookie-parser/');

  await page.locator('#cp-input').fill(SET_COOKIE);

  await expect(page.locator('#cp-results')).toBeVisible();
  await expect(page.locator('#cp-list')).toContainText('example.com');
  await expect(page.locator('#cp-list')).toContainText('3600');
  await expect(page.locator('#cp-list')).toContainText('SameSite=None');
  await expect(page.locator('#cp-list')).not.toContainText('SECRETVALUE123');
  // SameSite=None に Secure が無い指摘
  await expect(page.locator('#cp-list')).toContainText(
    'SameSite=None にはSecure属性が必要です',
  );
});

test('Cookie解析: 値の表示チェックで全文が表示される', async ({ page }) => {
  await page.goto('/tools/cookie-parser/');

  await page.locator('#cp-input').fill(SET_COOKIE);
  await page.locator('#cp-reveal').check();

  await expect(page.locator('#cp-list')).toContainText('SECRETVALUE123');
});

test('Cookie解析: Cookieヘッダーを複数ペアに分解する', async ({ page }) => {
  await page.goto('/tools/cookie-parser/');

  await page.locator('#cp-input').fill('Cookie: a=1; b=2; c=3');

  await expect(page.locator('#cp-summary')).toContainText('3');
  await expect(page.locator('#cp-list section')).toHaveCount(3);
});

test('Cookie解析: サンプル入力とクリアが動作する', async ({ page }) => {
  await page.goto('/tools/cookie-parser/');

  await page.locator('#cp-sample-button').click();
  await expect(page.locator('#cp-list section')).toHaveCount(3);

  await page.locator('#cp-clear-button').click();
  await expect(page.locator('#cp-results')).toBeHidden();
  await expect(page.locator('#cp-input')).toHaveValue('');
});

test('Cookie解析: JSONコピーが機能する', async ({ page }) => {
  await page.goto('/tools/cookie-parser/');

  await page.locator('#cp-sample-button').click();
  await page.locator('#cp-copy-button').click();

  await expect(page.locator('#cp-copy-status')).not.toHaveText('');
});

test('Cookie解析: 英語版で解析できる', async ({ page }) => {
  await page.goto('/en/tools/cookie-parser/');

  await page.locator('#cp-input').fill(SET_COOKIE);

  await expect(page.locator('#cp-summary')).toContainText('Parsed 1 cookie');
  await expect(page.locator('#cp-list')).toContainText('Persistent cookie');
});
