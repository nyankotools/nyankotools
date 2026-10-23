import { test, expect, type Page } from './helpers/test';

async function createTestPng(page: Page, w = 20, h = 20): Promise<Buffer> {
  // 透明な w x h の中央付近に 10x10 の赤い四角
  const dataUrl = await page.evaluate(
    ({ w, h }) => {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(5, 5, 10, 10);
      return canvas.toDataURL('image/png');
    },
    { w, h },
  );
  return Buffer.from(dataUrl.split(',')[1], 'base64');
}

async function upload(page: Page, name = 'cut.png', w = 20, h = 20) {
  await page.locator('#som-file').setInputFiles({
    name,
    mimeType: 'image/png',
    buffer: await createTestPng(page, w, h),
  });
}

test('読み込むまで操作欄は表示されない', async ({ page }) => {
  await page.goto('/tools/sticker-outline-maker/');
  await expect(page.locator('#som-workspace')).toBeHidden();
});

test('読み込むと縁取りの太さ分だけ出力サイズが増える', async ({ page }) => {
  await page.goto('/tools/sticker-outline-maker/');
  await upload(page);
  // 初期の太さ12px: 20 + 24 = 44
  await expect(page.locator('#som-size')).toContainText('44 × 44 px');
  await page.locator('#som-width').fill('2');
  await expect(page.locator('#som-size')).toContainText('24 × 24 px');
});

test('縁取りの色がプレビューに反映される', async ({ page }) => {
  await page.goto('/en/tools/sticker-outline-maker/');
  await upload(page);
  await page.locator('#som-width').fill('4');
  await page.locator('#som-color').fill('#0000ff');
  await expect
    .poll(() =>
      page.locator('#som-canvas').evaluate((el) => {
        const c = el as HTMLCanvasElement;
        // 元の四角の左端(x=5+4)から2px外側
        const p = c.getContext('2d')!.getImageData(7, 14, 1, 1).data;
        return Array.from(p).join(',');
      }),
    )
    .toBe('0,0,255,255');
});

test('透過PNGをダウンロードできる', async ({ page }) => {
  await page.goto('/tools/sticker-outline-maker/');
  await upload(page, 'cat.png');
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('#som-download').click(),
  ]);
  expect(download.suggestedFilename()).toBe('cat-sticker.png');
});

test('大きな画像は長辺2000pxに縮小され、375pxでも縦横比が崩れない', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/tools/sticker-outline-maker/');
  await upload(page, 'big.png', 3000, 1500);
  // 縮小後 2000 × 1000、縁取り12px分を足して 2024 × 1024
  await expect(page.locator('#som-size')).toContainText('2000 × 1000 px');
  const canvas = page.locator('#som-canvas');
  const intrinsic = await canvas.evaluate((el) => ({
    w: (el as HTMLCanvasElement).width,
    h: (el as HTMLCanvasElement).height,
  }));
  expect(intrinsic).toEqual({ w: 2024, h: 1024 });
  const box = await canvas.boundingBox();
  expect(box!.width).toBeLessThanOrEqual(375);
  expect(
    Math.abs(box!.width / box!.height - intrinsic.w / intrinsic.h),
  ).toBeLessThan(0.01);
});

test('画像でないファイルはエラー表示', async ({ page }) => {
  await page.goto('/tools/sticker-outline-maker/');
  await page.locator('#som-file').setInputFiles({
    name: 'a.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('x'),
  });
  await expect(page.locator('#som-error')).toBeVisible();
});
