import { test, expect } from '@playwright/test';

test.describe('Base64エンコード/デコードツール（日本語版）', () => {
  test('直接アクセスして正しく表示され、入力するとBase64にエンコードされる', async ({
    page,
  }) => {
    await page.goto('/tools/base64/');

    await expect(page.locator('main h1')).toHaveText(
      'Base64エンコード/デコード',
    );

    // 初期状態はエンコードモード
    await expect(
      page.locator('#base64-mode [data-mode="encode"]'),
    ).toHaveAttribute('aria-pressed', 'true');
    await expect(
      page.locator('#base64-mode [data-mode="decode"]'),
    ).toHaveAttribute('aria-pressed', 'false');

    await page.locator('#base64-input').fill('hello');

    await expect(page.locator('#base64-output')).toHaveValue('aGVsbG8=');
    await expect(page.locator('#base64-error')).toBeHidden();
  });

  test('デコードモードに切り替えるとBase64文字列を元のテキストに戻せる', async ({
    page,
  }) => {
    await page.goto('/tools/base64/');

    await page.locator('#base64-mode [data-mode="decode"]').click();

    await expect(
      page.locator('#base64-mode [data-mode="decode"]'),
    ).toHaveAttribute('aria-pressed', 'true');
    await expect(
      page.locator('#base64-mode [data-mode="encode"]'),
    ).toHaveAttribute('aria-pressed', 'false');

    await page.locator('#base64-input').fill('aGVsbG8=');

    await expect(page.locator('#base64-output')).toHaveValue('hello');
  });

  test('日本語（マルチバイト文字）をエンコード・デコードできる', async ({
    page,
  }) => {
    await page.goto('/tools/base64/');

    await page.locator('#base64-input').fill('こんにちは');
    await expect(page.locator('#base64-output')).toHaveValue(
      '44GT44KT44Gr44Gh44Gv',
    );

    await page.locator('#base64-mode [data-mode="decode"]').click();
    await page.locator('#base64-input').fill('44GT44KT44Gr44Gh44Gv');
    await expect(page.locator('#base64-output')).toHaveValue('こんにちは');
  });

  test('入力を空にすると結果も空になる', async ({ page }) => {
    await page.goto('/tools/base64/');

    await page.locator('#base64-input').fill('hello');
    await expect(page.locator('#base64-output')).toHaveValue('aGVsbG8=');

    await page.locator('#base64-input').fill('');
    await expect(page.locator('#base64-output')).toHaveValue('');
    await expect(page.locator('#base64-error')).toBeHidden();
  });

  test('デコードモードで不正なBase64文字列を入力すると日本語のエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/base64/');

    await page.locator('#base64-mode [data-mode="decode"]').click();
    await page.locator('#base64-input').fill('not-valid-base64!!');

    await expect(page.locator('#base64-error')).toBeVisible();
    await expect(page.locator('#base64-error')).toHaveText(
      'Base64として解釈できませんでした。文字列が正しいBase64形式か確認してください。',
    );
    await expect(page.locator('#base64-output')).toHaveValue('');
  });

  test('コピーボタンで結果をクリップボードにコピーできる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/base64/');

    await page.locator('#base64-input').fill('hello');
    await page.locator('#base64-copy-button').click();

    await expect(page.locator('#base64-status')).toHaveText('コピーしました');
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toBe('aGVsbG8=');
  });
});

test.describe('Base64 Encoder/Decoder (English)', () => {
  test('英語版が正しく表示され、入力するとBase64にエンコードされる', async ({
    page,
  }) => {
    await page.goto('/en/tools/base64/');

    await expect(page.locator('main h1')).toHaveText(
      'Base64 Encoder / Decoder',
    );

    await page.locator('#base64-input').fill('hello');
    await expect(page.locator('#base64-output')).toHaveValue('aGVsbG8=');
  });

  test('デコードモードに切り替えるとBase64文字列を元のテキストに戻せる（英語版）', async ({
    page,
  }) => {
    await page.goto('/en/tools/base64/');

    await page.locator('#base64-mode [data-mode="decode"]').click();
    await expect(
      page.locator('#base64-mode [data-mode="decode"]'),
    ).toHaveAttribute('aria-pressed', 'true');

    await page.locator('#base64-input').fill('aGVsbG8=');
    await expect(page.locator('#base64-output')).toHaveValue('hello');
  });

  test('デコードモードで不正なBase64文字列を入力すると英語のエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/en/tools/base64/');

    await page.locator('#base64-mode [data-mode="decode"]').click();
    await page.locator('#base64-input').fill('not-valid-base64!!');

    await expect(page.locator('#base64-error')).toBeVisible();
    await expect(page.locator('#base64-error')).toHaveText(
      'Could not decode this string as Base64. Please check the format.',
    );
    await expect(page.locator('#base64-output')).toHaveValue('');
  });

  test('コピーボタンで結果をクリップボードにコピーできる（英語版）', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/en/tools/base64/');

    await page.locator('#base64-input').fill('hello');
    await page.locator('#base64-copy-button').click();

    await expect(page.locator('#base64-status')).toHaveText('Copied');
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toBe('aGVsbG8=');
  });
});
