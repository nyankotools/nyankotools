import { test, expect } from './helpers/test';

const paths = [
  { path: '/tools/htaccess-generator/', copied: 'コピーしました' },
  { path: '/en/tools/htaccess-generator/', copied: 'Copied' },
];

for (const { path, copied } of paths) {
  test.describe(`.htaccess生成 ${path}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('#htg-output')).not.toHaveValue('');
    });

    test('初期状態ではHTTPS強制のルールが出力される', async ({ page }) => {
      const out = page.locator('#htg-output');
      await expect(out).toHaveValue(/RewriteCond %\{HTTPS\} off/);
      await expect(out).toHaveValue(
        /RewriteRule \^ https:\/\/%\{HTTP_HOST\}%\{REQUEST_URI\} \[L,R=301\]/,
      );
      await expect(page.locator('#htg-issues')).toContainText('Cloudflare');
    });

    test('プロキシ配下にするとX-Forwarded-Protoが加わり、ループの注意が消える', async ({
      page,
    }) => {
      await page.locator('#htg-behind-proxy').check();
      await expect(page.locator('#htg-output')).toHaveValue(
        /X-Forwarded-Proto/,
      );
      await expect(page.locator('#htg-issues')).not.toContainText('Cloudflare');
    });

    test('www統一はドメイン未入力だとエラーになり、入力すると出力される', async ({
      page,
    }) => {
      await page.locator('#htg-www').selectOption('add');
      await expect(page.locator('#htg-issues li').first()).toHaveClass(
        /text-red/,
      );
      await expect(page.locator('#htg-output')).not.toHaveValue(
        /HTTP_HOST\} \^/,
      );

      await page.locator('#htg-domain').fill('https://www.Example.com/');
      await expect(page.locator('#htg-output')).toHaveValue(
        /RewriteCond %\{HTTP_HOST\} \^example\\\.com\$ \[NC\]/,
      );
      await expect(page.locator('#htg-output')).toHaveValue(
        /https:\/\/www\.example\.com%\{REQUEST_URI\}/,
      );
      await expect(page.locator('#htg-issues li.text-red-700')).toHaveCount(0);
    });

    test('個別URLのリダイレクトが出力され、不正な行とループが指摘される', async ({
      page,
    }) => {
      await page.locator('#htg-force-https').uncheck();
      await page
        .locator('#htg-redirects')
        .fill('/old.html /new\n/a https://example.com/b 302');
      await expect(page.locator('#htg-output')).toHaveValue(
        /RedirectMatch 301 "\^\/old\\\.html\$" "\/new"/,
      );
      await expect(page.locator('#htg-output')).toHaveValue(
        /RedirectMatch 302 "\^\/a\$" "https:\/\/example\.com\/b"/,
      );

      await page.locator('#htg-redirects').fill('bad\n/x /x');
      await expect(page.locator('#htg-issues li.text-red-700')).toHaveCount(2);
      await expect(page.locator('#htg-output')).toHaveValue('');
    });

    test('ディレクトリ一覧の無効化とエラーページが出力される', async ({
      page,
    }) => {
      await page.locator('#htg-force-https').uncheck();
      await page.locator('#htg-disable-indexes').check();
      await page.locator('#htg-error-404').fill('/404.html');
      await expect(page.locator('#htg-output')).toHaveValue(
        /Options -Indexes[\s\S]*ErrorDocument 404 \/404\.html/,
      );
    });

    test('コピーできる', async ({ page, context }) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      await page.locator('#htg-copy-button').click();
      await expect(page.locator('#htg-status')).toHaveText(copied);
    });

    test('htaccess.txt としてダウンロードできる', async ({ page }) => {
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.locator('#htg-download-button').click(),
      ]);
      expect(download.suggestedFilename()).toBe('htaccess.txt');
    });
  });
}
