import { test, expect, type Page } from './helpers/test';

/** 64x64の青緑グラデーションに、中央の32x32へ8pxブロックのモザイク(赤/黄の市松)を置いたPNGを生成する */
async function createTestPng(page: Page): Promise<Buffer> {
  const dataUrl = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    for (let y = 0; y < 64; y++) {
      for (let x = 0; x < 64; x++) {
        ctx.fillStyle = `rgb(${x * 2}, ${y * 2}, 100)`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    for (let by = 0; by < 4; by++) {
      for (let bx = 0; bx < 4; bx++) {
        ctx.fillStyle = (bx + by) % 2 === 0 ? '#ff0000' : '#ffff00';
        ctx.fillRect(16 + bx * 8, 16 + by * 8, 8, 8);
      }
    }
    return canvas.toDataURL('image/png');
  });
  return Buffer.from(dataUrl.split(',')[1], 'base64');
}

async function loadImage(page: Page) {
  await page.goto('/tools/mosaic-smoother/');
  const buffer = await createTestPng(page);
  await page
    .locator('#ms-file-input')
    .setInputFiles({ name: 'test.png', mimeType: 'image/png', buffer });
  await expect(page.locator('#ms-editor')).toBeVisible();
}

async function dragOnCanvas(
  page: Page,
  from: [number, number],
  to: [number, number],
) {
  // デスクトップ(1280x720)ではキャンバスが画面外に来るため、座標計算の前に表示位置へスクロールする
  await page.locator('#ms-canvas').scrollIntoViewIfNeeded();
  const box = (await page.locator('#ms-canvas').boundingBox())!;
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

function pixelAt(page: Page, x: number, y: number) {
  return page.evaluate(
    ({ x, y }) => {
      const c = document.getElementById('ms-canvas') as HTMLCanvasElement;
      const d = c.getContext('2d')!.getImageData(x, y, 1, 1).data;
      return [d[0], d[1], d[2]];
    },
    { x, y },
  );
}

test('初期状態では編集エリアが非表示', async ({ page }) => {
  await page.goto('/tools/mosaic-smoother/');
  await expect(page.locator('#ms-dropzone')).toBeVisible();
  await expect(page.locator('#ms-editor')).toBeHidden();
});

test('モザイクを囲むとブロックを検出して滑らかな色に置き換わり、元に戻せる', async ({
  page,
}) => {
  await loadImage(page);
  // 赤(最初のブロック)の位置: 画像座標(20, 20)
  expect(await pixelAt(page, 20, 20)).toEqual([255, 0, 0]);

  // モザイク(16〜48)を少し大きめに囲む
  await dragOnCanvas(page, [0.15, 0.15], [0.85, 0.85]);
  await expect(page.locator('#ms-region-count')).toContainText('1');
  await expect(page.locator('#ms-detected')).toBeVisible();

  // 元は赤/黄の市松。置換後は周囲のグラデーション(ほぼ青緑寄り)に近づき、赤が残らない
  const [r, g, b] = await pixelAt(page, 20, 20);
  expect(r).toBeLessThan(200);
  expect(b).toBeGreaterThan(40);
  expect(g).toBeLessThan(200);

  await page.locator('#ms-undo-button').click();
  await expect(page.locator('#ms-region-count')).toContainText('0');
  expect(await pixelAt(page, 20, 20)).toEqual([255, 0, 0]);
});

test('自動検出をオフにするとブロックサイズのスライダーが出る', async ({
  page,
}) => {
  await loadImage(page);
  await expect(page.locator('#ms-block-wrap')).toBeHidden();
  await page.locator('#ms-auto').uncheck();
  await expect(page.locator('#ms-block-wrap')).toBeVisible();
});

test('複数範囲を適用してリセットできる', async ({ page }) => {
  await loadImage(page);
  await dragOnCanvas(page, [0.2, 0.2], [0.4, 0.4]);
  await dragOnCanvas(page, [0.6, 0.6], [0.8, 0.8]);
  await expect(page.locator('#ms-region-count')).toContainText('2');
  await page.locator('#ms-reset-button').click();
  await expect(page.locator('#ms-region-count')).toContainText('0');
  await expect(page.locator('#ms-undo-button')).toBeDisabled();
});

test('ダウンロードできる', async ({ page }) => {
  await loadImage(page);
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#ms-download-button').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('test-smoothed.png');
});

test('対応外ファイルでエラーが表示される', async ({ page }) => {
  await page.goto('/tools/mosaic-smoother/');
  await page.locator('#ms-file-input').setInputFiles({
    name: 'a.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('x'),
  });
  await expect(page.locator('#ms-error')).toBeVisible();
  await expect(page.locator('#ms-editor')).toBeHidden();
});

test('画像をクリアすると編集エリアが閉じる', async ({ page }) => {
  await loadImage(page);
  await page.locator('#ms-clear-button').click();
  await expect(page.locator('#ms-editor')).toBeHidden();
});

test.describe('スマホ幅の操作モード切替', () => {
  test.use({ viewport: { width: 375, height: 800 } });

  test('既定はスクロールモードで範囲選択されず、「範囲を選択」で選択できる', async ({
    page,
  }) => {
    await loadImage(page);
    await dragOnCanvas(page, [0.15, 0.15], [0.85, 0.85]);
    await expect(page.locator('#ms-region-count')).toContainText('0');

    await page.locator('[data-touch="select"]').click();
    await expect(page.locator('#ms-canvas')).toHaveCSS('touch-action', 'none');
    await dragOnCanvas(page, [0.15, 0.15], [0.85, 0.85]);
    await expect(page.locator('#ms-region-count')).toContainText('1');
  });
});
