import { test, expect } from './helpers/test';

test.describe('浮動小数点ビット表示（日本語版）', () => {
  test('既定の 0.1+0.2 が float64 で表示される', async ({ page }) => {
    await page.goto('/tools/ieee754-viewer/');

    await expect(page.locator('#ieee-value')).toHaveText('0.30000000000000004');
    await expect(page.locator('#ieee-hex')).toHaveText('0x3FD3333333333334');
    await expect(page.locator('#ieee-error')).toBeEmpty();
  });

  test('float32 に切り替えると結果が変わる', async ({ page }) => {
    await page.goto('/tools/ieee754-viewer/');
    await page.locator('#ieee-input').fill('0.1');
    await page.locator('#ieee-precision').selectOption('32');

    await expect(page.locator('#ieee-hex')).toHaveText('0x3DCCCCCD');
    await expect(page.locator('#ieee-category')).toHaveText('正規化数');
  });

  test('16進から数値に逆変換できる', async ({ page }) => {
    await page.goto('/tools/ieee754-viewer/');
    await page.locator('#ieee-input').fill('0x3FF8000000000000');

    await expect(page.locator('#ieee-value')).toHaveText('1.5');
    await expect(page.locator('#ieee-kind')).toHaveText('16進のビット列');
  });

  test('サンプルボタンで NaN を表示できる', async ({ page }) => {
    await page.goto('/tools/ieee754-viewer/');
    await page.getByRole('button', { name: 'NaN', exact: true }).click();

    await expect(page.locator('#ieee-category')).toHaveText('NaN（quiet）');
  });

  test('不正な入力でエラーが表示される', async ({ page }) => {
    await page.goto('/tools/ieee754-viewer/');
    await page.locator('#ieee-input').fill('hello');

    await expect(page.locator('#ieee-error')).toContainText('解釈できません');
    await expect(page.locator('#ieee-result')).toBeHidden();
  });

  test('コピーボタンで結果をコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/ieee754-viewer/');
    await page.locator('#ieee-copy-button').click();

    await expect(page.locator('#ieee-status')).toHaveText('コピーしました');
    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text).toContain('0x3FD3333333333334');
  });
});

test.describe('IEEE 754 Float Viewer (English)', () => {
  test('shows subnormal and an English error', async ({ page }) => {
    await page.goto('/en/tools/ieee754-viewer/');
    await page.locator('#ieee-input').fill('5e-324');
    await expect(page.locator('#ieee-category')).toHaveText('Subnormal');

    await page.locator('#ieee-input').fill('hello');
    await expect(page.locator('#ieee-error')).toContainText('Could not parse');
  });
});
