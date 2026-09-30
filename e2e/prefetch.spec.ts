import { test, expect } from './helpers/test';

// astro.config.mjs の prefetch: { prefetchAll: true, defaultStrategy: 'hover' } の
// 動作確認。同一オリジンのリンクをホバーすると <link rel="prefetch"> がhead内に
// 追加され、外部リンク（フッターの公式Xリンク等）はホバーしても追加されないことを
// 確認する。

test('サイドバーのツールリンクをホバーすると <link rel="prefetch"> が追加される', async ({
  page,
}) => {
  await page.goto('/tools/char-counter/');

  // char-counterページではchar-counter自身が属する「テキスト」カテゴリの
  // <details> がアクティブツールとして初期状態で開いている。
  // 同カテゴリの zenkaku-hankaku リンクをホバーする。
  const link = page.locator('#sidebar a[href="/tools/zenkaku-hankaku/"]');
  await expect(link).toBeVisible();
  await link.hover();

  // prefetchランタイムは mouseenter から80msのデバウンス後にprefetchを発火する。
  // 追加される <link> の href 属性は anchor.href（絶対URL）がそのまま設定されるため、
  // 末尾一致で検証する。
  await expect(
    page.locator('link[rel="prefetch"][href$="/tools/zenkaku-hankaku/"]'),
  ).toHaveCount(1, { timeout: 5000 });
});

test('関連ツールセクションのリンクをホバーしても <link rel="prefetch"> が追加される', async ({
  page,
}) => {
  await page.goto('/tools/char-counter/');

  const link = page
    .locator('main')
    .getByRole('link', { name: 'JSON整形', exact: true });
  await expect(link).toBeVisible();
  await link.hover();

  await expect(
    page.locator('link[rel="prefetch"][href$="/tools/json-formatter/"]'),
  ).toHaveCount(1, { timeout: 5000 });
});

test('外部リンク（フッターの公式X）をホバーしても prefetch されない', async ({
  page,
}) => {
  await page.goto('/tools/char-counter/');

  const footerXLink = page.locator('footer a', { hasText: '公式X' });
  await expect(footerXLink).toBeVisible();
  await footerXLink.hover();

  // デバウンス（80ms）+ 余裕を見て待機してもprefetchされていないことを確認する。
  await page.waitForTimeout(500);
  await expect(
    page.locator('link[rel="prefetch"][href="https://x.com/nyankotools"]'),
  ).toHaveCount(0);
});
