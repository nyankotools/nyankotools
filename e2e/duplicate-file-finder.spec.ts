import { readFileSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

const file = (name: string, body: string) => ({
  name,
  mimeType: 'text/plain',
  buffer: Buffer.from(body),
});

const files = [
  file('a.txt', 'hello world'),
  file('b.txt', 'hello world'),
  file('c.txt', 'hello there!'),
  file('d.txt', 'hello world'),
];

test.describe('重複ファイル検出（日本語版）', () => {
  test('同じ中身のファイルがグループ化され、無駄な容量が表示される', async ({
    page,
  }) => {
    await page.goto('/tools/duplicate-file-finder/');
    await expect(page.locator('main h1')).toContainText('重複ファイル検出');

    await page.locator('#dff-file-input').setInputFiles(files);

    await expect(page.locator('#dff-summary')).toContainText(
      '重複 1グループ（3ファイル）',
    );
    const items = page.locator('#dff-results li');
    await expect(items).toHaveCount(3);
    await expect(page.locator('#dff-results')).not.toContainText('c.txt');
    await expect(page.locator('#dff-results h2')).toContainText('22 B');
  });

  test('重複が無いと見つからない旨を表示し、クリアで消える', async ({
    page,
  }) => {
    await page.goto('/tools/duplicate-file-finder/');
    await page
      .locator('#dff-file-input')
      .setInputFiles([file('x.txt', 'one'), file('y.txt', 'two')]);
    await expect(page.locator('#dff-summary')).toContainText(
      '重複しているファイルは見つかりませんでした',
    );
    await expect(page.locator('#dff-csv-button')).toBeDisabled();

    await page.locator('#dff-clear-button').click();
    await expect(page.locator('#dff-summary')).toBeHidden();
  });

  test('CSVをダウンロードできる', async ({ page }) => {
    await page.goto('/tools/duplicate-file-finder/');
    await page.locator('#dff-file-input').setInputFiles(files);
    await expect(page.locator('#dff-csv-button')).toBeEnabled();
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#dff-csv-button').click(),
    ]);
    expect(download.suggestedFilename()).toBe('duplicate-files.csv');
    // Excelで文字化けしないようBOM（EF BB BF）付きで保存される
    const bytes = readFileSync((await download.path())!);
    expect(bytes.subarray(0, 3)).toEqual(Buffer.from([0xef, 0xbb, 0xbf]));
    expect(bytes.toString('utf8', 3)).toContain('a.txt');
  });
});

test.describe('Duplicate File Finder (English)', () => {
  test('英語版で重複が検出される', async ({ page }) => {
    await page.goto('/en/tools/duplicate-file-finder/');
    await expect(page.locator('main h1')).toContainText(
      'Duplicate File Finder',
    );
    await page.locator('#dff-file-input').setInputFiles(files);
    await expect(page.locator('#dff-summary')).toContainText(
      'Duplicate groups: 1 (3 files)',
    );
  });

  test('ja/en ともに初期表示と結果表示でaxeの違反がない', async ({ page }) => {
    for (const path of [
      '/tools/duplicate-file-finder/',
      '/en/tools/duplicate-file-finder/',
    ]) {
      await page.goto(path);
      const check = async () =>
        (
          await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze()
        ).violations.map((v) => v.id);
      expect(await check(), path).toEqual([]);
      await page.locator('#dff-file-input').setInputFiles(files);
      await expect(page.locator('#dff-results li').first()).toBeVisible();
      expect(await check(), path).toEqual([]);
    }
  });
});
