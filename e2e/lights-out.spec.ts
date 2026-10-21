import { test, expect } from './helpers/test';

test.describe('ライツアウト', () => {
  test('初期は5×5で、点灯が1つ以上あり手数は0', async ({ page }) => {
    await page.goto('/tools/lights-out/');
    await expect(page.locator('#lo-board button')).toHaveCount(25);
    await expect(page.locator('#lo-moves')).toHaveText('0');
    await expect(page.locator('#lo-lit')).not.toHaveText('0');
  });

  test('大きさを変えるとマス数が変わる', async ({ page }) => {
    await page.goto('/tools/lights-out/');
    await page.locator('[data-size="3"]').click();
    await expect(page.locator('#lo-board button')).toHaveCount(9);
    await page.locator('[data-size="7"]').click();
    await expect(page.locator('#lo-board button')).toHaveCount(49);
  });

  test('同じマスを2回押すと元に戻り、手数は2になる', async ({ page }) => {
    await page.goto('/tools/lights-out/');
    const before = await page.locator('#lo-lit').textContent();
    const cell = page.locator('#lo-board button').nth(12);
    await cell.click();
    await expect(page.locator('#lo-moves')).toHaveText('1');
    await cell.click();
    await expect(page.locator('#lo-moves')).toHaveText('2');
    await expect(page.locator('#lo-lit')).toHaveText(before ?? '');
  });

  test('ヒントを押し続けると3×3をクリアできる', async ({ page }) => {
    await page.goto('/tools/lights-out/');
    await page.locator('[data-size="3"]').click();
    for (let i = 0; i < 9; i++) {
      if ((await page.locator('#lo-lit').textContent()) === '0') break;
      await page.locator('#lo-hint-button').click();
      // ヒントで強調されたマス（フォーカスされたマス）を押す
      await page.locator('#lo-board button:focus').click();
    }
    await expect(page.locator('#lo-lit')).toHaveText('0');
    await expect(page.locator('#lo-status')).toContainText('クリア');
  });

  test('「やり直し」で開始時の盤面と手数0に戻る', async ({ page }) => {
    await page.goto('/tools/lights-out/');
    const before = await page.locator('#lo-lit').textContent();
    await page.locator('#lo-board button').first().click();
    await page.locator('#lo-restart-button').click();
    await expect(page.locator('#lo-moves')).toHaveText('0');
    await expect(page.locator('#lo-lit')).toHaveText(before ?? '');
  });

  test('英語ページでも動作する', async ({ page }) => {
    await page.goto('/en/tools/lights-out/');
    await expect(page.locator('#lo-board button')).toHaveCount(25);
    await page.locator('#lo-hint-button').click();
    await expect(page.locator('#lo-status')).toContainText('Hint:');
  });
});
