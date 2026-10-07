import { test, expect } from './helpers/test';

test.describe('ガチャ確率計算機', () => {
  test('初期値（3%・100回・天井200・3石）で計算される', async ({ page }) => {
    await page.goto('/tools/gacha-calculator/');

    await expect(page.locator('#gacha-result-probability')).toHaveText(
      '95.24%',
    );
    await expect(page.locator('#gacha-result-ceiling-stones')).toHaveText(
      '600個',
    );
    await expect(page.locator('#gacha-result-owned-pulls')).toHaveText('100回');
    await expect(page.locator('#gacha-result-owned-probability')).toHaveText(
      '95.24%',
    );
    await expect(page.locator('#gacha-confidence li').first()).toHaveText(
      '50%に届くまで: 23回',
    );
  });

  test('天井回数以上を引くと確率が100%になる', async ({ page }) => {
    await page.goto('/tools/gacha-calculator/');

    await page.locator('#gacha-pulls').fill('200');
    await expect(page.locator('#gacha-result-probability')).toHaveText('100%');
  });

  test('石数と天井を空にすると石数関連の行が非表示になる', async ({ page }) => {
    await page.goto('/tools/gacha-calculator/');

    await page.locator('#gacha-ceiling').fill('');
    await page.locator('#gacha-cost').fill('');

    await expect(page.locator('#gacha-row-ceiling-stones')).toBeHidden();
    await expect(page.locator('#gacha-row-expected-stones')).toBeHidden();
    await expect(page.locator('#gacha-row-owned-pulls')).toBeHidden();
    await expect(page.locator('#gacha-result-expected-pulls')).toHaveText(
      '34回',
    );
  });

  test('排出率が範囲外だとエラーが表示される', async ({ page }) => {
    await page.goto('/tools/gacha-calculator/');

    await page.locator('#gacha-rate').fill('150');
    await expect(page.locator('#gacha-error')).toContainText(
      '計算できませんでした',
    );
    await expect(page.locator('#gacha-results')).toBeHidden();
  });
});
