import { test, expect } from './helpers/test';
import { blockAnalytics } from './helpers/block-analytics';

test.describe('CSS/JS/HTMLミニファイ＆整形（日本語版）', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/tools/code-minifier/');
    await expect(page.locator('main h1')).toHaveText(
      'CSS/JS/HTMLミニファイ＆整形ツール',
    );
  });

  test('CSSを入力すると自動で整形される', async ({ page }) => {
    await page.goto('/tools/code-minifier/');

    await page.locator('#code-minifier-input').fill('.a{color:red;margin:0}');

    await expect(page.locator('#code-minifier-output')).toHaveValue(
      '.a {\n  color: red;\n  margin: 0;\n}\n',
    );
    await expect(page.locator('#code-minifier-error')).toBeHidden();
  });

  test('言語をJavaScriptに切り替えて整形できる', async ({ page }) => {
    await page.goto('/tools/code-minifier/');

    await page.locator('#code-minifier-language').selectOption('javascript');
    await page
      .locator('#code-minifier-input')
      .fill('const a=1;function f(x){return x+1}');

    await expect(page.locator('#code-minifier-output')).toHaveValue(
      'const a = 1;\nfunction f(x) {\n  return x + 1;\n}\n',
    );
  });

  test('インデント幅を変更すると結果が変わる', async ({ page }) => {
    await page.goto('/tools/code-minifier/');

    await page.locator('#code-minifier-input').fill('.a{color:red}');
    await page.locator('#code-minifier-indent').selectOption('4');

    await expect(page.locator('#code-minifier-output')).toHaveValue(
      '.a {\n    color: red;\n}\n',
    );
  });

  test('構文エラーのJavaScriptを入力するとエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/code-minifier/');

    await page.locator('#code-minifier-language').selectOption('javascript');
    await page.locator('#code-minifier-input').fill('const a = ;');

    await expect(page.locator('#code-minifier-error')).toBeVisible();
    await expect(page.locator('#code-minifier-output')).toHaveValue('');
  });

  test('ミニファイボタンでHTMLを1行に圧縮できる', async ({ page }) => {
    await page.goto('/tools/code-minifier/');

    await page.locator('#code-minifier-language').selectOption('html');
    await page
      .locator('#code-minifier-input')
      .fill('<div>\n  <p>hello</p>\n</div>\n');
    await page.locator('#code-minifier-minify-button').click();

    await expect(page.locator('#code-minifier-output')).toHaveValue(
      '<div><p>hello</p></div>',
    );
  });

  test('コピーボタンで結果をクリップボードにコピーできる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/code-minifier/');

    await page.locator('#code-minifier-input').fill('.a{color:red}');
    await page.locator('#code-minifier-copy-button').click();

    await expect(page.locator('#code-minifier-status')).toHaveText(
      'コピーしました',
    );
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText.replace(/\r\n/g, '\n')).toBe(
      '.a {\n  color: red;\n}\n',
    );
  });

  // 過去にhtml-minifier-terser経由でclean-cssがトップレベルでprocess.platformを
  // 参照し、ブラウザ実行時に`process is not defined`が発生した経緯があるため、
  // 3言語すべての整形・ミニファイでコンソールエラー・pageerrorが出ないことを回帰確認する。
  test('CSS/JS/HTMLいずれの整形・ミニファイでもコンソールエラーが発生しない', async ({
    page,
  }) => {
    await blockAnalytics(page);
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`);
    });

    await page.goto('/tools/code-minifier/');

    await page.locator('#code-minifier-language').selectOption('css');
    await page.locator('#code-minifier-input').fill('.a{color:red;margin:0}');
    await expect(page.locator('#code-minifier-output')).toHaveValue(
      '.a {\n  color: red;\n  margin: 0;\n}\n',
    );
    await page.locator('#code-minifier-minify-button').click();
    await expect(page.locator('#code-minifier-output')).toHaveValue(
      '.a{color:red;margin:0}',
    );

    await page.locator('#code-minifier-language').selectOption('javascript');
    await page
      .locator('#code-minifier-input')
      .fill('const a=1;function f(x){return x+1}');
    await expect(page.locator('#code-minifier-output')).toHaveValue(
      'const a = 1;\nfunction f(x) {\n  return x + 1;\n}\n',
    );
    await page.locator('#code-minifier-minify-button').click();
    await expect(page.locator('#code-minifier-output')).not.toHaveValue('');

    await page.locator('#code-minifier-language').selectOption('html');
    await page
      .locator('#code-minifier-input')
      .fill('<div>\n  <p>hello</p>\n</div>\n');
    await page.locator('#code-minifier-minify-button').click();
    await expect(page.locator('#code-minifier-output')).toHaveValue(
      '<div><p>hello</p></div>',
    );

    expect(errors).toEqual([]);
  });
});

test.describe('CSS/JS/HTML Minifier (English)', () => {
  test('英語版が正しく表示され、整形・ミニファイできる', async ({ page }) => {
    await page.goto('/en/tools/code-minifier/');
    await expect(page.locator('main h1')).toHaveText(
      'CSS/JS/HTML Minifier & Formatter',
    );

    await page.locator('#code-minifier-input').fill('.a{color:red;margin:0}');
    await expect(page.locator('#code-minifier-output')).toHaveValue(
      '.a {\n  color: red;\n  margin: 0;\n}\n',
    );

    await page.locator('#code-minifier-language').selectOption('html');
    await page
      .locator('#code-minifier-input')
      .fill('<div>\n  <p>hello</p>\n</div>\n');
    await page.locator('#code-minifier-minify-button').click();
    await expect(page.locator('#code-minifier-output')).toHaveValue(
      '<div><p>hello</p></div>',
    );
  });
});
