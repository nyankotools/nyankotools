import { test, expect, type Page } from './helpers/test';

async function createTestPng(
  page: Page,
  color: string,
  width = 40,
  height = 30,
  dot?: string,
): Promise<Buffer> {
  const dataUrl = await page.evaluate(
    ([c, w, h, d]) => {
      const canvas = document.createElement('canvas');
      canvas.width = w as number;
      canvas.height = h as number;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = c as string;
      ctx.fillRect(0, 0, w as number, h as number);
      if (d) {
        ctx.fillStyle = d as string;
        ctx.fillRect(0, 0, 2, 2);
      }
      return canvas.toDataURL('image/png');
    },
    [color, width, height, dot ?? ''] as const,
  );
  return Buffer.from(dataUrl.split(',')[1], 'base64');
}

async function upload(
  page: Page,
  side: 'base' | 'target',
  buffer: Buffer,
  name = `${side}.png`,
) {
  await page
    .locator(`#idf-${side}-input`)
    .setInputFiles({ name, mimeType: 'image/png', buffer });
}

test('2枚読み込むまで結果は表示されない', async ({ page }) => {
  await page.goto('/tools/image-diff/');
  await expect(page.locator('#idf-results-section')).toBeHidden();
  await upload(page, 'base', await createTestPng(page, '#ffffff'));
  await expect(page.locator('#idf-base-info')).toContainText('40×30px');
  await expect(page.locator('#idf-results-section')).toBeHidden();
});

test('同じ画像は差異0%', async ({ page }) => {
  await page.goto('/tools/image-diff/');
  const png = await createTestPng(page, '#336699');
  await upload(page, 'base', png);
  await upload(page, 'target', png);
  await expect(page.locator('#idf-stat-percent')).toHaveText('0%');
  await expect(page.locator('#idf-stat-bounds')).toHaveText('なし');
});

test('一部が違う画像は差異率と範囲を表示する', async ({ page }) => {
  await page.goto('/en/tools/image-diff/');
  await upload(page, 'base', await createTestPng(page, '#ffffff'));
  await upload(
    page,
    'target',
    await createTestPng(page, '#ffffff', 40, 30, '#000000'),
  );
  // 4 / 1200 画素
  await expect(page.locator('#idf-stat-pixels')).toContainText('4 / 1,200');
  await expect(page.locator('#idf-stat-bounds')).toContainText(
    'x=0, y=0, 2×2px',
  );
});

test('しきい値を上げると小さな差を無視する', async ({ page }) => {
  await page.goto('/tools/image-diff/');
  await upload(page, 'base', await createTestPng(page, '#808080'));
  await upload(page, 'target', await createTestPng(page, '#868686'));
  await expect(page.locator('#idf-stat-percent')).toHaveText('100.0%');
  await page.locator('#idf-threshold').fill('10');
  await expect(page.locator('#idf-stat-percent')).toHaveText('0%');
});

test('しきい値を連続して素早く動かしても最終値の結果になる', async ({
  page,
}) => {
  await page.goto('/tools/image-diff/');
  await upload(page, 'base', await createTestPng(page, '#808080'));
  await upload(page, 'target', await createTestPng(page, '#868686'));
  await expect(page.locator('#idf-stat-percent')).toHaveText('100.0%');
  // 同一フレーム内に複数のinputイベントを発火させる（rAFで間引かれる）
  await page.locator('#idf-threshold').evaluate((el) => {
    const input = el as HTMLInputElement;
    for (const v of ['1', '5', '10']) {
      input.value = v;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  await expect(page.locator('#idf-stat-percent')).toHaveText('0%');
  await expect(page.locator('#idf-threshold-value')).toContainText('10%');
});

test('サイズが違うときの扱いを切り替えられる', async ({ page }) => {
  await page.goto('/tools/image-diff/');
  await upload(page, 'base', await createTestPng(page, '#ffffff', 40, 30));
  await upload(page, 'target', await createTestPng(page, '#ffffff', 20, 30));
  await expect(page.locator('#idf-size-mismatch')).toBeVisible();
  // 余白を足して比較: 右半分が差異
  await expect(page.locator('#idf-stat-percent')).toHaveText('50.0%');
  await page.locator('[data-size-mode="resize"]').click();
  await expect(page.locator('#idf-stat-percent')).toHaveText('0%');
});

test('差分画像をダウンロードできる', async ({ page }) => {
  await page.goto('/tools/image-diff/');
  await upload(page, 'base', await createTestPng(page, '#ffffff'), 'a.png');
  await upload(page, 'target', await createTestPng(page, '#000000'));
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('#idf-download-button').click(),
  ]);
  expect(download.suggestedFilename()).toBe('a-diff.png');
});

test('非対応ファイルはエラー表示', async ({ page }) => {
  await page.goto('/tools/image-diff/');
  await page.locator('#idf-base-input').setInputFiles({
    name: 'a.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('x'),
  });
  await expect(page.locator('#idf-error')).toBeVisible();
});

test('クリアで結果が消える', async ({ page }) => {
  await page.goto('/tools/image-diff/');
  const png = await createTestPng(page, '#ffffff');
  await upload(page, 'base', png);
  await upload(page, 'target', png);
  await expect(page.locator('#idf-results-section')).toBeVisible();
  await page.locator('#idf-clear-button').click();
  await expect(page.locator('#idf-results-section')).toBeHidden();
  await expect(page.locator('#idf-base-info')).toHaveText('');
});
