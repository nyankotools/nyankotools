import { test, expect } from './helpers/test';

const paths = [
  { path: '/tools/robots-txt-generator/', copied: 'コピーしました' },
  { path: '/en/tools/robots-txt-generator/', copied: 'Copied' },
];

for (const { path, copied } of paths) {
  test.describe(`robots.txt生成 ${path}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('#rtg-groups [data-group]')).toHaveCount(1);
    });

    test('初期状態では User-agent: * と空の Disallow が出力される', async ({
      page,
    }) => {
      await expect(page.locator('#rtg-output')).toHaveValue(
        'User-agent: *\nDisallow:\n',
      );
    });

    test('Disallow・Allow・Sitemap を入力すると出力に反映される', async ({
      page,
    }) => {
      const group = page.locator('#rtg-groups [data-group]').first();
      await group.locator('[data-field="disallow"]').fill('/admin/');
      await group.locator('[data-field="allow"]').fill('/admin/public/');
      await page
        .locator('#rtg-sitemaps')
        .fill('https://example.com/sitemap.xml');

      await expect(page.locator('#rtg-output')).toHaveValue(
        'User-agent: *\nDisallow: /admin/\nAllow: /admin/public/\n\nSitemap: https://example.com/sitemap.xml\n',
      );
    });

    test('AIボットのプリセットで初期グループが置き換わる', async ({ page }) => {
      await page.locator('[data-rtg-preset="blockAi"]').click();
      await expect(page.locator('#rtg-groups [data-group]')).toHaveCount(1);
      await expect(page.locator('#rtg-output')).toHaveValue(
        /User-agent: GPTBot/,
      );
      await expect(page.locator('#rtg-output')).toHaveValue(
        /User-agent: ClaudeBot/,
      );
      await expect(page.locator('#rtg-output')).toHaveValue(/Disallow: \//);
    });

    test('グループを追加・削除できる', async ({ page }) => {
      await page.locator('#rtg-add-group').click();
      await expect(page.locator('#rtg-groups [data-group]')).toHaveCount(2);
      await page.locator('#rtg-groups [data-remove]').first().click();
      await expect(page.locator('#rtg-groups [data-group]')).toHaveCount(1);
    });

    test('クローラーを選ぶと User-agent 欄に追加される', async ({ page }) => {
      const group = page.locator('#rtg-groups [data-group]').first();
      await group.locator('[data-field="crawler"]').selectOption('GPTBot');
      await expect(group.locator('[data-field="userAgents"]')).toHaveValue(
        '*, GPTBot',
      );
    });

    test('/ で始まらないパスと全体Disallowで確認事項が表示される', async ({
      page,
    }) => {
      const group = page.locator('#rtg-groups [data-group]').first();
      await group.locator('[data-field="disallow"]').fill('admin');
      await expect(page.locator('#rtg-issues li')).toHaveCount(1);
      await expect(page.locator('#rtg-issues')).toContainText('admin');

      await group.locator('[data-field="disallow"]').fill('/');
      await expect(page.locator('#rtg-issues')).toContainText('Disallow: /');
    });

    test('コピーできる', async ({ page, context }) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      await page.locator('#rtg-copy-button').click();
      await expect(page.locator('#rtg-status')).toHaveText(copied);
    });

    test('robots.txt としてダウンロードできる', async ({ page }) => {
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.locator('#rtg-download-button').click(),
      ]);
      expect(download.suggestedFilename()).toBe('robots.txt');
    });
  });
}
