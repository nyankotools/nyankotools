import { readFile } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import { test, expect, type Download, type Page } from './helpers/test';

/** ダウンロードされたPNGをブラウザでデコードし、サイズ・左上隅・中央のRGBAを返す */
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
    const cx = Math.floor(bmp.width / 2);
    return {
      width: bmp.width,
      height: bmp.height,
      corner: Array.from(ctx.getImageData(0, 0, 1, 1).data),
      center: Array.from(ctx.getImageData(cx, cx, 1, 1).data),
    };
  }, bytes);
}

/** ブラウザ内で単色(赤)のPNGを作り、ファイル入力に渡す */
async function loadImage(page: Page, name = 'icon.png', w = 80, h = 40) {
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
      const input = document.getElementById('rc-file') as HTMLInputElement;
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    },
    { name, w, h },
  );
}

test.describe('画像の円形・角丸切り抜き（日本語版）', () => {
  test('読み込むと中央の正方形になり、円の外側は透明になる', async ({
    page,
  }) => {
    await page.goto('/tools/image-round-crop/');
    await expect(page.locator('main h1')).toContainText('円形・角丸');
    await expect(page.locator('#rc-workspace')).toBeHidden();

    await loadImage(page);
    await expect(page.locator('#rc-workspace')).toBeVisible();
    await expect(page.locator('#rc-info')).toHaveText('出力サイズ: 40 × 40 px');

    const px = await page.locator('#rc-result').evaluate((el) => {
      const ctx = (el as HTMLCanvasElement).getContext('2d')!;
      return {
        corner: Array.from(ctx.getImageData(0, 0, 1, 1).data),
        center: Array.from(ctx.getImageData(20, 20, 1, 1).data),
      };
    });
    expect(px.corner[3]).toBe(0);
    expect(px.center).toEqual([255, 0, 0, 255]);

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#rc-download').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('icon-round.png');
    // 実ファイルのPNGも、円の外は透明・内側は元画像の色であること
    const png = await readDownloadedPng(page, download);
    expect(png).toMatchObject({ width: 40, height: 40 });
    expect(png.corner[3]).toBe(0);
    expect(png.center).toEqual([255, 0, 0, 255]);
    await expect(page.locator('#rc-status')).toHaveText('ダウンロードしました');
  });

  test('読み込み後の画面でaxeの違反がない', async ({ page }) => {
    await page.goto('/tools/image-round-crop/');
    await loadImage(page);
    await expect(page.locator('#rc-workspace')).toBeVisible();
    await page.getByRole('button', { name: '角丸' }).click();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });

  test('「元の縦横比のまま」で画像全体が対象になる', async ({ page }) => {
    await page.goto('/tools/image-round-crop/');
    await loadImage(page);
    await page.getByRole('button', { name: '元の縦横比のまま' }).click();
    await expect(page.locator('#rc-info')).toHaveText('出力サイズ: 80 × 40 px');
    await page.getByRole('button', { name: '正方形に切り抜く' }).click();
    await expect(page.locator('#rc-info')).toHaveText('出力サイズ: 40 × 40 px');
  });

  test('角丸を選ぶと丸みの調整が現れる', async ({ page }) => {
    await page.goto('/tools/image-round-crop/');
    await loadImage(page);
    await expect(page.locator('#rc-radius-wrap')).toBeHidden();
    await page.getByRole('button', { name: '角丸' }).click();
    await expect(page.locator('#rc-radius-wrap')).toBeVisible();
  });

  test('画像でないファイルはエラーになる', async ({ page }) => {
    await page.goto('/tools/image-round-crop/');
    await page.locator('#rc-file').setInputFiles({
      name: 'a.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello'),
    });
    await expect(page.locator('#rc-error')).toBeVisible();
    await expect(page.locator('#rc-workspace')).toBeHidden();
  });
});

test.describe('Round Image Cropper (English)', () => {
  test('英語版が表示され、読み込める', async ({ page }) => {
    await page.goto('/en/tools/image-round-crop/');
    await expect(page.locator('main h1')).toContainText('Circle');
    await loadImage(page);
    await expect(page.locator('#rc-info')).toHaveText(
      'Output size: 40 × 40 px',
    );
  });
});
