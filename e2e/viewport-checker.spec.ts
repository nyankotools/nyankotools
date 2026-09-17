import { test, expect } from '@playwright/test';

test.describe('スクリーンサイズ・Viewportチェッカー（日本語版）', () => {
  test('直接アクセスするとビューポートサイズ等が即座に表示される', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto('/tools/viewport-checker/');

    await expect(page.locator('main h1')).toHaveText(
      'スクリーンサイズ・Viewportチェッカー',
    );
    await expect(page.locator('#viewport-viewport')).toHaveText(
      '1024 × 800 px',
    );
    await expect(page.locator('#viewport-orientation')).toHaveText(
      '横向き（landscape）',
    );
    await expect(page.locator('#viewport-breakpoint')).toHaveText('lg');
  });

  test('ウィンドウサイズを変更すると表示がリアルタイムに更新される', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto('/tools/viewport-checker/');
    await expect(page.locator('#viewport-breakpoint')).toHaveText('lg');

    await page.setViewportSize({ width: 375, height: 812 });

    await expect(page.locator('#viewport-viewport')).toHaveText('375 × 812 px');
    await expect(page.locator('#viewport-orientation')).toHaveText(
      '縦向き（portrait）',
    );
    await expect(page.locator('#viewport-breakpoint')).toHaveText(
      'なし（640px未満）',
    );
  });

  test('タッチ操作・カラースキーム設定が空欄でなく表示される', async ({
    page,
  }) => {
    await page.goto('/tools/viewport-checker/');

    await expect(page.locator('#viewport-touch')).not.toHaveText('');
    await expect(page.locator('#viewport-color-scheme')).not.toHaveText('');
  });

  test('ブレークポイント早見表で現在の幅に該当する行がハイライトされる', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 800, height: 600 });
    await page.goto('/tools/viewport-checker/');

    await expect(page.locator('#viewport-bp-row-md')).toHaveClass(
      /font-semibold/,
    );
    await expect(page.locator('#viewport-bp-row-sm')).not.toHaveClass(
      /font-semibold/,
    );
  });

  test('サイドバーからツールページへ遷移できる', async ({ page }) => {
    await page.goto('/');

    await page
      .locator('#sidebar details[data-category="開発"] summary')
      .click();
    await page
      .locator('#sidebar')
      .getByRole('link', { name: 'スクリーンサイズ・Viewportチェッカー' })
      .click();

    await expect(page).toHaveURL(/\/tools\/viewport-checker\/?$/);
    await expect(page.locator('main h1')).toHaveText(
      'スクリーンサイズ・Viewportチェッカー',
    );
  });

  test('375px幅でも横スクロールが発生しない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/tools/viewport-checker/');

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });

  test('ブレークポイントの境界値（640px）ちょうどでsmと判定される', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 640, height: 800 });
    await page.goto('/tools/viewport-checker/');

    await expect(page.locator('#viewport-breakpoint')).toHaveText('sm');
    await expect(page.locator('#viewport-bp-row-sm')).toHaveClass(
      /font-semibold/,
    );
  });

  test('639px（境界値未満）ではブレークポイントなし扱いになる', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 639, height: 800 });
    await page.goto('/tools/viewport-checker/');

    await expect(page.locator('#viewport-breakpoint')).toHaveText(
      'なし（640px未満）',
    );
    await expect(page.locator('#viewport-bp-row-none')).toHaveClass(
      /font-semibold/,
    );
  });

  test('OSのカラースキームがdarkの場合、「ダーク」と表示される', async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/tools/viewport-checker/');

    await expect(page.locator('#viewport-color-scheme')).toHaveText('ダーク');
  });

  test('OSのカラースキームがlightの場合、「ライト」と表示される', async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/tools/viewport-checker/');

    await expect(page.locator('#viewport-color-scheme')).toHaveText('ライト');
  });

  test('タッチ対応端末をエミュレートすると「対応」と表示される', async ({
    browser,
  }) => {
    const context = await browser.newContext({ hasTouch: true });
    const page = await context.newPage();
    await page.goto('/tools/viewport-checker/');

    await expect(page.locator('#viewport-touch')).toHaveText('対応');
    await context.close();
  });

  test('タッチ非対応端末をエミュレートすると「非対応」と表示される', async ({
    browser,
  }) => {
    const context = await browser.newContext({ hasTouch: false });
    const page = await context.newPage();
    await page.goto('/tools/viewport-checker/');

    await expect(page.locator('#viewport-touch')).toHaveText('非対応');
    await context.close();
  });
});

test.describe('Screen Size & Viewport Checker (English)', () => {
  test('英語版が正しく表示され、ブレークポイント・向きが英語表記になる', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto('/en/tools/viewport-checker/');

    await expect(page.locator('main h1')).toHaveText(
      'Screen Size & Viewport Checker',
    );
    await expect(page.locator('#viewport-viewport')).toHaveText(
      '1024 × 800 px',
    );
    await expect(page.locator('#viewport-orientation')).toHaveText('Landscape');
    await expect(page.locator('#viewport-breakpoint')).toHaveText('lg');
  });

  test('狭い幅ではNone (below 640px)と表示される', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/en/tools/viewport-checker/');

    await expect(page.locator('#viewport-breakpoint')).toHaveText(
      'None (below 640px)',
    );
    await expect(page.locator('#viewport-orientation')).toHaveText('Portrait');
  });

  test('サイドバーからツールページへ遷移できる', async ({ page }) => {
    await page.goto('/en/');

    await page
      .locator('#sidebar details[data-category="Development"] summary')
      .click();
    await page
      .locator('#sidebar')
      .getByRole('link', { name: 'Screen Size & Viewport Checker' })
      .click();

    await expect(page).toHaveURL(/\/en\/tools\/viewport-checker\/?$/);
    await expect(page.locator('main h1')).toHaveText(
      'Screen Size & Viewport Checker',
    );
  });

  test('375px幅でも横スクロールが発生しない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/en/tools/viewport-checker/');

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });

  test('ブレークポイントの境界値（640px）ちょうどでsmと判定される', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 640, height: 800 });
    await page.goto('/en/tools/viewport-checker/');

    await expect(page.locator('#viewport-breakpoint')).toHaveText('sm');
  });

  test('OSのカラースキームがdarkの場合、Darkと表示される', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/en/tools/viewport-checker/');

    await expect(page.locator('#viewport-color-scheme')).toHaveText('Dark');
  });
});
