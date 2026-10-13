import { test, expect } from './helpers/test';

test.describe('ローマ数字変換ツール', () => {
  test('算用数字→ローマ数字と内訳が表示される', async ({ page }) => {
    await page.goto('/tools/roman-numeral-converter/');
    await page.locator('#roman-input').fill('1994');
    await expect(page.locator('#roman-output')).toHaveValue('MCMXCIV');
    await expect(page.locator('#roman-breakdown-text')).toContainText('CM=900');
  });

  test('Unicode・小文字オプションが効く', async ({ page }) => {
    await page.goto('/tools/roman-numeral-converter/');
    await page.locator('#roman-input').fill('12');
    await page.locator('#roman-unicode').check();
    await expect(page.locator('#roman-output')).toHaveValue('Ⅻ');
    await page.locator('#roman-lowercase').check();
    await expect(page.locator('#roman-output')).toHaveValue('ⅻ');
  });

  test('範囲外はエラーを表示する', async ({ page }) => {
    await page.goto('/tools/roman-numeral-converter/');
    await page.locator('#roman-input').fill('4000');
    await expect(page.locator('#roman-error')).toBeVisible();
    await expect(page.locator('#roman-output')).toHaveValue('');
  });

  test('ローマ数字→算用数字、IIII は正規形を示す', async ({ page }) => {
    await page.goto('/tools/roman-numeral-converter/');
    await page.locator('#roman-mode [data-mode="toArabic"]').click();
    await page.locator('#roman-input').fill('xiv');
    await expect(page.locator('#roman-output')).toHaveValue('14');
    await page.locator('#roman-input').fill('IIII');
    await expect(page.locator('#roman-output')).toHaveValue('4');
    await expect(page.locator('#roman-notice')).toContainText('IV');
    await page.locator('#roman-input').fill('VX');
    await expect(page.locator('#roman-error')).toBeVisible();
  });

  test('英語版が表示され変換できる', async ({ page }) => {
    await page.goto('/en/tools/roman-numeral-converter/');
    await expect(page.locator('main h1')).toContainText('Roman Numeral');
    await page.locator('#roman-input').fill('2024');
    await expect(page.locator('#roman-output')).toHaveValue('MMXXIV');
  });
});

test.describe('ローマ数字変換ツール（追加）', () => {
  test('境界値 3999 と 0 は範囲内・範囲外で正しく扱われる', async ({
    page,
  }) => {
    await page.goto('/tools/roman-numeral-converter/');
    await page.locator('#roman-input').fill('3999');
    await expect(page.locator('#roman-output')).toHaveValue('MMMCMXCIX');
    await page.locator('#roman-input').fill('0');
    await expect(page.locator('#roman-error')).toBeVisible();
    await expect(page.locator('#roman-output')).toHaveValue('');
  });

  test('入力は再読み込みで復元される', async ({ page }) => {
    await page.goto('/tools/roman-numeral-converter/');
    await page.locator('#roman-input').fill('1994');
    await expect
      .poll(() =>
        page.evaluate(() =>
          sessionStorage.getItem('nyanko:input:roman-numeral-converter'),
        ),
      )
      .toContain('1994');
    await page.reload();
    await expect(page.locator('#roman-output')).toHaveValue('MCMXCIV');
  });
});
