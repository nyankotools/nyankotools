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

  test('開いている間はTabを繰り返してもフォーカスがサイドバーかトグルに留まり、閉じると main が操作可能に戻る', async ({
    page,
  }) => {
    await page.goto('/tools/char-counter/');
    const sidebar = page.locator('#sidebar');
    const toggle = page.locator('#sidebar-toggle');
    const main = page.locator('main');

    await expect(main).toHaveJSProperty('inert', false);
    await toggle.click();
    await expect(main).toHaveJSProperty('inert', true);

    for (let i = 0; i < 40; i++) {
      await page.keyboard.press('Tab');
      const inside = await page.evaluate(() => {
        const active = document.activeElement;
        return (
          !!active &&
          (active === document.body ||
            !!active.closest('#sidebar') ||
            active.id === 'sidebar-toggle')
        );
      });
      expect(inside).toBe(true);
    }

    // 開いている間トグルはオーバーレイの下になるため、Escape で閉じる
    await page.keyboard.press('Escape');
    await expect(sidebar).toHaveJSProperty('inert', true);
    await expect(main).toHaveJSProperty('inert', false);
  });

  test('閉じているときの Escape は何も起こさない', async ({ page }) => {
    await page.goto('/tools/char-counter/');
    const toggle = page.locator('#sidebar-toggle');
    const input = page.locator('textarea').first();
    await input.focus();
    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(input).toBeFocused();
  });

  test('開いたままデスクトップ幅に広げ、また縮めても main は操作可能', async ({
    page,
  }) => {
    await page.goto('/tools/char-counter/');
    await page.locator('#sidebar-toggle').click();
    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(page.locator('main')).toHaveJSProperty('inert', false);
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('main')).toHaveJSProperty('inert', false);
  });

  test('サイドバー内にフォーカスがある状態でデスクトップ幅から縮めてもフォーカスが失われない', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/tools/char-counter/');
    await page.locator('#sidebar nav a').first().focus();
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('#sidebar-toggle')).toBeFocused();
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
