import { test, expect } from '@playwright/test';

test.describe('利用規約ページ（日本語版）', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/terms-of-service/');

    await expect(page.locator('main h1')).toHaveText('利用規約');
    await expect(page).toHaveTitle('利用規約 | にゃんこツール');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /利用規約/,
    );
  });

  test('h1は1つだけ存在する', async ({ page }) => {
    await page.goto('/terms-of-service/');
    await expect(page.locator('h1')).toHaveCount(1);
  });

  test('フッターの「利用規約」リンクから遷移できる', async ({ page }) => {
    await page.goto('/tools/char-counter/');

    await page.locator('footer a', { hasText: '利用規約' }).click();

    await expect(page).toHaveURL(/\/terms-of-service\/?$/);
    await expect(page.locator('main h1')).toHaveText('利用規約');
  });

  test('プライバシーポリシーへのリンクが機能する', async ({ page }) => {
    await page.goto('/terms-of-service/');

    // footerも<main>内にあるため、本文中のリンクに絞り込む
    await page
      .locator('main a', { hasText: 'プライバシーポリシー' })
      .first()
      .click();

    await expect(page).toHaveURL(/\/privacy-policy\/?$/);
  });

  test('言語切り替えで英語版に遷移できる', async ({ page }) => {
    await page.goto('/terms-of-service/');

    // #sidebar内のPC向け言語切り替え（モバイル向けは非表示のためデスクトップ幅では
    // 操作対象にならないが、DOM上には存在するため`#sidebar`内に絞り込んで一意にする）
    await page.locator('#sidebar a[hreflang="en"]').click();

    await expect(page).toHaveURL(/\/en\/terms-of-service\/?$/);
    await expect(page.locator('main h1')).toHaveText('Terms of Service');
  });

  test('375px幅でも横スクロールが発生しない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/terms-of-service/');

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
});

test.describe('Terms of Service page (English)', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/en/terms-of-service/');

    await expect(page.locator('main h1')).toHaveText('Terms of Service');
    await expect(page).toHaveTitle('Terms of Service | NyankoTools');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /terms of service/i,
    );
  });

  test('フッターの「Terms of Service」リンクから遷移できる', async ({
    page,
  }) => {
    await page.goto('/en/tools/char-counter/');

    await page.locator('footer a', { hasText: 'Terms of Service' }).click();

    await expect(page).toHaveURL(/\/en\/terms-of-service\/?$/);
    await expect(page.locator('main h1')).toHaveText('Terms of Service');
  });

  test('言語切り替えで日本語版に遷移できる', async ({ page }) => {
    await page.goto('/en/terms-of-service/');

    await page.locator('#sidebar a[hreflang="ja"]').click();

    await expect(page).toHaveURL(/\/terms-of-service\/?$/);
    await expect(page.locator('main h1')).toHaveText('利用規約');
  });

  test('375px幅でも横スクロールが発生しない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/en/terms-of-service/');

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
});
