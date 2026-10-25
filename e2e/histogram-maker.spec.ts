import { test, expect } from './helpers/test';

async function coloredPixels(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const c = document.getElementById('hm-canvas') as HTMLCanvasElement;
    const d = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
    let n = 0;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] > 0 && (d[i] !== d[i + 1] || d[i + 1] !== d[i + 2])) n++;
    }
    return n;
  });
}

test.describe('度数分布表・ヒストグラム作成（日本語版）', () => {
  test('サンプルで度数分布表とヒストグラムが表示される', async ({ page }) => {
    await page.goto('/tools/histogram-maker/');
    await expect(page.locator('main h1')).toContainText('ヒストグラム');
    await expect(page.locator('#hm-error')).toHaveText('');
    await expect(page.locator('#hm-summary')).toContainText('データ30件');
    // 7階級 + 合計行
    await expect(page.locator('#hm-tbody tr')).toHaveCount(8);
    expect(await coloredPixels(page)).toBeGreaterThan(1000);
  });

  test('階級幅と開始値を指定すると左閉右開で集計される', async ({ page }) => {
    await page.goto('/tools/histogram-maker/');
    await page.locator('#hm-data').fill('0 9 10 19 20');
    await page.locator('#hm-width').fill('10');
    await page.locator('#hm-start').fill('0');
    const rows = page.locator('#hm-tbody tr');
    await expect(rows).toHaveCount(4);
    await expect(rows.nth(0)).toContainText('[0, 10)');
    await expect(rows.nth(0).locator('td').nth(1)).toHaveText('2');
    await expect(rows.nth(1).locator('td').nth(1)).toHaveText('2');
    await expect(rows.nth(2).locator('td').nth(1)).toHaveText('1');
  });

  test('不正な階級幅はエラーになり、保存ボタンが無効になる', async ({
    page,
  }) => {
    await page.goto('/tools/histogram-maker/');
    await page.locator('#hm-width').fill('0');
    await expect(page.locator('#hm-error')).toContainText('0より大きい');
    await expect(page.locator('#hm-download-button')).toBeDisabled();
    await page.locator('#hm-width').fill('');
    await expect(page.locator('#hm-error')).toHaveText('');
  });

  test('階級が多すぎるとエラーになる', async ({ page }) => {
    await page.goto('/tools/histogram-maker/');
    await page.locator('#hm-data').fill('0 1000');
    await page.locator('#hm-width').fill('1');
    await expect(page.locator('#hm-error')).toContainText('階級数が多すぎます');
  });

  test('開始値より小さいデータは除外される', async ({ page }) => {
    await page.goto('/tools/histogram-maker/');
    await page.locator('#hm-data').fill('1 5 15');
    await page.locator('#hm-width').fill('10');
    await page.locator('#hm-start').fill('5');
    await expect(page.locator('#hm-notice')).toContainText('1件');
  });

  test('PNGを保存できる', async ({ page }) => {
    await page.goto('/tools/histogram-maker/');
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#hm-download-button').click(),
    ]);
    expect(download.suggestedFilename()).toBe('histogram.png');
    await expect(page.locator('#hm-status')).toContainText('保存しました');
  });

  test('表をTSV・CSVでコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/histogram-maker/');
    await page.locator('#hm-data').fill('1 2 11');
    await page.locator('#hm-width').fill('10');
    await page.locator('#hm-start').fill('0');
    await page.locator('#hm-copy-button').click();
    await expect(page.locator('#hm-copy-status')).toContainText(
      'コピーしました',
    );
    const text = await page.evaluate(() => navigator.clipboard.readText());
    // Windows のクリップボードは改行を \r\n に変換するため \r?\n で分割する
    expect(text.split(/\r?\n/)[1]).toBe('[0, 10)\t5\t2\t66.67\t2\t66.67');
    await page.locator('#hm-copy-csv-button').click();
    const csv = await page.evaluate(() => navigator.clipboard.readText());
    expect(csv.split(/\r?\n/)[1]).toBe('"[0, 10)",5,2,66.67,2,66.67');
  });

  test('縦軸を相対度数に切り替えても描画される', async ({ page }) => {
    await page.goto('/tools/histogram-maker/');
    await page.getByRole('button', { name: '相対度数', exact: true }).click();
    await expect(page.locator('#hm-error')).toHaveText('');
    expect(await coloredPixels(page)).toBeGreaterThan(1000);
  });
});

test.describe('度数分布表・ヒストグラム作成（375px）', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('モバイル幅で表とキャンバスが画面内に収まる', async ({ page }) => {
    await page.goto('/tools/histogram-maker/');
    expect(await coloredPixels(page)).toBeGreaterThan(1000);
    const box = await page.locator('#hm-canvas').boundingBox();
    expect(box?.width ?? Infinity).toBeLessThanOrEqual(375);
    await expect(page.locator('#hm-download-button')).toBeVisible();
  });
});

test.describe('Histogram Maker (English)', () => {
  test('renders and shows English errors', async ({ page }) => {
    await page.goto('/en/tools/histogram-maker/');
    await expect(page.locator('main h1')).toContainText('Histogram Maker');
    await page.locator('#hm-width').fill('-1');
    await expect(page.locator('#hm-error')).toContainText(
      'Bin width must be a number greater than 0',
    );
  });
});
