import { test, expect } from './helpers/test';

test.describe('ドット抜けチェック', () => {
  test('開始すると白で塗りつぶされ、クリックと矢印キーで色が切り替わる', async ({
    page,
  }) => {
    await page.goto('/tools/dead-pixel-checker/');
    const stage = page.locator('#dpc-stage');
    await expect(stage).toBeHidden();

    await page.locator('#dpc-start').click();
    await expect(stage).toBeVisible();
    await expect(stage).toHaveCSS('background-color', 'rgb(255, 255, 255)');

    await stage.click({ position: { x: 200, y: 200 } });
    await expect(stage).toHaveCSS('background-color', 'rgb(0, 0, 0)');

    await page.keyboard.press('ArrowRight');
    await expect(stage).toHaveCSS('background-color', 'rgb(255, 0, 0)');

    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await expect(stage).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    // 先頭からさらに戻ると最後の色（グレー）に回り込む
    await page.keyboard.press('ArrowLeft');
    await expect(stage).toHaveCSS('background-color', 'rgb(128, 128, 128)');
  });

  test('色ボタンからその色で開始でき、終了ボタンで閉じる', async ({ page }) => {
    await page.goto('/tools/dead-pixel-checker/');
    await page.locator('[data-dpc-color="4"]').click();
    const stage = page.locator('#dpc-stage');
    await expect(stage).toHaveCSS('background-color', 'rgb(0, 0, 255)');

    await page.locator('#dpc-close').click();
    await expect(stage).toBeHidden();
    // 閉じた後、ページ側のスクロールが復帰している
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  });

  test('Escapeキーで閉じる', async ({ page }) => {
    await page.goto('/tools/dead-pixel-checker/');
    await page.locator('#dpc-start').click();
    await expect(page.locator('#dpc-stage')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#dpc-stage')).toBeHidden();
  });

  test('英語版でも開始できる', async ({ page }) => {
    await page.goto('/en/tools/dead-pixel-checker/');
    await page.locator('#dpc-start').click();
    await expect(page.locator('#dpc-stage')).toBeVisible();
  });
});
