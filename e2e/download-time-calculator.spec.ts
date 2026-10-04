import { test, expect } from './helpers/test';

test('ダウンロード時間計算: 日本語版で所要時間が表示される', async ({
  page,
}) => {
  await page.goto('/tools/download-time-calculator/');

  await page.locator('#download-size-input').fill('1');
  await page.locator('#download-size-unit').selectOption('GB');
  await page.locator('#download-speed-input').fill('100');
  await page.locator('#download-speed-unit').selectOption('Mbps');
  await page.locator('#download-efficiency-input').fill('100');

  await expect(page.locator('#download-time-text')).toHaveText('1分20秒');
  await expect(page.locator('#download-effective-speed')).toContainText('12.5');
});

test('ダウンロード時間計算: 実効速度の割合で時間が延びる', async ({ page }) => {
  await page.goto('/tools/download-time-calculator/');

  await page.locator('#download-size-input').fill('1');
  await page.locator('#download-size-unit').selectOption('GB');
  await page.locator('#download-speed-input').fill('100');
  await page.locator('#download-speed-unit').selectOption('Mbps');
  await page.locator('#download-efficiency-input').fill('80');

  await expect(page.locator('#download-time-text')).toHaveText('1分40秒');
});

test('ダウンロード時間計算: 不正な入力でエラーが表示される', async ({
  page,
}) => {
  await page.goto('/tools/download-time-calculator/');

  await page.locator('#download-efficiency-input').fill('150');

  await expect(page.locator('#download-error')).toContainText('100以下');
  await expect(page.locator('#download-results')).toBeHidden();
});

test('ダウンロード時間計算: 英語版で結果が表示される', async ({ page }) => {
  await page.goto('/en/tools/download-time-calculator/');

  await page.locator('#download-size-input').fill('1');
  await page.locator('#download-size-unit').selectOption('GB');
  await page.locator('#download-speed-input').fill('1');
  await page.locator('#download-speed-unit').selectOption('Gbps');
  await page.locator('#download-efficiency-input').fill('100');

  await expect(page.locator('#download-time-text')).toHaveText('8 s');
});

test('ダウンロード時間計算: デフォルト値で結果が表示される', async ({
  page,
}) => {
  await page.goto('/tools/download-time-calculator/');

  await expect(page.locator('#download-results')).toBeVisible();
  await expect(page.locator('#download-error')).toHaveText('');
});

test('ダウンロード時間計算: 極小値で正常に計算できる', async ({ page }) => {
  await page.goto('/tools/download-time-calculator/');

  await page.locator('#download-size-input').fill('0.001');
  await page.locator('#download-size-unit').selectOption('KB');
  await page.locator('#download-speed-input').fill('1');
  await page.locator('#download-speed-unit').selectOption('Mbps');
  await page.locator('#download-efficiency-input').fill('1');

  await expect(page.locator('#download-results')).toBeVisible();
  await expect(page.locator('#download-error')).toHaveText('');
});

test('ダウンロード時間計算: 大きなファイルサイズで計算できる', async ({
  page,
}) => {
  await page.goto('/tools/download-time-calculator/');

  await page.locator('#download-size-input').fill('1000');
  await page.locator('#download-size-unit').selectOption('TB');
  await page.locator('#download-speed-input').fill('1');
  await page.locator('#download-speed-unit').selectOption('Gbps');
  await page.locator('#download-efficiency-input').fill('100');

  await expect(page.locator('#download-results')).toBeVisible();
});

test('ダウンロード時間計算: コピーボタンが機能する', async ({ page }) => {
  await page.goto('/tools/download-time-calculator/');

  await page.locator('#download-size-input').fill('1');
  await page.locator('#download-size-unit').selectOption('GB');
  await page.locator('#download-speed-input').fill('100');
  await page.locator('#download-speed-unit').selectOption('Mbps');
  await page.locator('#download-efficiency-input').fill('100');

  await page.locator('#download-copy-button').click();

  await expect(page.locator('#download-copy-status')).toBeVisible();
});
