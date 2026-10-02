import { test, expect, type Page } from './helpers/test';

/** ブラウザ内で「白背景の中央に赤い10×10の四角」のPNG（20×20）を作り、ファイル入力に渡す */
async function loadImage(page: Page, name = 'item.png') {
  await page.evaluate(async (name) => {
    const c = document.createElement('canvas');
    c.width = 20;
    c.height = 20;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 20, 20);
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(5, 5, 10, 10);
    const blob = await new Promise<Blob>((r) => c.toBlob((b) => r(b!)));
    const dt = new DataTransfer();
    dt.items.add(new File([blob], name, { type: 'image/png' }));
    const input = document.getElementById('bgr-file') as HTMLInputElement;
    input.files = dt.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }, name);
}

const alphaAt = (page: Page, x: number, y: number) =>
  page.locator('#bgr-canvas').evaluate(
    (el, [px, py]) => {
      const c = el as HTMLCanvasElement;
      return c.getContext('2d')!.getImageData(px, py, 1, 1).data[3];
    },
    [x, y],
  );

test.describe('画像の背景透過（日本語版）', () => {
  test('白い背景が透明になり、赤い四角は残る', async ({ page }) => {
    await page.goto('/tools/image-background-remover/');
    await expect(page.locator('main h1')).toContainText('画像の背景透過');
    await expect(page.locator('#bgr-workspace')).toBeHidden();
    await expect(page.locator('#bgr-download')).toBeDisabled();

    await loadImage(page);
    await expect(page.locator('#bgr-workspace')).toBeVisible();
    await expect(page.locator('#bgr-size')).toHaveText(
      '出力サイズ: 20 × 20 px',
    );
    await expect(page.locator('#bgr-color')).toHaveValue('#ffffff');
    expect(await alphaAt(page, 0, 0)).toBe(0);
    expect(await alphaAt(page, 10, 10)).toBe(255);

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#bgr-download').click();
    expect((await downloadPromise).suggestedFilename()).toBe(
      'item-transparent.png',
    );
    await expect(page.locator('#bgr-status')).toHaveText(
      'ダウンロードしました',
    );
  });

  test('輪郭の太さを上げると余白が増え、輪郭が付く', async ({ page }) => {
    await page.goto('/tools/image-background-remover/');
    await loadImage(page);
    await page.locator('#bgr-erode').fill('0');
    await page.locator('#bgr-outline-width').fill('3');
    await expect(page.locator('#bgr-size')).toHaveText(
      '出力サイズ: 26 × 26 px',
    );
    // 赤い四角は元の(5,5)→余白3で(8,8)。その2px外側(6,10)は輪郭、隅(0,0)は透明
    await expect.poll(() => alphaAt(page, 6, 10)).toBe(255);
    expect(await alphaAt(page, 0, 0)).toBe(0);
  });

  test('スポイトで続けてクリックすると透過が追加され、一つ前に戻せる', async ({
    page,
  }) => {
    await page.goto('/tools/image-background-remover/');
    await loadImage(page);
    await page.locator('#bgr-mode [data-mode="global"]').click();
    await expect(page.locator('#bgr-undo')).toBeDisabled();
    const box = (await page.locator('#bgr-canvas').boundingBox())!;
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await expect(page.locator('#bgr-color')).toHaveValue('#ff0000');
    // 白は透明のまま、赤も追加で透明になる
    await expect.poll(() => alphaAt(page, 10, 10)).toBe(0);
    expect(await alphaAt(page, 0, 0)).toBe(0);

    await expect(page.locator('#bgr-undo')).toBeEnabled();
    await page.getByRole('button', { name: '一つ前に戻る' }).click();
    await expect.poll(() => alphaAt(page, 10, 10)).toBe(255);
    expect(await alphaAt(page, 0, 0)).toBe(0);
    await expect(page.locator('#bgr-undo')).toBeDisabled();
  });

  test('プレビューを拡大・縮小・画面に合わせるで切り替えられる', async ({
    page,
  }) => {
    await page.goto('/tools/image-background-remover/');
    await loadImage(page);
    const width = () =>
      page
        .locator('#bgr-canvas')
        .evaluate((el) => el.getBoundingClientRect().width);
    const fit = await width();
    await page.getByRole('button', { name: '拡大', exact: true }).click();
    await expect.poll(width).toBeGreaterThan(fit);
    await page.getByRole('button', { name: '画面に合わせる' }).click();
    await expect.poll(width).toBe(fit);
    await page.getByRole('button', { name: '縮小' }).click();
    await expect.poll(width).toBeLessThan(fit);
  });

  test('画像でないファイルはエラーになる', async ({ page }) => {
    await page.goto('/tools/image-background-remover/');
    await page.locator('#bgr-file').setInputFiles({
      name: 'a.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello'),
    });
    await expect(page.locator('#bgr-error')).toBeVisible();
    await expect(page.locator('#bgr-workspace')).toBeHidden();
  });

  test('拡大時のクリック座標が正しく計算される', async ({ page }) => {
    await page.goto('/tools/image-background-remover/');
    await loadImage(page);
    // モード: global、キャンバスの左上(0,0)が白、中央(10,10)が赤
    await page.locator('#bgr-mode [data-mode="global"]').click();
    // 画面サイズを縮小時の状態に設定し、その後拡大
    const zoomIn = page.getByRole('button', { name: '拡大', exact: true });
    // 拡大を複数回クリックして4倍に
    for (let i = 0; i < 2; i++) await zoomIn.click();
    // getBoundingClientRectの座標は拡大後のキャンバスサイズに基づく
    const box = (await page.locator('#bgr-canvas').boundingBox())!;
    // キャンバスが4倍になっているので、元画像の中央(10,10)は表示上(40,40)付近
    const displayCenterX = box.x + 10 * 4;
    const displayCenterY = box.y + 10 * 4;
    await page.mouse.click(displayCenterX, displayCenterY);
    // クリック後、中央の赤色が背景色として追加される
    await expect(page.locator('#bgr-color')).toHaveValue('#ff0000');
  });

  test('375px幅でレイアウトが崩れない', async ({ page }) => {
    page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/tools/image-background-remover/');
    await loadImage(page);
    // ワークスペースが表示される
    await expect(page.locator('#bgr-workspace')).toBeVisible();
    // キャンバスが表示される
    const canvas = page.locator('#bgr-canvas');
    await expect(canvas).toBeVisible();
    // キャンバスが水平方向にスクロール可能な状態になる
    const box = (await page.locator('#bgr-canvas').boundingBox())!;
    expect(box.width).toBeGreaterThan(0);
  });
});

test.describe('Image Background Remover (English)', () => {
  test('英語版が表示され、処理できる', async ({ page }) => {
    await page.goto('/en/tools/image-background-remover/');
    await expect(page.locator('main h1')).toContainText(
      'Image Background Remover',
    );
    await loadImage(page);
    await expect(page.locator('#bgr-size')).toHaveText(
      'Output size: 20 × 20 px',
    );
  });
});
