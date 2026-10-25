import fs from 'node:fs';
import { test, expect, type Page } from './helpers/test';

const PATH = '/tools/video-merger/';

type Win = { __vmBlobs?: Record<string, Blob> };

/** ブラウザ内で色が変わる WebM 動画を録画し、window.__vmBlobs[name] に保存する。録画できない環境では false */
async function recordClip(
  page: Page,
  name: string,
  width: number,
  height: number,
  ms: number,
): Promise<boolean> {
  return page.evaluate(
    async ({ name, width, height, ms }) => {
      if (
        typeof MediaRecorder === 'undefined' ||
        !MediaRecorder.isTypeSupported('video/webm')
      ) {
        return false;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
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
          ctx.fillStyle = colors[Math.floor(elapsed / 400) % colors.length];
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          if (elapsed >= ms) resolve();
          else requestAnimationFrame(draw);
        };
        draw();
      });
      recorder.stop();
      await stopped;
      const w = window as unknown as Win;
      w.__vmBlobs ??= {};
      w.__vmBlobs[name] = new Blob(chunks, { type: 'video/webm' });
      return true;
    },
    { name, width, height, ms },
  );
}

/** 録画済みのクリップを、指定順でファイル入力に渡す */
async function attachClips(page: Page, names: string[]) {
  await page.evaluate((list) => {
    const blobs = (window as unknown as Win).__vmBlobs!;
    const dt = new DataTransfer();
    for (const n of list)
      dt.items.add(new File([blobs[n]], n, { type: 'video/webm' }));
    const input = document.getElementById('vm-file-input') as HTMLInputElement;
    input.files = dt.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }, names);
}

/** 動画の長さ（秒）を測る。MediaRecorder の出力は duration が Infinity になるためシークで確定させる */
async function probeDuration(page: Page, bytes: Buffer): Promise<number> {
  return page.evaluate(async (arr: number[]) => {
    const url = URL.createObjectURL(
      new Blob([new Uint8Array(arr)], { type: 'video/webm' }),
    );
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
  }, Array.from(bytes));
}

test.describe('video-merger', () => {
  test('サイズの違う2本を結合し、並べ替えて、WebMをダウンロードできる', async ({
    page,
  }) => {
    await page.goto(PATH);
    await expect(page.locator('#vm-merge-button')).toBeDisabled();
    test.skip(
      !(await recordClip(page, 'a.webm', 160, 90, 1500)),
      'このブラウザはMediaRecorderに対応していません',
    );
    await recordClip(page, 'b.webm', 120, 120, 1500);
    await attachClips(page, ['a.webm', 'b.webm']);
    await expect(page.locator('#vm-list li')).toHaveCount(2, {
      timeout: 15000,
    });
    await expect(page.locator('#vm-merge-button')).toBeEnabled();
    await expect(page.locator('#vm-summary')).toContainText('160×90');

    // 順序を入れ替えると先頭の動画が変わり、出力サイズの表示も変わる
    await page.locator('#vm-list [data-action="down"][data-index="0"]').click();
    await expect(page.locator('#vm-list li').first()).toContainText('b.webm');
    await expect(page.locator('#vm-summary')).toContainText('120×120');

    await page.locator('#vm-format').selectOption('webm');
    await page.locator('#vm-merge-button').click();
    await expect(page.locator('#vm-results-section')).toBeVisible({
      timeout: 90000,
    });
    await expect(page.locator('#vm-error')).toBeHidden();
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#vm-download-button').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('b-merged.webm');
    // 実処理の検証: 出力は2本ぶん（約3秒）の長さになる
    const duration = await probeDuration(
      page,
      fs.readFileSync(await download.path()),
    );
    expect(duration).toBeGreaterThan(2);
    expect(duration).toBeLessThan(4.5);
  });

  test('一覧から削除でき、クリアで空に戻る', async ({ page }) => {
    await page.goto(PATH);
    test.skip(
      !(await recordClip(page, 'a.webm', 160, 90, 1000)),
      'このブラウザはMediaRecorderに対応していません',
    );
    await attachClips(page, ['a.webm']);
    await expect(page.locator('#vm-list li')).toHaveCount(1, {
      timeout: 15000,
    });
    await page.locator('#vm-list [data-action="remove"]').click();
    await expect(page.locator('#vm-list li')).toHaveCount(0);
    await expect(page.locator('#vm-merge-button')).toBeDisabled();
  });

  test('動画以外のファイルはエラーになる', async ({ page }) => {
    await page.goto(PATH);
    await page.locator('#vm-file-input').setInputFiles({
      name: 'a.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello'),
    });
    await expect(page.locator('#vm-error')).toBeVisible();
    await expect(page.locator('#vm-merge-button')).toBeDisabled();
  });

  test('壊れた動画ファイルは読み込みエラーになる', async ({ page }) => {
    await page.goto(PATH);
    await page.locator('#vm-file-input').setInputFiles({
      name: 'broken.mp4',
      mimeType: 'video/mp4',
      buffer: Buffer.from('this is not a video file at all'),
    });
    await expect(page.locator('#vm-error')).toBeVisible();
    await expect(page.locator('#vm-error')).toContainText('broken.mp4');
    await expect(page.locator('#vm-merge-button')).toBeDisabled();
  });

  test('en ページが表示できる', async ({ page }) => {
    await page.goto('/en/tools/video-merger/');
    await expect(page.locator('h1')).toContainText('Video Merger');
  });
});
