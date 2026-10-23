import { test, expect } from './helpers/test';

test.describe('CSS単位換算ツール', () => {
  test('初期値16pxが各単位に換算される', async ({ page }) => {
    await page.goto('/tools/css-unit-converter/');
    const results = page.locator('#cuc-results');
    await expect(results).toContainText('1rem');
    await expect(results).toContainText('12pt');
    await expect(results).toContainText('0.83333vw');
  });

  test('単位と基準値を変えると再計算される', async ({ page }) => {
    await page.goto('/tools/css-unit-converter/');
    await page.locator('#cuc-unit').selectOption('vw');
    await page.locator('#cuc-value').fill('10');
    await expect(page.locator('#cuc-results')).toContainText('192px');
    await page.locator('#cuc-vw').fill('1000');
    await expect(page.locator('#cuc-results')).toContainText('100px');
  });

  test('不正な値・基準値でエラーが表示される', async ({ page }) => {
    await page.goto('/tools/css-unit-converter/');
    await page.locator('#cuc-value').fill('abc');
    await expect(page.locator('#cuc-error')).toHaveText(
      '値が数値として無効です',
    );
    await page.locator('#cuc-root').fill('0');
    await expect(page.locator('#cuc-error')).toHaveText(
      '基準値は0より大きい数値で指定してください',
    );
  });

  test('コピーボタンでステータスが表示される', async ({ page }) => {
    await page
      .context()
      .grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/css-unit-converter/');
    await page.locator('#cuc-results button').first().click();
    await expect(page.locator('#cuc-status')).toHaveText('コピーしました');
  });

  test('英語版でも換算できる', async ({ page }) => {
    await page.goto('/en/tools/css-unit-converter/');
    await page.locator('#cuc-value').fill('abc');
    await expect(page.locator('#cuc-error')).toHaveText(
      'The value is not a valid number',
    );
    await page.locator('#cuc-value').fill('24');
    await expect(page.locator('#cuc-results')).toContainText('1.5rem');
  });
});
