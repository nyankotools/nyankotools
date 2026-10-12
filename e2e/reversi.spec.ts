import { test, expect, type Page } from './helpers/test';

const PAGES = {
  ja: '/tools/reversi/',
  en: '/en/tools/reversi/',
} as const;
// 黒の最初の合法手 (2,3)
const FIRST_MOVE = 2 * 8 + 3;

const cell = (page: Page, index: number) =>
  page.locator(`#rv-board button[data-index="${index}"]`);

async function counts(page: Page) {
  return {
    black: Number(await page.locator('#rv-black-count').innerText()),
    white: Number(await page.locator('#rv-white-count').innerText()),
  };
}

/** data-* に埋め込んだ i18n 文言を取り出す */
async function dataText(page: Page, key: 'turnYou' | 'thinking') {
  return page
    .locator('#rv-root')
    .evaluate((el, k) => (el as HTMLElement).dataset[k] ?? '', key);
}

/** CPUの思考が終わり、あなたの番になるまで待つ */
async function waitForYourTurn(page: Page) {
  const yourTurn = await dataText(page, 'turnYou');
  await expect(page.locator('#rv-status')).toContainText(yourTurn, {
    timeout: 10_000,
  });
}

for (const locale of ['ja', 'en'] as const) {
  test.describe(`リバーシ (${locale})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(PAGES[locale]);
      await expect(page.locator('#rv-board button')).toHaveCount(64);
    });

    test('初期配置は黒2・白2で、置いた石が反映されCPUが応手する', async ({
      page,
    }) => {
      expect(await counts(page)).toEqual({ black: 2, white: 2 });
      await cell(page, FIRST_MOVE).click();
      await waitForYourTurn(page);
      const { black, white } = await counts(page);
      // 黒1手＋白1手で石は合計6個
      expect(black + white).toBe(6);
    });

    test('置けない場所をクリックしても何も起きない', async ({ page }) => {
      await cell(page, 0).click();
      expect(await counts(page)).toEqual({ black: 2, white: 2 });
    });

    test('「待った」で初期状態に戻る', async ({ page }) => {
      const undo = page.locator('#rv-undo-button');
      await expect(undo).toBeDisabled();
      await cell(page, FIRST_MOVE).click();
      await waitForYourTurn(page);
      await expect(undo).toBeEnabled();
      await undo.click();
      expect(await counts(page)).toEqual({ black: 2, white: 2 });
      await expect(undo).toBeDisabled();
    });

    test('CPU思考中は置く操作と「待った」がロックされ、手番が戻ると解除される', async ({
      page,
    }) => {
      const thinking = await dataText(page, 'thinking');
      const movable = page.locator('#rv-board button.cursor-pointer');
      await cell(page, FIRST_MOVE).click();
      await expect(page.locator('#rv-status')).toContainText(thinking);
      await expect(page.locator('#rv-undo-button')).toBeDisabled();
      // 思考中は合法手の表示（cursor-pointer）が出ず、クリックも効かない
      await expect(movable).toHaveCount(0);
      await waitForYourTurn(page);
      await expect(page.locator('#rv-undo-button')).toBeEnabled();
      expect(await movable.count()).toBeGreaterThan(0);
    });

    test('ダークモードで文字色が切り替わる', async ({ page }) => {
      const status = page.locator('#rv-status');
      const colorOf = () => status.evaluate((el) => getComputedStyle(el).color);
      const light = await colorOf();
      await page.evaluate(() => document.documentElement.classList.add('dark'));
      const dark = await colorOf();
      expect(dark).not.toBe(light);
      await page.evaluate(() =>
        document.documentElement.classList.remove('dark'),
      );
      expect(await colorOf()).toBe(light);
    });

    test('後手（白）を選ぶとCPUが先に打つ', async ({ page }) => {
      await page.locator('[data-side="2"]').click();
      await waitForYourTurn(page);
      const { black, white } = await counts(page);
      expect(black + white).toBe(5);
      await expect(page.locator('[data-side="2"]')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });

    test('ヒントの切り替えで置ける場所の点が出入りする', async ({ page }) => {
      const hint = page.locator('#rv-hint-button');
      const dots = page.locator('#rv-board button span[aria-hidden="true"]');
      await expect(dots).toHaveCount(0);
      await hint.click();
      await expect(hint).toHaveAttribute('aria-pressed', 'true');
      await expect(dots).toHaveCount(4);
      await hint.click();
      await expect(dots).toHaveCount(0);
    });

    test('強さを切り替えると新しいゲームになる', async ({ page }) => {
      await cell(page, FIRST_MOVE).click();
      await waitForYourTurn(page);
      await page.locator('[data-level="expert"]').click();
      expect(await counts(page)).toEqual({ black: 2, white: 2 });
      await expect(page.locator('[data-level="expert"]')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });

    test('終局すると勝敗が盤面中央に表示され、クリックで閉じられる', async ({
      page,
    }) => {
      test.setTimeout(120_000);
      await page.locator('[data-level="easy"]').click();
      const result = page.locator('#rv-result');
      await expect(result).toBeHidden();
      for (let i = 0; i < 70 && !(await result.isVisible()); i++) {
        const legal = page.locator('#rv-board button.cursor-pointer');
        // 自分の番（置ける場所が出る）か、終局表示のどちらかになるまで待つ
        await expect
          .poll(
            async () => (await legal.count()) > 0 || (await result.isVisible()),
            {
              timeout: 10_000,
            },
          )
          .toBe(true);
        if (await result.isVisible()) break;
        await legal.first().click();
      }
      await expect(result).toBeVisible();
      await expect(page.locator('#rv-result-text')).not.toBeEmpty();
      const box = await result.boundingBox();
      const board = await page.locator('#rv-board').boundingBox();
      expect(box?.x).toBeCloseTo(board?.x ?? -1, 0);
      await result.click();
      await expect(result).toBeHidden();
      // 「新しいゲーム」で盤面が戻り、表示も消えたままになる
      await page.locator('#rv-new-button').click();
      expect(await counts(page)).toEqual({ black: 2, white: 2 });
      await expect(result).toBeHidden();
    });

    test('矢印キーでマスを移動し Enter で石を置ける', async ({ page }) => {
      await cell(page, 0).focus();
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowRight');
      await expect(cell(page, FIRST_MOVE)).toBeFocused();
      await page.keyboard.press('Enter');
      await waitForYourTurn(page);
      const { black, white } = await counts(page);
      expect(black + white).toBe(6);
    });
  });
}
