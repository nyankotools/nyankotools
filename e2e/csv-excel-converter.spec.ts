import { readFile } from 'node:fs/promises';
import { test, expect } from './helpers/test';
import { csvToXlsx, openXlsx } from '../src/lib/tools/csv-excel-converter';

for (const [locale, base] of [
  ['ja', '/tools/csv-excel-converter/'],
  ['en', '/en/tools/csv-excel-converter/'],
] as const) {
  test.describe(`CSV⇔Excel変換 (${locale})`, () => {
    test('貼り付けたCSVをxlsxに変換して保存できる', async ({ page }) => {
      await page.goto(base);
      await page.locator('#cx-csv-text').fill('name,zip\n山田,0123\n"a,b",5\n');
      await page.locator('#cx-sheet-name').fill('Data');
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.locator('#cx-convert-button').click(),
      ]);
      expect(download.suggestedFilename()).toBe('output.xlsx');
      const bytes = new Uint8Array(await readFile((await download.path())!));
      const workbook = openXlsx(bytes);
      expect(workbook.sheetNames).toEqual(['Data']);
      expect(workbook.readSheet(0)).toEqual([
        ['name', 'zip'],
        ['山田', '0123'],
        ['a,b', '5'],
      ]);
      await expect(page.locator('#cx-xlsx-status')).toContainText(
        'output.xlsx',
      );
    });

    test('Shift_JISのCSVファイルを文字化けせずxlsxにできる', async ({
      page,
    }) => {
      await page.goto(base);
      // 「名前」を Shift_JIS で書いた1列のCSV
      await page.locator('#cx-csv-file').setInputFiles({
        name: 'sjis.csv',
        mimeType: 'text/csv',
        buffer: Buffer.from([0x96, 0xbc, 0x91, 0x4f, 0x0a, 0x41]),
      });
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.locator('#cx-convert-button').click(),
      ]);
      expect(download.suggestedFilename()).toBe('sjis.xlsx');
      const bytes = new Uint8Array(await readFile((await download.path())!));
      expect(openXlsx(bytes).readSheet(0)).toEqual([['名前'], ['A']]);
    });

    test('入力が空なら変換せずエラーを表示する', async ({ page }) => {
      await page.goto(base);
      await page.locator('#cx-convert-button').click();
      await expect(page.locator('#cx-error')).toBeVisible();
    });

    test('xlsxをCSVに変換でき、区切り文字・BOMを切り替えて保存できる', async ({
      page,
    }) => {
      await page.goto(base);
      await page.locator('#cx-mode [data-mode="toCsv"]').click();
      await expect(page.locator('#cx-panel-csv')).toBeVisible();
      const { bytes } = csvToXlsx('a,b\n1,"x,y"\n');
      await page.locator('#cx-xlsx-file').setInputFiles({
        name: 'book.xlsx',
        mimeType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        buffer: Buffer.from(bytes),
      });
      await expect(page.locator('#cx-output')).toHaveValue('a,b\n1,"x,y"\n');
      await page.locator('#cx-csv-delimiter').selectOption('tab');
      await expect(page.locator('#cx-output')).toHaveValue('a\tb\n1\tx,y\n');
      await page.locator('#cx-bom').check();
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.locator('#cx-download-button').click(),
      ]);
      expect(download.suggestedFilename()).toBe('book.tsv');
      const saved = await readFile((await download.path())!);
      expect(saved.subarray(0, 3)).toEqual(Buffer.from([0xef, 0xbb, 0xbf]));
    });

    test('xlsxではないファイルはエラーを表示する', async ({ page }) => {
      await page.goto(base);
      await page.locator('#cx-mode [data-mode="toCsv"]').click();
      await page.locator('#cx-xlsx-file').setInputFiles({
        name: 'fake.xlsx',
        mimeType: 'text/plain',
        buffer: Buffer.from('a,b\n1,2'),
      });
      await expect(page.locator('#cx-error')).toBeVisible();
      await expect(page.locator('#cx-csv-options')).toBeHidden();
    });
  });
}
