import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test.describe('年収の壁チェック', () => {
  test('初期値（年収100万円）は扶養内で手取りが年収と同じ（ja）', async ({
    page,
  }) => {
    await page.goto('/tools/tax-wall-calculator/');

    await expect(page.locator('#tw-gross')).toHaveValue('1,000,000');
    await expect(page.locator('#tw-result-status')).toHaveText(/扶養/);
    await expect(page.locator('#tw-result-take-home')).toHaveText(/1,000,000/);
    // 106万円の対象外なら、最初の逆転は130万円
    await expect(page.locator('#tw-cliffs')).toContainText('1,300,000');
    await expect(page.locator('#tw-cliffs')).not.toContainText('1,060,000');
  });

  test('106万円の対象にして年収を上げると社会保険に加入し、106万円の逆転が出る', async ({
    page,
  }) => {
    await page.goto('/tools/tax-wall-calculator/');

    await page.locator('#tw-wall106').check();
    await page.locator('#tw-gross').fill('1100000');
    await expect(page.locator('#tw-result-status')).toHaveText(/社会保険/);
    await expect(page.locator('#tw-cliffs')).toContainText('1,060,000');
  });

  test('年収130万円以上だと国民健康保険・国民年金になる（en）', async ({
    page,
  }) => {
    await page.goto('/en/tools/tax-wall-calculator/');

    await page.locator('#tw-gross').fill('1400000');
    await expect(page.locator('#tw-result-status')).toHaveText(
      /National Health Insurance/,
    );
  });

  test('配偶者控除を考えないにすると配偶者控除の壁が対象外になる', async ({
    page,
  }) => {
    await page.goto('/tools/tax-wall-calculator/');

    await page.locator('#tw-spouse').selectOption('none');
    await expect(page.locator('#tw-result-spouse-deduction')).toHaveText(
      /^[^1-9]*0$/,
    );
    await expect(page.locator('#tw-walls')).toContainText('対象外');
  });

  test('年収を空にすると結果が隠れ、入れ直すと戻る', async ({ page }) => {
    await page.goto('/tools/tax-wall-calculator/');

    await page.locator('#tw-gross').fill('');
    await expect(page.locator('#tw-output')).toBeHidden();

    await page.locator('#tw-gross').fill('900000');
    await expect(page.locator('#tw-output')).toBeVisible();
  });

  test('初期表示でaxeの違反がない', async ({ page }) => {
    for (const path of [
      '/tools/tax-wall-calculator/',
      '/en/tools/tax-wall-calculator/',
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
