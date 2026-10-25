import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';
import { blockAnalytics } from './helpers/block-analytics';

test.describe('端末情報ビューア（日本語版）', () => {
  test('画面・入力・API対応状況が空欄でなく表示される', async ({ page }) => {
    await page.goto('/tools/device-info-viewer/');

    await expect(page.locator('#device-resolution')).toContainText('px');
    await expect(page.locator('#device-dpr')).toContainText('x');
    await expect(page.locator('#device-cpu')).not.toHaveText('');
    await expect(page.locator('#device-pointer')).not.toHaveText('');
    await expect(page.locator('#device-api-indexeddb')).toHaveText('対応');
    await expect(page.locator('#device-api-summary')).toContainText('件に対応');
  });

  test('タッチ対応端末をエミュレートするとタッチ点数が1以上になる', async ({
    browser,
  }) => {
    const context = await browser.newContext({ hasTouch: true });
    await blockAnalytics(context);
    const page = await context.newPage();
    await page.goto('/tools/device-info-viewer/');

    await expect(page.locator('#device-touch-points')).not.toHaveText('0');
    await context.close();
  });

  test('結果をコピーするとコピー完了が表示される', async ({ browser }) => {
    const context = await browser.newContext();
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await blockAnalytics(context);
    const page = await context.newPage();
    await page.goto('/tools/device-info-viewer/');

    await page.locator('#device-copy-button').click();
    await expect(page.locator('#device-copy-status')).toHaveText(
      'コピーしました',
    );
    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text).toContain('画面解像度（CSSピクセル）: ');
    expect(text).toContain('IndexedDB: 対応');
    await context.close();
  });
});

test.describe('Device Info Viewer (English)', () => {
  test('ja/en ともにaxeの違反がない', async ({ page }) => {
    for (const path of [
      '/tools/device-info-viewer/',
      '/en/tools/device-info-viewer/',
    ]) {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(
        results.violations.map((v) => v.id),
        path,
      ).toEqual([]);
    }
  });

  test('英語版が表示され、API対応状況が英語表記になる', async ({ page }) => {
    await page.goto('/en/tools/device-info-viewer/');

    await expect(page.locator('#device-api-indexeddb')).toHaveText('Supported');
    await expect(page.locator('#device-api-summary')).toContainText(
      'supported',
    );
  });
});
