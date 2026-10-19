import { test, expect } from './helpers/test';

test('正規表現パターン集: キーワードで絞り込める', async ({ page }) => {
  await page.goto('/tools/regex-pattern-library/');

  await page.locator('#rpl-query').fill('マイナンバー');

  const visible = page.locator('#rpl-list > li:not(.hidden)');
  await expect(visible).toHaveCount(1);
  await expect(visible).toHaveAttribute('data-id', 'my-number');
});

test('正規表現パターン集: カテゴリで絞り込める', async ({ page }) => {
  await page.goto('/tools/regex-pattern-library/');

  await page.locator('#rpl-category [data-category="datetime"]').click();

  await expect(
    page.locator('#rpl-list > li[data-id="date-iso"]'),
  ).toBeVisible();
  await expect(page.locator('#rpl-list > li[data-id="email"]')).toBeHidden();
});

test('正規表現パターン集: 該当なしのメッセージが表示される', async ({
  page,
}) => {
  await page.goto('/tools/regex-pattern-library/');

  await page.locator('#rpl-query').fill('zzzzzzzz');

  await expect(page.locator('#rpl-empty')).toBeVisible();
  await expect(page.locator('#rpl-list > li:not(.hidden)')).toHaveCount(0);
});

test('正規表現パターン集: コピーできる', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/tools/regex-pattern-library/');

  const item = page.locator('#rpl-list > li[data-id="postal-jp-hyphen"]');
  await item.locator('.rpl-copy').click();

  await expect(item.locator('.rpl-status')).not.toBeEmpty();
  const text = await page.evaluate(() => navigator.clipboard.readText());
  expect(text).toBe('^\\d{3}-\\d{4}$');
});

test('正規表現パターン集: regex-tester へのリンクがある', async ({ page }) => {
  await page.goto('/tools/regex-pattern-library/');

  const link = page
    .locator('#rpl-list > li[data-id="email"]')
    .getByRole('link', { name: /regex-testerで試す/ });
  await expect(link).toHaveAttribute('href', '/tools/regex-tester/');
});

test('正規表現パターン集: 英語版で検索できる', async ({ page }) => {
  await page.goto('/en/tools/regex-pattern-library/');

  await page.locator('#rpl-query').fill('uuid');

  const visible = page.locator('#rpl-list > li:not(.hidden)');
  await expect(visible).toHaveCount(1);
  await expect(visible.getByRole('link')).toHaveAttribute(
    'href',
    '/en/tools/regex-tester/',
  );
});
