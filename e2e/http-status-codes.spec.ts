import { test, expect } from './helpers/test';

test('HTTPステータスコード: コード番号で検索できる', async ({ page }) => {
  await page.goto('/tools/http-status-codes/');

  await page.locator('#hsc-query').fill('404');

  await expect(page.locator('#hsc-list > li:not(.hidden)')).toHaveCount(1);
  await expect(page.locator('#hsc-list > li:not(.hidden)')).toContainText(
    'Not Found',
  );
});

test('HTTPステータスコード: 分類ボタンで絞り込める', async ({ page }) => {
  await page.goto('/tools/http-status-codes/');

  await page.locator('#hsc-category [data-category="5xx"]').click();

  const visible = page.locator('#hsc-list > li:not(.hidden)');
  await expect(visible.first()).toContainText('500');
  await expect(
    page.locator('#hsc-list > li[data-category="4xx"]').first(),
  ).toBeHidden();
  await expect(page.locator('#hsc-count')).not.toHaveText('');
});

test('HTTPステータスコード: 該当なしのメッセージが表示される', async ({
  page,
}) => {
  await page.goto('/tools/http-status-codes/');

  await page.locator('#hsc-query').fill('zzzzzzzz');

  await expect(page.locator('#hsc-empty')).toBeVisible();
  await expect(page.locator('#hsc-list > li:not(.hidden)')).toHaveCount(0);
});

test('HTTPステータスコード: 英語版でキーワード検索できる', async ({ page }) => {
  await page.goto('/en/tools/http-status-codes/');

  await page.locator('#hsc-query').fill('gateway');

  await expect(page.locator('#hsc-list > li:not(.hidden)')).toHaveCount(2);
});
