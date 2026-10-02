import { test, expect } from './helpers/test';

test.describe('日数計算機（日本語版）', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/tools/date-calculator/');
    await expect(page.locator('main h1')).toHaveText('日数計算機');
  });

  test('二つの日付の差を計算できる', async ({ page }) => {
    await page.goto('/tools/date-calculator/');

    await page.locator('#date-calc-diff-start-year').fill('2024');
    await page.locator('#date-calc-diff-start-month').fill('1');
    await page.locator('#date-calc-diff-start-day').fill('1');
    await page.locator('#date-calc-diff-end-year').fill('2024');
    await page.locator('#date-calc-diff-end-month').fill('1');
    await page.locator('#date-calc-diff-end-day').fill('31');

    await expect(page.locator('#date-calc-diff-result')).toHaveText('30日');
    await expect(page.locator('#date-calc-diff-note')).toHaveText(
      '終了日は開始日の30日後です',
    );
    await expect(page.locator('#date-calc-diff-weeks')).toHaveText(
      '＝ 4週間2日',
    );
    await expect(page.locator('#date-calc-diff-error')).toBeEmpty();
  });

  test('初日を含めて数えるチェックボックスで結果が変わる', async ({ page }) => {
    await page.goto('/tools/date-calculator/');

    await page.locator('#date-calc-diff-start-year').fill('2024');
    await page.locator('#date-calc-diff-start-month').fill('1');
    await page.locator('#date-calc-diff-start-day').fill('1');
    await page.locator('#date-calc-diff-end-year').fill('2024');
    await page.locator('#date-calc-diff-end-month').fill('1');
    await page.locator('#date-calc-diff-end-day').fill('31');
    await expect(page.locator('#date-calc-diff-result')).toHaveText('30日');

    await page.locator('#date-calc-diff-inclusive').check();
    await expect(page.locator('#date-calc-diff-result')).toHaveText('31日間');
    // 注記は暦上のオフセット（30日後）を表し、両端算入の通算日数（31日間）とは独立している
    await expect(page.locator('#date-calc-diff-note')).toHaveText(
      '終了日は開始日の30日後です',
    );
  });

  test('同じ日付で初日を含めて数えても「同じ日」と表示される', async ({
    page,
  }) => {
    await page.goto('/tools/date-calculator/');

    await page.locator('#date-calc-diff-start-year').fill('2024');
    await page.locator('#date-calc-diff-start-month').fill('1');
    await page.locator('#date-calc-diff-start-day').fill('1');
    await page.locator('#date-calc-diff-end-year').fill('2024');
    await page.locator('#date-calc-diff-end-month').fill('1');
    await page.locator('#date-calc-diff-end-day').fill('1');
    await page.locator('#date-calc-diff-inclusive').check();

    await expect(page.locator('#date-calc-diff-result')).toHaveText('1日間');
    await expect(page.locator('#date-calc-diff-note')).toHaveText(
      '開始日と終了日は同じ日です',
    );
  });

  test('終了日が開始日より前だと負の日数になる', async ({ page }) => {
    await page.goto('/tools/date-calculator/');

    await page.locator('#date-calc-diff-start-year').fill('2024');
    await page.locator('#date-calc-diff-start-month').fill('1');
    await page.locator('#date-calc-diff-start-day').fill('31');
    await page.locator('#date-calc-diff-end-year').fill('2024');
    await page.locator('#date-calc-diff-end-month').fill('1');
    await page.locator('#date-calc-diff-end-day').fill('1');

    await expect(page.locator('#date-calc-diff-result')).toHaveText('-30日');
    await expect(page.locator('#date-calc-diff-note')).toHaveText(
      '終了日は開始日の30日前です',
    );
  });

  test('N日後の日付を計算できる', async ({ page }) => {
    await page.goto('/tools/date-calculator/');

    await page.locator('#date-calc-add-base-year').fill('2024');
    await page.locator('#date-calc-add-base-month').fill('1');
    await page.locator('#date-calc-add-base-day').fill('31');
    await page.locator('#date-calc-add-days').fill('1');
    await page.locator('#date-calc-add-direction').selectOption('after');

    await expect(page.locator('#date-calc-add-result')).toHaveText(
      '2024年2月1日（木）',
    );
    await expect(page.locator('#date-calc-add-error')).toBeEmpty();
  });

  test('N日前の日付を計算できる', async ({ page }) => {
    await page.goto('/tools/date-calculator/');

    await page.locator('#date-calc-add-base-year').fill('2024');
    await page.locator('#date-calc-add-base-month').fill('1');
    await page.locator('#date-calc-add-base-day').fill('1');
    await page.locator('#date-calc-add-days').fill('1');
    await page.locator('#date-calc-add-direction').selectOption('before');

    await expect(page.locator('#date-calc-add-result')).toHaveText(
      '2023年12月31日（日）',
    );
  });

  test('日数欄に負の値を入力するとエラーになる（方向の二重反転を防ぐ）', async ({
    page,
  }) => {
    await page.goto('/tools/date-calculator/');

    await page.locator('#date-calc-add-base-year').fill('2024');
    await page.locator('#date-calc-add-base-month').fill('1');
    await page.locator('#date-calc-add-base-day').fill('1');
    await page.locator('#date-calc-add-days').fill('-5');
    await page.locator('#date-calc-add-direction').selectOption('before');

    await expect(page.locator('#date-calc-add-error')).toHaveText(
      '日数には0以上の整数を入力してください',
    );
    await expect(page.locator('#date-calc-add-result')).toBeEmpty();
  });
});

test.describe('Date Calculator (English)', () => {
  test('英語版が正しく表示され、計算できる', async ({ page }) => {
    await page.goto('/en/tools/date-calculator/');
    await expect(page.locator('main h1')).toHaveText('Date Calculator');

    await page.locator('#date-calc-diff-start-year').fill('2024');
    await page.locator('#date-calc-diff-start-month').fill('1');
    await page.locator('#date-calc-diff-start-day').fill('1');
    await page.locator('#date-calc-diff-end-year').fill('2024');
    await page.locator('#date-calc-diff-end-month').fill('1');
    await page.locator('#date-calc-diff-end-day').fill('31');
    await expect(page.locator('#date-calc-diff-result')).toHaveText('30 days');

    await page.locator('#date-calc-add-base-year').fill('2024');
    await page.locator('#date-calc-add-base-month').fill('1');
    await page.locator('#date-calc-add-base-day').fill('31');
    await page.locator('#date-calc-add-days').fill('1');
    await page.locator('#date-calc-add-direction').selectOption('after');
    await expect(page.locator('#date-calc-add-result')).toHaveText(
      '2024-02-01 (Thu)',
    );
  });
});
