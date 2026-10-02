import { test, expect } from './helpers/test';

// Astro開発ツールバー（`astro-dev-toolbar`）が開発サーバーでのみ画面下部中央に
// 固定表示され、フッターの一部リンクのクリックを阻害することがあるため、
// 本番ビルドには存在しないこの要素をテスト実行時のみ非表示にする。
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      const style = document.createElement('style');
      style.textContent = 'astro-dev-toolbar { display: none !important; }';
      document.head.appendChild(style);
    });
  });
});

test.describe('よくある質問ページ（日本語版）', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/faq/');

    await expect(page.locator('main h1')).toHaveText('よくある質問（FAQ）');
    await expect(page).toHaveTitle('よくある質問（FAQ） | にゃんこツール');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /よくある質問/,
    );
  });

  test('h1は1つだけ存在する', async ({ page }) => {
    await page.goto('/faq/');
    await expect(page.locator('h1')).toHaveCount(1);
  });

  test('フッターの「よくある質問」リンクから遷移できる', async ({ page }) => {
    await page.goto('/tools/char-counter/');

    await page.locator('footer a', { hasText: 'よくある質問' }).click();

    await expect(page).toHaveURL(/\/faq\/?$/);
    await expect(page.locator('main h1')).toHaveText('よくある質問（FAQ）');
  });

  test('お問い合わせフォームへのリンクが機能する', async ({ page }) => {
    await page.goto('/faq/');

    await page
      .locator('main a', { hasText: 'お問い合わせフォーム' })
      .first()
      .click();

    await expect(page).toHaveURL(/\/contact\/?$/);
  });

  test('プライバシーポリシーへのリンクが機能する', async ({ page }) => {
    await page.goto('/faq/');

    // footerも<main>内にあるため、本文中のリンクに絞り込む
    await page
      .locator('main a', { hasText: 'プライバシーポリシー' })
      .first()
      .click();

    await expect(page).toHaveURL(/\/privacy-policy\/?$/);
  });

  test('運営者情報ページへのリンクが機能する', async ({ page }) => {
    await page.goto('/faq/');

    await page.locator('main a', { hasText: '運営者情報ページ' }).click();

    await expect(page).toHaveURL(/\/about\/?$/);
    await expect(page.locator('main h1')).toHaveText('運営者情報');
  });

  test('言語切り替えで英語版に遷移できる', async ({ page }) => {
    await page.goto('/faq/');

    await page.locator('#sidebar a[hreflang="en"]').click();

    await expect(page).toHaveURL(/\/en\/faq\/?$/);
    await expect(page.locator('main h1')).toHaveText(
      'Frequently Asked Questions',
    );
  });

  test('375px幅でも横スクロールが発生しない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/faq/');

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
});

test.describe('FAQ page (English)', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/en/faq/');

    await expect(page.locator('main h1')).toHaveText(
      'Frequently Asked Questions',
    );
    await expect(page).toHaveTitle('FAQ | NyankoTools');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /Frequently asked questions/,
    );
  });

  test('フッターの「FAQ」リンクから遷移できる', async ({ page }) => {
    await page.goto('/en/tools/char-counter/');

    await page.locator('footer a', { hasText: 'FAQ' }).click();

    await expect(page).toHaveURL(/\/en\/faq\/?$/);
    await expect(page.locator('main h1')).toHaveText(
      'Frequently Asked Questions',
    );
  });

  test('contact form / Privacy Policy / Aboutへのリンクが機能する', async ({
    page,
  }) => {
    await page.goto('/en/faq/');

    await page.locator('main a', { hasText: 'contact form' }).first().click();
    await expect(page).toHaveURL(/\/en\/contact\/?$/);

    // footerも<main>内にあるため、本文中のリンクに絞り込む
    await page.goto('/en/faq/');
    await page.locator('main a', { hasText: 'Privacy Policy' }).first().click();
    await expect(page).toHaveURL(/\/en\/privacy-policy\/?$/);

    await page.goto('/en/faq/');
    await page.locator('main a', { hasText: 'About page' }).click();
    await expect(page).toHaveURL(/\/en\/about\/?$/);
    await expect(page.locator('main h1')).toHaveText('About');
  });

  test('言語切り替えで日本語版に遷移できる', async ({ page }) => {
    await page.goto('/en/faq/');

    await page.locator('#sidebar a[hreflang="ja"]').click();

    await expect(page).toHaveURL(/\/faq\/?$/);
    await expect(page.locator('main h1')).toHaveText('よくある質問（FAQ）');
  });

  test('375px幅でも横スクロールが発生しない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/en/faq/');

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
});
