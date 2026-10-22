import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test.describe('クエリ文字列⇔JSON変換（日本語版）', () => {
  test('クエリ文字列がJSONに変換され、型変換も切り替えられる', async ({
    page,
  }) => {
    await page.goto('/tools/query-string-json/');
    await page.locator('#qsj-indent').selectOption('0');
    await page
      .locator('#qsj-input')
      .fill('https://x.com/p?a=1&b[]=2&b[]=3&c[d]=x+y#top');
    await expect(page.locator('#qsj-output')).toHaveValue(
      '{"a":"1","b":["2","3"],"c":{"d":"x y"}}',
    );

    await page.locator('#qsj-infer').check();
    await expect(page.locator('#qsj-output')).toHaveValue(
      '{"a":1,"b":[2,3],"c":{"d":"x y"}}',
    );
  });

  test('JSONからクエリ文字列へ、配列表記を切り替えて変換できる', async ({
    page,
  }) => {
    await page.goto('/tools/query-string-json/');
    await page.locator('#qsj-direction').selectOption('j2q');
    await expect(page.locator('#qsj-j2q-options')).toBeVisible();
    await expect(page.locator('#qsj-q2j-options')).toBeHidden();
    await page.locator('#qsj-input').fill('{"a":1,"b":["x","y"]}');
    await expect(page.locator('#qsj-output')).toHaveValue('a=1&b[]=x&b[]=y');

    await page.locator('#qsj-array').selectOption('index');
    await expect(page.locator('#qsj-output')).toHaveValue('a=1&b[0]=x&b[1]=y');
    await page.locator('#qsj-array').selectOption('repeat');
    await page.locator('#qsj-leading').check();
    await expect(page.locator('#qsj-output')).toHaveValue('?a=1&b=x&b=y');
  });

  test('不正なJSONとオブジェクト以外でエラーが表示される', async ({ page }) => {
    await page.goto('/tools/query-string-json/');
    await page.locator('#qsj-direction').selectOption('j2q');
    await page.locator('#qsj-input').fill('{bad');
    await expect(page.locator('#qsj-error')).toContainText('JSONの構文エラー');
    await page.locator('#qsj-input').fill('[1,2]');
    await expect(page.locator('#qsj-error')).toContainText('オブジェクト');
  });

  test('サンプル入力とコピーができる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/query-string-json/');
    await page.locator('#qsj-sample-button').click();
    await expect(page.locator('#qsj-output')).toHaveValue(/"city": "Tokyo"/);
    await page.locator('#qsj-copy-button').click();
    await expect(page.locator('#qsj-status')).toHaveText('コピーしました');
  });
});

test.describe('Query String ⇔ JSON Converter (English)', () => {
  test('英語版で変換とエラー表示が動作する', async ({ page }) => {
    await page.goto('/en/tools/query-string-json/');
    await page.locator('#qsj-indent').selectOption('0');
    await page.locator('#qsj-input').fill('?a[b]=1');
    await expect(page.locator('#qsj-output')).toHaveValue('{"a":{"b":"1"}}');

    await page.locator('#qsj-direction').selectOption('j2q');
    await page.locator('#qsj-input').fill('{');
    await expect(page.locator('#qsj-error')).toContainText('Invalid JSON:');
  });
});

test.describe('query-string-json: アクセシビリティ', () => {
  test('初期表示でaxeのWCAG 2.1 A/AA違反がない（ja/en）', async ({ page }) => {
    for (const path of [
      '/tools/query-string-json/',
      '/en/tools/query-string-json/',
    ]) {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(
        results.violations.map((v) => v.id),
        path,
      ).toEqual([]);
    }
  });
});
