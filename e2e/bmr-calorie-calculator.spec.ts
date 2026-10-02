import { test, expect } from './helpers/test';

test('基礎代謝・カロリー計算: 日本語版が表示される', async ({ page }) => {
  await page.goto('/tools/bmr-calorie-calculator/');

  await expect(page.locator('main h1')).toContainText('基礎代謝');
});

test('基礎代謝・カロリー計算: メートル法で基礎代謝が計算される', async ({
  page,
}) => {
  await page.goto('/tools/bmr-calorie-calculator/');

  const ageInput = page.locator('#bmr-age-input');
  const heightCmInput = page.locator('#bmr-height-cm-input');
  const weightKgInput = page.locator('#bmr-weight-kg-input');
  const resultEl = page.locator('#bmr-result');

  // デフォルト値が入っているはずだが、確認のため値を入力
  await ageInput.fill('30');
  await heightCmInput.fill('170');
  await weightKgInput.fill('65');

  // 基礎代謝が表示される
  await expect(resultEl).toContainText(/kcal/);
  const text = await resultEl.textContent();
  const match = text?.match(/(\d+(?:,\d+)*)/);
  if (match) {
    const value = parseInt(match[0].replace(/,/g, ''), 10);
    // 基礎代謝は通常1000-2000 kcal/日
    expect(value).toBeGreaterThan(1000);
    expect(value).toBeLessThan(3000);
  }
});

test('基礎代謝・カロリー計算: 総消費カロリーと目標カロリーが表示される', async ({
  page,
}) => {
  await page.goto('/tools/bmr-calorie-calculator/');

  const ageInput = page.locator('#bmr-age-input');
  const heightCmInput = page.locator('#bmr-height-cm-input');
  const weightKgInput = page.locator('#bmr-weight-kg-input');
  const tdeeEl = page.locator('#bmr-tdee-result');
  const maintainEl = page.locator('#bmr-target-maintain');

  await ageInput.fill('30');
  await heightCmInput.fill('170');
  await weightKgInput.fill('65');

  // 総消費カロリーが表示される
  await expect(tdeeEl).toContainText(/kcal/);

  // 目標カロリー（維持）が表示される
  await expect(maintainEl).toContainText(/kcal/);
});

test('基礎代謝・カロリー計算: 減量・増量目標が表示される', async ({ page }) => {
  await page.goto('/tools/bmr-calorie-calculator/');

  const ageInput = page.locator('#bmr-age-input');
  const heightCmInput = page.locator('#bmr-height-cm-input');
  const weightKgInput = page.locator('#bmr-weight-kg-input');
  const mildLossEl = page.locator('#bmr-target-mild-loss');
  const lossEl = page.locator('#bmr-target-loss');
  const gainEl = page.locator('#bmr-target-gain');

  await ageInput.fill('30');
  await heightCmInput.fill('170');
  await weightKgInput.fill('65');

  // 減量目標が表示される
  await expect(mildLossEl).toContainText(/kcal/);
  await expect(lossEl).toContainText(/kcal/);

  // 増量目標が表示される
  await expect(gainEl).toContainText(/kcal/);
});

test('基礎代謝・カロリー計算: 単位をインペリアルに切り替えできる', async ({
  page,
}) => {
  await page.goto('/tools/bmr-calorie-calculator/');

  const metricFields = page.locator('#bmr-height-metric-fields');
  const imperialFields = page.locator('#bmr-height-imperial-fields');
  const imperialRadio = page.locator(
    'input[name="bmr-unit-system"][value="imperial"]',
  );

  // メートル法フィールドが表示されている
  await expect(metricFields).not.toHaveClass(/hidden/);
  await expect(imperialFields).toHaveClass(/hidden/);

  // インペリアルに切り替え
  await imperialRadio.click();

  // フィールドが切り替わる
  await expect(metricFields).toHaveClass(/hidden/);
  await expect(imperialFields).not.toHaveClass(/hidden/);
});

test('基礎代謝・カロリー計算: インペリアル単位で計算できる', async ({
  page,
}) => {
  await page.goto('/tools/bmr-calorie-calculator/');

  const imperialRadio = page.locator(
    'input[name="bmr-unit-system"][value="imperial"]',
  );
  const ageInput = page.locator('#bmr-age-input');
  const heightFtInput = page.locator('#bmr-height-ft-input');
  const heightInInput = page.locator('#bmr-height-in-input');
  const weightLbInput = page.locator('#bmr-weight-lb-input');
  const resultEl = page.locator('#bmr-result');

  // インペリアルに切り替え
  await imperialRadio.click();

  // 5ft 7in = 170cm、143lb = 65kg（ほぼ同じ）
  await ageInput.fill('30');
  await heightFtInput.fill('5');
  await heightInInput.fill('7');
  await weightLbInput.fill('143');

  // 基礎代謝が表示される
  await expect(resultEl).toContainText(/kcal/);
});

