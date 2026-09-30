import { test, expect } from '@playwright/test';
import { tools, type Locale } from '../src/data/tools';

// 全ツール共通の定型検証を、ツール登録簿（src/data/tools.ts）から自動生成する。
//   - ページが表示される（h1が1つだけ表示される）
//   - 375px幅でも横スクロールが発生しない（growth.md のレスポンシブ要件）
//   - サイドバーのリンクからツールページへ遷移できる
// 日本語版・英語版の両方を対象にする。ツール固有の操作や表示は各ツールのspecで検証する。
// 新しいツールを src/data/tools.ts に登録すれば、この検証は自動的に対象に含まれる。

const locales: { locale: Locale; prefix: string }[] = [
  { locale: 'ja', prefix: '' },
  { locale: 'en', prefix: '/en' },
];

for (const { locale, prefix } of locales) {
  test.describe(`全ツール共通（${locale}）`, () => {
    for (const tool of tools) {
      const toolPath = `${prefix}/tools/${tool.slug}/`;

      test(`${tool.slug}: 375px幅で表示され、横スクロールが発生しない`, async ({
        page,
      }) => {
        await page.setViewportSize({ width: 375, height: 800 });
        await page.goto(toolPath);

        await expect(page.locator('main h1')).toBeVisible();

        const hasHorizontalOverflow = await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth + 1,
        );
        expect(hasHorizontalOverflow).toBe(false);
      });

      test(`${tool.slug}: FAQを展開した375px幅でも横スクロールが発生しない`, async ({
        page,
      }) => {
        await page.setViewportSize({ width: 375, height: 800 });
        await page.goto(toolPath);

        // FAQを持たないツールでも失敗させない（開くのは存在するものだけ）
        await page.evaluate(() => {
          document
            .querySelectorAll('[data-faq] details')
            .forEach((d) => d.setAttribute('open', ''));
        });

        const hasHorizontalOverflow = await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth + 1,
        );
        expect(hasHorizontalOverflow).toBe(false);
      });

      test(`${tool.slug}: サイドバーからツールページへ遷移できる`, async ({
        page,
      }) => {
        await page.goto(`${prefix}/`);

        // トップページではアクティブなツールがないため、カテゴリの<details>は
        // 初期状態で閉じており、中のリンクはアクセシビリティツリー上に現れない。
        // href指定で（隠れていても）要素を取得し、先に該当カテゴリを開いてから
        // リンクをクリックする。
        const link = page.locator(`#sidebar a[href="${toolPath}"]`);
        await expect(link).toContainText(tool.translations[locale].name);
        await link.locator('xpath=ancestor::details[1]/summary').click();
        await link.click();

        // 先頭をオリジン直後に固定し、ja のリンクが /en/ ページへ遷移しても通らないようにする
        await expect(page).toHaveURL(
          new RegExp(`^https?://[^/]+${toolPath}?$`),
        );
        await expect(page.locator('main h1')).toBeVisible();
      });
    }
  });
}
