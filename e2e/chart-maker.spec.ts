import { test, expect } from './helpers/test';

// 非透明ピクセル数と、指定座標付近の色を返す
async function canvasStats(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const c = document.getElementById('cm-canvas') as HTMLCanvasElement;
    const ctx = c.getContext('2d')!;
    const d = ctx.getImageData(0, 0, c.width, c.height).data;
    let opaque = 0;
    let colored = 0;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] > 0) opaque++;
      if (d[i + 3] > 0 && (d[i] !== d[i + 1] || d[i + 1] !== d[i + 2]))
        colored++;
    }
    return { w: c.width, h: c.height, opaque, colored };
  });
}

test.describe('グラフ作成ツール（日本語版）', () => {
  test('サンプルデータで棒グラフが描画される', async ({ page }) => {
    await page.goto('/tools/chart-maker/');
    await expect(page.locator('main h1')).toContainText('グラフ作成');
    const s = await canvasStats(page);
    expect(s.w).toBe(800);
    expect(s.h).toBe(500);
    expect(s.colored).toBeGreaterThan(1000);
    await expect(page.locator('#cm-error')).toHaveText('');
  });

  test('数値でないセルはエラーになり、保存ボタンが無効になる', async ({
    page,
  }) => {
    await page.goto('/tools/chart-maker/');
    await page.locator('#cm-data').fill('月,売上\n1月,100\n2月,abc');
    await expect(page.locator('#cm-error')).toContainText(
      '3行目・2列目が数値ではありません',
    );
    await expect(page.locator('#cm-download-button')).toBeDisabled();
  });

  test('円グラフで負の値はエラーになる', async ({ page }) => {
    await page.goto('/tools/chart-maker/');
    await page.locator('#cm-data').fill('項目,値\nA,10\nB,-5');
    await page.getByRole('button', { name: '円グラフ' }).click();
    await expect(page.locator('#cm-error')).toContainText('負の値は使えません');
    await page.getByRole('button', { name: '折れ線グラフ' }).click();
    await expect(page.locator('#cm-error')).toHaveText('');
  });

  test('サイズと解像度の変更がキャンバスに反映される', async ({ page }) => {
    await page.goto('/tools/chart-maker/');
    await page.locator('#cm-size').selectOption('1000x1000');
    await page.locator('#cm-scale').selectOption('2');
    const s = await canvasStats(page);
    expect(s.w).toBe(2000);
    expect(s.h).toBe(2000);
  });

  test('背景を透明にすると余白が透明になる', async ({ page }) => {
    await page.goto('/tools/chart-maker/');
    const white = await canvasStats(page);
    await page.locator('#cm-transparent').check();
    const clear = await canvasStats(page);
    expect(clear.opaque).toBeLessThan(white.opaque / 2);
  });

  test('PNGをダウンロードできる', async ({ page }) => {
    await page.goto('/tools/chart-maker/');
    await page.getByRole('button', { name: '円グラフ' }).click();
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#cm-download-button').click(),
    ]);
    expect(download.suggestedFilename()).toBe('chart-pie.png');
    await expect(page.locator('#cm-status')).toContainText('保存しました');
  });

  test('折れ線グラフが描画される', async ({ page }) => {
    await page.goto('/tools/chart-maker/');
    await page.getByRole('button', { name: '折れ線グラフ' }).click();
    const s = await canvasStats(page);
    expect(s.colored).toBeGreaterThan(1000);
    await expect(page.locator('#cm-error')).toHaveText('');
    await expect(page.locator('#cm-download-button')).toBeEnabled();
  });

  test('200行は描画でき、201行はエラーになる', async ({ page }) => {
    await page.goto('/tools/chart-maker/');
    const rows = (n: number) =>
      [
        '項目,値',
        ...Array.from({ length: n }, (_, i) => `R${i + 1},${i + 1}`),
      ].join('\n');
    await page.locator('#cm-data').fill(rows(200));
    await expect(page.locator('#cm-error')).toHaveText('');
    expect((await canvasStats(page)).colored).toBeGreaterThan(1000);
    await page.locator('#cm-data').fill(rows(201));
    await expect(page.locator('#cm-error')).toContainText(
      'データ行は最大200行までです。',
    );
    await expect(page.locator('#cm-download-button')).toBeDisabled();
  });

  test('長いラベルは回転して描画され、エラーにならない', async ({ page }) => {
    await page.goto('/tools/chart-maker/');
    const lines = Array.from(
      { length: 30 },
      (_, i) => `非常に長い項目名のサンプル${i + 1}番目,${(i * 37) % 100}`,
    );
    await page.locator('#cm-data').fill(['項目,売上', ...lines].join('\n'));
    await expect(page.locator('#cm-error')).toHaveText('');
    expect((await canvasStats(page)).colored).toBeGreaterThan(1000);
  });

  test('凡例を表示すると、非表示より多く描画される（長い系列名の折返し）', async ({
    page,
  }) => {
    await page.goto('/tools/chart-maker/');
    await page.getByRole('button', { name: '折れ線グラフ' }).click();
    const header = Array.from(
      { length: 8 },
      (_, i) => `とても長い系列の名前その${i + 1}`,
    ).join(',');
    // 系列1（#2563eb）だけ高い値にして線を上端に置き、下部帯の青は凡例の見本だけにする
    await page
      .locator('#cm-data')
      .fill(
        `項目,${header}\nA,1000,${'1,'.repeat(6)}1\nB,1000,${'2,'.repeat(6)}2`,
      );
    await expect(page.locator('#cm-error')).toHaveText('');
    const legendSwatchPixels = () =>
      page.evaluate(() => {
        const c = document.getElementById('cm-canvas') as HTMLCanvasElement;
        const ctx = c.getContext('2d')!;
        const top = Math.floor(c.height * 0.85);
        const d = ctx.getImageData(0, top, c.width, c.height - top).data;
        let n = 0;
        for (let i = 0; i < d.length; i += 4) {
          if (
            d[i + 3] > 0 &&
            d[i] === 0x25 &&
            d[i + 1] === 0x63 &&
            d[i + 2] === 0xeb
          )
            n++;
        }
        return n;
      });
    expect(await legendSwatchPixels()).toBeGreaterThan(0);
    await page.locator('#cm-legend').uncheck();
    expect(await legendSwatchPixels()).toBe(0);
  });
});

test.describe('グラフ作成ツール（375px）', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('モバイル幅で棒・円グラフが描画され、キャンバスが画面内に収まる', async ({
    page,
  }) => {
    await page.goto('/tools/chart-maker/');
    await expect(page.locator('main h1')).toContainText('グラフ作成');
    expect((await canvasStats(page)).colored).toBeGreaterThan(1000);
    const box = await page.locator('#cm-canvas').boundingBox();
    expect(box?.width ?? Infinity).toBeLessThanOrEqual(375);
    await page.getByRole('button', { name: '円グラフ' }).click();
    expect((await canvasStats(page)).colored).toBeGreaterThan(1000);
    await expect(page.locator('#cm-download-button')).toBeVisible();
  });
});

test.describe('Chart Maker (English)', () => {
  test('renders and shows English errors', async ({ page }) => {
    await page.goto('/en/tools/chart-maker/');
    await expect(page.locator('main h1')).toContainText('Chart Maker');
    await page.locator('#cm-data').fill('a,b\nx,oops');
    await expect(page.locator('#cm-error')).toContainText(
      'Row 2, column 2 is not a number',
    );
  });
});
