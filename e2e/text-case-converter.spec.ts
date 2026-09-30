import { test, expect } from './helpers/test';

test.describe('テキストケース変換ツール（日本語版）', () => {
  test('直接アクセスして正しく表示され、入力すると各ケースへ変換される', async ({
    page,
  }) => {
    await page.goto('/tools/text-case-converter/');

    await expect(page.locator('main h1')).toHaveText(
      'テキストケース変換（camelCase / snake_case / kebab-case / PascalCase）',
    );

    await page.locator('#text-case-input').fill('hello world example');

    await expect(page.locator('[data-case="camelCase"]')).toHaveValue(
      'helloWorldExample',
    );
    await expect(page.locator('[data-case="pascalCase"]')).toHaveValue(
      'HelloWorldExample',
    );
    await expect(page.locator('[data-case="snakeCase"]')).toHaveValue(
      'hello_world_example',
    );
    await expect(page.locator('[data-case="kebabCase"]')).toHaveValue(
      'hello-world-example',
    );
    await expect(page.locator('[data-case="constantCase"]')).toHaveValue(
      'HELLO_WORLD_EXAMPLE',
    );
    await expect(page.locator('[data-case="titleCase"]')).toHaveValue(
      'Hello World Example',
    );
    await expect(page.locator('[data-case="sentenceCase"]')).toHaveValue(
      'Hello world example',
    );
    await expect(page.locator('[data-case="lowerCase"]')).toHaveValue(
      'hello world example',
    );
    await expect(page.locator('[data-case="upperCase"]')).toHaveValue(
      'HELLO WORLD EXAMPLE',
    );
  });

  test('既存のcamelCase文字列も認識して他のケースへ変換する', async ({
    page,
  }) => {
    await page.goto('/tools/text-case-converter/');

    await page.locator('#text-case-input').fill('helloWorldExample');

    await expect(page.locator('[data-case="snakeCase"]')).toHaveValue(
      'hello_world_example',
    );
    await expect(page.locator('[data-case="kebabCase"]')).toHaveValue(
      'hello-world-example',
    );
  });

  test('入力を空にすると結果も空になる', async ({ page }) => {
    await page.goto('/tools/text-case-converter/');

    await page.locator('#text-case-input').fill('hello world');
    await expect(page.locator('[data-case="camelCase"]')).toHaveValue(
      'helloWorld',
    );

    await page.locator('#text-case-input').fill('');
    await expect(page.locator('[data-case="camelCase"]')).toHaveValue('');
  });

  test('コピーボタンで対応するケースの結果をクリップボードにコピーできる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/text-case-converter/');

    await page.locator('#text-case-input').fill('hello world');
    await page.locator('[data-copy-for="kebabCase"]').click();

    await expect(page.locator('#text-case-status')).toHaveText(
      'コピーしました',
    );
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toBe('hello-world');
  });
});

test.describe('Text Case Converter (English)', () => {
  test('英語版が正しく表示され、入力すると各ケースへ変換される', async ({
    page,
  }) => {
    await page.goto('/en/tools/text-case-converter/');

    await expect(page.locator('main h1')).toHaveText(
      'Text Case Converter (camelCase / snake_case / kebab-case / PascalCase)',
    );

    await page.locator('#text-case-input').fill('hello world example');
    await expect(page.locator('[data-case="camelCase"]')).toHaveValue(
      'helloWorldExample',
    );
  });

  test('コピーボタンで結果をクリップボードにコピーできる（英語版）', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/en/tools/text-case-converter/');

    await page.locator('#text-case-input').fill('hello world');
    await page.locator('[data-copy-for="snakeCase"]').click();

    await expect(page.locator('#text-case-status')).toHaveText('Copied');
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toBe('hello_world');
  });
});
