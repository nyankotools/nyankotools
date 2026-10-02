import { test, expect } from './helpers/test';

test.describe('JSON整形ツール（日本語版）', () => {
  test('直接アクセスして正しく表示され、入力するとJSONが整形される', async ({
    page,
  }) => {
    await page.goto('/tools/json-formatter/');

    await expect(page.locator('main h1')).toHaveText('JSON整形・検証ツール');

    await page.locator('#json-formatter-input').fill('{"b":2,"a":1}');

    await expect(page.locator('#json-formatter-output')).toHaveValue(
      '{\n  "b": 2,\n  "a": 1\n}',
    );
  });

  test('不正なJSONを入力するとエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/json-formatter/');

    await page.locator('#json-formatter-input').fill('{invalid}');

    await expect(page.locator('#json-formatter-error')).toBeVisible();
    await expect(page.locator('#json-formatter-output')).toHaveValue('');
  });

  test('構文エラーの種類に応じた補足説明が表示される', async ({ page }) => {
    await page.goto('/tools/json-formatter/');
    const input = page.locator('#json-formatter-input');
    const errorEl = page.locator('#json-formatter-error');

    // Unexpected end of JSON input
    await input.fill('[1,2,');
    await expect(errorEl).toContainText('構文エラー: Unexpected end of');
    await expect(errorEl).toContainText('入力が途中で終わっています');

    // Unexpected non-whitespace character after JSON
    await input.fill('{"a":1}{"b":2}');
    await expect(errorEl).toContainText('Unexpected non-whitespace character');
    await expect(errorEl).toContainText('JSONの末尾に余分な文字があります');

    // Expected double-quoted property name (末尾カンマ)
    await input.fill('{"a":1,}');
    await expect(errorEl).toContainText('Expected double-quoted property name');
    await expect(errorEl).toContainText(
      'プロパティ名はダブルクォート(")で囲む必要があります',
    );

    // Unterminated string
    await input.fill('"abc');
    await expect(errorEl).toContainText('Unterminated string');
    await expect(errorEl).toContainText('文字列が閉じられていません');

    // Bad control character
    await input.fill('{"a":"\u0007"}');
    await expect(errorEl).toContainText('Bad control character');
    await expect(errorEl).toContainText('使用できない制御文字が含まれています');

    // Unexpected token（末尾の余分なカンマ・閉じ忘れ等のフォールバック）
    await input.fill('}');
    await expect(errorEl).toContainText('Unexpected token');
    await expect(errorEl).toContainText('予期しない記号があります');
  });

  test('圧縮ボタンで整形されたJSONを1行に圧縮できる', async ({ page }) => {
    await page.goto('/tools/json-formatter/');

    await page
      .locator('#json-formatter-input')
      .fill('{\n  "a": 1,\n  "b": [1, 2, 3]\n}');
    await page.locator('#json-formatter-minify-button').click();

    await expect(page.locator('#json-formatter-output')).toHaveValue(
      '{"a":1,"b":[1,2,3]}',
    );
  });

  test('コピーボタンで結果をクリップボードにコピーできる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/json-formatter/');

    await page.locator('#json-formatter-input').fill('{"a":1}');
    await page.locator('#json-formatter-copy-button').click();

    await expect(page.locator('#json-formatter-status')).toHaveText(
      'コピーしました',
    );
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    // Windows環境ではOSのクリップボードがLFをCRLFに正規化することがあるため、
    // 改行コードの違いを吸収した上で内容を比較する
    expect(clipboardText.replace(/\r\n/g, '\n')).toBe('{\n  "a": 1\n}');
  });

  test('用語解説セクションが表示される', async ({ page }) => {
    await page.goto('/tools/json-formatter/');

    await expect(
      page.getByRole('heading', { level: 2, name: '用語解説' }),
    ).toBeVisible();
    await expect(page.getByText('JSON', { exact: true })).toBeVisible();
  });
});

test.describe('JSON Formatter (English)', () => {
  test('英語版が正しく表示され、入力するとJSONが整形される', async ({
    page,
  }) => {
    await page.goto('/en/tools/json-formatter/');

    await expect(page.locator('main h1')).toHaveText(
      'JSON Formatter & Validator',
    );

    await page.locator('#json-formatter-input').fill('{"b":2,"a":1}');

    await expect(page.locator('#json-formatter-output')).toHaveValue(
      '{\n  "b": 2,\n  "a": 1\n}',
    );
  });

  test('不正なJSONを入力すると英語のエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/en/tools/json-formatter/');

    await page.locator('#json-formatter-input').fill('{invalid}');

    await expect(page.locator('#json-formatter-error')).toContainText(
      'Syntax error:',
    );
  });

  test('コピーボタンで結果をクリップボードにコピーでき、英語のメッセージが表示される', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/en/tools/json-formatter/');

    await page.locator('#json-formatter-input').fill('{"a":1}');
    await page.locator('#json-formatter-copy-button').click();

    await expect(page.locator('#json-formatter-status')).toHaveText('Copied');
  });

  test('英語版はエラー種別ごとの英語の補足説明を表示する', async ({ page }) => {
    await page.goto('/en/tools/json-formatter/');
    const input = page.locator('#json-formatter-input');
    const errorEl = page.locator('#json-formatter-error');

    for (const broken of ['[1,2,', '{"a":1}{"b":2}', '{"a":1,}', '"abc', '}']) {
      await input.fill(broken);
      await expect(errorEl).toHaveText(/^Syntax error: [^\n]+\n\(Hint: /);
      // ja版の日本語の補足説明（内容: …）が混ざらないこと
      await expect(errorEl).not.toContainText('（内容:');
    }
  });

  test('用語解説（Glossary）セクションが英語で表示される', async ({ page }) => {
    await page.goto('/en/tools/json-formatter/');

    await expect(
      page.getByRole('heading', { level: 2, name: 'Glossary' }),
    ).toBeVisible();
  });
});
