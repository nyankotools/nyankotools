import { test, expect } from './helpers/test';

const PAGES = {
  ja: '/tools/maze-generator/',
  en: '/en/tools/maze-generator/',
} as const;

for (const locale of ['ja', 'en'] as const) {
  test.describe(`迷路ジェネレーター (${locale})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(PAGES[locale]);
      await expect(page.locator('#mz-canvas')).toBeVisible();
    });

    test('初期表示で15×15の迷路が描画される', async ({ page }) => {
      const size = await page
        .locator('#mz-canvas')
        .evaluate((c: HTMLCanvasElement) => [c.width, c.height]);
      expect(size[0]).toBeGreaterThan(0);
      // 縦横同数なので、上下の余白分だけ縦が長い
      expect(size[1]).toBeGreaterThan(size[0]);
      await expect(page.locator('#mz-canvas')).toHaveAttribute(
        'aria-label',
        /15/,
      );
    });

    test('マス数を変えると迷路が作り直され、範囲外は丸められる', async ({
      page,
    }) => {
      const width = page.locator('#mz-width');
      await width.fill('1');
      await width.blur();
      await expect(width).toHaveValue('5');
      await width.fill('999');
      await width.blur();
      await expect(width).toHaveValue('50');
      const dims = await page
        .locator('#mz-canvas')
        .evaluate((c: HTMLCanvasElement) => c.width / c.height);
      expect(dims).toBeGreaterThan(1);
    });

    test('空欄のマス数は既定値の15に戻る', async ({ page }) => {
      const height = page.locator('#mz-height');
      await height.fill('');
      await height.blur();
      await expect(height).toHaveValue('15');
      await expect(page.locator('#mz-canvas')).toHaveAttribute(
        'aria-label',
        /15/,
      );
    });

    test('解答の表示を切り替えると描画が変わる', async ({ page }) => {
      const dataUrl = () =>
        page
          .locator('#mz-canvas')
          .evaluate((c: HTMLCanvasElement) => c.toDataURL());
      const without = await dataUrl();
      await page.locator('#mz-solution').check();
      const withSolution = await dataUrl();
      expect(withSolution).not.toBe(without);
      await page.locator('#mz-solution').uncheck();
      expect(await dataUrl()).toBe(without);
    });

    test('難易度を切り替えると説明が変わり、迷路が作り直される', async ({
      page,
    }) => {
      const hint = page.locator('#mz-difficulty-hint');
      const before = await hint.innerText();
      expect(before).not.toBe('');
      const hard = page.locator('[data-difficulty="hard"]');
      await hard.click();
      await expect(hard).toHaveAttribute('aria-pressed', 'true');
      expect(await hint.innerText()).not.toBe(before);
    });

    test('PNGとして保存できる', async ({ page }) => {
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.locator('#mz-download-button').click(),
      ]);
      expect(download.suggestedFilename()).toBe('maze-15x15.png');
    });

    test('印刷ボタンで印刷ダイアログが呼ばれる', async ({ page }) => {
      await page.evaluate(() => {
        (window as unknown as { __printed: number }).__printed = 0;
        window.print = () => {
          (window as unknown as { __printed: number }).__printed++;
        };
      });
      await page.locator('#mz-print-button').click();
      expect(
        await page.evaluate(
          () => (window as unknown as { __printed: number }).__printed,
        ),
      ).toBe(1);
    });
  });
}
