import { test, expect } from './helpers/test';

test('住宅ローン繰り上げ返済比較シミュレーション: 日本語版が表示される', async ({
  page,
}) => {
  await page.goto('/tools/mortgage-calculator/');

  await expect(page.locator('main h1')).toHaveText(
    '住宅ローン繰り上げ返済比較シミュレーション',
  );
});

test('住宅ローン繰り上げ返済比較シミュレーション: 期間短縮型で入力すると比較結果が表示される', async ({
  page,
}) => {
  await page.goto('/tools/mortgage-calculator/');

  // 初期値は既に入力されているので、すぐに結果が表示されているはず
  const beforeMonthlyEl = page.locator('#mortgage-calc-before-monthly');
  const afterMonthlyEl = page.locator('#mortgage-calc-after-monthly');
  const monthsShortenedEl = page.locator('#mortgage-calc-months-shortened');

  // 期間短縮型では毎月返済額は変わらない
  const beforeText = await beforeMonthlyEl.textContent();
  const afterText = await afterMonthlyEl.textContent();
  expect(beforeText).toBe(afterText);

  // 短縮月数が「N年Mヶ月」形式で表示される
  const monthsShortenedText = await monthsShortenedEl.textContent();
  expect(monthsShortenedText).toBeTruthy();
  expect(monthsShortenedText).toMatch(/\d+年\d+ヶ月/);
});

test('住宅ローン繰り上げ返済比較シミュレーション: 返済額軽減型に切り替えると表示が切り替わる', async ({
  page,
}) => {
  await page.goto('/tools/mortgage-calculator/');

  // 期間短縮型から返済額軽減型へ切り替え
  const reducePaymentRadio = page.locator(
    'input[name="mortgage-calc-type"][value="reducePayment"]',
  );
  await reducePaymentRadio.click();

  // 返済額軽減型では返済期間は変わらない
  const beforeTermEl = page.locator('#mortgage-calc-before-term');
  const afterTermEl = page.locator('#mortgage-calc-after-term');

  const beforeTerm = await beforeTermEl.textContent();
  const afterTerm = await afterTermEl.textContent();
  expect(beforeTerm).toBe(afterTerm);

  // 毎月の返済額が軽減される
  const beforeMonthlyEl = page.locator('#mortgage-calc-before-monthly');
  const afterMonthlyEl = page.locator('#mortgage-calc-after-monthly');

  const beforeMonthly = await beforeMonthlyEl.textContent();
  const afterMonthly = await afterMonthlyEl.textContent();
  expect(beforeMonthly).not.toBe(afterMonthly);
});

test('住宅ローン繰り上げ返済比較シミュレーション: 毎月返済額軽減額が表示される（返済額軽減型）', async ({
  page,
}) => {
  await page.goto('/tools/mortgage-calculator/');

  const reducePaymentRadio = page.locator(
    'input[name="mortgage-calc-type"][value="reducePayment"]',
  );
  await reducePaymentRadio.click();

  // 毎月の返済額軽減額が表示される
  const paymentReducedEl = page.locator('#mortgage-calc-payment-reduced');
  const text = await paymentReducedEl.textContent();

  expect(text).toBeTruthy();
  expect(text).toMatch(/¥|￥/);
});

test('住宅ローン繰り上げ返済比較シミュレーション: 利息軽減額が表示される', async ({
  page,
}) => {
  await page.goto('/tools/mortgage-calculator/');

  const interestSavedEl = page.locator('#mortgage-calc-interest-saved');
  const text = await interestSavedEl.textContent();

  expect(text).toBeTruthy();
  expect(text).toMatch(/¥|￥/);
});

test('住宅ローン繰り上げ返済比較シミュレーション: 空欄の場合、エラーメッセージは表示されない', async ({
  page,
}) => {
  await page.goto('/tools/mortgage-calculator/');

  // 初期値をクリア
  await page.locator('#mortgage-calc-balance').clear();
  await page.locator('#mortgage-calc-rate').clear();
  await page.locator('#mortgage-calc-term-years').clear();
  await page.locator('#mortgage-calc-term-months').clear();
  await page.locator('#mortgage-calc-prepayment').clear();

  const errorEl = page.locator('#mortgage-calc-error');
  const resultsEl = page.locator('#mortgage-calc-results');

  // 空欄ではエラーは表示されない（結果も非表示）
  await expect(errorEl).toHaveText('');
  await expect(resultsEl).toHaveClass(/hidden/);
});

test('住宅ローン繰り上げ返済比較シミュレーション: 無効な値（繰り上げ返済額が借入残高以上）ではエラー', async ({
  page,
}) => {
  await page.goto('/tools/mortgage-calculator/');

  // 繰り上げ返済額を借入残高と同じ値に設定
  await page.locator('#mortgage-calc-balance').fill('10000000');
  await page.locator('#mortgage-calc-rate').fill('1.0');
  await page.locator('#mortgage-calc-term-years').fill('25');
  await page.locator('#mortgage-calc-term-months').fill('0');
  await page.locator('#mortgage-calc-prepayment').fill('10000000');

  const errorEl = page.locator('#mortgage-calc-error');
  const resultsEl = page.locator('#mortgage-calc-results');

  // エラーメッセージが表示される
  await expect(errorEl).toContainText('計算できませんでした');
  await expect(resultsEl).toHaveClass(/hidden/);
});

