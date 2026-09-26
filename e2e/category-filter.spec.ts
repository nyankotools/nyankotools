import { test, expect } from '@playwright/test';

// トップページ（/）のカテゴリフィルタが、新しい9分類で正しく表示され、
// 375px幅での横はみ出しがないことを確認する。

test.describe('ホームページのカテゴリフィルタ', () => {
  test('ja: 10個のカテゴリフィルタボタンがすべて表示される', async ({
    page,
  }) => {
    await page.goto('/');

    const expectedCategories = [
      'テキスト',
      'データ変換',
      'エンコード/デコード',
      '日付・時間',
      '計算',
      '画像・デザイン',
      'PDF',
      '開発',
      '生成',
      'カメラ',
    ];

    for (const category of expectedCategories) {
      const button = page.locator(`button:has-text("${category}")`).first();
      await expect(button).toBeVisible({ timeout: 5000 });
    }
  });

  test('en: 10個のカテゴリフィルタボタンがすべて表示される', async ({
    page,
  }) => {
    await page.goto('/en/');

    const expectedCategories = [
      'Text',
      'Data Formats',
      'Encode/Decode',
      'Date & Time',
      'Calculate',
      'Image & Design',
      'PDF',
      'Development',
      'Generate',
      'Camera',
    ];

    for (const category of expectedCategories) {
      const button = page.locator(`button:has-text("${category}")`).first();
      await expect(button).toBeVisible({ timeout: 5000 });
    }
  });

  test('ja: カテゴリフィルタが375px幅で横スクロールしない', async ({
    page,
  }) => {
    // 375px幅のビューポートでテスト
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');

    // ページ全体の水平スクロールがないことを確認
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    const clientWidth = await page.evaluate(
      () => document.documentElement.clientWidth,
    );
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('en: カテゴリフィルタが375px幅で横スクロールしない', async ({
    page,
  }) => {
    // 375px幅のビューポートでテスト
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/en/');

    // ページ全体の水平スクロールがないことを確認
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    const clientWidth = await page.evaluate(
      () => document.documentElement.clientWidth,
    );
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('ja: カテゴリボタンが存在してクリック可能', async ({ page }) => {
    await page.goto('/');

    // 「画像・デザイン」カテゴリボタンが存在することを確認
    const categoryButton = page
      .locator('button:has-text("画像・デザイン")')
      .first();
    await expect(categoryButton).toBeEnabled();

    // ボタンをクリック可能であることを確認
    await categoryButton.click({ timeout: 5000 });
  });
});
