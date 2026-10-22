import { test, expect } from './helpers/test';

test.describe('緯度経度 度分秒変換・2点間距離計算', () => {
  test('10進度を度分秒に変換する', async ({ page }) => {
    await page.goto('/tools/coordinate-converter/');
    await page.locator('#coord-a-lat').fill('35.6586');
    await page.locator('#coord-a-lon').fill('139.7454');
    const out = page.locator('#coord-converted');
    await expect(out).toContainText('35°39′30.96″ N');
    await expect(out).toContainText('139°44′43.44″ E');
  });

  test('度分秒の入力を10進度に変換する', async ({ page }) => {
    await page.goto('/tools/coordinate-converter/');
    await page.locator('#coord-a-lat').fill(`35°39'31" N`);
    await page.locator('#coord-a-lon').fill('139 44 43 E');
    await expect(page.locator('#coord-converted')).toContainText('35.658611');
  });

  test('サンプルで距離と方位を表示する', async ({ page }) => {
    await page.goto('/tools/coordinate-converter/');
    await page.locator('#coord-sample-button').click();
    const out = page.locator('#coord-distance');
    await expect(out).toContainText('403.');
    await expect(out).toContainText('A→Bの初期方位角');
  });

  test('範囲外はエラー表示', async ({ page }) => {
    await page.goto('/tools/coordinate-converter/');
    await page.locator('#coord-a-lat').fill('95');
    await expect(page.locator('#coord-a-lat-error')).toContainText('範囲外');
  });

  test('片方の地点だけでは距離を出さない', async ({ page }) => {
    await page.goto('/tools/coordinate-converter/');
    await page.locator('#coord-a-lat').fill('10');
    await page.locator('#coord-a-lon').fill('10');
    await expect(page.locator('#coord-distance-message')).toContainText('両方');
  });

  test('入力はURLクエリで初期化されず、再読み込みで残らない', async ({
    page,
  }) => {
    await page.goto('/tools/coordinate-converter/?text=35.6');
    await expect(page.locator('#coord-a-lat')).toHaveValue('');
    await page.locator('#coord-a-lat').fill('35.6');
    await page.reload();
    await expect(page.locator('#coord-a-lat')).toHaveValue('');
  });

  test('英語版が表示される', async ({ page }) => {
    await page.goto('/en/tools/coordinate-converter/');
    await expect(page.locator('main h1')).toContainText('DMS');
    await page.locator('#coord-sample-button').click();
    await expect(page.locator('#coord-distance')).toContainText(
      'Initial bearing',
    );
  });
});
