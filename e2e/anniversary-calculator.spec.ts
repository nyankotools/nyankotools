import { test, expect } from './helpers/test';

test.describe('記念日計算（日本語版）', () => {
  test('100日目の日付・曜日・残り日数が表示される', async ({ page }) => {
    await page.goto('/tools/anniversary-calculator/');
    await page.locator('#ann-start').fill('2026-01-01');
    await page.locator('#ann-base').fill('2026-04-01');

    const row = page
      .locator('#ann-rows tr')
      .filter({ has: page.getByRole('rowheader', { name: /^100日目/ }) });
    await expect(row).toContainText('2026年4月10日（金）');
    await expect(row).toContainText('あと9日');
  });

  test('初日を含めない設定にすると100日後に切り替わる', async ({ page }) => {
    await page.goto('/tools/anniversary-calculator/');
    await page.locator('#ann-start').fill('2026-01-01');
    await page.locator('#ann-base').fill('2026-04-01');
    await page.locator('#ann-inclusive').uncheck();

    const row = page
      .locator('#ann-rows tr')
      .filter({ has: page.getByRole('rowheader', { name: /^100日後/ }) });
    await expect(row).toContainText('2026年4月11日（土）');
  });

  test('周年の一覧に切り替えられ、2/29起点の扱いを選べる', async ({ page }) => {
    await page.goto('/tools/anniversary-calculator/');
    await page.locator('#ann-start').fill('2024-02-29');
    await page.locator('#ann-base').fill('2024-03-01');
    await page.getByRole('button', { name: /周年/ }).click();

    const row = page
      .locator('#ann-rows tr')
      .filter({ has: page.getByRole('rowheader', { name: /^1周年/ }) });
    await expect(row).toContainText('2025年2月28日');

    await expect(page.locator('#ann-leap-field')).toBeVisible();
    await page.locator('#ann-leap').selectOption('mar1');
    await expect(row).toContainText('2025年3月1日');
  });

  test('任意の日数とイベントのカウントダウンが計算できる', async ({ page }) => {
    await page.goto('/tools/anniversary-calculator/');
    await page.locator('#ann-start').fill('2026-01-01');
    await page.locator('#ann-base').fill('2026-10-13');

    await page.locator('#ann-custom').fill('777');
    await expect(page.locator('#ann-custom-result')).toContainText('777日目');

    await page.locator('#ann-custom').fill('0');
    await expect(page.locator('#ann-custom-error')).toHaveText(
      '日数には1以上の整数を入力してください',
    );

    await page.locator('#ann-event').fill('2026-12-25');
    await expect(page.locator('#ann-event-result')).toContainText('あと73日');
    await expect(page.locator('#ann-event-weeks')).toHaveText('＝ 10週間3日');
  });
});

test.describe('Anniversary Calculator (English)', () => {
  test('英語版で記念日が表示される', async ({ page }) => {
    await page.goto('/en/tools/anniversary-calculator/');
    await page.locator('#ann-start').fill('2026-01-01');
    await page.locator('#ann-base').fill('2026-04-01');

    const row = page
      .locator('#ann-rows tr')
      .filter({ has: page.getByRole('rowheader', { name: /^Day 100\D*$/ }) });
    await expect(row).toContainText('2026-04-10 (Fri)');
    await expect(row).toContainText('in 9 days');
  });
});
