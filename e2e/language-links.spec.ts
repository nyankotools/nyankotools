import { test, expect } from '@playwright/test';

// 404 用に追加した languageSwitchToHome が既定値（false）のとき、通常ページの
// 言語切替・hreflang・canonical が従来どおり対応ページを指すことの回帰確認。
const pairs = [
  { ja: '/', en: '/en/' },
  { ja: '/tools/base64/', en: '/en/tools/base64/' },
  { ja: '/tools/pdf-merge-split/', en: '/en/tools/pdf-merge-split/' },
  { ja: '/updates/', en: '/en/updates/' },
];

for (const { ja, en } of pairs) {
  test(`${ja}: hreflang・canonical・言語切替が対応ページを指す`, async ({
    page,
  }) => {
    await page.goto(ja);
    await expect(
      page.locator('link[rel="alternate"][hreflang="en"]'),
    ).toHaveAttribute('href', `https://nyankotools.com${en}`);
    await expect(
      page.locator('link[rel="alternate"][hreflang="ja"]'),
    ).toHaveAttribute('href', `https://nyankotools.com${ja}`);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://nyankotools.com${ja}`,
    );
    await expect(
      page.locator(`[data-lang-switch-desktop] a[hreflang="en"]`),
    ).toHaveAttribute('href', en);
    await expect(page.locator('[data-lang-switch-mobile]')).toHaveAttribute(
      'href',
      en,
    );

    await page.goto(en);
    await expect(
      page.locator('link[rel="alternate"][hreflang="ja"]'),
    ).toHaveAttribute('href', `https://nyankotools.com${ja}`);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://nyankotools.com${en}`,
    );
    await expect(
      page.locator(`[data-lang-switch-desktop] a[hreflang="ja"]`),
    ).toHaveAttribute('href', ja);
    await expect(page.locator('[data-lang-switch-mobile]')).toHaveAttribute(
      'href',
      ja,
    );
  });
}
