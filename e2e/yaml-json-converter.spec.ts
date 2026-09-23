import { test, expect } from '@playwright/test';

test.describe('YAML⇔JSON変換（日本語版）', () => {
  test('直接アクセスして正しく表示され、YAMLを入力するとJSONに変換される', async ({
    page,
  }) => {
    await page.goto('/tools/yaml-json-converter/');

    await expect(page.locator('main h1')).toHaveText('YAML⇔JSON変換ツール');

    await page
      .locator('#yaml-json-converter-input')
      .fill('name: Taro\nage: 30');

    await expect(page.locator('#yaml-json-converter-output')).toHaveValue(
      '{\n  "name": "Taro",\n  "age": 30\n}',
    );
    await expect(page.locator('#yaml-json-converter-error')).toBeHidden();
  });

  test('モードをJSON→YAMLに切り替えて変換できる', async ({ page }) => {
    await page.goto('/tools/yaml-json-converter/');

    await page.locator('[data-mode="jsonToYaml"]').click();
    await page
      .locator('#yaml-json-converter-input')
      .fill('{"name":"Taro","age":30}');

    await expect(page.locator('#yaml-json-converter-output')).toHaveValue(
      'name: Taro\nage: 30\n',
    );
  });

  test('インデント幅を4に変更すると出力に反映される', async ({ page }) => {
    await page.goto('/tools/yaml-json-converter/');

    await page.locator('#yaml-json-converter-input').fill('key: value');
    await page.locator('#yaml-json-converter-indent').selectOption('4');

    await expect(page.locator('#yaml-json-converter-output')).toHaveValue(
      '{\n    "key": "value"\n}',
    );
  });

  test('不正なYAMLを入力するとエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/yaml-json-converter/');

    await page
      .locator('#yaml-json-converter-input')
      .fill('key: value\n  bad: indent');

    await expect(page.locator('#yaml-json-converter-error')).toBeVisible();
    await expect(page.locator('#yaml-json-converter-error')).toContainText(
      '構文エラー',
    );
    await expect(page.locator('#yaml-json-converter-output')).toHaveValue('');
  });

  test('コピーボタンで結果をクリップボードにコピーできる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/yaml-json-converter/');

    await page.locator('#yaml-json-converter-input').fill('key: value');
    await page.locator('#yaml-json-converter-copy-button').click();

    await expect(page.locator('#yaml-json-converter-status')).toHaveText(
      'コピーしました',
    );
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    // WindowsのOSクリップボードはLFをCRLFへ正規化することがあるため、
    // 改行コードの違いを吸収してから比較する。
    expect(clipboardText.replace(/\r\n/g, '\n')).toBe('{\n  "key": "value"\n}');
  });
});

test.describe('YAML to JSON Converter (English)', () => {
  test('英語版が正しく表示され、YAMLを入力するとJSONに変換される', async ({
    page,
  }) => {
    await page.goto('/en/tools/yaml-json-converter/');

    await expect(page.locator('main h1')).toHaveText('YAML ⇔ JSON Converter');

    await page
      .locator('#yaml-json-converter-input')
      .fill('name: Taro\nage: 30');

    await expect(page.locator('#yaml-json-converter-output')).toHaveValue(
      '{\n  "name": "Taro",\n  "age": 30\n}',
    );
  });

  test('不正なYAMLを入力すると英語のエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/en/tools/yaml-json-converter/');

    await page
      .locator('#yaml-json-converter-input')
      .fill('key: value\n  bad: indent');

    await expect(page.locator('#yaml-json-converter-error')).toBeVisible();
    await expect(page.locator('#yaml-json-converter-error')).toContainText(
      'Syntax error',
    );
  });

  test('コピーボタンで結果をクリップボードにコピーでき、英語のメッセージが表示される', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/en/tools/yaml-json-converter/');

    await page.locator('#yaml-json-converter-input').fill('key: value');
    await page.locator('#yaml-json-converter-copy-button').click();

    await expect(page.locator('#yaml-json-converter-status')).toHaveText(
      'Copied',
    );
  });
});
