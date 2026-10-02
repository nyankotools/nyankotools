import { test, expect } from './helpers/test';
import AxeBuilder from '@axe-core/playwright';
import { tools, type Locale } from '../src/data/tools';

// 全ツール共通の定型検証を、ツール登録簿（src/data/tools.ts）から自動生成する。
//   - ページが表示される（h1が1つだけ表示される）
//   - 375px幅（FAQ展開時を含む）でも横スクロールが発生しない（growth.md のレスポンシブ要件）
//   - フッターが main の最後の子である
//   - サイドバーに全ツールへのリンクがあり、各カテゴリの先頭ツールへ遷移できる
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

      // ページ読み込みを減らすため、同じ条件（viewport）で確認できる検証を1テストにまとめる。
      // 独立した検証は expect.soft にして、1件失敗しても残りの結果を同時に報告する。
      test(`${tool.slug}: 375px幅で表示され、FAQ展開時も横スクロールが発生しない`, async ({
        page,
      }) => {
        await page.setViewportSize({ width: 375, height: 800 });
        await page.goto(toolPath);

        await expect.soft(page.locator('main h1')).toBeVisible();

        const hasOverflow = () =>
          page.evaluate(
            () => document.documentElement.scrollWidth > window.innerWidth + 1,
          );
        expect.soft(await hasOverflow(), '375px幅で横スクロール').toBe(false);

        // FAQを持たないツールでも失敗させない（開くのは存在するものだけ）
        await page.evaluate(() => {
          document
            .querySelectorAll('[data-faq] details')
            .forEach((d) => d.setAttribute('open', ''));
        });
        expect
          .soft(await hasOverflow(), 'FAQ展開後の375px幅で横スクロール')
          .toBe(false);
      });

      test(`${tool.slug}: フッターがmainの最後の子で、axeでアクセシビリティ違反（WCAG 2.x A/AA）がない`, async ({
        page,
      }) => {
        await page.goto(toolPath);
        await expect(page.locator('main h1')).toBeVisible();

        await expect
          .soft(page.locator('main > *').last())
          .toHaveJSProperty('tagName', 'FOOTER');

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
        expect.soft(summary).toEqual([]);
      });
    }

    // サイドバーはツール共通のコンポーネントなので、全ツールを毎回クリックして遷移はしない。
    //   - 全ツールのリンク（href・表示名）が存在することは、1回の読み込みで一括検証する
    //   - 実際のクリック遷移は、各カテゴリの先頭ツール1件で検証する
    test('sidebar: 全ツールへのリンクが正しいhrefと表示名で存在する', async ({
      page,
    }) => {
      await page.goto(`${prefix}/`);

      // 閉じた<details>内のリンクも textContent / href では取得できる
      const links = await page.evaluate(() =>
        Array.from(document.querySelectorAll('#sidebar a')).map((a) => ({
          href: a.getAttribute('href'),
          text: (a.textContent ?? '').trim(),
        })),
      );

      const problems: string[] = [];
      for (const tool of tools) {
        const toolPath = `${prefix}/tools/${tool.slug}/`;
        const name = tool.translations[locale].name;
        const matched = links.filter((l) => l.href === toolPath);
        if (matched.length !== 1) {
          problems.push(`${tool.slug}: リンク数 ${matched.length}（期待値 1）`);
        } else if (!matched[0].text.includes(name)) {
          problems.push(
            `${tool.slug}: 表示名 "${matched[0].text}" に "${name}" がない`,
          );
        }
      }
      expect(problems).toEqual([]);
    });

    const firstToolOfCategory = new Map<string, (typeof tools)[number]>();
    for (const tool of tools) {
      if (!firstToolOfCategory.has(tool.category)) {
        firstToolOfCategory.set(tool.category, tool);
      }
    }

    for (const [category, tool] of firstToolOfCategory) {
      const toolPath = `${prefix}/tools/${tool.slug}/`;

      test(`sidebar: ${category}カテゴリの先頭ツール(${tool.slug})へサイドバーから遷移できる`, async ({
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
