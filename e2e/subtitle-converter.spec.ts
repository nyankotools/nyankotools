import { readFileSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

const PATH = '/tools/subtitle-converter/';

const SRT = `1
00:00:01,000 --> 00:00:03,500
こんにちは

2
00:01:05,250 --> 00:01:08,000
二つ目
`;

test.describe('subtitle-converter', () => {
  test('貼り付けたSRTをVTTに変換し、時間をずらせる', async ({ page }) => {
    await page.goto(PATH);
    await expect(page.locator('#sub-download-button')).toBeDisabled();
    await page.locator('#sub-input').fill(SRT);
    await expect(page.locator('#sub-output')).toHaveValue(
      /^WEBVTT\n\n00:00:01\.000 --> 00:00:03\.500\nこんにちは/,
    );
    await page.locator('#sub-offset').fill('1.5');
    await expect(page.locator('#sub-output')).toHaveValue(
      /00:00:02\.500 --> 00:00:05\.000/,
    );
    await page.locator('#sub-format').selectOption('srt');
    await expect(page.locator('#sub-output')).toHaveValue(
      /^1\n00:00:02,500 --> 00:00:05,000\n/,
    );
  });

  test('Shift_JISのファイルを自動判定して読み込み、VTTをダウンロードできる', async ({
    page,
  }) => {
    await page.goto(PATH);
    // 「こんにちは」をShift_JISで書いたSRT
    const head = Buffer.from('1\n00:00:01,000 --> 00:00:02,000\n', 'ascii');
    const body = Buffer.from([
      0x82, 0xb1, 0x82, 0xf1, 0x82, 0xc9, 0x82, 0xbf, 0x82, 0xcd, 0x0a,
    ]);
    await page.locator('#sub-file-input').setInputFiles({
      name: 'movie.srt',
      mimeType: 'application/x-subrip',
      buffer: Buffer.concat([head, body]),
    });
    await expect(page.locator('#sub-input')).toHaveValue(/こんにちは/);
    await expect(page.locator('#sub-format')).toHaveValue('vtt');

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#sub-download-button').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('movie.vtt');
    const text = readFileSync(await download.path(), 'utf-8');
    expect(text.startsWith('WEBVTT')).toBe(true);
    expect(text).toContain('こんにちは');
  });

  test('不正な時間とフレームレートの片方指定はエラーになる', async ({
    page,
  }) => {
    await page.goto(PATH);
    await page.locator('#sub-input').fill(SRT);
    await page.locator('#sub-offset').fill('abc');
    await expect(page.locator('#sub-error')).toBeVisible();
    await expect(page.locator('#sub-output')).toHaveValue('');

    await page.locator('#sub-offset').fill('0');
    await page.locator('#sub-fps-from').selectOption('25');
    await expect(page.locator('#sub-error')).toBeVisible();
    await page.locator('#sub-fps-to').selectOption('24');
    await expect(page.locator('#sub-error')).toBeHidden();
    await expect(page.locator('#sub-output')).toHaveValue(/WEBVTT/);
  });

  test('字幕でないテキストはエラーになる', async ({ page }) => {
    await page.goto(PATH);
    await page.locator('#sub-input').fill('ただの文章です');
    await expect(page.locator('#sub-error')).toBeVisible();
    await expect(page.locator('#sub-copy-button')).toBeDisabled();
  });

  test('en ページが表示できる', async ({ page }) => {
    await page.goto('/en/tools/subtitle-converter/');
    await expect(page.locator('h1')).toContainText('SRT');
  });

  test('初期表示でaxeの違反がない', async ({ page }) => {
    await page.goto(PATH);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
});
