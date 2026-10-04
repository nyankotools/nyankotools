import { test, expect } from './helpers/test';

test('統計計算: 日本語版で結果が表示される', async ({ page }) => {
  await page.goto('/tools/statistics-calculator/');

  await page.locator('#stats-data-input').fill('2 4 4 4 5 5 7 9');

  await expect(page.locator('#stats-count')).toHaveText('8');
  await expect(page.locator('#stats-mean')).toHaveText('5');
  await expect(page.locator('#stats-median')).toHaveText('4.5');
  await expect(page.locator('#stats-mode')).toHaveText('4');
  await expect(page.locator('#stats-pop-stddev')).toHaveText('2');
});

test('統計計算: 得点を入力すると偏差値が表示される', async ({ page }) => {
  await page.goto('/tools/statistics-calculator/');

  await page.locator('#stats-data-input').fill('2 4 4 4 5 5 7 9');
  await page.locator('#stats-score-input').fill('7');

  await expect(page.locator('#stats-deviation-text')).toContainText('60');
});

test('統計計算: 空入力でエラーが表示される', async ({ page }) => {
  await page.goto('/tools/statistics-calculator/');

  await page.locator('#stats-data-input').fill('abc');

  await expect(page.locator('#stats-error')).not.toHaveText('');
  await expect(page.locator('#stats-results')).toBeHidden();
});

test('統計計算: 数値以外は無視した旨が表示される', async ({ page }) => {
  await page.goto('/tools/statistics-calculator/');

  await page.locator('#stats-data-input').fill('1 2 x 3');

  await expect(page.locator('#stats-ignored')).toContainText('1');
  await expect(page.locator('#stats-mean')).toHaveText('2');
});

test('統計計算: 英語版で結果が表示される', async ({ page }) => {
  await page.goto('/en/tools/statistics-calculator/');

  await page.locator('#stats-data-input').fill('1\n2\n3');

  await expect(page.locator('#stats-mean')).toHaveText('2');
  await expect(page.locator('#stats-mode')).toContainText('None');
});

test('統計計算: コピーボタンが機能する', async ({ page }) => {
  await page.goto('/tools/statistics-calculator/');

  await page.locator('#stats-copy-button').click();

  await expect(page.locator('#stats-copy-status')).not.toHaveText('');
});
