import { test, expect } from './helpers/test';

test.describe('点字変換ツール（日本語版）', () => {
  test('かな→点字に変換でき、点の番号が表示される', async ({ page }) => {
    await page.goto('/tools/braille-converter/');

    await expect(page.locator('main h1')).toHaveText(
      '点字変換（日本語点字・Unicode点字）',
    );

    await page.locator('#braille-converter-input').fill('さくら');
    await expect(page.locator('#braille-converter-output')).toHaveValue('⠱⠩⠑');
    await expect(page.locator('#braille-converter-dots li')).toHaveCount(3);
  });

  test('点字→かなモードに切り替えて変換できる', async ({ page }) => {
    await page.goto('/tools/braille-converter/');

    await page.locator('#braille-converter-mode [data-mode="toKana"]').click();
    await page.locator('#braille-converter-input').fill('⠐⠡⠂⠪⠉');
    await expect(page.locator('#braille-converter-output')).toHaveValue(
      'がっこう',
    );
  });

  test('変換できない文字は結果にそのまま残り、一覧で通知される', async ({
    page,
  }) => {
    await page.goto('/tools/braille-converter/');

    await page.locator('#braille-converter-input').fill('猫ねこ');
    await expect(page.locator('#braille-converter-output')).toHaveValue('猫⠏⠪');
    await expect(page.locator('#braille-converter-unsupported')).toContainText(
      '猫',
    );
  });

  test('コピーボタンで結果をクリップボードにコピーできる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/braille-converter/');

    await page.locator('#braille-converter-input').fill('ねこ');
    await page.locator('#braille-converter-copy-button').click();

    await expect(page.locator('#braille-converter-status')).toHaveText(
      'コピーしました',
    );
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toBe('⠏⠪');
  });

  test('モードを切り替えると既存の入力で再計算され、プレースホルダーも変わる', async ({
    page,
  }) => {
    await page.goto('/tools/braille-converter/');
    const input = page.locator('#braille-converter-input');
    const output = page.locator('#braille-converter-output');

    await input.fill('さくら');
    await expect(output).toHaveValue('⠱⠩⠑');
    await expect(input).toHaveAttribute(
      'placeholder',
      '点字にしたいかな文字を入力',
    );

    await page.locator('#braille-converter-mode [data-mode="toKana"]').click();
    await expect(
      page.locator('#braille-converter-mode [data-mode="toKana"]'),
    ).toHaveAttribute('aria-pressed', 'true');
    await expect(input).toHaveAttribute(
      'placeholder',
      'かなに戻したい点字を貼り付け',
    );
    // 入力がかなのままなので点字として解釈できず、そのまま残る
    await expect(output).toHaveValue('さくら');
    await expect(page.locator('#braille-converter-dots-section')).toBeHidden();
  });

  test('点字セルの点の番号が一覧に表示され、入力を空にすると結果も消える', async ({
    page,
  }) => {
    await page.goto('/tools/braille-converter/');
    const input = page.locator('#braille-converter-input');

    await input.fill('さ');
    await expect(
      page.locator('#braille-converter-dots li').first(),
    ).toContainText('点 1・5・6');

    await input.fill('');
    await expect(page.locator('#braille-converter-output')).toHaveValue('');
    await expect(page.locator('#braille-converter-dots-section')).toBeHidden();
    await expect(page.locator('#braille-converter-unsupported')).toBeHidden();
  });
});

test.describe('Japanese Braille Converter (English)', () => {
  test('英語版が正しく表示され、入力すると変換される', async ({ page }) => {
    await page.goto('/en/tools/braille-converter/');

    await expect(page.locator('main h1')).toHaveText(
      'Japanese Braille Converter (Kana ⇔ Unicode Braille)',
    );

    await page.locator('#braille-converter-input').fill('1あ');
    await expect(page.locator('#braille-converter-output')).toHaveValue('⠼⠁⠤⠁');
  });
});
