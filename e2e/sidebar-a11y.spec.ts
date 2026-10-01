import { test, expect } from './helpers/test';

// モバイル幅でサイドバーが閉じている間は inert になり、開閉でフォーカスが移動することを確認する。

test.describe('モバイルのサイドバーのアクセシビリティ', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('閉じている間は inert で、開くとサイドバーにフォーカスが移る', async ({
    page,
  }) => {
    await page.goto('/tools/char-counter/');
    const sidebar = page.locator('#sidebar');
    const toggle = page.locator('#sidebar-toggle');

    await expect(sidebar).toHaveJSProperty('inert', true);

    await toggle.click();
    await expect(sidebar).toHaveJSProperty('inert', false);
    await expect(sidebar).toBeFocused();
  });

  test('Escapeで閉じるとトグルボタンにフォーカスが戻り、再び inert になる', async ({
    page,
  }) => {
    await page.goto('/tools/char-counter/');
    const sidebar = page.locator('#sidebar');
    const toggle = page.locator('#sidebar-toggle');

    await toggle.click();
    await expect(sidebar).toBeFocused();
    await page.keyboard.press('Escape');

    await expect(toggle).toBeFocused();
    await expect(sidebar).toHaveJSProperty('inert', true);
  });

  test('モバイルの言語リンクは表示文言を含むアクセシブルネームを持つ', async ({
    page,
  }) => {
    await page.goto('/tools/char-counter/');
    const link = page.locator('[data-lang-switch-mobile]');
    await expect(link).toHaveText('EN');
    await expect(link).toHaveAttribute('aria-label', /^EN/);
  });
});

test.describe('デスクトップ幅のサイドバー', () => {
  test.use({ viewport: { width: 1024, height: 768 } });

  test('inert にならずリンクを操作できる', async ({ page }) => {
    await page.goto('/tools/char-counter/');
    await expect(page.locator('#sidebar')).toHaveJSProperty('inert', false);
  });
});
