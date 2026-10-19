import { test, expect } from './helpers/test';

const paths = [
  { path: '/tools/nginx-redirect-generator/', copied: 'コピーしました' },
  { path: '/en/tools/nginx-redirect-generator/', copied: 'Copied' },
];

for (const { path, copied } of paths) {
  test.describe(`nginxリダイレクト設定生成 ${path}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('#nrg-output')).not.toHaveValue('');
    });

    test('初期状態ではHTTPSへの301を行うserverブロックが出力される', async ({
      page,
    }) => {
      await expect(page.locator('#nrg-output')).toHaveValue(
        /return 301 https:\/\/\$host\$request_uri;/,
      );
    });

    test('プロキシ配下にするとX-Forwarded-Protoの判定になる', async ({
      page,
    }) => {
      await page.locator('#nrg-behind-proxy').check();
      await expect(page.locator('#nrg-output')).toHaveValue(
        /\$http_x_forwarded_proto = "http"/,
      );
    });

    test('www統一はドメイン未入力だとエラー、入力すると出力される', async ({
      page,
    }) => {
      await page.locator('#nrg-www').selectOption('remove');
      await expect(page.locator('#nrg-issues li').first()).toHaveClass(
        /text-red/,
      );
      await page.locator('#nrg-domain').fill('https://www.Example.com/');
      await expect(page.locator('#nrg-output')).toHaveValue(
        /server_name www\.example\.com;/,
      );
      await expect(page.locator('#nrg-output')).toHaveValue(
        /return 301 https:\/\/example\.com\$request_uri;/,
      );
      await expect(page.locator('#nrg-issues li.text-red-700')).toHaveCount(0);
    });

    test('個別URLのリダイレクトが出力され、危険な行とループが指摘される', async ({
      page,
    }) => {
      await page.locator('#nrg-force-https').uncheck();
      await page
        .locator('#nrg-redirects')
        .fill('/old.html /new\n/a https://example.com/b 302');
      await expect(page.locator('#nrg-output')).toHaveValue(
        /location = "\/old\.html" \{\s+return 301 "\/new";/,
      );
      await expect(page.locator('#nrg-output')).toHaveValue(
        /return 302 "https:\/\/example\.com\/b";/,
      );

      await page.locator('#nrg-redirects').fill('/a /b;return_200\n/x /x');
      await expect(page.locator('#nrg-issues li.text-red-700')).toHaveCount(2);
      await expect(page.locator('#nrg-output')).toHaveValue('');
    });

    test('末尾スラッシュ設定と個別リダイレクトの併用で警告が出る（エラーではない）', async ({
      page,
    }) => {
      await page.locator('#nrg-force-https').uncheck();
      await page.locator('#nrg-redirects').fill('/old /new');
      await expect(page.locator('#nrg-issues li.text-red-700')).toHaveCount(0);
      await expect(page.locator('#nrg-issues li.text-amber-800')).toHaveCount(
        0,
      );
      await expect(page.locator('#nrg-output')).toHaveValue(
        /location = "\/old" \{/,
      );

      await page.locator('#nrg-slash').selectOption('add');
      await expect(page.locator('#nrg-issues li.text-amber-800')).toHaveCount(
        1,
      );
      await expect(page.locator('#nrg-issues li.text-amber-800')).toContainText(
        /末尾スラッシュ|Trailing-slash/,
      );
      await expect(page.locator('#nrg-issues li.text-red-700')).toHaveCount(0);
      await expect(page.locator('#nrg-output')).toHaveValue(
        /location = "\/old" \{/,
      );
    });

    test('コピーできる', async ({ page, context }) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      await page.locator('#nrg-copy-button').click();
      await expect(page.locator('#nrg-status')).toHaveText(copied);
    });

    test('nginx-redirect.conf としてダウンロードできる', async ({ page }) => {
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.locator('#nrg-download-button').click(),
      ]);
      expect(download.suggestedFilename()).toBe('nginx-redirect.conf');
    });
  });
}
