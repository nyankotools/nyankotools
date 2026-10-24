import { test, expect, type Page } from './helpers/test';

/** ブラウザ内で単色PNGを作り、ファイル入力にまとめて渡す */
async function addImages(page: Page, colors: string[]) {
  await page.evaluate(async (colors) => {
    const dt = new DataTransfer();
    for (const [i, color] of colors.entries()) {
      const c = document.createElement('canvas');
      c.width = 60;
      c.height = 40;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 60, 40);
      const blob = await new Promise<Blob>((r) => c.toBlob((b) => r(b!)));
      dt.items.add(new File([blob], `p${i + 1}.png`, { type: 'image/png' }));
    }
    const input = document.getElementById('pc-file') as HTMLInputElement;
    input.files = dt.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }, colors);
}

const pixel = (page: Page, fx: number, fy: number) =>
  page.locator('#pc-canvas').evaluate(
    (el, [fx, fy]) => {
      const c = el as HTMLCanvasElement;
      const ctx = c.getContext('2d')!;
      return Array.from(
        ctx.getImageData(
          Math.floor(c.width * fx),
          Math.floor(c.height * fy),
          1,
          1,
        ).data,
      );
    },
    [fx, fy],
  );

test.describe('フォトコラージュ作成（日本語版）', () => {
  test('3枚を配置し、テンプレート切り替えとダウンロードができる', async ({
    page,
  }) => {
    await page.goto('/tools/photo-collage-maker/');
    await expect(page.locator('#pc-workspace')).toBeHidden();
    await addImages(page, ['#ff0000', '#00ff00', '#0000ff']);
    await expect(page.locator('#pc-workspace')).toBeVisible();
    await expect(page.locator('#pc-list li')).toHaveCount(3);
    await expect(page.locator('#pc-size-info')).toHaveText(
      '出力サイズ: 2000 × 2000 px（3枚）',
    );
    await page.locator('#pc-gap').fill('0');
    await page.locator('#pc-margin').fill('0');
    await page.getByRole('button', { name: '横に並べる' }).click();
    // 横3列: 左・中央・右の色が順に並ぶ
    expect(await pixel(page, 0.1, 0.5)).toEqual([255, 0, 0, 255]);
    expect(await pixel(page, 0.5, 0.5)).toEqual([0, 255, 0, 255]);
    expect(await pixel(page, 0.9, 0.5)).toEqual([0, 0, 255, 255]);

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#pc-download').click();
    expect((await downloadPromise).suggestedFilename()).toBe('collage.png');
    await expect(page.locator('#pc-status')).toHaveText('ダウンロードしました');
  });

  test('順番入れ替えと縦横比・サイズ変更が反映される', async ({ page }) => {
    await page.goto('/tools/photo-collage-maker/');
    await addImages(page, ['#ff0000', '#0000ff']);
    await page.locator('#pc-gap').fill('0');
    await page.locator('#pc-margin').fill('0');
    await page.getByRole('button', { name: '横に並べる' }).click();
    await page.locator('#pc-list li').nth(1).getByText('↑ 上へ').click();
    expect(await pixel(page, 0.1, 0.5)).toEqual([0, 0, 255, 255]);
    await page.locator('#pc-aspect').selectOption('16:9');
    await page.locator('#pc-size').selectOption('1200');
    await expect(page.locator('#pc-size-info')).toHaveText(
      '出力サイズ: 1200 × 675 px（2枚）',
    );
  });

  test('調整パネルでスライダーを動かせる', async ({ page }) => {
    await page.goto('/tools/photo-collage-maker/');
    await addImages(page, ['#ff0000', '#0000ff']);
    await expect(page.locator('#pc-adjust')).toBeHidden();
    await page.locator('#pc-list li').first().getByText('調整').click();
    await expect(page.locator('#pc-adjust')).toBeVisible();
    await page.locator('#pc-zoom').fill('200');
    await expect(page.locator('#pc-zoom')).toHaveValue('200');
  });

  test('9枚を超えるとエラーになり、画像でないファイルも弾く', async ({
    page,
  }) => {
    await page.goto('/tools/photo-collage-maker/');
    await addImages(
      page,
      Array.from({ length: 10 }, () => '#888888'),
    );
    await expect(page.locator('#pc-error')).toContainText('9枚');
    await expect(page.locator('#pc-list li')).toHaveCount(9);
    await page.getByRole('button', { name: 'すべて削除' }).click();
    await page.locator('#pc-file').setInputFiles({
      name: 'a.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello'),
    });
    await expect(page.locator('#pc-error')).toContainText('a.txt');
    await expect(page.locator('#pc-workspace')).toBeHidden();
  });
});

test.describe('Photo Collage Maker (English)', () => {
  test('英語版が表示され、配置できる', async ({ page }) => {
    await page.goto('/en/tools/photo-collage-maker/');
    await expect(page.locator('main h1')).toContainText('Photo Collage Maker');
    await addImages(page, ['#ff0000', '#0000ff']);
    await expect(page.locator('#pc-size-info')).toHaveText(
      'Output size: 2000 × 2000 px (2 photos)',
    );
  });
});
