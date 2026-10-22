import { test, expect } from './helpers/test';

test.describe('空白・不可視文字の可視化', () => {
  test('日本語版: 記号に置き換えて件数を集計する', async ({ page }) => {
    await page.goto('/tools/whitespace-visualizer/');
    await expect(page.locator('#wv-summary')).toHaveText(
      '表示対象の文字は見つかりませんでした',
    );

    await page.locator('#wv-input').fill('a b\tc　d e​f \ng');
    await expect(page.locator('#wv-output')).toHaveText(
      'a·b→c□d°e⟦200B⟧f·↵\ng',
    );
    await expect(page.locator('#wv-summary')).toHaveText(
      '空白・不可視文字を7個検出しました',
    );
    await expect(page.locator('[data-count="tab"]')).toHaveText('1');
    await expect(page.locator('[data-count="wideSpace"]')).toHaveText('1');
    await expect(page.locator('#wv-trailing')).toContainText('1');
    await expect(page.locator('#wv-findings-body tr')).toHaveCount(6);
  });

  test('半角スペース表示を切り替えられる', async ({ page }) => {
    await page.goto('/tools/whitespace-visualizer/');
    await page.locator('#wv-input').fill('a b');
    await expect(page.locator('#wv-output')).toHaveText('a·b');
    await page.locator('#wv-show-spaces').uncheck();
    await expect(page.locator('#wv-output')).toHaveText('a b');
  });

  test('英語版も動作する', async ({ page }) => {
    await page.goto('/en/tools/whitespace-visualizer/');
    await expect(page.locator('main h1')).toContainText('Whitespace');
    // textarea は CR を LF に正規化するため、CR を含む入力は作れない（CRLF 表示はユニットテストで検証）
    await page.locator('#wv-input').fill('a\tb　c');
    await expect(page.locator('#wv-output')).toHaveText('a→b□c');
    await expect(page.locator('#wv-summary')).toHaveText(
      'Found 2 whitespace or invisible characters',
    );
  });
});
