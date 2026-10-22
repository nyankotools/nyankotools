import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test.describe('YAML整形（日本語版）', () => {
  test('入力すると整形され、キーソートとブロック展開ができる', async ({
    page,
  }) => {
    await page.goto('/tools/yaml-formatter/');

    await page.locator('#yaml-formatter-input').fill('b: 1\na: {x: 1}');
    await page.locator('#yaml-formatter-expand-flow').check();
    await expect(page.locator('#yaml-formatter-output')).toHaveValue(
      'b: 1\na:\n  x: 1',
    );

    await page.locator('#yaml-formatter-sort-keys').check();
    await expect(page.locator('#yaml-formatter-output')).toHaveValue(
      'a:\n  x: 1\nb: 1',
    );
  });

  test('不正なYAMLはエラー位置を表示する', async ({ page }) => {
    await page.goto('/tools/yaml-formatter/');

    await page.locator('#yaml-formatter-input').fill('a: 1\na: 2');

    await expect(page.locator('#yaml-formatter-error')).toBeVisible();
    await expect(page.locator('#yaml-formatter-error')).toContainText(
      '構文エラー',
    );
    await expect(page.locator('#yaml-formatter-error')).toContainText('2行目');
    await expect(page.locator('#yaml-formatter-output')).toHaveValue('');
  });

  test('コピーボタンで結果をコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/yaml-formatter/');

    await page.locator('#yaml-formatter-input').fill('a: 1');
    await page.locator('#yaml-formatter-copy-button').click();

    await expect(page.locator('#yaml-formatter-status')).toHaveText(
      'コピーしました',
    );
  });
});

test.describe('YAML Formatter (English)', () => {
  test('formats YAML and reports errors in English', async ({ page }) => {
    await page.goto('/en/tools/yaml-formatter/');

    await page.locator('#yaml-formatter-input').fill('a:\n    b: 1');
    await expect(page.locator('#yaml-formatter-output')).toHaveValue(
      'a:\n  b: 1',
    );

    await page.locator('#yaml-formatter-input').fill('a: [1, 2');
    await expect(page.locator('#yaml-formatter-error')).toContainText(
      'Syntax error',
    );
  });
});

test.describe('yaml-formatter: アクセシビリティ', () => {
  test('初期表示でaxeのWCAG 2.1 A/AA違反がない（ja/en）', async ({ page }) => {
    for (const path of [
      '/tools/yaml-formatter/',
      '/en/tools/yaml-formatter/',
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
