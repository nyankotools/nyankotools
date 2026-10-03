import { test, expect, type Page } from './helpers/test';

/** ブラウザ内で単色PNGを作り、ファイル入力にまとめて渡す */
async function addImages(
  page: Page,
  specs: { name: string; color: string; w: number; h: number }[],
) {
  await page.evaluate(async (specs) => {
    const dt = new DataTransfer();
    for (const { name, color, w, h } of specs) {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, w, h);
      const blob = await new Promise<Blob>((r) => c.toBlob((b) => r(b!)));
      dt.items.add(new File([blob], name, { type: 'image/png' }));
    }
    const input = document.getElementById('merge-file') as HTMLInputElement;
    input.files = dt.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }, specs);
}

const two = [
  { name: 'a.png', color: 'red', w: 40, h: 20 },
  { name: 'b.png', color: 'blue', w: 30, h: 20 },
];

test.describe('画像結合（日本語版）', () => {
  test('2枚を横に結合し、サイズが表示されてダウンロードできる', async ({
    page,
  }) => {
    await page.goto('/tools/image-merger/');
    await expect(page.locator('main h1')).toContainText('画像結合');
    await expect(page.locator('#merge-workspace')).toBeHidden();

    await addImages(page, two);
    await expect(page.locator('#merge-workspace')).toBeVisible();
    await expect(page.locator('#merge-list li')).toHaveCount(2);
    await expect(page.locator('#merge-size')).toHaveText(
      '出力サイズ: 70 × 20 px（2枚）',
    );
    const pixels = await page.locator('#merge-canvas').evaluate((el) => {
      const ctx = (el as HTMLCanvasElement).getContext('2d')!;
      return [
        Array.from(ctx.getImageData(5, 5, 1, 1).data),
        Array.from(ctx.getImageData(60, 5, 1, 1).data),
      ];
    });
    expect(pixels).toEqual([
      [255, 0, 0, 255],
      [0, 0, 255, 255],
    ]);

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#merge-download').click();
    expect((await downloadPromise).suggestedFilename()).toBe('merged.png');
    await expect(page.locator('#merge-status')).toHaveText(
      'ダウンロードしました',
    );
  });

  test('並べ方・間隔・余白でサイズが変わる', async ({ page }) => {
    await page.goto('/tools/image-merger/');
    await addImages(page, two);
    await page.locator('#merge-direction').selectOption('vertical');
    await expect(page.locator('#merge-size')).toHaveText(
      '出力サイズ: 40 × 40 px（2枚）',
    );
    await page.locator('#merge-gap').fill('10');
    await page.locator('#merge-margin').fill('5');
    await expect(page.locator('#merge-size')).toHaveText(
      '出力サイズ: 50 × 60 px（2枚）',
    );
    await page.locator('#merge-direction').selectOption('grid');
    await expect(page.locator('#merge-columns-wrap')).toBeVisible();
  });

  test('順番を入れ替えると結果の並びが変わる', async ({ page }) => {
    await page.goto('/tools/image-merger/');
    await addImages(page, two);
    await page.locator('#merge-list li').nth(1).getByText('↑ 上へ').click();
    await expect(page.locator('#merge-list li').first()).toContainText('b.png');
    const left = await page.locator('#merge-canvas').evaluate((el) => {
      const ctx = (el as HTMLCanvasElement).getContext('2d')!;
      return Array.from(ctx.getImageData(5, 5, 1, 1).data);
    });
    expect(left).toEqual([0, 0, 255, 255]);

    await page.locator('#merge-list li').first().getByText('削除').click();
    await expect(page.locator('#merge-list li')).toHaveCount(1);
    await page.getByRole('button', { name: 'すべて削除' }).click();
    await expect(page.locator('#merge-workspace')).toBeHidden();
  });

  test('画像でないファイルはエラーになる', async ({ page }) => {
    await page.goto('/tools/image-merger/');
    await page.locator('#merge-file').setInputFiles({
      name: 'a.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello'),
    });
    await expect(page.locator('#merge-error')).toContainText('a.txt');
    await expect(page.locator('#merge-workspace')).toBeHidden();
  });

  test('50枚を超える画像はエラーになる', async ({ page }) => {
    await page.goto('/tools/image-merger/');
    // 51枚の画像を準備（MAX_IMAGES = 50）
    const specs = Array.from({ length: 51 }, (_, i) => ({
      name: `img${i + 1}.png`,
      color: `hsl(${(i * 7) % 360}, 50%, 50%)`,
      w: 20,
      h: 20,
    }));
    await addImages(page, specs);
    await expect(page.locator('#merge-error')).toContainText('50枚');
  });

  test('複数ファイルのうち一部が非画像の場合、エラーになる', async ({
    page,
  }) => {
    await page.goto('/tools/image-merger/');
    // 画像 + テキストファイルを混ぜて追加
    await page.evaluate(async () => {
      const dt = new DataTransfer();
      // 正常な画像
      const c = document.createElement('canvas');
      c.width = 40;
      c.height = 20;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = 'red';
      ctx.fillRect(0, 0, 40, 20);
      const blob = await new Promise<Blob>((r) => c.toBlob((b) => r(b!)));
      dt.items.add(new File([blob], 'ok.png', { type: 'image/png' }));
      // テキストファイル（new Uint8Array で Buffer の代わり）
      dt.items.add(
        new File([new Uint8Array([116, 101, 120, 116])], 'bad.txt', {
          type: 'text/plain',
        }),
      );
      const input = document.getElementById('merge-file') as HTMLInputElement;
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await expect(page.locator('#merge-error')).toContainText('bad.txt');
  });
});

test.describe('Image Merger (English)', () => {
  test('英語版が表示され、結合できる', async ({ page }) => {
    await page.goto('/en/tools/image-merger/');
    await expect(page.locator('main h1')).toContainText('Image Merger');
    await addImages(page, two);
    await expect(page.locator('#merge-size')).toHaveText(
      'Output size: 70 × 20 px (2 images)',
    );
  });
});
