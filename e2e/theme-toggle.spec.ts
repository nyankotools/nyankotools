import { test, expect, type Page } from './helpers/test';

// テーマ切替（ライト→ダーク→システムの循環ボタン）と、言語切替・テーマ切替の配置を確認する。
// 配置: PC幅は <main> 先頭の右寄せ行（言語リンク＋テーマボタン）、モバイルはヘッダー内。
// サイドバーには言語・テーマの欄を置かない。

const DESKTOP_TOGGLE = '#theme-toggle-desktop';
const MOBILE_TOGGLE = '#theme-toggle-mobile';
const TOOL_URL = '/tools/char-counter/';

// ボタン上の data-label-* から期待される aria-label を組み立てる
async function expectLabelFor(page: Page, selector: string, theme: string) {
  const toggle = page.locator(selector);
  const labels = await toggle.evaluate((el) => {
    const d = (el as HTMLElement).dataset;
    return {
      prefix: d.labelPrefix ?? '',
      light: d.labelLight ?? '',
      dark: d.labelDark ?? '',
      system: d.labelSystem ?? '',
    };
  });
  const expected = `${labels.prefix}: ${labels[theme as 'light' | 'dark' | 'system']}`;
  await expect(toggle).toHaveAttribute('aria-label', expected);
  await expect(toggle).toHaveAttribute('title', expected);
}

test.describe('テーマ切替ボタン（PC幅）', () => {
  test.use({ viewport: { width: 1280, height: 800 }, colorScheme: 'light' });

  test('サイドバーに言語・テーマの欄が無い', async ({ page }) => {
    await page.goto(TOOL_URL);
    await expect(page.locator('#sidebar [data-theme-cycle]')).toHaveCount(0);
    await expect(page.locator('#sidebar [data-theme-option]')).toHaveCount(0);
    await expect(page.locator('#theme-switcher')).toHaveCount(0);
    await expect(
      page.locator('#sidebar [data-lang-switch-desktop]'),
    ).toHaveCount(0);
  });

  test('ボタンは 1 つで、system → light → dark → system の順に循環する', async ({
    page,
  }) => {
    await page.goto(TOOL_URL);
    const toggle = page.locator(DESKTOP_TOGGLE);
    const html = page.locator('html');

    // 初期状態は保存なし＝システム（OSがライトなのでdarkは付かない）
    await expect(toggle).toHaveAttribute('data-theme-current', 'system');
    await expect(toggle.locator('[data-theme-icon="system"]')).toBeVisible();
    await expect(toggle.locator('[data-theme-icon="light"]')).toBeHidden();
    await expect(toggle.locator('[data-theme-icon="dark"]')).toBeHidden();
    await expectLabelFor(page, DESKTOP_TOGGLE, 'system');
    await expect(html).not.toHaveClass(/\bdark\b/);

    await toggle.click();
    await expect(toggle).toHaveAttribute('data-theme-current', 'light');
    await expect(toggle.locator('[data-theme-icon="light"]')).toBeVisible();
    await expect(toggle.locator('[data-theme-icon="system"]')).toBeHidden();
    await expectLabelFor(page, DESKTOP_TOGGLE, 'light');
    await expect(html).not.toHaveClass(/\bdark\b/);
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe(
      'light',
    );

    await toggle.click();
    await expect(toggle).toHaveAttribute('data-theme-current', 'dark');
    await expect(toggle.locator('[data-theme-icon="dark"]')).toBeVisible();
    await expect(toggle.locator('[data-theme-icon="light"]')).toBeHidden();
    await expectLabelFor(page, DESKTOP_TOGGLE, 'dark');
    await expect(html).toHaveClass(/\bdark\b/);
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe(
      'dark',
    );

    await toggle.click();
    await expect(toggle).toHaveAttribute('data-theme-current', 'system');
    await expect(toggle.locator('[data-theme-icon="system"]')).toBeVisible();
    await expectLabelFor(page, DESKTOP_TOGGLE, 'system');
    await expect(html).not.toHaveClass(/\bdark\b/);
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBeNull();
  });

  test('リロード後も選んだテーマが保持される', async ({ page }) => {
    await page.goto(TOOL_URL);
    const toggle = page.locator(DESKTOP_TOGGLE);

    await toggle.click(); // light
    await toggle.click(); // dark
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);

    await page.reload();
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);
    await expect(page.locator(DESKTOP_TOGGLE)).toHaveAttribute(
      'data-theme-current',
      'dark',
    );
    await expect(
      page.locator(DESKTOP_TOGGLE).locator('[data-theme-icon="dark"]'),
    ).toBeVisible();
  });

  test('右上行（言語リンク・テーマ）がお気に入りボタンと重ならない', async ({
    page,
  }) => {
    for (const width of [768, 1024, 1280]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(TOOL_URL);
      const row = await page.locator(DESKTOP_TOGGLE).evaluate((el) => {
        const r = el.parentElement!.getBoundingClientRect();
        return { x: r.x, y: r.y, w: r.width, h: r.height };
      });
      const fav = await page
        .locator('[data-tool-page] > [data-favorite-toggle="char-counter"]')
        .boundingBox();
      expect(fav, `favorite button at ${width}px`).not.toBeNull();
      const f = fav!;
      const overlaps =
        f.x < row.x + row.w &&
        f.x + f.width > row.x &&
        f.y < row.y + row.h &&
        f.y + f.height > row.y;
      expect(overlaps, `overlap at ${width}px`).toBe(false);
    }
  });

  test('印刷時は右上行が非表示になる', async ({ page }) => {
    await page.goto(TOOL_URL);
    await expect(page.locator(DESKTOP_TOGGLE)).toBeVisible();
    await expect(page.locator('[data-lang-switch-desktop]')).toBeVisible();

    await page.emulateMedia({ media: 'print' });
    await expect(page.locator(DESKTOP_TOGGLE)).toBeHidden();
    await expect(page.locator('[data-lang-switch-desktop]')).toBeHidden();
  });
});

test.describe('テーマ切替ボタン（モバイル幅）', () => {
  test.use({ viewport: { width: 375, height: 667 }, colorScheme: 'light' });

  test('ヘッダー内にテーマ・言語があり、PC用の行は見えない', async ({
    page,
  }) => {
    await page.goto(TOOL_URL);
    const header = page.locator('header', { has: page.locator(MOBILE_TOGGLE) });
    await expect(header.locator(MOBILE_TOGGLE)).toBeVisible();
    await expect(header.locator('[data-lang-switch-mobile]')).toBeVisible();
    await expect(page.locator(DESKTOP_TOGGLE)).toBeHidden();
  });

  test('モバイルのテーマボタンも循環し、リロード後も保持される', async ({
    page,
  }) => {
    await page.goto(TOOL_URL);
    const toggle = page.locator(MOBILE_TOGGLE);

    await expect(toggle).toHaveAttribute('data-theme-current', 'system');
    await toggle.click();
    await expect(toggle).toHaveAttribute('data-theme-current', 'light');
    await toggle.click();
    await expect(toggle).toHaveAttribute('data-theme-current', 'dark');
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);
    await expectLabelFor(page, MOBILE_TOGGLE, 'dark');

    await page.reload();
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);
    await expect(page.locator(MOBILE_TOGGLE)).toHaveAttribute(
      'data-theme-current',
      'dark',
    );

    await page.locator(MOBILE_TOGGLE).click();
    await expect(page.locator(MOBILE_TOGGLE)).toHaveAttribute(
      'data-theme-current',
      'system',
    );
    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
  });
});
