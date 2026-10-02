import { test, expect } from './helpers/test';

test.describe('URLエンコード/デコードツール（日本語版）', () => {
  test('直接アクセスして正しく表示され、入力するとパーセントエンコードされる', async ({
    page,
  }) => {
    await page.goto('/tools/url-encode/');

    await expect(page.locator('main h1')).toHaveText('URLエンコード/デコード');

    // 初期状態はエンコードモード
    await expect(
      page.locator('#url-encode-mode [data-mode="encode"]'),
    ).toHaveAttribute('aria-pressed', 'true');
    await expect(
      page.locator('#url-encode-mode [data-mode="decode"]'),
    ).toHaveAttribute('aria-pressed', 'false');

    await page.locator('#url-encode-input').fill('a=1&b=2');

    await expect(page.locator('#url-encode-output')).toHaveValue(
      'a%3D1%26b%3D2',
    );
    await expect(page.locator('#url-encode-error')).toBeHidden();
  });

  test('日本語（マルチバイト文字）をエンコード・デコードできる', async ({
    page,
  }) => {
    await page.goto('/tools/url-encode/');

    await page.locator('#url-encode-input').fill('こんにちは');
    await expect(page.locator('#url-encode-output')).toHaveValue(
      '%E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF',
    );

    await page.locator('#url-encode-mode [data-mode="decode"]').click();
    await expect(
      page.locator('#url-encode-mode [data-mode="decode"]'),
    ).toHaveAttribute('aria-pressed', 'true');

    await page
      .locator('#url-encode-input')
      .fill('%E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF');
    await expect(page.locator('#url-encode-output')).toHaveValue('こんにちは');
  });

  test('入力を空にすると結果も空になる', async ({ page }) => {
    await page.goto('/tools/url-encode/');

    await page.locator('#url-encode-input').fill('hello world');
    await expect(page.locator('#url-encode-output')).toHaveValue(
      'hello%20world',
    );

    await page.locator('#url-encode-input').fill('');
    await expect(page.locator('#url-encode-output')).toHaveValue('');
    await expect(page.locator('#url-encode-error')).toBeHidden();
  });

  test('デコードモードで不正なパーセントエンコード文字列を入力すると日本語のエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/url-encode/');

    await page.locator('#url-encode-mode [data-mode="decode"]').click();
    await page.locator('#url-encode-input').fill('%zz');

    await expect(page.locator('#url-encode-error')).toBeVisible();
    await expect(page.locator('#url-encode-error')).toHaveText(
      'URLエンコード文字列として解釈できませんでした。%XX形式が正しいか確認してください。',
    );
    await expect(page.locator('#url-encode-output')).toHaveValue('');
  });

  test('エラー状態の後に正しい入力へ直すとエラー表示が消えて結果が表示される', async ({
    page,
  }) => {
    await page.goto('/tools/url-encode/');

    await page.locator('#url-encode-mode [data-mode="decode"]').click();
    await page.locator('#url-encode-input').fill('%zz');
    await expect(page.locator('#url-encode-error')).toBeVisible();

    await page.locator('#url-encode-input').fill('a%3D1');
    await expect(page.locator('#url-encode-error')).toBeHidden();
    await expect(page.locator('#url-encode-output')).toHaveValue('a=1');
  });

  test('コピーボタンで結果をクリップボードにコピーできる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/url-encode/');

    await page.locator('#url-encode-input').fill('hello world');
    await page.locator('#url-encode-copy-button').click();

    await expect(page.locator('#url-encode-status')).toHaveText(
      'コピーしました',
    );
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toBe('hello%20world');
  });
});

test.describe('URL Encoder/Decoder (English)', () => {
  test('英語版が正しく表示され、入力するとパーセントエンコードされる', async ({
    page,
  }) => {
    await page.goto('/en/tools/url-encode/');

    await expect(page.locator('main h1')).toHaveText('URL Encoder / Decoder');

    await page.locator('#url-encode-input').fill('a=1&b=2');
    await expect(page.locator('#url-encode-output')).toHaveValue(
      'a%3D1%26b%3D2',
    );
  });

  test('デコードモードで不正なパーセントエンコード文字列を入力すると英語のエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/en/tools/url-encode/');

    await page.locator('#url-encode-mode [data-mode="decode"]').click();
    await page.locator('#url-encode-input').fill('%zz');

    await expect(page.locator('#url-encode-error')).toBeVisible();
    await expect(page.locator('#url-encode-error')).toHaveText(
      'Could not decode this string as a URL-encoded value. Please check the %XX format.',
    );
    await expect(page.locator('#url-encode-output')).toHaveValue('');
  });

  test('コピーボタンで結果をクリップボードにコピーできる（英語版）', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/en/tools/url-encode/');

    await page.locator('#url-encode-input').fill('hello world');
    await page.locator('#url-encode-copy-button').click();

    await expect(page.locator('#url-encode-status')).toHaveText('Copied');
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toBe('hello%20world');
  });
});
