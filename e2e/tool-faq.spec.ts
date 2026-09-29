import { test, expect } from '@playwright/test';
import { tools, type Locale } from '../src/data/tools';

// 全ツールのFAQセクションとFAQPage構造化データを、ツール登録簿から自動検証する。
// FAQの文言そのものは src/i18n/faq/<slug>.ts の辞書テストで担保している。

const locales: { locale: Locale; prefix: string; heading: string }[] = [
  { locale: 'ja', prefix: '', heading: 'よくある質問' },
  { locale: 'en', prefix: '/en', heading: 'FAQ' },
];

for (const { locale, prefix, heading } of locales) {
  test.describe(`FAQ（${locale}）`, () => {
    for (const tool of tools) {
      test(`${tool.slug}: FAQ見出しとFAQPage JSON-LDが出力される`, async ({
        page,
      }) => {
        await page.goto(`${prefix}/tools/${tool.slug}/`);

        await expect(
          page.locator('main h2', { hasText: new RegExp(`^${heading}$`) }),
        ).toHaveCount(1);
        const faqCount = await page.locator('main details').count();
        expect(faqCount).toBeGreaterThanOrEqual(3);

        const jsonLds = await page
          .locator('script[type="application/ld+json"]')
          .allTextContents();
        const parsed = jsonLds.map((text) => JSON.parse(text));
        const faq = parsed.filter((d) => d['@type'] === 'FAQPage');
        expect(faq).toHaveLength(1);
        expect(faq[0].inLanguage).toBe(locale);
        expect(faq[0].mainEntity.length).toBeGreaterThanOrEqual(3);
        for (const q of faq[0].mainEntity) {
          expect(q['@type']).toBe('Question');
          expect(q.name).toBeTruthy();
          expect(q.acceptedAnswer['@type']).toBe('Answer');
          expect(q.acceptedAnswer.text).toBeTruthy();
        }
      });
    }
  });
}

test('ホームなどツール以外のページにはFAQPageを出力しない', async ({
  page,
}) => {
  await page.goto('/');
  const jsonLds = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  expect(jsonLds.some((t) => JSON.parse(t)['@type'] === 'FAQPage')).toBe(false);
});
