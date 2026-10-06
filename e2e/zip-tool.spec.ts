import { readFileSync } from 'node:fs';
import { test, expect } from './helpers/test';

const files = [
  { name: 'hello.txt', mimeType: 'text/plain', buffer: Buffer.from('hello') },
  {
    name: 'メモ.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('こんにちは'),
  },
];

test.describe('ZIP作成・解凍（日本語版）', () => {
  test('ファイルを追加してZIPを作成し、そのZIPを開いて中身を取り出せる', async ({
    page,
  }) => {
    await page.goto('/tools/zip-tool/');
    await expect(page.locator('main h1')).toHaveText('ZIP作成・解凍');
    await expect(page.locator('#zip-create-button')).toBeDisabled();

    await page.locator('#zip-create-input').setInputFiles(files);
    await expect(page.locator('#zip-file-list li')).toHaveCount(2);
    await expect(page.locator('#zip-create-button')).toBeEnabled();

    await page.locator('#zip-name').fill('sample');
    const [created] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#zip-create-button').click(),
    ]);
    expect(created.suggestedFilename()).toBe('sample.zip');
    await expect(page.locator('#zip-status')).toContainText('2個のファイル');
    const zipPath = await created.path();

    await page.getByRole('button', { name: 'ZIPを開く' }).click();
    await page.locator('#zip-extract-input').setInputFiles(zipPath);
    await expect(page.locator('#zip-entries tr')).toHaveCount(2);
    await expect(page.locator('#zip-entries')).toContainText('メモ.txt');

    const [extracted] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: '保存: hello.txt' }).click(),
    ]);
    expect(extracted.suggestedFilename()).toBe('hello.txt');
    expect(readFileSync((await extracted.path())!, 'utf8')).toBe('hello');
  });

  test('追加したファイルを個別に削除・全削除できる', async ({ page }) => {
    await page.goto('/tools/zip-tool/');
    await page.locator('#zip-create-input').setInputFiles(files);
    await page.getByRole('button', { name: '削除: hello.txt' }).click();
    await expect(page.locator('#zip-file-list li')).toHaveCount(1);

    await page.locator('#zip-clear').click();
    await expect(page.locator('#zip-file-list li')).toHaveCount(0);
    await expect(page.locator('#zip-empty')).toBeVisible();
    await expect(page.locator('#zip-create-button')).toBeDisabled();
  });

  test('ZIPでないファイルを開くとエラーが表示される', async ({ page }) => {
    await page.goto('/tools/zip-tool/');
    await page.getByRole('button', { name: 'ZIPを開く' }).click();
    await page.locator('#zip-extract-input').setInputFiles({
      name: 'fake.zip',
      mimeType: 'application/zip',
      buffer: Buffer.from('this is not a zip file'),
    });
    await expect(page.locator('#zip-error')).toContainText(
      'ZIPファイルとして読み込めませんでした',
    );
    await expect(page.locator('#zip-entries-wrap')).toBeHidden();
  });
});

test.describe('ZIP Maker & Extractor (English)', () => {
  test('creates a ZIP and lists its contents', async ({ page }) => {
    await page.goto('/en/tools/zip-tool/');
    await expect(page.locator('main h1')).toHaveText('ZIP Maker & Extractor');
    await page.locator('#zip-create-input').setInputFiles(files[0]);
    const [created] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#zip-create-button').click(),
    ]);
    expect(created.suggestedFilename()).toBe('archive.zip');

    await page.getByRole('button', { name: 'Open a ZIP' }).click();
    await page
      .locator('#zip-extract-input')
      .setInputFiles((await created.path())!);
    await expect(page.locator('#zip-entries')).toContainText('hello.txt');
    await expect(page.locator('#zip-entries-summary')).toContainText('1 files');
  });
});
