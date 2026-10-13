import { test, expect } from './helpers/test';

test.describe('MIMEタイプ検索（日本語版）', () => {
  test('拡張子からMIMEタイプを引ける', async ({ page }) => {
    await page.goto('/tools/mime-type-lookup/');

    await page.locator('#mime-input').fill('.PNG');

    await expect(page.locator('#mime-message')).toContainText('拡張子');
    await expect(page.locator('#mime-results tbody tr').first()).toContainText(
      'image/png',
    );
  });

  test('MIMEタイプから拡張子を引ける（Content-Type形式も可）', async ({
    page,
  }) => {
    await page.goto('/tools/mime-type-lookup/');

    await page
      .locator('#mime-input')
      .fill('Content-Type: image/jpeg; charset=binary');

    const row = page.locator('#mime-results tbody tr').first();
    await expect(row).toContainText('.jpg, .jpeg');
  });

  test('分類で絞り込める', async ({ page }) => {
    await page.goto('/tools/mime-type-lookup/');

    await page.locator('#mime-category').selectOption('font');

    const rows = page.locator('#mime-results tbody tr');
    await expect(rows.first()).toContainText('font/');
    expect(await rows.count()).toBeGreaterThanOrEqual(5);
  });

  test('見つからない場合はメッセージを表示する', async ({ page }) => {
    await page.goto('/tools/mime-type-lookup/');

    await page.locator('#mime-input').fill('zzzzqq');

    await expect(page.locator('#mime-message')).toContainText(
      '見つかりませんでした',
    );
  });
});

test.describe('MIME Type Lookup (English)', () => {
  test('looks up extensions from a MIME type', async ({ page }) => {
    await page.goto('/en/tools/mime-type-lookup/');

    await page.locator('#mime-input').fill('application/pdf');

    await expect(page.locator('#mime-results tbody tr').first()).toContainText(
      '.pdf',
    );
  });
});
