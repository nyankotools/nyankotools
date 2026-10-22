import { test, expect } from './helpers/test';

test.describe('CSSカラー名一覧（日本語版）', () => {
  test('148色が表示され、色名検索・系統絞り込みができる', async ({ page }) => {
    await page.goto('/tools/css-color-names/');
    await expect(page.locator('main h1')).toContainText('CSSカラー名一覧');

    const items = page.locator('#ccn-list li');
    await expect(items).toHaveCount(148);

    await page.locator('#ccn-search').fill('rebecca');
    await expect(items).toHaveCount(1);
    await expect(
      page.locator('#ccn-list button[data-name="rebeccapurple"]'),
    ).toContainText('#663399');

    await page.locator('#ccn-search').fill('');
    await page.locator('#ccn-group').selectOption('blue');
    const blueCount = await items.count();
    expect(blueCount).toBeGreaterThan(0);
    expect(blueCount).toBeLessThan(148);
  });

  test('一致なしのとき案内を表示する', async ({ page }) => {
    await page.goto('/tools/css-color-names/');
    await page.locator('#ccn-search').fill('zzzzqqq');
    await expect(page.locator('#ccn-empty')).toBeVisible();
    await expect(page.locator('#ccn-list li')).toHaveCount(0);
  });

  test('色カードを押すと選んだ形式でコピーされる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/css-color-names/');
    await page.locator('#ccn-search').fill('tomato');
    await page.locator('#ccn-list button').first().click();
    await expect(page.locator('#ccn-status')).toContainText('tomato');

    await page.locator('#ccn-mode').selectOption('hex');
    await page.locator('#ccn-list button').first().click();
    await expect(page.locator('#ccn-status')).toContainText('#ff6347');
  });
});

test.describe('CSS Color Names (English)', () => {
  test('searches by name with spaces', async ({ page }) => {
    await page.goto('/en/tools/css-color-names/');
    await expect(page.locator('main h1')).toContainText('CSS Color Names');
    await page.locator('#ccn-search').fill('dark slate blue');
    await expect(
      page.locator('#ccn-list button[data-name="darkslateblue"]'),
    ).toBeVisible();
  });
});
