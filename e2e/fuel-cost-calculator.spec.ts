import { test, expect } from './helpers/test';

test.describe('燃費・ガソリン代計算機（日本語版）', () => {
  test('初期値で燃料代が計算される', async ({ page }) => {
    await page.goto('/tools/fuel-cost-calculator/');

    // 300km / 15km/L = 20L × 175円 = 3,500円
    await expect(page.locator('#fuel-result-liters')).toHaveText('20 L');
    await expect(page.locator('#fuel-result-fuel')).toHaveText('￥3,500');
    await expect(page.locator('#fuel-result-per-person-ceil')).toHaveText(
      '￥3,500',
    );
  });

  test('追加費用と人数で割り勘額が計算される', async ({ page }) => {
    await page.goto('/tools/fuel-cost-calculator/');

    await page.locator('#fuel-extra').fill('2000');
    await page.locator('#fuel-people').fill('3');

    await expect(page.locator('#fuel-result-total')).toHaveText('￥5,500');
    await expect(page.locator('#fuel-result-per-person-ceil')).toHaveText(
      '￥1,834',
    );
  });

  test('L/100kmに切り替えて計算できる', async ({ page }) => {
    await page.goto('/tools/fuel-cost-calculator/');

    await page.getByRole('radio', { name: 'L/100km' }).check();
    await page.locator('#fuel-economy').fill('20');

    // 20L/100km = 5km/L → 60L × 175円 = 10,500円
    await expect(page.locator('#fuel-result-liters')).toHaveText('60 L');
    await expect(page.locator('#fuel-result-fuel')).toHaveText('￥10,500');
  });

  test('燃費が0だとエラーが表示され、結果は非表示になる', async ({ page }) => {
    await page.goto('/tools/fuel-cost-calculator/');

    await page.locator('#fuel-economy').fill('0');

    await expect(page.locator('#fuel-error')).not.toHaveText('');
    await expect(page.locator('#fuel-results')).toBeHidden();
  });
});

test.describe('Fuel Cost Calculator (English)', () => {
  test('英語版が表示され、計算できる', async ({ page }) => {
    await page.goto('/en/tools/fuel-cost-calculator/');

    await expect(page.locator('#fuel-result-fuel')).toHaveText('¥3,500');
    await page.locator('#fuel-distance').fill('0');
    await expect(page.locator('#fuel-error')).toContainText(
      'Could not calculate',
    );
  });
});
