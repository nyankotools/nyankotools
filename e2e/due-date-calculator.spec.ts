import { test, expect } from './helpers/test';

test.describe('出産予定日計算（日本語版）', () => {
  test('最終月経日から予定日と節目が表示される', async ({ page }) => {
    await page.goto('/tools/due-date-calculator/');
    await page.locator('#due-date').fill('2023-01-01');
    await page.locator('#due-reference').fill('2023-03-05');

    await expect(page.locator('#due-result-due')).toHaveText(
      '2023年10月8日（日）',
    );
    await expect(page.locator('#due-result-current')).toHaveText('妊娠9週0日');
    await expect(page.locator('#due-result-month')).toHaveText('妊娠3ヶ月');
    await expect(page.locator('#due-milestones li')).toHaveCount(8);
  });

  test('周期を変えると予定日が補正される', async ({ page }) => {
    await page.goto('/tools/due-date-calculator/');
    await page.locator('#due-date').fill('2023-01-01');
    await page.locator('#due-cycle').fill('35');
    await expect(page.locator('#due-result-due')).toHaveText(
      '2023年10月15日（日）',
    );
  });

  test('分娩予定日モードでは周期入力が隠れる', async ({ page }) => {
    await page.goto('/tools/due-date-calculator/');
    await page.locator('#due-mode').selectOption('due');
    await expect(page.locator('#due-cycle-field')).toBeHidden();
    await page.locator('#due-date').fill('2023-10-08');
    await expect(page.locator('#due-result-start')).toHaveText(
      '2023年1月1日（日）',
    );
  });

  test('周期が範囲外ならエラーを表示する', async ({ page }) => {
    await page.goto('/tools/due-date-calculator/');
    await page.locator('#due-date').fill('2023-01-01');
    await page.locator('#due-cycle').fill('10');
    await expect(page.locator('#due-error')).not.toBeEmpty();
    await expect(page.locator('#due-results')).toBeHidden();
  });

  test('医療判断の代替でない旨が表示される', async ({ page }) => {
    await page.goto('/tools/due-date-calculator/');
    await expect(page.locator('p[role="note"]')).toContainText(
      '医療上の診断・判断の代わりにはなりません',
    );
  });
});

test.describe('Due Date Calculator (English)', () => {
  test('shows the due date from the last period', async ({ page }) => {
    await page.goto('/en/tools/due-date-calculator/');
    await page.locator('#due-date').fill('2023-01-01');
    await page.locator('#due-reference').fill('2023-03-05');
    await expect(page.locator('#due-result-due')).toHaveText('Sun, 2023-10-08');
    await expect(page.locator('#due-result-current')).toHaveText(
      '9 weeks, 0 days',
    );
  });
});
