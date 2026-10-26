import { test, expect, type Page } from './helpers/test';

const PAGES = {
  ja: '/tools/gomoku/',
  en: '/en/tools/gomoku/',
} as const;
const SIZE = 15;
const CENTER = 7 * SIZE + 7;

const cell = (page: Page, index: number) =>
  page.locator(`#gm-board button[data-index="${index}"]`);

async function counts(page: Page) {
  return {
    black: Number(await page.locator('#gm-black-count').innerText()),
    white: Number(await page.locator('#gm-white-count').innerText()),
  };
}

/** data-* に埋め込んだ i18n 文言を取り出す */
async function dataText(page: Page, key: 'turnYou' | 'thinking') {
  return page
    .locator('#gm-root')
    .evaluate((el, k) => (el as HTMLElement).dataset[k] ?? '', key);
}

/** CPUの思考が終わり、あなたの番になるまで待つ */
async function waitForYourTurn(page: Page) {
  const yourTurn = await dataText(page, 'turnYou');
  await expect(page.locator('#gm-status')).toContainText(yourTurn, {
    timeout: 15_000,
  });
}

for (const locale of ['ja', 'en'] as const) {
  test.describe(`五目並べ (${locale})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(PAGES[locale]);
      await expect(page.locator('#gm-board button')).toHaveCount(225);
    });

    test('空の盤面から始まり、置いた石にCPUが応手する', async ({ page }) => {
      expect(await counts(page)).toEqual({ black: 0, white: 0 });
      await cell(page, CENTER).click();
      await waitForYourTurn(page);
      expect(await counts(page)).toEqual({ black: 1, white: 1 });
    });

    test('石のあるマスをクリックしても何も起きない', async ({ page }) => {
      await cell(page, CENTER).click();
      await waitForYourTurn(page);
      await cell(page, CENTER).click();
      expect(await counts(page)).toEqual({ black: 1, white: 1 });
    });

    test('「待った」で初期状態に戻る', async ({ page }) => {
      const undo = page.locator('#gm-undo-button');
      await expect(undo).toBeDisabled();
      await cell(page, CENTER).click();
      await waitForYourTurn(page);
      await expect(undo).toBeEnabled();
      await undo.click();
      expect(await counts(page)).toEqual({ black: 0, white: 0 });
      await expect(undo).toBeDisabled();
    });

    test('CPU思考中は「待った」がロックされ、手番が戻ると解除される', async ({
      page,
    }) => {
      const thinking = await dataText(page, 'thinking');
      await cell(page, CENTER).click();
      await expect(page.locator('#gm-status')).toContainText(thinking);
      await expect(page.locator('#gm-undo-button')).toBeDisabled();
      await waitForYourTurn(page);
      await expect(page.locator('#gm-undo-button')).toBeEnabled();
    });

    test('後手（白）を選ぶとCPUが先に中央へ打つ', async ({ page }) => {
      await page.locator('[data-side="2"]').click();
      await waitForYourTurn(page);
      expect(await counts(page)).toEqual({ black: 1, white: 0 });
      await expect(page.locator('[data-side="2"]')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });

    test('強さを切り替えると新しいゲームになる', async ({ page }) => {
      await cell(page, CENTER).click();
      await waitForYourTurn(page);
      await page.locator('[data-level="expert"]').click();
      expect(await counts(page)).toEqual({ black: 0, white: 0 });
      await expect(page.locator('[data-level="expert"]')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });

    test('375px幅で盤面が横にはみ出さない', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 800 });
      await page.goto(PAGES[locale]);
      await expect(page.locator('#gm-board button')).toHaveCount(225);
      const board = await page.locator('#gm-board').boundingBox();
      expect(board).not.toBeNull();
      expect(board!.x).toBeGreaterThanOrEqual(0);
      expect(board!.x + board!.width).toBeLessThanOrEqual(375);
      const cellBox = await cell(page, 0).boundingBox();
      expect(cellBox!.width).toBeGreaterThan(10);
      const hasOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(hasOverflow).toBe(false);
    });

    test('「エキスパート」のCPUは30秒以内に応手する', async ({ page }) => {
      test.setTimeout(60_000);
      await page.locator('[data-level="expert"]').click();
      await cell(page, CENTER).click();
      const started = Date.now();
      await waitForYourTurn(page);
      const elapsed = Date.now() - started;
      test.info().annotations.push({
        type: 'expert-think-ms',
        description: String(elapsed),
      });
      expect(elapsed).toBeLessThan(30_000);
    });

    test('矢印キーでマスを移動し Enter で石を置ける', async ({ page }) => {
      await cell(page, 0).focus();
      for (let i = 0; i < 7; i++) await page.keyboard.press('ArrowDown');
      for (let i = 0; i < 7; i++) await page.keyboard.press('ArrowRight');
      await expect(cell(page, CENTER)).toBeFocused();
      await page.keyboard.press('Enter');
      await waitForYourTurn(page);
      expect(await counts(page)).toEqual({ black: 1, white: 1 });
    });

    test('「かんたん」で終局まで進むと結果が表示され、クリックで閉じられる', async ({
      page,
    }) => {
      test.setTimeout(120_000);
      await page.locator('[data-level="easy"]').click();
      const result = page.locator('#gm-result');
      await expect(result).toBeHidden();
      // 上端の行から順に置く。かんたんのCPUはほぼランダムに打つため、勝敗は確率に依存する。
      // 勝ちでも負けでも引き分けでも終局すれば結果が出る、という点だけを検証する
      const order: number[] = [];
      for (let r = 0; r < SIZE; r++)
        for (let c = 0; c < SIZE; c++) order.push(r * SIZE + c);
      for (const index of order) {
        // 自分の番になるか、CPUが勝って終局するまで待つ（CPUの勝ちでも結果は出る）
        await expect
          .poll(
            async () =>
              (await result.isVisible()) ||
              (await page.locator('#gm-status').innerText()).includes(
                await dataText(page, 'turnYou'),
              ),
            { timeout: 15_000 },
          )
          .toBe(true);
        if (await result.isVisible()) break;
        const target = cell(page, index);
        if ((await target.locator('span').count()) > 0) continue;
        await target.click();
      }
      await expect(result).toBeVisible({ timeout: 15_000 });
      const outcomes = await page.locator('#gm-root').evaluate((el) => {
        const d = (el as HTMLElement).dataset;
        return [d.youWon, d.cpuWon, d.draw];
      });
      expect(outcomes).toContain(
        await page.locator('#gm-result-text').innerText(),
      );
      await result.click();
      await expect(result).toBeHidden();
      await page.locator('#gm-new-button').click();
      expect(await counts(page)).toEqual({ black: 0, white: 0 });
      await expect(result).toBeHidden();
    });
  });
}
