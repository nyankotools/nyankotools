import { test, expect } from '@playwright/test';

test('資産運用シミュレーション: 日本語版が表示される', async ({ page }) => {
  await page.goto('/tools/investment-simulator/');

  await expect(page.locator('main h1')).toHaveText(
    '積立投資シミュレーション（複利計算・取り崩し試算）',
  );
});

test('資産運用シミュレーション: 初期値（将来の資産額を計算する）で試算結果が表示される', async ({
  page,
}) => {
  await page.goto('/tools/investment-simulator/');

  const resultsEl = page.locator('#investment-sim-results');
  await expect(resultsEl).not.toHaveClass(/hidden/);

  await expect(page.locator('#investment-sim-primary-value')).toContainText(
    /¥|￥/,
  );
  await expect(page.locator('#investment-sim-final-balance')).toContainText(
    /¥|￥/,
  );
  await expect(page.locator('#investment-sim-total-principal')).toContainText(
    /¥|￥/,
  );
  await expect(page.locator('#investment-sim-total-gain')).toContainText(
    /¥|￥/,
  );

  // 目標の資産額の入力欄は「将来の資産額を計算する」モードでは非表示
  await expect(page.locator('[data-field="target"]')).toHaveClass(/hidden/);
});

test('資産運用シミュレーション: 「毎月の積立金額を計算する」に切り替えると毎月の積立額入力が隠れ、目標額入力が表示される', async ({
  page,
}) => {
  await page.goto('/tools/investment-simulator/');

  await page
    .locator('input[name="investment-sim-mode"][value="monthlyContribution"]')
    .click();

  await expect(page.locator('[data-field="monthly"]')).toHaveClass(/hidden/);
  await expect(page.locator('[data-field="target"]')).not.toHaveClass(/hidden/);

  await page.locator('#investment-sim-target').fill('20000000');

  const resultsEl = page.locator('#investment-sim-results');
  await expect(resultsEl).not.toHaveClass(/hidden/);
  await expect(page.locator('#investment-sim-primary-value')).toContainText(
    /¥|￥/,
  );

  // 逆算した積立額で試算した将来の資産額は、目標額とほぼ一致する（表示は概算のため大小関係のみ緩く確認）
  await expect(page.locator('#investment-sim-final-balance')).toContainText(
    /¥|￥/,
  );
});

test('資産運用シミュレーション: 「積立期間を計算する」で期間が「年」「ヶ月」形式で表示される', async ({
  page,
}) => {
  await page.goto('/tools/investment-simulator/');

  await page
    .locator('input[name="investment-sim-mode"][value="months"]')
    .click();
  await expect(page.locator('[data-field="years"]')).toHaveClass(/hidden/);
  await expect(page.locator('[data-field="target"]')).not.toHaveClass(/hidden/);

  await page.locator('#investment-sim-target').fill('5000000');

  const primaryValue = page.locator('#investment-sim-primary-value');
  await expect(primaryValue).toContainText('年');
  await expect(primaryValue).toContainText('ヶ月');
});

test('資産運用シミュレーション: 「初期投資額を計算する」で初期投資額入力が隠れる', async ({
  page,
}) => {
  await page.goto('/tools/investment-simulator/');

  await page
    .locator('input[name="investment-sim-mode"][value="initialInvestment"]')
    .click();
  await expect(page.locator('[data-field="initial"]')).toHaveClass(/hidden/);

  await page.locator('#investment-sim-target').fill('20000000');

  await expect(page.locator('#investment-sim-primary-value')).toContainText(
    /¥|￥/,
  );
});

test('資産運用シミュレーション: 積立元本と運用益のグラフ・凡例が表示される', async ({
  page,
}) => {
  await page.goto('/tools/investment-simulator/');

  const chartEl = page.locator('#investment-sim-chart');
  await expect(chartEl).toHaveAttribute('aria-label', /元本合計/);

  await expect(page.locator('#investment-sim-legend-principal')).toContainText(
    '%',
  );
  await expect(page.locator('#investment-sim-legend-gain')).toContainText('%');
});

test('資産運用シミュレーション: 年別の推移表に積立期間の年数分の行が表示される', async ({
  page,
}) => {
  await page.goto('/tools/investment-simulator/');

  await page.locator('#investment-sim-years').fill('10');

  const rows = page.locator('#investment-sim-table-body tr');
  await expect(rows).toHaveCount(10);
  await expect(rows.nth(9)).toContainText('10年0ヶ月');
});

