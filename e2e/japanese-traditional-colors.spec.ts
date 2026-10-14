import { test, expect } from './helpers/test';

test.describe('日本の伝統色・和色一覧（日本語版）', () => {
  test('一覧が表示され、色名で検索・系統で絞り込みできる', async ({ page }) => {
    await page.goto('/tools/japanese-traditional-colors/');
    await expect(page.locator('main h1')).toContainText('日本の伝統色');

    const items = page.locator('#jtc-list li');
    expect(await items.count()).toBeGreaterThan(200);

    await page.locator('#jtc-search').fill('さくら');
    await expect(
      page.locator('#jtc-list button[data-hex="#fef4f4"]'),
    ).toBeVisible();

    await page.locator('#jtc-search').fill('');
    await page.locator('#jtc-group').selectOption('blue');
    const blueCount = await items.count();
    expect(blueCount).toBeGreaterThan(0);
    expect(blueCount).toBeLessThan(150);
  });

  test('一致なしのとき案内を表示する', async ({ page }) => {
    await page.goto('/tools/japanese-traditional-colors/');
    await page.locator('#jtc-search').fill('zzzzqqq');
    await expect(page.locator('#jtc-empty')).toBeVisible();
    await expect(page.locator('#jtc-list li')).toHaveCount(0);
  });

  test('色カードを押すとHEXがコピーされた旨が表示される', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/japanese-traditional-colors/');
    await page.locator('#jtc-search').fill('#e60012');
    await page.locator('#jtc-list button').first().click();
    await expect(page.locator('#jtc-status')).toContainText('#e60012');
  });
});

test.describe('Japanese Traditional Colors (English)', () => {
  test('searches by romaji', async ({ page }) => {
    await page.goto('/en/tools/japanese-traditional-colors/');
    await expect(page.locator('main h1')).toContainText(
      'Japanese Traditional Colors',
    );
    await page.locator('#jtc-search').fill('sakura');
    await expect(
      page.locator('#jtc-list button[data-hex="#fef4f4"]'),
    ).toBeVisible();
  });
});
