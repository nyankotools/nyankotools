import { test, expect } from './helpers/test';

const SVG =
  '<svg width="10" height="10"><rect width="10" height="10" fill="#f00"/></svg>';

test.describe('SVG→Data URI変換', () => {
  test('SVGを貼り付けるとCSSとData URIが出力される', async ({ page }) => {
    await page.goto('/tools/svg-to-data-uri/');
    await page.locator('#svg-to-data-uri-input').fill(SVG);

    const css = page.locator('#svg-to-data-uri-css');
    await expect(css).toHaveValue(
      /^background-image: url\("data:image\/svg\+xml,/,
    );
    await expect(css).toHaveValue(/%23f00/);
    await expect(page.locator('#svg-to-data-uri-preview')).toHaveAttribute(
      'src',
      /^data:image\/svg\+xml,/,
    );
  });

  test('Base64方式に切り替えられる', async ({ page }) => {
    await page.goto('/tools/svg-to-data-uri/');
    await page.locator('#svg-to-data-uri-input').fill(SVG);
    await page
      .locator('#svg-to-data-uri-method [data-method="base64"]')
      .click();
    await expect(page.locator('#svg-to-data-uri-uri')).toHaveValue(
      /^data:image\/svg\+xml;base64,/,
    );
  });

  test('SVGでない入力はエラーを表示する', async ({ page }) => {
    await page.goto('/tools/svg-to-data-uri/');
    await page.locator('#svg-to-data-uri-input').fill('hello');
    await expect(page.locator('#svg-to-data-uri-error')).toBeVisible();
    await expect(page.locator('#svg-to-data-uri-result')).toBeHidden();
  });

  test('コピーボタンでCSSをコピーできる（英語版）', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/en/tools/svg-to-data-uri/');
    await page.locator('#svg-to-data-uri-input').fill(SVG);
    await page.locator('#svg-to-data-uri-layout').check();
    await page.locator('#svg-to-data-uri-copy-button').click();
    await expect(page.locator('#svg-to-data-uri-status')).toHaveText('Copied');
    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text).toContain('background-size: contain;');
  });
});
