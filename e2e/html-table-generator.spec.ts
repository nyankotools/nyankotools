import { test, expect } from './helpers/test';

const output = '#html-table-generator-output';

test.describe('HTMLテーブル生成（日本語版）', () => {
  test('セルを入力するとHTMLとプレビューに反映される', async ({ page }) => {
    await page.goto('/tools/html-table-generator/');

    await page.getByLabel('見出し 1', { exact: true }).fill('名前');
    await page.getByLabel('セル 2-1').fill('<b>田中</b> & 佐藤');

    const value = await page.locator(output).inputValue();
    expect(value).toContain('<th scope="col">名前</th>');
    expect(value).toContain('&lt;b&gt;田中&lt;/b&gt; &amp; 佐藤');
    // タグとして解釈されない
    await expect(
      page.locator('#html-table-generator-preview table td b'),
    ).toHaveCount(0);
    await expect(
      page.locator('#html-table-generator-preview th').first(),
    ).toHaveText('名前');
  });

  test('セルを結合・解除できる', async ({ page }) => {
    await page.goto('/tools/html-table-generator/');

    await page.locator('#html-table-generator-row-from').fill('2');
    await page.locator('#html-table-generator-row-to').fill('3');
    await page.locator('#html-table-generator-column-from').fill('1');
    await page.locator('#html-table-generator-column-to').fill('2');
    await page.getByRole('button', { name: 'セルを結合' }).click();
    await expect(page.locator(output)).toHaveValue(
      /<td colspan="2" rowspan="2">/,
    );

    await page.getByRole('button', { name: '結合を解除' }).click();
    await expect(page.locator(output)).not.toHaveValue(/colspan=/);
  });

  test('行数・列数を変えると表が変わる', async ({ page }) => {
    await page.goto('/tools/html-table-generator/');
    await page.locator('#html-table-generator-rows').fill('2');
    await page.locator('#html-table-generator-columns').fill('2');
    const value = await page.locator(output).inputValue();
    expect(value.match(/<tr>/g)).toHaveLength(2);
    expect(value.match(/<t[hd][ >]/g)).toHaveLength(4);
  });

  test('インラインスタイルに切り替えるとstyleタグが消える', async ({
    page,
  }) => {
    await page.goto('/tools/html-table-generator/');
    await expect(page.locator(output)).toHaveValue(/<style>/);
    await page.locator('#html-table-generator-mode').selectOption('inline');
    const value = await page.locator(output).inputValue();
    expect(value).not.toContain('<style>');
    expect(value).toContain('style="');
  });

  test('タブ区切りの貼り付けから表を作れる', async ({ page }) => {
    await page.goto('/tools/html-table-generator/');
    await page.locator('#html-table-generator-import').fill('a\tb\nc\td');
    await page.getByRole('button', { name: '表に読み込む' }).click();
    await expect(page.locator('#html-table-generator-rows')).toHaveValue('2');
    await expect(page.locator(output)).toHaveValue(/<td>d<\/td>/);
  });
});

test.describe('HTML Table Generator (English)', () => {
  test('英語版で表示され、出力ができる', async ({ page }) => {
    await page.goto('/en/tools/html-table-generator/');

    await expect(page.locator('main h1')).toHaveText('HTML Table Generator');
    await page.getByLabel('Cell 2-1').fill('x');
    await expect(page.locator(output)).toHaveValue(/<td>x<\/td>/);
  });
});
