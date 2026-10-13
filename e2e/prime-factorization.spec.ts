import { test, expect } from './helpers/test';

test.describe('素因数分解・GCD/LCM', () => {
  test('素因数分解と約数一覧が表示される', async ({ page }) => {
    await page.goto('/tools/prime-factorization/');
    await page.locator('#pf-factor-input').fill('360');
    await expect(page.locator('#pf-rows')).toContainText('2^3 × 3^2 × 5');
    await expect(page.locator('#pf-rows')).toContainText('1170');
    await expect(page.locator('#pf-rows')).toContainText('1, 2, 3, 4, 5, 6');
  });

  test('素数・巨大な整数を正確に扱う', async ({ page }) => {
    await page.goto('/tools/prime-factorization/');
    await page.locator('#pf-factor-input').fill('2305843009213693951');
    await expect(page.locator('#pf-rows')).toContainText('素数です');
    await page.locator('#pf-factor-input').fill('1000000007 * 3');
    await expect(page.locator('#pf-error')).toBeVisible();
    await page.locator('#pf-factor-input').fill('3000000021');
    await expect(page.locator('#pf-rows')).toContainText('3 × 1000000007');
  });

  test('0・1・負数・小数はエラーを表示する', async ({ page }) => {
    await page.goto('/tools/prime-factorization/');
    for (const value of ['0', '1', '-6', '3.5']) {
      await page.locator('#pf-factor-input').fill(value);
      await expect(page.locator('#pf-error')).toBeVisible();
      await expect(page.locator('#pf-result')).toBeHidden();
    }
    await page.locator('#pf-factor-input').fill('');
    await expect(page.locator('#pf-error')).toBeHidden();
  });

  test('最大公約数・最小公倍数を計算できる', async ({ page }) => {
    await page.goto('/tools/prime-factorization/');
    await page.locator('#pf-mode [data-mode="gcd"]').click();
    await page.locator('#pf-gcd-input').fill('12, 18\n30');
    await expect(page.locator('#pf-rows')).toContainText('6');
    await expect(page.locator('#pf-rows')).toContainText('180');
    await page.locator('#pf-gcd-input').fill('12, x');
    await expect(page.locator('#pf-error')).toContainText('2 個目');
  });

  test('英語版が表示され計算できる', async ({ page }) => {
    await page.goto('/en/tools/prime-factorization/');
    await expect(page.locator('main h1')).toContainText('Prime Factorization');
    await page.locator('#pf-factor-input').fill('12');
    await expect(page.locator('#pf-rows')).toContainText('2^2 × 3');
  });

  test('60桁の大きな素因数2つの積は固まらず分解不能を表示する', async ({
    page,
  }) => {
    // 2^89-1 と 2^107-1（いずれも素数）の積。Pollard's rho では時間内に割り切れない
    await page.goto('/tools/prime-factorization/');
    await page
      .locator('#pf-factor-input')
      .fill('100433627766186892221372630609062766858404681029709092356097');
    await expect(page.locator('#pf-error')).toContainText(
      '時間内に分解できませんでした',
      { timeout: 15000 },
    );
    await expect(page.locator('#pf-result')).toBeHidden();
    // 入力を書き換えても操作を受け付ける（ページが固まっていない）
    await page.locator('#pf-factor-input').fill('12');
    await expect(page.locator('#pf-rows')).toContainText('2^2 × 3');
  });

  test('60桁の素数は確率的判定の注記を出して素数と表示する', async ({
    page,
  }) => {
    // 10^59 + 19（60桁の素数。Miller-Rabin で確認）
    await page.goto('/tools/prime-factorization/');
    await page
      .locator('#pf-factor-input')
      .fill('100000000000000000000000000000000000000000000000000000000019');
    await expect(page.locator('#pf-rows')).toContainText('素数です');
    await expect(page.locator('#pf-notice')).toBeVisible();
  });

  test('20字以上の入力（デバウンス対象）も遅延後に結果が表示される', async ({
    page,
  }) => {
    // 10^20 は 21 文字なので遅延処理の経路を通る
    await page.goto('/tools/prime-factorization/');
    await page.locator('#pf-factor-input').fill('100000000000000000000');
    await expect(page.locator('#pf-rows')).toContainText('2^20 × 5^20');
    await expect(page.locator('#pf-error')).toBeHidden();
  });
});
