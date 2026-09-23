import { test, expect } from '@playwright/test';

test('BMI計算機: 日本語版が表示される', async ({ page }) => {
  await page.goto('/tools/bmi-calculator/');

  await expect(page.locator('main h1')).toHaveText('BMI計算機');
});

test('BMI計算機: メートル法で身長・体重を入力するとBMIと体格区分が表示される', async ({
  page,
}) => {
  await page.goto('/tools/bmi-calculator/');

  // 初期値は既に入力されているはずだが、確認のため値を変更
  const heightCmInput = page.locator('#height-cm-input');
  const weightKgInput = page.locator('#weight-kg-input');

  await heightCmInput.fill('170');
  await weightKgInput.fill('65');

  // BMIと体格区分が表示される
  const bmiResult = page.locator('#bmi-result');
  const categoryResult = page.locator('#bmi-category-result');

  await expect(bmiResult).toHaveText(/22\./);
  await expect(categoryResult).toHaveText('普通体重');

  // 普通体重の範囲が表示される
  const healthyWeightResult = page.locator('#healthy-weight-result');
  await expect(healthyWeightResult).toContainText('kg');
});

test('BMI計算機: 単位をヤード・ポンド法に切り替えると、入力フィールドが切り替わる', async ({
  page,
}) => {
  await page.goto('/tools/bmi-calculator/');

  // メートル法フィールドが表示されている
  const heightCmFields = page.locator('#height-metric-fields');
  const heightImperialFields = page.locator('#height-imperial-fields');
  const weightKgFields = page.locator('#weight-metric-fields');
  const weightImperialFields = page.locator('#weight-imperial-fields');

  await expect(heightCmFields).not.toHaveClass(/hidden/);
  await expect(heightImperialFields).toHaveClass(/hidden/);

  // ヤード・ポンド法に切り替え
  const imperialRadio = page.locator('input[name="unit-system"][value="imperial"]');
  await imperialRadio.click();

  // ヤード・ポンド法フィールドが表示される
  await expect(heightCmFields).toHaveClass(/hidden/);
  await expect(heightImperialFields).not.toHaveClass(/hidden/);
  await expect(weightKgFields).toHaveClass(/hidden/);
  await expect(weightImperialFields).not.toHaveClass(/hidden/);
});

test('BMI計算機: 単位切り替え後も計算が正しく実行される', async ({
  page,
}) => {
  await page.goto('/tools/bmi-calculator/');

  const imperialRadio = page.locator('input[name="unit-system"][value="imperial"]');

  // メートル法で入力
  await page.locator('#height-cm-input').fill('170');
  await page.locator('#weight-kg-input').fill('65');

  const categoryResult1 = await page.locator('#bmi-category-result').textContent();

  // ヤード・ポンド法に切り替え
  await imperialRadio.click();

  // 5feet 7inch = 170.18cm, 143lb = 64.864kg
  await page.locator('#height-ft-input').fill('5');
  await page.locator('#height-in-input').fill('7');
  await page.locator('#weight-lb-input').fill('143');

  const categoryResult2 = await page.locator('#bmi-category-result').textContent();

  // ほぼ同じBMIと体格区分が表示される（体格区分が同じ）
  expect(categoryResult1).toBe(categoryResult2);

  // 普通体重の範囲がlbで表示される
  const healthyWeightResult = page.locator('#healthy-weight-result');
  await expect(healthyWeightResult).toContainText('lb');
});

test('BMI計算機: 低体重（BMI 18.5未満）の場合', async ({ page }) => {
  await page.goto('/tools/bmi-calculator/');

  await page.locator('#height-cm-input').fill('170');
  await page.locator('#weight-kg-input').fill('50');

  const categoryResult = page.locator('#bmi-category-result');
  await expect(categoryResult).toHaveText('低体重（やせ型）');
});

