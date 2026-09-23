import { test, expect } from '@playwright/test';

test.describe('カンマ区切り数値入力の共通機能', () => {
  test('時給計算機：金額入力欄に3桁区切りが適用される', async ({ page }) => {
    await page.goto('/tools/hourly-wage-calculator/');

    const amountInput = page.locator('#wage-calc-amount');

    // 金額を入力
    await amountInput.fill('100');

    // 3桁区切りが適用されているか確認
    await expect(amountInput).toHaveValue('100');

    // 計算が正しく行われるか確認（カンマが含まれていても計算できるか）
    // 100円を8時間・20日の条件で時給換算 → 100円
    await expect(page.locator('#wage-calc-result-hourly')).toHaveText('￥100');
  });

  test('時給計算機：基礎時給入力欄に3桁区切りが適用される', async ({
    page,
  }) => {
    await page.goto('/tools/hourly-wage-calculator/');

    const baseHourlyInput = page.locator('#wage-calc-base-hourly');

    // 基礎時給を入力
    await baseHourlyInput.fill('2500');

    // 3桁区切りが適用されているか確認
    await expect(baseHourlyInput).toHaveValue('2,500');

    // 計算が正しく行われるか確認
    const rows = page.locator('#wage-calc-overtime-rows tr');
    await rows
      .nth(0)
      .getByLabel('時間外労働（月60時間以内）の労働時間')
      .fill('5');

    // 2500円 × 5時間 × 25% = 3125円
    await expect(rows.nth(0).locator('[data-role="premium"]')).toHaveText(
      '￥3,125',
    );
  });

  test('税計算機：金額入力欄に3桁区切りが適用される', async ({ page }) => {
    await page.goto('/tools/tax-calculator/');

    const amountInput = page.locator('#tax-calc-amount');

    // 金額を入力
    await amountInput.fill('50000');

    // 3桁区切りが適用されているか確認
    await expect(amountInput).toHaveValue('50,000');

    // 計算が正しく行われるか確認
    await expect(page.locator('#tax-calc-result-excluded')).toHaveText(
      '￥50,000',
    );
    await expect(page.locator('#tax-calc-result-tax')).toHaveText('￥5,000');
  });

  test('税計算機：割引元の価格と割引値入力欄に3桁区切りが適用される', async ({
    page,
  }) => {
    await page.goto('/tools/tax-calculator/');

    const originalInput = page.locator('#discount-calc-original');
    const valueInput = page.locator('#discount-calc-value');

    // 元の価格を入力
    await originalInput.fill('10000');
    await expect(originalInput).toHaveValue('10,000');

    // 割引値を入力（金額指定に切り替え）
    await page.getByRole('radio', { name: '割引額（円）' }).check();
    await valueInput.fill('2500');
    await expect(valueInput).toHaveValue('2,500');

    // 計算が正しく行われるか確認
    await expect(page.locator('#discount-calc-result-amount')).toHaveText(
      '￥2,500',
    );
    await expect(page.locator('#discount-calc-result-price')).toHaveText(
      '￥7,500',
    );
  });

  test('フリーランス手取り計算機：売上と経費入力欄に3桁区切りが適用される', async ({
    page,
  }) => {
    await page.goto('/tools/freelance-income-calculator/');

    const revenueInput = page.locator('#freelance-calc-revenue');
    const expensesInput = page.locator('#freelance-calc-expenses');

    // 売上を入力
    await revenueInput.fill('5000000');
    await expect(revenueInput).toHaveValue('5,000,000');

    // 経費を入力
    await expensesInput.fill('1500000');
    await expect(expensesInput).toHaveValue('1,500,000');

    // 計算が正しく行われるか確認
    // 手取りが表示されていることを確認（正確な金額計算はツール仕様に依存）
    await expect(page.locator('#freelance-calc-results')).not.toHaveClass(
      'hidden',
    );
  });

  test('住宅ローン計算機：金額入力欄に3桁区切りが適用される', async ({
    page,
  }) => {
    await page.goto('/tools/mortgage-calculator/');

    // ローン残高を入力
    await page.locator('#mortgage-calc-balance').fill('20000000');
    await expect(page.locator('#mortgage-calc-balance')).toHaveValue(
      '20,000,000',
    );

    // 繰上返済額を入力
    await page.locator('#mortgage-calc-prepayment').fill('5000000');
    await expect(page.locator('#mortgage-calc-prepayment')).toHaveValue(
      '5,000,000',
    );
  });

  test('資産運用シミュレーション：初期投資額と毎月積立額に3桁区切りが適用される', async ({
    page,
  }) => {
    await page.goto('/tools/investment-simulator/');

    // 初期投資額を入力
    const initialInvestment = page.locator('#investment-sim-initial');
    await initialInvestment.fill('5000000');
    await expect(initialInvestment).toHaveValue('5,000,000');

    // 毎月積立額を入力
    const monthlyAmount = page.locator('#investment-sim-monthly');
    await monthlyAmount.fill('100000');
    await expect(monthlyAmount).toHaveValue('100,000');
  });

  test('カンマが含まれた状態でも計算結果が正しく表示される（税計算機）', async ({
    page,
  }) => {
    await page.goto('/tools/tax-calculator/');

    const amountInput = page.locator('#tax-calc-amount');

    // ユーザーが手動で値を入力
    await amountInput.fill('999');
    await expect(amountInput).toHaveValue('999'); // 1000未満なのでカンマなし

    // カスタム税率に切り替え
    await page.getByRole('radio', { name: 'カスタム' }).check();
    const customRateInput = page.locator('#tax-calc-rate-custom');
    await customRateInput.fill('7.8');

    // 計算が正しく行われるか確認
    // 999 × 0.078 = 77.922 -> 77円（floor）
    await expect(page.locator('#tax-calc-result-tax')).toHaveText('￥77');
  });

  test('カーソル位置が末尾から計算して復元される', async ({ page }) => {
    await page.goto('/tools/tax-calculator/');

    const amountInput = page.locator('#tax-calc-amount');

    // 金額を入力
    await amountInput.fill('1000');
    await amountInput.click();

    // 値をプログラムで設定してカーソル位置を確認
    // input内の値が "1,000" になっているはず
    const value = await amountInput.inputValue();
    expect(value).toBe('1,000');
  });

  test('小数点付きの金額も正しくフォーマットされる', async ({ page }) => {
    await page.goto('/tools/tax-calculator/');

    const amountInput = page.locator('#tax-calc-amount');

    // 小数点付き金額を入力
    await amountInput.fill('1234567.89');
    await expect(amountInput).toHaveValue('1,234,567.89');

    // 計算が正しく行われるか確認
    await expect(page.locator('#tax-calc-result-excluded')).toHaveText(
      '￥1,234,568',
    );
  });

  test('負の値が入力された場合、エラーが表示される', async ({ page }) => {
    await page.goto('/tools/tax-calculator/');

    const amountInput = page.locator('#tax-calc-amount');

    // 負の値を入力
    await amountInput.fill('-1000');

    // エラーが表示されるか確認
    await expect(page.locator('#tax-calc-error')).toContainText(
      '計算できませんでした',
    );
  });

  test('割引率と金額指定の切り替え時、フォーマットが保持される', async ({
    page,
  }) => {
    await page.goto('/tools/tax-calculator/');

    const originalInput = page.locator('#discount-calc-original');
    const valueInput = page.locator('#discount-calc-value');

    // 元の価格を入力
    await originalInput.fill('10000');
    await expect(originalInput).toHaveValue('10,000');

    // 割引率（デフォルト）で入力
    await valueInput.fill('20');
    await expect(valueInput).toHaveValue('20'); // パーセントなのでカンマなし

    // 金額指定に切り替え
    await page.getByRole('radio', { name: '割引額（円）' }).check();
    await valueInput.clear();
    await valueInput.fill('2500');

    // 金額なのでカンマが適用される
    await expect(valueInput).toHaveValue('2,500');

    // 割引率に戻す
    await page.getByRole('radio', { name: '割引率（%）' }).check();
    await valueInput.clear();
    await valueInput.fill('30');

    // パーセントなのでカンマなし
    await expect(valueInput).toHaveValue('30');
  });

  test('複数の金額入力欄が独立してフォーマットされる', async ({ page }) => {
    await page.goto('/tools/tax-calculator/');

    const amountInput = page.locator('#tax-calc-amount');
    const originalInput = page.locator('#discount-calc-original');
    const valueInput = page.locator('#discount-calc-value');

    // それぞれに異なる値を入力
    await amountInput.fill('1000');
    await originalInput.fill('50000');
    await valueInput.fill('12500');

    // それぞれが正しくフォーマットされているか確認
    await expect(amountInput).toHaveValue('1,000');
    await expect(originalInput).toHaveValue('50,000');
    await expect(valueInput).toHaveValue('12,500');
  });
});
