import { readFile } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import { test, expect, type Download, type Page } from './helpers/test';

/** ダウンロードされたPNGをブラウザでデコードし、サイズと指定位置のRGBAを返す */
async function readDownloadedPng(
  page: Page,
  download: Download,
  points: [number, number][],
) {
  const bytes = Array.from(
    new Uint8Array(await readFile((await download.path())!)),
  );
  return page.evaluate(
    async ({ arr, points }) => {
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
        pixels: points.map(([x, y]) =>
          Array.from(ctx.getImageData(x, y, 1, 1).data),
        ),
      };
    },
    { arr: bytes, points },
  );
}

/** ブラウザ内で赤一色のPNGを作り、ファイル入力に渡す */
async function loadImage(page: Page, name = 'photo.png', w = 200, h = 100) {
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
      const input = document.getElementById('frame-file') as HTMLInputElement;
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    },
    { name, w, h },
  );
}

async function setRange(page: Page, id: string, value: number) {
  await page.locator(id).evaluate((el, v) => {
    (el as HTMLInputElement).value = String(v);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, value);
}

test.describe('画像に枠を付ける（日本語版）', () => {
  test('ポラロイド風で読み込み、下が広い枠付きでダウンロードできる', async ({
    page,
  }) => {
    await page.goto('/tools/image-frame-maker/');
    await expect(page.locator('main h1')).toContainText('枠・フレーム');
    await expect(page.locator('#frame-workspace')).toBeHidden();

    await loadImage(page);
    await expect(page.locator('#frame-workspace')).toBeVisible();
    // 5% = 5px、下は5 * 3.2 = 16px
    await expect(page.locator('#frame-size')).toHaveText(
      '元画像: 200 × 100 px → 出力: 210 × 121 px',
    );

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#frame-download').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('photo-framed.png');
    const png = await readDownloadedPng(page, download, [
      [1, 1],
      [100, 50],
      [100, 115],
    ]);
    expect(png.width).toBe(210);
    expect(png.height).toBe(121);
    // 枠は白、中央は元画像の赤、下の広い枠も白
    expect(png.pixels[0]).toEqual([255, 255, 255, 255]);
    expect(png.pixels[1]).toEqual([255, 0, 0, 255]);
    expect(png.pixels[2]).toEqual([255, 255, 255, 255]);
    await expect(page.locator('#frame-status')).toHaveText(
      'ダウンロードしました',
    );
  });

  test('シンプル枠の色と太さを変えると出力に反映される', async ({ page }) => {
    await page.goto('/tools/image-frame-maker/');
    await loadImage(page);
    await page.locator('#frame-preset').selectOption('simple');
    await setRange(page, '#frame-thickness', 10);
    await page.locator('#frame-color').fill('#0000ff');
    await expect(page.locator('#frame-size')).toHaveText(
      '元画像: 200 × 100 px → 出力: 220 × 120 px',
    );
    // 描画は次のフレームにまとめられるので、反映されるまで待つ
    await expect
      .poll(() =>
        page.locator('#frame-canvas').evaluate((el) => {
          const ctx = (el as HTMLCanvasElement).getContext('2d')!;
          return Array.from(ctx.getImageData(2, 2, 1, 1).data);
        }),
      )
      .toEqual([0, 0, 255, 255]);
  });

  test('角丸にすると四隅が透明になり、JPEGでは画質と注意が出る', async ({
    page,
  }) => {
    await page.goto('/tools/image-frame-maker/');
    await loadImage(page);
    await page.locator('#frame-preset').selectOption('rounded');
    await setRange(page, '#frame-radius', 30);
    await expect
      .poll(() =>
        page.locator('#frame-canvas').evaluate((el) => {
          const ctx = (el as HTMLCanvasElement).getContext('2d')!;
          return ctx.getImageData(0, 0, 1, 1).data[3];
        }),
      )
      .toBe(0);

    await expect(page.locator('#frame-quality-wrap')).toBeHidden();
    await page.locator('#frame-format [data-format="jpeg"]').click();
    await expect(page.locator('#frame-quality-wrap')).toBeVisible();
    await expect(page.locator('#frame-jpeg-note')).toBeVisible();
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#frame-download').click();
    expect((await downloadPromise).suggestedFilename()).toBe(
      'photo-framed.jpg',
    );
  });

  test('影付きで背景を透明にでき、axeに違反がない', async ({ page }) => {
    await page.goto('/tools/image-frame-maker/');
    await loadImage(page);
    await expect(page.locator('#frame-transparent')).toBeDisabled();
    await page.locator('#frame-preset').selectOption('shadow');
    await expect(page.locator('#frame-transparent')).toBeEnabled();
    await page.locator('#frame-transparent').check();
    await expect
      .poll(() =>
        page.locator('#frame-canvas').evaluate((el) => {
          const ctx = (el as HTMLCanvasElement).getContext('2d')!;
          return ctx.getImageData(0, 0, 1, 1).data[3];
        }),
      )
      .toBe(0);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });

  test('画像でないファイルはエラーになる', async ({ page }) => {
    await page.goto('/tools/image-frame-maker/');
    await page.locator('#frame-file').setInputFiles({
      name: 'a.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello'),
    });
    await expect(page.locator('#frame-error')).toBeVisible();
    await expect(page.locator('#frame-workspace')).toBeHidden();
  });
});

test.describe('Image Frame Maker (English)', () => {
  test('英語版が表示され、読み込める', async ({ page }) => {
    await page.goto('/en/tools/image-frame-maker/');
    await expect(page.locator('main h1')).toContainText('Add a Frame');
    await loadImage(page);
    await expect(page.locator('#frame-size')).toHaveText(
      'Source: 200 × 100 px → Output: 210 × 121 px',
    );
  });
});
