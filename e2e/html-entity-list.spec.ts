import { test, expect } from './helpers/test';

test.describe('HTMLエンティティ一覧（日本語版）', () => {
  test('一覧が表示され、名前・数値参照・カテゴリで絞り込める', async ({
    page,
  }) => {
    await page.goto('/tools/html-entity-list/');
    await expect(page.locator('main h1')).toContainText('HTMLエンティティ一覧');

    const items = page.locator('#hel-list li');
    expect(await items.count()).toBeGreaterThan(300);

    await page.locator('#hel-search').fill('&copy;');
    await expect(items.first()).toContainText('&copy;');

    await page.locator('#hel-search').fill('&#xA9;');
    await expect(items).toHaveCount(1);
    await expect(items.first()).toContainText('&copy;');

    await page.locator('#hel-search').fill('');
    await page.locator('#hel-category').selectOption('greek');
    const greek = await items.count();
    expect(greek).toBeGreaterThan(40);
    expect(greek).toBeLessThan(80);
  });

  test('一致なしのとき案内を表示する', async ({ page }) => {
    await page.goto('/tools/html-entity-list/');
    await page.locator('#hel-search').fill('zzzzqqq');
    await expect(page.locator('#hel-empty')).toBeVisible();
    await expect(page.locator('#hel-list li')).toHaveCount(0);
  });

  test('ボタンを押すとコピーされ、クリップボードに入る', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/html-entity-list/');
    await page.locator('#hel-search').fill('&#169;');
    await page.locator('#hel-list button[data-copy="&#xA9;"]').click();
    await expect(page.locator('#hel-status')).toContainText('&#xA9;');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      '&#xA9;',
    );
  });
});

test.describe('HTML Entity List (English)', () => {
  test('searches by character', async ({ page }) => {
    await page.goto('/en/tools/html-entity-list/');
    await expect(page.locator('main h1')).toContainText('HTML Entity List');
    await page.locator('#hel-search').fill('€');
    await expect(page.locator('#hel-list li')).toHaveCount(1);
    await expect(page.locator('#hel-list li')).toContainText('&euro;');
  });
});
