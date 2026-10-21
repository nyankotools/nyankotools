import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test('不動産投資の利回り計算: 初期値で利回りと内訳が表示される', async ({
  page,
}) => {
  await page.goto('/tools/real-estate-yield/');

  await expect(page.locator('#re-yield-results')).not.toHaveClass(/hidden/);
  await expect(page.locator('#re-yield-gross-yield')).toHaveText('7.20%');
  await expect(page.locator('#re-yield-net-yield')).toHaveText('5.23%');
  await expect(page.locator('#re-yield-noi')).toContainText('1,679,400');
  await expect(page.locator('#re-yield-loan-amount')).toContainText(
    '27,100,000',
  );
});

test('不動産投資の利回り計算: 家賃を変えると利回りが更新される', async ({
  page,
}) => {
  await page.goto('/tools/real-estate-yield/');

  await page.locator('#re-yield-rent').fill('250000');
  await expect(page.locator('#re-yield-gross-yield')).toHaveText('10.00%');
});

test('不動産投資の利回り計算: 自己資金が総額以上なら借入なしになる', async ({
  page,
}) => {
  await page.goto('/tools/real-estate-yield/');

  await page.locator('#re-yield-equity').fill('40000000');
  await expect(page.locator('#re-yield-loan-amount')).toContainText('0');
  await expect(page.locator('#re-yield-monthly-loan')).toContainText('0');
  await expect(page.locator('#re-yield-dscr')).toHaveText('―');
});

test('不動産投資の利回り計算: 不正な値ではエラーが表示される', async ({
  page,
}) => {
  await page.goto('/tools/real-estate-yield/');

  await page.locator('#re-yield-vacancy').fill('150');
  await expect(page.locator('#re-yield-error')).toContainText(
    '計算できませんでした',
  );
  await expect(page.locator('#re-yield-results')).toHaveClass(/hidden/);
});

test('不動産投資の利回り計算: 英語版で結果が表示される', async ({ page }) => {
  await page.goto('/en/tools/real-estate-yield/');

  await expect(page.locator('#re-yield-gross-yield')).toHaveText('7.20%');
  await expect(page.locator('#re-yield-annual-cf')).toContainText('¥');
});

test('不動産投資の利回り計算: 初期表示でaxeの違反がない', async ({ page }) => {
  for (const path of [
    '/tools/real-estate-yield/',
    '/en/tools/real-estate-yield/',
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
