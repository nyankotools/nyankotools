import { test, expect, type Page } from './helpers/test';

async function createTestPng(page: Page, color: string): Promise<Buffer> {
  const dataUrl = await page.evaluate((c) => {
    const canvas = document.createElement('canvas');
    canvas.width = 120;
    canvas.height = 80;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = c;
    ctx.fillRect(0, 0, 120, 80);
    return canvas.toDataURL('image/png');
  }, color);
  return Buffer.from(dataUrl.split(',')[1], 'base64');
}

async function uploadBoth(page: Page) {
  await page.locator('#ics-before-input').setInputFiles({
    name: 'before.png',
    mimeType: 'image/png',
    buffer: await createTestPng(page, '#ff0000'),
  });
  await page.locator('#ics-after-input').setInputFiles({
    name: 'after.png',
    mimeType: 'image/png',
    buffer: await createTestPng(page, '#0000ff'),
  });
  await expect(page.locator('#ics-results-section')).toBeVisible();
}

test('2枚読み込むまで比較は表示されない', async ({ page }) => {
  await page.goto('/tools/image-compare-slider/');
  await expect(page.locator('#ics-results-section')).toBeHidden();
  await page.locator('#ics-before-input').setInputFiles({
    name: 'before.png',
    mimeType: 'image/png',
    buffer: await createTestPng(page, '#ff0000'),
  });
  await expect(page.locator('#ics-before-info')).toContainText('120×80px');
  await expect(page.locator('#ics-results-section')).toBeHidden();
});

test('2枚読み込むと境界位置に応じて色が分かれる', async ({ page }) => {
  await page.goto('/tools/image-compare-slider/');
  await uploadBoth(page);
  await page.locator('#ics-show-labels').uncheck();
  await page.locator('#ics-position').fill('50');
  await expect
    .poll(async () =>
      page.locator('#ics-canvas').evaluate((el) => {
        const c = el as HTMLCanvasElement;
        const ctx = c.getContext('2d')!;
        const left = ctx.getImageData(5, 5, 1, 1).data;
        const right = ctx.getImageData(c.width - 5, 5, 1, 1).data;
        return [left[0] > 200, right[2] > 200];
      }),
    )
    .toEqual([true, true]);
});

test('矢印キーで境界位置が動く', async ({ page }) => {
  await page.goto('/en/tools/image-compare-slider/');
  await uploadBoth(page);
  await page.locator('#ics-position').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#ics-position-value')).toContainText('51%');
});

test('向きを切り替えられる', async ({ page }) => {
  await page.goto('/tools/image-compare-slider/');
  await uploadBoth(page);
  const vertical = page.locator('[data-orientation="vertical"]');
  await vertical.click();
  await expect(vertical).toHaveAttribute('aria-pressed', 'true');
});

test('並置画像と比較画像をダウンロードできる', async ({ page }) => {
  await page.goto('/tools/image-compare-slider/');
  await uploadBoth(page);
  const [side] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('#ics-download-side-button').click(),
  ]);
  expect(side.suggestedFilename()).toBe('before-side-by-side.png');
  const [slider] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('#ics-download-slider-button').click(),
  ]);
  expect(slider.suggestedFilename()).toBe('before-compare.png');
});

test('非対応ファイルはエラー表示', async ({ page }) => {
  await page.goto('/tools/image-compare-slider/');
  await page.locator('#ics-before-input').setInputFiles({
    name: 'a.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('x'),
  });
  await expect(page.locator('#ics-error')).toBeVisible();
});

test('クリアで比較表示が消える', async ({ page }) => {
  await page.goto('/tools/image-compare-slider/');
  await uploadBoth(page);
  await page.locator('#ics-clear-button').click();
  await expect(page.locator('#ics-results-section')).toBeHidden();
  await expect(page.locator('#ics-before-info')).toHaveText('');
});
