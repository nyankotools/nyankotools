import { test, expect } from './helpers/test';

test.describe('CSS詳細度計算機', () => {
  test('詳細度と勝者が表示される', async ({ page }) => {
    await page.goto('/tools/css-specificity-calculator/');
    await page.locator('#css-spec-input').fill('p\n#a .b\n.c');
    const items = page.locator('#css-spec-list li');
    await expect(items).toHaveCount(3);
    await expect(items.nth(0)).toContainText('(0, 0, 1)');
    await expect(items.nth(1)).toContainText('(1, 1, 0)');
    await expect(items.nth(1)).toContainText('勝ち');
    await expect(page.locator('#css-spec-summary')).toContainText('2行目');
  });

  test('同点は後勝ち', async ({ page }) => {
    await page.goto('/tools/css-specificity-calculator/');
    await page.locator('#css-spec-input').fill('.a\n.b');
    await expect(page.locator('#css-spec-list li').nth(1)).toContainText(
      '勝ち',
    );
    await expect(page.locator('#css-spec-summary')).toContainText(
      '後に書かれた',
    );
  });

  test('不正なセレクタはエラー表示され、他の行は計算される', async ({
    page,
  }) => {
    await page.goto('/tools/css-specificity-calculator/');
    await page.locator('#css-spec-input').fill('a[href\n.ok');
    const items = page.locator('#css-spec-list li');
    await expect(items.nth(0)).toContainText('] が閉じていません');
    await expect(items.nth(1)).toContainText('(0, 1, 0)');
  });

  test('親セレクタで&が解決される', async ({ page }) => {
    await page.goto('/tools/css-specificity-calculator/');
    await page.locator('#css-spec-parent').fill('#app');
    await page.locator('#css-spec-input').fill('& .x');
    await expect(page.locator('#css-spec-list li').first()).toContainText(
      '(1, 1, 0)',
    );
  });

  test('コピーできる', async ({ page }) => {
    await page
      .context()
      .grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/css-specificity-calculator/');
    await page.locator('#css-spec-input').fill('#a');
    await page.locator('#css-spec-copy-button').click();
    await expect(page.locator('#css-spec-status')).toHaveText('コピーしました');
  });

  test('英語版が表示される', async ({ page }) => {
    await page.goto('/en/tools/css-specificity-calculator/');
    await page.locator('#css-spec-input').fill('#a');
    await expect(page.locator('#css-spec-list li').first()).toContainText(
      'Wins',
    );
  });
});
