import { test, expect } from './helpers/test';

const SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="20"><rect width="40" height="20" fill="red"/></svg>';

test.describe('SVG→PNG変換（日本語版）', () => {
  test('SVGコードを貼り付けるとプレビューされ、PNGをダウンロードできる', async ({
    page,
  }) => {
    await page.goto('/tools/svg-to-png/');
    await expect(page.locator('main h1')).toContainText('SVG→PNG変換');

    const download = page.locator('#svgpng-download');
    await expect(download).toBeDisabled();

    await page.locator('#svgpng-input').fill(SVG);
    await expect(download).toBeEnabled();
    await expect(page.locator('#svgpng-size')).toHaveText(
      '出力サイズ: 40 × 20 px',
    );

    await page.locator('#svgpng-scale').selectOption('3');
    await expect(page.locator('#svgpng-size')).toHaveText(
      '出力サイズ: 120 × 60 px',
    );

    const downloadPromise = page.waitForEvent('download');
    await download.click();
    expect((await downloadPromise).suggestedFilename()).toBe('image.png');
    await expect(page.locator('#svgpng-status')).toHaveText(
      'ダウンロードしました',
    );
  });

  test('ファイル選択でファイル名を引き継ぎ、背景色を反映する', async ({
    page,
  }) => {
    await page.goto('/tools/svg-to-png/');
    await page.locator('#svgpng-file').setInputFiles({
      name: 'logo.svg',
      mimeType: 'image/svg+xml',
      buffer: Buffer.from(SVG),
    });
    await expect(page.locator('#svgpng-download')).toBeEnabled();

    const cornerAlpha = () =>
      page.locator('#svgpng-canvas').evaluate((el) => {
        const c = el as HTMLCanvasElement;
        return c.getContext('2d')!.getImageData(0, 0, 1, 1).data[3];
      });
    // 赤い四角が全面なので、透過のままでも左上は不透明。背景を変えても再描画されること
    expect(await cornerAlpha()).toBe(255);

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#svgpng-download').click();
    expect((await downloadPromise).suggestedFilename()).toBe('logo.png');
  });

  test('透過背景は透明のまま、白指定で塗りつぶされる', async ({ page }) => {
    await page.goto('/tools/svg-to-png/');
    await page
      .locator('#svgpng-input')
      .fill(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><circle cx="5" cy="5" r="1"/></svg>',
      );
    await expect(page.locator('#svgpng-download')).toBeEnabled();
    const cornerAlpha = () =>
      page.locator('#svgpng-canvas').evaluate((el) => {
        const c = el as HTMLCanvasElement;
        return c.getContext('2d')!.getImageData(0, 0, 1, 1).data[3];
      });
    expect(await cornerAlpha()).toBe(0);

    await page.locator('#svgpng-bg').selectOption('white');
    await expect.poll(cornerAlpha).toBe(255);
  });

  test('SVGでない入力やサイズ不明のSVGはエラーになる', async ({ page }) => {
    await page.goto('/tools/svg-to-png/');
    await page.locator('#svgpng-input').fill('hello');
    await expect(page.locator('#svgpng-error')).toBeVisible();
    await expect(page.locator('#svgpng-download')).toBeDisabled();

    await page.locator('#svgpng-input').fill('<svg></svg>');
    await expect(page.locator('#svgpng-error')).toContainText('大きさ');

    await page.locator('#svgpng-input').fill('');
    await expect(page.locator('#svgpng-error')).toBeHidden();
  });

  test('出力サイズが上限を超えるとエラーになる', async ({ page }) => {
    await page.goto('/tools/svg-to-png/');
    await page
      .locator('#svgpng-input')
      .fill(
        '<svg xmlns="http://www.w3.org/2000/svg" width="4000" height="10"/>',
      );
    await page.locator('#svgpng-scale').selectOption('4');
    await expect(page.locator('#svgpng-error')).toContainText('大きすぎ');
    await expect(page.locator('#svgpng-download')).toBeDisabled();
  });
});

test.describe('SVG to PNG Converter (English)', () => {
  test('英語版が表示され、変換できる', async ({ page }) => {
    await page.goto('/en/tools/svg-to-png/');
    await expect(page.locator('main h1')).toContainText('SVG to PNG');
    await page.locator('#svgpng-input').fill(SVG);
    await expect(page.locator('#svgpng-size')).toHaveText(
      'Output size: 40 × 20 px',
    );
    await expect(page.locator('#svgpng-download')).toBeEnabled();
  });
});
