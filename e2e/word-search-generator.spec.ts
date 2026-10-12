import { test, expect } from './helpers/test';

const PAGES = {
  ja: '/tools/word-search-generator/',
  en: '/en/tools/word-search-generator/',
} as const;

const MESSAGES = {
  ja: {
    empty: '探す言葉を入力してください（1行に1語、2文字以上）。',
    placed: (placed: number, total: number) =>
      `${placed}/${total}語を配置しました。`,
    unplaced: '配置できなかった言葉: ABCDEFGHIJKLMNOP。',
    ignored: '1語は2文字未満、または上限（50語）を超えたため除外しました。',
  },
  en: {
    empty: 'Enter at least one word of 2 or more letters, one per line.',
    placed: (placed: number, total: number) =>
      `${placed} of ${total} words placed.`,
    unplaced: 'Could not place: ABCDEFGHIJKLMNOP.',
    ignored: '1 word(s) were skipped',
  },
} as const;

for (const locale of ['ja', 'en'] as const) {
  const msg = MESSAGES[locale];
  test.describe(`ワードサーチ作成 (${locale})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(PAGES[locale]);
      await expect(page.locator('#ws-canvas')).toBeVisible();
    });

    test('初期表示で12×12のパズルが描画される', async ({ page }) => {
      await expect(page.locator('#ws-canvas')).toHaveAttribute(
        'aria-label',
        /12/,
      );
      const size = await page
        .locator('#ws-canvas')
        .evaluate((c: HTMLCanvasElement) => [c.width, c.height]);
      expect(size[0]).toBeGreaterThan(0);
      // 単語一覧の分だけ縦が長い
      expect(size[1]).toBeGreaterThan(size[0]);
    });

    test('「パズルを作る」で配置結果のメッセージが出る', async ({ page }) => {
      await page.locator('#ws-generate-button').click();
      // 初期の語は8語。小さな盤面でなければ全部置ける
      await expect(page.locator('#ws-status')).toContainText(msg.placed(8, 8));
    });

    test('空欄で作ろうとすると案内が出て、絵は変わらない', async ({ page }) => {
      const before = await page
        .locator('#ws-canvas')
        .evaluate((c: HTMLCanvasElement) => c.toDataURL());
      await page.locator('#ws-words').fill('');
      await page.locator('#ws-generate-button').click();
      await expect(page.locator('#ws-status')).toHaveText(msg.empty);
      expect(
        await page
          .locator('#ws-canvas')
          .evaluate((c: HTMLCanvasElement) => c.toDataURL()),
      ).toBe(before);
    });

    test('マス数より長い言葉は置けないと表示される', async ({ page }) => {
      await page.locator('#ws-size').fill('8');
      await page.locator('#ws-words').fill('ABCDEFGHIJKLMNOP\nCAT');
      await page.locator('#ws-generate-button').click();
      const status = page.locator('#ws-status');
      await expect(status).toContainText(msg.placed(1, 2));
      await expect(status).toContainText(msg.unplaced);
    });

    test('51語目以降は除外されたと表示される', async ({ page }) => {
      const words = Array.from({ length: 51 }, (_, i) => `WORD${i}`);
      await page.locator('#ws-words').fill(words.join('\n'));
      await page.locator('#ws-generate-button').click();
      await expect(page.locator('#ws-status')).toContainText(msg.ignored);
    });

    test('マス数は範囲内に丸められる', async ({ page }) => {
      const size = page.locator('#ws-size');
      await size.fill('1');
      await size.blur();
      await expect(size).toHaveValue('8');
      await size.fill('999');
      await size.blur();
      await expect(size).toHaveValue('25');
    });

    test('答えの表示を切り替えると描画が変わる', async ({ page }) => {
      const dataUrl = () =>
        page
          .locator('#ws-canvas')
          .evaluate((c: HTMLCanvasElement) => c.toDataURL());
      const without = await dataUrl();
      await page.locator('#ws-answer').check();
      expect(await dataUrl()).not.toBe(without);
      await page.locator('#ws-answer').uncheck();
      expect(await dataUrl()).toBe(without);
    });

    test('単語一覧を隠すとキャンバスが小さくなる', async ({ page }) => {
      const height = () =>
        page.locator('#ws-canvas').evaluate((c: HTMLCanvasElement) => c.height);
      const withList = await height();
      await page.locator('#ws-list').uncheck();
      expect(await height()).toBeLessThan(withList);
    });

    test('難易度を切り替えると説明が変わる', async ({ page }) => {
      const hint = page.locator('#ws-difficulty-hint');
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
        page.locator('#ws-download-button').click(),
      ]);
      expect(download.suggestedFilename()).toBe('word-search-12x12.png');
    });

    test('印刷ボタンで印刷ダイアログが呼ばれる', async ({ page }) => {
      await page.evaluate(() => {
        (window as unknown as { __printed: number }).__printed = 0;
        window.print = () => {
          (window as unknown as { __printed: number }).__printed++;
        };
      });
      await page.locator('#ws-print-button').click();
      expect(
        await page.evaluate(
          () => (window as unknown as { __printed: number }).__printed,
        ),
      ).toBe(1);
    });
  });
}
