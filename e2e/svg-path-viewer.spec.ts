import { test, expect } from './helpers/test';

test.describe('SVGパスビューア（日本語版）', () => {
  test('初期状態でサンプルが読み込まれ、プレビューと一覧が出る', async ({
    page,
  }) => {
    await page.goto('/tools/svg-path-viewer/');
    await expect(page.locator('main h1')).toHaveText('SVGパスビューア');
    await expect(page.locator('#pv-preview svg')).toBeVisible();
    await expect(page.locator('#pv-segments li').first()).toBeVisible();
    // サンプルに含まれる円弧コマンドが一覧に出る
    await expect(page.locator('#pv-segments')).toContainText('円弧');
  });

  test('パスデータを入力するとコマンドが分解される', async ({ page }) => {
    await page.goto('/tools/svg-path-viewer/');
    await page.locator('#pv-input').fill('m10 10 l5 5 h5 z');
    await expect(page.locator('#pv-segments li')).toHaveCount(4);
    await expect(page.locator('#pv-segments li').nth(1)).toContainText('相対');
  });

  test('不正なパスデータはエラーを表示する', async ({ page }) => {
    await page.goto('/tools/svg-path-viewer/');
    await page.locator('#pv-input').fill('L10 10');
    await expect(page.locator('#pv-error')).toBeVisible();
    // エラー時は結果パネルごと隠れる（プレビューの古いSVGはDOMに残るが表示されない）
    await expect(page.locator('#pv-result')).toBeHidden();
    await page.locator('#pv-input').fill('M0 0 L10 10');
    await expect(page.locator('#pv-error')).toBeHidden();
  });

  test('数値の編集がパスデータに反映される', async ({ page }) => {
    await page.goto('/tools/svg-path-viewer/');
    await page.locator('#pv-input').fill('M0 0 L10 10');
    await page.getByLabel('#2 L x', { exact: true }).fill('25');
    await expect(page.locator('#pv-input')).toHaveValue('M0 0 L25 10');
  });

  test('最適化で小数桁が削減される', async ({ page }) => {
    await page.goto('/tools/svg-path-viewer/');
    await page.locator('#pv-input').fill('M0.123456 0.5 L10.98765 20.11111');
    await page.locator('#pv-precision').fill('1');
    await page.locator('#pv-optimize-button').click();
    await expect(page.locator('#pv-input')).toHaveValue('M.1.5L11 20.1');
    await expect(page.locator('#pv-optimize-stats')).toContainText('削減');
  });

  test('コピーボタンで成功メッセージが出る', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/svg-path-viewer/');
    await page.locator('#pv-copy-button').click();
    await expect(page.locator('#pv-status')).toHaveText('コピーしました');
  });
});

test.describe('SVG Path Viewer (English)', () => {
  test('shows the English heading and the command list', async ({ page }) => {
    await page.goto('/en/tools/svg-path-viewer/');
    await expect(page.locator('main h1')).toHaveText('SVG Path Viewer');
    await expect(page.locator('#pv-segments')).toContainText('Elliptical arc');
  });
});
