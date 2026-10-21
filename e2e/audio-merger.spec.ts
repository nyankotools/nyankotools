import { readFileSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

const PATH = '/tools/audio-merger/';

/** 指定秒・8kHz・モノラル・16bit の440Hzサイン波WAVを生成する */
function createWav(seconds: number): Buffer {
  const sampleRate = 8000;
  const samples = sampleRate * seconds;
  const buf = Buffer.alloc(44 + samples * 2);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + samples * 2, 4);
  buf.write('WAVEfmt ', 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(samples * 2, 40);
  for (let i = 0; i < samples; i++) {
    buf.writeInt16LE(
      Math.round(Math.sin((2 * Math.PI * 440 * i) / sampleRate) * 12000),
      44 + i * 2,
    );
  }
  return buf;
}

const wavFile = (name: string, seconds: number) => ({
  name,
  mimeType: 'audio/wav',
  buffer: createWav(seconds),
});

test.describe('audio-merger', () => {
  test('2ファイルをすき間付きで結合し、WAVをダウンロードできる', async ({
    page,
  }) => {
    await page.goto(PATH);
    await expect(page.locator('#am-merge-button')).toBeDisabled();
    await page
      .locator('#am-file-input')
      .setInputFiles([wavFile('a.wav', 1), wavFile('b.wav', 2)]);
    await expect(page.locator('#am-list li')).toHaveCount(2);
    await expect(page.locator('#am-merge-button')).toBeEnabled();

    await page.locator('#am-gap').fill('1');
    await page.locator('#am-merge-button').click();
    await expect(page.locator('#am-results-section')).toBeVisible();
    await expect(page.locator('#am-result-info')).toContainText('0:04');

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#am-download-button').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('a-merged.wav');

    // 1秒 + 1秒の無音 + 2秒 = 約4秒のWAV
    const bytes = readFileSync(await download.path());
    expect(bytes.toString('ascii', 0, 4)).toBe('RIFF');
    expect(bytes.toString('ascii', 8, 12)).toBe('WAVE');
    const channels = bytes.readUInt16LE(22);
    const sampleRate = bytes.readUInt32LE(24);
    const seconds = bytes.readUInt32LE(40) / (sampleRate * channels * 2);
    expect(seconds).toBeGreaterThan(3.9);
    expect(seconds).toBeLessThan(4.1);
  });

  test('並べ替えと削除ができ、クロスフェードでは短くなる', async ({ page }) => {
    await page.goto(PATH);
    await page
      .locator('#am-file-input')
      .setInputFiles([wavFile('a.wav', 2), wavFile('b.wav', 2)]);
    await expect(page.locator('#am-list li')).toHaveCount(2);

    await page
      .locator('#am-list li')
      .nth(1)
      .locator('[data-action="up"]')
      .click();
    await expect(page.locator('#am-list li').first()).toContainText('b.wav');

    await page.locator('#am-transition').selectOption('crossfade');
    await expect(page.locator('#am-gap')).toBeDisabled();
    await page.locator('#am-crossfade').fill('1');
    await page.locator('#am-merge-button').click();
    await expect(page.locator('#am-result-info')).toContainText('0:03');

    await page
      .locator('#am-list li')
      .first()
      .locator('[data-action="remove"]')
      .click();
    await expect(page.locator('#am-list li')).toHaveCount(1);
    await expect(page.locator('#am-results-section')).toBeHidden();
  });

  test('範囲外の秒数はエラーになり、結果は出ない', async ({ page }) => {
    await page.goto(PATH);
    await page.locator('#am-file-input').setInputFiles([wavFile('a.wav', 1)]);
    await expect(page.locator('#am-merge-button')).toBeEnabled();
    await page.locator('#am-gap').fill('100');
    await page.locator('#am-merge-button').click();
    await expect(page.locator('#am-error')).toBeVisible();
    await expect(page.locator('#am-results-section')).toBeHidden();
  });

  test('音声以外のファイルや壊れたファイルは追加されない', async ({ page }) => {
    await page.goto(PATH);
    await page.locator('#am-file-input').setInputFiles({
      name: 'a.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello'),
    });
    await expect(page.locator('#am-error')).toBeVisible();
    await expect(page.locator('#am-merge-button')).toBeDisabled();

    await page.locator('#am-file-input').setInputFiles({
      name: 'broken.mp3',
      mimeType: 'audio/mpeg',
      buffer: Buffer.from('this is not an audio file at all'),
    });
    await expect(page.locator('#am-error')).toContainText('broken.mp3');
    await expect(page.locator('#am-merge-button')).toBeDisabled();
  });

  test('en ページが表示できる', async ({ page }) => {
    await page.goto('/en/tools/audio-merger/');
    await expect(page.locator('h1')).toContainText('Audio Merger');
  });

  test('初期表示でaxeの違反がない', async ({ page }) => {
    await page.goto(PATH);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
});
