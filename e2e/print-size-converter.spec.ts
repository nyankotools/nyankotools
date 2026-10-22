import { test, expect } from './helpers/test';

test.describe('印刷サイズ換算ツール', () => {
  test('初期値210mm・300dpiが換算される', async ({ page }) => {
    await page.goto('/tools/print-size-converter/');
    const results = page.locator('#psc-results');
    await expect(results).toContainText('2480.31px');
    await expect(results).toContainText('21cm');
    await expect(page.locator('tr[data-paper="A4"]')).toContainText(
      '2480×3508',
    );
  });

  test('DPIを変えると用紙サイズ表が再計算される', async ({ page }) => {
    await page.goto('/tools/print-size-converter/');
    await page.locator('#psc-dpi').fill('72');
    await expect(page.locator('tr[data-paper="A4"]')).toContainText('595×842');
  });

  test('単位を変えると再計算される', async ({ page }) => {
    await page.goto('/tools/print-size-converter/');
    await page.locator('#psc-unit').selectOption('pt');
    await page.locator('#psc-value').fill('72');
    await expect(page.locator('#psc-results')).toContainText('25.4mm');
  });

  test('不正な値・DPIでエラーが表示される', async ({ page }) => {
    await page.goto('/tools/print-size-converter/');
    await page.locator('#psc-value').fill('abc');
    await expect(page.locator('#psc-error')).toHaveText(
      '値が数値として無効です',
    );
    await page.locator('#psc-dpi').fill('0');
    await expect(page.locator('#psc-error')).toHaveText(
      'DPIは0より大きい数値で指定してください',
    );
  });

  test('コピーボタンでステータスが表示される', async ({ page }) => {
    await page
      .context()
      .grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/print-size-converter/');
    await page.locator('#psc-results button').first().click();
    await expect(page.locator('#psc-status')).toHaveText('コピーしました');
  });

  test('英語版でも換算できる', async ({ page }) => {
    await page.goto('/en/tools/print-size-converter/');
    await page.locator('#psc-value').fill('25.4');
    await expect(page.locator('#psc-results')).toContainText('300px');
  });
});
