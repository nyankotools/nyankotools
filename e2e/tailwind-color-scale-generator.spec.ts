import { test, expect } from './helpers/test';

test.describe('Tailwindカラースケール生成', () => {
  test('11段階が生成され、基準色が最も近い段に入る', async ({ page }) => {
    await page.goto('/tools/tailwind-color-scale-generator/');

    await page.locator('#tcs-hex').fill('#3b82f6');

    await expect(page.locator('#tcs-swatches button')).toHaveCount(11);
    await expect(page.locator('#tcs-output')).toHaveValue(
      /--brand-400: #3b82f6;/,
    );
  });

  test('出力形式と色名を切り替えられる', async ({ page }) => {
    await page.goto('/tools/tailwind-color-scale-generator/');

    await page.locator('#tcs-name').fill('Sky Blue');
    await page.locator('#tcs-format').selectOption('theme');
    await expect(page.locator('#tcs-output')).toHaveValue(
      /--color-sky-blue-500:/,
    );

    await page.locator('#tcs-format').selectOption('config');
    await expect(page.locator('#tcs-output')).toHaveValue(/'sky-blue': \{/);
  });

  test('コピーボタンで出力がコピーされる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/tailwind-color-scale-generator/');

    await page.locator('#tcs-copy-button').click();

    await expect(page.locator('#tcs-status')).toHaveText('コピーしました');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
      '--brand-50:',
    );
  });

  test('不正なHEXでエラーが表示される', async ({ page }) => {
    await page.goto('/tools/tailwind-color-scale-generator/');

    await page.locator('#tcs-hex').fill('xyz');

    await expect(page.locator('#tcs-error')).toHaveText(
      'HEXの形式が正しくありません（例: #3b82f6）',
    );
  });
});

test.describe('Tailwind Color Scale Generator (English)', () => {
  test('英語版で11段階が生成される', async ({ page }) => {
    await page.goto('/en/tools/tailwind-color-scale-generator/');

    await expect(page.locator('#tcs-swatches button')).toHaveCount(11);
    await expect(page.locator('#tcs-swatches button').first()).toHaveAttribute(
      'aria-label',
      /: copy$/,
    );
  });
});
