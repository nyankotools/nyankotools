import { test, expect } from './helpers/test';

const JA = '/tools/css-filter-generator/';
const EN = '/en/tools/css-filter-generator/';

test.describe('CSS filterジェネレーター（日本語版）', () => {
  test('初期状態は filter: none', async ({ page }) => {
    await page.goto(JA);
    await expect(page.locator('#cf-css-output')).toHaveValue('filter: none;');
  });

  test('数値入力とスライダーが出力に反映される', async ({ page }) => {
    await page.goto(JA);

    await page.locator('#cf-n-blur').fill('4');
    await expect(page.locator('#cf-css-output')).toHaveValue(
      'filter: blur(4px);',
    );

    await page.locator('[data-range="grayscale"]').fill('50');
    await expect(page.locator('#cf-n-grayscale')).toHaveValue('50');
    await expect(page.locator('#cf-css-output')).toHaveValue(
      'filter: blur(4px) grayscale(50%);',
    );
    const style = await page.locator('#cf-preview').getAttribute('style');
    expect(style).toContain('grayscale(50%)');
  });

  test('範囲外の値はクランプされる', async ({ page }) => {
    await page.goto(JA);
    const input = page.locator('#cf-n-blur');
    await input.fill('500');
    await input.blur();
    await expect(input).toHaveValue('50');
  });

  test('drop-shadowを有効にすると出力に追加される', async ({ page }) => {
    await page.goto(JA);
    await page.locator('#cf-shadow-enabled').check();
    await expect(page.locator('#cf-css-output')).toHaveValue(
      'filter: drop-shadow(4px 4px 6px #000000);',
    );
  });

  test('プリセットと初期化', async ({ page }) => {
    await page.goto(JA);
    await page.locator('[data-preset="noir"]').click();
    await expect(page.locator('#cf-css-output')).toHaveValue(
      'filter: brightness(90%) contrast(130%) grayscale(100%);',
    );
    await page.locator('#cf-reset-button').click();
    await expect(page.locator('#cf-css-output')).toHaveValue('filter: none;');
  });

  test('コピーボタンでCSSをコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto(JA);
    await page.locator('#cf-n-sepia').fill('30');
    const css = await page.locator('#cf-css-output').inputValue();
    await page.locator('#cf-copy-button').click();
    await expect(page.locator('#cf-status')).toHaveText('コピーしました');
    const clip = await page.evaluate(() => navigator.clipboard.readText());
    expect(clip).toBe(css);
  });
});

test.describe('CSS Filter Generator (English)', () => {
  test('preset and copy message in English', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto(EN);
    await page.locator('[data-preset="shadow"]').click();
    await expect(page.locator('#cf-css-output')).toHaveValue(
      'filter: drop-shadow(6px 8px 8px #000000);',
    );
    await page.locator('#cf-copy-button').click();
    await expect(page.locator('#cf-status')).toHaveText('Copied');
  });
});
