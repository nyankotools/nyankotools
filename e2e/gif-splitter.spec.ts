import { readFileSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';
import { unzipSync } from 'fflate';
import { encodeGif } from '../src/lib/tools/gif-maker';
import { decodeGif } from '../src/lib/tools/gif-splitter';

/** 4×4・赤→緑の2コマ（200ms / 100ms）のGIF */
function sampleGif(): Buffer {
  const solid = (r: number, g: number, b: number, delayMs: number) => ({
    palette: Uint8Array.from([r, g, b, 0, 0, 0]),
    indices: new Uint8Array(16),
    delayMs,
  });
  return Buffer.from(
    encodeGif({
      width: 4,
      height: 4,
      loop: true,
      frames: [solid(255, 0, 0, 200), solid(0, 255, 0, 100)],
    }),
  );
}

test.describe('GIF分解（日本語版）', () => {
  test('GIFを読み込むとコマが並び、ZIP(PNG連番)を保存できる', async ({
    page,
  }) => {
    await page.goto('/tools/gif-splitter/');
    await expect(page.locator('main h1')).toContainText('GIF分解');
    await expect(page.locator('#gs-workspace')).toBeHidden();

    await page.locator('#gs-file').setInputFiles({
      name: 'test.gif',
      mimeType: 'image/gif',
      buffer: sampleGif(),
    });
    await expect(page.locator('#gs-frames li')).toHaveCount(2);
    await expect(page.locator('#gs-info')).toContainText('4 × 4 px・2コマ');
    await expect(page.locator('#gs-info')).toContainText('無限ループ');
    await expect(page.locator('#gs-selected')).toContainText('2 / 2');

    await page.locator('#gs-select-none').click();
    await expect(page.locator('#gs-selected')).toContainText('0 / 2');
    await page.locator('#gs-zip-button').click();
    await expect(page.locator('#gs-error')).toContainText('1つ以上');

    await page.locator('#gs-select-all').click();
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#gs-zip-button').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('test-frames.zip');
    const zip = readFileSync((await download.path())!);
    expect(zip.subarray(0, 2).toString('ascii')).toBe('PK');
    // 中身も検証: 2つのPNG（PNG署名・4×4）が入っている
    const entries = unzipSync(new Uint8Array(zip));
    expect(Object.keys(entries).sort()).toEqual([
      'frame-001.png',
      'frame-002.png',
    ]);
    for (const name of Object.keys(entries)) {
      const png = Buffer.from(entries[name]);
      expect(png.subarray(1, 4).toString('ascii')).toBe('PNG');
      expect(png.readUInt32BE(16)).toBe(4);
      expect(png.readUInt32BE(20)).toBe(4);
    }
  });

  test('倍率で表示時間を変えたGIFを作り、プレビューとダウンロードができる', async ({
    page,
  }) => {
    await page.goto('/tools/gif-splitter/');
    await page.locator('#gs-file').setInputFiles({
      name: 'test.gif',
      mimeType: 'image/gif',
      buffer: sampleGif(),
    });
    await expect(page.locator('#gs-frames li')).toHaveCount(2);

    await page.locator('#gs-value').fill('2');
    await page.locator('#gs-generate-button').click();
    await expect(page.locator('#gs-result')).toBeVisible();
    await expect(page.locator('#gs-result-info')).toContainText(
      '2コマ・合計0.15秒',
    );
    await expect
      .poll(() =>
        page
          .locator('#gs-preview')
          .evaluate((el) => (el as HTMLImageElement).naturalWidth),
      )
      .toBe(4);

    // コマの選択を変えると、前の結果は消える
    await page.locator('#gs-frames li input').first().uncheck();
    await expect(page.locator('#gs-result')).toBeHidden();

    await page.locator('#gs-mode').selectOption('fixed');
    await page.locator('#gs-value').fill('300');
    await page.locator('#gs-generate-button').click();
    await expect(page.locator('#gs-result-info')).toContainText(
      '1コマ・合計0.3秒',
    );

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#gs-download').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('test-edited.gif');
    const gifBytes = readFileSync((await download.path())!);
    expect(gifBytes.subarray(0, 6).toString('ascii')).toBe('GIF89a');
    // 再作成したGIFを読み戻し: 1コマ・表示時間300ms（固定）・4×4
    const again = decodeGif(new Uint8Array(gifBytes));
    expect(again.ok).toBe(true);
    if (again.ok) {
      expect(again.gif.width).toBe(4);
      expect(again.gif.frames.map((f) => f.delayMs)).toEqual([300]);
    }
  });

  test('GIFでないファイルと途中で切れたGIFはエラーになる', async ({ page }) => {
    await page.goto('/tools/gif-splitter/');
    await page.locator('#gs-file').setInputFiles({
      name: 'a.gif',
      mimeType: 'image/gif',
      buffer: Buffer.from('not a gif at all'),
    });
    await expect(page.locator('#gs-error')).toContainText('GIFファイルとして');
    await expect(page.locator('#gs-workspace')).toBeHidden();

    const cut = sampleGif().subarray(0, 40);
    await page
      .locator('#gs-file')
      .setInputFiles({ name: 'cut.gif', mimeType: 'image/gif', buffer: cut });
    await expect(page.locator('#gs-error')).toBeVisible();
    await expect(page.locator('#gs-workspace')).toBeHidden();
  });
});

test.describe('GIF分解 axe', () => {
  test('初期表示でaxeの違反がない（ja/en）', async ({ page }) => {
    for (const path of ['/tools/gif-splitter/', '/en/tools/gif-splitter/']) {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(
        results.violations.map((v) => v.id),
        path,
      ).toEqual([]);
    }
  });
});

test.describe('GIF Splitter (English)', () => {
  test('英語版が表示され、GIFを分解できる', async ({ page }) => {
    await page.goto('/en/tools/gif-splitter/');
    await expect(page.locator('main h1')).toContainText('GIF Splitter');
    await page.locator('#gs-file').setInputFiles({
      name: 'test.gif',
      mimeType: 'image/gif',
      buffer: sampleGif(),
    });
    await expect(page.locator('#gs-frames li')).toHaveCount(2);
    await expect(page.locator('#gs-info')).toContainText('2 frames');
  });
});
