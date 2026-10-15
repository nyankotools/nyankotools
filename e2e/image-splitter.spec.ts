import { readFile } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import { unzipSync } from 'fflate';
import { test, expect, type Page } from './helpers/test';

/** ブラウザ内で単色(赤)のPNGを作り、ファイル入力に渡す */
async function loadImage(page: Page, name = 'photo.png', w = 90, h = 60) {
  await page.evaluate(
    async ({ name, w, h }) => {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = 'red';
      ctx.fillRect(0, 0, w, h);
      const blob = await new Promise<Blob>((r) => c.toBlob((b) => r(b!)));
      const dt = new DataTransfer();
      dt.items.add(new File([blob], name, { type: 'image/png' }));
      const input = document.getElementById('split-file') as HTMLInputElement;
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    },
    { name, w, h },
  );
}

/** ダウンロードしたZIPを展開し、ファイル名→バイト列の対応を返す */
async function readZip(download: {
  path: () => Promise<string | null>;
}): Promise<Record<string, Uint8Array>> {
  return unzipSync(new Uint8Array(await readFile((await download.path())!)));
}

/** PNGのIHDRから幅と高さ（px）を読む */
function pngSize(bytes: Uint8Array): { width: number; height: number } {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return { width: view.getUint32(16), height: view.getUint32(20) };
}

