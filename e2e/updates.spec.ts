import { test, expect } from '@playwright/test';

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

test.describe('更新情報ページ（日本語版）', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/updates/');

    await expect(page.locator('main h1')).toHaveText('更新情報');
    await expect(page).toHaveTitle('更新情報 | にゃんこツール');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /更新履歴/,
    );
  });

  test('h1は1つだけ存在する', async ({ page }) => {
    await page.goto('/updates/');
    await expect(page.locator('h1')).toHaveCount(1);
  });

  test('日付ごとの更新履歴が新しい順に表示される', async ({ page }) => {
    await page.goto('/updates/');

    const dates = await page
      .locator('main time')
      .evaluateAll((elements) =>
        elements.map((el) => el.getAttribute('datetime')),
      );
    expect(dates.length).toBeGreaterThan(1);

    const sorted = [...dates].sort().reverse();
    expect(dates).toEqual(sorted);
  });

  test('更新履歴に含まれるツールへのリンクから遷移できる', async ({ page }) => {
    await page.goto('/updates/');

    await page.locator('main a', { hasText: '文字数カウント' }).click();

    await expect(page).toHaveURL(/\/tools\/char-counter\/?$/);
  });

  test('フッターの「更新情報」リンクから遷移できる', async ({ page }) => {
    await page.goto('/tools/char-counter/');

    await page.locator('footer a', { hasText: '更新情報' }).click();

    await expect(page).toHaveURL(/\/updates\/?$/);
    await expect(page.locator('main h1')).toHaveText('更新情報');
  });

  test('言語切り替えで英語版に遷移できる', async ({ page }) => {
    await page.goto('/updates/');

    await page.locator('#sidebar a[hreflang="en"]').click();

    await expect(page).toHaveURL(/\/en\/updates\/?$/);
    await expect(page.locator('main h1')).toHaveText('Updates');
  });

  test('375px幅でも横スクロールが発生しない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/updates/');

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
});

test.describe('Updates page (English)', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/en/updates/');

    await expect(page.locator('main h1')).toHaveText('Updates');
    await expect(page).toHaveTitle('Updates | NyankoTools');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /changelog/,
    );
  });

  test('フッターの「Updates」リンクから遷移できる', async ({ page }) => {
    await page.goto('/en/tools/char-counter/');

    await page.locator('footer a', { hasText: 'Updates' }).click();

    await expect(page).toHaveURL(/\/en\/updates\/?$/);
    await expect(page.locator('main h1')).toHaveText('Updates');
  });

  test('言語切り替えで日本語版に遷移できる', async ({ page }) => {
    await page.goto('/en/updates/');

    await page.locator('#sidebar a[hreflang="ja"]').click();

    await expect(page).toHaveURL(/\/updates\/?$/);
    await expect(page.locator('main h1')).toHaveText('更新情報');
  });

  test('375px幅でも横スクロールが発生しない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/en/updates/');

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
});
