import { test, expect } from './helpers/test';

test.describe('コード文字列エスケープ（日本語版）', () => {
  test('初期状態はシェルのエスケープで、単一引用符で囲まれる', async ({
    page,
  }) => {
    await page.goto('/tools/code-string-escaper/');

    await page.locator('#code-string-escaper-input').fill("it's $HOME");
    await expect(page.locator('#code-string-escaper-output')).toHaveValue(
      "'it'\\''s $HOME'",
    );
  });

  test('言語を切り替えて変換できる', async ({ page }) => {
    await page.goto('/tools/code-string-escaper/');

    await page.locator('#code-string-escaper-input').fill("O'Reilly");
    await page.locator('#code-string-escaper-language').selectOption('sql');
    await expect(page.locator('#code-string-escaper-output')).toHaveValue(
      "O''Reilly",
    );

    await page.locator('#code-string-escaper-language').selectOption('json');
    await page.locator('#code-string-escaper-input').fill('a"b');
    await expect(page.locator('#code-string-escaper-output')).toHaveValue(
      'a\\"b',
    );
  });

  test('アンエスケープでき、不正な入力ではエラーが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/code-string-escaper/');

    await page
      .locator('#code-string-escaper-direction [data-direction="unescape"]')
      .click();
    await page.locator('#code-string-escaper-language').selectOption('json');
    await page.locator('#code-string-escaper-input').fill('a\\nb');
    await expect(page.locator('#code-string-escaper-output')).toHaveValue(
      'a\nb',
    );

    await page.locator('#code-string-escaper-input').fill('a\\qb');
    await expect(page.locator('#code-string-escaper-error')).toBeVisible();
    await expect(page.locator('#code-string-escaper-output')).toHaveValue('');
  });

  test('コピーボタンで結果をコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/code-string-escaper/');

    await page.locator('#code-string-escaper-language').selectOption('regex');
    await page.locator('#code-string-escaper-input').fill('a.b');
    await page.locator('#code-string-escaper-copy-button').click();
    await expect(page.locator('#code-string-escaper-status')).toHaveText(
      'コピーしました',
    );
    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text).toBe('a\\.b');
  });
});

test.describe('Code string escaper (English)', () => {
  test('英語版で変換でき、コピーのメッセージが英語になる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/en/tools/code-string-escaper/');

    await page.locator('#code-string-escaper-language').selectOption('csv');
    await page.locator('#code-string-escaper-input').fill('a,b');
    await expect(page.locator('#code-string-escaper-output')).toHaveValue(
      '"a,b"',
    );
    await page.locator('#code-string-escaper-copy-button').click();
    await expect(page.locator('#code-string-escaper-status')).toHaveText(
      'Copied',
    );
  });
});
