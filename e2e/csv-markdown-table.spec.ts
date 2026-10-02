import { test, expect } from './helpers/test';

test.describe('CSV/TSV→Markdownテーブル変換（日本語版）', () => {
  test('CSVをMarkdownテーブルに変換する', async ({ page }) => {
    await page.goto('/tools/csv-markdown-table/');

    await expect(page.locator('main h1')).toHaveText(
      'CSV/TSV→Markdownテーブル変換ツール',
    );

    await page.locator('#csv-markdown-table-input').fill('a,b\n1,2');

    await expect(page.locator('#csv-markdown-table-output')).toHaveValue(
      '| a   | b   |\n| --- | --- |\n| 1   | 2   |',
    );
    await expect(page.locator('#csv-markdown-table-error')).toBeHidden();
  });

  test('TSVの自動判定と配置・整形オプションが効く', async ({ page }) => {
    await page.goto('/tools/csv-markdown-table/');

    await page.locator('#csv-markdown-table-input').fill('a\tb\n1\t2');
    await page.locator('#csv-markdown-table-align').selectOption('right');
    await page.locator('#csv-markdown-table-pad').uncheck();

    await expect(page.locator('#csv-markdown-table-output')).toHaveValue(
      '| a | b |\n| --: | --: |\n| 1 | 2 |',
    );
  });

  test('閉じていない引用符はエラーを表示する', async ({ page }) => {
    await page.goto('/tools/csv-markdown-table/');

    await page.locator('#csv-markdown-table-input').fill('a,"b');

    await expect(page.locator('#csv-markdown-table-error')).toContainText(
      'ダブルクォートが閉じられていません',
    );
    await expect(page.locator('#csv-markdown-table-output')).toHaveValue('');
  });
});

test.describe('CSV/TSV to Markdown Table Converter (English)', () => {
  test('英語版で変換でき、エラーも英語で表示される', async ({ page }) => {
    await page.goto('/en/tools/csv-markdown-table/');

    await expect(page.locator('main h1')).toHaveText(
      'CSV/TSV to Markdown Table Converter',
    );

    await page.locator('#csv-markdown-table-input').fill('x,y\n1,2');
    await expect(page.locator('#csv-markdown-table-output')).toHaveValue(
      '| x   | y   |\n| --- | --- |\n| 1   | 2   |',
    );

    await page.locator('#csv-markdown-table-input').fill('a,"b');
    await expect(page.locator('#csv-markdown-table-error')).toContainText(
      'not closed',
    );
  });
});
