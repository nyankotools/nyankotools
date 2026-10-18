import { test, expect } from './helpers/test';

test.describe('テキスト⇔2進数・16進数変換（日本語版）', () => {
  test('テキストをUTF-8の16進数に変換する', async ({ page }) => {
    await page.goto('/tools/text-binary-converter/');

    await page.locator('#tbc-input').fill('あ');
    await expect(page.locator('#tbc-output')).toHaveValue('E3 81 82');
    await expect(page.locator('#tbc-info')).toHaveText('3 バイト');
  });

  test('Shift_JISと2進数に切り替えられる', async ({ page }) => {
    await page.goto('/tools/text-binary-converter/');

    await page.locator('#tbc-input').fill('あ');
    await page.locator('#tbc-encoding').selectOption('shift_jis');
    await page.locator('#tbc-radix [data-radix="2"]').click();
    await expect(page.locator('#tbc-output')).toHaveValue('10000010 10100000');
  });

  test('数値からテキストに戻せる', async ({ page }) => {
    await page.goto('/tools/text-binary-converter/');

    await page.locator('#tbc-mode [data-mode="decode"]').click();
    await page.locator('#tbc-input').fill('E3 81 82');
    await expect(page.locator('#tbc-output')).toHaveValue('あ');
  });

  test('不正な数値ではエラーが表示される', async ({ page }) => {
    await page.goto('/tools/text-binary-converter/');

    await page.locator('#tbc-mode [data-mode="decode"]').click();
    await page.locator('#tbc-input').fill('E3 8G');
    await expect(page.locator('#tbc-error')).toBeVisible();
    await expect(page.locator('#tbc-output')).toHaveValue('');
  });

  test('結果をコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/text-binary-converter/');

    await page.locator('#tbc-input').fill('A');
    await page.locator('#tbc-copy-button').click();
    await expect(page.locator('#tbc-status')).toHaveText('コピーしました');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      '41',
    );
  });
});

test.describe('Text to Binary / Hex Converter (English)', () => {
  test('converts text to hex and back', async ({ page }) => {
    await page.goto('/en/tools/text-binary-converter/');

    await page.locator('#tbc-input').fill('Hi');
    await expect(page.locator('#tbc-output')).toHaveValue('48 69');
    await expect(page.locator('#tbc-info')).toHaveText('2 bytes');

    await page.locator('#tbc-mode [data-mode="decode"]').click();
    await page.locator('#tbc-input').fill('48 69');
    await expect(page.locator('#tbc-output')).toHaveValue('Hi');
  });
});
