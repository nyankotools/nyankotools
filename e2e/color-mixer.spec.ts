import { test, expect } from './helpers/test';

test.describe('色ミキサー', () => {
  test('RGB 50%混合と中間色が表示される', async ({ page }) => {
    await page.goto('/tools/color-mixer/');

    await page.locator('#color-mixer-hex-a').fill('#000000');
    await page.locator('#color-mixer-hex-b').fill('#ffffff');
    await page.locator('#color-mixer-space').selectOption('rgb');
    await page.locator('#color-mixer-steps').fill('3');

    await expect(page.locator('#color-mixer-mixed button')).toHaveText(
      '#808080',
    );
    await expect(page.locator('#color-mixer-swatches button')).toHaveCount(3);
    await expect(page.locator('#color-mixer-list')).toHaveValue(
      '#000000, #808080, #ffffff',
    );
  });

  test('割合スライダーで混色結果が変わる', async ({ page }) => {
    await page.goto('/tools/color-mixer/');

    await page.locator('#color-mixer-hex-a').fill('#000000');
    await page.locator('#color-mixer-hex-b').fill('#ffffff');
    await page.locator('#color-mixer-space').selectOption('rgb');
    await page.locator('#color-mixer-ratio').fill('100');

    await expect(page.locator('#color-mixer-mixed button')).toHaveText(
      '#ffffff',
    );
  });

  test('結果をクリックするとHEXがコピーされる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/color-mixer/');

    await page.locator('#color-mixer-hex-a').fill('#000000');
    await page.locator('#color-mixer-hex-b').fill('#ffffff');
    await page.locator('#color-mixer-space').selectOption('rgb');
    await page.locator('#color-mixer-mixed button').click();

    await expect(page.locator('#color-mixer-status')).toHaveText(
      'コピーしました',
    );
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      '#808080',
    );
  });

  test('不正なHEXでエラーが表示される', async ({ page }) => {
    await page.goto('/tools/color-mixer/');

    await page.locator('#color-mixer-hex-a').fill('xyz1');

    await expect(page.locator('#color-mixer-error')).toHaveText(
      'HEXの形式が正しくありません（例: #3b82f6）',
    );
  });
});

test.describe('Color Mixer (English)', () => {
  test('英語版でOKLab混合の中間色が生成される', async ({ page }) => {
    await page.goto('/en/tools/color-mixer/');

    await page.locator('#color-mixer-space').selectOption('oklab');
    await page.locator('#color-mixer-steps').fill('7');

    await expect(page.locator('#color-mixer-swatches button')).toHaveCount(7);
    await expect(
      page.locator('#color-mixer-swatches button').first(),
    ).toHaveAttribute('aria-label', /: copy$/);
  });
});
