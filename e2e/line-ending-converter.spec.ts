import { test, expect } from './helpers/test';

test.describe('改行コード変換ツール（日本語版）', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/tools/line-ending-converter/');
    await expect(page.locator('main h1')).toHaveText(
      '改行コード変換（LF/CRLF/CR）',
    );
  });

  test('テキストを入力すると処理される', async ({ page }) => {
    await page.goto('/tools/line-ending-converter/');

    const input = page.locator('#lec-input');
    const output = page.locator('#lec-output');

    // テキストを入力
    const testText = 'line1\nline2\nline3';
    await input.fill(testText);

    // 出力が生成されることを確認
    const outputText = await output.textContent();
    expect(outputText).toBeTruthy();
    expect(outputText.length).toBeGreaterThan(0);
  });

  test('改行コードの検出情報が表示される', async ({ page }) => {
    await page.goto('/tools/line-ending-converter/');

    const input = page.locator('#lec-input');
    await input.fill('line1\nline2');

    const statsEl = page.locator('#lec-stats');
    const statsText = await statsEl.textContent();

    // 統計情報に改行コード情報が表示されることを確認
    expect(statsText).toBeTruthy();
  });

  test('空入力で結果も空になる', async ({ page }) => {
    await page.goto('/tools/line-ending-converter/');

    const input = page.locator('#lec-input');
    const output = page.locator('#lec-output');

    // 入力を設定
    await input.fill('test\nlines');
    let outputText = await output.textContent();
    expect(outputText).toBeTruthy();

    // 入力をクリア
    await input.fill('');
    outputText = await output.textContent();
    expect(outputText.length).toBe(0);
  });

  test('テキストをコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/line-ending-converter/');

    const input = page.locator('#lec-input');
    await input.fill('test\ntext');

    // コピーボタンをクリック（最初は無効なので待つ）
    const copyButton = page.locator('#lec-copy-button');
    await expect(copyButton).toBeEnabled();
    await copyButton.click();

    // クリップボードに内容がコピーされたことを確認
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toBeTruthy();
  });
});

test.describe('Line Ending Converter (English)', () => {
  test('英語版が正しく表示される', async ({ page }) => {
    await page.goto('/en/tools/line-ending-converter/');
    await expect(page.locator('main h1')).toHaveText(
      'Line Ending Converter (LF / CRLF / CR)',
    );
  });

  test('英語版でテキストの改行コードを変換できる', async ({ page }) => {
    await page.goto('/en/tools/line-ending-converter/');

    const input = page.locator('#lec-input');
    const output = page.locator('#lec-output');

    await input.fill('line1\nline2\nline3');

    const outputText = await output.textContent();
    expect(outputText).toBeTruthy();
    expect(outputText.length).toBeGreaterThan(0);
  });
});
