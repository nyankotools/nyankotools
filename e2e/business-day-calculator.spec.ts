import { test, expect } from './helpers/test';

test('営業日計算: ゴールデンウィークをまたぐ営業日後を計算できる', async ({
  page,
}) => {
  await page.goto('/tools/business-day-calculator/');
  await page.locator('#bd-add-start').fill('2026-05-01');
  await page.locator('#bd-add-days').fill('1');
  await expect(page.locator('#bd-add-result')).toContainText('2026年5月7日');
});

test('営業日計算: 祝日を営業日にするオプションが効く', async ({ page }) => {
  await page.goto('/tools/business-day-calculator/');
  await page.locator('#bd-count-start').fill('2026-05-01');
  await page.locator('#bd-count-end').fill('2026-05-07');
  await expect(page.locator('#bd-count-business')).toHaveText('2日');
  await page.locator('#bd-holidays').uncheck();
  await expect(page.locator('#bd-count-business')).toHaveText('5日');
});

test('営業日計算: 祝日一覧に振替休日と国民の休日が表示される', async ({
  page,
}) => {
  await page.goto('/tools/business-day-calculator/');
  await page.locator('#bd-year').fill('2026');
  const list = page.locator('#bd-holiday-list');
  await expect(list).toContainText('振替休日');
  await expect(list).toContainText('国民の休日');
  await page.locator('#bd-year').fill('1999');
  await expect(page.locator('#bd-year-error')).not.toBeEmpty();
});

test('Business days: English page works', async ({ page }) => {
  await page.goto('/en/tools/business-day-calculator/');
  await page.locator('#bd-add-start').fill('2026-05-01');
  await page.locator('#bd-add-days').fill('1');
  await expect(page.locator('#bd-add-result')).toContainText('May 7, 2026');
});

test('営業日計算: 2019年の特例（退位・即位）で祝日が正しく計算される', async ({
  page,
}) => {
  await page.goto('/tools/business-day-calculator/');
  await page.locator('#bd-year').fill('2019');
  const list = page.locator('#bd-holiday-list');
  await expect(list).toContainText('退位');
  await expect(list).toContainText('即位');
  await expect(list).toContainText('天皇の即位');
});
