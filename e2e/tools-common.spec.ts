import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { tools, type Locale } from '../src/data/tools';

// 全ツール共通の定型検証を、ツール登録簿（src/data/tools.ts）から自動生成する。
//   - ページが表示される（h1が1つだけ表示される）
//   - 375px幅でも横スクロールが発生しない（growth.md のレスポンシブ要件）
//   - サイドバーのリンクからツールページへ遷移できる
//   - axe（WCAG 2.x A/AA）でコントラスト・ラベル欠落などの違反がない
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

      test(`${tool.slug}: フッターがmainの最後の子で、ツール本体より下にある`, async ({
        page,
      }) => {
        await page.goto(toolPath);
        await expect(page.locator('main > *').last()).toHaveJSProperty(
          'tagName',
          'FOOTER',
        );
      });

      test(`${tool.slug}: axeでアクセシビリティ違反（WCAG 2.x A/AA）がない`, async ({
        page,
      }) => {
        await page.goto(toolPath);
        await expect(page.locator('main h1')).toBeVisible();

        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();

        // 失敗時に原因が分かるよう、ルールID・影響度・対象セレクタを出す
        const summary = results.violations.map(
          (v) =>
            `${v.id} (${v.impact}): ${v.nodes
              .slice(0, 3)
              .map((n) => n.target.join(' '))
              .join(' | ')}`,
        );
        expect(summary).toEqual([]);
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
