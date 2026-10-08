import { test, expect } from './helpers/test';

test.describe('席替え・順番決めツール', () => {
  test('座席表を作ると行×列のセルが並び、固定席が守られる', async ({
    page,
  }) => {
    await page.goto('/tools/seat-shuffler/');
    await page.locator('#ss-fixed').fill('青木@1,1');
    await page.locator('#ss-generate-button').click();
    await expect(page.locator('#ss-grid > div')).toHaveCount(12);
    await expect(page.locator('#ss-grid > div').first()).toHaveText('青木');
  });

  test('席が人数より多いと空席が表示される', async ({ page }) => {
    await page.goto('/tools/seat-shuffler/');
    await page.locator('#ss-rows').fill('4');
    await page.locator('#ss-generate-button').click();
    await expect(
      page.locator('#ss-grid > div', { hasText: '空席' }),
    ).toHaveCount(4);
  });

  test('席が足りないとエラーを表示する', async ({ page }) => {
    await page.goto('/tools/seat-shuffler/');
    await page.locator('#ss-rows').fill('1');
    await page.locator('#ss-generate-button').click();
    await expect(page.locator('#ss-error')).toContainText('席が足りません');
    await expect(page.locator('#ss-result')).toBeHidden();
  });

  test('満たせない離したい組み合わせは明示エラーになる', async ({ page }) => {
    await page.goto('/tools/seat-shuffler/');
    await page.locator('#ss-names').fill('A\nB');
    await page.locator('#ss-rows').fill('1');
    await page.locator('#ss-cols').fill('2');
    await page.locator('#ss-pairs').fill('A,B');
    await page.locator('#ss-generate-button').click();
    await expect(page.locator('#ss-error')).toContainText('5000回');
  });

  test('発表順モードでは番号付きの一覧が出てコピーできる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/seat-shuffler/');
    await page.locator('#ss-mode [data-mode="order"]').click();
    await expect(page.locator('#ss-seat-options')).toBeHidden();
    await page.locator('#ss-names').fill('A\nB\nC');
    await page.locator('#ss-generate-button').click();
    await expect(page.locator('#ss-order-view li')).toHaveCount(3);
    await page.locator('#ss-copy-button').click();
    await expect(page.locator('#ss-status')).toHaveText('コピーしました。');
    const text = await page.evaluate(() => navigator.clipboard.readText());
    // 番号付きで各行が出ており、計3行
    expect(text).toMatch(/^1\. [^\n]+\n2\. [^\n]+\n3\. [^\n]+$/);
  });

  test('英語ページで動作する', async ({ page }) => {
    await page.goto('/en/tools/seat-shuffler/');
    await page.locator('#ss-generate-button').click();
    await expect(page.locator('#ss-grid > div')).toHaveCount(12);
    await expect(page.getByText('Front of the room').first()).toBeVisible();
  });

  test('最大サイズ（10×10）の座席表が作れる', async ({ page }) => {
    await page.goto('/tools/seat-shuffler/');
    // デフォルト名簿は12人なので、10×10の座席表を作ると12人が配置され、88席が空席
    await page.locator('#ss-rows').fill('10');
    await page.locator('#ss-cols').fill('10');
    await page.locator('#ss-generate-button').click();
    await expect(page.locator('#ss-grid > div')).toHaveCount(100);
    await expect(
      page.locator('#ss-grid > div', { hasText: '空席' }),
    ).toHaveCount(88);
  });

  test('固定席は指定通りに配置される', async ({ page }) => {
    await page.goto('/tools/seat-shuffler/');
    await page.locator('#ss-names').fill('Alice\nBob\nCharlie');
    await page.locator('#ss-rows').fill('3');
    await page.locator('#ss-cols').fill('1');
    await page.locator('#ss-fixed').fill('Bob@2,1');
    await page.locator('#ss-generate-button').click();
    // Bobは2行目に固定される
    const cells = page.locator('#ss-grid > div');
    await expect(cells.nth(1)).toHaveText('Bob');
  });

  test('離したいペアが満たせないときはエラーになる', async ({ page }) => {
    await page.goto('/tools/seat-shuffler/');
    // 3人が3×1で一列に並ぶ場合、隣同士の両方は避けられない
    await page.locator('#ss-names').fill('A\nB\nC');
    await page.locator('#ss-rows').fill('3');
    await page.locator('#ss-cols').fill('1');
    await page.locator('#ss-pairs').fill('A,B\nB,C');
    await page.locator('#ss-generate-button').click();
    await expect(page.locator('#ss-error')).toContainText('5000回');
  });
});
