import { test, expect } from './helpers/test';

test.describe('ICSファイル作成', () => {
  test('タイトル未入力ではエラーを出さず結果も出ない', async ({ page }) => {
    await page.goto('/tools/ics-generator/');
    await expect(page.locator('#ics-result')).toBeHidden();
    await expect(page.locator('#ics-error')).toBeEmpty();
  });

  test('予定を入力するとICSとGoogleリンクが生成される', async ({ page }) => {
    await page.goto('/tools/ics-generator/');
    await page.locator('#ics-summary').fill('定例会議');
    await page.locator('#ics-start-date').fill('2026-10-21');
    await page.locator('#ics-start-time').fill('10:00');
    await page.locator('#ics-end-date').fill('2026-10-21');
    await page.locator('#ics-end-time').fill('11:00');
    await page.locator('#ics-tz').fill('Asia/Tokyo');
    await expect(page.locator('#ics-result')).toBeVisible();
    const ics = page.locator('#ics-preview');
    await expect(ics).toHaveValue(/SUMMARY:定例会議/);
    await expect(ics).toHaveValue(/DTSTART;TZID=Asia\/Tokyo:20261021T100000/);
    await expect(page.locator('#ics-google-url')).toHaveValue(
      /calendar\.google\.com\/calendar\/render\?action=TEMPLATE/,
    );
  });

  test('繰り返し・リマインダー・終日が反映される', async ({ page }) => {
    await page.goto('/tools/ics-generator/');
    await page.locator('#ics-summary').fill('朝会');
    await page.locator('#ics-all-day').check();
    await page.locator('#ics-start-date').fill('2026-10-21');
    await page.locator('#ics-end-date').fill('2026-10-21');
    await page.locator('#ics-freq').selectOption('weekly');
    await page.locator('#ics-end-type').selectOption('count');
    await page.locator('#ics-count').fill('4');
    await page.locator('#ics-reminder').check();
    await page.locator('#ics-reminder-unit').selectOption('60');
    await page.locator('#ics-reminder-value').fill('2');
    const ics = page.locator('#ics-preview');
    await expect(ics).toHaveValue(/DTSTART;VALUE=DATE:20261021/);
    await expect(ics).toHaveValue(/DTEND;VALUE=DATE:20261022/);
    await expect(ics).toHaveValue(/RRULE:FREQ=WEEKLY;COUNT=4/);
    await expect(ics).toHaveValue(/TRIGGER:-PT2H/);
  });

  test('終了が開始より前だとエラーになる', async ({ page }) => {
    await page.goto('/tools/ics-generator/');
    await page.locator('#ics-summary').fill('x');
    await page.locator('#ics-start-date').fill('2026-10-21');
    await page.locator('#ics-end-date').fill('2026-10-20');
    await expect(page.locator('#ics-error')).toContainText('終了');
    await expect(page.locator('#ics-result')).toBeHidden();
  });

  test('.icsをダウンロードできる', async ({ page }) => {
    await page.goto('/tools/ics-generator/');
    await page.locator('#ics-summary').fill('会議');
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#ics-download-button').click(),
    ]);
    expect(download.suggestedFilename()).toBe('会議.ics');
  });

  test('英語版でも生成できる', async ({ page }) => {
    await page.goto('/en/tools/ics-generator/');
    await page.locator('#ics-summary').fill('Meeting');
    await expect(page.locator('#ics-preview')).toHaveValue(/BEGIN:VCALENDAR/);
    await expect(page.locator('#ics-download-button')).toHaveText(
      'Download .ics',
    );
  });
});
