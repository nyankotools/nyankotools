import { test, expect } from './helpers/test';

test('METs消費カロリー: 初期状態で歩行30分の結果が出る', async ({ page }) => {
  await page.goto('/tools/mets-calorie-calculator/');

  // 3 METs × 60kg × 0.5h × 1.05 = 94.5 → 95 kcal（四捨五入の表示）
  await expect(page.locator('#mets-total')).toContainText(/9[45]/);
  await expect(page.locator('#mets-total')).toContainText('kcal');
  await expect(page.locator('.mets-entry')).toHaveCount(1);
});

test('METs消費カロリー: 表から追加して合計できる', async ({ page }) => {
  await page.goto('/tools/mets-calorie-calculator/');

  await page.locator('#mets-weight-input').fill('70');
  // ジョギング（7METs）を追加
  await page.locator('.mets-add-button[data-mets="7"]').first().click();
  await expect(page.locator('.mets-entry')).toHaveCount(2);

  // 1行目: 3×70×0.5×1.05=110.25 / 2行目: 7×70×0.5×1.05=257.25 → 合計 367.5 → 368
  await expect(page.locator('#mets-total')).toContainText(/36[78]/);
  await expect(page.locator('#mets-total-time')).toContainText('1時間');
});

test('METs消費カロリー: 時間と分を入力できる', async ({ page }) => {
  await page.goto('/tools/mets-calorie-calculator/');

  const entry = page.locator('.mets-entry').first();
  await entry.locator('.mets-in-hours').fill('1');
  await entry.locator('.mets-in-minutes').fill('0');
  // 3×60×1×1.05 = 189
  await expect(page.locator('#mets-total')).toContainText('189');
});

test('METs消費カロリー: 安静時分を差し引くと値が小さくなる', async ({
  page,
}) => {
  await page.goto('/tools/mets-calorie-calculator/');

  await page.locator('#mets-exclude-rest').check();
  // (3-1)×60×0.5×1.05 = 63
  await expect(page.locator('#mets-total')).toContainText('63');
});

test('METs消費カロリー: 行を削除すると結果が消える', async ({ page }) => {
  await page.goto('/tools/mets-calorie-calculator/');

  await page.locator('.mets-entry button').first().click();
  await expect(page.locator('.mets-entry')).toHaveCount(0);
  await expect(page.locator('#mets-results')).toHaveClass(/hidden/);
});

test('METs消費カロリー: 体重が不正だとエラーを表示する', async ({ page }) => {
  await page.goto('/tools/mets-calorie-calculator/');

  await page.locator('#mets-weight-input').fill('0');
  await expect(page.locator('#mets-error')).toContainText(/.+/);
  await expect(page.locator('#mets-results')).toHaveClass(/hidden/);
});

test('METs consumption: English version works with pounds', async ({
  page,
}) => {
  await page.goto('/en/tools/mets-calorie-calculator/');

  await expect(page.locator('#mets-weight-unit')).toHaveValue('lb');
  // 150 lb = 68.04 kg → 3 × 68.04 × 0.5 × 1.05 = 107.2
  await expect(page.locator('#mets-total')).toContainText('107');
});
