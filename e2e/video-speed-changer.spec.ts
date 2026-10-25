import fs from 'node:fs';
import { test, expect, type Page } from './helpers/test';

const PATH = '/tools/video-speed-changer/';

/**
 * 動画の長さ（秒）を測る。MediaRecorder の出力は duration が Infinity になるため、
 * 大きな位置へシークして duration を確定させる。bytes を省略すると録画した入力動画を使う。
 */
async function probeDuration(page: Page, bytes?: Buffer): Promise<number> {
  return page.evaluate(
    async (arr: number[] | null) => {
      const blob = arr
        ? new Blob([new Uint8Array(arr)], { type: 'video/webm' })
        : (window as unknown as { __vsSourceBlob: Blob }).__vsSourceBlob;
      const url = URL.createObjectURL(blob);
      const video = document.createElement('video');
      video.muted = true;
      video.preload = 'auto';
      video.src = url;
      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = () => reject(new Error('video load failed'));
      });
      if (video.duration === Infinity) {
        await new Promise<void>((resolve) => {
          video.ondurationchange = () => {
            if (video.duration !== Infinity) resolve();
          };
          video.currentTime = 1e101;
        });
      }
      const duration = video.duration;
      URL.revokeObjectURL(url);
      return duration;
    },
    bytes ? Array.from(bytes) : null,
  );
}

/**
 * ブラウザ内で色が変わる約2秒のWebM動画を録画し、ファイル入力に渡す。
 * MediaRecorder が使えない環境では false を返す。
 */
async function attachRecordedVideo(page: Page): Promise<boolean> {
  return page.evaluate(async () => {
    if (
      typeof MediaRecorder === 'undefined' ||
      !MediaRecorder.isTypeSupported('video/webm')
    ) {
      return false;
    }
    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 90;
    const ctx = canvas.getContext('2d')!;
    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);
    const stopped = new Promise<void>((r) => (recorder.onstop = () => r()));
    recorder.start();
    const colors = ['#e11', '#1a1', '#11e', '#ee1'];
    const startedAt = performance.now();
    await new Promise<void>((resolve) => {
      const draw = () => {
        const elapsed = performance.now() - startedAt;
        ctx.fillStyle = colors[Math.floor(elapsed / 500) % colors.length];
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (elapsed >= 2200) resolve();
        else requestAnimationFrame(draw);
      };
      draw();
    });
    recorder.stop();
    await stopped;
    const blob = new Blob(chunks, { type: 'video/webm' });
    (window as unknown as { __vsSourceBlob: Blob }).__vsSourceBlob = blob;
    const dt = new DataTransfer();
    dt.items.add(new File([blob], 'clip.webm', { type: 'video/webm' }));
    const input = document.getElementById('vs-file-input') as HTMLInputElement;
    input.files = dt.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  });
}

test.describe('video-speed-changer', () => {
  test('動画を読み込み、2倍速のWebMを作ってダウンロードできる', async ({
    page,
  }) => {
    await page.goto(PATH);
    await expect(page.locator('#vs-convert-button')).toBeDisabled();
    test.skip(
      !(await attachRecordedVideo(page)),
      'このブラウザはMediaRecorderに対応していません',
    );
    await expect(page.locator('#vs-convert-button')).toBeEnabled({
      timeout: 15000,
    });
    await expect(page.locator('#vs-source-info')).toContainText('160×90');
    await expect(page.locator('#vs-speed-result')).toContainText('2');
    const sourceDuration = await probeDuration(page);

    await page.locator('[data-speed-preset="4"]').click();
    await expect(page.locator('#vs-speed')).toHaveValue('4');
    await page.locator('#vs-format').selectOption('webm');
    await page.locator('#vs-convert-button').click();
    await expect(page.locator('#vs-results-section')).toBeVisible({
      timeout: 60000,
    });
    await expect(page.locator('#vs-error')).toBeHidden();
    await expect(page.locator('#vs-result-size')).toContainText('KB');
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#vs-download-button').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('clip-4x.webm');
    // 実処理の検証: 4倍速なので出力は入力の約1/4の長さになる
    const outputPath = await download.path();
    const outputDuration = await probeDuration(
      page,
      fs.readFileSync(outputPath),
    );
    expect(sourceDuration).toBeGreaterThan(1);
    expect(outputDuration).toBeGreaterThan(0);
    expect(outputDuration).toBeLessThan(sourceDuration / 2);
    expect(outputDuration).toBeGreaterThan(sourceDuration / 8);
  });

  test('速度が範囲外だとエラーを表示する', async ({ page }) => {
    await page.goto(PATH);
    test.skip(
      !(await attachRecordedVideo(page)),
      'このブラウザはMediaRecorderに対応していません',
    );
    await expect(page.locator('#vs-convert-button')).toBeEnabled({
      timeout: 15000,
    });
    await page.locator('#vs-speed').fill('10');
    await page.locator('#vs-convert-button').click();
    await expect(page.locator('#vs-error')).toBeVisible();
    await expect(page.locator('#vs-results-section')).toBeHidden();
  });

  test('動画以外のファイルはエラーになる', async ({ page }) => {
    await page.goto(PATH);
    await page.locator('#vs-file-input').setInputFiles({
      name: 'a.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello'),
    });
    await expect(page.locator('#vs-error')).toBeVisible();
    await expect(page.locator('#vs-convert-button')).toBeDisabled();
  });

  test('壊れた動画ファイルは読み込みエラーになる', async ({ page }) => {
    await page.goto(PATH);
    await page.locator('#vs-file-input').setInputFiles({
      name: 'broken.mp4',
      mimeType: 'video/mp4',
      buffer: Buffer.from('this is not a video file at all'),
    });
    await expect(page.locator('#vs-error')).toBeVisible();
    await expect(page.locator('#vs-convert-button')).toBeDisabled();
  });

  test('en ページが表示できる', async ({ page }) => {
    await page.goto('/en/tools/video-speed-changer/');
    await expect(page.locator('h1')).toContainText('Video Speed Changer');
  });
});