test.describe('画像分割（日本語版）', () => {
  test('3×3に分割してZIPでダウンロードできる', async ({ page }) => {
    await page.goto('/tools/image-splitter/');
    await expect(page.locator('main h1')).toContainText('画像分割');
    await expect(page.locator('#split-workspace')).toBeHidden();

    await loadImage(page);
    await expect(page.locator('#split-workspace')).toBeVisible();
    await expect(page.locator('#split-size')).toHaveText(
      '元画像: 90 × 60 px → 9枚（1枚あたり約 30 × 20 px）',
    );

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#split-download').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('photo-3x3.zip');
    const files = await readZip(download);
    expect(Object.keys(files).sort()).toEqual(
      Array.from({ length: 9 }, (_, i) => `photo_${i + 1}.png`),
    );
    await expect(page.locator('#split-status')).toHaveText(
      'ダウンロードしました',
    );
  });

  test('プリセットと行列の入力、Instagram投稿順の番号', async ({ page }) => {
    await page.goto('/tools/image-splitter/');
    await loadImage(page, 'wide.png', 120, 40);
    await page.locator('[data-preset][data-cols="3"][data-rows="1"]').click();
    await expect(page.locator('#split-rows')).toHaveValue('1');
    await expect(page.locator('#split-cols')).toHaveValue('3');
    await expect(page.locator('#split-size')).toHaveText(
      '元画像: 120 × 40 px → 3枚（1枚あたり約 40 × 40 px）',
    );

    await page.locator('#split-reverse').check();
    await page.locator('#split-format [data-format="jpeg"]').click();
    await expect(page.locator('#split-quality-wrap')).toBeVisible();
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#split-download').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('wide-3x1.zip');
    const files = await readZip(download);
    expect(Object.keys(files).sort()).toEqual([
      'wide_1.jpg',
      'wide_2.jpg',
      'wide_3.jpg',
    ]);
  });

  test('1×1は元画像をそのまま1枚にして保存する', async ({ page }) => {
    await page.goto('/tools/image-splitter/');
    await loadImage(page, 'photo.png', 7, 5);
    await page.locator('#split-rows').fill('1');
    await page.locator('#split-cols').fill('1');
    await expect(page.locator('#split-size')).toHaveText(
      '元画像: 7 × 5 px → 1枚（1枚あたり約 7 × 5 px）',
    );

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#split-download').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('photo-1x1.zip');
    const files = await readZip(download);
    expect(Object.keys(files)).toEqual(['photo_1.png']);
    expect(pngSize(files['photo_1.png'])).toEqual({ width: 7, height: 5 });
  });

  test('割り切れない分割は端数を散らし、全体を隙間なく覆う', async ({
    page,
  }) => {
    await page.goto('/tools/image-splitter/');
    // 10×7 を 3×3 に割ると、列は 3・4・3 px、行は 2・3・2 px になる
    await loadImage(page, 'odd.png', 10, 7);
    await expect(page.locator('#split-size')).toHaveText(
      '元画像: 10 × 7 px → 9枚（1枚あたり約 3 × 2 px）',
    );

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#split-download').click();
    const files = await readZip(await downloadPromise);
    const sizes = Array.from({ length: 9 }, (_, i) =>
      pngSize(files[`odd_${i + 1}.png`]),
    );
    expect(sizes.map((s) => `${s.width}x${s.height}`)).toEqual([
      '3x2',
      '4x2',
      '3x2',
      '3x3',
      '4x3',
      '3x3',
      '3x2',
      '4x2',
      '3x2',
    ]);
    const area = sizes.reduce((sum, s) => sum + s.width * s.height, 0);
    expect(area).toBe(10 * 7);
  });

  test('分割数が多すぎる・細かすぎるとエラーになる', async ({ page }) => {
    await page.goto('/tools/image-splitter/');
    await loadImage(page, 'tiny.png', 4, 4);
    await page.locator('#split-rows').fill('10');
    await page.locator('#split-cols').fill('11');
    await expect(page.locator('#split-error')).toHaveText(
      '分割数が多すぎます。行数×列数は100枚までです。',
    );
    await expect(page.locator('#split-download')).toBeDisabled();

    await page.locator('#split-rows').fill('2');
    await page.locator('#split-cols').fill('5');
    await expect(page.locator('#split-error')).toHaveText(
      '分割数が画像のピクセル数を超えています。行数・列数を減らしてください。',
    );
    await expect(page.locator('#split-download')).toBeDisabled();

    await page.locator('#split-cols').fill('2');
    await expect(page.locator('#split-error')).toBeHidden();
    await expect(page.locator('#split-download')).toBeEnabled();
  });

  test('行列の上限（100枚ちょうど）は分割できる', async ({ page }) => {
    await page.goto('/tools/image-splitter/');
    await loadImage(page, 'big.png', 100, 100);
    await page.locator('#split-rows').fill('20');
    await page.locator('#split-cols').fill('5');
    await expect(page.locator('#split-error')).toBeHidden();
    await expect(page.locator('#split-download')).toBeEnabled();
    await expect(page.locator('#split-size')).toHaveText(
      '元画像: 100 × 100 px → 100枚（1枚あたり約 20 × 5 px）',
    );
  });

  test('1辺の上限を超える画像はエラーになり、ワークスペースは表示されない', async ({
    page,
  }) => {
    await page.goto('/tools/image-splitter/');
    // 16385px は上限（16384px）を1px超える。canvasは32767pxまで作れる
    await loadImage(page, 'huge.png', 16385, 1);
    await expect(page.locator('#split-error')).toContainText(
      '画像が大きすぎます',
    );
    await expect(page.locator('#split-workspace')).toBeHidden();
  });

  test('画像でないファイルはエラーになる', async ({ page }) => {
    await page.goto('/tools/image-splitter/');
    await page.locator('#split-file').setInputFiles({
      name: 'a.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello'),
    });
    await expect(page.locator('#split-error')).toBeVisible();
    await expect(page.locator('#split-workspace')).toBeHidden();
  });

  test('書き出し中に別の画像を読み込んでも、書き出し中の画像が優先される', async ({
    page,
  }) => {
    await page.goto('/tools/image-splitter/');
    await loadImage(page, 'photo.png', 90, 60);
    await expect(page.locator('#split-size')).toHaveText(
      '元画像: 90 × 60 px → 9枚（1枚あたり約 30 × 20 px）',
    );

    // クリックの同期処理で書き出しを開始し、直後に別画像を選んだ状態を作る
    // （書き出し中は差し替えを受け付けない＝ImageBitmapを途中で閉じない）
    const downloadPromise = page.waitForEvent('download');
    await page.evaluate(async () => {
      document.getElementById('split-download')!.click();
      const c = document.createElement('canvas');
      c.width = 20;
      c.height = 20;
      const blob = await new Promise<Blob>((r) =>
        c.toBlob((b) => r(b!), 'image/png'),
      );
      const dt = new DataTransfer();
      dt.items.add(new File([blob], 'other.png', { type: 'image/png' }));
      const input = document.getElementById('split-file') as HTMLInputElement;
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('photo-3x3.zip');
    const files = await readZip(download);
    expect(Object.keys(files)).toHaveLength(9);
    await expect(page.locator('#split-size')).toHaveText(
      '元画像: 90 × 60 px → 9枚（1枚あたり約 30 × 20 px）',
    );

    // 書き出しが終わった後は、次の画像を正しく読み込める
    await expect(page.locator('#split-download')).toBeEnabled();
    await loadImage(page, 'next.png', 40, 40);
    await expect(page.locator('#split-size')).toHaveText(
      '元画像: 40 × 40 px → 9枚（1枚あたり約 13 × 13 px）',
    );
  });

  test('375px幅でも横スクロールせず、読み込み後もaxeの違反がない', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/tools/image-splitter/');
    await loadImage(page);
    await expect(page.locator('#split-workspace')).toBeVisible();
    await expect(page.locator('#split-download')).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overflow).toBe(false);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
});

test.describe('Image Splitter (English)', () => {
  test('英語版が表示され、読み込める', async ({ page }) => {
    await page.goto('/en/tools/image-splitter/');
    await expect(page.locator('main h1')).toContainText('Image Splitter');
    await loadImage(page);
    await expect(page.locator('#split-size')).toHaveText(
      'Source: 90 × 60 px → 9 tiles (about 30 × 20 px each)',
    );
  });
});
