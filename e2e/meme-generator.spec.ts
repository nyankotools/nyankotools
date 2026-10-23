import { test, expect, type Page } from './helpers/test';

/** ブラウザ内で単色（白）のPNGを作り、ファイル入力に渡す */
async function loadImage(page: Page, name = 'photo.png', w = 400, h = 300) {
  await page.evaluate(
    async ({ name, w, h }) => {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      const blob = await new Promise<Blob>((r) => c.toBlob((b) => r(b!)));
      const dt = new DataTransfer();
      dt.items.add(new File([blob], name, { type: 'image/png' }));
      const input = document.getElementById('meme-file') as HTMLInputElement;
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    },
    { name, w, h },
  );
}

/** canvasの指定した行範囲に白以外のピクセルがあるか */
const hasInkInRows = (page: Page, from: number, to: number) =>
  page.locator('#meme-canvas').evaluate(
    (el, [from, to]) => {
      const c = el as HTMLCanvasElement;
      const d = c
        .getContext('2d')!
        .getImageData(0, from, c.width, to - from).data;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i] !== 255 || d[i + 1] !== 255 || d[i + 2] !== 255) return true;
      }
      return false;
    },
    [from, to],
  );

test.describe('ミーム画像ジェネレーター（日本語版）', () => {
  test('読み込むと上下に見本の文字が入りダウンロードできる', async ({
    page,
  }) => {
    await page.goto('/tools/meme-generator/');
    await expect(page.locator('main h1')).toContainText('ミーム画像');
    await expect(page.locator('#meme-workspace')).toBeHidden();

    await loadImage(page);
    await expect(page.locator('#meme-workspace')).toBeVisible();
    await expect(page.locator('#meme-top')).toHaveValue('ここに上の文字');
    await expect(page.locator('#meme-size-info')).toHaveText(
      '出力サイズ: 400 × 300 px',
    );
    expect(await hasInkInRows(page, 0, 90)).toBe(true);
    expect(await hasInkInRows(page, 210, 300)).toBe(true);
    // 中央は何も描かれない
    expect(await hasInkInRows(page, 100, 200)).toBe(false);

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#meme-download').click();
    expect((await downloadPromise).suggestedFilename()).toBe('photo-meme.png');
    await expect(page.locator('#meme-status')).toHaveText(
      'ダウンロードしました',
    );
  });

  test('下の文字を空にすると下側には何も描かれない', async ({ page }) => {
    await page.goto('/tools/meme-generator/');
    await loadImage(page);
    await page.locator('#meme-bottom').fill('');
    expect(await hasInkInRows(page, 210, 300)).toBe(false);
    expect(await hasInkInRows(page, 0, 90)).toBe(true);
  });

  test('長い文章は折り返して画像の端からはみ出さない', async ({ page }) => {
    await page.goto('/tools/meme-generator/');
    await loadImage(page);
    await page
      .locator('#meme-top')
      .fill('THIS IS A VERY LONG CAPTION THAT MUST WRAP TO FIT THE IMAGE');
    await expect(page.locator('#meme-warning')).toBeHidden();
    expect(await hasInkInRows(page, 0, 120)).toBe(true);
  });

  test('保存形式をJPEGにすると拡張子が変わる', async ({ page }) => {
    await page.goto('/tools/meme-generator/');
    await loadImage(page, 'shot.png');
    await page.locator('#meme-format [data-format="jpeg"]').click();
    await expect(page.locator('#meme-quality-wrap')).toBeVisible();
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#meme-download').click();
    expect((await downloadPromise).suggestedFilename()).toBe('shot-meme.jpg');
  });

  test('大きな画像でも375pxで縦横比が崩れない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/tools/meme-generator/');
    await loadImage(page, 'big.png', 3000, 1000);
    await expect(page.locator('#meme-workspace')).toBeVisible();
    const canvas = page.locator('#meme-canvas');
    const intrinsic = await canvas.evaluate((el) => ({
      w: (el as HTMLCanvasElement).width,
      h: (el as HTMLCanvasElement).height,
    }));
    expect(intrinsic.w).toBeGreaterThan(375);
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
    await page.goto('/tools/meme-generator/');
    await page.locator('#meme-file').setInputFiles({
      name: 'a.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello'),
    });
    await expect(page.locator('#meme-error')).toBeVisible();
    await expect(page.locator('#meme-workspace')).toBeHidden();
  });
});

test.describe('Meme Generator (English)', () => {
  test('英語版が表示され、読み込める', async ({ page }) => {
    await page.goto('/en/tools/meme-generator/');
    await expect(page.locator('main h1')).toContainText('Meme Generator');
    await loadImage(page);
    await expect(page.locator('#meme-top')).toHaveValue('TOP TEXT');
    await expect(page.locator('#meme-size-info')).toHaveText(
      'Output size: 400 × 300 px',
    );
  });
});
