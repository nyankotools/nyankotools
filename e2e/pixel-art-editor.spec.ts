import { test, expect, type Page } from './helpers/test';

const URL = '/tools/pixel-art-editor/';

/** 16x16キャンバスのセル(cx, cy)の中心をページ座標で返す */
async function cellCenter(page: Page, cx: number, cy: number, size = 16) {
  // キャンバスが画面外（720px未満）だと座標クリックが届かないので先にスクロールする
  await page.locator('#pa-canvas').scrollIntoViewIfNeeded();
  const box = (await page.locator('#pa-canvas').boundingBox())!;
  return {
    x: box.x + ((cx + 0.5) / size) * box.width,
    y: box.y + ((cy + 0.5) / size) * box.height,
  };
}

async function clickCell(page: Page, cx: number, cy: number) {
  const p = await cellCenter(page, cx, cy);
  await page.mouse.click(p.x, p.y);
}

/**
 * セル(cx, cy)の中心ピクセルのRGBを返す（16x16 = 1セル32px）。
 * 透明セルは市松模様（(x+y)が偶数なら#fff、奇数なら#e5e7eb）で描かれるので、
 * 消えた状態を検証するときは (x+y) が偶数のセルを使うこと。
 */
function cellColor(page: Page, cx: number, cy: number) {
  return page.evaluate(
    ({ cx, cy }) => {
      const c = document.getElementById('pa-canvas') as HTMLCanvasElement;
      const cell = c.width / 16;
      const d = c
        .getContext('2d')!
        .getImageData(cx * cell + cell / 2, cy * cell + cell / 2, 1, 1).data;
      return [d[0], d[1], d[2]];
    },
    { cx, cy },
  );
}

test('ペンで描け、元に戻す・やり直すができる', async ({ page }) => {
  await page.goto(URL);
  await expect(page.locator('#pa-undo')).toBeDisabled();
  await clickCell(page, 2, 4);
  expect(await cellColor(page, 2, 4)).toEqual([0, 0, 0]);
  await expect(page.locator('#pa-undo')).toBeEnabled();

  await page.locator('#pa-undo').click();
  expect(await cellColor(page, 2, 4)).toEqual([255, 255, 255]);
  await expect(page.locator('#pa-redo')).toBeEnabled();
  await page.locator('#pa-redo').click();
  expect(await cellColor(page, 2, 4)).toEqual([0, 0, 0]);
});

test('パレットの色で描き、消しゴムで消せる', async ({ page }) => {
  await page.goto(URL);
  await page.locator('#pa-palette [data-color="#be2633"]').click();
  await clickCell(page, 1, 1);
  expect(await cellColor(page, 1, 1)).toEqual([0xbe, 0x26, 0x33]);

  await page.locator('[data-tool="eraser"]').click();
  await clickCell(page, 1, 1);
  expect(await cellColor(page, 1, 1)).toEqual([255, 255, 255]);
});

test('ドラッグで連続して描ける', async ({ page }) => {
  await page.goto(URL);
  const a = await cellCenter(page, 2, 2);
  const b = await cellCenter(page, 8, 2);
  await page.mouse.move(a.x, a.y);
  await page.mouse.down();
  await page.mouse.move(b.x, b.y, { steps: 3 });
  await page.mouse.up();
  for (const x of [2, 5, 8]) {
    expect(await cellColor(page, x, 2)).toEqual([0, 0, 0]);
  }
  // 1回のドラッグは1回のUndoで戻る
  await page.locator('#pa-undo').click();
  expect(await cellColor(page, 4, 2)).toEqual([255, 255, 255]);
  await expect(page.locator('#pa-undo')).toBeDisabled();
});

test('塗りつぶしとスポイトが動く', async ({ page }) => {
  await page.goto(URL);
  await page.locator('[data-tool="fill"]').click();
  await clickCell(page, 0, 0);
  expect(await cellColor(page, 15, 15)).toEqual([0, 0, 0]);

  await page.locator('#pa-palette [data-color="#31a2f2"]').click();
  await page.locator('[data-tool="picker"]').click();
  await clickCell(page, 7, 7);
  await expect(page.locator('#pa-color')).toHaveValue('#000000');
});

test('キャンバスサイズを変えられ、元に戻せる', async ({ page }) => {
  await page.goto(URL);
  await clickCell(page, 0, 0);
  await page.locator('#pa-size [data-size="32"]').click();
  await expect(page.locator('#pa-size [data-size="32"]')).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.locator('#pa-export-info')).toContainText('256×256');
  await page.locator('#pa-undo').click();
  await expect(page.locator('#pa-size [data-size="16"]')).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});

test('拡大率に応じた出力サイズが表示される', async ({ page }) => {
  await page.goto(URL);
  await expect(page.locator('#pa-export-info')).toContainText('128×128');
  await page.locator('#pa-scale').selectOption('16');
  await expect(page.locator('#pa-export-info')).toContainText('256×256');
});

test('PNGをダウンロードできる', async ({ page }) => {
  await page.goto(URL);
  await clickCell(page, 2, 2);
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#pa-download').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('pixel-art-16x16-x8.png');
});

test('パレットに好きな色を追加できる', async ({ page }) => {
  await page.goto(URL);
  await page.locator('#pa-color').fill('#123456');
  await page.locator('#pa-add-color').click();
  await expect(
    page.locator('#pa-palette [data-color="#123456"]'),
  ).toHaveAttribute('aria-pressed', 'true');
  await clickCell(page, 4, 4);
  expect(await cellColor(page, 4, 4)).toEqual([0x12, 0x34, 0x56]);
});

test.describe('タッチ操作', () => {
  test.use({ hasTouch: true });

  test('タップで描け、Undoボタンで戻せる', async ({ page }) => {
    await page.goto(URL);
    const p = await cellCenter(page, 4, 6);
    await page.touchscreen.tap(p.x, p.y);
    expect(await cellColor(page, 4, 6)).toEqual([0, 0, 0]);
    await page.locator('#pa-undo').tap();
    expect(await cellColor(page, 4, 6)).toEqual([255, 255, 255]);
  });
});

test('Ctrl+Zで元に戻せる', async ({ page }) => {
  await page.goto(URL);
  await clickCell(page, 6, 6);
  await page.keyboard.press('Control+z');
  expect(await cellColor(page, 6, 6)).toEqual([255, 255, 255]);
});
