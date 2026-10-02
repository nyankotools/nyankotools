import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { test, expect } from './helpers/test';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// 48x32 の小さな実HEIC（pillow-heif で生成）。wasmデコードまで実際に通すために使う。
const sampleHeic = path.join(__dirname, 'fixtures', 'sample.heic');

test('HEICをJPEGに変換してダウンロードできる（wasm・CSPを通した実変換）', async ({
  page,
}) => {
  const violations: string[] = [];
  page.on('console', (msg) => {
    if (/Content Security Policy|CSP/i.test(msg.text()))
      violations.push(msg.text());
  });

  await page.goto('/tools/heic-converter/');
  await page.locator('#hc-file-input').setInputFiles(sampleHeic);

  const download = page.locator('[data-download]');
  await expect(download).toHaveAttribute('href', /^blob:/, { timeout: 30000 });
  await expect(download).toHaveAttribute('download', 'sample.jpg');
  await expect(page.locator('#hc-file-count')).toContainText('1');
  await expect(page.locator('[data-filename]')).toHaveText('sample.heic');

  // 実際にダウンロードし、出力が本当にJPEG（FFD8）であることを確認する
  const [dl] = await Promise.all([
    page.waitForEvent('download'),
    download.click(),
  ]);
  const file = await dl.path();
  const bytes = fs.readFileSync(file);
  expect([bytes[0], bytes[1]]).toEqual([0xff, 0xd8]);

  // PNGへ切り替えると画質スライダーが無効になり、出力がPNGになる
  await page.locator('[data-format="png"]').click();
  await expect(page.locator('#hc-quality')).toBeDisabled();
  await expect(download).toHaveAttribute('download', 'sample.png');
  await expect(page.locator('#hc-quality-note')).toBeVisible();

  expect(violations).toEqual([]);
});

test('HEIC以外のファイルはエラーになり一覧に追加されない', async ({ page }) => {
  await page.goto('/tools/heic-converter/');
  const txt = path.join(__dirname, 'temp-heic-test.txt');
  fs.writeFileSync(txt, 'not a heic');
  try {
    await page.locator('#hc-file-input').setInputFiles(txt);
    await expect(page.locator('#hc-error')).toBeVisible();
    await expect(page.locator('#hc-file-count')).toHaveText('');
    await expect(page.locator('#hc-results-section')).toBeHidden();
  } finally {
    fs.unlinkSync(txt);
  }
});

test('削除・すべてクリアで一覧が空になる', async ({ page }) => {
  await page.goto('/tools/heic-converter/');
  await page.locator('#hc-file-input').setInputFiles([sampleHeic, sampleHeic]);
  await expect(page.locator('[data-download]')).toHaveCount(2, {
    timeout: 30000,
  });

  await page.locator('[data-remove]').first().click();
  await expect(page.locator('[data-download]')).toHaveCount(1);

  await page.locator('#hc-clear-button').click();
  await expect(page.locator('#hc-file-count')).toHaveText('');
  await expect(page.locator('#hc-results-section')).toBeHidden();
  await expect(page.locator('#hc-clear-button')).toBeDisabled();
});
