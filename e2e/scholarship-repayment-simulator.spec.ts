import { test, expect } from './helpers/test';

test('奨学金返済シミュレーション: 日本語版が表示される', async ({ page }) => {
  await page.goto('/tools/scholarship-repayment-simulator/');

  await expect(page.locator('main h1')).toHaveText(
    '奨学金（第二種）返済シミュレーション',
  );
});

test('奨学金返済シミュレーション: 初期値が入力済みで結果が表示される', async ({
  page,
}) => {
  await page.goto('/tools/scholarship-repayment-simulator/');

  const resultsEl = page.locator('#scholarship-calc-results');
  await expect(resultsEl).not.toHaveClass(/hidden/);

  const initialMonthlyText = await page
    .locator('#scholarship-calc-initial-monthly')
    .textContent();
  expect(initialMonthlyText).toMatch(/¥|￥/);
});

test('奨学金返済シミュレーション: 利率固定方式では当初と最終の毎月返済額が一致する', async ({
  page,
}) => {
  await page.goto('/tools/scholarship-repayment-simulator/');

  const initialMonthlyText = await page
    .locator('#scholarship-calc-initial-monthly')
    .textContent();
  const finalMonthlyText = await page
    .locator('#scholarship-calc-final-monthly')
    .textContent();

  expect(initialMonthlyText).toBe(finalMonthlyText);

  // 利率固定方式では見直しの内訳テーブルは表示されない
  await expect(page.locator('#scholarship-calc-periods-section')).toHaveClass(
    /hidden/,
  );
});

test('奨学金返済シミュレーション: 利率見直し方式を選ぶと利率変化幅の入力欄が表示される', async ({
  page,
}) => {
  await page.goto('/tools/scholarship-repayment-simulator/');

  const rateChangeRow = page.locator('#scholarship-calc-rate-change-row');
  await expect(rateChangeRow).toHaveClass(/hidden/);

  const reviewedRadio = page.locator(
    'input[name="scholarship-calc-method"][value="reviewed"]',
  );
  await reviewedRadio.click();

  await expect(rateChangeRow).not.toHaveClass(/hidden/);
});

test('奨学金返済シミュレーション: 利率見直し方式で15年返済にすると見直しごとの内訳が表示される', async ({
  page,
}) => {
  await page.goto('/tools/scholarship-repayment-simulator/');

  const reviewedRadio = page.locator(
    'input[name="scholarship-calc-method"][value="reviewed"]',
  );
  await reviewedRadio.click();

  await page.locator('#scholarship-calc-years').fill('15');
  await page.locator('#scholarship-calc-rate-change').fill('0.2');

  const periodsSection = page.locator('#scholarship-calc-periods-section');
  await expect(periodsSection).not.toHaveClass(/hidden/);

  const rows = page.locator('#scholarship-calc-periods-body tr');
  await expect(rows).toHaveCount(3);
});

test('奨学金返済シミュレーション: 空欄の場合、エラーメッセージは表示されない', async ({
  page,
}) => {
  await page.goto('/tools/scholarship-repayment-simulator/');

  await page.locator('#scholarship-calc-amount').clear();
  await page.locator('#scholarship-calc-rate').clear();
  await page.locator('#scholarship-calc-years').clear();

  const errorEl = page.locator('#scholarship-calc-error');
  const resultsEl = page.locator('#scholarship-calc-results');

  await expect(errorEl).toHaveText('');
  await expect(resultsEl).toHaveClass(/hidden/);
});

test('奨学金返済シミュレーション: 返還期間が20年を超えるとエラー', async ({
  page,
}) => {
  await page.goto('/tools/scholarship-repayment-simulator/');

  await page.locator('#scholarship-calc-amount').fill('2400000');
  await page.locator('#scholarship-calc-rate').fill('0.5');
  await page.locator('#scholarship-calc-years').fill('21');

  const errorEl = page.locator('#scholarship-calc-error');
  const resultsEl = page.locator('#scholarship-calc-results');

  await expect(errorEl).toContainText('計算できませんでした');
  await expect(resultsEl).toHaveClass(/hidden/);
});

test('奨学金返済シミュレーション: 在学中は利率が未確定である旨の注意書きが表示される', async ({
  page,
}) => {
  await page.goto('/tools/scholarship-repayment-simulator/');

  await expect(page.locator('main')).toContainText('利率が未確定です');
});

test('奨学金返済シミュレーション: 注意事項が表示される', async ({ page }) => {
  await page.goto('/tools/scholarship-repayment-simulator/');

  const notesHeading = page.getByRole('heading', {
    level: 2,
    name: '注意事項',
  });
  await expect(notesHeading).toBeVisible();

  const notes = page.locator('main ul li');
  expect(await notes.count()).toBeGreaterThan(0);
});

test('奨学金返済シミュレーション: 用語解説が表示される', async ({ page }) => {
  await page.goto('/tools/scholarship-repayment-simulator/');

  const glossaryHeading = page.getByRole('heading', {
    level: 2,
    name: '用語解説',
  });
  await expect(glossaryHeading).toBeVisible();

  await expect(page.locator('main')).toContainText('第二種奨学金');
});

test('奨学金返済シミュレーション: 英語版が表示される', async ({ page }) => {
  await page.goto('/en/tools/scholarship-repayment-simulator/');

  await expect(page.locator('main h1')).toHaveText(
    'JASSO Student Loan Repayment Simulator',
  );
});

test('奨学金返済シミュレーション: 英語版でも結果が表示される', async ({
  page,
}) => {
  await page.goto('/en/tools/scholarship-repayment-simulator/');

  const resultsEl = page.locator('#scholarship-calc-results');
  await expect(resultsEl).not.toHaveClass(/hidden/);

  const totalPaymentText = await page
    .locator('#scholarship-calc-total-payment')
    .textContent();
  expect(totalPaymentText).toMatch(/¥|￥/);
});
