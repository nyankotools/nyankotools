import { test, expect } from './helpers/test';

const html =
  '<table><tr><th>Name</th><th>Note</th></tr>' +
  '<tr><td>A</td><td>x,y</td></tr>' +
  '<tr><td colspan="2">wide</td></tr></table>';

test.describe('HTMLテーブル→CSV変換（日本語版）', () => {
  test('HTMLのtableをCSVに変換し、結合セルを展開する', async ({ page }) => {
    await page.goto('/tools/html-table-to-csv/');

    await expect(page.locator('main h1')).toHaveText(
      'HTMLテーブル→CSV変換ツール',
    );

    await page.locator('#html-table-to-csv-input').fill(html);

    await expect(page.locator('#html-table-to-csv-output')).toHaveValue(
      'Name,Note\nA,"x,y"\nwide,\n',
    );

    await page.locator('#html-table-to-csv-repeat').check();
    await expect(page.locator('#html-table-to-csv-output')).toHaveValue(
      'Name,Note\nA,"x,y"\nwide,wide\n',
    );
  });

  test('区切り文字をタブに切り替えられる', async ({ page }) => {
    await page.goto('/tools/html-table-to-csv/');

    await page.locator('#html-table-to-csv-input').fill(html);
    await page.locator('#html-table-to-csv-delimiter').selectOption('\t');

    await expect(page.locator('#html-table-to-csv-output')).toHaveValue(
      'Name\tNote\nA\tx,y\nwide\t\n',
    );
  });

  test('複数の表から選べる', async ({ page }) => {
    await page.goto('/tools/html-table-to-csv/');

    await page
      .locator('#html-table-to-csv-input')
      .fill(
        '<table><tr><td>1</td></tr></table><table><tr><td>a</td><td>b</td></tr></table>',
      );
    await expect(page.locator('#html-table-to-csv-table-row')).toBeVisible();
    await expect(page.locator('#html-table-to-csv-output')).toHaveValue('1\n');

    await page.locator('#html-table-to-csv-table').selectOption('1');
    await expect(page.locator('#html-table-to-csv-output')).toHaveValue(
      'a,b\n',
    );
  });

  test('tableがなければエラーを表示する', async ({ page }) => {
    await page.goto('/tools/html-table-to-csv/');

    await page.locator('#html-table-to-csv-input').fill('<p>no table</p>');

    await expect(page.locator('#html-table-to-csv-error')).toContainText(
      '<table> が見つかりません',
    );
  });

  test('CSVをダウンロードできる（BOMつき）', async ({ page }) => {
    await page.goto('/tools/html-table-to-csv/');

    await page.locator('#html-table-to-csv-input').fill(html);
    await page.locator('#html-table-to-csv-bom').check();

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#html-table-to-csv-download-button').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('table.csv');
  });

  test('セル内のp/div/liの後ろに空白が挿入される', async ({ page }) => {
    await page.goto('/tools/html-table-to-csv/');

    const complexHtml =
      '<table><tr><td><p>paragraph</p><p>text</p></td><td><div>div1</div><div>div2</div></td></tr></table>';
    await page.locator('#html-table-to-csv-input').fill(complexHtml);

    // p要素とdiv要素の後ろに空白が追加されるため、"paragraph text" と "div1 div2" になる
    await expect(page.locator('#html-table-to-csv-output')).toHaveValue(
      'paragraph text,div1 div2\n',
    );
  });

  test('セル内のscript/styleタグが除去される', async ({ page }) => {
    await page.goto('/tools/html-table-to-csv/');

    const htmlWithScriptStyle =
      '<table><tr><td><script>alert("x")</script>text1</td><td><style>.x{}</style>text2</td></tr></table>';
    await page.locator('#html-table-to-csv-input').fill(htmlWithScriptStyle);

    await expect(page.locator('#html-table-to-csv-output')).toHaveValue(
      'text1,text2\n',
    );
  });
});

test.describe('HTML Table to CSV Converter (English)', () => {
  test('英語版で変換でき、エラーも英語で表示される', async ({ page }) => {
    await page.goto('/en/tools/html-table-to-csv/');

    await expect(page.locator('main h1')).toHaveText(
      'HTML Table to CSV Converter',
    );

    await page
      .locator('#html-table-to-csv-input')
      .fill('<table><tr><td>a</td><td>b</td></tr></table>');
    await expect(page.locator('#html-table-to-csv-output')).toHaveValue(
      'a,b\n',
    );

    await page.locator('#html-table-to-csv-input').fill('plain');
    await expect(page.locator('#html-table-to-csv-error')).toContainText(
      'No <table> found',
    );
  });
});
