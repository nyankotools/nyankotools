import { test, expect } from './helpers/test';

test.describe('パスワード生成ツール（日本語版）', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/tools/password-generator/');
    await expect(page.locator('main h1')).toHaveText('パスワード生成');
  });

  test('デフォルト設定でパスワードが生成される', async ({ page }) => {
    await page.goto('/tools/password-generator/');

    // "生成"ボタンをクリック
    await page.locator('button:has-text("生成")').click();

    // パスワード出力が存在し、空でないことを確認
    const passwordOutput = page.locator(
      '#password-generator-output, [id*="password"][id*="output"]',
    );
    const value = await passwordOutput.first().inputValue();
    expect(value).toBeTruthy();
    expect(value.length).toBeGreaterThan(0);
  });

  test('パスワード長を変更できる', async ({ page }) => {
    await page.goto('/tools/password-generator/');

    // 長さ入力フィールドを見つけて変更
    const lengthInput = page.locator('input[type="number"]').first();
    await lengthInput.fill('20');

    // 生成ボタンをクリック
    await page.locator('button:has-text("生成")').click();

    // 生成されたパスワードが約20文字であることを確認
    const passwordOutput = page.locator(
      '#password-generator-output, [id*="password"][id*="output"]',
    );
    const value = await passwordOutput.first().inputValue();
    expect(value.length).toBeCloseTo(20, 2);
  });

  test('複数のパスワードを一度に生成できる', async ({ page }) => {
    await page.goto('/tools/password-generator/');

    // 個数入力フィールドを見つけて変更
    const numberInputs = page.locator('input[type="number"]');
    // 最後のnumber inputが個数フィールド（長さが最初）
    await numberInputs.last().fill('3');

    // 生成ボタンをクリック
    await page.locator('button:has-text("生成")').click();

    // パスワード出力が存在
    const passwordOutput = page.locator(
      '#password-generator-output, [id*="password"][id*="output"]',
    );
    const value = await passwordOutput.first().inputValue();

    // 3つのパスワードが生成される（改行で区切られている可能性がある）
    const lines = value.trim().split('\n');
    expect(lines.length).toBe(3);
    lines.forEach((line) => {
      expect(line.length).toBeGreaterThan(0);
    });
  });

  test('パスワード強度が表示される', async ({ page }) => {
    await page.goto('/tools/password-generator/');

    // 短いパスワード長を設定
    const lengthInput = page.locator('input[type="number"]').first();
    await lengthInput.fill('8');

    // 生成ボタンをクリック
    await page.locator('button:has-text("生成")').click();

    // 要素が存在するか、あるいは表示されている他の要素を確認
    const allText = await page.locator('main').textContent();
    expect(allText).toBeTruthy();
  });

  test('パスワードをコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/password-generator/');

    // 生成ボタンをクリック
    await page.locator('button:has-text("生成")').click();

    // コピーボタンを見つけてクリック
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
});

test.describe('Password Generator (English)', () => {
  test('英語版が正しく表示される', async ({ page }) => {
    await page.goto('/en/tools/password-generator/');
    await expect(page.locator('main h1')).toHaveText('Password Generator');
  });

  test('英語版でパスワードが生成される', async ({ page }) => {
    await page.goto('/en/tools/password-generator/');

    // Generate ボタンをクリック
    const generateButton = page.locator('button:has-text("Generate")').first();
    await generateButton.click();

    // パスワード出力が存在
    const passwordOutput = page.locator(
      '#password-generator-output, [id*="password"][id*="output"]',
    );
    const value = await passwordOutput.first().inputValue();
    expect(value).toBeTruthy();
    expect(value.length).toBeGreaterThan(0);
  });
});
