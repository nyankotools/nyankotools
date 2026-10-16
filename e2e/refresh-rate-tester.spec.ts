import { test, expect } from './helpers/test';
import { blockAnalytics } from './helpers/block-analytics';

test.describe('リフレッシュレート測定', () => {
  test('日本語版: 自動で測定が始まりHzとサンプル数が表示される', async ({
    page,
  }) => {
    await blockAnalytics(page);
    await page.goto('/tools/refresh-rate-tester/');
    await expect(page.locator('main h1')).toHaveText('リフレッシュレート測定');
    await expect(page.locator('#rrt-unit')).toBeVisible();
    await expect(page.locator('#rrt-hz')).toHaveText(/^\d+(\.\d)?$/);
    await expect(page.locator('#rrt-stat-samples')).not.toHaveText('-');
  });

  test('一時停止・再開・リセットで状態表示が切り替わる', async ({ page }) => {
    await blockAnalytics(page);
    await page.goto('/tools/refresh-rate-tester/');
    await expect(page.locator('#rrt-unit')).toBeVisible();

    await page.locator('#rrt-pause').click();
    await expect(page.locator('#rrt-status')).toHaveText('一時停止中');
    await page.locator('#rrt-pause').click();
    await expect(page.locator('#rrt-status')).toHaveText('測定中');

    await page.locator('#rrt-reset').click();
    await expect(page.locator('#rrt-unit')).toBeVisible();
  });

  test('英語版: 見出しが英語で表示され測定される', async ({ page }) => {
    await blockAnalytics(page);
    await page.goto('/en/tools/refresh-rate-tester/');
    await expect(page.locator('main h1')).toHaveText('Refresh Rate Test');
    await expect(page.locator('#rrt-unit')).toBeVisible();
  });

  for (const [label, path] of [
    ['日本語版', '/tools/refresh-rate-tester/'],
    ['英語版', '/en/tools/refresh-rate-tester/'],
  ] as const) {
    test(`${label}: コンソールエラー・未捕捉例外が出ない`, async ({ page }) => {
      await blockAnalytics(page);
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      page.on('pageerror', (err) => errors.push(err.message));
      await page.goto(path);
      await expect(page.locator('#rrt-stat-samples')).not.toHaveText('-');
      expect(errors).toEqual([]);
    });
  }
});
