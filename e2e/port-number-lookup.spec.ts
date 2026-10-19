import { test, expect } from './helpers/test';

test('ポート番号: 番号の完全一致で検索できる', async ({ page }) => {
  await page.goto('/tools/port-number-lookup/');

  await page.locator('#pnl-query').fill('22');

  const visible = page.locator('#pnl-list > li:not(.hidden)');
  await expect(visible).toHaveCount(1);
  await expect(visible).toContainText('SSH');
});

test('ポート番号: 範囲で検索できる', async ({ page }) => {
  await page.goto('/tools/port-number-lookup/');

  await page.locator('#pnl-query').fill('8000-8100');

  const visible = page.locator('#pnl-list > li:not(.hidden)');
  await expect(visible.first()).toBeVisible();
  await expect(page.locator('#pnl-list > li[data-port="8080"]')).toBeVisible();
  await expect(page.locator('#pnl-list > li[data-port="22"]')).toBeHidden();
});

test('ポート番号: カテゴリとプロトコルで絞り込める', async ({ page }) => {
  await page.goto('/tools/port-number-lookup/');

  await page.locator('#pnl-category [data-category="database"]').click();
  await expect(page.locator('#pnl-list > li[data-port="3306"]')).toBeVisible();
  await expect(page.locator('#pnl-list > li[data-port="22"]')).toBeHidden();

  await page.locator('#pnl-protocol [data-protocol="udp"]').click();
  await expect(page.locator('#pnl-list > li[data-port="3306"]')).toBeHidden();
  await expect(page.locator('#pnl-list > li[data-port="1434"]')).toBeVisible();
});

test('ポート番号: 該当なしのメッセージが表示される', async ({ page }) => {
  await page.goto('/tools/port-number-lookup/');

  await page.locator('#pnl-query').fill('zzzzzzzz');

  await expect(page.locator('#pnl-empty')).toBeVisible();
  await expect(page.locator('#pnl-list > li:not(.hidden)')).toHaveCount(0);
});

test('ポート番号: 英語版でサービス名検索できる', async ({ page }) => {
  await page.goto('/en/tools/port-number-lookup/');

  await page.locator('#pnl-query').fill('postgresql');

  const visible = page.locator('#pnl-list > li:not(.hidden)');
  await expect(visible).toHaveCount(1);
  await expect(visible).toContainText('5432');
});
