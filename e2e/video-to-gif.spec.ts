import { readFileSync } from 'node:fs';
import { test, expect, type Page } from './helpers/test';

const PATH = '/tools/video-to-gif/';

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
    const dt = new DataTransfer();
    dt.items.add(new File([blob], 'clip.webm', { type: 'video/webm' }));
    const input = document.getElementById('vg-file') as HTMLInputElement;
    input.files = dt.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  });
}

test.describe('video-to-gif', () => {
  test('動画からGIFを作成し、プレビューとダウンロードができる', async ({
    page,
  }) => {
    await page.goto(PATH);
    await expect(page.locator('#vg-workspace')).toBeHidden();
    test.skip(
      !(await attachRecordedVideo(page)),
      'このブラウザはMediaRecorderに対応していません',
    );
    await expect(page.locator('#vg-workspace')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('#vg-source-info')).toContainText('160×90');

    await page.locator('#vg-start').fill('0');
    await page.locator('#vg-end').fill('1');
    await page.locator('#vg-fps').selectOption('5');
    await page.locator('#vg-width').fill('80');
    await page.locator('#vg-generate-button').click();
    await expect(page.locator('#vg-gif-result')).toBeVisible({
      timeout: 30000,
    });
    await expect(page.locator('#vg-error')).toBeHidden();
    await expect(page.locator('#vg-gif-info')).toContainText('80×45');
    await expect(page.locator('#vg-gif-info')).toContainText('5');

    // blob: URL への fetch は CSP の connect-src（blob: 非許可）に阻まれるため、
    // ダウンロードしたファイルの中身でGIFヘッダを検証する
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#vg-gif-download').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('clip.gif');
    const head = readFileSync((await download.path())!).subarray(0, 6);
    expect(head.toString('latin1')).toBe('GIF89a');
  });

  test('任意の時刻のフレームをPNGで保存できる', async ({ page }) => {
    await page.goto(PATH);
    test.skip(
      !(await attachRecordedVideo(page)),
      'このブラウザはMediaRecorderに対応していません',
    );
    await expect(page.locator('#vg-workspace')).toBeVisible({ timeout: 15000 });

    await page.locator('#vg-frame-time').fill('0.5');
    await page.locator('#vg-extract-button').click();
    await expect(page.locator('#vg-frame-result')).toBeVisible({
      timeout: 15000,
    });
    await expect(page.locator('#vg-frame-info')).toContainText('160×90');

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#vg-frame-download').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('clip-0.5s.png');
  });

  test('範囲・時刻が不正だとエラーを表示する', async ({ page }) => {
    await page.goto(PATH);
    test.skip(
      !(await attachRecordedVideo(page)),
      'このブラウザはMediaRecorderに対応していません',
    );
    await expect(page.locator('#vg-workspace')).toBeVisible({ timeout: 15000 });

    await page.locator('#vg-start').fill('abc');
    await page.locator('#vg-generate-button').click();
    await expect(page.locator('#vg-error')).toBeVisible();
    await expect(page.locator('#vg-gif-result')).toBeHidden();

    await page.locator('#vg-start').fill('1');
    await page.locator('#vg-end').fill('0.5');
    await page.locator('#vg-generate-button').click();
    await expect(page.locator('#vg-error')).toBeVisible();

    await page.locator('#vg-frame-time').fill('999');
    await page.locator('#vg-extract-button').click();
    await expect(page.locator('#vg-error')).toBeVisible();
    await expect(page.locator('#vg-frame-result')).toBeHidden();
  });

  test('動画以外のファイルはエラーになる', async ({ page }) => {
    await page.goto(PATH);
    await page.locator('#vg-file').setInputFiles({
      name: 'a.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello'),
    });
    await expect(page.locator('#vg-error')).toBeVisible();
    await expect(page.locator('#vg-workspace')).toBeHidden();
  });

  test('壊れた動画ファイルは読み込みエラーになる', async ({ page }) => {
    await page.goto(PATH);
    await page.locator('#vg-file').setInputFiles({
      name: 'broken.mp4',
      mimeType: 'video/mp4',
      buffer: Buffer.from('this is not a video file at all'),
    });
    await expect(page.locator('#vg-error')).toBeVisible();
    await expect(page.locator('#vg-workspace')).toBeHidden();
  });

  test('en ページが表示できる', async ({ page }) => {
    await page.goto('/en/tools/video-to-gif/');
    await expect(page.locator('h1')).toContainText('Video to GIF');
  });
});
