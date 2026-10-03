import { test, expect } from './helpers/test';

const sample = 'こん\u200Bにち\u200Bは\uFEFF\u200D!';

test.describe('ゼロ幅文字の検出・除去', () => {
  test('日本語版: 検出して除去し、ゼロ幅接合子は初期設定では残す', async ({
    page,
  }) => {
    await page.goto('/tools/zero-width-char-remover/');
    await expect(page.locator('main h1')).toHaveText(
      'ゼロ幅文字の検出・除去ツール',
    );
    await expect(page.locator('#zwr-summary')).toHaveText(
      '見えない文字は見つかりませんでした',
    );

    await page.locator('#zwr-input').fill(sample);
    await expect(page.locator('#zwr-summary')).toHaveText(
      '見えない文字を4個検出しました（3個を除去）',
    );
    await expect(page.locator('#zwr-output')).toHaveValue('こんにちは\u200D!');
    await expect(page.locator('#zwr-visualized')).toHaveValue(
      'こん[U+200B]にち[U+200B]は[U+FEFF][U+200D]!',
    );
    await expect(page.locator('#zwr-findings-body tr')).toHaveCount(3);
    await expect(page.locator('#zwr-findings-body')).toContainText(
      'ゼロ幅スペース',
    );
  });

  test('ゼロ幅接合子にチェックすると除去される', async ({ page }) => {
    await page.goto('/tools/zero-width-char-remover/');
    await page.locator('#zwr-input').fill(sample);
    await page.locator('#zwr-group-joiner').check();
    await expect(page.locator('#zwr-output')).toHaveValue('こんにちは!');
    await expect(page.locator('#zwr-summary')).toContainText('（4個を除去）');

    await page.locator('#zwr-group-zeroWidth').uncheck();
    await expect(page.locator('#zwr-output')).toHaveValue(
      'こん\u200Bにち\u200Bは\uFEFF!',
    );
  });

  test('英語版も動作する', async ({ page }) => {
    await page.goto('/en/tools/zero-width-char-remover/');
    await expect(page.locator('main h1')).toContainText('Zero-Width');
    await page.locator('#zwr-input').fill('a\u200Bb');
    await expect(page.locator('#zwr-summary')).toHaveText(
      'Found 1 invisible characters (1 removed)',
    );
    await expect(page.locator('#zwr-output')).toHaveValue('ab');
  });
});
