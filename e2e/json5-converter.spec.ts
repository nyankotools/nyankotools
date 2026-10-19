import { test, expect } from './helpers/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('JSON5⇔JSON変換（日本語版）', () => {
  test('JSON5（コメント・末尾カンマ・クォート無しキー）をJSONに変換できる', async ({
    page,
  }) => {
    await page.goto('/tools/json5-converter/');

    await page
      .locator('#json5-converter-input')
      .fill("{ // c\n  name: 'Taro', age: 0x1E, }");

    await expect(page.locator('#json5-converter-output')).toHaveValue(
      '{\n  "name": "Taro",\n  "age": 30\n}',
    );
    await expect(page.locator('#json5-converter-error')).toBeHidden();
  });

  test('Infinityはnullに置き換わり、警告が表示される', async ({ page }) => {
    await page.goto('/tools/json5-converter/');

    await page.locator('#json5-converter-input').fill('[Infinity, 1]');
    await page.locator('#json5-converter-indent').selectOption('0');

    await expect(page.locator('#json5-converter-output')).toHaveValue(
      '[null,1]',
    );
    await expect(page.locator('#json5-converter-warning')).toBeVisible();
  });

  test('JSON→JSON5でキーのクォート省略とシングルクォートになる', async ({
    page,
  }) => {
    await page.goto('/tools/json5-converter/');

    await page.locator('[data-mode="jsonToJson5"]').click();
    await page.locator('#json5-converter-input').fill('{"name":"Taro"}');

    await expect(page.locator('#json5-converter-output')).toHaveValue(
      "{\n  name: 'Taro'\n}",
    );

    await page.locator('#json5-converter-quote').selectOption('double');
    await page.locator('#json5-converter-trailing').check();
    await expect(page.locator('#json5-converter-output')).toHaveValue(
      '{\n  name: "Taro",\n}',
    );
  });

  test('構文エラーは行と列つきで表示される', async ({ page }) => {
    await page.goto('/tools/json5-converter/');

    await page.locator('#json5-converter-input').fill('{\n  a: @\n}');

    await expect(page.locator('#json5-converter-error')).toContainText(
      '構文エラー (2行目 6列目)',
    );
    await expect(page.locator('#json5-converter-output')).toHaveValue('');
  });

  test('コピーボタンで結果をコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/json5-converter/');

    await page.locator('#json5-converter-input').fill('{a:1}');
    await page.locator('#json5-converter-copy-button').click();

    await expect(page.locator('#json5-converter-status')).toHaveText(
      'コピーしました',
    );
  });
});

test.describe('JSON5 to JSON Converter (English)', () => {
  test('英語版で変換でき、エラーが英語で表示される', async ({ page }) => {
    await page.goto('/en/tools/json5-converter/');

    await expect(page.locator('main h1')).toHaveText('JSON5 ⇔ JSON Converter');

    await page.locator('#json5-converter-input').fill("{a: 'x',}");
    await expect(page.locator('#json5-converter-output')).toHaveValue(
      '{\n  "a": "x"\n}',
    );

    await page.locator('#json5-converter-input').fill('[1 2]');
    await expect(page.locator('#json5-converter-error')).toContainText(
      'Syntax error (line 1, column 4)',
    );
  });
});

test.describe('JSON5変換のアクセシビリティ', () => {
  test('日本語版・英語版でaxe違反がない（エラー表示時も含む）', async ({
    page,
  }) => {
    for (const path of [
      '/tools/json5-converter/',
      '/en/tools/json5-converter/',
    ]) {
      await page.goto(path);
      await page.locator('#json5-converter-input').fill('[1 2]');
      await expect(page.locator('#json5-converter-error')).toBeVisible();
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(results.violations.map((v) => v.id)).toEqual([]);
    }
  });
});
