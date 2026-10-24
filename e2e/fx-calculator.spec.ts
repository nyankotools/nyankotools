import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test.describe('FX計算機', () => {
  test('日本語版: 初期値（USD/JPY 1ロット 150→150.5）の損益と証拠金', async ({
    page,
  }) => {
    await page.goto('/tools/fx-calculator/');

    await expect(page.locator('#fx-pips')).toHaveText('+50 pips');
    await expect(page.locator('#fx-profit-jpy')).toHaveText('+50,000 円');
    await expect(page.locator('#fx-margin')).toHaveText('600,000 円');
    await expect(page.locator('#fx-quote-rate-group')).toBeHidden();
  });

  test('売りで逆行すると損失になる', async ({ page }) => {
    await page.goto('/tools/fx-calculator/');

    await page.locator('#fx-direction').selectOption('sell');
    await expect(page.locator('#fx-pips')).toHaveText('-50 pips');
    await expect(page.locator('#fx-profit-jpy')).toHaveText('-50,000 円');
  });

  test('円ペア以外ではクォート通貨の円レートで換算される', async ({ page }) => {
    await page.goto('/tools/fx-calculator/');

    await page.locator('#fx-pair').selectOption('EUR/USD');
    await page.locator('#fx-lot-size').selectOption('10000');
    await page.locator('#fx-entry').fill('1.1');
    await page.locator('#fx-exit').fill('1.105');
    await page.locator('#fx-quote-rate').fill('150');
    await expect(page.locator('#fx-quote-rate-group')).toBeVisible();
    await expect(page.locator('#fx-pips')).toHaveText('+50 pips');
    await expect(page.locator('#fx-profit-jpy')).toHaveText('+7,500 円');
    await expect(page.locator('#fx-margin')).toHaveText('66,000 円');
  });

  test('不正な入力でエラー表示、空欄では結果を隠す', async ({ page }) => {
    await page.goto('/tools/fx-calculator/');

    await page.locator('#fx-leverage').fill('0');
    await expect(page.locator('#fx-error')).not.toBeEmpty();
    await expect(page.locator('#fx-results')).toBeHidden();

    await page.locator('#fx-leverage').fill('');
    await expect(page.locator('#fx-error')).toBeEmpty();
  });

  test('英語版が表示され計算される', async ({ page }) => {
    await page.goto('/en/tools/fx-calculator/');

    await expect(page.locator('#fx-profit-jpy')).toHaveText('+50,000 JPY');
  });

  test('初期表示でaxeの違反がない（ja/en）', async ({ page }) => {
    for (const path of ['/tools/fx-calculator/', '/en/tools/fx-calculator/']) {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(
        results.violations.map((v) => v.id),
        path,
      ).toEqual([]);
    }
  });
});
