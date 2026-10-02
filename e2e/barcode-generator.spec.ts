import { test, expect } from './helpers/test';

test.describe('バーコード生成ツール（日本語版）', () => {
  test('入力するとバーコードが描画されダウンロードできる', async ({ page }) => {
    await page.goto('/tools/barcode-generator/');
    await expect(page.locator('main h1')).toContainText('バーコード生成');

    const canvas = page.locator('#barcode-generator-canvas');
    const download = page.locator('#barcode-generator-download-button');
    await expect(download).toBeDisabled();

    await page.locator('#barcode-generator-input').fill('Hello-123');
    await expect(download).toBeEnabled();
    const width = await canvas.evaluate(
      (el) => (el as HTMLCanvasElement).width,
    );
    expect(width).toBeGreaterThan(50);

    const downloadPromise = page.waitForEvent('download');
    await download.click();
    expect((await downloadPromise).suggestedFilename()).toBe('barcode.png');
    await expect(page.locator('#barcode-generator-status')).toHaveText(
      'ダウンロードしました',
    );
  });

  test('規格に合わない入力ではエラーが表示される', async ({ page }) => {
    await page.goto('/tools/barcode-generator/');

    await page.locator('#barcode-generator-format').selectOption('EAN13');
    await page.locator('#barcode-generator-input').fill('ABC');
    await expect(page.locator('#barcode-generator-error')).not.toBeEmpty();
    await expect(
      page.locator('#barcode-generator-download-button'),
    ).toBeDisabled();

    await page.locator('#barcode-generator-input').fill('490123456789');
    await expect(page.locator('#barcode-generator-error')).toBeEmpty();
    await expect(
      page.locator('#barcode-generator-download-button'),
    ).toBeEnabled();
  });
});

test.describe('Barcode Generator (English)', () => {
  test('英語版が表示され、バーコードを生成できる', async ({ page }) => {
    await page.goto('/en/tools/barcode-generator/');
    await expect(page.locator('main h1')).toContainText('Barcode Generator');

    await page.locator('#barcode-generator-input').fill('12345678');
    await expect(
      page.locator('#barcode-generator-download-button'),
    ).toBeEnabled();
  });
});
