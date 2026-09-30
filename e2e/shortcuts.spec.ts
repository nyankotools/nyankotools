import { test, expect } from './helpers/test';

// Astro開発ツールバーが開発サーバーでのみフッターのクリックを阻害することがあるため非表示にする
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      const style = document.createElement('style');
      style.textContent = 'astro-dev-toolbar { display: none !important; }';
      document.head.appendChild(style);
    });
  });
});

test.describe('ショートカット一覧ページ', () => {
  test('日本語版が表示され、主要なショートカットが載っている', async ({
    page,
  }) => {
    await page.goto('/shortcuts/');

    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main h1')).toHaveText(
      'キーボードショートカット一覧',
    );
    await expect(page).toHaveTitle(
      'キーボードショートカット一覧 | にゃんこツール',
    );
    await expect(page.locator('main kbd', { hasText: 'Alt' })).toBeVisible();
    await expect(
      page.locator('main li', { hasText: 'ツール検索' }).first(),
    ).toBeVisible();
  });

  test('英語版が表示される', async ({ page }) => {
    await page.goto('/en/shortcuts/');

    await expect(page.locator('main h1')).toHaveText('Keyboard Shortcuts');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('フッターのリンクから遷移できる（ja/en）', async ({ page }) => {
    await page.goto('/tools/char-counter/');
    await page.locator('footer a', { hasText: 'ショートカット一覧' }).click();
    await expect(page).toHaveURL(/\/shortcuts\/?$/);

    await page.goto('/en/tools/char-counter/');
    await page.locator('footer a', { hasText: 'Keyboard shortcuts' }).click();
    await expect(page).toHaveURL(/\/en\/shortcuts\/?$/);
  });

  test('375px幅で横スクロールが発生しない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    for (const path of ['/shortcuts/', '/en/shortcuts/']) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
      );
      expect(overflow).toBe(false);
    }
  });
});
