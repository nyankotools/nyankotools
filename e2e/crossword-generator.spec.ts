import { test, expect } from './helpers/test';

const PAGES = {
  ja: '/tools/crossword-generator/',
  en: '/en/tools/crossword-generator/',
} as const;

const MESSAGES = {
  ja: {
    empty: '「答え:ヒント」を入力してください（1行に1問、答えは2文字以上）。',
    placed: (placed: number, total: number) =>
      `${placed}/${total}語を配置しました。`,
    unplaced: '配置できなかった言葉: XYZ。',
    ignored:
      '1語は2〜20文字の範囲外、または上限（30語）を超えたため除外しました。',
  },
  en: {
    empty:
      'Enter at least one "answer:clue" line (answers need 2 or more letters).',
    placed: (placed: number, total: number) =>
      `${placed} of ${total} words placed.`,
    unplaced: 'no letter in common with the other words): XYZ.',
    ignored: '1 word(s) were skipped',
  },
} as const;

for (const locale of ['ja', 'en'] as const) {
  const msg = MESSAGES[locale];
  test.describe(`クロスワード作成 (${locale})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(PAGES[locale]);
      await expect(page.locator('#cw-canvas')).toBeVisible();
    });

    test('初期表示でパズルとカギの一覧が描画される', async ({ page }) => {
      const size = await page
        .locator('#cw-canvas')
        .evaluate((c: HTMLCanvasElement) => [c.width, c.height]);
      // 幅は固定（盤面の幅 + 余白）。縦は初期パズルの配置がランダムで変わるため、
      // 盤面の下にカギの一覧が付く分を含めた下限だけを見る（実測では 244 以上）
      expect(size[0]).toBe(908);
      expect(size[1]).toBeGreaterThan(200);
      await expect(page.locator('#cw-canvas')).toHaveAttribute(
        'aria-label',
        /\d/,
      );
    });

    test('「パズルを作る」で配置結果のメッセージが出る', async ({ page }) => {
      await page.locator('#cw-generate-button').click();
      await expect(page.locator('#cw-status')).toContainText(/\d+(\/| of )6/);
    });

    test('空欄で作ろうとすると案内が出て、絵は変わらない', async ({ page }) => {
      const before = await page
        .locator('#cw-canvas')
        .evaluate((c: HTMLCanvasElement) => c.toDataURL());
      await page.locator('#cw-words').fill('');
      await page.locator('#cw-generate-button').click();
      await expect(page.locator('#cw-status')).toHaveText(msg.empty);
      expect(
        await page
          .locator('#cw-canvas')
          .evaluate((c: HTMLCanvasElement) => c.toDataURL()),
      ).toBe(before);
    });

    test('文字を共有できない言葉は置けないと表示される', async ({ page }) => {
      await page.locator('#cw-words').fill('ABC:a\nCDE:b\nXYZ:c');
      await page.locator('#cw-generate-button').click();
      const status = page.locator('#cw-status');
      await expect(status).toContainText(msg.placed(2, 3));
      await expect(status).toContainText(msg.unplaced);
    });

    test('31語目以降は除外されたと表示される', async ({ page }) => {
      const words = Array.from({ length: 31 }, (_, i) => `WORD${i}:x`);
      await page.locator('#cw-words').fill(words.join('\n'));
      await page.locator('#cw-generate-button').click();
      await expect(page.locator('#cw-status')).toContainText(msg.ignored);
    });

    test('答えの表示を切り替えると描画が変わる', async ({ page }) => {
      const dataUrl = () =>
        page
          .locator('#cw-canvas')
          .evaluate((c: HTMLCanvasElement) => c.toDataURL());
      const without = await dataUrl();
      await page.locator('#cw-answer').check();
      expect(await dataUrl()).not.toBe(without);
      await page.locator('#cw-answer').uncheck();
      expect(await dataUrl()).toBe(without);
    });

    test('ヒントが長くても横にはみ出さず折り返される', async ({ page }) => {
      // 1語だけなら配置が決まるので、ヒントの長さだけで高さが変わる
      const sized = () =>
        page
          .locator('#cw-canvas')
          .evaluate((c: HTMLCanvasElement) => [c.width, c.height]);
      await page.locator('#cw-words').fill('ABCD:short');
      await page.locator('#cw-generate-button').click();
      const [, shortHeight] = await sized();

      const longClue = 'LONG '.repeat(40);
      await page.locator('#cw-words').fill(`ABCD:${longClue}`);
      await page.locator('#cw-generate-button').click();
      const [width, longHeight] = await sized();
      // 幅は固定で、折り返した分だけ高くなる
      expect(width).toBe(908);
      expect(longHeight).toBeGreaterThan(shortHeight);
    });

    test('PNGとして保存できる', async ({ page }) => {
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.locator('#cw-download-button').click(),
      ]);
      expect(download.suggestedFilename()).toMatch(/^crossword-\d+x\d+\.png$/);
    });

    test('印刷ボタンで印刷ダイアログが呼ばれる', async ({ page }) => {
      await page.evaluate(() => {
        (window as unknown as { __printed: number }).__printed = 0;
        window.print = () => {
          (window as unknown as { __printed: number }).__printed++;
        };
      });
      await page.locator('#cw-print-button').click();
      expect(
        await page.evaluate(
          () => (window as unknown as { __printed: number }).__printed,
        ),
      ).toBe(1);
    });
  });
}
