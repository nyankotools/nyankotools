import { test, expect, type Page } from './helpers/test';

async function upload(page: Page) {
  const dataUrl = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 120;
    canvas.height = 80;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, 120, 80);
    return canvas.toDataURL('image/png');
  });
  await page.locator('#cbs-file-input').setInputFiles({
    name: 'red.png',
    mimeType: 'image/png',
    buffer: Buffer.from(dataUrl.split(',')[1], 'base64'),
  });
  await expect(page.locator('#cbs-results-section')).toBeVisible();
}

test('カラーコードの見え方が一覧表示される', async ({ page }) => {
  await page.goto('/tools/color-blindness-simulator/');
  const rows = page.locator('#cbs-color-list [data-row]');
  await expect(rows).toHaveCount(5);
  await expect(rows.first().locator('[data-hex-a]')).toHaveText('#e53935');
  await expect(
    page.locator('[data-row="achromatopsia"] [data-ratio]'),
  ).not.toHaveText('');
});

test('不正なカラーコードでエラー表示', async ({ page }) => {
  await page.goto('/tools/color-blindness-simulator/');
  await page.locator('#cbs-color-a').fill('zzz');
  await expect(page.locator('#cbs-color-error')).toBeVisible();
  await page.locator('#cbs-color-a').fill('#fff');
  await expect(page.locator('#cbs-color-error')).toBeHidden();
});

test('程度0%では元の色と同じになる', async ({ page }) => {
  await page.goto('/en/tools/color-blindness-simulator/');
  await page.locator('#cbs-severity').fill('0');
  await expect(page.locator('[data-row="protanopia"] [data-hex-a]')).toHaveText(
    '#e53935',
  );
});

test('画像を読み込むと5つのプレビューとダウンロード', async ({ page }) => {
  await page.goto('/tools/color-blindness-simulator/');
  await upload(page);
  await expect(page.locator('#cbs-source-info')).toContainText('120×80px');
  await expect(page.locator('[data-canvas]')).toHaveCount(5);
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('[data-download="protanopia"]').click(),
  ]);
  expect(download.suggestedFilename()).toBe('red-protanopia.png');
});

test('非対応ファイルはエラー表示、クリアで戻る', async ({ page }) => {
  await page.goto('/tools/color-blindness-simulator/');
  await page.locator('#cbs-file-input').setInputFiles({
    name: 'a.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('x'),
  });
  await expect(page.locator('#cbs-error')).toBeVisible();
  await upload(page);
  await page.locator('#cbs-clear-button').click();
  await expect(page.locator('#cbs-results-section')).toBeHidden();
});