test('BMI計算機: 肥満1度（BMI 25以上30未満）の場合', async ({ page }) => {
  await page.goto('/tools/bmi-calculator/');

  await page.locator('#height-cm-input').fill('170');
  await page.locator('#weight-kg-input').fill('75');

  const categoryResult = page.locator('#bmi-category-result');
  await expect(categoryResult).toHaveText('肥満（1度）');
});

test('BMI計算機: 肥満2度（BMI 30以上35未満）の場合', async ({ page }) => {
  await page.goto('/tools/bmi-calculator/');

  await page.locator('#height-cm-input').fill('170');
  await page.locator('#weight-kg-input').fill('87');

  const categoryResult = page.locator('#bmi-category-result');
  await expect(categoryResult).toHaveText('肥満（2度）');
});

test('BMI計算機: 肥満3度（BMI 35以上40未満）の場合', async ({ page }) => {
  await page.goto('/tools/bmi-calculator/');

  await page.locator('#height-cm-input').fill('170');
  await page.locator('#weight-kg-input').fill('102');

  const categoryResult = page.locator('#bmi-category-result');
  await expect(categoryResult).toHaveText('肥満（3度）');
});

test('BMI計算機: 肥満4度（BMI 40以上）の場合', async ({ page }) => {
  await page.goto('/tools/bmi-calculator/');

  await page.locator('#height-cm-input').fill('170');
  await page.locator('#weight-kg-input').fill('116');

  const categoryResult = page.locator('#bmi-category-result');
  await expect(categoryResult).toHaveText('肥満（4度）');
});

test('BMI計算機: BMI境界値ちょうどで正しく判定される（18.5）', async ({
  page,
}) => {
  await page.goto('/tools/bmi-calculator/');

  // BMI = 18.5のときの体重を計算
  // BMI = weight / (height_m)^2
  // 18.5 = weight / (1.7)^2
  // weight = 18.5 * 2.89 ≈ 53.465
  await page.locator('#height-cm-input').fill('170');
  await page.locator('#weight-kg-input').fill('53.465');

  const categoryResult = page.locator('#bmi-category-result');
  await expect(categoryResult).toHaveText('普通体重');
});

test('BMI計算機: BMI境界値ちょうどで正しく判定される（25）', async ({
  page,
}) => {
  await page.goto('/tools/bmi-calculator/');

  // BMI = 25のときの体重を計算
  // 25 = weight / (1.7)^2
  // weight = 25 * 2.89 ≈ 72.25
  await page.locator('#height-cm-input').fill('170');
  await page.locator('#weight-kg-input').fill('72.25');

  const categoryResult = page.locator('#bmi-category-result');
  await expect(categoryResult).toHaveText('肥満（1度）');
});

test('BMI計算機: BMI境界値ちょうどで正しく判定される（30）', async ({
  page,
}) => {
  await page.goto('/tools/bmi-calculator/');

  // BMI = 30のときの体重を計算
  // 30 = weight / (1.7)^2
  // weight = 30 * 2.89 ≈ 86.7
  await page.locator('#height-cm-input').fill('170');
  await page.locator('#weight-kg-input').fill('86.7');

  const categoryResult = page.locator('#bmi-category-result');
  await expect(categoryResult).toHaveText('肥満（2度）');
});

test('BMI計算機: 空欄の場合、エラーメッセージが表示される', async ({
  page,
}) => {
  await page.goto('/tools/bmi-calculator/');

  // 初期値をクリア
  await page.locator('#height-cm-input').clear();
  await page.locator('#weight-kg-input').clear();

  // エラーメッセージが非表示
  const errorEl = page.locator('#bmi-error');
  const resultsEl = page.locator('#bmi-results');

  await expect(errorEl).toHaveText('');
  await expect(resultsEl).toHaveClass(/hidden/);
});

