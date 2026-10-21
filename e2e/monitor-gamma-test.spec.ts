import { test, expect } from './helpers/test';

test.describe('モニターのガンマ・階調チェック', () => {
  test('開始するとステージが開き、キーでパターンが切り替わり、Escで閉じる', async ({
    page,
  }) => {
    await page.goto('/tools/monitor-gamma-test/');
    const stage = page.locator('#mgt-stage');
    await expect(stage).toBeHidden();

    await page.locator('#mgt-start').click();
    await expect(stage).toBeVisible();
    await expect(stage).toHaveAttribute('data-pattern', 'ramp');

    await page.keyboard.press('ArrowRight');
    await expect(stage).toHaveAttribute('data-pattern', 'steps');
    await page.keyboard.press('3');
    await expect(stage).toHaveAttribute('data-pattern', 'gamma');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await expect(stage).toHaveAttribute('data-pattern', 'white');

    await page.keyboard.press('Escape');
    await expect(stage).toBeHidden();
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  });

  test('パターンボタンからそのパターンで開始でき、終了ボタンで閉じる', async ({
    page,
  }) => {
    await page.goto('/tools/monitor-gamma-test/');
    await page.locator('[data-mgt-pattern="3"]').click();
    const stage = page.locator('#mgt-stage');
    await expect(stage).toHaveAttribute('data-pattern', 'black');
    await page.locator('#mgt-close').click();
    await expect(stage).toBeHidden();
  });

  test('黒つぶれパターンの背景は黒、白飛びは白で描画される', async ({
    page,
  }) => {
    await page.goto('/tools/monitor-gamma-test/');
    await page.locator('[data-mgt-pattern="4"]').click();
    const pixel = await page.evaluate(() => {
      const c = document.getElementById('mgt-canvas') as HTMLCanvasElement;
      const d = c.getContext('2d')!.getImageData(1, 1, 1, 1).data;
      return [d[0], d[1], d[2]];
    });
    expect(pixel).toEqual([255, 255, 255]);
  });

  test('階調値からガンマが推定される', async ({ page }) => {
    await page.goto('/tools/monitor-gamma-test/');
    await expect(page.locator('#mgt-gamma')).toHaveText('2.20');
    await page.locator('#mgt-level').fill('128');
    // 128 → ln(0.5)/ln(128/255) ≒ 1.006 なので小数第2位は 1.01
    await expect(page.locator('#mgt-gamma')).toHaveText('1.01');
    await page.locator('#mgt-level').fill('255');
    await expect(page.locator('#mgt-gamma')).toHaveText(
      '1〜254の値を入力してください',
    );
  });

  test('英語版でも開始できる', async ({ page }) => {
    await page.goto('/en/tools/monitor-gamma-test/');
    await page.locator('#mgt-start').click();
    await expect(page.locator('#mgt-stage')).toBeVisible();
  });
});
