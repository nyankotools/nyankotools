import { test, expect } from './helpers/test';

test.describe('色空間変換ツール（日本語版）', () => {
  test('HEXを入力すると全形式に変換される', async ({ page }) => {
    await page.goto('/tools/color-space-converter/');

    await expect(page.locator('main h1')).toHaveText(
      '色空間変換（RGB・CMYK・Lab・OKLCH・HWB）',
    );

    await page.locator('#color-space-hex').fill('#ff0000');

    await expect(page.locator('#color-space-rgb')).toHaveValue(
      'rgb(255, 0, 0)',
    );
    await expect(page.locator('#color-space-hsl')).toHaveValue(
      'hsl(0, 100%, 50%)',
    );
    await expect(page.locator('#color-space-cmyk')).toHaveValue(
      'cmyk(0%, 100%, 100%, 0%)',
    );
    await expect(page.locator('#color-space-hwb')).toHaveValue('hwb(0 0% 0%)');
    await expect(page.locator('#color-space-lab')).toHaveValue(
      'lab(54.29 80.8 69.89)',
    );
    await expect(page.locator('#color-space-oklch')).toHaveValue(
      'oklch(0.628 0.2577 29.23)',
    );
    await expect(page.locator('#color-space-picker')).toHaveValue('#ff0000');
  });

  test('CMYKを入力するとHEXに反映される', async ({ page }) => {
    await page.goto('/tools/color-space-converter/');

    await page.locator('#color-space-cmyk').fill('cmyk(0%, 100%, 100%, 0%)');

    await expect(page.locator('#color-space-hex')).toHaveValue('#ff0000');
  });

  test('OKLCHを入力するとHEXに反映される', async ({ page }) => {
    await page.goto('/tools/color-space-converter/');

    await page.locator('#color-space-oklch').fill('oklch(0.628 0.2577 29.23)');

    await expect(page.locator('#color-space-hex')).toHaveValue('#ff0000');
    await expect(page.locator('#color-space-clipped')).toHaveText('');
  });

  test('sRGB色域外のOKLCHを入力すると丸めた旨が表示される', async ({
    page,
  }) => {
    await page.goto('/tools/color-space-converter/');

    await page.locator('#color-space-oklch').fill('oklch(0.7 0.4 150)');

    await expect(page.locator('#color-space-clipped')).toContainText(
      'sRGBで表現できる範囲を超えている',
    );
  });

  test('不正な形式を入力するとその欄にエラーが表示され、他の欄は変わらない', async ({
    page,
  }) => {
    await page.goto('/tools/color-space-converter/');

    await page.locator('#color-space-hex').fill('#ff0000');
    await page.locator('#color-space-cmyk').fill('cmyk(0, 200, 0, 0)');

    await expect(page.locator('#color-space-cmyk-error')).toContainText(
      'CMYKの形式が正しくありません',
    );
    await expect(page.locator('#color-space-hex')).toHaveValue('#ff0000');
  });

  test('コピーボタンでLab値をコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/color-space-converter/');

    await page.locator('#color-space-hex').fill('#ff0000');
    await page.locator('[data-copy-target="color-space-lab"]').click();

    await expect(page.locator('#color-space-status')).toHaveText(
      'コピーしました',
    );
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      'lab(54.29 80.8 69.89)',
    );
  });
});

test.describe('Color Space Converter (English)', () => {
  test('英語版が表示され、変換できる', async ({ page }) => {
    await page.goto('/en/tools/color-space-converter/');

    await expect(page.locator('main h1')).toHaveText(
      'Color Space Converter (RGB, CMYK, Lab, OKLCH, HWB)',
    );

    await page.locator('#color-space-rgb').fill('rgb(255, 0, 0)');

    await expect(page.locator('#color-space-hex')).toHaveValue('#ff0000');
    await expect(page.locator('#color-space-cmyk')).toHaveValue(
      'cmyk(0%, 100%, 100%, 0%)',
    );
  });

  test('英語のエラーメッセージが表示される', async ({ page }) => {
    await page.goto('/en/tools/color-space-converter/');

    await page.locator('#color-space-hex').fill('not-a-color');

    await expect(page.locator('#color-space-hex-error')).toHaveText(
      'Invalid HEX format (e.g. #3b82f6)',
    );
  });
});
