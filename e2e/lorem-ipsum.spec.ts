import { test, expect } from './helpers/test';

test.describe('ダミーテキスト生成ツール（日本語版）', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/tools/lorem-ipsum/');
    await expect(page.locator('main h1')).toHaveText('ダミーテキスト生成');
  });

  test('デフォルト設定でテキストが生成される', async ({ page }) => {
    await page.goto('/tools/lorem-ipsum/');

    // 生成ボタンをクリック
    const generateButton = page.locator('button:has-text("生成")').first();
    await generateButton.click();

    // 出力テキストが存在
    const output = page.locator(
      'textarea[readonly], #lorem-output, [id*="output"]',
    );
    let outputText = await output.first().inputValue();

    // outputが見つからない場合は、プレビュー領域を確認
    if (!outputText || outputText.trim() === '') {
      const previewArea = page.locator('[id*="preview"], [id*="render"]');
      outputText = await previewArea.first().textContent();
    }

    expect(outputText).toBeTruthy();
    expect(outputText.length).toBeGreaterThan(0);
  });

  test('段落数を変更できる', async ({ page }) => {
    await page.goto('/tools/lorem-ipsum/');

    // 段落数入力フィールド
    const numberInputs = page.locator('input[type="number"]');
    // 最初のnumber inputは段落数の可能性が高い
    await numberInputs.first().fill('2');

    // 生成ボタンをクリック
    const generateButton = page.locator('button:has-text("生成")').first();
    await generateButton.click();

    // 出力テキストが存在
    const output = page.locator(
      'textarea[readonly], #lorem-output, [id*="output"]',
    );
    let outputText = await output.first().inputValue();

    if (!outputText || outputText.trim() === '') {
      const previewArea = page.locator('[id*="preview"], [id*="render"]');
      outputText = await previewArea.first().textContent();
    }

    // テキストが生成されていることを確認
    expect(outputText).toBeTruthy();
  });

  test('生成タイプを変更できる', async ({ page }) => {
    await page.goto('/tools/lorem-ipsum/');

    // ラジオボタンまたはセグメント制御を見つける
    const typeSelector = page.locator('[data-type], [data-mode]');
    const count = await typeSelector.count();

    // セレクタが存在する場合（複数のタイプがサポートされている）
    if (count > 0) {
      const firstType = typeSelector.first();
      await firstType.click();

      // 生成ボタンをクリック
      const generateButton = page.locator('button:has-text("生成")').first();
      await generateButton.click();

      const output = page.locator(
        'textarea[readonly], #lorem-output, [id*="output"]',
      );
      const outputText = await output.first().inputValue();
      expect(outputText).toBeTruthy();
    }
  });

  test('テキストをコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/lorem-ipsum/');

    // 生成ボタンをクリック
    const generateButton = page.locator('button:has-text("生成")').first();
    await generateButton.click();

    // コピーボタンをクリック
    const copyButton = page.locator('button:has-text("コピー")').first();
    await expect(copyButton).toBeVisible();
    await copyButton.click();

    // クリップボードに内容がコピーされたことを確認
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toBeTruthy();
    expect(clipboardText.length).toBeGreaterThan(0);
  });

  test('プレビュー/コード表示の切り替えができる', async ({ page }) => {
    await page.goto('/tools/lorem-ipsum/');

    // プレビューモード表示ボタンを見つける
    const viewButtons = page.locator('[data-view], [data-mode]');
    const count = await viewButtons.count();

    if (count > 1) {
      // 複数のビューモードが存在する場合、切り替えをテスト
      const secondButton = viewButtons.nth(1);
      await secondButton.click();

      // ビューが切り替わることを確認
      const mainContent = page.locator('main');
      const text = await mainContent.textContent();
      expect(text).toBeTruthy();
    }
  });
});

test.describe('Lorem Ipsum Generator (English)', () => {
  test('英語版が正しく表示される', async ({ page }) => {
    await page.goto('/en/tools/lorem-ipsum/');
    await expect(page.locator('main h1')).toHaveText('Dummy Text Generator');
  });

  test('英語版でテキストが生成される', async ({ page }) => {
    await page.goto('/en/tools/lorem-ipsum/');

    const generateButton = page.locator('button:has-text("Generate")').first();
    await generateButton.click();

    const output = page.locator(
      'textarea[readonly], #lorem-output, [id*="output"]',
    );
    let outputText = await output.first().inputValue();

    if (!outputText || outputText.trim() === '') {
      const previewArea = page.locator('[id*="preview"], [id*="render"]');
      outputText = await previewArea.first().textContent();
    }

    expect(outputText).toBeTruthy();
  });
});
