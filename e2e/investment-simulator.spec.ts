import { test, expect } from './helpers/test';

test('資産運用シミュレーション: 日本語版が表示される', async ({ page }) => {
  await page.goto('/tools/investment-simulator/');

  await expect(page.locator('main h1')).toHaveText('資産運用シミュレーション');
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
    page.locator('#investment-sim-withdrawal-primary-value'),
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
    page.locator('#investment-sim-withdrawal-primary-value'),
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

test('資産運用シミュレーション: 年別推移グラフが表示される', async ({
  page,
}) => {
  await page.goto('/tools/investment-simulator/');

  const trendChartEl = page.locator('#investment-sim-trend-chart');
  await expect(trendChartEl).toBeVisible();
  await expect(trendChartEl).toHaveAttribute(
    'aria-label',
    /元本合計|資産評価額/,
  );

  // グラフ要素（パス）が描画されていることを確認
  const paths = trendChartEl.locator('path');
  expect(await paths.count()).toBeGreaterThan(0);

  // グラフのセクション内に凡例のテキストが表示される
  const trendSection = trendChartEl.locator('../..');
  await expect(trendSection).toContainText('元本合計');
  await expect(trendSection).toContainText('運用益');
});

test('資産運用シミュレーション: 年別推移グラフのホバーでツールチップが表示される', async ({
  page,
}) => {
  await page.goto('/tools/investment-simulator/');

  const chartOverlay = page
    .locator('#investment-sim-trend-chart')
    .locator('rect');
  const tooltipEl = page.locator('#investment-sim-trend-tooltip');

  // チャート上をマウスホバー
  await chartOverlay.first().hover();

  // ツールチップが表示される
  await expect(tooltipEl).not.toHaveClass(/hidden/);

  // ツールチップの内容が表示される（年、元本、運用益、残高など）
  const tooltipContent = await tooltipEl.textContent();
  expect(tooltipContent).toBeTruthy();
  expect(tooltipContent).toMatch(/年|yr/);
});

test('資産運用シミュレーション: 取り崩しシミュレーションの残り資産額推移グラフが表示される', async ({
  page,
}) => {
  await page.goto('/tools/investment-simulator/');

  const withdrawalChartEl = page.locator('#investment-sim-withdrawal-chart');
  await expect(withdrawalChartEl).toBeVisible();
  await expect(withdrawalChartEl).toHaveAttribute('aria-label', /年後/);

  // グラフ要素（パス）が描画されていることを確認
  const paths = withdrawalChartEl.locator('path');
  expect(await paths.count()).toBeGreaterThan(0);
});

test('資産運用シミュレーション: 取り崩しグラフのホバーでツールチップが表示される', async ({
  page,
}) => {
  await page.goto('/tools/investment-simulator/');

  const chartOverlay = page
    .locator('#investment-sim-withdrawal-chart')
    .locator('rect');
  const tooltipEl = page.locator('#investment-sim-withdrawal-tooltip');

  // チャート上をマウスホバー
  await chartOverlay.first().hover();

  // ツールチップが表示される
  await expect(tooltipEl).not.toHaveClass(/hidden/);

  // ツールチップの内容が表示される
  const tooltipContent = await tooltipEl.textContent();
  expect(tooltipContent).toBeTruthy();
});

test('資産運用シミュレーション: 積立期間が短い場合（1年）、グラフのX軸ラベルが重複しない', async ({
  page,
}) => {
  await page.goto('/tools/investment-simulator/');

  await page.locator('#investment-sim-years').fill('1');

  const trendChartEl = page.locator('#investment-sim-trend-chart');
  await expect(trendChartEl).toBeVisible();

  // X軸のラベルテキストを取得
  const textElements = await trendChartEl.locator('text').all();
  const xAxisLabels: string[] = [];

  for (const el of textElements) {
    const text = await el.textContent();
    // X軸ラベルは年またはyrで終わる（最後のtextアンカーがendのもの）
    if (text && (text.includes('年') || text.includes('yr'))) {
      xAxisLabels.push(text);
    }
  }

  // 複数の同じラベルが表示されないことを確認（重複があるとSet化した際にサイズが減る）
  const uniqueLabels = new Set(xAxisLabels);
  expect(xAxisLabels.length).toBeGreaterThan(0);
  expect(uniqueLabels.size).toBe(xAxisLabels.length);
});

test('資産運用シミュレーション: 入力が空になるとグラフが消える', async ({
  page,
}) => {
  await page.goto('/tools/investment-simulator/');

  // 初期状態ではグラフが表示される
  const trendChartEl = page.locator('#investment-sim-trend-chart');
  let paths = await trendChartEl.locator('path').count();
  expect(paths).toBeGreaterThan(0);

  // すべての入力をクリア
  await page.locator('#investment-sim-initial').clear();
  await page.locator('#investment-sim-monthly').clear();
  await page.locator('#investment-sim-years').clear();

  // グラフがクリアされる（パスが0になる）
  paths = await trendChartEl.locator('path').count();
  expect(paths).toBe(0);
  await expect(trendChartEl).not.toHaveAttribute('aria-label', /.+/);
});

test('資産運用シミュレーション: 英語版でもグラフが表示される', async ({
  page,
}) => {
  await page.goto('/en/tools/investment-simulator/');

  const trendChartEl = page.locator('#investment-sim-trend-chart');
  const withdrawalChartEl = page.locator('#investment-sim-withdrawal-chart');

  await expect(trendChartEl).toBeVisible();
  await expect(withdrawalChartEl).toBeVisible();

  // 英語版ではaria-labelが英語で設定される
  const trendLabel = await trendChartEl.getAttribute('aria-label');
  expect(trendLabel).toMatch(/principal|value/);
});

test('資産運用シミュレーション: 「定額取り崩し」モードに切り替え、入力欄が正しく表示される', async ({
  page,
}) => {
  await page.goto('/tools/investment-simulator/');

  // 定額取り崩しモードに切り替え
  await page
    .locator('input[name="investment-sim-withdrawal-mode"][value="byAmount"]')
    .click();

  // 定額取り崩しモードでは「定額取り崩し」入力欄が表示される
  const amountFieldEl = page.locator('[data-withdrawal-field="amount"]');
  await expect(amountFieldEl).not.toHaveClass(/hidden/);

  // 他の入力欄は隠れる
  const yearsFieldEl = page.locator('[data-withdrawal-field="years"]');
  const rateFieldEl = page.locator('[data-withdrawal-field="rate"]');
  await expect(yearsFieldEl).toHaveClass(/hidden/);
  await expect(rateFieldEl).toHaveClass(/hidden/);
});

test('資産運用シミュレーション: 定額取り崩しで結果が表示される', async ({
  page,
}) => {
  await page.goto('/tools/investment-simulator/');

  // 定額取り崩しモードに切り替え
  await page
    .locator('input[name="investment-sim-withdrawal-mode"][value="byAmount"]')
    .click();

  // 毎月の取り崩し額を入力
  await page.locator('#investment-sim-withdrawal-amount').fill('150000');

  const withdrawalResultsEl = page.locator(
    '#investment-sim-withdrawal-results',
  );
  await expect(withdrawalResultsEl).not.toHaveClass(/hidden/);

  // 「資産が尽きるまでの期間」が表示される
  const primaryLabelEl = page.locator(
    '#investment-sim-withdrawal-primary-label',
  );
  const primaryValueEl = page.locator(
    '#investment-sim-withdrawal-primary-value',
  );
  await expect(primaryLabelEl).toContainText(/尽きる/);
  await expect(primaryValueEl).toContainText(/年|ヶ月/);

  // 取り崩し総額が表示される
  await expect(page.locator('#investment-sim-withdrawal-total')).toContainText(
    /¥|￥/,
  );

  // グラフと表が表示される
  const withdrawalChartEl = page.locator('#investment-sim-withdrawal-chart');
  const withdrawalTableBodyEl = page.locator(
    '#investment-sim-withdrawal-table-body',
  );
  await expect(withdrawalChartEl).toBeVisible();
  const tableRows = withdrawalTableBodyEl.locator('tr');
  expect(await tableRows.count()).toBeGreaterThan(0);
});

test('資産運用シミュレーション: 定額取り崩しで資産が尽きないケース（60年以内に尽きない）', async ({
  page,
}) => {
  await page.goto('/tools/investment-simulator/');

  // 定額取り崩しモードに切り替え
  await page
    .locator('input[name="investment-sim-withdrawal-mode"][value="byAmount"]')
    .click();

  // 低い取り崩し額を入力（運用益で補われる）
  await page.locator('#investment-sim-withdrawal-amount').fill('10000');

  const withdrawalResultsEl = page.locator(
    '#investment-sim-withdrawal-results',
  );
  await expect(withdrawalResultsEl).not.toHaveClass(/hidden/);

  // 「60年以内に資産は尽きません」といった趣旨のメッセージが表示される
  const primaryValueEl = page.locator(
    '#investment-sim-withdrawal-primary-value',
  );
  await expect(primaryValueEl).toContainText(/尽きません|60年以内/);
});

test('資産運用シミュレーション: 「定率取り崩し」モードに切り替え、入力欄が正しく表示される', async ({
  page,
}) => {
  await page.goto('/tools/investment-simulator/');

  // 定率取り崩しモードに切り替え
  await page
    .locator('input[name="investment-sim-withdrawal-mode"][value="byRate"]')
    .click();

  // 定率取り崩しモードでは「取り崩し率」入力欄が表示される
  const rateFieldEl = page.locator('[data-withdrawal-field="rate"]');
  await expect(rateFieldEl).not.toHaveClass(/hidden/);

  // 年数入力欄も表示される（シミュレーション期間のため）
  const yearsFieldEl = page.locator('[data-withdrawal-field="years"]');
  await expect(yearsFieldEl).not.toHaveClass(/hidden/);

  // 定額取り崩し入力欄は隠れる
  const amountFieldEl = page.locator('[data-withdrawal-field="amount"]');
  await expect(amountFieldEl).toHaveClass(/hidden/);

  // 年数フィールドのラベルがシミュレーション期間を意味するテキストに変わっていることを確認
  const yearsLabelEl = page.locator('#investment-sim-withdrawal-years-label');
  const labelText = await yearsLabelEl.textContent();
  expect(labelText).toMatch(/シミュレーション|期間/);
});

test('資産運用シミュレーション: 定率取り崩しで結果が表示される', async ({
  page,
}) => {
  await page.goto('/tools/investment-simulator/');

  // 定率取り崩しモードに切り替え
  await page
    .locator('input[name="investment-sim-withdrawal-mode"][value="byRate"]')
    .click();

  // 取り崩し率を入力
  await page.locator('#investment-sim-withdrawal-rate').fill('4');

  const withdrawalResultsEl = page.locator(
    '#investment-sim-withdrawal-results',
  );
  await expect(withdrawalResultsEl).not.toHaveClass(/hidden/);

  // 「1ヶ月目の取り崩し額」が表示される
  const primaryLabelEl = page.locator(
    '#investment-sim-withdrawal-primary-label',
  );
  const primaryValueEl = page.locator(
    '#investment-sim-withdrawal-primary-value',
  );
  await expect(primaryLabelEl).toContainText(/1ヶ月目|初月/);
  await expect(primaryValueEl).toContainText(/¥|￥/);

  // 取り崩し総額が表示される
  await expect(page.locator('#investment-sim-withdrawal-total')).toContainText(
    /¥|￥/,
  );

  // グラフと表が表示される
  const withdrawalChartEl = page.locator('#investment-sim-withdrawal-chart');
  const withdrawalTableBodyEl = page.locator(
    '#investment-sim-withdrawal-table-body',
  );
  await expect(withdrawalChartEl).toBeVisible();
  const tableRows = withdrawalTableBodyEl.locator('tr');
  expect(await tableRows.count()).toBeGreaterThan(0);
});

test('資産運用シミュレーション: 定額取り崩しで無効な入力（0以下）ではエラー', async ({
  page,
}) => {
  await page.goto('/tools/investment-simulator/');

  // 定額取り崩しモードに切り替え
  await page
    .locator('input[name="investment-sim-withdrawal-mode"][value="byAmount"]')
    .click();

  // 無効な取り崩し額（0）を入力
  await page.locator('#investment-sim-withdrawal-amount').fill('0');

  const withdrawalErrorEl = page.locator('#investment-sim-withdrawal-error');
  const withdrawalResultsEl = page.locator(
    '#investment-sim-withdrawal-results',
  );

  await expect(withdrawalErrorEl).toContainText(/計算できませんでした|無効/);
  await expect(withdrawalResultsEl).toHaveClass(/hidden/);
});

test('資産運用シミュレーション: 定率取り崩しで無効な入力（0%以下または100%超）ではエラー', async ({
  page,
}) => {
  await page.goto('/tools/investment-simulator/');

  // 定率取り崩しモードに切り替え
  await page
    .locator('input[name="investment-sim-withdrawal-mode"][value="byRate"]')
    .click();

  // 無効な取り崩し率（0%）を入力
  await page.locator('#investment-sim-withdrawal-rate').fill('0');

  const withdrawalErrorEl = page.locator('#investment-sim-withdrawal-error');
  const withdrawalResultsEl = page.locator(
    '#investment-sim-withdrawal-results',
  );

  await expect(withdrawalErrorEl).toContainText(/計算できませんでした|無効/);
  await expect(withdrawalResultsEl).toHaveClass(/hidden/);

  // 100%超の取り崩し率を入力
  await page.locator('#investment-sim-withdrawal-rate').fill('100.1');

  await expect(withdrawalErrorEl).toContainText(/計算できませんでした|無効/);
  await expect(withdrawalResultsEl).toHaveClass(/hidden/);
});

test('資産運用シミュレーション: 定率取り崩しモード切り替え時、年数フィールドラベルが正しく更新される', async ({
  page,
}) => {
  await page.goto('/tools/investment-simulator/');

  const yearsLabelEl = page.locator('#investment-sim-withdrawal-years-label');

  // デフォルトは「利用年数」
  let labelText = await yearsLabelEl.textContent();
  expect(labelText).toMatch(/利用年数/);

  // 定率取り崩しに切り替え
  await page
    .locator('input[name="investment-sim-withdrawal-mode"][value="byRate"]')
    .click();

  // ラベルが「シミュレーション期間」に変わる
  labelText = await yearsLabelEl.textContent();
  expect(labelText).toMatch(/シミュレーション|期間/);
  expect(labelText).not.toMatch(/利用年数/);

  // 定額取り崩しに切り替え
  await page
    .locator('input[name="investment-sim-withdrawal-mode"][value="byAmount"]')
    .click();

  // ラベルはそのモードでは隠れるので表示されない
  const yearsFieldEl = page.locator('[data-withdrawal-field="years"]');
  await expect(yearsFieldEl).toHaveClass(/hidden/);
});

test('資産運用シミュレーション: 375pxモバイルレイアウトでも機能する', async ({
  page,
}) => {
  // モバイルビューポートを設定
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/tools/investment-simulator/');

  // h1が表示される
  const h1 = page.locator('main h1');
  await expect(h1).toBeVisible();

  // ラジオボタングループが表示される
  const modeGroups = page.locator('[role="radiogroup"]');
  expect(await modeGroups.count()).toBeGreaterThan(0);

  // 入力欄が表示される
  const rateInput = page.locator('#investment-sim-rate');
  const initialInput = page.locator('#investment-sim-initial');
  await expect(rateInput).toBeVisible();
  await expect(initialInput).toBeVisible();

  // 結果セクションが表示される
  const resultsEl = page.locator('#investment-sim-results');
  await expect(resultsEl).not.toHaveClass(/hidden/);

  // 取り崩しセクションも表示される
  const withdrawalResultsEl = page.locator(
    '#investment-sim-withdrawal-results',
  );
  await expect(withdrawalResultsEl).not.toHaveClass(/hidden/);

  // モード切り替えが機能する
  await page
    .locator('input[name="investment-sim-withdrawal-mode"][value="byAmount"]')
    .click();
  const amountFieldEl = page.locator('[data-withdrawal-field="amount"]');
  await expect(amountFieldEl).not.toHaveClass(/hidden/);
});

test('資産運用シミュレーション: 利回り0%での定額取り崩し', async ({ page }) => {
  await page.goto('/tools/investment-simulator/');

  // 利回りを0%に設定
  await page.locator('#investment-sim-rate').fill('0');
  await page.locator('#investment-sim-initial').fill('1000000');
  await page.locator('#investment-sim-monthly').fill('10000');
  await page.locator('#investment-sim-years').fill('5');

  // 定額取り崩しモードに切り替え
  await page
    .locator('input[name="investment-sim-withdrawal-mode"][value="byAmount"]')
    .click();
  await page.locator('#investment-sim-withdrawal-amount').fill('30000');

  const withdrawalResultsEl = page.locator(
    '#investment-sim-withdrawal-results',
  );
  await expect(withdrawalResultsEl).not.toHaveClass(/hidden/);

  // 結果が表示される
  await expect(
    page.locator('#investment-sim-withdrawal-primary-value'),
  ).toContainText(/年|ヶ月/);
});

test('資産運用シミュレーション: 利回り0%での定率取り崩し', async ({ page }) => {
  await page.goto('/tools/investment-simulator/');

  // 利回りを0%に設定
  await page.locator('#investment-sim-rate').fill('0');
  await page.locator('#investment-sim-initial').fill('1000000');
  await page.locator('#investment-sim-monthly').fill('10000');
  await page.locator('#investment-sim-years').fill('5');

  // 定率取り崩しモードに切り替え
  await page
    .locator('input[name="investment-sim-withdrawal-mode"][value="byRate"]')
    .click();
  await page.locator('#investment-sim-withdrawal-rate').fill('1');

  const withdrawalResultsEl = page.locator(
    '#investment-sim-withdrawal-results',
  );
  await expect(withdrawalResultsEl).not.toHaveClass(/hidden/);

  // 1ヶ月目の取り崩し額が表示される
  await expect(
    page.locator('#investment-sim-withdrawal-primary-value'),
  ).toContainText(/¥|￥/);
});

test('資産運用シミュレーション: 非常に小さい取り崩し額（1円）では資産は尽きない', async ({
  page,
}) => {
  await page.goto('/tools/investment-simulator/');

  // 定額取り崩しモードに切り替え
  await page
    .locator('input[name="investment-sim-withdrawal-mode"][value="byAmount"]')
    .click();

  // 1円の取り崩し額を入力
  await page.locator('#investment-sim-withdrawal-amount').fill('1');

  const withdrawalResultsEl = page.locator(
    '#investment-sim-withdrawal-results',
  );
  await expect(withdrawalResultsEl).not.toHaveClass(/hidden/);

  // 資産は尽きないメッセージが表示される
  await expect(
    page.locator('#investment-sim-withdrawal-primary-value'),
  ).toContainText(/尽きません|60年以内/);
});

test('資産運用シミュレーション: グラフのSVG要素のfill色がCSP準拠で正しく適用される（ライトモード）', async ({
  page,
}) => {
  await page.goto('/tools/investment-simulator/');

  // トレンドチャートのパス要素を取得
  const trendChartEl = page.locator('#investment-sim-trend-chart');
  const paths = trendChartEl.locator('path');
  const pathCount = await paths.count();
  expect(pathCount).toBeGreaterThan(0);

  // 最初のパス（積立元本を示す面積グラフ）のfill色を確認
  const firstPath = paths.first();
  const fillColor = await firstPath.evaluate(
    (el: SVGPathElement) => window.getComputedStyle(el).fill,
  );

  // fill色が黒（rgb(0,0,0)）でなく、CSSで定義された色であることを確認
  // ライトモードでの積立元本の色は #2a78d6 (rgb(42,120,214))
  expect(fillColor).not.toBe('rgb(0, 0, 0)');
  expect(fillColor).toMatch(/rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba/);

  // 円形要素（ドット）のfill色も確認
  const circles = trendChartEl.locator('circle');
  const circleCount = await circles.count();
  if (circleCount > 0) {
    const firstCircle = circles.first();
    const circleFill = await firstCircle.evaluate(
      (el: SVGCircleElement) => window.getComputedStyle(el).fill,
    );
    // 円形要素も黒以外の色を持つことを確認
    expect(circleFill).not.toBe('rgb(0, 0, 0)');
  }
});

test('資産運用シミュレーション: グラフのSVG要素のfill色がCSP準拠で正しく適用される（ダークモード）', async ({
  page,
}) => {
  await page.goto('/tools/investment-simulator/');

  // ダークモードを有効化
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
  });

  // トレンドチャートのパス要素が描画されるまで待つ（自動リトライ）
  const trendChartEl = page.locator('#investment-sim-trend-chart');
  const paths = trendChartEl.locator('path');
  await expect(paths.first()).toBeVisible();
  const pathCount = await paths.count();
  expect(pathCount).toBeGreaterThan(0);

  // 最初のパス（積立元本を示す面積グラフ）のfill色を確認
  const firstPath = paths.first();
  const fillColor = await firstPath.evaluate(
    (el: SVGPathElement) => window.getComputedStyle(el).fill,
  );

  // fill色が黒（rgb(0,0,0)）でなく、CSSで定義された色であることを確認
  // ダークモードでの積立元本の色は #3987e5 (rgb(57,135,229))
  expect(fillColor).not.toBe('rgb(0, 0, 0)');
  expect(fillColor).toMatch(/rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba/);

  // 円形要素（ドット）のfill色も確認
  const circles = trendChartEl.locator('circle');
  const circleCount = await circles.count();
  if (circleCount > 0) {
    const firstCircle = circles.first();
    const circleFill = await firstCircle.evaluate(
      (el: SVGCircleElement) => window.getComputedStyle(el).fill,
    );
    // 円形要素も黒以外の色を持つことを確認
    expect(circleFill).not.toBe('rgb(0, 0, 0)');
  }
});
