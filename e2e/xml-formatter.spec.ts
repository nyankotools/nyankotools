import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test.describe('XML整形（日本語版）', () => {
  test('入力すると整形され、ミニファイに切り替えられる', async ({ page }) => {
    await page.goto('/tools/xml-formatter/');

    await page
      .locator('#xml-formatter-input')
      .fill('<a id="1"><b>x</b><c/></a>');
    await expect(page.locator('#xml-formatter-output')).toHaveValue(
      '<a id="1">\n  <b>x</b>\n  <c/>\n</a>',
    );

    await page.locator('#xml-formatter-input').fill('<a>\n  <b/>\n</a>');
    await page.locator('#xml-formatter-indent').selectOption('min');
    await expect(page.locator('#xml-formatter-output')).toHaveValue(
      '<a><b/></a>',
    );
  });

  test('不正なXMLはエラー位置を表示する', async ({ page }) => {
    await page.goto('/tools/xml-formatter/');

    await page.locator('#xml-formatter-input').fill('<a>\n  <b>\n</a>');

    await expect(page.locator('#xml-formatter-error')).toBeVisible();
    await expect(page.locator('#xml-formatter-error')).toContainText(
      '構文エラー',
    );
    await expect(page.locator('#xml-formatter-error')).toContainText('行目');
    await expect(page.locator('#xml-formatter-output')).toHaveValue('');
  });

  test('コピーボタンで結果をコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/xml-formatter/');

    await page.locator('#xml-formatter-input').fill('<a><b/></a>');
    await page.locator('#xml-formatter-copy-button').click();

    await expect(page.locator('#xml-formatter-status')).toHaveText(
      'コピーしました',
    );
  });
});

test.describe('XML Formatter (English)', () => {
  test('formats XML and reports errors in English', async ({ page }) => {
    await page.goto('/en/tools/xml-formatter/');

    await page.locator('#xml-formatter-input').fill('<a><b/></a>');
    await expect(page.locator('#xml-formatter-output')).toHaveValue(
      '<a>\n  <b/>\n</a>',
    );

    await page.locator('#xml-formatter-input').fill('<a><b></a>');
    await expect(page.locator('#xml-formatter-error')).toContainText(
      'Syntax error',
    );
  });
});

test.describe('xml-formatter: アクセシビリティ', () => {
  test('初期表示でaxeのWCAG 2.1 A/AA違反がない（ja/en）', async ({ page }) => {
    for (const path of ['/tools/xml-formatter/', '/en/tools/xml-formatter/']) {
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
