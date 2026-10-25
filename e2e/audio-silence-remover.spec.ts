import { readFileSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

const PATH = '/tools/audio-silence-remover/';

/** 8kHz・モノラル・16bit。(秒数, 振幅) の並びで 440Hz のサイン波 / 無音を作る */
function createWav(parts: Array<[number, number]>): Buffer {
  const sampleRate = 8000;
  const samples = parts.reduce((s, [sec]) => s + sec * sampleRate, 0);
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
  let pos = 0;
  for (const [sec, amp] of parts) {
    for (let i = 0; i < sec * sampleRate; i++, pos++) {
      buf.writeInt16LE(
        Math.round(Math.sin((2 * Math.PI * 440 * pos) / sampleRate) * amp),
        44 + pos * 2,
      );
    }
  }
  return buf;
}

const TONE_SILENCE_TONE = createWav([
  [1, 12000],
  [1, 0],
  [1, 12000],
]);

test.describe('audio-silence-remover', () => {
  test('無音を検出してカットし、短くなったWAVをダウンロードできる', async ({
    page,
  }) => {
    await page.goto(PATH);
    await expect(page.locator('#asr-process-button')).toBeDisabled();
    await page.locator('#asr-file-input').setInputFiles({
      name: 'talk.wav',
      mimeType: 'audio/wav',
      buffer: TONE_SILENCE_TONE,
    });
    await expect(page.locator('#asr-source-info')).toContainText('0:03');
    await expect(page.locator('#asr-waveform-section')).toBeVisible();
    await expect(page.locator('#asr-analysis')).toContainText('1');
    await expect(page.locator('#asr-process-button')).toBeEnabled();

    await page.locator('#asr-padding').fill('0.1');
    await page.locator('#asr-process-button').click();
    await expect(page.locator('#asr-results-section')).toBeVisible();
    // 3.0秒 → 約2.2秒（無音1秒のうち前後0.1秒ずつを残す）
    await expect(page.locator('#asr-result-info')).toContainText('0:03.0');
    await expect(page.locator('#asr-result-info')).toContainText('0:02.2');

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#asr-download-button').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('talk-nosilence.wav');

    const bytes = readFileSync(await download.path());
    expect(bytes.toString('ascii', 0, 4)).toBe('RIFF');
    expect(bytes.toString('ascii', 8, 12)).toBe('WAVE');
    const channels = bytes.readUInt16LE(22);
    const sampleRate = bytes.readUInt32LE(24);
    const dataBytes = bytes.readUInt32LE(40);
    const seconds = dataBytes / (sampleRate * channels * 2);
    expect(seconds).toBeGreaterThan(2.1);
    expect(seconds).toBeLessThan(2.3);
  });

  test('短縮モードでは短縮後の無音長入力が有効になる', async ({ page }) => {
    await page.goto(PATH);
    await expect(page.locator('#asr-shorten')).toBeDisabled();
    await page.locator('#asr-mode').selectOption('shorten');
    await expect(page.locator('#asr-shorten')).toBeEnabled();
    await expect(page.locator('#asr-padding')).toBeDisabled();
  });

  test('範囲外のしきい値はエラーになり、結果は出ない', async ({ page }) => {
    await page.goto(PATH);
    await page.locator('#asr-file-input').setInputFiles({
      name: 'talk.wav',
      mimeType: 'audio/wav',
      buffer: TONE_SILENCE_TONE,
    });
    await expect(page.locator('#asr-process-button')).toBeEnabled();
    await page.locator('#asr-threshold').fill('10');
    await expect(page.locator('#asr-error')).toBeVisible();
    await page.locator('#asr-process-button').click();
    await expect(page.locator('#asr-error')).toBeVisible();
    await expect(page.locator('#asr-results-section')).toBeHidden();
  });

  test('無音がない音声ではエラーになる', async ({ page }) => {
    await page.goto(PATH);
    await page.locator('#asr-file-input').setInputFiles({
      name: 'tone.wav',
      mimeType: 'audio/wav',
      buffer: createWav([[2, 12000]]),
    });
    await expect(page.locator('#asr-process-button')).toBeEnabled();
    await page.locator('#asr-process-button').click();
    await expect(page.locator('#asr-error')).toBeVisible();
    await expect(page.locator('#asr-results-section')).toBeHidden();
  });

  test('音声以外のファイルはエラーになる', async ({ page }) => {
    await page.goto(PATH);
    await page.locator('#asr-file-input').setInputFiles({
      name: 'a.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello'),
    });
    await expect(page.locator('#asr-error')).toBeVisible();
    await expect(page.locator('#asr-process-button')).toBeDisabled();
  });

  test('en ページが表示できる', async ({ page }) => {
    await page.goto('/en/tools/audio-silence-remover/');
    await expect(page.locator('h1')).toContainText('Silence');
  });

  test('初期表示でaxeの違反がない', async ({ page }) => {
    await page.goto(PATH);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
});
