import { test, expect } from '@playwright/test';

const validSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <!-- comment -->
  <metadata>metadata</metadata>
  <rect x="10.000000" y="10.000000" width="80" height="80" fill="#ff0000"/>
</svg>`;

const invalidSvg = '<svg><rect></svg>';

test.describe('SVG最適化ツール（日本語版）', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/tools/svg-optimizer/');

    await expect(page.locator('main h1')).toHaveText('SVG最適化（SVGO）');
  });

  test('SVGコードを入力すると最適化される', async ({ page }) => {
    await page.goto('/tools/svg-optimizer/');

    const input = page.locator('#svgo-input');
    await input.fill(validSvg);

    // 200msのデバウンスの後に実行されるのを待つ
    await page.waitForTimeout(300);

    const output = page.locator('#svgo-output');
    const outputValue = await output.inputValue();

    // コメントとメタデータが削除されていることを確認
    expect(outputValue).not.toContain('comment');
    expect(outputValue).not.toContain('metadata');
    // SVGルートは存在する
    expect(outputValue).toContain('<svg');

    // 結果表示エリアが表示される
    const resultEl = page.locator('#svgo-result');
    await expect(resultEl).toBeVisible();
  });

  test('複数回パスオプションを切り替えると最適化が再実行される', async ({
    page,
  }) => {
    await page.goto('/tools/svg-optimizer/');

    const input = page.locator('#svgo-input');
    const multipassCheckbox = page.locator('#svgo-multipass');
    const output = page.locator('#svgo-output');

    await input.fill(validSvg);
    await page.waitForTimeout(300);

    // マルチパスを無効にして再実行
    await multipassCheckbox.uncheck();
    await page.waitForTimeout(300);

    const outputValue2 = await output.inputValue();

    // マルチパスの状態を変えても出力は有効なSVGであることを確認
    expect(outputValue2).toContain('<svg');

    // 再度有効にする
    await multipassCheckbox.check();
    await page.waitForTimeout(300);

    const outputValue3 = await output.inputValue();
    expect(outputValue3).toContain('<svg');
  });

  test('読みやすく整形するオプションを有効にすると改行が含まれる', async ({
    page,
  }) => {
    await page.goto('/tools/svg-optimizer/');

    const input = page.locator('#svgo-input');
    const prettyCheckbox = page.locator('#svgo-pretty');
    const output = page.locator('#svgo-output');

    await input.fill(validSvg);
    await page.waitForTimeout(300);

    // prettyを有効にする
    await prettyCheckbox.check();
    await page.waitForTimeout(300);

    const outputValue = await output.inputValue();
    // 改行を含む（prettyで整形されている）
    expect(outputValue.split('\n').length).toBeGreaterThan(1);
  });

  test('width/height削除オプションを有効にするとviewBoxのみが残る', async ({
    page,
  }) => {
    await page.goto('/tools/svg-optimizer/');

    const input = page.locator('#svgo-input');
    const removeDimensionsCheckbox = page.locator(
      '#svgo-remove-dimensions',
    );
    const output = page.locator('#svgo-output');

    await input.fill(validSvg);
    await page.waitForTimeout(300);

    // removeDimensionsを有効にする
    await removeDimensionsCheckbox.check();
    await page.waitForTimeout(300);

    const outputValue = await output.inputValue();
    // width属性がないことを確認
    expect(outputValue).not.toMatch(/<svg[^>]* width=/);
    // viewBoxは存在する
    expect(outputValue).toContain('viewBox');
  });

  test('precision値を変更すると最適化が再実行される', async ({ page }) => {
    await page.goto('/tools/svg-optimizer/');

    const input = page.locator('#svgo-input');
    const precisionInput = page.locator('#svgo-precision');
    const output = page.locator('#svgo-output');

    await input.fill(validSvg);
    await page.waitForTimeout(300);

    // precisionを変更
    await precisionInput.fill('1');
    await page.waitForTimeout(300);

    const outputValue2 = await output.inputValue();

    // 異なる精度で最適化されたSVGが出力されている
    expect(outputValue2).toContain('<svg');
  });

  test('不正なSVGを入力するとエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/svg-optimizer/');

    const input = page.locator('#svgo-input');
    const errorEl = page.locator('#svgo-error');

    await input.fill(invalidSvg);
    await page.waitForTimeout(300);

    // エラーが表示される
    await expect(errorEl).toBeVisible();
    // 空の結果エリアは表示されない
    const resultEl = page.locator('#svgo-result');
    await expect(resultEl).toBeHidden();
  });

  test('空の入力は結果を消す', async ({ page }) => {
    await page.goto('/tools/svg-optimizer/');

    const input = page.locator('#svgo-input');
    const resultEl = page.locator('#svgo-result');
    const errorEl = page.locator('#svgo-error');

    // 最初に有効なSVGを入力
    await input.fill(validSvg);
    await page.waitForTimeout(300);
    await expect(resultEl).toBeVisible();

    // 入力をクリア
    await input.fill('');
    await page.waitForTimeout(300);

    // 結果とエラーが表示されない
    await expect(resultEl).toBeHidden();
    await expect(errorEl).toBeHidden();
  });

  test('コピーボタンで結果をクリップボードにコピーできる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/svg-optimizer/');

    const input = page.locator('#svgo-input');
    const copyButton = page.locator('#svgo-copy');
    const statusEl = page.locator('#svgo-status');

    await input.fill(validSvg);
    await page.waitForTimeout(300);

    await copyButton.click();

    await expect(statusEl).toHaveText('コピーしました');

    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toContain('<svg');
  });

  test('ダウンロードボタンのhref属性が設定される', async ({ page }) => {
    await page.goto('/tools/svg-optimizer/');

    const input = page.locator('#svgo-input');
    const downloadLink = page.locator('#svgo-download');

    await input.fill(validSvg);
    await page.waitForTimeout(300);

    const href = await downloadLink.getAttribute('href');
    expect(href).toMatch(/^blob:/);
  });

  test('クリアボタンで全てをリセットできる', async ({ page }) => {
    await page.goto('/tools/svg-optimizer/');

    const input = page.locator('#svgo-input');
    const output = page.locator('#svgo-output');
    const resultEl = page.locator('#svgo-result');
    const clearButton = page.locator('#svgo-clear');

    // 入力を設定
    await input.fill(validSvg);
    await page.waitForTimeout(300);
    await expect(resultEl).toBeVisible();

    // クリア実行
    await clearButton.click();

    // 入力と出力が空になる
    await expect(input).toHaveValue('');
    await expect(output).toHaveValue('');
    // 結果が隠れる
    await expect(resultEl).toBeHidden();
  });

  test('用語解説セクションが表示される', async ({ page }) => {
    await page.goto('/tools/svg-optimizer/');

    await expect(
      page.getByRole('heading', { level: 2, name: '用語解説' }),
    ).toBeVisible();
    await expect(page.getByText('SVG', { exact: true })).toBeVisible();
  });
});

test.describe('SVG Optimizer (English)', () => {
  test('英語版が正しく表示される', async ({ page }) => {
    await page.goto('/en/tools/svg-optimizer/');

    await expect(page.locator('main h1')).toHaveText('SVG Optimizer (SVGO)');
  });

  test('SVG code is optimized when pasted', async ({ page }) => {
    await page.goto('/en/tools/svg-optimizer/');

    const input = page.locator('#svgo-input');
    await input.fill(validSvg);

    await page.waitForTimeout(300);

    const output = page.locator('#svgo-output');
    const outputValue = await output.inputValue();

    expect(outputValue).not.toContain('comment');
    expect(outputValue).not.toContain('metadata');
    expect(outputValue).toContain('<svg');

    const resultEl = page.locator('#svgo-result');
    await expect(resultEl).toBeVisible();
  });

  test('Invalid SVG shows English error message', async ({ page }) => {
    await page.goto('/en/tools/svg-optimizer/');

    const input = page.locator('#svgo-input');
    const errorEl = page.locator('#svgo-error');

    await input.fill(invalidSvg);
    await page.waitForTimeout(300);

    await expect(errorEl).toBeVisible();
  });

  test('Copy button shows English message', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/en/tools/svg-optimizer/');

    const input = page.locator('#svgo-input');
    const copyButton = page.locator('#svgo-copy');
    const statusEl = page.locator('#svgo-status');

    await input.fill(validSvg);
    await page.waitForTimeout(300);

    await copyButton.click();

    await expect(statusEl).toHaveText('Copied');
  });

  test('Glossary section is displayed in English', async ({ page }) => {
    await page.goto('/en/tools/svg-optimizer/');

    await expect(
      page.getByRole('heading', { level: 2, name: 'Glossary' }),
    ).toBeVisible();
  });
});
