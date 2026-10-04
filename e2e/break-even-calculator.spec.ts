import { test, expect } from './helpers/test';

test('損益分岐点: 日本語版で結果が表示される', async ({ page }) => {
  await page.goto('/tools/break-even-calculator/');

  await page.locator('#be-price-input').fill('1000');
  await page.locator('#be-variable-input').fill('400');
  await page.locator('#be-fixed-input').fill('300000');
  await page.locator('#be-target-input').fill('60000');

  await expect(page.locator('#be-contribution')).toContainText('600');
  await expect(page.locator('#be-ratio')).toHaveText('60%');
  await expect(page.locator('#be-be-units')).toContainText('500');
  await expect(page.locator('#be-be-sales')).toContainText('500,000');
  await expect(page.locator('#be-target-units')).toContainText('600');
});

test('損益分岐点: 目標利益が空なら目標行は非表示', async ({ page }) => {
  await page.goto('/tools/break-even-calculator/');

  await page.locator('#be-target-input').fill('');

  await expect(page.locator('#be-results')).toBeVisible();
  await expect(page.locator('#be-row-target-units')).toBeHidden();
});

test('損益分岐点: 予想数量で利益と安全余裕率が表示される', async ({ page }) => {
  await page.goto('/tools/break-even-calculator/');

  await page.locator('#be-price-input').fill('1000');
  await page.locator('#be-variable-input').fill('400');
  await page.locator('#be-fixed-input').fill('300000');
  await page.locator('#be-expected-input').fill('1000');

  await expect(page.locator('#be-expected-profit')).toContainText('300,000');
  await expect(page.locator('#be-safety')).toHaveText('50%');
});

test('損益分岐点: 変動費が単価以上だとエラー', async ({ page }) => {
  await page.goto('/tools/break-even-calculator/');

  await page.locator('#be-variable-input').fill('1000');

  await expect(page.locator('#be-error')).not.toHaveText('');
  await expect(page.locator('#be-results')).toBeHidden();
});

test('損益分岐点: 英語版でドル表示される', async ({ page }) => {
  await page.goto('/en/tools/break-even-calculator/');

  await expect(page.locator('#be-be-sales')).toContainText('$');
});

test('損益分岐点: コピーボタンが機能する', async ({ page }) => {
  await page.goto('/tools/break-even-calculator/');

  await page.locator('#be-copy-button').click();

  await expect(page.locator('#be-copy-status')).not.toHaveText('');
});
