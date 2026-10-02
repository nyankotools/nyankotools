import { test, expect } from './helpers/test';

test.describe('漢数字⇔算用数字変換ツール', () => {
  test('漢数字→算用数字（金額・位取り記法）', async ({ page }) => {
    await page.goto('/tools/kanji-number-converter/');
    await page
      .locator('#kanji-number-input')
      .fill('金壱萬弐千参百円、二〇二四年、三千五百円');
    await expect(page.locator('#kanji-number-output')).toHaveValue(
      '金12300円、2024年、3500円',
    );
    await expect(page.locator('#kanji-number-summary')).toContainText('3');
  });

  test('3桁区切りにできる', async ({ page }) => {
    await page.goto('/tools/kanji-number-converter/');
    await page.locator('#kanji-number-comma').check();
    await page.locator('#kanji-number-input').fill('千二百三十四万');
    await expect(page.locator('#kanji-number-output')).toHaveValue(
      '12,340,000',
    );
  });

  test('算用数字→漢数字（大字）に切り替えられる', async ({ page }) => {
    await page.goto('/tools/kanji-number-converter/');
    await page.locator('#kanji-number-mode [data-mode="toKanji"]').click();
    await expect(page.locator('#kanji-number-style-wrap')).toBeVisible();
    await page.locator('#kanji-number-style').selectOption('daiji');
    await page.locator('#kanji-number-input').fill('金12,300円');
    await expect(page.locator('#kanji-number-output')).toHaveValue(
      '金壱萬弐千参百円',
    );
  });

  test('英語版が表示され変換できる', async ({ page }) => {
    await page.goto('/en/tools/kanji-number-converter/');
    await expect(page.locator('main h1')).toContainText('Kanji Numeral');
    await page.locator('#kanji-number-input').fill('三百');
    await expect(page.locator('#kanji-number-output')).toHaveValue('300');
  });
});
