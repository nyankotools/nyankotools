import { test, expect } from './helpers/test';

test.describe('カレンダー生成', () => {
  test('2026年5月の祝日一覧に振替休日が含まれる（4日分）', async ({ page }) => {
    await page.goto('/tools/calendar-generator/');
    await page.locator('#cal-year').fill('2026');
    await page.locator('#cal-month').selectOption('5');
    await expect(page.locator('#cal-holidays')).toBeChecked();
    // 5/3(憲法)・5/4(みどり)・5/5(こどもの日)・5/6(振替休日)
    await expect(page.locator('#cal-output li')).toHaveCount(4);
    await expect(page.locator('#cal-output li').last()).toContainText(
      '振替休日',
    );
  });

  test('祝日をオフにすると祝日一覧と赤い祝日表示が消える', async ({ page }) => {
    await page.goto('/tools/calendar-generator/');
    await page.locator('#cal-year').fill('2026');
    await page.locator('#cal-month').selectOption('10');
    await expect(page.locator('#cal-output li')).toHaveCount(1);
    await page.locator('#cal-holidays').uncheck();
    await expect(page.locator('#cal-output li')).toHaveCount(0);
  });

  test('年間表示は12か月分の見出しと祝日が表示される', async ({ page }) => {
    await page.goto('/tools/calendar-generator/');
    await page.locator('#cal-year').fill('2026');
    await page.locator('#cal-mode').selectOption('year');
    await expect(page.locator('#cal-output h2').first()).toHaveText('2026年');
    await expect(page.locator('#cal-output caption')).toHaveCount(12);
    await expect(page.locator('#cal-output caption').first()).toHaveText('1月');
    // 祝日の一覧は年間表示では出ない（月間のみ）
    await expect(page.locator('#cal-output > div > h2')).toHaveCount(0);
  });

  test('年の境界: 1900と2100は表示でき、2101はエラーになる', async ({
    page,
  }) => {
    await page.goto('/tools/calendar-generator/');
    await page.locator('#cal-month').selectOption('1');
    await page.locator('#cal-year').fill('1900');
    await expect(page.locator('#cal-error')).toBeEmpty();
    await expect(page.locator('#cal-output caption')).toHaveText('1900年1月');
    await page.locator('#cal-year').fill('2100');
    await expect(page.locator('#cal-error')).toBeEmpty();
    await expect(page.locator('#cal-output caption')).toHaveText('2100年1月');
    await page.locator('#cal-year').fill('2101');
    await expect(page.locator('#cal-error')).toContainText('2100');
    await expect(page.locator('#cal-output table')).toHaveCount(0);
  });

  test('印刷時はカレンダーだけが残り、見出し・使い方・FAQは隠れる', async ({
    page,
  }) => {
    await page.goto('/tools/calendar-generator/');
    await page.locator('#cal-year').fill('2026');
    await page.locator('#cal-month').selectOption('10');
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('h1')).toBeHidden();
    await expect(page.locator('[data-howto]')).toBeHidden();
    await expect(page.locator('[data-faq]')).toBeHidden();
    await expect(page.locator('#cal-year')).toBeHidden();
    await expect(page.locator('#cal-print-button')).toBeHidden();
    await expect(page.locator('#cal')).toBeVisible();
    await expect(page.locator('#cal-output table')).toBeVisible();
    await expect(page.locator('#cal-output caption')).toHaveText('2026年10月');
  });

  test('英語版の印刷時もカレンダーだけが残る', async ({ page }) => {
    await page.goto('/en/tools/calendar-generator/');
    await page.locator('#cal-year').fill('2026');
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('h1')).toBeHidden();
    await expect(page.locator('[data-howto]')).toBeHidden();
    await expect(page.locator('[data-faq]')).toBeHidden();
    await expect(page.locator('#cal-output table').first()).toBeVisible();
  });

  test('2026年10月の月間カレンダーと祝日が表示される', async ({ page }) => {
    await page.goto('/tools/calendar-generator/');
    await page.locator('#cal-year').fill('2026');
    await page.locator('#cal-month').selectOption('10');

    await expect(page.locator('#cal-output caption')).toHaveText('2026年10月');
    // 10月は31日まで
    await expect(page.locator('#cal-output tbody td span')).toHaveCount(31);
    // 10月12日はスポーツの日
    await expect(page.locator('#cal-output li')).toHaveCount(1);
    await expect(page.locator('#cal-output li')).toContainText('スポーツの日');
  });

  test('月曜始まりに切り替えると先頭の曜日が変わる', async ({ page }) => {
    await page.goto('/tools/calendar-generator/');
    await page.locator('#cal-year').fill('2026');
    await expect(page.locator('#cal-output thead th').first()).toHaveText('日');
    await page.locator('#cal-week-start').selectOption('1');
    await expect(page.locator('#cal-output thead th').first()).toHaveText('月');
  });

  test('週番号を表示できる', async ({ page }) => {
    await page.goto('/tools/calendar-generator/');
    await page.locator('#cal-year').fill('2026');
    await page.locator('#cal-month').selectOption('1');
    await page.locator('#cal-week-numbers').check();
    await expect(page.locator('#cal-output thead th').first()).toHaveText('週');
    // 2026年1月1日（木）は第1週
    await expect(
      page.locator('#cal-output tbody tr').first().locator('td').first(),
    ).toHaveText('1');
  });

  test('年間表示では12か月分のテーブルが並ぶ', async ({ page }) => {
    await page.goto('/tools/calendar-generator/');
    await page.locator('#cal-year').fill('2026');
    await page.locator('#cal-mode').selectOption('year');
    await expect(page.locator('#cal-output table')).toHaveCount(12);
    await expect(page.locator('#cal-month-field')).toBeHidden();
  });

  test('範囲外の年はエラーを表示する', async ({ page }) => {
    await page.goto('/tools/calendar-generator/');
    await page.locator('#cal-year').fill('1800');
    await expect(page.locator('#cal-error')).toContainText('1900');
    await expect(page.locator('#cal-output table')).toHaveCount(0);
  });

  test('英語版は祝日がオフで初期表示される', async ({ page }) => {
    await page.goto('/en/tools/calendar-generator/');
    await page.locator('#cal-year').fill('2026');
    await page.locator('#cal-month').selectOption('10');
    await expect(page.locator('#cal-output caption')).toHaveText(
      'October 2026',
    );
    await expect(page.locator('#cal-holidays')).not.toBeChecked();
    await expect(page.locator('#cal-output li')).toHaveCount(0);
  });
});

test.describe('カレンダー生成: 今日の印', () => {
  test('今日の日付の印をオン・オフできる', async ({ page }) => {
    await page.goto('/tools/calendar-generator/');
    // 初期表示は今日の年月・印あり
    const mark = page.locator('#cal-output tbody td span.rounded-full');
    await expect(mark).toHaveCount(1);
    await expect(page.locator('#cal-today')).toBeChecked();

    await page.locator('#cal-today').uncheck();
    await expect(mark).toHaveCount(0);

    await page.locator('#cal-today').check();
    await expect(mark).toHaveCount(1);
  });
});
