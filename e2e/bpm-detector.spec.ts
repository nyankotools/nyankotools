import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

const PATH = '/tools/bpm-detector/';

/** 指定BPMのクリック列を入れた 8kHz・モノラル・16bit のWAVを生成する */
function createClickWav(bpm: number, seconds: number): Buffer {
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
  const period = (60 / bpm) * sampleRate;
  for (let t = 0.1 * sampleRate; t < samples; t += period) {
    const start = Math.round(t);
    for (let i = 0; i < 600 && start + i < samples; i++) {
      const v =
        Math.exp(-i / 100) * Math.sin((2 * Math.PI * 1000 * i) / sampleRate);
      buf.writeInt16LE(Math.round(v * 20000), 44 + (start + i) * 2);
    }
  }
  return buf;
}

test.describe('bpm-detector', () => {
  test('クリック列のWAVを読み込むとBPMが自動で表示される', async ({ page }) => {
    await page.goto(PATH);
    await page.locator('#bpm-file-input').setInputFiles({
      name: 'click.wav',
      mimeType: 'audio/wav',
      buffer: createClickWav(120, 16),
    });
    await expect(page.locator('#bpm-results-section')).toBeVisible();
    const bpm = Number(await page.locator('#bpm-value').innerText());
    expect(Math.abs(bpm - 120)).toBeLessThanOrEqual(2);
    await expect(page.locator('#bpm-alternatives')).not.toBeEmpty();
    await expect(page.locator('#bpm-clear-button')).toBeEnabled();

    await page.locator('#bpm-clear-button').click();
    await expect(page.locator('#bpm-results-section')).toBeHidden();
  });

  test('無音のファイルは検出できないエラーになる', async ({ page }) => {
    await page.goto(PATH);
    await page.locator('#bpm-file-input').setInputFiles({
      name: 'silence.wav',
      mimeType: 'audio/wav',
      buffer: createClickWav(120, 6).fill(0, 44),
    });
    await expect(page.locator('#bpm-error')).toBeVisible();
    await expect(page.locator('#bpm-results-section')).toBeHidden();
  });

  test('音声以外のファイルや壊れたファイルはエラーになる', async ({ page }) => {
    await page.goto(PATH);
    await page.locator('#bpm-file-input').setInputFiles({
      name: 'a.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello'),
    });
    await expect(page.locator('#bpm-error')).toBeVisible();

    await page.locator('#bpm-file-input').setInputFiles({
      name: 'broken.mp3',
      mimeType: 'audio/mpeg',
      buffer: Buffer.from('this is not an audio file at all'),
    });
    await expect(page.locator('#bpm-error')).toBeVisible();
    await expect(page.locator('#bpm-results-section')).toBeHidden();
  });

  test('en ページが表示できる', async ({ page }) => {
    await page.goto('/en/tools/bpm-detector/');
    await expect(page.locator('h1')).toContainText('BPM');
  });

  test('初期表示でaxeの違反がない', async ({ page }) => {
    await page.goto(PATH);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
});
