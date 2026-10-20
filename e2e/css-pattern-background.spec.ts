import { test, expect } from './helpers/test';

test.describe('CSSパターン背景ジェネレーター', () => {
  test('初期状態でストライプのCSSが生成される', async ({ page }) => {
    await page.goto('/tools/css-pattern-background/');

    await expect(page.locator('#cp-css-output')).toHaveValue(
      /repeating-linear-gradient\(45deg, #2563eb 0 10px, #ffffff 10px 20px\)/,
    );
    await expect(page.locator('#cp-preview')).toHaveCSS(
      'background-color',
      'rgb(255, 255, 255)',
    );
  });

  test('ドットに切り替えるとradial-gradientになり、角度欄が隠れる', async ({
    page,
  }) => {
    await page.goto('/tools/css-pattern-background/');

    await page.locator('[data-kind="dot"]').click();
    await expect(page.locator('#cp-css-output')).toHaveValue(
      /radial-gradient\(circle/,
    );
    await expect(page.locator('#cp-css-output')).toHaveValue(
      /background-size: 20px 20px;/,
    );
    await expect(page.locator('#cp-angle')).toBeHidden();
  });

  test('色コードの入力が反映され、不正値は無視される', async ({ page }) => {
    await page.goto('/tools/css-pattern-background/');

    await page.locator('#cp-pattern-hex').fill('#ff0000');
    await expect(page.locator('#cp-css-output')).toHaveValue(/#ff0000 0 10px/);
    await page.locator('#cp-pattern-hex').fill('red;} body{x');
    await expect(page.locator('#cp-css-output')).not.toHaveValue(/body/);
  });

  test('SVG形式に切り替えるとSVGとdata URIが表示される', async ({ page }) => {
    await page.goto('/tools/css-pattern-background/');

    await page.locator('[data-mode="svg"]').click();
    await expect(page.locator('#cp-svg-output')).toHaveValue(/<svg xmlns=/);
    await expect(page.locator('#cp-svg-css-output')).toHaveValue(
      /url\("data:image\/svg\+xml,/,
    );
    await expect(page.locator('#cp-css-output')).toBeHidden();
    // CSPでdata:が使えなくても、プレビューはblob:で表示される
    await expect(page.locator('#cp-preview')).toHaveCSS(
      'background-image',
      /blob:/,
    );
  });

  test('コピーボタンでCSSをコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/css-pattern-background/');

    const css = await page.locator('#cp-css-output').inputValue();
    await page.locator('#cp-copy-button').click();
    await expect(page.locator('#cp-status')).toHaveText('コピーしました');
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied.replace(/\r\n/g, '\n')).toBe(css);
  });
});

test.describe('CSS Pattern Background Generator (English)', () => {
  test('applies a preset and copies the code', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/en/tools/css-pattern-background/');

    await page.getByRole('button', { name: 'Checkerboard' }).click();
    await expect(page.locator('#cp-css-output')).toHaveValue(/conic-gradient/);
    await expect(page.locator('#cp-css-output')).toHaveValue(
      /background-size: 40px 40px;/,
    );

    await page.locator('#cp-copy-button').click();
    await expect(page.locator('#cp-status')).toHaveText('Copied');
  });
});
