import { test, expect } from './helpers/test';

test.describe('上下反転・鏡文字テキスト変換ツール', () => {
  test('入力が各モードに変換され、変換できなかった文字数が出る', async ({
    page,
  }) => {
    await page.goto('/tools/upside-down-text/');
    await page.locator('#udt-input').fill('ab日');
    const row = (mode: string) =>
      page.locator(`#udt-list [data-mode="${mode}"]`);
    await expect(row('upsideDown').locator('.udt-output')).toHaveText('日qɐ');
    await expect(row('upsideDown').locator('.udt-count')).toContainText('1');
    await expect(row('reverse').locator('.udt-output')).toHaveText('日ba');
  });

  test('入力が空のときはコピーを無効にする', async ({ page }) => {
    await page.goto('/tools/upside-down-text/');
    await expect(
      page.locator('#udt-list [data-mode="upsideDown"] .udt-copy'),
    ).toBeDisabled();
  });

  test('コピーボタンで完了メッセージが出る', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/upside-down-text/');
    await page.locator('#udt-input').fill('ab');
    await page.locator('#udt-list [data-mode="upsideDown"] .udt-copy').click();
    await expect(page.locator('#udt-status')).toHaveText('コピーしました');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      'qɐ',
    );
  });

  test('英語版が表示される', async ({ page }) => {
    await page.goto('/en/tools/upside-down-text/');
    await expect(page.locator('main h1')).toContainText('Upside Down');
    await page.locator('#udt-input').fill('ab');
    await expect(
      page.locator('#udt-list [data-mode="upsideDown"] .udt-count'),
    ).toHaveText('Everything was converted');
  });
});