test('住宅ローン繰り上げ返済比較シミュレーション: 残り返済期間が600ヶ月を超えるとエラー', async ({
  page,
}) => {
  await page.goto('/tools/mortgage-calculator/');

  // 返済期間を50年1ヶ月（601ヶ月）に設定
  await page.locator('#mortgage-calc-balance').fill('10000000');
  await page.locator('#mortgage-calc-rate').fill('1.0');
  await page.locator('#mortgage-calc-term-years').fill('50');
  await page.locator('#mortgage-calc-term-months').fill('1');
  await page.locator('#mortgage-calc-prepayment').fill('1000000');

  const errorEl = page.locator('#mortgage-calc-error');
  const resultsEl = page.locator('#mortgage-calc-results');

  // エラーメッセージが表示される
  await expect(errorEl).toContainText('計算できませんでした');
  await expect(resultsEl).toHaveClass(/hidden/);
});

test('住宅ローン繰り上げ返済比較シミュレーション: 繰り上げ返済額が借入残高にほぼ等しい場合、総利息がマイナスにならない', async ({
  page,
}) => {
  await page.goto('/tools/mortgage-calculator/');

  // 繰り上げ返済額を借入残高に非常に近い値に設定
  await page.locator('#mortgage-calc-balance').fill('10000000');
  await page.locator('#mortgage-calc-rate').fill('1.0');
  await page.locator('#mortgage-calc-term-years').fill('10');
  await page.locator('#mortgage-calc-term-months').fill('0');
  await page.locator('#mortgage-calc-prepayment').fill('9999999');

  // 期間短縮型
  const shortenTermRadio = page.locator(
    'input[name="mortgage-calc-type"][value="shortenTerm"]',
  );
  await shortenTermRadio.click();

  const afterInterestEl = page.locator('#mortgage-calc-after-interest');
  const text = await afterInterestEl.textContent();

  // マイナス記号が含まれていないことを確認
  expect(text).not.toContain('-');
  // 総利息は0以上
  expect(text).toMatch(/¥|￥/);
});

test('住宅ローン繰り上げ返済比較シミュレーション: 金利0%でも計算できる', async ({
  page,
}) => {
  await page.goto('/tools/mortgage-calculator/');

  await page.locator('#mortgage-calc-balance').fill('12000000');
  await page.locator('#mortgage-calc-rate').fill('0');
  await page.locator('#mortgage-calc-term-years').fill('10');
  await page.locator('#mortgage-calc-term-months').fill('0');
  await page.locator('#mortgage-calc-prepayment').fill('1000000');

  const resultsEl = page.locator('#mortgage-calc-results');
  await expect(resultsEl).not.toHaveClass(/hidden/);

  // 総利息が0
  const beforeInterestEl = page.locator('#mortgage-calc-before-interest');
  const beforeText = await beforeInterestEl.textContent();
  expect(beforeText).toMatch(/¥|￥/);
  expect(beforeText).toContain('0');

  const afterInterestEl = page.locator('#mortgage-calc-after-interest');
  const afterText = await afterInterestEl.textContent();
  expect(afterText).toMatch(/¥|￥/);
  expect(afterText).toContain('0');
});

test('住宅ローン繰り上げ返済比較シミュレーション: 英語版が表示される', async ({
  page,
}) => {
  await page.goto('/en/tools/mortgage-calculator/');

  await expect(page.locator('main h1')).toHaveText(
    'Mortgage Prepayment Comparison Calculator',
  );
});

test('住宅ローン繰り上げ返済比較シミュレーション: 英語版で期間短縮型の結果が表示される', async ({
  page,
}) => {
  await page.goto('/en/tools/mortgage-calculator/');

  // 初期値が既に入力されているので、結果が表示されているはず
  const beforeMonthlyEl = page.locator('#mortgage-calc-before-monthly');
  const afterMonthlyEl = page.locator('#mortgage-calc-after-monthly');
  const monthsShortenedEl = page.locator('#mortgage-calc-months-shortened');

  const beforeText = await beforeMonthlyEl.textContent();
  const afterText = await afterMonthlyEl.textContent();

  // どちらも表示されている（JPY記号が含まれる）
  expect(beforeText).toBeTruthy();
  expect(afterText).toBeTruthy();

  // 短縮月数が「Nyr Mmo」形式で表示される
  const monthsShortenedText = await monthsShortenedEl.textContent();
  expect(monthsShortenedText).toBeTruthy();
  expect(monthsShortenedText).toMatch(/\d+yr \d+mo/);
});

test('住宅ローン繰り上げ返済比較シミュレーション: 英語版で返済額軽減型に切り替え可能', async ({
  page,
}) => {
  await page.goto('/en/tools/mortgage-calculator/');

  const reducePaymentRadio = page.locator(
    'input[name="mortgage-calc-type"][value="reducePayment"]',
  );
  await reducePaymentRadio.click();

  // 返済額軽減型では毎月返済額軽減額が表示される
  const paymentReducedEl = page.locator('#mortgage-calc-payment-reduced');
  const text = await paymentReducedEl.textContent();

  expect(text).toBeTruthy();
  expect(text).toMatch(/¥|￥/);
});

test('住宅ローン繰り上げ返済比較シミュレーション: 注意事項が表示される', async ({
  page,
}) => {
  await page.goto('/tools/mortgage-calculator/');

  const notesHeading = page.getByRole('heading', {
    level: 2,
    name: '注意事項',
  });

  await expect(notesHeading).toBeVisible();

  // 注意事項がリスト形式で表示される
  const notes = page.locator('main ul li');
  const noteCount = await notes.count();

  expect(noteCount).toBeGreaterThan(0);
});

test('住宅ローン繰り上げ返済比較シミュレーション: 用語解説が表示される', async ({
  page,
}) => {
  await page.goto('/tools/mortgage-calculator/');

  const glossaryHeading = page.getByRole('heading', {
    level: 2,
    name: '用語解説',
  });

  await expect(glossaryHeading).toBeVisible();

  // 繰り上げ返済という用語が表示される
  await expect(page.locator('main')).toContainText('繰り上げ返済');
});
