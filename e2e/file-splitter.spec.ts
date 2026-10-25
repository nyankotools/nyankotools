import { readFileSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

const content = Buffer.from('0123456789abcdefghij');

test.describe('ファイル分割・結合（日本語版）', () => {
  test('分割して、パーツを結合すると元に戻る', async ({ page }) => {
    await page.goto('/tools/file-splitter/');
    await expect(page.locator('main h1')).toHaveText('ファイル分割・結合');
    await expect(page.locator('#fs-split-button')).toBeDisabled();

    await page.locator('#fs-split-input').setInputFiles({
      name: 'data.bin',
      mimeType: 'application/octet-stream',
      buffer: content,
    });
    await page.locator('#fs-unit').selectOption('KB');
    await page.locator('#fs-size').fill('0.01');
    // 0.01KB = 10バイト → 2パーツ
    await expect(page.locator('#fs-preview')).toContainText('2個のパーツ');
    await page.locator('#fs-split-button').click();
    await expect(page.locator('#fs-parts li')).toHaveCount(2);

    const [first] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: '保存: data.bin.001' }).click(),
    ]);
    expect(first.suggestedFilename()).toBe('data.bin.001');
    const firstPath = (await first.path())!;
    const [second] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: '保存: data.bin.002' }).click(),
    ]);
    const secondPath = (await second.path())!;
    expect(readFileSync(firstPath, 'utf8')).toBe('0123456789');

    await page.getByRole('button', { name: 'パーツを結合' }).click();
    // 一時ファイル名は連番でないため、名前付きで渡す
    await page.locator('#fs-merge-input').setInputFiles([
      {
        name: 'data.bin.002',
        mimeType: 'application/octet-stream',
        buffer: readFileSync(secondPath),
      },
      {
        name: 'data.bin.001',
        mimeType: 'application/octet-stream',
        buffer: readFileSync(firstPath),
      },
    ]);
    await expect(page.locator('#fs-merge-list li').first()).toContainText(
      'data.bin.001',
    );
    await expect(page.locator('#fs-merge-name')).toHaveValue('data.bin');
    const [merged] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#fs-merge-button').click(),
    ]);
    expect(merged.suggestedFilename()).toBe('data.bin');
    expect(readFileSync((await merged.path())!)).toEqual(content);
  });

  test('欠番があると結合できず、不足番号が表示される', async ({ page }) => {
    await page.goto('/tools/file-splitter/');
    await page.getByRole('button', { name: 'パーツを結合' }).click();
    await page.locator('#fs-merge-input').setInputFiles([
      {
        name: 'a.zip.001',
        mimeType: 'application/octet-stream',
        buffer: Buffer.from('a'),
      },
      {
        name: 'a.zip.003',
        mimeType: 'application/octet-stream',
        buffer: Buffer.from('c'),
      },
    ]);
    await expect(page.locator('#fs-issues')).toContainText('2');
    await expect(page.locator('#fs-merge-button')).toBeDisabled();
  });
});

test.describe('File Splitter & Joiner (English)', () => {
  test('shows the part count preview', async ({ page }) => {
    await page.goto('/en/tools/file-splitter/');
    await expect(page.locator('main h1')).toHaveText('File Splitter & Joiner');
    await page.locator('#fs-split-input').setInputFiles({
      name: 'big.dat',
      mimeType: 'application/octet-stream',
      buffer: Buffer.alloc(3 * 1024),
    });
    await page.locator('#fs-unit').selectOption('KB');
    await page.locator('#fs-size').fill('1');
    await expect(page.locator('#fs-preview')).toContainText('3 parts');
    await expect(page.locator('#fs-split-button')).toBeEnabled();
  });

  test('ja/en ともに初期表示と分割後の表示でaxeの違反がない', async ({
    page,
  }) => {
    for (const path of ['/tools/file-splitter/', '/en/tools/file-splitter/']) {
      await page.goto(path);
      const check = async () =>
        (
          await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze()
        ).violations.map((v) => v.id);
      expect(await check(), path).toEqual([]);
      await page.locator('#fs-split-input').setInputFiles({
        name: 'a.bin',
        mimeType: 'application/octet-stream',
        buffer: Buffer.alloc(3 * 1024),
      });
      await page.locator('#fs-unit').selectOption('KB');
      await page.locator('#fs-size').fill('1');
      await expect(page.locator('#fs-split-button')).toBeEnabled();
      await page.locator('#fs-split-button').click();
      await expect(page.locator('#fs-parts li')).toHaveCount(3);
      expect(await check(), path).toEqual([]);
    }
  });
});
