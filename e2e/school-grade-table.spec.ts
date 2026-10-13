import { test, expect } from './helpers/test';

test.describe('学年早見表', () => {
  test('生年月日から学年と早生まれが表示される', async ({ page }) => {
    await page.goto('/tools/school-grade-table/');
    await page.locator('#sgt-base-year').fill('2026');
    await page.locator('#sgt-birth-year').fill('2015');
    await page.locator('#sgt-birth-month').fill('2');
    await page.locator('#sgt-birth-day').fill('1');

    await expect(page.locator('#sgt-grade')).toHaveText('小学6年');
    await expect(page.locator('#sgt-cohort')).toHaveText('2014年度生まれ');
    await expect(page.locator('#sgt-born-type')).toContainText('早生まれ');
  });

  test('4月1日生まれは早生まれ、4月2日生まれは遅生まれ', async ({ page }) => {
    await page.goto('/tools/school-grade-table/');
    await page.locator('#sgt-base-year').fill('2026');
    await page.locator('#sgt-birth-year').fill('2015');
    await page.locator('#sgt-birth-month').fill('4');
    await page.locator('#sgt-birth-day').fill('1');
    await expect(page.locator('#sgt-born-type')).toContainText('早生まれ');
    await page.locator('#sgt-birth-day').fill('2');
    await expect(page.locator('#sgt-born-type')).toContainText('遅生まれ');
    await expect(page.locator('#sgt-grade')).toHaveText('小学5年');
  });

  test('存在しない日付はエラーを表示する', async ({ page }) => {
    await page.goto('/tools/school-grade-table/');
    await page.locator('#sgt-birth-year').fill('2015');
    await page.locator('#sgt-birth-month').fill('2');
    await page.locator('#sgt-birth-day').fill('30');
    await expect(page.locator('#sgt-birth-error')).not.toBeEmpty();
    await expect(page.locator('#sgt-birth-results')).toBeHidden();
  });

  test('学年から生まれ年度を逆引きできる', async ({ page }) => {
    await page.goto('/tools/school-grade-table/');
    await page.locator('#sgt-base-year').fill('2026');
    await page.locator('#sgt-grade-select').selectOption('elementary:1');
    await expect(page.locator('#sgt-rev-cohort')).toHaveText('2019年度生まれ');
    await expect(page.locator('#sgt-rev-range')).toContainText('2019年4月2日');
    await expect(page.locator('#sgt-table tr')).toHaveCount(19);
  });
});

test.describe('School grade chart (English)', () => {
  test('shows the grade and early-born label', async ({ page }) => {
    await page.goto('/en/tools/school-grade-table/');
    await page.locator('#sgt-base-year').fill('2026');
    await page.locator('#sgt-birth-year').fill('2015');
    await page.locator('#sgt-birth-month').fill('2');
    await page.locator('#sgt-birth-day').fill('1');

    await expect(page.locator('#sgt-grade')).toHaveText('Elementary 6');
    await expect(page.locator('#sgt-born-type')).toContainText('Early-born');
  });
});
