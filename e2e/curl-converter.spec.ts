import { test, expect } from './helpers/test';

test.describe('cURL→Fetch/Axios変換', () => {
  test('サンプルがfetchに変換され、axiosに切り替えられる', async ({ page }) => {
    await page.goto('/tools/curl-converter/');
    await expect(page.locator('main h1')).toHaveText('cURL→Fetch/Axios変換');

    const output = page.locator('#curl-converter-output');
    await expect(output).toHaveValue(
      /await fetch\("https:\/\/api\.example\.com\/users"/,
    );
    await expect(output).toHaveValue(/body: JSON\.stringify\(/);

    await page.locator('[data-format="axios"]').click();
    await expect(output).toHaveValue(/import axios from "axios";/);
    await expect(output).toHaveValue(/method: "post"/);
  });

  test('入力を変えると結果が更新され、不正な入力はエラーになる', async ({
    page,
  }) => {
    await page.goto('/tools/curl-converter/');
    const input = page.locator('#curl-converter-input');
    const output = page.locator('#curl-converter-output');

    await input.fill('curl -u me:pw -k https://a.test/x');
    await expect(output).toHaveValue(/"Authorization": "Basic /);
    await expect(page.locator('#curl-converter-warnings li')).toHaveCount(1);

    await input.fill('wget https://a.test');
    await expect(page.locator('#curl-converter-error')).toBeVisible();
    await expect(output).toHaveValue('');

    await input.fill('');
    await expect(page.locator('#curl-converter-error')).toBeHidden();
  });
});

test.describe('cURL to Fetch / Axios Converter (en)', () => {
  test('displays and converts', async ({ page }) => {
    await page.goto('/en/tools/curl-converter/');
    await expect(page.locator('main h1')).toHaveText(
      'cURL to Fetch / Axios Converter',
    );
    await expect(page.locator('#curl-converter-output')).toHaveValue(
      /await fetch\(/,
    );
  });
});
