import { test, expect } from './helpers/test';

async function fillDate(
  page: import('@playwright/test').Page,
  y: string,
  m: string,
  d: string,
) {
  await page.locator('#weekno-year').fill(y);
  await page.locator('#weekno-month').fill(m);
  await page.locator('#weekno-day').fill(d);
}

test.describe('週番号計算（日本語版）', () => {
  test('年末年始の境界で正しいISO週番号を表示する', async ({ page }) => {
    await page.goto('/tools/week-number-calculator/');
    await fillDate(page, '2021', '1', '1');
    await expect(page.locator('#weekno-r-week')).toHaveText(
      '第53週（2020-W53）',
    );
    await expect(page.locator('#weekno-r-isoyear')).toHaveText('2020');
    await expect(page.locator('#weekno-r-weekday')).toHaveText('金曜日');
    await expect(page.locator('#weekno-r-dayofyear')).toHaveText('1日目');

    await fillDate(page, '2024', '12', '30');
    await expect(page.locator('#weekno-r-week')).toHaveText(
      '第1週（2025-W01）',
    );
  });

  test('存在しない日付はエラーになる', async ({ page }) => {
    await page.goto('/tools/week-number-calculator/');
    await fillDate(page, '2023', '2', '30');
    await expect(page.locator('#weekno-error')).toHaveText(
      '存在しない日付です',
    );
    await expect(page.locator('#weekno-result')).toBeHidden();
  });

  test('今日ボタンで入力欄が埋まり結果が出る', async ({ page }) => {
    await page.goto('/tools/week-number-calculator/');
    await fillDate(page, '2000', '1', '1');
    await page.locator('#weekno-today-button').click();
    const year = await page.locator('#weekno-year').inputValue();
    expect(Number(year)).toBeGreaterThanOrEqual(2025);
    await expect(page.locator('#weekno-result')).toBeVisible();
  });

  test('年と週番号から日付範囲を逆引きできる', async ({ page }) => {
    await page.goto('/tools/week-number-calculator/');
    await page.locator('#weekno-rev-year').fill('2025');
    await page.locator('#weekno-rev-week').fill('1');
    await expect(page.locator('#weekno-rev-result')).toHaveText(
      '2024年12月30日（月）〜 2025年1月5日（日）',
    );

    await page.locator('#weekno-rev-year').fill('2024');
    await page.locator('#weekno-rev-week').fill('53');
    await expect(page.locator('#weekno-rev-error')).not.toBeEmpty();
    await expect(page.locator('#weekno-rev-result')).toBeEmpty();
  });
});

test.describe('Week Number Calculator (English)', () => {
  test('英語版で計算できる', async ({ page }) => {
    await page.goto('/en/tools/week-number-calculator/');
    await expect(page.locator('main h1')).toHaveText(
      'ISO Week Number Calculator',
    );
    await fillDate(page, '2020', '12', '31');
    await expect(page.locator('#weekno-r-week')).toHaveText(
      'Week 53 (2020-W53)',
    );
    await expect(page.locator('#weekno-r-weekday')).toHaveText('Thursday');

    await page.locator('#weekno-rev-year').fill('2020');
    await page.locator('#weekno-rev-week').fill('53');
    await expect(page.locator('#weekno-rev-result')).toHaveText(
      '2020-12-28 (Mon) to 2021-01-03 (Sun)',
    );
  });
});
