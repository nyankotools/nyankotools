import { test, expect } from './helpers/test';

test.describe('必要量計算（日本語版）', () => {
  test('初期値で壁紙のロール数が計算される', async ({ page }) => {
    await page.goto('/tools/material-quantity/');

    // 壁33.6 - 3.1 = 30.5㎡ × 1.1 = 33.55 ÷ 9.3 → 4ロール
    await expect(page.locator('#mq-result-rolls')).toHaveText('4 ロール');
    await expect(page.locator('#mq-result-net')).toHaveText('30.5 ㎡');
  });

  test('塗料に切り替えて缶数が計算される', async ({ page }) => {
    await page.goto('/tools/material-quantity/');

    await page.getByRole('radio', { name: '塗料' }).check();
    await expect(page.locator('#mq-result-cans')).toHaveText('3 缶');
    await expect(page.locator('#mq-result-rolls')).toBeHidden();
  });

  test('タイル・床材は床面積で枚数と箱数を出す', async ({ page }) => {
    await page.goto('/tools/material-quantity/');

    await page.getByRole('radio', { name: 'タイル・床材' }).check();
    // 12㎡ × 1.1 ÷ 0.09 = 146.7 → 147枚、10枚入りで15箱
    await expect(page.locator('#mq-result-pieces')).toHaveText('147 枚');
    await expect(page.locator('#mq-result-boxes')).toHaveText('15 箱');
    await expect(page.locator('#mq-height-wrap')).toBeHidden();
  });

  test('面積の直接入力と不正値のエラー表示', async ({ page }) => {
    await page.goto('/tools/material-quantity/');

    await page.getByRole('radio', { name: '面積を直接入力' }).check();
    await page.locator('#mq-area').fill('20');
    await expect(page.locator('#mq-result-net')).toHaveText('16.9 ㎡');

    await page.locator('#mq-loss').fill('-5');
    await expect(page.locator('#mq-error')).not.toHaveText('');
    await expect(page.locator('#mq-results')).toBeHidden();
  });
});

test.describe('Material Quantity Calculator (English)', () => {
  test('英語版が表示され、計算できる', async ({ page }) => {
    await page.goto('/en/tools/material-quantity/');

    await expect(page.locator('#mq-result-rolls')).toHaveText('4 rolls');
    await page.locator('#mq-width').fill('0');
    await expect(page.locator('#mq-error')).toContainText(
      'Could not calculate',
    );
  });
});
