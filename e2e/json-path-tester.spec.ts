import { test, expect } from './helpers/test';

test.describe('JSON Path / JSON Pointerテスター（日本語版）', () => {
  test('直接アクセスして正しく表示され、サンプルデータで結果が表示される', async ({
    page,
  }) => {
    await page.goto('/tools/json-path-tester/');

    await expect(page.locator('main h1')).toHaveText(
      'JSON Path / JSON Pointerテスター',
    );

    // サンプルJSON・サンプルクエリが自動入力され、その場で結果が表示される
    await expect(page.locator('#json-path-tester-input')).toHaveValue(
      /吾輩は猫である/,
    );
    await expect(page.locator('#json-path-tester-query')).toHaveValue(
      '$.store.book[*].title',
    );
    await expect(page.locator('#json-path-tester-status')).toHaveText(
      '2件マッチしました。',
    );

    const rows = page.locator('#json-path-tester-results tr');
    await expect(rows).toHaveCount(2);
    await expect(rows.nth(0).locator('td').nth(2)).toHaveText(
      '"吾輩は猫である"',
    );
    await expect(rows.nth(1).locator('td').nth(2)).toHaveText('"坊っちゃん"');
  });

  test('JSONPathモードでクエリを変更すると結果が更新される', async ({
    page,
  }) => {
    await page.goto('/tools/json-path-tester/');

    await page.locator('#json-path-tester-query').fill('$..price');

    await expect(page.locator('#json-path-tester-status')).toHaveText(
      '2件マッチしました。',
    );
    const rows = page.locator('#json-path-tester-results tr');
    await expect(rows).toHaveCount(2);
    await expect(rows.nth(0).locator('td').nth(2)).toHaveText('800');
    await expect(rows.nth(1).locator('td').nth(2)).toHaveText('700');
  });

  test('JSON Pointerモードに切り替えると結果が単一の値になる', async ({
    page,
  }) => {
    await page.goto('/tools/json-path-tester/');

    await page.locator('#json-path-tester-mode-pointer').check();
    await page.locator('#json-path-tester-query').fill('/store/book/0/title');

    await expect(page.locator('#json-path-tester-status')).toHaveText(
      '1件マッチしました。',
    );
    const rows = page.locator('#json-path-tester-results tr');
    await expect(rows).toHaveCount(1);
    await expect(rows.nth(0).locator('td').nth(2)).toHaveText(
      '"吾輩は猫である"',
    );

    // クエリのヒント・placeholderもPointer用に切り替わる
    await expect(page.locator('#json-path-tester-query-hint')).toHaveText(
      /\/store\/book\/0\/title/,
    );
  });

  test('不正なJSON入力時にエラーが表示され、結果はクリアされる', async ({
    page,
  }) => {
    await page.goto('/tools/json-path-tester/');

    await page.locator('#json-path-tester-input').fill('{invalid json');

    await expect(page.locator('#json-path-tester-json-error')).toBeVisible();
    await expect(page.locator('#json-path-tester-json-error')).toContainText(
      'JSONの構文エラー',
    );
    await expect(page.locator('#json-path-tester-results tr')).toHaveCount(0);
    await expect(page.locator('#json-path-tester-status')).toHaveText('');
  });

  test('不正なJSONPathクエリを入力するとエラーが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/json-path-tester/');

    await page.locator('#json-path-tester-query').fill('$[?(@.a===)]');

    await expect(page.locator('#json-path-tester-query-error')).toBeVisible();
    await expect(page.locator('#json-path-tester-query-error')).toContainText(
      'JSONPathが不正です',
    );
    await expect(page.locator('#json-path-tester-results tr')).toHaveCount(0);
  });

  test('"/" で始まらないJSON Pointerクエリを入力するとエラーが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/json-path-tester/');

    await page.locator('#json-path-tester-mode-pointer').check();
    await page.locator('#json-path-tester-query').fill('store/book');

    await expect(page.locator('#json-path-tester-query-error')).toHaveText(
      'JSON Pointerは空文字列か "/" から始まる必要があります。',
    );
    await expect(page.locator('#json-path-tester-results tr')).toHaveCount(0);
  });
});

test.describe('JSON Path / JSON Pointer Tester (English)', () => {
  test('英語版が正しく表示され、サンプルデータで結果が表示される', async ({
    page,
  }) => {
    await page.goto('/en/tools/json-path-tester/');

    await expect(page.locator('main h1')).toHaveText(
      'JSON Path / JSON Pointer Tester',
    );
    await expect(page.locator('#json-path-tester-status')).toHaveText(
      '2 matches found.',
    );
  });

  test('不正なJSON Pointerクエリで英語のエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/en/tools/json-path-tester/');

    await page.locator('#json-path-tester-mode-pointer').check();
    await page.locator('#json-path-tester-query').fill('store/book');

    await expect(page.locator('#json-path-tester-query-error')).toHaveText(
      'A JSON Pointer must be empty or start with "/".',
    );
  });
});
