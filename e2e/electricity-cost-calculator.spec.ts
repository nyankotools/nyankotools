import { test, expect } from './helpers/test';

test('電気代計算: 日本語版で結果が表示される', async ({ page }) => {
  await page.goto('/tools/electricity-cost-calculator/');

  await page.locator('#electricity-watts-input').fill('1000');
  await page.locator('#electricity-hours-input').fill('2');
  await page.locator('#electricity-days-input').fill('30');
  await page.locator('#electricity-price-input').fill('30');

  await expect(page.locator('#electricity-hour-cost')).toContainText('30');
  await expect(page.locator('#electricity-month-kwh')).toHaveText('60');
  await expect(page.locator('#electricity-month-cost')).toContainText('1,800');
  await expect(page.locator('#electricity-year-cost')).toContainText('21,600');
});

test('電気代計算: 家電プリセットでワット数が入る', async ({ page }) => {
  await page.goto('/tools/electricity-cost-calculator/');

  await page.locator('#electricity-preset-select').selectOption('1200');

  await expect(page.locator('#electricity-watts-input')).toHaveValue('1200');
});

test('電気代計算: 不正な入力でエラーが表示される', async ({ page }) => {
  await page.goto('/tools/electricity-cost-calculator/');

  await page.locator('#electricity-hours-input').fill('30');

  await expect(page.locator('#electricity-error')).toContainText('0〜24');
  await expect(page.locator('#electricity-results')).toBeHidden();
});

test('電気代計算: 英語版で金額がドル表示される', async ({ page }) => {
  await page.goto('/en/tools/electricity-cost-calculator/');

  await page.locator('#electricity-watts-input').fill('1000');
  await page.locator('#electricity-price-input').fill('0.2');

  await expect(page.locator('#electricity-hour-cost')).toHaveText('$0.20');
});

test('電気代計算: デフォルト値で結果が表示される', async ({ page }) => {
  await page.goto('/tools/electricity-cost-calculator/');

  await expect(page.locator('#electricity-results')).toBeVisible();
  await expect(page.locator('#electricity-error')).toHaveText('');
});

test('電気代計算: 極大値で正常に計算できる', async ({ page }) => {
  await page.goto('/tools/electricity-cost-calculator/');

  await page.locator('#electricity-watts-input').fill('1000000');
  await page.locator('#electricity-quantity-input').fill('1000');
  await page.locator('#electricity-hours-input').fill('24');
  await page.locator('#electricity-days-input').fill('31');
  await page.locator('#electricity-price-input').fill('100');

  await expect(page.locator('#electricity-results')).toBeVisible();
  await expect(page.locator('#electricity-error')).toHaveText('');
});

test('電気代計算: ワット数が上限を超えるとエラー', async ({ page }) => {
  await page.goto('/tools/electricity-cost-calculator/');

  await page.locator('#electricity-watts-input').fill('1000001');

  await expect(page.locator('#electricity-error')).toContainText('');
  await expect(page.locator('#electricity-results')).toBeHidden();
});

test('電気代計算: コピーボタンが機能する', async ({ page }) => {
  await page.goto('/tools/electricity-cost-calculator/');

  await page.locator('#electricity-watts-input').fill('1000');
  await page.locator('#electricity-hours-input').fill('2');
  await page.locator('#electricity-days-input').fill('30');
  await page.locator('#electricity-price-input').fill('30');

  await page.locator('#electricity-copy-button').click();

  await expect(page.locator('#electricity-copy-status')).toBeVisible();
});
