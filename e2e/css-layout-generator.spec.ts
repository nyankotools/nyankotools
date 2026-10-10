import { test, expect } from './helpers/test';

test.describe('CSS Flexbox/Gridジェネレーター', () => {
  test('初期状態でFlexboxのCSSが生成される', async ({ page }) => {
    await page.goto('/tools/css-layout-generator/');
    await expect(page.locator('#cl-css-output')).toHaveValue(
      [
        '.container {',
        '  display: flex;',
        '  flex-direction: row;',
        '  flex-wrap: nowrap;',
        '  justify-content: flex-start;',
        '  align-items: stretch;',
        '  gap: 8px;',
        '}',
      ].join('\n'),
    );
    await expect(page.locator('#cl-preview > div')).toHaveCount(6);
  });

  test('justify-contentを変更するとCSSとプレビューに反映される', async ({
    page,
  }) => {
    await page.goto('/tools/css-layout-generator/');
    await page.locator('#cl-justify-content').selectOption('space-between');
    await expect(page.locator('#cl-css-output')).toHaveValue(
      /justify-content: space-between;/,
    );
    await expect(page.locator('#cl-preview')).toHaveCSS(
      'justify-content',
      'space-between',
    );
  });

  test('折り返しを有効にするとalign-contentが出力される', async ({ page }) => {
    await page.goto('/tools/css-layout-generator/');
    await expect(page.locator('#cl-css-output')).not.toHaveValue(
      /align-content/,
    );
    await expect(page.locator('#cl-align-content-field')).toBeHidden();
    await page.locator('#cl-wrap').selectOption('wrap');
    await expect(page.locator('#cl-css-output')).toHaveValue(/align-content/);
    await expect(page.locator('#cl-align-content-field')).toBeVisible();
  });

  test('Gridに切り替えて列数を変更できる', async ({ page }) => {
    await page.goto('/tools/css-layout-generator/');
    await page.locator('#cl-mode').selectOption('grid');
    await expect(page.locator('#cl-grid-options')).toBeVisible();
    await expect(page.locator('#cl-flex-options')).toBeHidden();
    await page.locator('#cl-columns').fill('4');
    await expect(page.locator('#cl-css-output')).toHaveValue(
      /grid-template-columns: repeat\(4, 1fr\);/,
    );
    await expect(page.locator('#cl-preview')).toHaveCSS('display', 'grid');
  });

  test('アイテム数を変更するとプレビューの要素数が変わり、範囲外は補正される', async ({
    page,
  }) => {
    await page.goto('/tools/css-layout-generator/');
    await page.locator('#cl-items').fill('3');
    await expect(page.locator('#cl-preview > div')).toHaveCount(3);
    await page.locator('#cl-items').fill('99');
    await page.locator('#cl-items').blur();
    await expect(page.locator('#cl-items')).toHaveValue('24');
    await expect(page.locator('#cl-preview > div')).toHaveCount(24);
  });

  test('Gridの列数を空欄にした間はCSSを更新せず、確定時に1へ補正される', async ({
    page,
  }) => {
    await page.goto('/tools/css-layout-generator/');
    await page.locator('#cl-mode').selectOption('grid');
    await page.locator('#cl-columns').fill('');
    await expect(page.locator('#cl-css-output')).toHaveValue(
      /grid-template-columns: repeat\(3, 1fr\);/,
    );
    await page.locator('#cl-columns').blur();
    await expect(page.locator('#cl-columns')).toHaveValue('1');
    await expect(page.locator('#cl-css-output')).toHaveValue(
      /grid-template-columns: repeat\(1, 1fr\);/,
    );
  });

  test('Gridの列数・行数の範囲外は12に補正され、行数0では行を出力しない', async ({
    page,
  }) => {
    await page.goto('/tools/css-layout-generator/');
    await page.locator('#cl-mode').selectOption('grid');
    await page.locator('#cl-columns').fill('99');
    await page.locator('#cl-columns').blur();
    await expect(page.locator('#cl-columns')).toHaveValue('12');
    await expect(page.locator('#cl-css-output')).toHaveValue(
      /grid-template-columns: repeat\(12, 1fr\);/,
    );
    await expect(page.locator('#cl-css-output')).not.toHaveValue(
      /grid-template-rows/,
    );
    await page.locator('#cl-rows').fill('2');
    await expect(page.locator('#cl-css-output')).toHaveValue(
      /grid-template-rows: repeat\(2, 1fr\);/,
    );
    await page.locator('#cl-rows').fill('-5');
    await page.locator('#cl-rows').blur();
    await expect(page.locator('#cl-rows')).toHaveValue('0');
    await expect(page.locator('#cl-css-output')).not.toHaveValue(
      /grid-template-rows/,
    );
  });

  test('Gridの行間・列間を変えるとgapが2値で出力される', async ({ page }) => {
    await page.goto('/tools/css-layout-generator/');
    await page.locator('#cl-mode').selectOption('grid');
    await page.locator('#cl-row-gap').fill('4');
    await page.locator('#cl-column-gap').fill('16');
    await expect(page.locator('#cl-css-output')).toHaveValue(/gap: 4px 16px;/);
  });

  test('Gridの設定はsessionStorageに保存され、開き直すと復元される', async ({
    page,
  }) => {
    await page.goto('/tools/css-layout-generator/');
    await page.locator('#cl-mode').selectOption('grid');
    await page.locator('#cl-columns').fill('5');
    await expect(page.locator('#cl-css-output')).toHaveValue(
      /repeat\(5, 1fr\)/,
    );
    // 同一URLへの遷移・reload() はブラウザのフォーム値復元が効くため、
    // 別ページを挟んで開き直し、sessionStorage からの復元そのものを確認する
    await page.goto('/');
    await page.goto('/tools/css-layout-generator/');
    await expect(page.locator('#cl-mode')).toHaveValue('grid');
    await expect(page.locator('#cl-grid-options')).toBeVisible();
    await expect(page.locator('#cl-flex-options')).toBeHidden();
    await expect(page.locator('#cl-columns')).toHaveValue('5');
    await expect(page.locator('#cl-css-output')).toHaveValue(
      /grid-template-columns: repeat\(5, 1fr\);/,
    );
    await expect(page.locator('#cl-preview')).toHaveCSS('display', 'grid');
  });

  test('コピーできる', async ({ page }) => {
    await page
      .context()
      .grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/css-layout-generator/');
    await page.locator('#cl-copy-button').click();
    await expect(page.locator('#cl-status')).toHaveText('コピーしました');
  });

  test('英語版が表示される', async ({ page }) => {
    await page.goto('/en/tools/css-layout-generator/');
    await expect(page.locator('main h1')).toHaveText(
      'CSS Flexbox & Grid Layout Generator',
    );
    await expect(page.locator('#cl-css-output')).toHaveValue(/display: flex;/);
  });
});
