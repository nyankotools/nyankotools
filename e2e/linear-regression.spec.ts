import { test, expect } from './helpers/test';
import AxeBuilder from '@axe-core/playwright';

test('回帰直線: 日本語版で結果と散布図が表示される', async ({ page }) => {
  await page.goto('/tools/linear-regression/');

  await page.locator('#reg-data-input').fill('1,3\n2,5\n3,7');

  await expect(page.locator('#reg-slope')).toHaveText('2');
  await expect(page.locator('#reg-intercept')).toHaveText('1');
  await expect(page.locator('#reg-r2')).toHaveText('1');
  await expect(page.locator('#reg-chart circle')).toHaveCount(3);
});

test('回帰直線: xを入力すると予測値が表示される', async ({ page }) => {
  await page.goto('/tools/linear-regression/');

  await page.locator('#reg-data-input').fill('1,3\n2,5\n3,7');
  await page.locator('#reg-predict-input').fill('10');

  await expect(page.locator('#reg-predict-text')).toContainText('21');
});

test('回帰直線: データ不足と x 同値でエラーが表示される', async ({ page }) => {
  await page.goto('/tools/linear-regression/');

  await page.locator('#reg-data-input').fill('1,2');
  await expect(page.locator('#reg-error')).not.toHaveText('');
  await expect(page.locator('#reg-results')).toBeHidden();

  await page.locator('#reg-data-input').fill('2,1\n2,5');
  await expect(page.locator('#reg-error')).not.toHaveText('');
});

test('回帰直線: 英語版で結果が表示される', async ({ page }) => {
  await page.goto('/en/tools/linear-regression/');

  await page.locator('#reg-data-input').fill('1\t6\n2\t4\n3\t2');

  await expect(page.locator('#reg-slope')).toHaveText('-2');
  await expect(page.locator('#reg-r')).toHaveText('-1');
});

test('回帰直線: コピーボタンが機能する', async ({ page }) => {
  await page.goto('/tools/linear-regression/');

  await page.locator('#reg-copy-button').click();

  await expect(page.locator('#reg-copy-status')).not.toHaveText('');
});

test('回帰直線: 結果・表・散布図の表示時も375px幅で横スクロールせず、axe違反がない', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/tools/linear-regression/');

  await page
    .locator('#reg-data-input')
    .fill(
      '1000000.123456,2000000.654321\n2000000.5,4000000.25\n3000000.75,6000000.125\n4000000,8000000',
    );
  await expect(page.locator('#reg-results')).toBeVisible();
  await expect(page.locator('#reg-chart circle')).toHaveCount(4);

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1,
  );
  expect(hasOverflow, '結果表示時の375px横スクロール').toBe(false);

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(
    results.violations.map((v) => v.id),
    '結果表示時のaxe違反',
  ).toEqual([]);
});
