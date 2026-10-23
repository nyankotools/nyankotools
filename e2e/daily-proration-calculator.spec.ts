import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

const PATH = '/tools/daily-proration-calculator/';

test('日割り計算: うるう年の2月は29日で割る', async ({ page }) => {
  await page.goto(PATH);

  await page.locator('#dp-amount').fill('100000');
  await page.locator('#dp-month').fill('2024-02');
  await page.locator('#dp-days').fill('10');
  await page.locator('#dp-rounding').selectOption('floor');

  await expect(page.locator('#dp-results')).not.toHaveClass(/hidden/);
  await expect(page.locator('#dp-amount-result')).toContainText('34,482');

  await page.locator('#dp-rounding').selectOption('ceil');
  await expect(page.locator('#dp-amount-result')).toContainText('34,483');
});

test('日割り計算: 基準を30日に切り替えると月に依存しない', async ({ page }) => {
  await page.goto(PATH);

  await page.locator('#dp-amount').fill('90000');
  await page.locator('#dp-days').fill('10');
  await page.locator('#dp-basis').selectOption('thirty');

  await expect(page.locator('#dp-amount-result')).toContainText('30,000');
  await expect(page.locator('#dp-formula-block')).not.toHaveClass(/hidden/);
  await expect(page.locator('#dp-segments-block')).toHaveClass(/hidden/);
});

test('日割り計算: 開始日・終了日が月をまたぐと月ごとの内訳が出る', async ({
  page,
}) => {
  await page.goto(PATH);

  await page.locator('#dp-amount').fill('100000');
  await page.locator('#dp-mode-range').check();
  await page.locator('#dp-start').fill('2024-01-16');
  await page.locator('#dp-end').fill('2024-02-10');

  await expect(page.locator('#dp-days-result')).toContainText('26');
  await expect(page.locator('#dp-segments li')).toHaveCount(2);
  // 16/31 + 10/29 = 0.86095... -> 86,095
  await expect(page.locator('#dp-amount-result')).toContainText('86,095');
});

test('日割り計算: 開始日が終了日より後だとエラーを表示する', async ({
  page,
}) => {
  await page.goto(PATH);

  await page.locator('#dp-mode-range').check();
  await page.locator('#dp-start').fill('2024-02-10');
  await page.locator('#dp-end').fill('2024-02-01');

  await expect(page.locator('#dp-error')).toContainText('開始日');
  await expect(page.locator('#dp-results')).toHaveClass(/hidden/);
});

test('日割り計算: 用途を変えると結果の見出しが変わる', async ({ page }) => {
  await page.goto(PATH);

  await expect(page.locator('#dp-result-label')).toHaveText('日割り家賃');
  await page.locator('#dp-preset').selectOption('salary');
  await expect(page.locator('#dp-result-label')).toHaveText('日割り給与');
});

test('日割り計算: 英語版で結果が表示される', async ({ page }) => {
  await page.goto('/en/tools/daily-proration-calculator/');

  await expect(page.locator('#dp-amount-result')).toContainText('¥');
  await expect(page.locator('#dp-result-label')).toHaveText('Prorated rent');
});

test('日割り計算: 初期表示でaxeの違反がない', async ({ page }) => {
  for (const path of [PATH, '/en/tools/daily-proration-calculator/']) {
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
