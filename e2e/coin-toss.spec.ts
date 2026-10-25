import { test, expect } from './helpers/test';

test.describe('コイントスツール', () => {
  test.beforeEach(async ({ page }) => {
    // 回転アニメーションを省略して結果をすぐ表示させる
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('1回投げると表か裏が結果に出て、履歴に1件追加される', async ({
    page,
  }) => {
    await page.goto('/tools/coin-toss/');
    await page.locator('#ct-toss-button').click();
    await expect(page.locator('#ct-result-title')).toHaveText(/^結果: [表裏]$/);
    await expect(page.locator('#ct-history li')).toHaveCount(1);
    await expect(page.locator('#ct-stats-line')).toContainText('合計 1回');
  });

  test('連続で投げると回数分の履歴と合計が表示される', async ({ page }) => {
    await page.goto('/tools/coin-toss/');
    await page.locator('#ct-count').fill('10');
    await page.locator('#ct-toss-button').click();
    await expect(page.locator('#ct-result-title')).toContainText(
      '10回投げました',
    );
    await expect(page.locator('#ct-history li')).toHaveCount(10);
    await expect(page.locator('.ct-coin')).toHaveCount(10);
    await expect(page.locator('#ct-current-streak')).toContainText(
      '現在の連続',
    );
  });

  test('回数を変えるとコインの枚数も変わる', async ({ page }) => {
    await page.goto('/tools/coin-toss/');
    await expect(page.locator('.ct-coin')).toHaveCount(1);
    await page.locator('#ct-count').fill('4');
    await expect(page.locator('.ct-coin')).toHaveCount(4);
    await page.locator('#ct-count').fill('10');
    await expect(page.locator('.ct-coin')).toHaveCount(10);
    await page.locator('#ct-count').fill('2');
    await expect(page.locator('.ct-coin')).toHaveCount(2);
  });

  test('回数が範囲外だとエラーを表示し、履歴は増えない', async ({ page }) => {
    await page.goto('/tools/coin-toss/');
    await page.locator('#ct-count').fill('11');
    await page.locator('#ct-toss-button').click();
    await expect(page.locator('#ct-error')).toContainText('1〜10');
    await expect(page.locator('#ct-history li')).toHaveCount(0);
  });

  test('履歴をクリアすると集計が空に戻る', async ({ page }) => {
    await page.goto('/tools/coin-toss/');
    await page.locator('#ct-toss-button').click();
    await expect(page.locator('#ct-history li')).toHaveCount(1);
    await page.locator('#ct-clear-button').click();
    await expect(page.locator('#ct-history li')).toHaveCount(0);
    await expect(page.locator('#ct-stats-line')).toContainText(
      'まだ投げていません',
    );
  });

  test('prefers-reduced-motion では回転アニメーションを使わない', async ({
    page,
  }) => {
    await page.goto('/tools/coin-toss/');
    await page.locator('#ct-toss-button').click();
    await expect(page.locator('#ct-result-title')).toBeVisible();
    const transition = await page
      .locator('.ct-coin')
      .first()
      .evaluate((el) => (el as HTMLElement).style.transition);
    expect(transition).toBe('none');
  });

  test('アニメーション有効時も回転後に結果が表示される', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/tools/coin-toss/');
    await page.locator('#ct-count').fill('3');
    await page.locator('#ct-toss-button').click();
    // 回転（1.6秒）の後に結果が出ること。終わるまで再度投げられないこと
    await expect(page.locator('#ct-toss-button')).toBeDisabled();
    await expect(page.locator('#ct-result-title')).toContainText(
      '3回投げました',
      { timeout: 5000 },
    );
    await expect(page.locator('#ct-toss-button')).toBeEnabled();
    await expect(page.locator('#ct-history li')).toHaveCount(3);
  });

  test('英語ページでも投げられる', async ({ page }) => {
    await page.goto('/en/tools/coin-toss/');
    await page.locator('#ct-toss-button').click();
    await expect(page.locator('#ct-result-title')).toHaveText(
      /^Result: (Heads|Tails)$/,
    );
  });
});
