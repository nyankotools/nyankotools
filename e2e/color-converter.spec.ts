import { test, expect } from '@playwright/test';

test.describe('カラーコード変換ツール（日本語版）', () => {
  test('直接アクセスして正しく表示され、HEXを入力するとRGB/HSLに変換される', async ({
    page,
  }) => {
    await page.goto('/tools/color-converter/');

    await expect(page.locator('main h1')).toHaveText(
      'カラーコード変換（HEX/RGB/HSL）',
    );

    await page.locator('#color-converter-hex').fill('#3b82f6');

    await expect(page.locator('#color-converter-rgb')).toHaveValue(
      'rgb(59, 130, 246)',
    );
    await expect(page.locator('#color-converter-hsl')).toHaveValue(
      'hsl(217, 91%, 60%)',
    );
    await expect(page.locator('#color-converter-picker')).toHaveValue(
      '#3b82f6',
    );
  });

  test('RGBを入力するとHEX/HSLに反映される', async ({ page }) => {
    await page.goto('/tools/color-converter/');

    await page.locator('#color-converter-rgb').fill('rgb(255, 0, 0)');

    await expect(page.locator('#color-converter-hex')).toHaveValue('#ff0000');
    await expect(page.locator('#color-converter-hsl')).toHaveValue(
      'hsl(0, 100%, 50%)',
    );
  });

  test('不正な形式のHEXを入力するとエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/color-converter/');

    await page.locator('#color-converter-hex').fill('not-a-color');

    await expect(page.locator('#color-converter-error')).toHaveText(
      'HEXの形式が正しくありません（例: #3b82f6）',
    );
  });

  test('コピーボタンでHEX値をクリップボードにコピーできる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/color-converter/');

    await page.locator('#color-converter-hex').fill('#3b82f6');
    await page.locator('[data-copy-target="color-converter-hex"]').click();

    await expect(page.locator('#color-converter-status')).toHaveText(
      'コピーしました',
    );
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toBe('#3b82f6');
  });

  test('用語解説セクションが表示される', async ({ page }) => {
    await page.goto('/tools/color-converter/');

    await expect(
      page.getByRole('heading', { level: 2, name: '用語解説' }),
    ).toBeVisible();
    await expect(
      page.locator('details summary', { hasText: 'RGB' }).first(),
    ).toBeVisible();
  });

  test('サイドバーからツールページへ遷移できる', async ({ page }) => {
    await page.goto('/');

    const link = page.locator('#sidebar a[href="/tools/color-converter/"]');
    await link.locator('xpath=ancestor::details[1]/summary').click();
    await link.click();

    await expect(page).toHaveURL(/\/tools\/color-converter\/?$/);
    await expect(page.locator('main h1')).toHaveText(
      'カラーコード変換（HEX/RGB/HSL）',
    );
  });

  test('375px幅でも横スクロールが発生しない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/tools/color-converter/');

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
});

test.describe('Color Converter (English)', () => {
  test('英語版が正しく表示され、HEXを入力するとRGB/HSLに変換される', async ({
    page,
  }) => {
    await page.goto('/en/tools/color-converter/');

    await expect(page.locator('main h1')).toHaveText(
      'Color Converter (HEX/RGB/HSL)',
    );

    await page.locator('#color-converter-hex').fill('#3b82f6');

    await expect(page.locator('#color-converter-rgb')).toHaveValue(
      'rgb(59, 130, 246)',
    );
  });

  test('不正な形式のHEXを入力すると英語のエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/en/tools/color-converter/');

    await page.locator('#color-converter-hex').fill('not-a-color');

    await expect(page.locator('#color-converter-error')).toHaveText(
      'Invalid HEX format (e.g. #3b82f6)',
    );
  });

  test('コピーボタンで結果をクリップボードにコピーでき、英語のメッセージが表示される', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/en/tools/color-converter/');

    await page.locator('#color-converter-hex').fill('#3b82f6');
    await page.locator('[data-copy-target="color-converter-hex"]').click();

    await expect(page.locator('#color-converter-status')).toHaveText('Copied');
  });

  test('用語解説（Glossary）セクションが英語で表示される', async ({ page }) => {
    await page.goto('/en/tools/color-converter/');

    await expect(
      page.getByRole('heading', { level: 2, name: 'Glossary' }),
    ).toBeVisible();
  });

  test('サイドバーからツールページへ遷移できる（英語版）', async ({ page }) => {
    await page.goto('/en/');

    const link = page.locator('#sidebar a[href="/en/tools/color-converter/"]');
    await link.locator('xpath=ancestor::details[1]/summary').click();
    await link.click();

    await expect(page).toHaveURL(/\/en\/tools\/color-converter\/?$/);
    await expect(page.locator('main h1')).toHaveText(
      'Color Converter (HEX/RGB/HSL)',
    );
  });

  test('375px幅でも横スクロールが発生しない（英語版）', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/en/tools/color-converter/');

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
});
