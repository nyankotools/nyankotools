import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test.describe('贈与税の計算', () => {
  test('日本語版: 初期値（特例500万円）で税額と該当行が表示される', async ({
    page,
  }) => {
    await page.goto('/tools/gift-tax-calculator/');

    await expect(page.locator('#gift-special')).toHaveValue('5,000,000');
    await expect(page.locator('#gift-result-taxable')).toHaveText(
      '￥3,900,000',
    );
    await expect(page.locator('#gift-result-payable')).toHaveText('￥485,000');
    await expect(page.locator('#gift-row-special-1')).toHaveClass(/font-bold/);
    await expect(page.locator('#gift-row-special-0')).not.toHaveClass(
      /font-bold/,
    );
  });

  test('英語版が表示され税額が計算される', async ({ page }) => {
    await page.goto('/en/tools/gift-tax-calculator/');

    await expect(page.locator('#gift-result-payable')).toHaveText('¥485,000');
    await expect(page.locator('#gift-result-compare')).toContainText('¥45,000');
  });

  test('特例と一般の両方を入力すると按分して計算する', async ({ page }) => {
    await page.goto('/tools/gift-tax-calculator/');

    await page.locator('#gift-special').fill('5000000');
    await page.locator('#gift-general').fill('3000000');
    await expect(page.locator('#gift-general')).toHaveValue('3,000,000');
    await expect(page.locator('#gift-result-special-share')).toHaveText(
      '￥731,250',
    );
    await expect(page.locator('#gift-result-general-share')).toHaveText(
      '￥566,250',
    );
    await expect(page.locator('#gift-result-payable')).toHaveText(
      '￥1,297,500',
    );
    await expect(page.locator('#gift-row-special-3')).toHaveClass(/font-bold/);
    await expect(page.locator('#gift-row-general-4')).toHaveClass(/font-bold/);
  });

  test('基礎控除以下は0円で、メッセージを表示する', async ({ page }) => {
    await page.goto('/tools/gift-tax-calculator/');

    await page.locator('#gift-special').fill('1000000');
    await expect(page.locator('#gift-result-payable')).toHaveText('￥0');
    await expect(page.locator('#gift-zero-note')).toBeVisible();
  });

  test('入力を空にすると結果が隠れる', async ({ page }) => {
    await page.goto('/tools/gift-tax-calculator/');

    await page.locator('#gift-special').fill('');
    await expect(page.locator('#gift-results')).toBeHidden();
  });

  test('特例税率の区分の境界: 課税価格200万円ちょうどは10%、超えると15%', async ({
    page,
  }) => {
    await page.goto('/tools/gift-tax-calculator/');

    // 贈与310万円 − 基礎控除110万円 = 課税価格200万円 → 10%（税額20万円）
    await page.locator('#gift-special').fill('3100000');
    await expect(page.locator('#gift-result-payable')).toHaveText('￥200,000');
    // 課税価格210万円 → 15% − 10万円 = 21.5万円
    await page.locator('#gift-special').fill('3200000');
    await expect(page.locator('#gift-result-payable')).toHaveText('￥215,000');
  });

  test('初期表示でaxeの違反がない（ja/en）', async ({ page }) => {
    for (const path of [
      '/tools/gift-tax-calculator/',
      '/en/tools/gift-tax-calculator/',
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
