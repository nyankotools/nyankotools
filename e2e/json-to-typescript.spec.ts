import { test, expect } from './helpers/test';

test.describe('JSON→TypeScript型生成', () => {
  test('サンプルから型が生成され、オプションで切り替わる', async ({ page }) => {
    await page.goto('/tools/json-to-typescript/');
    await expect(page.locator('main h1')).toHaveText('JSON→TypeScript型生成');

    const output = page.locator('#j2ts-output');
    await expect(output).toHaveValue(/interface Root \{/);
    await expect(output).toHaveValue(/coupon\?: string;/);
    await expect(output).toHaveValue(/interface Orders \{/);

    await page.locator('[data-style="type"]').click();
    await expect(output).toHaveValue(/type Root = \{/);
    await page.locator('#j2ts-export').check();
    await expect(output).toHaveValue(/export type Root = \{/);
    await page.locator('#j2ts-root-name').fill('ApiResponse');
    await expect(output).toHaveValue(/export type ApiResponse = \{/);
  });

  test('不正なJSONはエラーになり、空にすると消える', async ({ page }) => {
    await page.goto('/tools/json-to-typescript/');
    const input = page.locator('#j2ts-input');
    await input.fill('{a:1}');
    await expect(page.locator('#j2ts-error')).toBeVisible();
    await expect(page.locator('#j2ts-output')).toHaveValue('');
    await input.fill('');
    await expect(page.locator('#j2ts-error')).toBeHidden();
  });
});

test.describe('JSON to TypeScript Converter (en)', () => {
  test('displays and converts', async ({ page }) => {
    await page.goto('/en/tools/json-to-typescript/');
    await expect(page.locator('main h1')).toHaveText(
      'JSON to TypeScript Converter',
    );
    await expect(page.locator('#j2ts-output')).toHaveValue(/interface Root/);
  });
});
