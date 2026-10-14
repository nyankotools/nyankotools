import { test, expect } from './helpers/test';
import AxeBuilder from '@axe-core/playwright';

const html =
  '<h1>Title</h1><p>Hello <b>world</b> &amp; <a href="https://example.com/">link</a></p><script>alert(1)</script>';

test.describe('HTMLタグ除去', () => {
  test('日本語版: タグとscriptを除去し、リンクURLのオプションが効く', async ({
    page,
  }) => {
    await page.goto('/tools/html-tag-stripper/');
    await page.locator('#hts-input').fill(html);
    await expect(page.locator('#hts-output')).toHaveValue(
      'Title\n\nHello world & link',
    );

    await page.locator('#hts-opt-keepLinkUrls').check();
    await expect(page.locator('#hts-output')).toHaveValue(
      'Title\n\nHello world & link (https://example.com/)',
    );

    // textarea の内容は value で検証する（toContainText は textContent を見るため空になる）
    await page.locator('#hts-opt-decodeEntities').uncheck();
    await expect(page.locator('#hts-output')).toHaveValue(
      'Title\n\nHello world &amp; link (https://example.com/)',
    );
  });

  test('入力に含まれるスクリプトは実行されず、結果のaxe違反もない', async ({
    page,
  }) => {
    await page.goto('/tools/html-tag-stripper/');
    await page
      .locator('#hts-input')
      .fill(
        '<img src="x" onerror="window.__pwned=1">本文<script>window.__pwned=2</script>',
      );
    await expect(page.locator('#hts-output')).toHaveValue('本文');
    expect(
      await page.evaluate(() => (window as { __pwned?: number }).__pwned),
    ).toBeUndefined();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });

  test('英語版も動作する', async ({ page }) => {
    await page.goto('/en/tools/html-tag-stripper/');
    await expect(page.locator('main h1')).toContainText('HTML Tag Stripper');
    await page.locator('#hts-input').fill('<p>a</p><p>b</p>');
    await expect(page.locator('#hts-output')).toHaveValue('a\n\nb');
    await page.locator('#hts-opt-compressBlankLines').uncheck();
    await expect(page.locator('#hts-output')).toHaveValue('a\n\nb');
  });
});