test('基礎代謝・カロリー計算: 性別を変更できる', async ({ page }) => {
  await page.goto('/tools/bmr-calorie-calculator/');

  const femaleRadio = page.locator('input[name="bmr-sex"][value="female"]');
  const ageInput = page.locator('#bmr-age-input');
  const heightCmInput = page.locator('#bmr-height-cm-input');
  const weightKgInput = page.locator('#bmr-weight-kg-input');
  const resultEl = page.locator('#bmr-result');

  await ageInput.fill('30');
  await heightCmInput.fill('170');
  await weightKgInput.fill('65');

  // 男性の基礎代謝を取得
  const maleResult = await resultEl.textContent();

  // 女性に変更
  await femaleRadio.click();

  // 女性の基礎代謝を取得（異なるはず）
  const femaleResult = await resultEl.textContent();

  expect(maleResult).not.toBe(femaleResult);
});

test('基礎代謝・カロリー計算: 計算式を変更できる', async ({ page }) => {
  await page.goto('/tools/bmr-calorie-calculator/');

  const formulaSelect = page.locator('#bmr-formula-select');
  const ageInput = page.locator('#bmr-age-input');
  const heightCmInput = page.locator('#bmr-height-cm-input');
  const weightKgInput = page.locator('#bmr-weight-kg-input');
  const resultEl = page.locator('#bmr-result');

  await ageInput.fill('30');
  await heightCmInput.fill('170');
  await weightKgInput.fill('65');

  // Mifflin の結果を取得
  const mifflinResult = await resultEl.textContent();

  // Harris-Benedict に変更
  await formulaSelect.selectOption('harris');

  // 異なる結果が表示される
  const harrisResult = await resultEl.textContent();
  expect(mifflinResult).not.toBe(harrisResult);
});

test('基礎代謝・カロリー計算: 日本人の食事摂取基準式が18歳未満でエラーを表示', async ({
  page,
}) => {
  await page.goto('/tools/bmr-calorie-calculator/');

  const formulaSelect = page.locator('#bmr-formula-select');
  const ageInput = page.locator('#bmr-age-input');
  const heightCmInput = page.locator('#bmr-height-cm-input');
  const weightKgInput = page.locator('#bmr-weight-kg-input');
  const errorEl = page.locator('#bmr-error');
  const resultsEl = page.locator('#bmr-results');

  // 日本人の基準値式に設定
  await formulaSelect.selectOption('japan');

  // 17歳を入力
  await ageInput.fill('17');
  await heightCmInput.fill('170');
  await weightKgInput.fill('65');

  // エラーメッセージが表示される（18歳以上が必要）
  await expect(errorEl).toContainText(/.+/);
  await expect(resultsEl).toHaveClass(/hidden/);
});

test('基礎代謝・カロリー計算: 日本人の食事摂取基準式が18歳で計算できる', async ({
  page,
}) => {
  await page.goto('/tools/bmr-calorie-calculator/');

  const formulaSelect = page.locator('#bmr-formula-select');
  const ageInput = page.locator('#bmr-age-input');
  const heightCmInput = page.locator('#bmr-height-cm-input');
  const weightKgInput = page.locator('#bmr-weight-kg-input');
  const resultEl = page.locator('#bmr-result');
  const resultsEl = page.locator('#bmr-results');

  // 日本人の基準値式に設定
  await formulaSelect.selectOption('japan');

  // 18歳を入力
  await ageInput.fill('18');
  await heightCmInput.fill('170');
  await weightKgInput.fill('65');

  // 結果が表示される
  await expect(resultsEl).not.toHaveClass(/hidden/);
  await expect(resultEl).toContainText(/kcal/);
});

test('基礎代謝・カロリー計算: 活動レベルを変更できる', async ({ page }) => {
  await page.goto('/tools/bmr-calorie-calculator/');

  const activitySelect = page.locator('#bmr-activity-select');
  const ageInput = page.locator('#bmr-age-input');
  const heightCmInput = page.locator('#bmr-height-cm-input');
  const weightKgInput = page.locator('#bmr-weight-kg-input');
  const tdeeEl = page.locator('#bmr-tdee-result');

  await ageInput.fill('30');
  await heightCmInput.fill('170');
  await weightKgInput.fill('65');

  // デフォルト（軽い活動）の TDEE を取得
  const defaultTdee = await tdeeEl.textContent();

  // 非常に活動的に変更
  await activitySelect.selectOption('veryActive');

  // 異なる TDEE が表示される（多いはず）
  const highActivityTdee = await tdeeEl.textContent();
  expect(defaultTdee).not.toBe(highActivityTdee);
});

