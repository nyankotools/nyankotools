import { test, expect } from './helpers/test';

test.describe('XML⇔JSON変換（日本語版）', () => {
  test('XMLを入力するとJSONに変換される', async ({ page }) => {
    await page.goto('/tools/xml-json-converter/');

    await expect(page.locator('main h1')).toHaveText('XML⇔JSON変換ツール');

    await page
      .locator('#xml-json-converter-input')
      .fill('<user id="1"><name>Taro</name></user>');

    await expect(page.locator('#xml-json-converter-output')).toHaveValue(
      '{\n  "user": {\n    "name": "Taro",\n    "@_id": "1"\n  }\n}',
    );
    await expect(page.locator('#xml-json-converter-error')).toBeHidden();
  });

  test('「型に変換」を入れると数値になる', async ({ page }) => {
    await page.goto('/tools/xml-json-converter/');

    await page.locator('#xml-json-converter-input').fill('<a><n>5</n></a>');
    await expect(page.locator('#xml-json-converter-output')).toHaveValue(
      /{\s*"n":\s*"5"/,
    );
    await page.locator('#xml-json-converter-parse-values').check();
    await expect(page.locator('#xml-json-converter-output')).toHaveValue(
      /{\s*"n":\s*5/,
    );
  });

  test('JSON→XMLに切り替えて変換できる', async ({ page }) => {
    await page.goto('/tools/xml-json-converter/');

    await page.locator('[data-mode="jsonToXml"]').click();
    await page
      .locator('#xml-json-converter-input')
      .fill('{"user":{"@_id":"1","name":"Taro"}}');

    await expect(page.locator('#xml-json-converter-output')).toHaveValue(
      '<user id="1">\n  <name>Taro</name>\n</user>',
    );
  });

  test('不正なXMLはエラーを表示する', async ({ page }) => {
    await page.goto('/tools/xml-json-converter/');

    await page.locator('#xml-json-converter-input').fill('<a><b></a>');

    await expect(page.locator('#xml-json-converter-error')).toBeVisible();
    await expect(page.locator('#xml-json-converter-error')).toContainText(
      '構文エラー',
    );
    await expect(page.locator('#xml-json-converter-output')).toHaveValue('');
  });

  test('コピーボタンで結果をコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/xml-json-converter/');

    await page.locator('#xml-json-converter-input').fill('<a>x</a>');
    await page.locator('#xml-json-converter-copy-button').click();

    await expect(page.locator('#xml-json-converter-status')).toHaveText(
      'コピーしました',
    );
  });
});

test.describe('XML to JSON Converter (English)', () => {
  test('英語版で変換でき、エラーも英語で表示される', async ({ page }) => {
    await page.goto('/en/tools/xml-json-converter/');

    await expect(page.locator('main h1')).toHaveText('XML ⇔ JSON Converter');

    await page.locator('#xml-json-converter-input').fill('<a>x</a>');
    await expect(page.locator('#xml-json-converter-output')).toHaveValue(
      '{\n  "a": "x"\n}',
    );

    await page.locator('#xml-json-converter-input').fill('<a><b></a>');
    await expect(page.locator('#xml-json-converter-error')).toContainText(
      'Syntax error',
    );
  });
});
