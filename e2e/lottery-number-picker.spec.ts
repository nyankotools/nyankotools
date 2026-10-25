import { test, expect } from './helpers/test';

test.describe('ロト・ナンバーズ番号ランダム選出', () => {
  test('ロト6は6個の番号を昇順で表示する', async ({ page }) => {
    await page.goto('/tools/lottery-number-picker/');
    await page.locator('#lnp-generate-button').click();
    const balls = page.locator('#lnp-result-list li span.rounded-full');
    await expect(balls).toHaveCount(6);
    const nums = (await balls.allTextContents()).map(Number);
    expect(new Set(nums).size).toBe(6);
    expect([...nums].sort((a, b) => a - b)).toEqual(nums);
    expect(nums.every((n) => n >= 1 && n <= 43)).toBe(true);
  });

  test('ナンバーズ3を3口生成する', async ({ page }) => {
    await page.goto('/tools/lottery-number-picker/');
    await page.locator('#lnp-game [data-game="numbers3"]').click();
    await page.locator('#lnp-count').fill('3');
    await page.locator('#lnp-generate-button').click();
    await expect(page.locator('#lnp-result-list li')).toHaveCount(3);
    await expect(
      page.locator('#lnp-result-list li').first().locator('.rounded-full'),
    ).toHaveCount(3);
    await expect(page.locator('#lnp-result-title')).toContainText('3口');
  });

  test('口数が範囲外だとエラーを表示する', async ({ page }) => {
    await page.goto('/tools/lottery-number-picker/');
    await page.locator('#lnp-count').fill('99');
    await page.locator('#lnp-generate-button').click();
    await expect(page.locator('#lnp-error')).toContainText('1〜20');
    await expect(page.locator('#lnp-result')).toBeHidden();
  });

  test('英語ページでも動作する', async ({ page }) => {
    await page.goto('/en/tools/lottery-number-picker/');
    await page.locator('#lnp-game [data-game="miniloto"]').click();
    await page.locator('#lnp-generate-button').click();
    await expect(
      page.locator('#lnp-result-list li span.rounded-full'),
    ).toHaveCount(5);
  });
});
