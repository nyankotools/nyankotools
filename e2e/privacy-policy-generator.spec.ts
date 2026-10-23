import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test('プライバシーポリシー: 初期表示でaxeの違反がない', async ({ page }) => {
  for (const path of [
    '/tools/privacy-policy-generator/',
    '/en/tools/privacy-policy-generator/',
  ]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(
      results.violations.map((v) => v.id),
      path,
    ).toEqual([]);
  }
});

const paths = [
  {
    path: '/tools/privacy-policy-generator/',
    copied: 'コピーしました',
    intro: 'のプライバシーポリシー',
    placeholder: '【サイト名】',
    adsense: 'Google AdSense',
  },
  {
    path: '/en/tools/privacy-policy-generator/',
    copied: 'Copied',
    intro: 'Privacy Policy',
    placeholder: '[Site name]',
    adsense: 'Google AdSense',
  },
];

for (const { path, copied, placeholder, adsense } of paths) {
  test.describe(`プライバシーポリシー生成 ${path}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('#pp-output')).not.toHaveValue('');
    });

    test('初期状態ではプレースホルダーと制定日が入り、確認事項が出る', async ({
      page,
    }) => {
      await expect(page.locator('#pp-output')).toHaveValue(
        new RegExp(placeholder.replace(/[[\]]/g, '\\$&')),
      );
      await expect(page.locator('#pp-enacted')).toHaveValue(
        /^\d{4}-\d{2}-\d{2}$/,
      );
      await expect(page.locator('#pp-issues li')).toHaveCount(3);
    });

    test('入力した値が出力に反映される', async ({ page }) => {
      await page.locator('#pp-site').fill('テストサイト');
      await page.locator('#pp-operator').fill('山田太郎');
      await page.locator('#pp-contact').fill('info@example.com');
      await page.locator('#pp-enacted').fill('2026-10-23');
      const output = page.locator('#pp-output');
      await expect(output).toHaveValue(/テストサイト/);
      await expect(output).toHaveValue(/info@example\.com/);
      await expect(output).toHaveValue(/2026/);
      await expect(page.locator('#pp-issues li')).toHaveCount(0);
    });

    test('AdSenseにチェックすると定型文が加わる', async ({ page }) => {
      await expect(page.locator('#pp-output')).not.toHaveValue(
        new RegExp(adsense),
      );
      await page.locator('#pp-adsense').check();
      await expect(page.locator('#pp-output')).toHaveValue(new RegExp(adsense));
    });

    test('コピーできる', async ({ page, context }) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      await page.locator('#pp-copy-button').click();
      await expect(page.locator('#pp-status')).toHaveText(copied);
    });

    test('テキストとしてダウンロードできる', async ({ page }) => {
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.locator('#pp-download-button').click(),
      ]);
      expect(download.suggestedFilename()).toBe('privacy-policy.txt');
    });
  });
}
