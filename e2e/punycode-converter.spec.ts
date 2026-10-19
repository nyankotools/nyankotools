import { test, expect } from './helpers/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Punycode変換（日本語版）', () => {
  test('日本語ドメインをxn--形式にできる', async ({ page }) => {
    await page.goto('/tools/punycode-converter/');

    await page.locator('#puny-input').fill('日本語.jp');
    await expect(page.locator('#puny-output')).toHaveValue('xn--wgv71a119e.jp');
  });

  test('逆変換と文字列のみモードができる', async ({ page }) => {
    await page.goto('/tools/punycode-converter/');

    await page.locator('#puny-direction [data-direction="decode"]').click();
    await page.locator('#puny-input').fill('xn--wgv71a119e.jp');
    await expect(page.locator('#puny-output')).toHaveValue('日本語.jp');

    await page.locator('#puny-scope [data-scope="raw"]').click();
    await page.locator('#puny-input').fill('wgv71a119e');
    await expect(page.locator('#puny-output')).toHaveValue('日本語');
  });

  test('不正な入力でエラーが表示される', async ({ page }) => {
    await page.goto('/tools/punycode-converter/');

    await page.locator('#puny-direction [data-direction="decode"]').click();
    await page.locator('#puny-input').fill('xn--a!b.jp');
    await expect(page.locator('#puny-error')).toBeVisible();
    await expect(page.locator('#puny-error')).toContainText('「!」');
    await expect(page.locator('#puny-output')).toHaveValue('');
  });

  test('コピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/punycode-converter/');

    await page.locator('#puny-input').fill('日本語.jp');
    await page.locator('#puny-copy-button').click();
    await expect(page.locator('#puny-status')).toHaveText('コピーしました');
  });
});

test.describe('Punycode Converter (English)', () => {
  test('英語版で変換できる', async ({ page }) => {
    await page.goto('/en/tools/punycode-converter/');

    await page.locator('#puny-input').fill('münchen.de');
    await expect(page.locator('#puny-output')).toHaveValue('xn--mnchen-3ya.de');

    await page.locator('#puny-scope [data-scope="raw"]').click();
    await page.locator('#puny-input').fill('münchen');
    await expect(page.locator('#puny-output')).toHaveValue('mnchen-3ya');
  });
});

test.describe('Punycode変換のアクセシビリティ', () => {
  test('日本語版・英語版でaxe違反がない', async ({ page }) => {
    for (const path of [
      '/tools/punycode-converter/',
      '/en/tools/punycode-converter/',
    ]) {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(results.violations.map((v) => v.id)).toEqual([]);
    }
  });
});
