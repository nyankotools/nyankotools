import { test, expect } from './helpers/test';

test.describe('特殊文字・絵文字一覧ツール', () => {
  test('文字をクリックすると入力欄に追加され、クリアできる', async ({
    page,
  }) => {
    await page.goto('/tools/special-char-list/');
    await page.locator('.sc-char[data-char="★"]').click();
    await page.locator('.sc-char[data-char="♡"]').click();
    await expect(page.locator('#sc-basket')).toHaveValue('★♡');
    await page.locator('#sc-clear-button').click();
    await expect(page.locator('#sc-basket')).toHaveValue('');
  });

  test('キーワードでグループを絞り込み、該当なしを表示する', async ({
    page,
  }) => {
    await page.goto('/tools/special-char-list/');
    const hearts = page.locator('#sc-groups [data-group="hearts"]');
    const arrows = page.locator('#sc-groups [data-group="arrows"]');
    await page.locator('#sc-search').fill('矢印');
    await expect(arrows).toBeVisible();
    await expect(hearts).toBeHidden();
    await page.locator('#sc-search').fill('zzzzzz');
    await expect(page.locator('#sc-empty')).toBeVisible();
    await page.locator('#sc-search').fill('');
    await expect(hearts).toBeVisible();
    await expect(page.locator('#sc-empty')).toBeHidden();
  });

  test('コピーボタンでクリップボードに入る', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/special-char-list/');
    await page.locator('.sc-char[data-char="→"]').click();
    await page.locator('#sc-copy-button').click();
    await expect(page.locator('#sc-status')).toHaveText('コピーしました');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('→');
  });

  test('英語版が表示される', async ({ page }) => {
    await page.goto('/en/tools/special-char-list/');
    await expect(page.locator('main h1')).toContainText('Special Characters');
    await page.locator('#sc-search').fill('arrow');
    await expect(
      page.locator('#sc-groups [data-group="arrows"]'),
    ).toBeVisible();
  });
});
