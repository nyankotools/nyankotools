import { test, expect } from './helpers/test';

test.describe('改行⇔カンマ・区切り文字変換（日本語版）', () => {
  test('改行区切りがカンマ区切りに変換され、項目数が表示される', async ({
    page,
  }) => {
    await page.goto('/tools/delimiter-converter/');

    await page.locator('#dc-input').fill('a\nb\n\nc');

    await expect(page.locator('#dc-output')).toHaveValue('a,b,c');
    await expect(page.locator('#dc-count')).toHaveText('3項目');
  });

  test('出力区切り・引用符・重複除去を組み合わせられる', async ({ page }) => {
    await page.goto('/tools/delimiter-converter/');

    await page.locator('#dc-input').fill('a\nb\na');
    await page.locator('#dc-output-delimiter').selectOption('commaSpace');
    await page.locator('#dc-quote').selectOption('single');
    await page.locator('#dc-dedupe').check();

    await expect(page.locator('#dc-output')).toHaveValue("'a', 'b'");
  });

  test('任意の文字列を区切りに指定でき、入出力の入れ替えができる', async ({
    page,
  }) => {
    await page.goto('/tools/delimiter-converter/');

    await page.locator('#dc-input').fill('a,b');
    await page.locator('#dc-input-delimiter').selectOption('comma');
    await page.locator('#dc-output-delimiter').selectOption('custom');
    await page.locator('#dc-output-custom').fill(' / ');
    await expect(page.locator('#dc-output')).toHaveValue('a / b');

    await page.locator('#dc-swap-button').click();
    await expect(page.locator('#dc-input-delimiter')).toHaveValue('custom');
    await expect(page.locator('#dc-output-delimiter')).toHaveValue('comma');
  });

  test('コピーボタンで結果をコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/delimiter-converter/');

    await page.locator('#dc-input').fill('a\nb');
    await page.locator('#dc-copy-button').click();

    await expect(page.locator('#dc-status')).toHaveText('コピーしました');
    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text).toBe('a,b');
  });
});

test.describe('Newline to Comma & Delimiter Converter (English)', () => {
  test('英語版が表示され、変換結果と英語の件数表記が出る', async ({ page }) => {
    await page.goto('/en/tools/delimiter-converter/');

    await expect(page.locator('main h1')).toHaveText(
      'Newline to Comma & Delimiter Converter',
    );
    await page.locator('#dc-input').fill('a\nb');
    await expect(page.locator('#dc-output')).toHaveValue('a,b');
    await expect(page.locator('#dc-count')).toHaveText('2 items');
  });
});

test.describe('改行⇔カンマ・区切り文字変換（追加）', () => {
  test('入力と設定は再読み込みで復元される', async ({ page }) => {
    await page.goto('/tools/delimiter-converter/');
    await page.locator('#dc-input').fill('x\ny');
    await page.locator('#dc-output-delimiter').selectOption('semicolon');
    await expect
      .poll(() =>
        page.evaluate(() =>
          sessionStorage.getItem('nyanko:input:delimiter-converter'),
        ),
      )
      .toContain('x');
    await page.reload();
    await expect(page.locator('#dc-input')).toHaveValue('x\ny');
    await expect(page.locator('#dc-output-delimiter')).toHaveValue('semicolon');
    await expect(page.locator('#dc-output')).toHaveValue('x;y');
  });
});
