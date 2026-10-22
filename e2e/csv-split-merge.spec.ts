import { readFileSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { unzipSync } from 'fflate';
import { test, expect } from './helpers/test';

const csv = (text: string, name = 'sample.csv') => ({
  name,
  mimeType: 'text/csv',
  buffer: Buffer.from(text, 'utf-8'),
});

/** BOM（既定で付く）を外して文字列にする */
const decodeText = (bytes: Uint8Array) => {
  const text = Buffer.from(bytes).toString('utf-8');
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
};

test.describe('CSV分割・結合・重複削除（日本語版）', () => {
  test('分割するとZIPがダウンロードされる', async ({ page }) => {
    await page.goto('/tools/csv-split-merge/');
    await page
      .locator('#csv-split-merge-split-file')
      .setInputFiles(csv('id,v\n1,a\n2,b\n3,c\n4,d\n5,e'));
    await page.locator('#csv-split-merge-split-value').fill('2');
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#csv-split-merge-split-button').click(),
    ]);
    expect(download.suggestedFilename()).toBe('sample_split.zip');
    // 行数指定2: 見出し付きで 2・2・1 行に分かれ、各ファイルに見出しが付く
    const entries = unzipSync(
      new Uint8Array(readFileSync((await download.path())!)),
    );
    expect(Object.keys(entries).sort()).toEqual([
      'sample_01.csv',
      'sample_02.csv',
      'sample_03.csv',
    ]);
    expect(decodeText(entries['sample_01.csv'])).toBe('id,v\n1,a\n2,b\n');
    expect(decodeText(entries['sample_02.csv'])).toBe('id,v\n3,c\n4,d\n');
    expect(decodeText(entries['sample_03.csv'])).toBe('id,v\n5,e\n');
    await expect(page.locator('#csv-split-merge-status')).toHaveText(
      '5 行を 3 個のファイルに分割しました。',
    );
  });

  test('結合は見出しが違うとエラー、検証オフなら結合できる', async ({
    page,
  }) => {
    await page.goto('/tools/csv-split-merge/');
    await page.getByRole('button', { name: '結合', exact: true }).click();
    await page
      .locator('#csv-split-merge-merge-file')
      .setInputFiles([
        csv('id,name\n1,A', 'a.csv'),
        csv('id,title\n2,B', 'b.csv'),
      ]);
    await page.locator('#csv-split-merge-merge-button').click();
    await expect(page.locator('#csv-split-merge-error')).toContainText('b.csv');

    await page.locator('#csv-split-merge-validate-header').uncheck();
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#csv-split-merge-merge-button').click(),
    ]);
    expect(download.suggestedFilename()).toBe('a_merged.csv');
    // 検証オフのときは2つ目の見出しもデータ行として残る
    expect(decodeText(readFileSync((await download.path())!))).toBe(
      'id,name\n1,A\nid,title\n2,B\n',
    );
    await expect(page.locator('#csv-split-merge-status')).toHaveText(
      '2 個のファイルを結合しました（3 行）。',
    );
  });

  test('初期表示でaxeのWCAG 2.1 A/AA違反がない（ja/en）', async ({ page }) => {
    for (const path of [
      '/tools/csv-split-merge/',
      '/en/tools/csv-split-merge/',
    ]) {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(
        results.violations.map((v) => v.id),
        path,
      ).toEqual([]);
    }
  });

  test('キー列で重複を削除してダウンロードできる', async ({ page }) => {
    await page.goto('/tools/csv-split-merge/');
    await page.getByRole('button', { name: '重複削除', exact: true }).click();
    await page
      .locator('#csv-split-merge-dedupe-file')
      .setInputFiles(csv('id,name\n1,A\n2,B\n1,C', 'd.csv'));
    await page.getByLabel('id', { exact: true }).check();
    await page.locator('#csv-split-merge-bom').uncheck();
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#csv-split-merge-dedupe-button').click(),
    ]);
    expect(download.suggestedFilename()).toBe('d_dedupe.csv');
    const path = await download.path();
    expect(readFileSync(path, 'utf-8')).toBe('id,name\n1,A\n2,B\n');
    await expect(page.locator('#csv-split-merge-status')).toHaveText(
      '1 行を削除しました（残り 2 行）。',
    );
  });

  test('ファイル未選択はエラーになる', async ({ page }) => {
    await page.goto('/tools/csv-split-merge/');
    await page.locator('#csv-split-merge-split-button').click();
    await expect(page.locator('#csv-split-merge-error')).toBeVisible();
  });
});

test.describe('CSV Split, Merge and Remove Duplicates (English)', () => {
  test('renders and splits', async ({ page }) => {
    await page.goto('/en/tools/csv-split-merge/');
    await expect(page.locator('main h1')).toHaveText(
      'CSV Split, Merge and Remove Duplicates',
    );
    await page
      .locator('#csv-split-merge-split-file')
      .setInputFiles(csv('id\n1\n2\n3'));
    await page.locator('#csv-split-merge-split-by').selectOption('parts');
    await page.locator('#csv-split-merge-split-value').fill('2');
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#csv-split-merge-split-button').click(),
    ]);
    expect(download.suggestedFilename()).toBe('sample_split.zip');
    const entries = unzipSync(
      new Uint8Array(readFileSync((await download.path())!)),
    );
    expect(decodeText(entries['sample_01.csv'])).toBe('id\n1\n2\n');
    expect(decodeText(entries['sample_02.csv'])).toBe('id\n3\n');
    await expect(page.locator('#csv-split-merge-status')).toHaveText(
      'Split 3 rows into 2 files.',
    );
  });
});
