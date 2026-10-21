import { test, expect } from './helpers/test';

test.describe('図形の面積・体積計算', () => {
  test('初期表示で半径5の円の面積が cm² で表示される', async ({ page }) => {
    await page.goto('/tools/geometry-calculator/');

    await expect(page.locator('#geo-results')).toBeVisible();
    await expect(page.locator('#geo-metrics')).toContainText('78.539816 cm²');
    await expect(page.locator('#geo-metrics')).toContainText('π × r²');
  });

  test('球に切り替えると体積が cm³ で表示される', async ({ page }) => {
    await page.goto('/tools/geometry-calculator/');

    await page.locator('#geo-shape').selectOption('sphere');
    await page.locator('#geo-sphere-r').fill('3');

    await expect(page.locator('#geo-metrics')).toContainText('113.097336 cm³');
  });

  test('単位を m に変えると m² になり、π を 3.14 にすると結果が変わる', async ({
    page,
  }) => {
    await page.goto('/tools/geometry-calculator/');

    await page.locator('#geo-unit').selectOption('m');
    await page.locator('#geo-pi').selectOption('2');

    await expect(page.locator('#geo-metrics')).toContainText('78.5 m²');
  });

  test('0 や負数ではエラーが表示される', async ({ page }) => {
    await page.goto('/tools/geometry-calculator/');

    await page.locator('#geo-circle-r').fill('-1');
    await expect(page.locator('#geo-error')).toBeVisible();
    await expect(page.locator('#geo-results')).toBeHidden();

    await page.locator('#geo-circle-r').fill('0');
    await expect(page.locator('#geo-error')).toBeVisible();
  });

  test('直方体は一部だけ入力している間はエラーを出さない', async ({ page }) => {
    await page.goto('/tools/geometry-calculator/');

    await page.locator('#geo-shape').selectOption('cuboid');
    await page.locator('#geo-cuboid-w').fill('2');

    await expect(page.locator('#geo-error')).toBeHidden();
    await expect(page.locator('#geo-results')).toBeHidden();

    await page.locator('#geo-cuboid-d').fill('3');
    await page.locator('#geo-cuboid-h').fill('4');
    await expect(page.locator('#geo-metrics')).toContainText('24 cm³');
  });

  test('桁数の多い結果を表示しても375px幅で横スクロールしない', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/tools/geometry-calculator/');

    await page.locator('#geo-circle-r').fill('123456789');
    await expect(page.locator('#geo-metrics')).toContainText('cm²');

    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasOverflow, '大きな数値表示時の375px横スクロール').toBe(false);
  });

  test('英語ページが表示される', async ({ page }) => {
    await page.goto('/en/tools/geometry-calculator/');

    await expect(page.locator('main h1')).toHaveText(
      'Area & Volume Calculator',
    );
    await expect(page.locator('#geo-metrics')).toContainText('Area');
  });
});
