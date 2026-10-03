import { test, expect, type Page } from './helpers/test';

/** ブラウザ内で単色（白）のPNGを作り、ファイル入力に渡す */
async function loadImage(page: Page, name = 'photo.png', w = 400, h = 200) {
  await page.evaluate(
    async ({ name, w, h }) => {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      const blob = await new Promise<Blob>((r) => c.toBlob((b) => r(b!)));
      const dt = new DataTransfer();
      dt.items.add(new File([blob], name, { type: 'image/png' }));
      const input = document.getElementById('overlay-file') as HTMLInputElement;
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    },
    { name, w, h },
  );
}

/** 画像のうち、白以外のピクセルが1つでもあるか */
const hasInk = (page: Page) =>
  page.locator('#overlay-canvas').evaluate((el) => {
    const c = el as HTMLCanvasElement;
    const d = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i] !== 255 || d[i + 1] !== 255 || d[i + 2] !== 255) return true;
    }
    return false;
  });

test.describe('画像への文字入れ・透かし（日本語版）', () => {
  test('読み込むと初期文字が入り、画像に文字が描かれてダウンロードできる', async ({
    page,
  }) => {
    await page.goto('/tools/image-text-overlay/');
    await expect(page.locator('main h1')).toContainText('文字入れ');
    await expect(page.locator('#overlay-workspace')).toBeHidden();

    await loadImage(page);
    await expect(page.locator('#overlay-workspace')).toBeVisible();
    await expect(page.locator('#overlay-text')).toHaveValue('© Your Name');
    await expect(page.locator('#overlay-size-info')).toHaveText(
      '出力サイズ: 400 × 200 px',
    );
    // 初期は白文字＋黒の縁取りなので、白以外のピクセルが現れる
    expect(await hasInk(page)).toBe(true);

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#overlay-download').click();
    expect((await downloadPromise).suggestedFilename()).toBe('photo-text.png');
    await expect(page.locator('#overlay-status')).toHaveText(
      'ダウンロードしました',
    );
  });

  test('文字を空にすると何も描かれない', async ({ page }) => {
    await page.goto('/tools/image-text-overlay/');
    await loadImage(page);
    await page.locator('#overlay-text').fill('');
    expect(await hasInk(page)).toBe(false);
  });

  test('敷き詰めを選ぶと余白欄が間隔欄に切り替わり、不透明度を変えられる', async ({
    page,
  }) => {
    await page.goto('/tools/image-text-overlay/');
    await loadImage(page);
    await expect(page.locator('#overlay-margin-wrap')).toBeVisible();
    await page.locator('#overlay-position').selectOption('tile');
    await expect(page.locator('#overlay-gap-wrap')).toBeVisible();
    await expect(page.locator('#overlay-margin-wrap')).toBeHidden();
    await page.locator('#overlay-opacity').fill('40');
    await expect(page.locator('#overlay-opacity-value')).toHaveText('40');
    expect(await hasInk(page)).toBe(true);
  });

  test('保存形式をJPEGにすると拡張子が変わる', async ({ page }) => {
    await page.goto('/tools/image-text-overlay/');
    await loadImage(page, 'shot.png');
    await page.locator('#overlay-format [data-format="jpeg"]').click();
    await expect(page.locator('#overlay-quality-wrap')).toBeVisible();
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#overlay-download').click();
    expect((await downloadPromise).suggestedFilename()).toBe('shot-text.jpg');
  });

  test('画像でないファイルはエラーになる', async ({ page }) => {
    await page.goto('/tools/image-text-overlay/');
    await page.locator('#overlay-file').setInputFiles({
      name: 'a.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello'),
    });
    await expect(page.locator('#overlay-error')).toBeVisible();
    await expect(page.locator('#overlay-workspace')).toBeHidden();
  });

  test('日本語テキストが正しく描かれる', async ({ page }) => {
    await page.goto('/tools/image-text-overlay/');
    await loadImage(page);
    await page.locator('#overlay-text').fill('テスト\\n日本語');
    // 日本語テキストが描かれるので、白以外のピクセルが現れる
    expect(await hasInk(page)).toBe(true);
  });

  test('JPEG形式で保存すると透明背景が白になる', async ({ page }) => {
    await page.goto('/tools/image-text-overlay/');
    await loadImage(page, 'image.png', 100, 100);
    await page.locator('#overlay-text').fill('');
    // 空文字なので元の白のまま
    expect(await hasInk(page)).toBe(false);
    // JPEGに切り替え
    await page.locator('#overlay-format [data-format="jpeg"]').click();
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#overlay-download').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.jpg');
  });
});

test.describe('Add Text or Watermark to Image (English)', () => {
  test('英語版が表示され、読み込める', async ({ page }) => {
    await page.goto('/en/tools/image-text-overlay/');
    await expect(page.locator('main h1')).toContainText('Add Text');
    await loadImage(page);
    await expect(page.locator('#overlay-size-info')).toHaveText(
      'Output size: 400 × 200 px',
    );
  });
});
