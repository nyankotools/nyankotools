import { test, expect } from '@playwright/test';

test.describe('ひらがな/カタカナ変換ツール（日本語版）', () => {
  test('直接アクセスして正しく表示され、初期状態はひらがな→カタカナ変換', async ({
    page,
  }) => {
    await page.goto('/tools/kana-converter/');

    await expect(page.locator('main h1')).toHaveText('ひらがな/カタカナ変換');

    await expect(
      page.locator('#kana-converter-mode [data-mode="toKatakana"]'),
    ).toHaveAttribute('aria-pressed', 'true');

    await page.locator('#kana-converter-input').fill('こんにちは');
    await expect(page.locator('#kana-converter-output')).toHaveValue(
      'コンニチハ',
    );
  });

  test('カタカナ→ひらがなモードに切り替えて変換できる', async ({ page }) => {
    await page.goto('/tools/kana-converter/');

    await page.locator('#kana-converter-mode [data-mode="toHiragana"]').click();
    await expect(
      page.locator('#kana-converter-mode [data-mode="toHiragana"]'),
    ).toHaveAttribute('aria-pressed', 'true');

    await page.locator('#kana-converter-input').fill('コンニチハ');
    await expect(page.locator('#kana-converter-output')).toHaveValue(
      'こんにちは',
    );
  });

  test('濁音・半濁音・拗音・促音・踊り字を含む文字列を変換できる', async ({
    page,
  }) => {
    await page.goto('/tools/kana-converter/');

    await page.locator('#kana-converter-input').fill('がぱっしゃゝ');
    await expect(page.locator('#kana-converter-output')).toHaveValue(
      'ガパッシャヽ',
    );
  });

  test('漢字や英数字などかな以外の文字はそのまま維持される', async ({
    page,
  }) => {
    await page.goto('/tools/kana-converter/');

    await page.locator('#kana-converter-input').fill('猫Cat123ねこ');
    await expect(page.locator('#kana-converter-output')).toHaveValue(
      '猫Cat123ネコ',
    );
  });

  test('入力を空にすると結果も空になる', async ({ page }) => {
    await page.goto('/tools/kana-converter/');

    await page.locator('#kana-converter-input').fill('ねこ');
    await expect(page.locator('#kana-converter-output')).toHaveValue('ネコ');

    await page.locator('#kana-converter-input').fill('');
    await expect(page.locator('#kana-converter-output')).toHaveValue('');
  });

  test('コピーボタンで結果をクリップボードにコピーできる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/kana-converter/');

    await page.locator('#kana-converter-input').fill('ねこ');
    await page.locator('#kana-converter-copy-button').click();

    await expect(page.locator('#kana-converter-status')).toHaveText(
      'コピーしました',
    );
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toBe('ネコ');
  });

  test('サイドバーからツールページへ遷移できる', async ({ page }) => {
    await page.goto('/');

    const link = page.locator('#sidebar a[href="/tools/kana-converter/"]');
    await link.locator('xpath=ancestor::details[1]/summary').click();
    await link.click();

    await expect(page).toHaveURL(/\/tools\/kana-converter\/?$/);
    await expect(page.locator('main h1')).toHaveText('ひらがな/カタカナ変換');
  });

  test('375px幅でも横スクロールが発生しない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/tools/kana-converter/');

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
});

test.describe('Hiragana / Katakana Converter (English)', () => {
  test('英語版が正しく表示され、入力すると変換される', async ({ page }) => {
    await page.goto('/en/tools/kana-converter/');

    await expect(page.locator('main h1')).toHaveText(
      'Hiragana / Katakana Converter for Japanese Learners',
    );

    await page.locator('#kana-converter-input').fill('こんにちは');
    await expect(page.locator('#kana-converter-output')).toHaveValue(
      'コンニチハ',
    );
  });

  test('コピーボタンで結果をクリップボードにコピーでき、英語のメッセージが表示される', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/en/tools/kana-converter/');

    await page.locator('#kana-converter-input').fill('ねこ');
    await page.locator('#kana-converter-copy-button').click();

    await expect(page.locator('#kana-converter-status')).toHaveText('Copied');
  });

  test('サイドバーからツールページへ遷移できる（英語版）', async ({ page }) => {
    await page.goto('/en/');

    const link = page.locator('#sidebar a[href="/en/tools/kana-converter/"]');
    await link.locator('xpath=ancestor::details[1]/summary').click();
    await link.click();

    await expect(page).toHaveURL(/\/en\/tools\/kana-converter\/?$/);
    await expect(page.locator('main h1')).toHaveText(
      'Hiragana / Katakana Converter for Japanese Learners',
    );
  });

  test('375px幅でも横スクロールが発生しない（英語版）', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/en/tools/kana-converter/');

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
});
