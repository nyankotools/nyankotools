import { readFile } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import { test, expect, type Download, type Page } from './helpers/test';

/** ダウンロードされたPNGをデコードし、左上隅のα・インク（α>0）のピクセル数を返す */
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
    return { cornerAlpha: d[3], inkPixels };
  }, bytes);
}

/** キャンバスに透明でないピクセルがあるか */
const hasInk = (page: Page) =>
  page.locator('#seal-canvas').evaluate((el) => {
    const c = el as HTMLCanvasElement;
    const d = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
    for (let i = 3; i < d.length; i += 4) if (d[i] !== 0) return true;
    return false;
  });

/** 左上の隅（図形の外）が透明か */
const cornerTransparent = (page: Page) =>
  page.locator('#seal-canvas').evaluate((el) => {
    const c = el as HTMLCanvasElement;
    return c.getContext('2d')!.getImageData(0, 0, 1, 1).data[3] === 0;
  });

test.describe('電子印鑑・日付印ジェネレーター（日本語版）', () => {
  test('初期表示で丸印が描かれ、背景は透明で、注意書きが見える', async ({
    page,
  }) => {
    await page.goto('/tools/seal-stamp-generator/');
    await expect(page.locator('main h1')).toContainText('電子印鑑');
    await expect(page.locator('#seal-root')).toContainText('実印');
    expect(await hasInk(page)).toBe(true);
    expect(await cornerTransparent(page)).toBe(true);
    await expect(page.locator('#seal-text')).toHaveValue('にゃんこ\nツール');
    // 実印・銀行印の代用にならない旨の注意書きが、ツール本体の近くに見えている
    await expect(
      page.getByText('代わりにはならず', { exact: false }),
    ).toBeVisible();
  });

  test('透過PNGをダウンロードできる', async ({ page }) => {
    await page.goto('/tools/seal-stamp-generator/');
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#seal-download').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('seal-round.png');
    // 実ファイルの左上隅は透明で、印影（インク）が含まれること
    const png = await readDownloadedPng(page, download);
    expect(png.cornerAlpha).toBe(0);
    expect(png.inkPixels).toBeGreaterThan(0);
    await expect(page.locator('#seal-status')).toHaveText(
      'ダウンロードしました',
    );
  });

  test('日付印の画面でaxeの違反がない', async ({ page }) => {
    await page.goto('/tools/seal-stamp-generator/');
    await page.locator('#seal-kind').selectOption('date');
    await expect(page.locator('#seal-date-wrap')).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });

  test('日付印を選ぶと下段・日付の欄が表示される', async ({ page }) => {
    await page.goto('/tools/seal-stamp-generator/');
    await expect(page.locator('#seal-sub-wrap')).toBeHidden();
    await page.locator('#seal-kind').selectOption('date');
    await expect(page.locator('#seal-sub-wrap')).toBeVisible();
    await expect(page.locator('#seal-date-wrap')).toBeVisible();
    await expect(page.locator('#seal-orientation-wrap')).toBeHidden();
    await page.locator('#seal-date').fill('2026-10-14');
    await page.locator('#seal-datestyle').selectOption('era');
    expect(await hasInk(page)).toBe(true);
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#seal-download').click();
    expect((await downloadPromise).suggestedFilename()).toBe('seal-date.png');
  });

  test('文字を空にすると案内が出てダウンロードできない', async ({ page }) => {
    await page.goto('/tools/seal-stamp-generator/');
    await page.locator('#seal-text').fill('');
    await expect(page.locator('#seal-empty')).toBeVisible();
    await expect(page.locator('#seal-download')).toBeDisabled();
  });

  test('色のプリセットを選ぶと色が変わる', async ({ page }) => {
    await page.goto('/tools/seal-stamp-generator/');
    await page.locator('.seal-preset[data-color="#1f3f9e"]').click();
    await expect(page.locator('#seal-color')).toHaveValue('#1f3f9e');
  });
});

test.describe('Hanko Stamp Maker (English)', () => {
  test('英語版が表示され、角印を描ける', async ({ page }) => {
    await page.goto('/en/tools/seal-stamp-generator/');
    await expect(page.locator('main h1')).toContainText('Hanko');
    await page.locator('#seal-kind').selectOption('square');
    expect(await hasInk(page)).toBe(true);
    // 注意書き（disclaimer）は本文の注意事項にも同じ語句があるため、先頭文で一意に指定する
    await expect(
      page.getByText('The stamp made here is only an image', { exact: false }),
    ).toBeVisible();
  });
});