test('基礎代謝・カロリー計算: 年齢が空の場合、結果は表示されない', async ({
  page,
}) => {
  await page.goto('/tools/bmr-calorie-calculator/');

  const heightCmInput = page.locator('#bmr-height-cm-input');
  const weightKgInput = page.locator('#bmr-weight-kg-input');
  const resultsEl = page.locator('#bmr-results');

  // 年齢を空にする
  const ageInput = page.locator('#bmr-age-input');
  await ageInput.fill('');

  // 身長と体重を入力
  await heightCmInput.fill('170');
  await weightKgInput.fill('65');

  // 結果が表示されない
  await expect(resultsEl).toHaveClass(/hidden/);
});

test('基礎代謝・カロリー計算: 身長が空の場合、結果は表示されない', async ({
  page,
}) => {
  await page.goto('/tools/bmr-calorie-calculator/');

  const ageInput = page.locator('#bmr-age-input');
  const weightKgInput = page.locator('#bmr-weight-kg-input');
  const resultsEl = page.locator('#bmr-results');

  await ageInput.fill('30');
  // 身長を空にする
  const heightCmInput = page.locator('#bmr-height-cm-input');
  await heightCmInput.fill('');

  await weightKgInput.fill('65');

  // 結果が表示されない
  await expect(resultsEl).toHaveClass(/hidden/);
});

test('基礎代謝・カロリー計算: 体重が空の場合、結果は表示されない', async ({
  page,
}) => {
  await page.goto('/tools/bmr-calorie-calculator/');

  const ageInput = page.locator('#bmr-age-input');
  const heightCmInput = page.locator('#bmr-height-cm-input');
  const resultsEl = page.locator('#bmr-results');

  await ageInput.fill('30');
  await heightCmInput.fill('170');
  // 体重を空にする
  const weightKgInput = page.locator('#bmr-weight-kg-input');
  await weightKgInput.fill('');

  // 結果が表示されない
  await expect(resultsEl).toHaveClass(/hidden/);
});

test('基礎代謝・カロリー計算: 無効な年齢でエラーを表示', async ({ page }) => {
  await page.goto('/tools/bmr-calorie-calculator/');

  const ageInput = page.locator('#bmr-age-input');
  const heightCmInput = page.locator('#bmr-height-cm-input');
  const weightKgInput = page.locator('#bmr-weight-kg-input');
  const errorEl = page.locator('#bmr-error');

  // 0歳を入力
  await ageInput.fill('0');
  await heightCmInput.fill('170');
  await weightKgInput.fill('65');

  // エラーメッセージが表示される
  await expect(errorEl).toContainText(/.+/);
});

test('基礎代謝・カロリー計算: 英語版が表示される', async ({ page }) => {
  await page.goto('/en/tools/bmr-calorie-calculator/');

  await expect(page.locator('main h1')).toContainText('BMR');

  const ageLabel = page.locator('label', { hasText: /Age/ });
  await expect(ageLabel).toBeVisible();
});

test('基礎代謝・カロリー計算: 英語版でインペリアル単位がデフォルト', async ({
  page,
}) => {
  await page.goto('/en/tools/bmr-calorie-calculator/');

  const imperialRadio = page.locator(
    'input[name="bmr-unit-system"][value="imperial"]',
  );
  const isChecked = await imperialRadio.isChecked();

  expect(isChecked).toBe(true);
});

test('基礎代謝・カロリー計算: 英語版で計算できる', async ({ page }) => {
  await page.goto('/en/tools/bmr-calorie-calculator/');

  const ageInput = page.locator('#bmr-age-input');
  const heightFtInput = page.locator('#bmr-height-ft-input');
  const heightInInput = page.locator('#bmr-height-in-input');
  const weightLbInput = page.locator('#bmr-weight-lb-input');
  const resultEl = page.locator('#bmr-result');

  await ageInput.fill('30');
  await heightFtInput.fill('5');
  await heightInInput.fill('7');
  await weightLbInput.fill('143');

  // 基礎代謝が表示される
  await expect(resultEl).toContainText(/kcal/);
});
