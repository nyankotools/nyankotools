import { test, expect } from './helpers/test';

test.describe('配色パレットジェネレーター', () => {
  test('補色を生成しCSS変数とJSONが出力される', async ({ page }) => {
    await page.goto('/tools/color-palette-generator/');

    await page.locator('#color-palette-hex').fill('#ff0000');
    await page.locator('#color-palette-harmony').selectOption('complementary');

    await expect(page.locator('#color-palette-swatches button')).toHaveCount(2);
    await expect(page.locator('#color-palette-css')).toHaveValue(
      /--color-2: #00ffff;/,
    );
    await expect(page.locator('#color-palette-json')).toHaveValue(/#00ffff/);
  });

  test('スウォッチをクリックするとHEXがコピーされる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/color-palette-generator/');

    await page.locator('#color-palette-hex').fill('#ff0000');
    await page.locator('#color-palette-harmony').selectOption('triadic');
    await page.locator('#color-palette-swatches button').nth(1).click();

    await expect(page.locator('#color-palette-status')).toHaveText(
      'コピーしました',
    );
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      '#00ff00',
    );
  });

  test('不正なHEXでエラーが表示される', async ({ page }) => {
    await page.goto('/tools/color-palette-generator/');

    await page.locator('#color-palette-hex').fill('xyz');

    await expect(page.locator('#color-palette-error')).toHaveText(
      'HEXの形式が正しくありません（例: #3b82f6）',
    );
  });
});

test.describe('Color Palette Generator (English)', () => {
  test('英語版でモノクロマティック5色が生成される', async ({ page }) => {
    await page.goto('/en/tools/color-palette-generator/');

    await page.locator('#color-palette-harmony').selectOption('monochromatic');

    await expect(page.locator('#color-palette-swatches button')).toHaveCount(5);
    await expect(
      page.locator('#color-palette-swatches button').first(),
    ).toHaveAttribute('aria-label', /: copy$/);
  });
});
