import { test, expect } from './helpers/test';

test.describe('縦書き変換（日本語版）', () => {
  test('句読点を縦書き字形にして1文字1行にする', async ({ page }) => {
    await page.goto('/tools/vertical-text-converter/');
    await page.locator('#vtc-input').fill('あい。');
    await expect(page.locator('#vtc-output')).toHaveValue('あ\nい\n︒');
  });

  test('列を並べるレイアウトと字形オプション', async ({ page }) => {
    await page.goto('/tools/vertical-text-converter/');
    await page.locator('#vtc-input').fill('ab\ncd');
    await page.locator('#vtc-layout').selectOption('columns');
    await expect(page.locator('#vtc-output')).toHaveValue('ｃ　ａ\nｄ　ｂ');
    await page.locator('#vtc-fullwidth').uncheck();
    await expect(page.locator('#vtc-output')).toHaveValue('c　a\nd　b');
  });

  test('プレビューが縦書きで入力を表示する', async ({ page }) => {
    await page.goto('/tools/vertical-text-converter/');
    await page.locator('#vtc-input').fill('縦書き');
    await expect(page.locator('#vtc-preview')).toHaveText('縦書き');
    await expect(page.locator('#vtc-preview')).toHaveCSS(
      'writing-mode',
      'vertical-rl',
    );
  });

  test('コピーボタンで結果をコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/vertical-text-converter/');
    await page.locator('#vtc-input').fill('ab');
    await page.locator('#vtc-copy-button').click();
    await expect(page.locator('#vtc-status')).toHaveText('コピーしました');
    // Windows のクリップボードは改行を CRLF に変換して保存するため正規化して比較する
    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text.replace(/\r\n/g, '\n')).toBe('ａ\nｂ');
  });
});

test.describe('Vertical Text Converter (English)', () => {
  test('英語版で変換してコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/en/tools/vertical-text-converter/');
    await page.locator('#vtc-input').fill('「あ」');
    await expect(page.locator('#vtc-output')).toHaveValue('﹁\nあ\n﹂');
    await expect(page.locator('#vtc-preview')).toHaveCSS(
      'writing-mode',
      'vertical-rl',
    );
    await page.locator('#vtc-copy-button').click();
    await expect(page.locator('#vtc-status')).toHaveText('Copied');
  });
});
