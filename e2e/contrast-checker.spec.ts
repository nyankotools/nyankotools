import { test, expect } from '@playwright/test';

test.describe('色のコントラスト比チェッカー（日本語版）', () => {
  test('直接アクセスして正しく表示され、黒背景に白文字は全レベルに適合する', async ({
    page,
  }) => {
    await page.goto('/tools/contrast-checker/');

    await expect(page.locator('main h1')).toHaveText(
      '色のコントラスト比チェッカー（WCAG）',
    );

    await page.locator('#contrast-checker-fg').fill('#ffffff');
    await page.locator('#contrast-checker-bg').fill('#000000');

    await expect(page.locator('#contrast-checker-ratio')).toHaveText(
      '21.00 : 1',
    );
    await expect(
      page.locator('[data-result-row="normalAA"] [data-result-badge]'),
    ).toHaveText('適合');
    await expect(
      page.locator('[data-result-row="normalAAA"] [data-result-badge]'),
    ).toHaveText('適合');
  });

  test('コントラスト比が低い組み合わせは不適合と表示される', async ({
    page,
  }) => {
    await page.goto('/tools/contrast-checker/');

    await page.locator('#contrast-checker-fg').fill('#dddddd');
    await page.locator('#contrast-checker-bg').fill('#ffffff');

    await expect(
      page.locator('[data-result-row="normalAA"] [data-result-badge]'),
    ).toHaveText('不適合');
    await expect(
      page.locator('[data-result-row="largeAA"] [data-result-badge]'),
    ).toHaveText('不適合');
  });

  test('入れ替えボタンで文字色と背景色が入れ替わる', async ({ page }) => {
    await page.goto('/tools/contrast-checker/');

    await page.locator('#contrast-checker-fg').fill('#111827');
    await page.locator('#contrast-checker-bg').fill('#ffffff');
    await page.locator('#contrast-checker-swap').click();

    await expect(page.locator('#contrast-checker-fg')).toHaveValue('#ffffff');
    await expect(page.locator('#contrast-checker-bg')).toHaveValue('#111827');
  });

  test('不正な形式の色を入力するとエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/contrast-checker/');

    await page.locator('#contrast-checker-fg').fill('not-a-color');

    await expect(page.locator('#contrast-checker-error')).toHaveText(
      '色の形式が正しくありません（例: #333333, rgb(51, 51, 51)）',
    );
  });

  test('用語解説セクションが表示される', async ({ page }) => {
    await page.goto('/tools/contrast-checker/');

    await expect(
      page.getByRole('heading', { level: 2, name: '用語解説' }),
    ).toBeVisible();
    await expect(
      page.locator('details summary', { hasText: 'WCAG' }).first(),
    ).toBeVisible();
  });

  test('8桁HEX形式（#rrggbbaa）を入力するとエラーになる', async ({ page }) => {
    await page.goto('/tools/contrast-checker/');

    await page.locator('#contrast-checker-fg').fill('#3b82f6ff');

    await expect(page.locator('#contrast-checker-error')).toHaveText(
      '色の形式が正しくありません（例: #333333, rgb(51, 51, 51)）',
    );
  });

  test('不完全なHEX形式（#1など）を入力するとエラーになる', async ({
    page,
  }) => {
    await page.goto('/tools/contrast-checker/');

    await page.locator('#contrast-checker-fg').fill('#1');

    await expect(page.locator('#contrast-checker-error')).toHaveText(
      '色の形式が正しくありません（例: #333333, rgb(51, 51, 51)）',
    );
  });

  test('rgba形式はアルファ値を無視して受理される', async ({ page }) => {
    await page.goto('/tools/contrast-checker/');

    await page.locator('#contrast-checker-fg').fill('rgba(255, 255, 255, 0.5)');
    await page.locator('#contrast-checker-bg').fill('rgb(0, 0, 0)');

    // エラーが表示されず、比率が計算される（21:1）
    await expect(page.locator('#contrast-checker-error')).toHaveText('');
    await expect(page.locator('#contrast-checker-ratio')).toHaveText(
      '21.00 : 1',
    );
  });

  test('RGB形式の値が範囲外（256以上）の場合はエラーになる', async ({
    page,
  }) => {
    await page.goto('/tools/contrast-checker/');

    await page.locator('#contrast-checker-fg').fill('rgb(256, 0, 0)');

    await expect(page.locator('#contrast-checker-error')).toHaveText(
      '色の形式が正しくありません（例: #333333, rgb(51, 51, 51)）',
    );
  });

  test('カラーピッカーから選択した色がテキスト入力に反映される', async ({
    page,
  }) => {
    await page.goto('/tools/contrast-checker/');

    // カラーピッカーの値を変更
    await page.locator('#contrast-checker-fg-picker').fill('#ff0000');

    // テキスト入力も変更されるはず
    await expect(page.locator('#contrast-checker-fg')).toHaveValue('#ff0000');
  });

  test('テキスト入力で大文字HEXを入力するとカラーピッカーに小文字で反映される', async ({
    page,
  }) => {
    await page.goto('/tools/contrast-checker/');

    await page.locator('#contrast-checker-fg').fill('#FFFFFF');

    // ピッカーは標準的に小文字で表示
    const pickerValue = await page
      .locator('#contrast-checker-fg-picker')
      .inputValue();
    expect(pickerValue).toMatch(/^#[a-f0-9]{6}$/i);
  });
});

test.describe('Color Contrast Checker (English)', () => {
  test('英語版が正しく表示され、コントラスト比が計算される', async ({
    page,
  }) => {
    await page.goto('/en/tools/contrast-checker/');

    await expect(page.locator('main h1')).toHaveText(
      'Color Contrast Checker (WCAG)',
    );

    await page.locator('#contrast-checker-fg').fill('#ffffff');
    await page.locator('#contrast-checker-bg').fill('#000000');

    await expect(page.locator('#contrast-checker-ratio')).toHaveText(
      '21.00 : 1',
    );
    await expect(
      page.locator('[data-result-row="normalAA"] [data-result-badge]'),
    ).toHaveText('Pass');
  });

  test('不正な形式の色を入力すると英語のエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/en/tools/contrast-checker/');

    await page.locator('#contrast-checker-fg').fill('not-a-color');

    await expect(page.locator('#contrast-checker-error')).toHaveText(
      'Invalid color format (e.g. #333333, rgb(51, 51, 51))',
    );
  });

  test('用語解説（Glossary）セクションが英語で表示される', async ({ page }) => {
    await page.goto('/en/tools/contrast-checker/');

    await expect(
      page.getByRole('heading', { level: 2, name: 'Glossary' }),
    ).toBeVisible();
  });
});
