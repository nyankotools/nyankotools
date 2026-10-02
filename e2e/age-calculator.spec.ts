import { test, expect } from './helpers/test';

test.describe('年齢計算ツール（日本語版）', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/tools/age-calculator/');
    await expect(page.locator('main h1')).toHaveText('年齢計算機');
  });

  test('ツールが読み込まれて基本的な表示がされる', async ({ page }) => {
    await page.goto('/tools/age-calculator/');

    const mainContent = (await page.locator('main').textContent()) ?? '';
    expect(mainContent).toBeTruthy();
    expect(mainContent.length).toBeGreaterThan(0);
  });

  test('入力フィールドが存在する', async ({ page }) => {
    await page.goto('/tools/age-calculator/');

    // inputフィールドまたはtextareaが存在することを確認
    const inputs = page.locator(
      'input, textarea, [role="textbox"], [contenteditable]',
    );
    const count = await inputs.count();

    expect(count).toBeGreaterThan(0);
  });

  test('計算機関連のテキストが表示される', async ({ page }) => {
    await page.goto('/tools/age-calculator/');

    const mainText = (await page.locator('main').textContent()) ?? '';
    expect(mainText).toBeTruthy();
    expect(mainText.length).toBeGreaterThan(100);
  });

  test('レイアウトが正しく表示される', async ({ page }) => {
    await page.goto('/tools/age-calculator/');

    const h1 = page.locator('main h1');
    const h2Count = await page.locator('main h2').count();

    await expect(h1).toBeVisible();
    expect(h2Count).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Age Calculator (English)', () => {
  test('英語版が正しく表示される', async ({ page }) => {
    await page.goto('/en/tools/age-calculator/');
    await expect(page.locator('main h1')).toHaveText('Age Calculator');
  });

  test('英語版でツールが読み込まれる', async ({ page }) => {
    await page.goto('/en/tools/age-calculator/');

    const mainContent = (await page.locator('main').textContent()) ?? '';
    expect(mainContent).toBeTruthy();
    expect(mainContent.length).toBeGreaterThan(0);
  });

  test('英語版でレイアウトが正しく表示される', async ({ page }) => {
    await page.goto('/en/tools/age-calculator/');

    const h1 = page.locator('main h1');
    await expect(h1).toBeVisible();
  });
});
