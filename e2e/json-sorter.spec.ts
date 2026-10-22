import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test.describe('JSONキーソート・フラット化（日本語版）', () => {
  test('キーが再帰的にソートされ、配列の順序は保たれる', async ({ page }) => {
    await page.goto('/tools/json-sorter/');
    await page.locator('#json-sorter-indent').selectOption('0');
    await page
      .locator('#json-sorter-input')
      .fill('{"b":{"z":1,"y":2},"a":[3,1]}');
    await expect(page.locator('#json-sorter-output')).toHaveValue(
      '{"a":[3,1],"b":{"y":2,"z":1}}',
    );

    await page.locator('#json-sorter-order').selectOption('desc');
    await expect(page.locator('#json-sorter-output')).toHaveValue(
      '{"b":{"z":1,"y":2},"a":[3,1]}',
    );
  });

  test('フラット化と復元ができる', async ({ page }) => {
    await page.goto('/tools/json-sorter/');
    await page.locator('#json-sorter-indent').selectOption('0');
    await page.locator('#json-sorter-mode').selectOption('flatten');
    await page.locator('#json-sorter-input').fill('{"a":{"b":[1,2]}}');
    await expect(page.locator('#json-sorter-output')).toHaveValue(
      '{"a.b[0]":1,"a.b[1]":2}',
    );
    await expect(page.locator('#json-sorter-sort-options')).toBeHidden();

    await page.locator('#json-sorter-mode').selectOption('unflatten');
    await page.locator('#json-sorter-input').fill('{"a.b[0]":1,"a.b[1]":2}');
    await expect(page.locator('#json-sorter-output')).toHaveValue(
      '{"a":{"b":[1,2]}}',
    );
  });

  test('不正なJSONや矛盾するキーでエラーが表示される', async ({ page }) => {
    await page.goto('/tools/json-sorter/');
    await page.locator('#json-sorter-input').fill('{invalid}');
    await expect(page.locator('#json-sorter-error')).toContainText(
      'JSONの構文エラー',
    );

    await page.locator('#json-sorter-mode').selectOption('unflatten');
    await page.locator('#json-sorter-input').fill('{"a":1,"a.b":2}');
    await expect(page.locator('#json-sorter-error')).toContainText('矛盾');
  });

  test('コピーボタンで結果をコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/json-sorter/');
    await page.locator('#json-sorter-indent').selectOption('0');
    await page.locator('#json-sorter-input').fill('{"b":1,"a":2}');
    await page.locator('#json-sorter-copy-button').click();
    await expect(page.locator('#json-sorter-status')).toHaveText(
      'コピーしました',
    );
  });
});

test.describe('JSON Key Sorter (English)', () => {
  test('英語版でソートとエラー表示が動作する', async ({ page }) => {
    await page.goto('/en/tools/json-sorter/');
    await page.locator('#json-sorter-indent').selectOption('0');
    await page.locator('#json-sorter-input').fill('{"b":1,"a":2}');
    await expect(page.locator('#json-sorter-output')).toHaveValue(
      '{"a":2,"b":1}',
    );

    await page.locator('#json-sorter-input').fill('{');
    await expect(page.locator('#json-sorter-error')).toContainText(
      'Invalid JSON:',
    );
  });
});

test.describe('json-sorter: アクセシビリティ', () => {
  test('初期表示でaxeのWCAG 2.1 A/AA違反がない（ja/en）', async ({ page }) => {
    for (const path of ['/tools/json-sorter/', '/en/tools/json-sorter/']) {
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
