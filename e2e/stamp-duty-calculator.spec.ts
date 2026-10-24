import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test.describe('印紙税額の計算', () => {
  test('日本語版: 初期値（建設工事請負500万円）で本則の税額が出る', async ({
    page,
  }) => {
    await page.goto('/tools/stamp-duty-calculator/');

    await expect(page.locator('#stamp-amount')).toHaveValue('5,000,000');
    await expect(page.locator('#stamp-result-tax')).toHaveText('￥2,000');
  });

  test('英語版が表示され税額が計算される', async ({ page }) => {
    await page.goto('/en/tools/stamp-duty-calculator/');

    await expect(page.locator('#stamp-result-tax')).toHaveText('¥2,000');
  });

  test('軽減措置を適用すると税額が下がり、期限後は適用されない', async ({
    page,
  }) => {
    await page.goto('/tools/stamp-duty-calculator/');

    await page.locator('#stamp-relief').check();
    await page.locator('#stamp-date').fill('2027-03-31');
    await expect(page.locator('#stamp-result-tax')).toHaveText('￥1,000');
    await expect(page.locator('#stamp-result-normal')).toHaveText('￥2,000');
    await expect(page.locator('#stamp-result-saving')).toHaveText('￥1,000');

    await page.locator('#stamp-date').fill('2027-04-01');
    await expect(page.locator('#stamp-result-tax')).toHaveText('￥2,000');
    await expect(page.locator('#stamp-expired')).toBeVisible();
  });

  test('100万円ちょうどの請負は200円', async ({ page }) => {
    await page.goto('/tools/stamp-duty-calculator/');

    await page.locator('#stamp-amount').fill('1000000');
    await expect(page.locator('#stamp-result-tax')).toHaveText('￥200');
    await page.locator('#stamp-amount').fill('1000001');
    await expect(page.locator('#stamp-result-tax')).toHaveText('￥400');
  });

  test('定額の文書では金額欄が隠れる', async ({ page }) => {
    await page.goto('/tools/stamp-duty-calculator/');

    await page.locator('#stamp-doc').selectOption('no5');
    await expect(page.locator('#stamp-amount')).toBeHidden();
    await expect(page.locator('#stamp-result-tax')).toHaveText('￥40,000');
  });

  test('領収書は5万円未満が非課税、記載なしは200円', async ({ page }) => {
    await page.goto('/tools/stamp-duty-calculator/');

    await page.locator('#stamp-doc').selectOption('no17-sales');
    await page.locator('#stamp-amount').fill('49999');
    await expect(page.locator('#stamp-result-tax')).toHaveText('￥0');
    await expect(page.locator('#stamp-nontaxable-note')).toBeVisible();

    await page.locator('#stamp-amount').fill('50000');
    await expect(page.locator('#stamp-result-tax')).toHaveText('￥200');

    await page.locator('#stamp-no-amount').check();
    await expect(page.locator('#stamp-amount')).toBeHidden();
    await expect(page.locator('#stamp-result-tax')).toHaveText('￥200');
  });

  test('金額を空にすると結果が隠れる', async ({ page }) => {
    await page.goto('/tools/stamp-duty-calculator/');

    await page.locator('#stamp-amount').fill('');
    await expect(page.locator('#stamp-results')).toBeHidden();
  });

  test('初期表示でaxeの違反がない（ja/en）', async ({ page }) => {
    for (const path of [
      '/tools/stamp-duty-calculator/',
      '/en/tools/stamp-duty-calculator/',
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
