import { test, expect, type Page } from './helpers/test';

const PAGES = {
  ja: '/tools/connect-four/',
  en: '/en/tools/connect-four/',
} as const;

const drop = (page: Page, col: number) =>
  page.locator(`#cf-drops button[data-col="${col}"]`);
const red = (page: Page) => page.locator('#cf-board .bg-red-600');
const yellow = (page: Page) => page.locator('#cf-board .bg-yellow-400');

/** data-* に埋め込んだ i18n 文言を取り出す */
async function dataText(page: Page, key: 'turnYou' | 'thinking') {
  return page
    .locator('#cf-root')
    .evaluate((el, k) => (el as HTMLElement).dataset[k] ?? '', key);
}

/** CPUの思考が終わり、あなたの番になるまで待つ */
async function waitForYourTurn(page: Page) {
  const yourTurn = await dataText(page, 'turnYou');
  await expect(page.locator('#cf-status')).toContainText(yourTurn, {
    timeout: 10_000,
  });
}

for (const locale of ['ja', 'en'] as const) {
  test.describe(`四目並べ (${locale})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(PAGES[locale]);
      await expect(page.locator('#cf-board > div')).toHaveCount(42);
    });

    test('石を落とすとCPUが応手し、石は下から積み上がる', async ({ page }) => {
      await expect(red(page)).toHaveCount(0);
      await drop(page, 3).click();
      await expect(red(page)).toHaveCount(1);
      await waitForYourTurn(page);
      expect((await red(page).count()) + (await yellow(page).count())).toBe(2);
      // 最下段（35〜41番目のマス）に赤が置かれている
      const index = await page
        .locator('#cf-board > div')
        .evaluateAll((els) =>
          els.findIndex((e) => e.classList.contains('bg-red-600')),
        );
      expect(index).toBe(38);
    });

    test('「待った」で初期状態に戻る', async ({ page }) => {
      const undo = page.locator('#cf-undo-button');
      await expect(undo).toBeDisabled();
      await drop(page, 3).click();
      await waitForYourTurn(page);
      await expect(undo).toBeEnabled();
      await undo.click();
      await expect(red(page)).toHaveCount(0);
      await expect(yellow(page)).toHaveCount(0);
      await expect(undo).toBeDisabled();
    });

    test('CPU思考中は落とす操作がロックされ、手番が戻ると解除される', async ({
      page,
    }) => {
      await drop(page, 3).click();
      await expect(page.locator('#cf-status')).toContainText(
        await dataText(page, 'thinking'),
      );
      await expect(drop(page, 0)).toBeDisabled();
      await waitForYourTurn(page);
      await expect(drop(page, 0)).toBeEnabled();
    });

    test('後手を選ぶとCPUが先に打つ', async ({ page }) => {
      await page.locator('[data-side="2"]').click();
      await waitForYourTurn(page);
      await expect(red(page)).toHaveCount(1);
      await expect(page.locator('[data-side="2"]')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });

    test('強さを切り替えると新しいゲームになる', async ({ page }) => {
      await drop(page, 3).click();
      await waitForYourTurn(page);
      await page.locator('[data-level="hard"]').click();
      await expect(red(page)).toHaveCount(0);
      await expect(page.locator('[data-level="hard"]')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });

    test('盤面のマスをクリックしても列に落ちる', async ({ page }) => {
      await page.locator('#cf-board > div').nth(2).click();
      await expect(red(page)).toHaveCount(1);
    });

    test('終局すると勝敗が表示され、クリックで閉じられる', async ({ page }) => {
      test.setTimeout(120_000);
      await page.locator('[data-level="easy"]').click();
      const result = page.locator('#cf-result');
      await expect(result).toBeHidden();
      // 同じ列に落とし続ける（満杯になったら次の列へ）。easy相手なら終局まで進む
      for (let i = 0; i < 60 && !(await result.isVisible()); i++) {
        await expect
          .poll(
            async () =>
              (await result.isVisible()) ||
              (await page.locator('#cf-drops button:enabled').count()) > 0,
            { timeout: 10_000 },
          )
          .toBe(true);
        if (await result.isVisible()) break;
        await page.locator('#cf-drops button:enabled').first().click();
      }
      await expect(result).toBeVisible();
      await expect(page.locator('#cf-result-text')).not.toBeEmpty();
      await result.click();
      await expect(result).toBeHidden();
      await page.locator('#cf-new-button').click();
      await expect(red(page)).toHaveCount(0);
      await expect(result).toBeHidden();
    });
  });
}
