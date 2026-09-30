import { test, expect } from './helpers/test';
import { tools } from '../src/data/tools';

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

test.describe('ホームページの検索（keywords・表記ゆれ）', () => {
  test('ja: keywords・全角入力で検索でき、該当なしで見つかりません表示', async ({
    page,
  }) => {
    await page.goto('/');
    const search = page.locator('#tool-search');
    const card = (slug: string) => page.locator(`[data-tool-slug="${slug}"]`);

    await search.fill('クロン');
    await expect(card('cron-parser')).toBeVisible();

    await search.fill('パスワード解除');
    await expect(card('pdf-page-editor')).toBeVisible();
    await expect(card('pdf-password-protector')).toBeHidden();

    await search.fill('ＪＳＯＮ');
    await expect(card('json-formatter')).toBeVisible();

    await search.fill('HMAC');
    await expect(page.locator('#no-results')).toBeVisible();

    await search.fill('　');
    await expect(page.locator('[data-tool-slug]:not([hidden])')).toHaveCount(
      tools.length,
    );
  });

  test('旧形式（日本語名）の sidebar-open-categories でもエラーが出ない', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/');
    await page.evaluate(() =>
      localStorage.setItem('sidebar-open-categories', '["テキスト","計算"]'),
    );
    await page.goto('/tools/uuid-generator/');
    await expect(
      page.locator('nav details[data-category="generate"]'),
    ).toHaveAttribute('open', '');
    expect(errors).toEqual([]);
  });
});
