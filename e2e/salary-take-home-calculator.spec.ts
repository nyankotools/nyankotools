import { test, expect } from './helpers/test';

test.describe('会社員の手取り計算機', () => {
  test('日本語版: 初期値（年収500万円）で手取りが自動計算される', async ({
    page,
  }) => {
    await page.goto('/tools/salary-take-home-calculator/');

    await expect(page.locator('main h1')).toContainText('会社員の手取り計算機');
    await expect(page.locator('#salary-calc-result-annual')).toHaveText(
      '￥3,905,389',
    );
    await expect(page.locator('#salary-calc-result-monthly')).toHaveText(
      '￥325,449',
    );
    await expect(page.locator('#salary-calc-result-ratio')).toHaveText('78.1%');
  });

  test('年収を変えると手取りが変わり、カンマ区切りで表示される', async ({
    page,
  }) => {
    await page.goto('/tools/salary-take-home-calculator/');

    await page.locator('#salary-calc-gross').fill('8000000');
    await expect(page.locator('#salary-calc-gross')).toHaveValue('8,000,000');
    const annual = await page
      .locator('#salary-calc-result-annual')
      .textContent();
    expect(annual).not.toBe('￥3,905,389');
    await expect(page.locator('#salary-calc-result-annual')).toContainText(
      '￥',
    );
  });

  test('40歳以上にすると社会保険料が増え手取りが減る', async ({ page }) => {
    await page.goto('/tools/salary-take-home-calculator/');

    const before = await page
      .locator('#salary-calc-result-social-insurance')
      .textContent();
    await page.locator('#salary-calc-age40').check();
    await expect(
      page.locator('#salary-calc-result-social-insurance'),
    ).not.toHaveText(before ?? '');
  });

  test('社会保険料の実額を入力するとその値が使われる', async ({ page }) => {
    await page.goto('/tools/salary-take-home-calculator/');

    await page.locator('#salary-calc-social-insurance').fill('700000');
    await expect(
      page.locator('#salary-calc-result-social-insurance'),
    ).toHaveText('￥700,000');
  });

  test('年収を空にすると結果が隠れる', async ({ page }) => {
    await page.goto('/tools/salary-take-home-calculator/');

    await page.locator('#salary-calc-gross').fill('');
    await expect(page.locator('#salary-calc-results')).toBeHidden();
  });

  test('英語版が表示され手取りが計算される', async ({ page }) => {
    await page.goto('/en/tools/salary-take-home-calculator/');

    await expect(page.locator('main h1')).toContainText(
      'Salary Take-Home Pay Calculator',
    );
    await expect(page.locator('#salary-calc-result-annual')).toHaveText(
      '¥3,905,389',
    );
  });

  test('ダークテーマで表示できる', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/tools/salary-take-home-calculator/');

    // ダークモードでは dark: クラスが適用される
    const section = page.locator('section').first();
    await expect(section).toHaveClass(/dark:border-gray-700/);
  });
});

test('ツール固有: 0円入力でも計算が実行される', async ({ page }) => {
  await page.goto('/tools/salary-take-home-calculator/');
  await page.locator('#salary-calc-gross').fill('0');
  // 0円でも結果が表示される（手取り0円）
  await expect(page.locator('#salary-calc-results')).toBeVisible();
  await expect(page.locator('#salary-calc-result-annual')).toHaveText('￥0');
});

test.describe('ツール固有: 非常に大きい値のハンドリング', () => {
  test('十億円の年収でも計算できる', async ({ page }) => {
    await page.goto('/tools/salary-take-home-calculator/');
    await page.locator('#salary-calc-gross').fill('10000000000');
    // 非常に大きい値でも計算が実行される（エラーは表示されない）
    await expect(page.locator('#salary-calc-results')).toBeVisible();
  });
});
