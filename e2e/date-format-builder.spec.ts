import { test, expect } from './helpers/test';

test('日付フォーマット: 例文から各言語の書式が生成される', async ({ page }) => {
  await page.goto('/tools/date-format-builder/');

  await page.locator('#dfb-sample').fill('2026-10-19T15:04:05+09:00');

  await expect(page.locator('#dfb-sample-out-strftime')).toHaveText(
    '%Y-%m-%dT%H:%M:%S%:z',
  );
  await expect(page.locator('#dfb-sample-out-java')).toHaveText(
    "yyyy-MM-dd'T'HH:mm:ssXXX",
  );
  await expect(page.locator('#dfb-sample-out-php')).toHaveText(
    'Y-m-d\\TH:i:sP',
  );
});

test('日付フォーマット: 書式文字列を別の言語へ変換できる', async ({ page }) => {
  await page.goto('/tools/date-format-builder/');

  await page.locator('#dfb-source').selectOption('strftime');
  await page.locator('#dfb-format').fill('%d/%m/%Y %I:%M %p');

  await expect(page.locator('#dfb-convert-out-java')).toHaveText(
    'dd/MM/yyyy hh:mm a',
  );
  await expect(page.locator('#dfb-convert-out-moment')).toHaveText(
    'DD/MM/YYYY hh:mm A',
  );
  await expect(page.locator('#dfb-preview')).not.toBeEmpty();
});

test('日付フォーマット: 対応のない項目は警告が出る', async ({ page }) => {
  await page.goto('/tools/date-format-builder/');

  await page.locator('#dfb-source').selectOption('strftime');
  await page.locator('#dfb-format').fill('%Y-%j');

  await expect(page.locator('#dfb-convert-warnings li')).not.toHaveCount(0);
});

test('日付フォーマット: コピーできる', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/tools/date-format-builder/');

  await page.locator('#dfb-sample-copy-java').click();

  await expect(page.locator('#dfb-status')).not.toBeEmpty();
});

test('日付フォーマット: 英語版で例文から生成できる', async ({ page }) => {
  await page.goto('/en/tools/date-format-builder/');

  await page.locator('#dfb-sample').fill('Mon, Oct 19, 2026 3:04 PM');

  await expect(page.locator('#dfb-sample-out-java')).toHaveText(
    'EEE, MMM d, yyyy h:mm a',
  );
});
