import { test, expect } from './helpers/test';

const PATH = '/tools/media-converter/';

/** 1秒・8kHz・モノラル・16bit の440Hzサイン波WAVを生成する */
function createWav(seconds = 1): Buffer {
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

test.describe('media-converter', () => {
  test('音声ファイルを読み込むと情報が出て、変換ボタンが有効になる', async ({
    page,
  }) => {
    await page.goto(PATH);
    await expect(page.locator('#mc-convert-button')).toBeDisabled();
    await page.locator('#mc-file-input').setInputFiles({
      name: 'tone.wav',
      mimeType: 'audio/wav',
      buffer: createWav(2),
    });
    await expect(page.locator('#mc-source-info')).toContainText('0:02');
    await expect(page.locator('#mc-convert-button')).toBeEnabled();
    // 音声のみのファイルには解像度・音声削除の欄が出ない
    await expect(page.locator('#mc-height-field')).toBeHidden();
  });

  test('WAV → WAV に変換してダウンロードできる', async ({ page }) => {
    await page.goto(PATH);
    await page.locator('#mc-file-input').setInputFiles({
      name: 'tone.wav',
      mimeType: 'audio/wav',
      buffer: createWav(),
    });
    await expect(page.locator('#mc-convert-button')).toBeEnabled();
    await page.locator('#mc-format').selectOption('wav');
    await expect(page.locator('#mc-wav-hint')).toBeVisible();
    await page.locator('#mc-convert-button').click();
    await expect(page.locator('#mc-results-section')).toBeVisible();
    await expect(page.locator('#mc-result-size')).toContainText('%');
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#mc-download-button').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('tone-converted.wav');
  });

  test('WAV → MP3（LAMEのwasm）に変換できる', async ({ page }) => {
    await page.goto(PATH);
    await page.locator('#mc-file-input').setInputFiles({
      name: 'tone.wav',
      mimeType: 'audio/wav',
      buffer: createWav(),
    });
    await expect(page.locator('#mc-convert-button')).toBeEnabled();
    await page.locator('#mc-format').selectOption('mp3');
    await page.locator('#mc-convert-button').click();
    await expect(page.locator('#mc-results-section')).toBeVisible({
      timeout: 30000,
    });
    await expect(page.locator('#mc-error')).toBeHidden();
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#mc-download-button').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('tone-converted.mp3');
  });

  test('トリミングの時刻が不正だとエラーを表示する', async ({ page }) => {
    await page.goto(PATH);
    await page.locator('#mc-file-input').setInputFiles({
      name: 'tone.wav',
      mimeType: 'audio/wav',
      buffer: createWav(),
    });
    await expect(page.locator('#mc-convert-button')).toBeEnabled();
    await page.locator('#mc-format').selectOption('wav');

    await page.locator('#mc-trim-start').fill('abc');
    await page.locator('#mc-convert-button').click();
    await expect(page.locator('#mc-error')).toBeVisible();

    await page.locator('#mc-trim-start').fill('0.8');
    await page.locator('#mc-trim-end').fill('0.2');
    await page.locator('#mc-convert-button').click();
    await expect(page.locator('#mc-error')).toBeVisible();
    await expect(page.locator('#mc-results-section')).toBeHidden();

    await page.locator('#mc-trim-start').fill('0.2');
    await page.locator('#mc-trim-end').fill('0.6');
    await page.locator('#mc-convert-button').click();
    await expect(page.locator('#mc-results-section')).toBeVisible();
    await expect(page.locator('#mc-error')).toBeHidden();
  });

  test('動画・音声以外のファイルはエラーになる', async ({ page }) => {
    await page.goto(PATH);
    await page.locator('#mc-file-input').setInputFiles({
      name: 'a.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello'),
    });
    await expect(page.locator('#mc-error')).toBeVisible();
    await expect(page.locator('#mc-convert-button')).toBeDisabled();
  });

  test('壊れた音声ファイルは読み込みエラーになる', async ({ page }) => {
    await page.goto(PATH);
    await page.locator('#mc-file-input').setInputFiles({
      name: 'broken.mp3',
      mimeType: 'audio/mpeg',
      buffer: Buffer.from('this is not an audio file at all'),
    });
    await expect(page.locator('#mc-error')).toBeVisible();
    await expect(page.locator('#mc-convert-button')).toBeDisabled();
  });

  test('en ページが表示できる', async ({ page }) => {
    await page.goto('/en/tools/media-converter/');
    await expect(page.locator('h1')).toContainText('Converter');
  });

  test('変換中にキャンセルすると、キャンセルエラーが表示される', async ({
    page,
  }) => {
    await page.goto(PATH);
    await page.locator('#mc-file-input').setInputFiles({
      name: 'tone.wav',
      mimeType: 'audio/wav',
      buffer: createWav(3),
    });
    await expect(page.locator('#mc-convert-button')).toBeEnabled();
    // MP3への変換を開始（時間がかかる）
    await page.locator('#mc-format').selectOption('mp3');
    await page.locator('#mc-convert-button').click();
    // 変換中にキャンセルボタンが表示されることを確認
    await expect(page.locator('#mc-cancel-button')).toBeVisible();
    // キャンセルボタンをクリック
    await page.locator('#mc-cancel-button').click();
    // キャンセル処理完了を待つ（キャンセルボタンが hidden になる）
    await expect(page.locator('#mc-cancel-button')).toBeHidden({
      timeout: 30000,
    });
    // キャンセルエラーが表示されることを確認
    await expect(page.locator('#mc-error')).toBeVisible();
    await expect(page.locator('#mc-error')).toContainText(/キャンセル|Cancel/);
  });
});
