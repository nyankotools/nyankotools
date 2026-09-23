import { test, expect } from '@playwright/test';

test.describe('全角/半角変換ツール（日本語版）', () => {
  test('直接アクセスして正しく表示され、初期状態は全角→半角変換', async ({
    page,
  }) => {
    await page.goto('/tools/zenkaku-hankaku/');

    await expect(page.locator('main h1')).toHaveText('全角/半角変換');

    await expect(
      page.locator('#zenkaku-hankaku-mode [data-mode="toHalf"]'),
    ).toHaveAttribute('aria-pressed', 'true');
    await expect(
      page.locator('#zenkaku-hankaku-mode [data-mode="toFull"]'),
    ).toHaveAttribute('aria-pressed', 'false');

    // デフォルトはすべての文字種にチェックが入っている
    for (const option of ['alphanumeric', 'symbol', 'katakana', 'space']) {
      await expect(page.locator(`[data-option="${option}"]`)).toBeChecked();
    }

    await page.locator('#zenkaku-hankaku-input').fill('ＡＢＣ１２３！カナ　');
    await expect(page.locator('#zenkaku-hankaku-output')).toHaveValue(
      'ABC123!ｶﾅ ',
    );
  });

  test('半角→全角モードに切り替えて変換できる', async ({ page }) => {
    await page.goto('/tools/zenkaku-hankaku/');

    await page.locator('#zenkaku-hankaku-mode [data-mode="toFull"]').click();
    await expect(
      page.locator('#zenkaku-hankaku-mode [data-mode="toFull"]'),
    ).toHaveAttribute('aria-pressed', 'true');

    await page.locator('#zenkaku-hankaku-input').fill('ABC123!ｶﾅ ');
    await expect(page.locator('#zenkaku-hankaku-output')).toHaveValue(
      'ＡＢＣ１２３！カナ　',
    );
  });

  test('文字種チェックボックスを外すとその文字種だけ変換対象から除外される', async ({
    page,
  }) => {
    await page.goto('/tools/zenkaku-hankaku/');

    // カタカナのみ変換対象から外す
    await page.locator('[data-option="katakana"]').uncheck();

    await page.locator('#zenkaku-hankaku-input').fill('ＡＢＣカナ');
    await expect(page.locator('#zenkaku-hankaku-output')).toHaveValue(
      'ABCカナ',
    );
  });

  test('濁点・半濁点を含む全角カタカナを半角に正しく変換する', async ({
    page,
  }) => {
    await page.goto('/tools/zenkaku-hankaku/');

    await page.locator('#zenkaku-hankaku-input').fill('ガギグゲゴパピプペポ');
    await expect(page.locator('#zenkaku-hankaku-output')).toHaveValue(
      'ｶﾞｷﾞｸﾞｹﾞｺﾞﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟ',
    );
  });

  test('入力を空にすると結果も空になる', async ({ page }) => {
    await page.goto('/tools/zenkaku-hankaku/');

    await page.locator('#zenkaku-hankaku-input').fill('ＡＢＣ');
    await expect(page.locator('#zenkaku-hankaku-output')).toHaveValue('ABC');

    await page.locator('#zenkaku-hankaku-input').fill('');
    await expect(page.locator('#zenkaku-hankaku-output')).toHaveValue('');
  });

  test('コピーボタンで結果をクリップボードにコピーできる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/zenkaku-hankaku/');

    await page.locator('#zenkaku-hankaku-input').fill('ＡＢＣ');
    await page.locator('#zenkaku-hankaku-copy-button').click();

    await expect(page.locator('#zenkaku-hankaku-status')).toHaveText(
      'コピーしました',
    );
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toBe('ABC');
  });
});

test.describe('Full-width / Half-width Converter (English)', () => {
  test('英語版が正しく表示され、入力すると変換される', async ({ page }) => {
    await page.goto('/en/tools/zenkaku-hankaku/');

    await expect(page.locator('main h1')).toHaveText(
      'Full-width / Half-width Converter',
    );

    await page.locator('#zenkaku-hankaku-input').fill('ＡＢＣ１２３');
    await expect(page.locator('#zenkaku-hankaku-output')).toHaveValue('ABC123');
  });

  test('コピーボタンで結果をクリップボードにコピーでき、英語のメッセージが表示される', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/en/tools/zenkaku-hankaku/');

    await page.locator('#zenkaku-hankaku-input').fill('ＡＢＣ');
    await page.locator('#zenkaku-hankaku-copy-button').click();

    await expect(page.locator('#zenkaku-hankaku-status')).toHaveText('Copied');
  });
});
