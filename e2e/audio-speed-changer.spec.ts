import { readFileSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

const PATH = '/tools/audio-speed-changer/';

/** 2秒・8kHz・モノラル・16bit の440Hzサイン波WAVを生成する */
function createWav(seconds = 2): Buffer {
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

test.describe('audio-speed-changer', () => {
  test('読み込み後、2倍速に変換してWAVをダウンロードできる', async ({
    page,
  }) => {
    await page.goto(PATH);
    await expect(page.locator('#asc-process-button')).toBeDisabled();
    await page.locator('#asc-file-input').setInputFiles({
      name: 'tone.wav',
      mimeType: 'audio/wav',
      buffer: createWav(2),
    });
    await expect(page.locator('#asc-source-info')).toContainText('0:02');
    await expect(page.locator('#asc-process-button')).toBeEnabled();

    await page.locator('#asc-speed').fill('2');
    await page.locator('#asc-process-button').click();
    await expect(page.locator('#asc-results-section')).toBeVisible();
    await expect(page.locator('#asc-result-info')).toContainText('0:01');

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#asc-download-button').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('tone-2x.wav');

    // 出力は本当にWAVで、2秒の入力が2倍速で約1秒になっている（ヘッダのレートから秒数を求める）
    const bytes = readFileSync(await download.path());
    expect(bytes.toString('ascii', 0, 4)).toBe('RIFF');
    expect(bytes.toString('ascii', 8, 12)).toBe('WAVE');
    const channels = bytes.readUInt16LE(22);
    const sampleRate = bytes.readUInt32LE(24);
    const dataBytes = bytes.readUInt32LE(40);
    const seconds = dataBytes / (sampleRate * channels * 2);
    expect(seconds).toBeGreaterThan(0.9);
    expect(seconds).toBeLessThan(1.1);
  });

  test('連動モードではピッチ入力が無効になる', async ({ page }) => {
    await page.goto(PATH);
    await expect(page.locator('#asc-semitones')).toBeEnabled();
    await page.locator('#asc-mode').selectOption('linked');
    await expect(page.locator('#asc-semitones')).toBeDisabled();
  });

  test('範囲外の速度はエラーになり、結果は出ない', async ({ page }) => {
    await page.goto(PATH);
    await page.locator('#asc-file-input').setInputFiles({
      name: 'tone.wav',
      mimeType: 'audio/wav',
      buffer: createWav(1),
    });
    await expect(page.locator('#asc-process-button')).toBeEnabled();
    await page.locator('#asc-speed').fill('10');
    await page.locator('#asc-process-button').click();
    await expect(page.locator('#asc-error')).toBeVisible();
    await expect(page.locator('#asc-results-section')).toBeHidden();
  });

  test('音声以外のファイルや壊れたファイルはエラーになる', async ({ page }) => {
    await page.goto(PATH);
    await page.locator('#asc-file-input').setInputFiles({
      name: 'a.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello'),
    });
    await expect(page.locator('#asc-error')).toBeVisible();
    await expect(page.locator('#asc-process-button')).toBeDisabled();

    await page.locator('#asc-file-input').setInputFiles({
      name: 'broken.mp3',
      mimeType: 'audio/mpeg',
      buffer: Buffer.from('this is not an audio file at all'),
    });
    await expect(page.locator('#asc-error')).toBeVisible();
    await expect(page.locator('#asc-process-button')).toBeDisabled();
  });

  test('en ページが表示できる', async ({ page }) => {
    await page.goto('/en/tools/audio-speed-changer/');
    await expect(page.locator('h1')).toContainText('Pitch');
  });

  test('初期表示でaxeの違反がない', async ({ page }) => {
    await page.goto(PATH);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
});
