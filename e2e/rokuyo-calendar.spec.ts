import { test, expect } from './helpers/test';

test.describe('六曜・旧暦カレンダー', () => {
  test('2024年2月は旧正月（2/10）が先勝・旧暦1/1で表示される', async ({
    page,
  }) => {
    await page.goto('/tools/rokuyo-calendar/');
    await page.locator('#rk-year').fill('2024');
    await page.locator('#rk-month').selectOption('2');
    await expect(page.locator('#rk-output caption')).toHaveText('2024年2月');
    const cell = page.locator('#rk-output td', { hasText: /^10先勝1\/1/ });
    await expect(cell).toHaveCount(1);
    await expect(page.locator('#rk-lists')).toContainText(
      '2024年の旧正月（旧暦1月1日）は 2024年2月10日',
    );
  });

  test('色付けする六曜を選ぶとその日だけ背景が付く', async ({ page }) => {
    await page.goto('/tools/rokuyo-calendar/');
    await page.locator('#rk-year').fill('2024');
    await page.locator('#rk-month').selectOption('10');
    await page.locator('#rk-highlight').selectOption('taian');
    const marked = await page.locator('#rk-output td.bg-amber-100').count();
    expect(marked).toBeGreaterThanOrEqual(4);
    await page.locator('#rk-highlight').selectOption('');
    await expect(page.locator('#rk-output td.bg-amber-100')).toHaveCount(0);
  });

  test('旧暦の表示をオフにできる', async ({ page }) => {
    await page.goto('/tools/rokuyo-calendar/');
    await page.locator('#rk-year').fill('2024');
    await page.locator('#rk-month').selectOption('2');
    await page.locator('#rk-lunar').uncheck();
    await expect(page.locator('#rk-output')).not.toContainText('1/1');
  });

  test('日付入力で六曜・旧暦・節気を調べられる（閏月・春分）', async ({
    page,
  }) => {
    await page.goto('/tools/rokuyo-calendar/');
    await page.locator('#rk-lookup-date').fill('2025-07-25');
    await expect(page.locator('#rk-lookup-result')).toContainText(
      '旧暦閏6月1日、六曜は「赤口」',
    );
    await page.locator('#rk-lookup-date').fill('2024-03-20');
    await expect(page.locator('#rk-lookup-result')).toContainText('春分');
  });

  test('年の範囲外はエラーになり、範囲内に直すと復帰する', async ({ page }) => {
    await page.goto('/tools/rokuyo-calendar/');
    await page.locator('#rk-year').fill('2101');
    await expect(page.locator('#rk-error')).toContainText('1900〜2100');
    await expect(page.locator('#rk-output table')).toHaveCount(0);
    await page.locator('#rk-year').fill('2100');
    await expect(page.locator('#rk-error')).toHaveText('');
    await expect(page.locator('#rk-output table')).toHaveCount(1);
  });

  test('英語版でも表示できる', async ({ page }) => {
    await page.goto('/en/tools/rokuyo-calendar/');
    await page.locator('#rk-year').fill('2025');
    await page.locator('#rk-month').selectOption('7');
    await expect(
      page.locator('#rk-output td', { hasText: 'L6/1' }),
    ).toHaveCount(1);
    await page.locator('#rk-lookup-date').fill('2025-07-25');
    await expect(page.locator('#rk-lookup-result')).toContainText(
      'lunar leap month 6, day 1',
    );
  });
});
