import { test, expect } from './helpers/test';

test.describe('OGP画像ジェネレーター（日本語版）', () => {
  test('初期表示で1200×630のプレビューが描画され、PNGをダウンロードできる', async ({
    page,
  }) => {
    await page.goto('/tools/ogp-image-generator/');
    await expect(page.locator('main h1')).toContainText(
      'OGP画像ジェネレーター',
    );

    const canvas = page.locator('#ogp-canvas');
    const size = () =>
      canvas.evaluate((el) => {
        const c = el as HTMLCanvasElement;
        return [c.width, c.height];
      });
    expect(await size()).toEqual([1200, 630]);

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#ogp-download').click();
    expect((await downloadPromise).suggestedFilename()).toBe(
      'ogp-1200x630.png',
    );
    await expect(page.locator('#ogp-status')).toHaveText(
      'ダウンロードしました',
    );
  });

  test('画像サイズの変更でキャンバスとファイル名が変わる', async ({ page }) => {
    await page.goto('/tools/ogp-image-generator/');
    await page.locator('#ogp-size').selectOption('square');
    const canvas = page.locator('#ogp-canvas');
    await expect
      .poll(() => canvas.evaluate((el) => (el as HTMLCanvasElement).height))
      .toBe(1080);

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#ogp-download').click();
    expect((await downloadPromise).suggestedFilename()).toBe(
      'ogp-1080x1080.png',
    );
  });

  test('背景色の指定がキャンバスに反映される', async ({ page }) => {
    await page.goto('/tools/ogp-image-generator/');
    await page.locator('#ogp-bg').selectOption('solid');
    await page.locator('#ogp-color1').fill('#ff0000');
    await expect(page.locator('#ogp-color2-wrap')).toBeHidden();
    const pixel = await page.locator('#ogp-canvas').evaluate((el) => {
      const c = el as HTMLCanvasElement;
      return Array.from(c.getContext('2d')!.getImageData(2, 2, 1, 1).data);
    });
    expect(pixel).toEqual([255, 0, 0, 255]);
  });

  test('非常に長いタイトルでもエラーにならず描画できる', async ({ page }) => {
    await page.goto('/tools/ogp-image-generator/');
    await page.locator('#ogp-title').fill('あ'.repeat(200));
    await expect(page.locator('#ogp-error')).toBeHidden();
    await expect(page.locator('#ogp-download')).toBeEnabled();
  });
});

test.describe('OGP Image Generator (English)', () => {
  test('英語版が表示される', async ({ page }) => {
    await page.goto('/en/tools/ogp-image-generator/');
    await expect(page.locator('main h1')).toContainText('OGP Image Generator');
    await expect(page.locator('#ogp-title')).toHaveValue(
      'Make your OGP image in the browser',
    );
  });
});
