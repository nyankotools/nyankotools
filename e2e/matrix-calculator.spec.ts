import { test, expect } from './helpers/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('行列計算機', () => {
  test('初期表示で A×B の結果が表示される', async ({ page }) => {
    await page.goto('/tools/matrix-calculator/');

    const cells = page.locator('#mc-result td');
    await expect(cells).toHaveText(['19', '22', '43', '50']);
  });

  test('逆行列が分数で表示され、小数表示に切り替えられる', async ({ page }) => {
    await page.goto('/tools/matrix-calculator/');

    await page.locator('#mc-operation').selectOption('inverse');
    await expect(page.locator('#mc-result td')).toHaveText([
      '-2',
      '1',
      '3/2',
      '-1/2',
    ]);

    await page.getByRole('radio', { name: '小数' }).check();
    await expect(page.locator('#mc-result td')).toHaveText([
      '-2',
      '1',
      '1.5',
      '-0.5',
    ]);
  });

  test('行列式を計算できる', async ({ page }) => {
    await page.goto('/tools/matrix-calculator/');

    await page.locator('#mc-operation').selectOption('determinant');
    await expect(page.locator('#mc-result')).toHaveText('-2');
  });

  test('特異行列の逆行列はエラーになる', async ({ page }) => {
    await page.goto('/tools/matrix-calculator/');

    await page.locator('#mc-operation').selectOption('inverse');
    await page.getByLabel('行列Aの1行1列').fill('1');
    await page.getByLabel('行列Aの1行2列').fill('2');
    await page.getByLabel('行列Aの2行1列').fill('2');
    await page.getByLabel('行列Aの2行2列').fill('4');

    await expect(page.locator('#mc-error')).toContainText(
      '逆行列は存在しません',
    );
  });

  test('サイズ不一致の積はエラーになる', async ({ page }) => {
    await page.goto('/tools/matrix-calculator/');

    await page.locator('#mc-rows-b').selectOption('3');
    await expect(page.locator('#mc-error')).toContainText('A は 2×2、B は 3×2');
  });

  test('スカラー倍で分数を使える', async ({ page }) => {
    await page.goto('/tools/matrix-calculator/');

    await page.locator('#mc-operation').selectOption('scalar');
    await page.locator('#mc-scalar').fill('1/2');
    await expect(page.locator('#mc-result td')).toHaveText([
      '1/2',
      '1',
      '3/2',
      '2',
    ]);
  });

  test('サイズを3×3に広げるとセルが9個になる', async ({ page }) => {
    await page.goto('/tools/matrix-calculator/');

    await page.locator('#mc-rows-a').selectOption('3');
    await page.locator('#mc-cols-a').selectOption('3');
    await expect(page.locator('#mc-grid-a input')).toHaveCount(9);
  });

  test('最大の6×6でも375px幅で横スクロールせず、axe違反がない', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/tools/matrix-calculator/');

    for (const id of ['#mc-rows-a', '#mc-cols-a', '#mc-rows-b', '#mc-cols-b']) {
      await page.locator(id).selectOption('6');
    }
    await expect(page.locator('#mc-grid-a input')).toHaveCount(36);
    await expect(page.locator('#mc-grid-b input')).toHaveCount(36);
    await expect(page.locator('#mc-result td')).toHaveCount(36);

    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasOverflow, '6×6表示時の375px横スクロール').toBe(false);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(
      results.violations.map((v) => v.id),
      '6×6表示時のaxe違反',
    ).toEqual([]);
  });

  test('英語ページでも計算できる', async ({ page }) => {
    await page.goto('/en/tools/matrix-calculator/');

    await expect(page.locator('#mc-result td')).toHaveText([
      '19',
      '22',
      '43',
      '50',
    ]);
    await page.locator('#mc-operation').selectOption('transpose');
    await expect(page.locator('#mc-result td')).toHaveText([
      '1',
      '3',
      '2',
      '4',
    ]);
  });
});
