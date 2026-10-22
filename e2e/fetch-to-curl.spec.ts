import { test, expect } from './helpers/test';

test.describe('Fetch/Axios→cURL変換', () => {
  test('サンプルがcurlに変換される', async ({ page }) => {
    await page.goto('/tools/fetch-to-curl/');
    await expect(page.locator('main h1')).toHaveText('Fetch/Axios→cURL変換');

    const output = page.locator('#fetch-to-curl-output');
    await expect(output).toHaveValue(
      /^curl 'https:\/\/api\.example\.com\/users'/,
    );
    await expect(output).toHaveValue(/-X POST/);
    await expect(output).toHaveValue(/--data-raw '\{"name":"Taro","age":20\}'/);
  });

  test('入力・改行切替・エラー・警告が動く', async ({ page }) => {
    await page.goto('/tools/fetch-to-curl/');
    const input = page.locator('#fetch-to-curl-input');
    const output = page.locator('#fetch-to-curl-output');

    await input.fill(
      'axios.get("https://a.test/s", { params: { q: "x" }, proxy: false })',
    );
    await expect(output).toHaveValue("curl 'https://a.test/s?q=x'");
    await expect(page.locator('#fetch-to-curl-warnings li')).toHaveCount(1);

    await input.fill('fetch("https://a.test/", { method: "DELETE" })');
    await expect(output).toHaveValue(/\\\n {2}-X DELETE/);
    await page.locator('#fetch-to-curl-multiline').uncheck();
    await expect(output).toHaveValue("curl 'https://a.test/' -X DELETE");

    await input.fill('const a = 1;');
    await expect(page.locator('#fetch-to-curl-error')).toBeVisible();
    await expect(output).toHaveValue('');

    await input.fill('');
    await expect(page.locator('#fetch-to-curl-error')).toBeHidden();
  });
});

test.describe('Fetch / Axios to cURL Converter (en)', () => {
  test('displays and converts', async ({ page }) => {
    await page.goto('/en/tools/fetch-to-curl/');
    await expect(page.locator('main h1')).toHaveText(
      'Fetch / Axios to cURL Converter',
    );
    await expect(page.locator('#fetch-to-curl-output')).toHaveValue(
      /^curl 'https:\/\/api\.example\.com\/users'/,
    );
  });
});
