import { test, expect, type Page } from './helpers/test';

/** ブラウザ内で左半分が赤・右半分が青のPNGを作り、ファイル入力に渡す */
async function loadImage(page: Page, name = 'photo.png', w = 40, h = 20) {
  await page.evaluate(
    async ({ name, w, h }) => {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = 'red';
      ctx.fillRect(0, 0, w / 2, h);
      ctx.fillStyle = 'blue';
      ctx.fillRect(w / 2, 0, w / 2, h);
      const blob = await new Promise<Blob>((r) => c.toBlob((b) => r(b!)));
      const dt = new DataTransfer();
      dt.items.add(new File([blob], name, { type: 'image/png' }));
      const input = document.getElementById('crop-file') as HTMLInputElement;
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    },
    { name, w, h },
  );
}

test.describe('画像トリミング・回転・反転（日本語版）', () => {
  test('読み込むと全体が選択され、数値で範囲を絞ってダウンロードできる', async ({
    page,
  }) => {
    await page.goto('/tools/image-cropper/');
    await expect(page.locator('main h1')).toContainText('画像トリミング');
    await expect(page.locator('#crop-workspace')).toBeHidden();

    await loadImage(page);
    await expect(page.locator('#crop-workspace')).toBeVisible();
    await expect(page.locator('#crop-size')).toHaveText(
      '出力サイズ: 40 × 20 px',
    );

    await page.locator('#crop-w').fill('10');
    await page.locator('#crop-w').blur();
    await expect(page.locator('#crop-size')).toHaveText(
      '出力サイズ: 10 × 20 px',
    );

    // 範囲は画像の外にはみ出さない
    await page.locator('#crop-x').fill('35');
    await page.locator('#crop-x').blur();
    await expect(page.locator('#crop-w')).toHaveValue('5');

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#crop-download').click();
    expect((await downloadPromise).suggestedFilename()).toBe(
      'photo-cropped.png',
    );
    await expect(page.locator('#crop-status')).toHaveText(
      'ダウンロードしました',
    );
  });

  test('回転で縦横が入れ替わり、範囲が全体に戻る', async ({ page }) => {
    await page.goto('/tools/image-cropper/');
    await loadImage(page);
    await page.locator('#crop-w').fill('10');
    await page.locator('#crop-w').blur();

    await page.getByRole('button', { name: '右に回転' }).click();
    await expect(page.locator('#crop-size')).toHaveText(
      '出力サイズ: 20 × 40 px',
    );
    // 右回転で、左の赤い半分が上に来る
    const topPixel = await page.locator('#crop-canvas').evaluate((el) => {
      const c = el as HTMLCanvasElement;
      return Array.from(c.getContext('2d')!.getImageData(5, 5, 1, 1).data);
    });
    expect(topPixel).toEqual([255, 0, 0, 255]);

    await page.getByRole('button', { name: '左右反転' }).click();
    await expect(
      page.getByRole('button', { name: '左右反転' }),
    ).toHaveAttribute('aria-pressed', 'true');
  });

  test('縦横比を選ぶと範囲がその比率になる', async ({ page }) => {
    await page.goto('/tools/image-cropper/');
    await loadImage(page);
    await page.locator('#crop-aspect').selectOption('1:1');
    await expect(page.locator('#crop-size')).toHaveText(
      '出力サイズ: 20 × 20 px',
    );
    await page.locator('#crop-aspect').selectOption('16:9');
    await page.getByRole('button', { name: '全体を選択' }).click();
    await expect(page.locator('#crop-size')).toHaveText(
      '出力サイズ: 36 × 20 px',
    );
  });

  test('プレビュー上のドラッグで範囲を選べる', async ({ page }) => {
    await page.goto('/tools/image-cropper/');
    await loadImage(page, 'a.png', 400, 200);
    const box = (await page.locator('#crop-canvas').boundingBox())!;
    const sx = box.width / 400;
    await page.mouse.move(box.x + 100 * sx, box.y + 50 * sx);
    await page.mouse.down();
    await page.mouse.move(box.x + 300 * sx, box.y + 150 * sx, { steps: 5 });
    await page.mouse.up();
    const w = Number(await page.locator('#crop-w').inputValue());
    const h = Number(await page.locator('#crop-h').inputValue());
    expect(Math.abs(w - 200)).toBeLessThanOrEqual(3);
    expect(Math.abs(h - 100)).toBeLessThanOrEqual(3);
  });

  test('保存形式をJPEGにすると画質スライダーが現れ、拡張子が変わる', async ({
    page,
  }) => {
    await page.goto('/tools/image-cropper/');
    await loadImage(page, 'shot.png');
    await expect(page.locator('#crop-quality-wrap')).toBeHidden();
    await page.locator('#crop-format [data-format="jpeg"]').click();
    await expect(page.locator('#crop-quality-wrap')).toBeVisible();

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#crop-download').click();
    expect((await downloadPromise).suggestedFilename()).toBe(
      'shot-cropped.jpg',
    );
  });

  test('画像でないファイルはエラーになる', async ({ page }) => {
    await page.goto('/tools/image-cropper/');
    await page.locator('#crop-file').setInputFiles({
      name: 'a.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello'),
    });
    await expect(page.locator('#crop-error')).toBeVisible();
    await expect(page.locator('#crop-workspace')).toBeHidden();
  });
});

test.describe('Image Cropper (English)', () => {
  test('英語版が表示され、読み込める', async ({ page }) => {
    await page.goto('/en/tools/image-cropper/');
    await expect(page.locator('main h1')).toContainText('Image Cropper');
    await loadImage(page);
    await expect(page.locator('#crop-size')).toHaveText(
      'Output size: 40 × 20 px',
    );
  });
});
