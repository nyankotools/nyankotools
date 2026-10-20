import { test, expect } from './helpers/test';

const JA = '/tools/css-transform-generator/';
const EN = '/en/tools/css-transform-generator/';

test.describe('CSS transformジェネレーター（日本語版）', () => {
  test('初期状態はtransform: none', async ({ page }) => {
    await page.goto(JA);
    await expect(page.locator('#tf-css-output')).toHaveValue(
      'transform: none;',
    );
  });

  test('数値入力が出力に反映され、初期値の項目は省略される', async ({
    page,
  }) => {
    await page.goto(JA);
    await page.locator('#tf-rotateZ').fill('45');
    await page.locator('#tf-scaleX').fill('1.5');
    await page.locator('#tf-scaleY').fill('1.5');
    await expect(page.locator('#tf-css-output')).toHaveValue(
      'transform: rotate(45deg) scale(1.5);',
    );
  });

  test('スライダーと数値入力が連動する', async ({ page }) => {
    await page.goto(JA);
    await page.locator('#tf-translateX-range').fill('20');
    await expect(page.locator('#tf-translateX')).toHaveValue('20');
    await expect(page.locator('#tf-css-output')).toHaveValue(
      'transform: translateX(20px);',
    );
  });

  test('transform-originが初期値以外なら2行目に出る', async ({ page }) => {
    await page.goto(JA);
    await page.locator('#tf-rotateZ').fill('10');
    await page.locator('#tf-originX').fill('0');
    await page.locator('#tf-originY').fill('0');
    await expect(page.locator('#tf-css-output')).toHaveValue(
      'transform: rotate(10deg);\ntransform-origin: 0% 0%;',
    );
  });

  test('範囲外の値はクランプされる', async ({ page }) => {
    await page.goto(JA);
    const skew = page.locator('#tf-skewX');
    await skew.fill('200');
    await skew.blur();
    await expect(skew).toHaveValue('89');
  });

  test('プリセットとリセットが機能する', async ({ page }) => {
    await page.goto(JA);
    await page.locator('[data-preset="flip"]').click();
    await expect(page.locator('#tf-css-output')).toHaveValue(
      'transform: perspective(800px) rotateY(180deg);',
    );
    await page.locator('#tf-reset-button').click();
    await expect(page.locator('#tf-css-output')).toHaveValue(
      'transform: none;',
    );
  });

  test('コピーボタンでCSSをコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto(JA);
    await page.locator('[data-preset="rotate45"]').click();
    await page.locator('#tf-copy-button').click();
    await expect(page.locator('#tf-status')).toHaveText('コピーしました');
    const clip = await page.evaluate(() => navigator.clipboard.readText());
    expect(clip).toBe('transform: rotate(45deg);');
  });
});

test.describe('CSS Transform Generator (English)', () => {
  test('preset and copy message in English', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto(EN);
    await page.locator('[data-preset="italic"]').click();
    await expect(page.locator('#tf-css-output')).toHaveValue(
      'transform: skewX(-15deg);',
    );
    await page.locator('#tf-copy-button').click();
    await expect(page.locator('#tf-status')).toHaveText('Copied');
  });
});
