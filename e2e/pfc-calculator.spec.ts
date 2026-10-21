import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test('PFC計算: 初期値で P/F/C が表示される', async ({ page }) => {
  await page.goto('/tools/pfc-calculator/');

  await expect(page.locator('#pfc-results')).not.toHaveClass(/hidden/);
  await expect(page.locator('#pfc-protein')).toContainText('g');
  await expect(page.locator('#pfc-fat')).toContainText('g');
  await expect(page.locator('#pfc-carb')).toContainText('g');
});

test('PFC計算: カロリー直接入力で比率どおりのグラム数になる', async ({
  page,
}) => {
  await page.goto('/tools/pfc-calculator/');

  await page.locator('input[name="pfc-source"][value="direct"]').click();
  await page.locator('#pfc-kcal-input').fill('2000');
  await page.locator('#pfc-preset-select').selectOption('balanced');

  await expect(page.locator('#pfc-intake')).toContainText('2,000');
  await expect(page.locator('#pfc-protein')).toContainText('75');
  await expect(page.locator('#pfc-carb')).toContainText('300');
});

test('PFC計算: 自分で指定の合計が100%でないとエラー', async ({ page }) => {
  await page.goto('/tools/pfc-calculator/');

  await page.locator('input[name="pfc-source"][value="direct"]').click();
  await page.locator('#pfc-kcal-input').fill('2000');
  await page.locator('#pfc-preset-select').selectOption('custom');
  await page.locator('#pfc-custom-p').fill('50');
  await page.locator('#pfc-custom-f').fill('30');
  await page.locator('#pfc-custom-c').fill('30');

  await expect(page.locator('#pfc-error')).toContainText(/100/);
  await expect(page.locator('#pfc-results')).toHaveClass(/hidden/);
});

test('PFC計算: 目標カロリーが基礎代謝を下回ると警告が出る', async ({
  page,
}) => {
  await page.goto('/tools/pfc-calculator/');

  await page.locator('#pfc-activity-select').selectOption('sedentary');
  await page.locator('#pfc-goal-select').selectOption('loss');
  await page.locator('#pfc-age-input').fill('30');
  await page.locator('#pfc-height-cm-input').fill('170');
  await page.locator('#pfc-weight-kg-input').fill('65');

  // 1.2 * 0.8 = 0.96 倍で基礎代謝を下回る
  await expect(page.locator('#pfc-warning')).toBeVisible();
});

test('PFC計算: 体重あたりタンパク質量が表示される', async ({ page }) => {
  await page.goto('/tools/pfc-calculator/');

  await page.locator('#pfc-weight-kg-input').fill('65');
  await expect(page.locator('#pfc-per-kg')).toContainText('g/kg');
});

test('PFC計算: 英語版が表示される', async ({ page }) => {
  await page.goto('/en/tools/pfc-calculator/');

  await expect(page.locator('main h1')).toContainText('Macro');
  await expect(page.locator('#pfc-results')).not.toHaveClass(/hidden/);
});

test('PFC計算: 初期表示でaxeの違反がない', async ({ page }) => {
  for (const path of ['/tools/pfc-calculator/', '/en/tools/pfc-calculator/']) {
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
