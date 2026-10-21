import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test('貯金目標計算機: 初期値（毎月の貯金額を計算）で結果が表示される', async ({
  page,
}) => {
  await page.goto('/tools/savings-goal-calculator/');

  await expect(page.locator('#savings-goal-results')).not.toHaveClass(/hidden/);
  // 300万円 ÷ 60ヶ月 = 5万円
  await expect(page.locator('#savings-goal-primary-value')).toContainText(
    '50,000',
  );
  await expect(page.locator('#savings-goal-table-body tr')).toHaveCount(5);
});

test('貯金目標計算機: 期間を計算するモードで年月が表示される', async ({
  page,
}) => {
  await page.goto('/tools/savings-goal-calculator/');

  await page.locator('input[name="savings-goal-mode"][value="period"]').check();
  await expect(page.locator('[data-field="period"]')).toHaveClass(/hidden/);
  await expect(page.locator('#savings-goal-primary-value')).toHaveText(
    '5年0ヶ月',
  );
});

test('貯金目標計算機: 利息あり・英語版でも計算できる', async ({ page }) => {
  await page.goto('/en/tools/savings-goal-calculator/');

  await page.locator('input[name="savings-goal-mode"][value="target"]').check();
  await page.locator('#savings-goal-rate').fill('12');
  await page.locator('#savings-goal-monthly').fill('10000');
  await page.locator('#savings-goal-initial').fill('0');
  await page.locator('#savings-goal-years').fill('1');
  await page.locator('#savings-goal-extra-months').fill('0');
  await expect(page.locator('#savings-goal-primary-value')).toContainText(
    '126,825',
  );
});

test('貯金目標計算機: 不正な入力ではエラーが表示される', async ({ page }) => {
  await page.goto('/tools/savings-goal-calculator/');

  await page.locator('#savings-goal-years').fill('0');
  await page.locator('#savings-goal-extra-months').fill('0');
  await expect(page.locator('#savings-goal-error')).not.toBeEmpty();
  await expect(page.locator('#savings-goal-results')).toHaveClass(/hidden/);
});

test('貯金目標計算機: 初期表示でaxeの違反がない', async ({ page }) => {
  for (const path of [
    '/tools/savings-goal-calculator/',
    '/en/tools/savings-goal-calculator/',
  ]) {
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
