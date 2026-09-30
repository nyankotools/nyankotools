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

test.describe('運営者情報ページ（日本語版）', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/about/');

    await expect(page.locator('main h1')).toHaveText('運営者情報');
    await expect(page).toHaveTitle('運営者情報 | にゃんこツール');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /運営者情報/,
    );
  });

  test('h1は1つだけ存在する', async ({ page }) => {
    await page.goto('/about/');
    await expect(page.locator('h1')).toHaveCount(1);
  });

  test('フッターの「運営者情報」リンクから遷移できる', async ({ page }) => {
    await page.goto('/tools/char-counter/');

    await page.locator('footer a', { hasText: '運営者情報' }).click();

    await expect(page).toHaveURL(/\/about\/?$/);
    await expect(page.locator('main h1')).toHaveText('運営者情報');
  });

  test('お問い合わせへのリンクが機能する', async ({ page }) => {
    await page.goto('/about/');

    await page
      .locator('main a', { hasText: 'お問い合わせフォーム' })
      .first()
      .click();

    await expect(page).toHaveURL(/\/contact\/?$/);
  });

  test('よくある質問（FAQ）へのリンクが機能する', async ({ page }) => {
    await page.goto('/about/');

    await page.locator('main a', { hasText: 'よくある質問（FAQ）' }).click();

    await expect(page).toHaveURL(/\/faq\/?$/);
  });

  test('プライバシーポリシーへのリンクが機能する', async ({ page }) => {
    await page.goto('/about/');

    // footerも<main>内にあるため、本文中のリンクに絞り込む
    await page
      .locator('main a', { hasText: 'プライバシーポリシー' })
      .first()
      .click();

    await expect(page).toHaveURL(/\/privacy-policy\/?$/);
  });

  test('利用規約へのリンクが機能する', async ({ page }) => {
    await page.goto('/about/');

    // footerも<main>内にあるため、本文中のリンクに絞り込む
    await page.locator('main a', { hasText: '利用規約' }).first().click();

    await expect(page).toHaveURL(/\/terms-of-service\/?$/);
  });

  test('言語切り替えで英語版に遷移できる', async ({ page }) => {
    await page.goto('/about/');

    await page.locator('#sidebar a[hreflang="en"]').click();

    await expect(page).toHaveURL(/\/en\/about\/?$/);
    await expect(page.locator('main h1')).toHaveText('About');
  });

  test('375px幅でも横スクロールが発生しない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/about/');

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
});

test.describe('About page (English)', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/en/about/');

    await expect(page.locator('main h1')).toHaveText('About');
    await expect(page).toHaveTitle('About | NyankoTools');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /About page for NyankoTools/,
    );
  });

  test('フッターの「About」リンクから遷移できる', async ({ page }) => {
    await page.goto('/en/tools/char-counter/');

    await page.locator('footer a', { hasText: 'About' }).click();

    await expect(page).toHaveURL(/\/en\/about\/?$/);
    await expect(page.locator('main h1')).toHaveText('About');
  });

  test('Contact / FAQ / Privacy Policy / Terms of Serviceへのリンクが機能する', async ({
    page,
  }) => {
    await page.goto('/en/about/');

    await page.locator('main a', { hasText: 'Contact' }).first().click();
    await expect(page).toHaveURL(/\/en\/contact\/?$/);

    // footerも<main>内にあるため、本文中のリンクに絞り込む
    await page.goto('/en/about/');
    await page.locator('main a', { hasText: 'FAQ' }).first().click();
    await expect(page).toHaveURL(/\/en\/faq\/?$/);

    await page.goto('/en/about/');
    await page.locator('main a', { hasText: 'Privacy Policy' }).first().click();
    await expect(page).toHaveURL(/\/en\/privacy-policy\/?$/);

    await page.goto('/en/about/');
    await page
      .locator('main a', { hasText: 'Terms of Service' })
      .first()
      .click();
    await expect(page).toHaveURL(/\/en\/terms-of-service\/?$/);
  });

  test('言語切り替えで日本語版に遷移できる', async ({ page }) => {
    await page.goto('/en/about/');

    await page.locator('#sidebar a[hreflang="ja"]').click();

    await expect(page).toHaveURL(/\/about\/?$/);
    await expect(page.locator('main h1')).toHaveText('運営者情報');
  });

  test('375px幅でも横スクロールが発生しない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/en/about/');

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
});
