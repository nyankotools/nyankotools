import { test, expect } from './helpers/test';

test('タイムゾーン変換: 東京の日時が各地の現地時刻に変換される', async ({
  page,
}) => {
  await page.goto('/tools/timezone-converter/');
  await page.locator('#tz-source').selectOption('Asia/Tokyo');
  await page.locator('#tz-input').fill('2026-10-02T09:00');
  const results = page.locator('#tz-results');
  await expect(results).toContainText('ニューヨーク');
  await expect(
    results.locator('li', { hasText: 'ニューヨーク' }),
  ).toContainText('20:00:00');
  await expect(
    results.locator('li', { hasText: 'ニューヨーク' }),
  ).toContainText('-1日');
  await expect(results.locator('li', { hasText: '協定世界時' })).toContainText(
    '00:00:00',
  );
});

test('タイムゾーン変換: タイムゾーンの追加と削除ができる', async ({ page }) => {
  await page.goto('/tools/timezone-converter/');
  await page.locator('#tz-add-input').fill('Europe/Madrid');
  await page.locator('#tz-add-button').click();
  await expect(page.locator('#tz-results')).toContainText('Europe/Madrid');
  await page.locator('#tz-add-input').fill('Mars/Base');
  await page.locator('#tz-add-button').click();
  await expect(page.locator('#tz-add-error')).not.toBeEmpty();
  await page.getByRole('button', { name: 'Europe/Madridを削除' }).click();
  await expect(page.locator('#tz-results')).not.toContainText('Europe/Madrid');
});

test('タイムゾーン変換: 夏時間で存在しない時刻に注意が出る', async ({
  page,
}) => {
  await page.goto('/tools/timezone-converter/');
  await page.locator('#tz-source').selectOption('America/New_York');
  await page.locator('#tz-input').fill('2026-03-08T02:30');
  await expect(page.locator('#tz-note')).toContainText('存在しない');
});

test('タイムゾーン変換: 秋時間終了で2回ある時刻に注意が出る', async ({
  page,
}) => {
  await page.goto('/tools/timezone-converter/');
  await page.locator('#tz-source').selectOption('America/New_York');
  await page.locator('#tz-input').fill('2026-11-01T01:30');
  await expect(page.locator('#tz-note')).toContainText('2回');
});

test('タイムゾーン変換: English ページが表示される', async ({ page }) => {
  await page.goto('/en/tools/timezone-converter/');
  const display = page.locator('h1');
  await expect(display).toContainText('Time Zone Converter');
  await page.locator('#tz-source').selectOption('Asia/Tokyo');
  await page.locator('#tz-input').fill('2026-10-02T09:00');
  const results = page.locator('#tz-results');
  await expect(results).toContainText('New York');
  await expect(results.locator('li', { hasText: 'New York' })).toContainText(
    '20:00:00',
  );
});
