import { test, expect, type Page } from './helpers/test';

/** 全面が赤の200x100のPNGを生成する */
async function createTestPng(page: Page): Promise<Buffer> {
  const dataUrl = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 100;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, 200, 100);
    return canvas.toDataURL('image/png');
  });
  return Buffer.from(dataUrl.split(',')[1], 'base64');
}

async function loadImage(page: Page) {
  await page.goto('/tools/image-reveal-mask/');
  const buffer = await createTestPng(page);
  await page
    .locator('#rm-file-input')
    .setInputFiles({ name: 'test.png', mimeType: 'image/png', buffer });
  await expect(page.locator('#rm-editor')).toBeVisible();
}

/** キャンバス上の画像座標(x, y)のRGBAを返す(選択枠の描画を避けるため図形の選択を外してから呼ぶ) */
function pixelAt(page: Page, x: number, y: number) {
  return page.evaluate(
    ({ x, y }) => {
      const c = document.getElementById('rm-canvas') as HTMLCanvasElement;
      return Array.from(c.getContext('2d')!.getImageData(x, y, 1, 1).data);
    },
    { x, y },
  );
}

/** キャンバスを表示領域に入れてからその位置を返す(マウス操作は視口内の座標で行うため) */
async function canvasBox(page: Page) {
  const canvas = page.locator('#rm-canvas');
  await canvas.scrollIntoViewIfNeeded();
  return (await canvas.boundingBox())!;
}

async function clickEmptyArea(page: Page) {
  const box = await canvasBox(page);
  await page.mouse.click(box.x + 3, box.y + 3);
}

test('図形がなければ全面が覆われ、図形を追加すると中央がくり抜かれる', async ({
  page,
}) => {
  await loadImage(page);
  expect(await pixelAt(page, 100, 50)).toEqual([0, 0, 0, 255]);

  await page.locator('#rm-add-kind').selectOption('rect');
  await page.locator('#rm-add-button').click();
  await expect(page.locator('#rm-shape-count')).toContainText('1');
  await clickEmptyArea(page);

  // 中央は元の赤、四隅は覆いの黒のまま
  expect(await pixelAt(page, 100, 50)).toEqual([255, 0, 0, 255]);
  expect(await pixelAt(page, 2, 2)).toEqual([0, 0, 0, 255]);
});

test('反転すると図形の内側が覆われる', async ({ page }) => {
  await loadImage(page);
  await page.locator('#rm-add-button').click();
  await clickEmptyArea(page);
  await page.locator('#rm-invert').check();
  expect(await pixelAt(page, 100, 50)).toEqual([0, 0, 0, 255]);
  expect(await pixelAt(page, 2, 2)).toEqual([255, 0, 0, 255]);
});

test('覆いの濃さを下げると元画像が透ける', async ({ page }) => {
  await loadImage(page);
  await page.locator('#rm-opacity').fill('50');
  const [r] = await pixelAt(page, 2, 2);
  expect(r).toBeGreaterThan(100);
  expect(r).toBeLessThan(160);
});

test('図形をドラッグで移動し、削除できる', async ({ page }) => {
  await loadImage(page);
  await page.locator('#rm-add-button').click();
  const box = await canvasBox(page);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2, {
    steps: 4,
  });
  await page.mouse.up();
  await clickEmptyArea(page);
  // 元の中心はくり抜きが外れ、移動先がくり抜かれる
  expect(await pixelAt(page, 100, 50)).toEqual([0, 0, 0, 255]);
  expect(await pixelAt(page, 40, 50)).toEqual([255, 0, 0, 255]);

  await page.mouse.click(box.x + box.width * 0.2, box.y + box.height / 2);
  await page.locator('#rm-delete-button').click();
  await expect(page.locator('#rm-shape-count')).toContainText('0');
});

/** 画像座標(x, y)をキャンバス上の表示座標(ページ上の絶対座標)へ変換する */
function toScreen(
  box: { x: number; y: number; width: number; height: number },
  x: number,
  y: number,
) {
  // キャンバスは 200x100 の画像を表示幅いっぱいに描いている
  const scale = box.width / 200;
  return { x: box.x + x * scale, y: box.y + y * scale };
}