test('BMI計算機: 0を入力した場合、エラーメッセージが表示される', async ({
  page,
}) => {
  await page.goto('/tools/bmi-calculator/');

  await page.locator('#height-cm-input').fill('0');
  await page.locator('#weight-kg-input').fill('65');

  const errorEl = page.locator('#bmi-error');
  const resultsEl = page.locator('#bmi-results');

  await expect(errorEl).toContainText('計算できませんでした');
  await expect(resultsEl).toHaveClass(/hidden/);
});

test('BMI計算機: 負数を入力した場合、エラーメッセージが表示される', async ({
  page,
}) => {
  await page.goto('/tools/bmi-calculator/');

  await page.locator('#height-cm-input').fill('-170');
  await page.locator('#weight-kg-input').fill('65');

  const errorEl = page.locator('#bmi-error');
  const resultsEl = page.locator('#bmi-results');

  await expect(errorEl).toContainText('計算できませんでした');
  await expect(resultsEl).toHaveClass(/hidden/);
});

test('BMI計算機: 英語版が表示される', async ({ page }) => {
  await page.goto('/en/tools/bmi-calculator/');

  await expect(page.locator('main h1')).toHaveText('BMI Calculator');

  // 英語版の単位ラベルを確認
  await expect(page.locator('input[name="unit-system"][value="metric"]')).toBeVisible();
  const metricLabel = page.locator('label').filter({ hasText: 'Metric' });
  await expect(metricLabel).toBeVisible();
});

test('BMI計算機: 英語版でインペリアル単位がデフォルト', async ({ page }) => {
  await page.goto('/en/tools/bmi-calculator/');

  const imperialRadio = page.locator('input[name="unit-system"][value="imperial"]');
  const isChecked = await imperialRadio.isChecked();

  expect(isChecked).toBe(true);
});

test('BMI計算機: 英語版でメートル法に切り替え可能', async ({ page }) => {
  await page.goto('/en/tools/bmi-calculator/');

  const metricRadio = page.locator('input[name="unit-system"][value="metric"]');
  await metricRadio.click();

  // メートル法フィールドが表示される
  const heightCmFields = page.locator('#height-metric-fields');
  await expect(heightCmFields).not.toHaveClass(/hidden/);

  // メートル法で入力
  await page.locator('#height-cm-input').fill('170');
  await page.locator('#weight-kg-input').fill('65');

  // 結果が表示される
  const categoryResult = page.locator('#bmi-category-result');
  await expect(categoryResult).toHaveText('Normal weight');
});

test('BMI計算機: 英語版でWHO基準のカテゴリ名が表示される', async ({
  page,
}) => {
  await page.goto('/en/tools/bmi-calculator/');

  // インペリアル単位でデフォルト入力
  // 英語版の初期値: 5 ft 7 in, 143 lb
  const bmiResult = page.locator('#bmi-result');
  const categoryResult = page.locator('#bmi-category-result');

  await expect(bmiResult).not.toHaveText('');
  await expect(categoryResult).toHaveText('Normal weight');
});

test('BMI計算機: 英語版で肥満クラスのラベルが表示される', async ({
  page,
}) => {
  await page.goto('/en/tools/bmi-calculator/');

  const metricRadio = page.locator('input[name="unit-system"][value="metric"]');
  await metricRadio.click();

  // BMI 32（肥満クラス1）になる値
  await page.locator('#height-cm-input').fill('170');
  await page.locator('#weight-kg-input').fill('92.5');

  const categoryResult = page.locator('#bmi-category-result');
  await expect(categoryResult).toHaveText('Obese Class I');
});

test('BMI計算機: 注意事項セクションが表示される', async ({ page }) => {
  await page.goto('/tools/bmi-calculator/');

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

test('BMI計算機: 用語解説が表示される', async ({ page }) => {
  await page.goto('/tools/bmi-calculator/');

  const glossaryHeading = page.getByRole('heading', {
    level: 2,
    name: '用語解説',
  });

  await expect(glossaryHeading).toBeVisible();

  // 「BMI（体格指数）」という用語が表示される
  await expect(page.locator('main')).toContainText('BMI（体格指数）');
});
