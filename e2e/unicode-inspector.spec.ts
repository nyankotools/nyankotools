import { test, expect } from './helpers/test';

test.describe('Unicodeコードポイント検索ツール', () => {
  test('文字をコードポイント単位に分解して表示する', async ({ page }) => {
    await page.goto('/tools/unicode-inspector/');
    await page.locator('#uni-input').fill('あ😀');
    const rows = page.locator('#uni-tbody tr');
    await expect(rows).toHaveCount(2);
    await expect(rows.nth(0)).toContainText('U+3042');
    await expect(rows.nth(0)).toContainText('E3 81 82');
    await expect(rows.nth(1)).toContainText('U+1F600');
    await expect(rows.nth(1)).toContainText('D83D DE00');
    await expect(page.locator('[data-stat="utf8"]')).toHaveText('7');
  });

  test('コードポイントから文字を逆引きし、不正な入力を警告する', async ({
    page,
  }) => {
    await page.goto('/tools/unicode-inspector/');
    await page.locator('#uni-mode [data-mode="lookup"]').click();
    await page.locator('#uni-input').fill('U+41 0x3042 zzz');
    await expect(page.locator('#uni-tbody tr')).toHaveCount(2);
    await expect(page.locator('#uni-invalid')).toBeVisible();
    await expect(page.locator('#uni-invalid')).toContainText('zzz');
  });

  test('コードポイントをコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/unicode-inspector/');
    await page.locator('#uni-input').fill('Aあ');
    await page.locator('#uni-copy-button').click();
    await expect(page.locator('#uni-status')).toHaveText('コピーしました');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      'U+0041 U+3042',
    );
  });

  test('英語版が表示される', async ({ page }) => {
    await page.goto('/en/tools/unicode-inspector/');
    await expect(page.locator('main h1')).toContainText('Unicode');
    await page.locator('#uni-input').fill('A');
    await expect(page.locator('#uni-tbody')).toContainText(
      'LATIN CAPITAL LETTER A',
    );
  });

  test('ZWJ絵文字（家族など）をコードポイント単位に分解できる', async ({
    page,
  }) => {
    await page.goto('/tools/unicode-inspector/');
    // 👨‍👩‍👧 は5コードポイント（男 + ZWJ + 女 + ZWJ + 女の子）
    await page.locator('#uni-input').fill('👨‍👩‍👧');
    const rows = page.locator('#uni-tbody tr');
    await expect(rows).toHaveCount(5);
    // ZWJ（0x200D）の表示を確認
    await expect(rows.nth(1)).toContainText('U+200D');
    await expect(rows.nth(1)).toContainText('Cf');
    // コードポイント数は5、graphemes は1
    await expect(page.locator('[data-stat="codePoints"]')).toHaveText('5');
    await expect(page.locator('[data-stat="graphemes"]')).toHaveText('1');
  });

  test('逆引きでU+形式を複数入力できる', async ({ page }) => {
    await page.goto('/tools/unicode-inspector/');
    await page.locator('#uni-mode [data-mode="lookup"]').click();
    await page.locator('#uni-input').fill('U+1F468 U+200D U+1F469');
    const rows = page.locator('#uni-tbody tr');
    await expect(rows).toHaveCount(3);
    await expect(rows.nth(0)).toContainText('👨');
    await expect(rows.nth(1)).toContainText('U+200D');
    await expect(rows.nth(2)).toContainText('👩');
  });
});
