import { test, expect } from './helpers/test';

test.describe('ビンゴ抽選機・カード生成', () => {
  test('抽選すると番号が履歴に追加され、重複しない', async ({ page }) => {
    await page.goto('/tools/bingo-generator/');
    await page.locator('#bg-max').fill('5');
    await page.locator('#bg-max').blur();
    for (let i = 0; i < 5; i++) {
      await page.locator('#bg-draw-button').click();
    }
    const items = await page.locator('#bg-history li').allTextContents();
    expect(items).toHaveLength(5);
    expect(new Set(items).size).toBe(5);
    await expect(page.locator('#bg-draw-button')).toBeDisabled();
    await expect(page.locator('#bg-finished')).toBeVisible();
  });

  test('リセットで履歴が消える', async ({ page }) => {
    await page.goto('/tools/bingo-generator/');
    await page.locator('#bg-draw-button').click();
    await expect(page.locator('#bg-history li')).toHaveCount(1);
    await page.locator('#bg-reset-button').click();
    await expect(page.locator('#bg-history li')).toHaveCount(0);
  });

  test('75のときは列見出し付きで大きく表示される', async ({ page }) => {
    await page.goto('/tools/bingo-generator/');
    await page.locator('#bg-draw-button').click();
    await expect(page.locator('#bg-current')).toHaveText(/^[BINGO]-\d+$/);
  });

  test('カードを人数分作れる。中央はFREEで、範囲外の枚数は丸められる', async ({
    page,
  }) => {
    await page.goto('/tools/bingo-generator/');
    await page.locator('#bg-count').fill('3');
    await page.locator('#bg-cards-generate-button').click();
    await expect(page.locator('#bg-cards table')).toHaveCount(3);
    await expect(
      page
        .locator('#bg-cards table')
        .first()
        .locator('tbody tr')
        .nth(2)
        .locator('td')
        .nth(2),
    ).toHaveText('FREE');
    await page.locator('#bg-count').fill('5000');
    await page.locator('#bg-cards-generate-button').click();
    await expect(page.locator('#bg-cards table')).toHaveCount(100);
  });

  test('英語ページでも動作する', async ({ page }) => {
    await page.goto('/en/tools/bingo-generator/');
    await page.locator('#bg-draw-button').click();
    await expect(page.locator('#bg-history li')).toHaveCount(1);
  });

  test('フルスクリーン状態では大きい文字が表示される', async ({ page }) => {
    await page.goto('/tools/bingo-generator/');
    await page.locator('#bg-draw-button').click();
    const current = page.locator('#bg-current');
    // フルスクリーン時のクラスが設定されているか確認
    const classes = await current.getAttribute('class');
    expect(classes).toContain('group-[:fullscreen]:text-[9rem]');
  });

  test('カードを生成して印刷準備ができる', async ({ page }) => {
    await page.goto('/tools/bingo-generator/');
    await page.locator('#bg-count').fill('2');
    await page.locator('#bg-cards-generate-button').click();
    const printButton = page.locator('#bg-print-button');
    await expect(printButton).not.toBeDisabled();
    // キャプション（カード番号）が表示されている
    await expect(page.locator('#bg-cards table caption')).toHaveCount(2);
  });
});
