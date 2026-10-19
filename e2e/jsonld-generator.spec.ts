import { test, expect } from './helpers/test';

for (const [label, path] of [
  ['日本語版', '/tools/jsonld-generator/'],
  ['English', '/en/tools/jsonld-generator/'],
] as const) {
  test.describe(`JSON-LD generator (${label})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(path);
      await page.waitForFunction(
        () => document.getElementById('jld-type') !== null,
      );
    });

    test('FAQ入力からFAQPageのscriptタグが生成される', async ({ page }) => {
      await page.locator('#jld-faq').fill('Q1\nA1');
      const output = page.locator('#jld-output');
      await expect(output).toHaveValue(/<script type="application\/ld\+json">/);
      await expect(output).toHaveValue(/"@type": "FAQPage"/);
      await expect(output).toHaveValue(/"name": "Q1"/);
    });

    test('種類を切り替えると入力欄と出力が切り替わる', async ({ page }) => {
      await page.locator('#jld-type').selectOption('breadcrumb');
      await expect(page.locator('#jld-breadcrumb')).toBeVisible();
      await expect(page.locator('#jld-faq')).toBeHidden();
      await page.locator('#jld-breadcrumb').fill('Home | https://a.com/\nPage');
      await expect(page.locator('#jld-output')).toHaveValue(/BreadcrumbList/);
      await expect(page.locator('#jld-output')).toHaveValue(/"position": 2/);
    });

    test('商品の価格が出力される', async ({ page }) => {
      await page.locator('#jld-type').selectOption('product');
      await page.locator('#jld-product-name').fill('Item');
      await page.locator('#jld-price').fill('1,980');
      await expect(page.locator('#jld-output')).toHaveValue(/"price": "1980"/);
    });

    test('</script> を含む入力がエスケープされる', async ({ page }) => {
      await page.locator('#jld-faq').fill('Q</script>\nA');
      const output = page.locator('#jld-output');
      await expect(output).toHaveValue(/u003c\/script/);
      const inner = (await output.inputValue())
        .replace('<script type="application/ld+json">', '')
        .replace(/<\/script>$/, '');
      expect(inner).not.toContain('<');
    });

    test('コピーできる', async ({ page, context }) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      await page.locator('#jld-faq').fill('Q\nA');
      await page.locator('#jld-copy-button').click();
      await expect(page.locator('#jld-status')).not.toHaveText('');
    });
  });
}
