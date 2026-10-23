import { test, expect, type Page } from './helpers/test';

/** ブラウザ内で単色のPNGを作り、指定のファイル入力に渡す */
async function loadImage(
  page: Page,
  inputId: string,
  color: string,
  name: string,
  w: number,
  h: number,
) {
  await page.evaluate(
    async ({ inputId, color, name, w, h }) => {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, w, h);
      const blob = await new Promise<Blob>((r) => c.toBlob((b) => r(b!)));
      const dt = new DataTransfer();
      dt.items.add(new File([blob], name, { type: 'image/png' }));
      const input = document.getElementById(inputId) as HTMLInputElement;
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    },
    { inputId, color, name, w, h },
  );
}

/** キャンバス上に赤いピクセルが1つでもあるか */
const hasRed = (page: Page) =>
  page.locator('#logo-canvas').evaluate((el) => {
    const c = el as HTMLCanvasElement;
    const d = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i] > 200 && d[i + 1] < 50 && d[i + 2] < 50) return true;
    }
    return false;
  });

/** 白地に半透明の赤（ピンク）が1つでもあるか（不透明度40%なら G/B は約153） */
const hasTranslucentRed = (page: Page) =>
  page.locator('#logo-canvas').evaluate((el) => {
    const c = el as HTMLCanvasElement;
    const d = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
    for (let i = 0; i < d.length; i += 4) {
      if (
        d[i] > 200 &&
        d[i + 1] > 110 &&
        d[i + 1] < 200 &&
        Math.abs(d[i + 1] - d[i + 2]) < 5
      )
        return true;
    }
    return false;
  });

test.describe('画像へのロゴ合成（日本語版）', () => {
  test('ロゴを選ぶまではダウンロードできず、選ぶと合成されて保存できる', async ({
    page,
  }) => {
    await page.goto('/tools/image-logo-watermark/');
    await expect(page.locator('#logo-workspace')).toBeHidden();

    await loadImage(page, 'logo-base-file', '#ffffff', 'photo.png', 400, 200);
    await expect(page.locator('#logo-workspace')).toBeVisible();
    await expect(page.locator('#logo-size-info')).toHaveText(
      '出力サイズ: 400 × 200 px',
    );
    await expect(page.locator('#logo-download')).toBeDisabled();
    expect(await hasRed(page)).toBe(false);

    await loadImage(page, 'logo-logo-file', '#ff0000', 'logo.png', 50, 50);
    await expect(page.locator('#logo-download')).toBeEnabled();
    expect(await hasRed(page)).toBe(true);

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#logo-download').click();
    expect((await downloadPromise).suggestedFilename()).toBe('photo-logo.png');
    await expect(page.locator('#logo-status')).toHaveText(
      'ダウンロードしました',
    );
  });

  test('敷き詰めを選ぶと余白欄が間隔欄に切り替わる', async ({ page }) => {
    await page.goto('/tools/image-logo-watermark/');
    await loadImage(page, 'logo-base-file', '#ffffff', 'photo.png', 400, 200);
    await loadImage(page, 'logo-logo-file', '#ff0000', 'logo.png', 50, 50);
    await expect(page.locator('#logo-margin-wrap')).toBeVisible();
    await page.locator('#logo-position').selectOption('tile');
    await expect(page.locator('#logo-gap-wrap')).toBeVisible();
    await expect(page.locator('#logo-margin-wrap')).toBeHidden();
    await page.locator('#logo-opacity').fill('40');
    await expect(page.locator('#logo-opacity-value')).toHaveText('40');
    expect(await hasTranslucentRed(page)).toBe(true);
    expect(await hasRed(page)).toBe(false);
  });

  test('JPEGを選ぶと拡張子が変わる', async ({ page }) => {
    await page.goto('/tools/image-logo-watermark/');
    await loadImage(page, 'logo-base-file', '#ffffff', 'shot.png', 200, 100);
    await loadImage(page, 'logo-logo-file', '#ff0000', 'logo.png', 20, 20);
    await page.locator('#logo-format [data-format="jpeg"]').click();
    await expect(page.locator('#logo-quality-wrap')).toBeVisible();
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#logo-download').click();
    expect((await downloadPromise).suggestedFilename()).toBe('shot-logo.jpg');
  });

  test('大きな画像でも375pxで縦横比が崩れず、横にはみ出さない', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/tools/image-logo-watermark/');
    await loadImage(page, 'logo-base-file', '#ffffff', 'big.png', 3000, 1000);
    await loadImage(page, 'logo-logo-file', '#ff0000', 'logo.png', 50, 50);
    await expect(page.locator('#logo-download')).toBeEnabled();
    const canvas = page.locator('#logo-canvas');
    const intrinsic = await canvas.evaluate((el) => ({
      w: (el as HTMLCanvasElement).width,
      h: (el as HTMLCanvasElement).height,
    }));
    expect(intrinsic).toEqual({ w: 3000, h: 1000 });
    const box = await canvas.boundingBox();
    expect(box!.width).toBeLessThanOrEqual(375);
    expect(
      Math.abs(box!.width / box!.height - intrinsic.w / intrinsic.h),
    ).toBeLessThan(0.01);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  });

  test('画像でないファイルはエラーになる', async ({ page }) => {
    await page.goto('/tools/image-logo-watermark/');
    await page.locator('#logo-base-file').setInputFiles({
      name: 'a.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello'),
    });
    await expect(page.locator('#logo-error')).toBeVisible();
    await expect(page.locator('#logo-workspace')).toBeHidden();
  });
});

test.describe('Add Logo Watermark to Image (English)', () => {
  test('英語版が表示され、読み込める', async ({ page }) => {
    await page.goto('/en/tools/image-logo-watermark/');
    await expect(page.locator('main h1')).toContainText('Logo');
    await loadImage(page, 'logo-base-file', '#ffffff', 'photo.png', 400, 200);
    await expect(page.locator('#logo-size-info')).toHaveText(
      'Output size: 400 × 200 px',
    );
  });
});
