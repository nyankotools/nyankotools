import { test, expect } from './helpers/test';

test.describe('テキスト枠囲み・吹き出しツール', () => {
  test('入力したテキストが罫線で囲まれ、全角でも幅が揃う', async ({ page }) => {
    await page.goto('/tools/text-box-frame/');
    await page.locator('#text-box-frame-input').fill('あい\nabc');
    await expect(page.locator('#text-box-frame-output')).toHaveValue(
      '┌──────┐\n│ あい │\n│ abc  │\n└──────┘',
    );
  });

  test('スタイルとコメントを切り替えられる', async ({ page }) => {
    await page.goto('/tools/text-box-frame/');
    await page.locator('#text-box-frame-input').fill('hi');
    await page.locator('#text-box-frame-style').selectOption('speech');
    await page.locator('#text-box-frame-tail').uncheck();
    await page.locator('#text-box-frame-comment').selectOption('slash');
    await expect(page.locator('#text-box-frame-output')).toHaveValue(
      '//  ____\n// < hi >\n//  ----',
    );
  });

  test('コピーボタンで完了メッセージが出る', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/text-box-frame/');
    await page.locator('#text-box-frame-input').fill('a');
    await page.locator('#text-box-frame-copy-button').click();
    await expect(page.locator('#text-box-frame-status')).toHaveText(
      'コピーしました',
    );
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    // Windows のクリップボードは改行を CRLF で返すことがあるので正規化する
    expect(clipboardText.replace(/\r\n/g, '\n')).toBe('┌───┐\n│ a │\n└───┘');
  });

  test('英語版が表示される', async ({ page }) => {
    await page.goto('/en/tools/text-box-frame/');
    await expect(page.locator('main h1')).toContainText('Speech Bubble');
    await page.locator('#text-box-frame-input').fill('a');
    await page.locator('#text-box-frame-style').selectOption('ascii');
    await expect(page.locator('#text-box-frame-output')).toHaveValue(
      '+---+\n| a |\n+---+',
    );
  });
});