test('四隅をドラッグすると拡大縮小できる', async ({ page }) => {
  await loadImage(page);
  await page.locator('#rm-add-button').click();
  const box = await canvasBox(page);
  // 既定の矩形は中心(100,50)、49x35。南東の角は(124.5, 67.5)
  const corner = toScreen(box, 124.5, 67.5);
  await page.mouse.move(corner.x, corner.y);
  await page.mouse.down();
  const target = toScreen(box, 160, 80);
  await page.mouse.move(target.x, target.y, { steps: 4 });
  await page.mouse.up();
  await clickEmptyArea(page);
  // 中心固定で幅120x高さ60に広がる。新しい端の内側は元画像の赤、外側は覆い
  expect(await pixelAt(page, 150, 75)).toEqual([255, 0, 0, 255]);
  expect(await pixelAt(page, 170, 50)).toEqual([0, 0, 0, 255]);
});

test('回転ハンドルで図形を回転できる', async ({ page }) => {
  await loadImage(page);
  await page.locator('#rm-add-button').click();
  const box = await canvasBox(page);
  // 回転ハンドルは上端から28px(表示)上。画像座標に換算すると 50 - 17.5 - 28*200/表示幅
  const handleY = 50 - 17.5 - (28 * 200) / box.width;
  const handle = toScreen(box, 100, handleY);
  await page.mouse.move(handle.x, handle.y);
  await page.mouse.down();
  // 真右へ向けると90度回転し、横長の矩形が縦長になる
  const east = toScreen(box, 160, 50);
  await page.mouse.move(east.x, east.y, { steps: 4 });
  await page.mouse.up();
  await clickEmptyArea(page);
  expect(await pixelAt(page, 100, 70)).toEqual([255, 0, 0, 255]);
  expect(await pixelAt(page, 130, 50)).toEqual([0, 0, 0, 255]);
});

test('複製すると図形が2つになり、形式を変えてダウンロードできる', async ({
  page,
}) => {
  await loadImage(page);
  await page.locator('#rm-add-button').click();
  await page.locator('#rm-duplicate-button').click();
  await expect(page.locator('#rm-shape-count')).toContainText('2');

  const webp = page.getByRole('button', { name: 'WebP', exact: true });
  await webp.click();
  await expect(webp).toHaveAttribute('aria-pressed', 'true');
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#rm-download-button').click();
  expect((await downloadPromise).suggestedFilename()).toBe('test-reveal.webp');

  await page.getByRole('button', { name: 'JPEG', exact: true }).click();
  const jpegPromise = page.waitForEvent('download');
  await page.locator('#rm-download-button').click();
  expect((await jpegPromise).suggestedFilename()).toBe('test-reveal.jpg');
});

test('スマホ幅では既定でスクロール優先になり、編集に切り替えると図形を動かせる', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await loadImage(page);
  const canvas = page.locator('#rm-canvas');
  // 既定はスクロール: タッチ操作を canvas が奪わない
  expect(
    await canvas.evaluate((el) => (el as HTMLElement).style.touchAction),
  ).toBe('pan-x pan-y');

  await page.locator('#rm-add-button').click();
  const box = await canvasBox(page);
  const start = toScreen(box, 100, 50);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  const moved = toScreen(box, 40, 50);
  await page.mouse.move(moved.x, moved.y, { steps: 4 });
  await page.mouse.up();
  await clickEmptyArea(page);
  // スクロールモードでは動かない(中心はまだくり抜かれたまま)
  expect(await pixelAt(page, 100, 50)).toEqual([255, 0, 0, 255]);

  await page.locator('#rm-touch-mode [data-touch="edit"]').click();
  expect(
    await canvas.evaluate((el) => (el as HTMLElement).style.touchAction),
  ).toBe('none');
  const box2 = await canvasBox(page);
  const start2 = toScreen(box2, 100, 50);
  await page.mouse.move(start2.x, start2.y);
  await page.mouse.down();
  const moved2 = toScreen(box2, 40, 50);
  await page.mouse.move(moved2.x, moved2.y, { steps: 4 });
  await page.mouse.up();
  await clickEmptyArea(page);
  expect(await pixelAt(page, 100, 50)).toEqual([0, 0, 0, 255]);
  expect(await pixelAt(page, 40, 50)).toEqual([255, 0, 0, 255]);
});

test('PNGをダウンロードできる', async ({ page }) => {
  await loadImage(page);
  await page.locator('#rm-add-button').click();
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#rm-download-button').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('test-reveal.png');
});

test('画像以外のファイルはエラーになる', async ({ page }) => {
  await page.goto('/tools/image-reveal-mask/');
  await page.locator('#rm-file-input').setInputFiles({
    name: 'a.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('hello'),
  });
  await expect(page.locator('#rm-error')).toBeVisible();
  await expect(page.locator('#rm-editor')).toBeHidden();
});
