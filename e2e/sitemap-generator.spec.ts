import { test, expect } from './helpers/test';

const paths = [
  { locale: 'ja', url: '/tools/sitemap-generator/', copied: 'コピーしました' },
  { locale: 'en', url: '/en/tools/sitemap-generator/', copied: 'Copied' },
];

for (const { locale, url, copied } of paths) {
  test.describe(`sitemap.xml generator (${locale})`, () => {
    test('URL一覧からXMLを生成し、無効・重複を除外する', async ({ page }) => {
      await page.goto(url);
      await page
        .locator('#sitemap-gen-input')
        .fill(
          'https://example.com/\nhttps://example.com/a?x=1&y=2\nnot a url\nhttps://example.com\nftp://example.com/f',
        );
      await page.locator('#sitemap-gen-lastmod').fill('2026-10-13');
      await page.locator('#sitemap-gen-changefreq').selectOption('weekly');
      await page.locator('#sitemap-gen-priority').fill('0.8');

      const output = page.locator('#sitemap-gen-output');
      await expect(output).toHaveValue(/<loc>https:\/\/example\.com\/<\/loc>/);
      await expect(output).toHaveValue(/x=1&amp;y=2/);
      await expect(output).toHaveValue(/<lastmod>2026-10-13<\/lastmod>/);
      await expect(output).toHaveValue(/<changefreq>weekly<\/changefreq>/);
      await expect(output).toHaveValue(/<priority>0\.8<\/priority>/);
      await expect(page.locator('#sitemap-gen-summary')).toContainText('2');
      await expect(page.locator('#sitemap-gen-issues li')).toHaveCount(3);
    });

    test('行ごとの上書きが反映される', async ({ page }) => {
      await page.goto(url);
      await page.locator('#sitemap-gen-priority').fill('0.5');
      await page
        .locator('#sitemap-gen-input')
        .fill('https://example.com/a 2025-01-02 daily 1');
      const output = page.locator('#sitemap-gen-output');
      await expect(output).toHaveValue(/<lastmod>2025-01-02<\/lastmod>/);
      await expect(output).toHaveValue(/<changefreq>daily<\/changefreq>/);
      await expect(output).toHaveValue(/<priority>1\.0<\/priority>/);
    });

    test('コピーとダウンロードができる', async ({ page, context }) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      await page.goto(url);
      await page.locator('#sitemap-gen-input').fill('https://example.com/');

      await page.locator('#sitemap-gen-copy-button').click();
      await expect(page.locator('#sitemap-gen-status')).toContainText(copied);

      const downloadPromise = page.waitForEvent('download');
      await page.locator('#sitemap-gen-download').click();
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe('sitemap.xml');
    });

    test('50,000件を超えると分割され、インデックスが付く', async ({ page }) => {
      test.setTimeout(120000);
      await page.goto(url);
      // 巨大な入力は fill だと遅いので、値を直接入れて input を発火させる
      await page.locator('#sitemap-gen-input').evaluate((el) => {
        const ta = el as HTMLTextAreaElement;
        ta.value = Array.from(
          { length: 50001 },
          (_, i) => `https://example.com/p${i}`,
        ).join('\n');
        ta.dispatchEvent(new Event('input', { bubbles: true }));
      });

      await expect(page.locator('#sitemap-gen-file option')).toHaveCount(3, {
        timeout: 60000,
      });
      await expect(page.locator('#sitemap-gen-split')).toBeVisible();
      await expect(page.locator('#sitemap-gen-file')).toHaveValue(
        'sitemap-1.xml',
      );
    });

    test('入力が空のときはボタンが無効になる', async ({ page }) => {
      await page.goto(url);
      await expect(page.locator('#sitemap-gen-download')).toBeDisabled();
      await expect(page.locator('#sitemap-gen-output')).toHaveValue('');
    });
  });
}
