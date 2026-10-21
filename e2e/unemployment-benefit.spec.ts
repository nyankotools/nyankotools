import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test.describe('失業保険（基本手当）の計算', () => {
  test('日本語版: 初期値（35歳・月30万円・5年・自己都合）で計算される', async ({
    page,
  }) => {
    await page.goto('/tools/unemployment-benefit/');

    await expect(page.locator('#ub-wage')).toHaveValue('300,000');
    await expect(page.locator('#ub-result-daily')).toHaveText('￥6,307');
    await expect(page.locator('#ub-result-days')).toHaveText('90日');
    await expect(page.locator('#ub-result-total')).toHaveText('￥567,630');
    await expect(page.locator('#ub-result-restriction')).toHaveText('約1か月');
  });

  test('会社都合にすると日数が増え、給付制限がなくなる', async ({ page }) => {
    await page.goto('/tools/unemployment-benefit/');

    await page.locator('#ub-reason').selectOption('company');
    await expect(page.locator('#ub-result-days')).toHaveText('180日');
    await expect(page.locator('#ub-result-restriction')).toHaveText('なし');
  });

  test('自己都合で3回以上チェックすると給付制限が3か月になる', async ({
    page,
  }) => {
    await page.goto('/tools/unemployment-benefit/');

    await page.locator('#ub-repeated').check();
    await expect(page.locator('#ub-result-restriction')).toHaveText('約3か月');
  });

  test('被保険者期間が足りないと受給資格なしの警告を出す', async ({ page }) => {
    await page.goto('/tools/unemployment-benefit/');

    await page.locator('#ub-years').fill('0');
    await page.locator('#ub-months').fill('8');
    await expect(page.locator('#ub-not-eligible')).toBeVisible();
    await expect(page.locator('#ub-result-days')).toHaveText('0日');
  });

  test('年齢が範囲外だとエラーを表示し、結果を隠す', async ({ page }) => {
    await page.goto('/tools/unemployment-benefit/');

    await page.locator('#ub-age').fill('70');
    await expect(page.locator('#ub-error')).not.toBeEmpty();
    await expect(page.locator('#ub-results')).toBeHidden();
  });

  test('英語版が表示され計算される', async ({ page }) => {
    await page.goto('/en/tools/unemployment-benefit/');

    await expect(page.locator('#ub-result-daily')).toHaveText('¥6,307');
    await expect(page.locator('#ub-result-days')).toHaveText('90 days');
  });

  test('初期表示でaxeの違反がない', async ({ page }) => {
    for (const path of [
      '/tools/unemployment-benefit/',
      '/en/tools/unemployment-benefit/',
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
});
