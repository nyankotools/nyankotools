import { test, expect, type Page } from './helpers/test';

const PAGES = {
  ja: '/tools/tic-tac-toe/',
  en: '/en/tools/tic-tac-toe/',
} as const;

const cell = (page: Page, i: number) =>
  page.locator(`#ttt-board button[data-index="${i}"]`);

async function dataText(page: Page, key: 'turnYou' | 'thinking') {
  return page
    .locator('#ttt-root')
    .evaluate((el, k) => (el as HTMLElement).dataset[k] ?? '', key);
}

async function waitForYourTurn(page: Page) {
  const yourTurn = await dataText(page, 'turnYou');
  await expect(page.locator('#ttt-status')).toContainText(yourTurn, {
    timeout: 10_000,
  });
}

/** 置かれたマークの数 */
const marks = (page: Page) =>
  page
    .locator('#ttt-board button')
    .evaluateAll(
      (els) => els.filter((e) => (e.textContent ?? '').trim() !== '').length,
    );

for (const locale of ['ja', 'en'] as const) {
  test.describe(`三目並べ (${locale})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(PAGES[locale]);
      await expect(page.locator('#ttt-board button')).toHaveCount(9);
    });

    test('マスを選ぶとCPUが応手する', async ({ page }) => {
      await cell(page, 4).click();
      await expect(cell(page, 4)).not.toHaveText('');
      await waitForYourTurn(page);
      expect(await marks(page)).toBe(2);
    });

    test('「待った」で初期状態に戻る', async ({ page }) => {
      const undo = page.locator('#ttt-undo-button');
      await expect(undo).toBeDisabled();
      await cell(page, 4).click();
      await waitForYourTurn(page);
      await expect(undo).toBeEnabled();
      await undo.click();
      expect(await marks(page)).toBe(0);
      await expect(undo).toBeDisabled();
    });

    test('CPU思考中は操作がロックされ、手番が戻ると解除される', async ({
      page,
    }) => {
      await cell(page, 4).click();
      await expect(page.locator('#ttt-status')).toContainText(
        await dataText(page, 'thinking'),
      );
      await expect(cell(page, 0)).toBeDisabled();
      await waitForYourTurn(page);
      const empty = page.locator('#ttt-board button:enabled');
      await expect(empty.first()).toBeEnabled();
    });

    test('後手を選ぶとCPUが先に打つ', async ({ page }) => {
      await page.locator('[data-side="2"]').click();
      await waitForYourTurn(page);
      expect(await marks(page)).toBe(1);
      await expect(page.locator('[data-side="2"]')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });

    test('強さを切り替えると新しいゲームになる', async ({ page }) => {
      await cell(page, 4).click();
      await waitForYourTurn(page);
      await page.locator('[data-level="hard"]').click();
      expect(await marks(page)).toBe(0);
      await expect(page.locator('[data-level="hard"]')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });

    test('最強相手は終局まで進み、勝敗が表示され、クリックで閉じられる', async ({
      page,
    }) => {
      test.setTimeout(60_000);
      await page.locator('[data-level="hard"]').click();
      const result = page.locator('#ttt-result');
      await expect(result).toBeHidden();
      for (let i = 0; i < 9 && !(await result.isVisible()); i++) {
        await expect
          .poll(
            async () =>
              (await result.isVisible()) ||
              (await page.locator('#ttt-board button:enabled').count()) > 0,
            { timeout: 10_000 },
          )
          .toBe(true);
        if (await result.isVisible()) break;
        await page.locator('#ttt-board button:enabled').first().click();
      }
      await expect(result).toBeVisible();
      await expect(page.locator('#ttt-result-text')).not.toBeEmpty();
      await result.click();
      await expect(result).toBeHidden();
      await page.locator('#ttt-new-button').click();
      expect(await marks(page)).toBe(0);
      await expect(result).toBeHidden();
    });
  });
}
