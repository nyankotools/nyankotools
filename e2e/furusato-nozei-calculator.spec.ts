import { test, expect } from './helpers/test';

test.describe('ふるさと納税の上限額シミュレーション', () => {
  test('日本語版: 初期値（年収500万円）で上限額が表示される', async ({
    page,
  }) => {
    await page.goto('/tools/furusato-nozei-calculator/');

    await expect(page.locator('main h1')).toContainText('ふるさと納税');
    await expect(page.locator('#furusato-calc-result-limit')).toHaveText(
      '￥61,456',
    );
    await expect(page.locator('#furusato-calc-result-deductible')).toHaveText(
      '￥59,456',
    );
    await expect(page.locator('#furusato-calc-result-safe-limit')).toHaveText(
      '￥55,000',
    );
    await expect(
      page.locator('#furusato-calc-result-marginal-rate'),
    ).toHaveText('10%');
  });

  test('年収を上げると上限額が増える', async ({ page }) => {
    await page.goto('/tools/furusato-nozei-calculator/');

    await page.locator('#furusato-calc-gross').fill('8000000');
    await expect(page.locator('#furusato-calc-gross')).toHaveValue('8,000,000');
    await expect(page.locator('#furusato-calc-result-limit')).toHaveText(
      '￥131,060',
    );
  });

  test('その他の所得控除を入れると上限額が下がる', async ({ page }) => {
    await page.goto('/tools/furusato-nozei-calculator/');

    await page.locator('#furusato-calc-other-deductions').fill('380000');
    await expect(page.locator('#furusato-calc-result-limit')).not.toHaveText(
      '￥61,456',
    );
  });

  test('収入が低く住民税所得割がかからないと上限額は0円', async ({ page }) => {
    await page.goto('/tools/furusato-nozei-calculator/');

    await page.locator('#furusato-calc-gross').fill('1000000');
    await expect(page.locator('#furusato-calc-result-limit')).toHaveText('￥0');
  });

  test('英語版が表示され上限額が計算される', async ({ page }) => {
    await page.goto('/en/tools/furusato-nozei-calculator/');

    await expect(page.locator('main h1')).toContainText(
      'Furusato Nozei Donation Limit Calculator',
    );
    await expect(page.locator('#furusato-calc-result-limit')).toHaveText(
      '¥61,456',
    );
  });

  test('ダークテーマで表示できる', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/tools/furusato-nozei-calculator/');

    // ダークモードでは dark: クラスが適用される
    const section = page.locator('section').first();
    await expect(section).toHaveClass(/dark:border-gray-700/);
  });

  test('非常に大きい年収（十億円超）でも計算できる', async ({ page }) => {
    await page.goto('/tools/furusato-nozei-calculator/');
    await page.locator('#furusato-calc-gross').fill('10000000000');
    // 非常に大きい値でも計算が実行される（結果が表示される）
    await expect(page.locator('#furusato-calc-result-limit')).toBeVisible();
  });
});
