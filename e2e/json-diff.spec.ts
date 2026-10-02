import { test, expect } from './helpers/test';

test.describe('JSON差分比較', () => {
  test('サンプルの差分が一覧表示される', async ({ page }) => {
    await page.goto('/tools/json-diff/');
    await expect(page.locator('main h1')).toHaveText('JSON差分比較');

    await expect(page.locator('#json-diff-summary')).toHaveText(
      '追加 2 件・削除 0 件・変更 2 件',
    );
    const items = page.locator('#json-diff-list li');
    await expect(items).toHaveCount(4);
    await expect(items.filter({ hasText: '$.address.city' })).toBeVisible();
    await expect(items.filter({ hasText: '$.tags[2]' })).toBeVisible();
  });

  test('同じ内容なら差分なし、並び順の無視オプション、エラー表示', async ({
    page,
  }) => {
    await page.goto('/tools/json-diff/');
    const left = page.locator('#json-diff-left');
    const right = page.locator('#json-diff-right');

    await left.fill('{"a":[1,2],"b":1}');
    await right.fill('{"b":1,"a":[2,1]}');
    await expect(page.locator('#json-diff-list li')).toHaveCount(2);
    await page.locator('#json-diff-ignore-order').check();
    await expect(page.locator('#json-diff-list li')).toHaveCount(0);
    await expect(page.locator('#json-diff-summary')).toContainText(
      '差分はありません',
    );

    await right.fill('{oops');
    await expect(page.locator('#json-diff-error')).toBeVisible();
    await expect(page.locator('#json-diff-result')).toBeHidden();
  });
});

test.describe('JSON Diff (en)', () => {
  test('displays and compares', async ({ page }) => {
    await page.goto('/en/tools/json-diff/');
    await expect(page.locator('main h1')).toHaveText('JSON Diff');
    await expect(page.locator('#json-diff-summary')).toHaveText(
      '2 added, 0 removed, 2 changed',
    );
  });
});
