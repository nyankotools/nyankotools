import AxeBuilder from '@axe-core/playwright';
import { test, expect, type Page } from './helpers/test';

const URL = '/tools/screenshot-annotator/';

/** 400x300 の白いPNGをブラウザ内で作ってアップロードする */
async function loadImage(page: Page) {
  const b64 = await page.evaluate(() => {
    const c = document.createElement('canvas');
    c.width = 400;
    c.height = 300;
    const g = c.getContext('2d')!;
    g.fillStyle = '#ffffff';
    g.fillRect(0, 0, 400, 300);
    return c.toDataURL('image/png').split(',')[1];
  });
  await page.locator('#sa-file-input').setInputFiles({
    name: 'shot.png',
    mimeType: 'image/png',
    buffer: Buffer.from(b64, 'base64'),
  });
  await expect(page.locator('#sa-editor')).toBeVisible();
}

/** 画像座標(ix, iy)に対応するページ座標 */
async function imagePoint(page: Page, ix: number, iy: number) {
  await page.locator('#sa-canvas').scrollIntoViewIfNeeded();
  const box = (await page.locator('#sa-canvas').boundingBox())!;
  return {
    x: box.x + (ix / 400) * box.width,
    y: box.y + (iy / 300) * box.height,
  };
}

function pixel(page: Page, x: number, y: number) {
  return page.evaluate(
    ({ x, y }) => {
      const c = document.getElementById('sa-canvas') as HTMLCanvasElement;
      const d = c.getContext('2d')!.getImageData(x, y, 1, 1).data;
      return [d[0], d[1], d[2]];
    },
    { x, y },
  );
}

test('番号バッジが連番で入り、元に戻せる', async ({ page }) => {
  await page.goto(URL);
  await loadImage(page);
  await page.locator('[data-tool="badge"]').click();
  const a = await imagePoint(page, 100, 100);
  const b = await imagePoint(page, 250, 100);
  await page.mouse.click(a.x, a.y);
  await page.mouse.click(b.x, b.y);
  await expect(page.locator('#sa-count')).toContainText('2');
  // バッジの塗り（既定色 #e11d48）が描かれている。中心は白い数字と重なるため、
  // 半径12pxの円の内側で数字に当たらない位置（中心から左に6px）を見る
  expect(await pixel(page, 94, 100)).toEqual([225, 29, 72]);

  await page.locator('#sa-undo-button').click();
  await expect(page.locator('#sa-count')).toContainText('1');
  expect(await pixel(page, 250, 100)).toEqual([255, 255, 255]);
  await page.locator('#sa-reset-button').click();
  await expect(page.locator('#sa-undo-button')).toBeDisabled();
});

test('枠をドラッグで描け、削除ツールで消せる', async ({ page }) => {
  await page.goto(URL);
  await loadImage(page);
  await page.locator('[data-tool="rect"]').click();
  const a = await imagePoint(page, 50, 50);
  const b = await imagePoint(page, 200, 150);
  await page.mouse.move(a.x, a.y);
  await page.mouse.down();
  await page.mouse.move(b.x, b.y, { steps: 4 });
  await page.mouse.up();
  await expect(page.locator('#sa-count')).toContainText('1');
  expect(await pixel(page, 50, 100)).not.toEqual([255, 255, 255]);

  await page.locator('[data-tool="erase"]').click();
  const edge = await imagePoint(page, 50, 100);
  await page.mouse.click(edge.x, edge.y);
  await expect(page.locator('#sa-count')).toContainText('0');
  expect(await pixel(page, 50, 100)).toEqual([255, 255, 255]);
});

test('PNGをダウンロードできる', async ({ page }) => {
  await page.goto(URL);
  await loadImage(page);
  await page.locator('[data-tool="text"]').click();
  await expect(page.locator('#sa-text')).toBeVisible();
  const p = await imagePoint(page, 80, 80);
  await page.mouse.click(p.x, p.y);
  await expect(page.locator('#sa-count')).toContainText('1');
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#sa-download-button').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('shot-annotated.png');
});

test('非対応のファイルはエラーになる', async ({ page }) => {
  await page.goto(URL);
  await page.locator('#sa-file-input').setInputFiles({
    name: 'a.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('hello'),
  });
  await expect(page.locator('#sa-error')).toBeVisible();
  await expect(page.locator('#sa-editor')).toBeHidden();
});

test('画像読み込み後の編集画面でaxeの違反がない', async ({ page }) => {
  await page.goto(URL);
  await loadImage(page);
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});
