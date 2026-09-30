import { test, expect } from '@playwright/test';

// 404ページは別言語版の同一ページが存在しないため、言語切替リンクは各言語のトップへ向ける
// （以前は存在しない /404/ /en/404/ を指していた）。
// 本番ビルドの配信では未知のURLで dist/404.html が返る（preview では 404 ステータスでも本文は同じ）。
test.describe('404ページの言語切替', () => {
  test('日本語URL: 言語切替リンクが存在しないページを指さない', async ({
    page,
  }) => {
    await page.goto('/no-such-page/');

    const hrefs = await page
      .locator('a[hreflang]')
      .evaluateAll((els) => els.map((el) => el.getAttribute('href')));
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      expect(['/', '/en/']).toContain(href);
    }
  });

  // 英語URL用の付け替えスクリプトが、日本語URLや /en で始まるだけのURLで動かないことを確認する
  for (const path of ['/no-such-page/', '/enfoo/']) {
    test(`${path}: デスクトップのサイドバーは日本語が現在の言語のまま`, async ({
      page,
    }) => {
      await page.goto(path);

      const group = page.locator('[data-lang-switch-desktop]');
      await expect(group.locator('a[hreflang="ja"]')).toHaveAttribute(
        'aria-current',
        'true',
      );
      await expect(group.locator('a[hreflang="en"]')).not.toHaveAttribute(
        'aria-current',
        'true',
      );
    });
  }

  test('英語URL: デスクトップのサイドバーで英語が現在の言語になる', async ({
    page,
  }) => {
    await page.goto('/en/no-such-page/');

    const group = page.locator('[data-lang-switch-desktop]');
    await expect(group.locator('a[hreflang="en"]')).toHaveAttribute(
      'aria-current',
      'true',
    );
    await expect(group.locator('a[hreflang="ja"]')).not.toHaveAttribute(
      'aria-current',
      'true',
    );
  });

  test('英語URL: モバイルの言語切替が日本語トップへ向く', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/en/no-such-page/');

    const mobileSwitch = page.locator('[data-lang-switch-mobile]');
    await expect(mobileSwitch).toHaveAttribute('href', '/');
    await expect(mobileSwitch).toHaveText('日本語');
  });
});
