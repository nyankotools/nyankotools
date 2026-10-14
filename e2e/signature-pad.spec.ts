import { readFile } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import { test, expect, type Download, type Page } from './helpers/test';

/**
 * ダウンロードされたPNGのバイト列をブラウザでデコードし、サイズ・左上隅のα・
 * 描画されたピクセル数（α>0）を返す。画面上のcanvasではなく実ファイルを検証するため。
 */
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
    const d = ctx.getImageData(0, 0, c.width, c.height).data;
    let inkPixels = 0;
    for (let i = 3; i < d.length; i += 4) if (d[i] !== 0) inkPixels++;
    return {
      width: bmp.width,
      height: bmp.height,
      cornerAlpha: d[3],
      inkPixels,
    };
  }, bytes);
}

/** キャンバス上で対角線を1本引く（ボタン操作で画面外に出ていても描けるようスクロールする） */
async function drawLine(page: Page) {
  const canvas = page.locator('#sig-canvas');
  await canvas.scrollIntoViewIfNeeded();
  const box = (await canvas.boundingBox())!;
  await page.mouse.move(box.x + 40, box.y + 40);
  await page.mouse.down();
  await page.mouse.move(box.x + 120, box.y + 90, { steps: 5 });
  await page.mouse.up();
}

test.describe('手書き署名作成（日本語版）', () => {
  test('描くとボタンが有効になり、透過PNGをダウンロードできる', async ({
    page,
  }) => {
    await page.goto('/tools/signature-pad/');
    await expect(page.locator('main h1')).toContainText('署名');
    await expect(page.locator('#sig-download')).toBeDisabled();

    await drawLine(page);
    await expect(page.locator('#sig-download')).toBeEnabled();
    await expect(page.locator('#sig-info')).toContainText('出力サイズ');

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#sig-download').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('signature.png');
    const png = await readDownloadedPng(page, download);
    // 背景は透明（左上隅のαは0）で、線の部分にはインクがある
    expect(png.cornerAlpha).toBe(0);
    expect(png.inkPixels).toBeGreaterThan(0);
    await expect(page.locator('#sig-status')).toHaveText(
      'ダウンロードしました',
    );
  });

  test('描いた状態でaxeの違反がない', async ({ page }) => {
    await page.goto('/tools/signature-pad/');
    await drawLine(page);
    await expect(page.locator('#sig-info')).toContainText('出力サイズ');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });

  test('1つ戻す・すべて消すで空に戻る', async ({ page }) => {
    await page.goto('/tools/signature-pad/');
    await drawLine(page);
    await drawLine(page);
    await page.locator('#sig-undo').click();
    await expect(page.locator('#sig-clear')).toBeEnabled();
    await page.locator('#sig-undo').click();
    await expect(page.locator('#sig-download')).toBeDisabled();
    await drawLine(page);
    await page.locator('#sig-clear').click();
    await expect(page.locator('#sig-download')).toBeDisabled();
    await expect(page.locator('#sig-info')).toHaveText('');
  });

  test('余白トリムの有無で出力サイズが変わる', async ({ page }) => {
    await page.goto('/tools/signature-pad/');
    await drawLine(page);
    const trimmed = await page.locator('#sig-info').textContent();
    await page.locator('#sig-trim').uncheck();
    const full = await page.locator('#sig-info').textContent();
    expect(full).not.toBe(trimmed);
  });
});

test.describe('Online Signature Maker (English)', () => {
  test('英語版が表示される', async ({ page }) => {
    await page.goto('/en/tools/signature-pad/');
    await expect(page.locator('main h1')).toContainText('Signature Maker');
    await drawLine(page);
    await expect(page.locator('#sig-info')).toContainText('Output size');
  });
});
