import { readFileSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { unzipSync } from 'fflate';
import { test, expect } from './helpers/test';

const files = [
  { name: 'b.TXT', mimeType: 'text/plain', buffer: Buffer.from('bbb') },
  { name: 'a.TXT', mimeType: 'text/plain', buffer: Buffer.from('aaa') },
];

test.describe('ファイル名一括変更（日本語版）', () => {
  test('連番と拡張子の小文字化をプレビューし、ZIPに変更後の名前で保存できる', async ({
    page,
  }) => {
    await page.goto('/tools/bulk-file-renamer/');
    await expect(page.locator('main h1')).toHaveText('ファイル名一括変更');
    await expect(page.locator('#br-zip-button')).toBeDisabled();

    await page.locator('#br-input').setInputFiles(files);
    await page.locator('#br-num-enable').check();
    await page.locator('#br-num-position').selectOption('replace');
    await page.locator('#br-ext-mode').selectOption('lower');
    await expect(page.locator('#br-rows tr')).toHaveCount(2);
    await expect(page.locator('#br-rows tr').first()).toContainText('001.txt');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#br-zip-button').click(),
    ]);
    expect(download.suggestedFilename()).toBe('renamed.zip');
    const zip = unzipSync(
      new Uint8Array(readFileSync((await download.path())!)),
    );
    expect(Object.keys(zip).sort()).toEqual(['001.txt', '002.txt']);
    expect(Buffer.from(zip['001.txt']).toString()).toBe('bbb');
  });

  test('名前が重複すると警告が出て保存できない', async ({ page }) => {
    await page.goto('/tools/bulk-file-renamer/');
    await page.locator('#br-input').setInputFiles(files);
    await page.locator('#br-find').fill('a');
    await page.locator('#br-replace').fill('b');
    await page.locator('#br-ignore-case').check();
    await expect(page.locator('#br-error')).toBeVisible();
    await expect(page.locator('#br-zip-button')).toBeDisabled();
  });

  test('禁止文字は _ に置き換えて警告のみ。ZIPにもその名前で入る', async ({
    page,
  }) => {
    await page.goto('/tools/bulk-file-renamer/');
    await page.locator('#br-input').setInputFiles({
      name: 'a?b.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('zzz'),
    });
    await expect(page.locator('#br-rows tr').first()).toContainText('a_b.txt');
    await expect(page.locator('#br-rows tr').first()).toContainText(
      '使えない文字',
    );
    // 警告のみ（ブロックしない）なので保存できる
    await expect(page.locator('#br-zip-button')).toBeEnabled();
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#br-zip-button').click(),
    ]);
    const zip = unzipSync(
      new Uint8Array(readFileSync((await download.path())!)),
    );
    expect(Object.keys(zip)).toEqual(['a_b.txt']);
  });

  test('上限（5000個）を超えると警告が出て保存できない', async ({ page }) => {
    await page.goto('/tools/bulk-file-renamer/');
    const many = Array.from({ length: 5001 }, (_, i) => ({
      name: `f${i}.txt`,
      mimeType: 'text/plain',
      buffer: Buffer.from('x'),
    }));
    await page.locator('#br-input').setInputFiles(many);
    await expect(page.locator('#br-error')).toContainText('5000');
    await expect(page.locator('#br-zip-button')).toBeDisabled();
  });
});

test.describe('Bulk File Renamer (English)', () => {
  test('shows the preview and reports an invalid regex', async ({ page }) => {
    await page.goto('/en/tools/bulk-file-renamer/');
    await expect(page.locator('main h1')).toHaveText('Bulk File Renamer');
    await page.locator('#br-input').setInputFiles(files);
    await page.locator('#br-prefix').fill('x_');
    await expect(page.locator('#br-rows tr').first()).toContainText('x_b.TXT');
    await page.locator('#br-regex').check();
    await page.locator('#br-find').fill('(');
    await expect(page.locator('#br-error')).toContainText('not valid');
  });

  test('ja/en ともにaxeの違反がない', async ({ page }) => {
    for (const path of [
      '/tools/bulk-file-renamer/',
      '/en/tools/bulk-file-renamer/',
    ]) {
      await page.goto(path);
      await page.locator('#br-input').setInputFiles(files);
      await expect(page.locator('#br-rows tr')).toHaveCount(2);
      const violations = (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze()
      ).violations.map((v) => v.id);
      expect(violations, path).toEqual([]);
    }
  });
});
