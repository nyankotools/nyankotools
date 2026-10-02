import { test, expect } from './helpers/test';

test.describe('.env⇔JSON変換（日本語版）', () => {
  test('.envを入力するとJSONに変換される', async ({ page }) => {
    await page.goto('/tools/env-json-converter/');

    await expect(page.locator('main h1')).toHaveText('.env⇔JSON変換ツール');

    await page
      .locator('#env-json-converter-input')
      .fill('# c\nPORT=3000\nNAME="Hello World"');

    await expect(page.locator('#env-json-converter-output')).toHaveValue(
      '{\n  "PORT": "3000",\n  "NAME": "Hello World"\n}',
    );
    await expect(page.locator('#env-json-converter-error')).toBeHidden();
  });

  test('「型に変換」を入れると数値・真偽値になる', async ({ page }) => {
    await page.goto('/tools/env-json-converter/');

    await page
      .locator('#env-json-converter-input')
      .fill('PORT=3000\nDEBUG=true');
    await page.locator('#env-json-converter-parse-values').check();

    await expect(page.locator('#env-json-converter-output')).toHaveValue(
      '{\n  "PORT": 3000,\n  "DEBUG": true\n}',
    );
  });

  test('JSON→.envに切り替えて変換できる', async ({ page }) => {
    await page.goto('/tools/env-json-converter/');

    await page.locator('[data-mode="jsonToEnv"]').click();
    await page
      .locator('#env-json-converter-input')
      .fill('{"PORT":3000,"NAME":"Hello World"}');

    await expect(page.locator('#env-json-converter-output')).toHaveValue(
      'PORT=3000\nNAME="Hello World"',
    );
  });

  test('不正な行は行番号つきでエラーを表示する', async ({ page }) => {
    await page.goto('/tools/env-json-converter/');

    await page.locator('#env-json-converter-input').fill('A=1\nnotvalid');

    await expect(page.locator('#env-json-converter-error')).toContainText(
      '構文エラー: 2: notvalid',
    );
    await expect(page.locator('#env-json-converter-output')).toHaveValue('');
  });
});

test.describe('.env to JSON Converter (English)', () => {
  test('英語版で変換でき、エラーも英語で表示される', async ({ page }) => {
    await page.goto('/en/tools/env-json-converter/');

    await expect(page.locator('main h1')).toHaveText('.env ⇔ JSON Converter');

    await page.locator('#env-json-converter-input').fill('A=1');
    await expect(page.locator('#env-json-converter-output')).toHaveValue(
      '{\n  "A": "1"\n}',
    );

    await page.locator('#env-json-converter-input').fill('oops');
    await expect(page.locator('#env-json-converter-error')).toContainText(
      'Syntax error',
    );
  });
});
