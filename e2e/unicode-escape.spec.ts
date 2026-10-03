import { test, expect } from './helpers/test';

test.describe('Unicodeエスケープ変換', () => {
  test('日本語版: 文字をJS形式にエスケープし、形式変更に追従する', async ({
    page,
  }) => {
    await page.goto('/tools/unicode-escape/');
    await expect(page.locator('main h1')).toContainText(
      'Unicodeエスケープ変換',
    );

    await page.locator('#unicode-escape-input').fill('aあ😀');
    await expect(page.locator('#unicode-escape-output')).toHaveValue(
      'a\\u3042\\ud83d\\ude00',
    );

    await page.locator('#unicode-escape-format').selectOption('es6');
    await expect(page.locator('#unicode-escape-output')).toHaveValue(
      'a\\u{3042}\\u{1f600}',
    );

    await page.locator('#unicode-escape-uppercase').check();
    await expect(page.locator('#unicode-escape-output')).toHaveValue(
      'a\\u{3042}\\u{1F600}',
    );

    await page.locator('#unicode-escape-scope').selectOption('all');
    await expect(page.locator('#unicode-escape-output')).toHaveValue(
      '\\u{61}\\u{3042}\\u{1F600}',
    );
  });

  test('エスケープ → 文字モードで元に戻り、形式の選択欄は隠れる', async ({
    page,
  }) => {
    await page.goto('/tools/unicode-escape/');
    await page.locator('#unicode-escape-mode [data-mode="unescape"]').click();
    await expect(page.locator('#unicode-escape-options')).toBeHidden();

    await page
      .locator('#unicode-escape-input')
      .fill('\\u65e5\\u672c\\u8a9e U+1F600 &#x3042;');
    await expect(page.locator('#unicode-escape-output')).toHaveValue(
      '日本語 😀 あ',
    );
  });

  test('英語版も動作する', async ({ page }) => {
    await page.goto('/en/tools/unicode-escape/');
    await expect(page.locator('main h1')).toContainText('Unicode Escape');
    await page.locator('#unicode-escape-input').fill('é');
    await expect(page.locator('#unicode-escape-output')).toHaveValue('\\u00e9');
  });
});
