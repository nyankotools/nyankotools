import { test, expect } from './helpers/test';

test.describe('ローマ字⇔ひらがな変換ツール', () => {
  test('ローマ字→ひらがな・カタカナに変換する', async ({ page }) => {
    await page.goto('/tools/romaji-kana-converter/');
    await page.locator('#romaji-input').fill('konnichiwa kyouto');
    await expect(page.locator('#romaji-output')).toHaveValue(
      'こんにちわ きょうと',
    );
    await page.locator('#romaji-script [data-value="katakana"]').click();
    await expect(page.locator('#romaji-output')).toHaveValue(
      'コンニチワ キョウト',
    );
  });

  test('かな→ローマ字に切り替え、方式と長音の書き方を選べる', async ({
    page,
  }) => {
    await page.goto('/tools/romaji-kana-converter/');
    await page.locator('#romaji-mode [data-value="toRomaji"]').click();
    await expect(page.locator('#romaji-script')).toBeHidden();
    await expect(page.locator('#romaji-style')).toBeVisible();

    await page.locator('#romaji-input').fill('しんぶん ラーメン');
    await expect(page.locator('#romaji-output')).toHaveValue('shinbun rāmen');

    await page.locator('#romaji-style [data-value="kunrei"]').click();
    await expect(page.locator('#romaji-output')).toHaveValue('sinbun rāmen');

    await page.locator('#romaji-long-vowel [data-value="double"]').click();
    await expect(page.locator('#romaji-output')).toHaveValue('sinbun raamen');

    await page.locator('#romaji-case [data-value="capitalize"]').click();
    await expect(page.locator('#romaji-output')).toHaveValue('Sinbun Raamen');
  });

  test('英語版が表示される', async ({ page }) => {
    await page.goto('/en/tools/romaji-kana-converter/');
    await expect(page.locator('main h1')).toContainText('Romaji');
    await page.locator('#romaji-input').fill('sakura');
    await expect(page.locator('#romaji-output')).toHaveValue('さくら');
  });
});
