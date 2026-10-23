import { test, expect } from './helpers/test';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PNG_1X1 = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49,
  0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06,
  0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44,
  0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00, 0x05, 0x00, 0x01, 0x0d,
  0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42,
  0x60, 0x82,
]);

test('画像を読み込むと目標サイズ以下の圧縮結果が表示される', async ({
  page,
}) => {
  await page.goto('/tools/image-compress-to-size/');
  const pngPath = path.join(__dirname, 'temp-ics.png');
  fs.writeFileSync(pngPath, PNG_1X1);
  try {
    await page.locator('#ics-file-input').setInputFiles(pngPath);
    await expect(page.locator('#ics-file-count')).toContainText('1');
    await expect(page.locator('#ics-results-section')).toBeVisible();
    await expect(page.locator('[data-filename]')).toContainText('temp-ics.png');
    await expect(page.locator('[data-download]')).toBeEnabled();
    await expect(page.locator('[data-size]')).toContainText('圧縮後');

    // WebPに切り替えても結果が出る
    await page.locator('[data-format="webp"]').click();
    await expect(page.locator('[data-format="webp"]')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(page.locator('[data-download]')).toBeEnabled();
  } finally {
    if (fs.existsSync(pngPath)) fs.unlinkSync(pngPath);
  }
});

test('目標サイズに0を入力するとエラーが表示される', async ({ page }) => {
  await page.goto('/tools/image-compress-to-size/');
  const pngPath = path.join(__dirname, 'temp-ics2.png');
  fs.writeFileSync(pngPath, PNG_1X1);
  try {
    await page.locator('#ics-file-input').setInputFiles(pngPath);
    await expect(page.locator('[data-download]')).toBeEnabled();
    await page.locator('#ics-target').fill('0');
    await expect(page.locator('#ics-error')).toBeVisible();
  } finally {
    if (fs.existsSync(pngPath)) fs.unlinkSync(pngPath);
  }
});

test('圧縮結果をダウンロードするとJPEGのバイト列が得られる', async ({
  page,
}) => {
  await page.goto('/tools/image-compress-to-size/');
  const pngPath = path.join(__dirname, 'temp-ics4.png');
  fs.writeFileSync(pngPath, PNG_1X1);
  try {
    await page.locator('#ics-file-input').setInputFiles(pngPath);
    await expect(page.locator('[data-download]')).toBeEnabled();
    const downloadPromise = page.waitForEvent('download');
    await page.locator('[data-download]').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('temp-ics4-compressed.jpg');
    const data = fs.readFileSync((await download.path())!);
    // JPEG SOI マーカー
    expect(data.subarray(0, 2)).toEqual(Buffer.from([0xff, 0xd8]));
  } finally {
    if (fs.existsSync(pngPath)) fs.unlinkSync(pngPath);
  }
});

test('クリアボタンで結果が消える', async ({ page }) => {
  await page.goto('/en/tools/image-compress-to-size/');
  const pngPath = path.join(__dirname, 'temp-ics3.png');
  fs.writeFileSync(pngPath, PNG_1X1);
  try {
    await page.locator('#ics-file-input').setInputFiles(pngPath);
    await expect(page.locator('#ics-clear-button')).toBeEnabled();
    await page.locator('#ics-clear-button').click();
    await expect(page.locator('#ics-results-section')).toBeHidden();
    await expect(page.locator('#ics-file-count')).toHaveText('');
  } finally {
    if (fs.existsSync(pngPath)) fs.unlinkSync(pngPath);
  }
});
