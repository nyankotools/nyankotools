import { test, expect } from './helpers/test';

test('ローン・リボ払い返済シミュレーター: 初期値で元利均等の結果が表示される', async ({
  page,
}) => {
  await page.goto('/tools/loan-calculator/');

  await expect(page.locator('main h1')).toHaveText(
    'ローン・リボ払い返済シミュレーター',
  );
  await expect(page.locator('#loan-calc-results')).toBeVisible();
  await expect(page.locator('#loan-calc-term')).toHaveText('3年0ヶ月');
  await expect(page.locator('#loan-calc-schedule tr')).toHaveCount(36);
});

test('ローン・リボ払い返済シミュレーター: 元金均等では最終回の支払額が初回より小さい', async ({
  page,
}) => {
  await page.goto('/tools/loan-calculator/');
  await page.locator('input[value="equalPrincipal"]').check();

  const first = await page.locator('#loan-calc-first').textContent();
  const last = await page.locator('#loan-calc-last').textContent();
  const num = (s: string | null) => Number((s ?? '').replace(/[^\d]/g, ''));
  expect(num(last)).toBeLessThan(num(first));
});

test('ローン・リボ払い返済シミュレーター: リボ払いで支払額を入力でき、完済不能ならエラーになる', async ({
  page,
}) => {
  await page.goto('/tools/loan-calculator/');
  await page.locator('input[value="revolving"]').check();

  await expect(page.locator('#loan-calc-payment')).toBeVisible();
  await expect(page.locator('#loan-calc-term-group')).toBeHidden();
  await expect(page.locator('#loan-calc-results')).toBeVisible();

  // 初月手数料（100万円×15%÷12=12,500円）以下の支払額
  await page.locator('#loan-calc-payment').fill('10000');
  await expect(page.locator('#loan-calc-error')).not.toBeEmpty();
  await expect(page.locator('#loan-calc-results')).toBeHidden();
});

test('ローン・リボ払い返済シミュレーター: 年・月に負数や小数を入れるとエラーになり、正しい値に戻すと結果が出る', async ({
  page,
}) => {
  await page.goto('/tools/loan-calculator/');
  const years = page.locator('#loan-calc-term-years');
  const months = page.locator('#loan-calc-term-months');

  // 負の年数
  await years.fill('-1');
  await expect(page.locator('#loan-calc-error')).not.toBeEmpty();
  await expect(page.locator('#loan-calc-results')).toBeHidden();

  // 小数の年数
  await years.fill('1.5');
  await expect(page.locator('#loan-calc-error')).not.toBeEmpty();
  await expect(page.locator('#loan-calc-results')).toBeHidden();

  // 月は0〜11の範囲外（負数・12以上）でエラー
  await years.fill('3');
  await months.fill('-1');
  await expect(page.locator('#loan-calc-error')).not.toBeEmpty();
  await expect(page.locator('#loan-calc-results')).toBeHidden();

  await months.fill('12');
  await expect(page.locator('#loan-calc-error')).not.toBeEmpty();
  await expect(page.locator('#loan-calc-results')).toBeHidden();

  // 正しい値（3年6ヶ月）に戻すとエラーが消え、結果が出る
  await months.fill('6');
  await expect(page.locator('#loan-calc-error')).toBeEmpty();
  await expect(page.locator('#loan-calc-results')).toBeVisible();
  await expect(page.locator('#loan-calc-term')).toHaveText('3年6ヶ月');
});

test('ローン・リボ払い返済シミュレーター: 高金利・長期間で計算が溢れる場合はNaNではなくエラーになる', async ({
  page,
}) => {
  await page.goto('/tools/loan-calculator/');

  // 年利1,000,000%・50年（600回）：(1+月利)^n が溢れるため計算不能
  await page.locator('#loan-calc-rate').fill('1000000');
  await page.locator('#loan-calc-term-years').fill('50');
  await page.locator('#loan-calc-term-months').fill('0');

  await expect(page.locator('#loan-calc-error')).not.toBeEmpty();
  await expect(page.locator('#loan-calc-results')).toBeHidden();
  await expect(page.locator('#loan-calc-results')).not.toContainText('NaN');
});

test('ローン・リボ払い返済シミュレーター: 英語版が表示される', async ({
  page,
}) => {
  await page.goto('/en/tools/loan-calculator/');

  await expect(page.locator('main h1')).toHaveText(
    'Loan & Revolving Payment Calculator',
  );
});
