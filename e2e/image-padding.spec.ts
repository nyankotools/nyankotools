import { readFile } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import { test, expect, type Download, type Page } from './helpers/test';

/** ダウンロードされたPNGをブラウザでデコードし、サイズと左上隅のRGBAを返す */
async function readDownloadedPng(page: Page, download: Download) {
  const bytes = Array.from(
    new Uint8Array(await readFile((await download.path())!)),
  );
  return page.evaluate(async (arr) => {
    const bmp = await createImageBitmap(
      new Blob([new Uint8Array(arr)], { type: 'image/png' }),
    );
    const c = document.createElement('canvas');
    c.width = bmp.width;
    c.height = bmp.height;
    const ctx = c.getContext('2d')!;
    ctx.drawImage(bmp, 0, 0);
    return {
      width: bmp.width,
      height: bmp.height,
      corner: Array.from(ctx.getImageData(0, 0, 1, 1).data),
    };
  }, bytes);
}

/** ブラウザ内で赤一色のPNGを作り、ファイル入力に渡す */
async function loadImage(page: Page, name = 'photo.png', w = 40, h = 20) {
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
      const input = document.getElementById('pad-file') as HTMLInputElement;
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    },
    { name, w, h },
  );
}

test.describe('画像に余白を追加（日本語版）', () => {
  test('読み込むと1:1になり、余白がプレビューに反映されてダウンロードできる', async ({
    page,
  }) => {
    await page.goto('/tools/image-padding/');
    await expect(page.locator('main h1')).toContainText('余白を追加');
    await expect(page.locator('#pad-workspace')).toBeHidden();

    await loadImage(page);
    await expect(page.locator('#pad-workspace')).toBeVisible();
    await expect(page.locator('#pad-size')).toHaveText(
      '元画像: 40 × 20 px → 出力: 40 × 40 px',
    );

    // 上の余白は背景色（白）、中央は元画像（赤）
    const pixels = await page.locator('#pad-canvas').evaluate((el) => {
      const ctx = (el as HTMLCanvasElement).getContext('2d')!;
      return [
        Array.from(ctx.getImageData(5, 2, 1, 1).data),
        Array.from(ctx.getImageData(5, 20, 1, 1).data),
      ];
    });
    expect(pixels[0]).toEqual([255, 255, 255, 255]);
    expect(pixels[1]).toEqual([255, 0, 0, 255]);

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#pad-download').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('photo-padded.png');
    // 実ファイルの左上隅（余白）は既定の白、サイズは1:1の40×40
    const png = await readDownloadedPng(page, download);
    expect(png).toMatchObject({ width: 40, height: 40 });
    expect(png.corner).toEqual([255, 255, 255, 255]);
    await expect(page.locator('#pad-status')).toHaveText(
      'ダウンロードしました',
    );
  });

  test('余白のみのモードと透明背景', async ({ page }) => {
    await page.goto('/tools/image-padding/');
    await loadImage(page);
    await page.locator('#pad-aspect').selectOption('none');
    await page.locator('#pad-margin').fill('10');
    await expect(page.locator('#pad-size')).toHaveText(
      '元画像: 40 × 20 px → 出力: 60 × 40 px',
    );

    await page.locator('#pad-transparent').check();
    const alpha = await page.locator('#pad-canvas').evaluate((el) => {
      const ctx = (el as HTMLCanvasElement).getContext('2d')!;
      return ctx.getImageData(1, 1, 1, 1).data[3];
    });
    expect(alpha).toBe(0);
  });

  test('自由指定の比率と、JPEG選択時の画質スライダー', async ({ page }) => {
    await page.goto('/tools/image-padding/');
    await loadImage(page, 'shot.png');
    await page.locator('#pad-aspect').selectOption('custom');
    await page.locator('#pad-custom-w').fill('2');
    await page.locator('#pad-custom-h').fill('1');
    await expect(page.locator('#pad-size')).toHaveText(
      '元画像: 40 × 20 px → 出力: 40 × 20 px',
    );
    await page.locator('#pad-custom-w').fill('4');
    await expect(page.locator('#pad-size')).toHaveText(
      '元画像: 40 × 20 px → 出力: 80 × 20 px',
    );

    await expect(page.locator('#pad-quality-wrap')).toBeHidden();
    await page.locator('#pad-format [data-format="jpeg"]').click();
    await expect(page.locator('#pad-quality-wrap')).toBeVisible();
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#pad-download').click();
    expect((await downloadPromise).suggestedFilename()).toBe('shot-padded.jpg');
  });

  test('出力が大きすぎるとエラーになる', async ({ page }) => {
    await page.goto('/tools/image-padding/');
    await loadImage(page);
    await page.locator('#pad-aspect').selectOption('none');
    await page.locator('#pad-margin').fill('8192');
    await expect(page.locator('#pad-error')).toBeVisible();
    await expect(page.locator('#pad-download')).toBeDisabled();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });

  test('画像でないファイルはエラーになる', async ({ page }) => {
    await page.goto('/tools/image-padding/');
    await page.locator('#pad-file').setInputFiles({
      name: 'a.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello'),
    });
    await expect(page.locator('#pad-error')).toBeVisible();
    await expect(page.locator('#pad-workspace')).toBeHidden();
  });
});

test.describe('Image Padding (English)', () => {
  test('英語版が表示され、読み込める', async ({ page }) => {
    await page.goto('/en/tools/image-padding/');
    await expect(page.locator('main h1')).toContainText('Add Padding');
    await loadImage(page);
    await expect(page.locator('#pad-size')).toHaveText(
      'Source: 40 × 20 px → Output: 40 × 40 px',
    );
  });
});
