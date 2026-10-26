import { test, expect } from './helpers/test';

const PAGES = {
  ja: '/tools/blackjack/',
  en: '/en/tools/blackjack/',
} as const;

for (const locale of ['ja', 'en'] as const) {
  test.describe(`ブラックジャック (${locale})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(PAGES[locale]);
      await expect(page.locator('#bj-chips')).toHaveText('1000');
    });

    test('配ると2枚ずつ配られ、ディーラーの1枚は伏せられる', async ({
      page,
    }) => {
      await page.locator('#bj-deal-button').click();
      await expect(page.locator('#bj-player > div')).toHaveCount(2);
      await expect(page.locator('#bj-dealer > div')).toHaveCount(2);
      // ナチュラルで即終局することがあるため、プレイ中のときだけ確認する
      if (await page.locator('#bj-hit-button').isEnabled()) {
        await expect(page.locator('#bj-dealer > div').nth(1)).toHaveText('?');
        await expect(page.locator('#bj-chips')).toHaveText('950');
      }
    });

    test('スタンドすると勝敗が表示され、もう一度配れる', async ({ page }) => {
      const deal = page.locator('#bj-deal-button');
      await deal.click();
      const stand = page.locator('#bj-stand-button');
      if (await stand.isEnabled()) await stand.click();
      await expect(deal).toBeEnabled();
      await expect(stand).toBeDisabled();
      await expect(page.locator('#bj-status')).not.toBeEmpty();
      await expect(page.locator('#bj-dealer-total')).not.toBeEmpty();
      await deal.click();
      await expect(page.locator('#bj-player > div')).toHaveCount(2);
    });

    test('ベット額を選ぶとその額が引かれる', async ({ page }) => {
      await page.locator('[data-bet="100"]').click();
      await expect(page.locator('[data-bet="100"]')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      await page.locator('#bj-deal-button').click();
      if (await page.locator('#bj-hit-button').isEnabled()) {
        await expect(page.locator('#bj-chips')).toHaveText('900');
        await expect(page.locator('#bj-double-button')).toBeEnabled();
      }
    });

    test('チップをリセットすると1000に戻る', async ({ page }) => {
      await page.locator('[data-bet="500"]').click();
      await page.locator('#bj-deal-button').click();
      const stand = page.locator('#bj-stand-button');
      if (await stand.isEnabled()) await stand.click();
      await page.locator('#bj-reset-button').click();
      await expect(page.locator('#bj-chips')).toHaveText('1000');
      await expect(page.locator('#bj-player > div')).toHaveCount(0);
    });
  });
}
