import { test, expect, type Page } from './helpers/test';

/** 左半分が赤・右半分が青の200x100のPNGを生成する */
async function createTestPng(page: Page): Promise<Buffer> {
  const dataUrl = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 100;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, 100, 100);
    ctx.fillStyle = '#0000ff';
    ctx.fillRect(100, 0, 100, 100);
    return canvas.toDataURL('image/png');
  });
  return Buffer.from(dataUrl.split(',')[1], 'base64');
}

async function loadImage(page: Page) {
  await page.goto('/tools/image-blur-mosaic/');
  const buffer = await createTestPng(page);
  await page
    .locator('#bm-file-input')
    .setInputFiles({ name: 'test.png', mimeType: 'image/png', buffer });
  await expect(page.locator('#bm-editor')).toBeVisible();
}

async function dragOnCanvas(
  page: Page,
  from: [number, number],
  to: [number, number],
) {
  const box = (await page.locator('#bm-canvas').boundingBox())!;
  await page.mouse.move(
    box.x + box.width * from[0],
    box.y + box.height * from[1],
  );
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * to[0], box.y + box.height * to[1], {
    steps: 4,
  });
  await page.mouse.up();
}

/** キャンバス上の画像座標(x, y)のRGBを返す */
function pixelAt(page: Page, x: number, y: number) {
  return page.evaluate(
    ({ x, y }) => {
      const c = document.getElementById('bm-canvas') as HTMLCanvasElement;
      const d = c.getContext('2d')!.getImageData(x, y, 1, 1).data;
      return [d[0], d[1], d[2]];
    },
    { x, y },
  );
}

test('初期状態では編集エリアが非表示', async ({ page }) => {
  await page.goto('/tools/image-blur-mosaic/');
  await expect(page.locator('#bm-dropzone')).toBeVisible();
  await expect(page.locator('#bm-editor')).toBeHidden();
});

test('塗りつぶしを範囲指定すると色が置き換わり、元に戻せる', async ({
  page,
}) => {
  await loadImage(page);
  await page.locator('[data-mode="fill"]').click();
  await expect(page.locator('#bm-color-wrap')).toBeVisible();
  await page.locator('#bm-color').fill('#00ff00');

  await dragOnCanvas(page, [0.1, 0.1], [0.4, 0.9]);
  await expect(page.locator('#bm-region-count')).toContainText('1');
  expect(await pixelAt(page, 40, 50)).toEqual([0, 255, 0]);
  // 範囲外は元のまま
  expect(await pixelAt(page, 150, 50)).toEqual([0, 0, 255]);

  await page.locator('#bm-undo-button').click();
  await expect(page.locator('#bm-region-count')).toContainText('0');
  expect(await pixelAt(page, 40, 50)).toEqual([255, 0, 0]);
});

test('複数範囲を適用してリセットできる', async ({ page }) => {
  await loadImage(page);
  await page.locator('[data-mode="fill"]').click();
  await dragOnCanvas(page, [0.05, 0.1], [0.3, 0.9]);
  await dragOnCanvas(page, [0.6, 0.1], [0.9, 0.9]);
  await expect(page.locator('#bm-region-count')).toContainText('2');

  await page.locator('#bm-reset-button').click();
  await expect(page.locator('#bm-region-count')).toContainText('0');
  await expect(page.locator('#bm-undo-button')).toBeDisabled();
  expect(await pixelAt(page, 150, 50)).toEqual([0, 0, 255]);
});

test('ぼかし選択時に注意書きが表示される', async ({ page }) => {
  await loadImage(page);
  await expect(page.locator('#bm-blur-warning')).toBeHidden();
  await page.locator('[data-mode="blur"]').click();
  await expect(page.locator('#bm-blur-warning')).toBeVisible();
  await page.locator('[data-mode="mosaic"]').click();
  await expect(page.locator('#bm-blur-warning')).toBeHidden();
});

test('モザイクを適用すると境界の色が混ざる', async ({ page }) => {
  await loadImage(page);
  await page.locator('#bm-strength').fill('80');
  // 赤青の境界をまたぐ範囲
  await dragOnCanvas(page, [0.25, 0.1], [0.75, 0.9]);
  const left = await pixelAt(page, 60, 50);
  expect(left[0]).toBeGreaterThan(0);
  expect(left[2]).toBeGreaterThan(0);
});

test('ダウンロードできる', async ({ page }) => {
  await loadImage(page);
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#bm-download-button').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('test-masked.png');
});

test('対応外ファイルでエラーが表示される', async ({ page }) => {
  await page.goto('/tools/image-blur-mosaic/');
  await page.locator('#bm-file-input').setInputFiles({
    name: 'a.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('x'),
  });
  await expect(page.locator('#bm-error')).toBeVisible();
  await expect(page.locator('#bm-editor')).toBeHidden();
});

test('画像をクリアすると編集エリアが閉じる', async ({ page }) => {
  await loadImage(page);
  await page.locator('#bm-clear-button').click();
  await expect(page.locator('#bm-editor')).toBeHidden();
});

test.describe('スマホ幅の操作モード切替', () => {
  test.use({ viewport: { width: 375, height: 800 } });

  test('既定はスクロールモードで範囲選択されず、「範囲を選択」で選択できる', async ({
    page,
  }) => {
    await loadImage(page);
    const canvas = page.locator('#bm-canvas');
    await expect(page.locator('#bm-touch-mode')).toBeVisible();
    await expect(canvas).toHaveCSS('touch-action', 'pan-x pan-y');

    await page.locator('[data-mode="fill"]').click();
    await dragOnCanvas(page, [0.1, 0.1], [0.4, 0.9]);
    await expect(page.locator('#bm-region-count')).toContainText('0');

    await page.locator('[data-touch="select"]').click();
    await expect(canvas).toHaveCSS('touch-action', 'none');
    await dragOnCanvas(page, [0.1, 0.1], [0.4, 0.9]);
    await expect(page.locator('#bm-region-count')).toContainText('1');
  });
});

test('PC幅では操作モード切替が表示されず常に範囲選択できる', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await loadImage(page);
  await expect(page.locator('#bm-touch-mode')).toBeHidden();
  await expect(page.locator('#bm-canvas')).toHaveCSS('touch-action', 'none');
});