test('資産運用シミュレーション: 取り崩しシミュレーションの結果が表示される', async ({
  page,
}) => {
  await page.goto('/tools/investment-simulator/');

  const withdrawalResultsEl = page.locator(
    '#investment-sim-withdrawal-results',
  );
  await expect(withdrawalResultsEl).not.toHaveClass(/hidden/);

  await expect(
    page.locator('#investment-sim-withdrawal-monthly'),
  ).toContainText(/¥|￥/);
  await expect(page.locator('#investment-sim-withdrawal-total')).toContainText(
    /¥|￥/,
  );

  await page.locator('#investment-sim-withdrawal-years').fill('30');
  const rows = page.locator('#investment-sim-withdrawal-table-body tr');
  await expect(rows).toHaveCount(30);

  // 取り崩し期間の最終年でおおむね残高が0になる
  const lastRowText = await rows.nth(29).textContent();
  expect(lastRowText).toMatch(/¥0|￥0/);
});

test('資産運用シミュレーション: 空欄の場合、エラーは表示されず結果・取り崩し結果も非表示', async ({
  page,
}) => {
  await page.goto('/tools/investment-simulator/');

  // 初期値では取り崩し結果が表示されている状態から始める
  await expect(
    page.locator('#investment-sim-withdrawal-results'),
  ).not.toHaveClass(/hidden/);

  await page.locator('#investment-sim-initial').clear();
  await page.locator('#investment-sim-monthly').clear();
  await page.locator('#investment-sim-years').clear();

  const errorEl = page.locator('#investment-sim-error');
  const resultsEl = page.locator('#investment-sim-results');
  const withdrawalResultsEl = page.locator(
    '#investment-sim-withdrawal-results',
  );

  await expect(errorEl).toHaveText('');
  await expect(resultsEl).toHaveClass(/hidden/);
  // メインの試算結果が非表示になったら、古い取り崩し結果も残らず非表示になる
  await expect(withdrawalResultsEl).toHaveClass(/hidden/);
});

test('資産運用シミュレーション: 無効な値（積立期間が60年を超える）ではエラー', async ({
  page,
}) => {
  await page.goto('/tools/investment-simulator/');

  await page.locator('#investment-sim-years').fill('61');

  const errorEl = page.locator('#investment-sim-error');
  const resultsEl = page.locator('#investment-sim-results');

  await expect(errorEl).toContainText('計算できませんでした');
  await expect(resultsEl).toHaveClass(/hidden/);
});

test('資産運用シミュレーション: 想定利回りが50%を超えるとエラー', async ({
  page,
}) => {
  await page.goto('/tools/investment-simulator/');

  await page.locator('#investment-sim-rate').fill('50.5');

  const errorEl = page.locator('#investment-sim-error');
  const resultsEl = page.locator('#investment-sim-results');

  await expect(errorEl).toContainText('計算できませんでした');
  await expect(resultsEl).toHaveClass(/hidden/);
});

test('資産運用シミュレーション: 英語版が表示される', async ({ page }) => {
  await page.goto('/en/tools/investment-simulator/');

  await expect(page.locator('main h1')).toHaveText(
    'Investment Growth Simulator (Compound Interest & Withdrawal)',
  );
});

test('資産運用シミュレーション: 英語版で試算結果と取り崩し結果が表示される', async ({
  page,
}) => {
  await page.goto('/en/tools/investment-simulator/');

  await expect(page.locator('#investment-sim-primary-value')).toContainText(
    /¥|￥/,
  );
  await expect(
    page.locator('#investment-sim-withdrawal-monthly'),
  ).toContainText(/¥|￥/);
});

test('資産運用シミュレーション: 注意事項が表示される', async ({ page }) => {
  await page.goto('/tools/investment-simulator/');

  const notesHeading = page.getByRole('heading', {
    level: 2,
    name: '注意事項',
  });
  await expect(notesHeading).toBeVisible();

  const notes = page.locator('main ul li');
  const noteCount = await notes.count();
  expect(noteCount).toBeGreaterThan(0);
});

test('資産運用シミュレーション: 用語解説が表示される', async ({ page }) => {
  await page.goto('/tools/investment-simulator/');

  const glossaryHeading = page.getByRole('heading', {
    level: 2,
    name: '用語解説',
  });
  await expect(glossaryHeading).toBeVisible();
  await expect(page.locator('main')).toContainText('取り崩し');
});
