import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test.describe('退職金の税金計算', () => {
  test('日本語版: 初期値（2,000万円・勤続30年）で税額が計算される', async ({
    page,
  }) => {
    await page.goto('/tools/retirement-allowance-tax/');

    await expect(page.locator('#retire-pay')).toHaveValue('20,000,000');
    await expect(page.locator('#retire-result-deduction')).toHaveText(
      '￥15,000,000',
    );
    await expect(page.locator('#retire-result-taxable')).toHaveText(
      '￥2,500,000',
    );
    await expect(page.locator('#retire-result-income-tax')).toHaveText(
      '￥155,702',
    );
    await expect(page.locator('#retire-result-resident-tax')).toHaveText(
      '￥250,000',
    );
    await expect(page.locator('#retire-result-take-home')).toHaveText(
      '￥19,594,298',
    );
  });

  test('英語版が表示され手取りが計算される', async ({ page }) => {
    await page.goto('/en/tools/retirement-allowance-tax/');

    await expect(page.locator('#retire-result-take-home')).toHaveText(
      '¥19,594,298',
    );
    await expect(page.locator('#retire-result-counted-years')).toHaveText(
      '30 years',
    );
  });

  test('勤続5年以下の役員等は2分の1課税にならない', async ({ page }) => {
    await page.goto('/tools/retirement-allowance-tax/');

    await page.locator('#retire-pay').fill('10000000');
    await page.locator('#retire-years').fill('3');
    await page.locator('#retire-officer').check();
    await expect(page.locator('#retire-result-taxable')).toHaveText(
      '￥8,800,000',
    );
    await expect(page.locator('#retire-result-half-rule')).toContainText(
      '適用しない',
    );
  });

  test('端数の月を入れると勤続年数が切り上がる', async ({ page }) => {
    await page.goto('/tools/retirement-allowance-tax/');

    await page.locator('#retire-years').fill('10');
    await page.locator('#retire-months').fill('1');
    await expect(page.locator('#retire-result-counted-years')).toHaveText(
      '11年',
    );
  });

  test('勤続期間が0だとエラーを表示し、結果を隠す', async ({ page }) => {
    await page.goto('/tools/retirement-allowance-tax/');

    await page.locator('#retire-years').fill('0');
    await page.locator('#retire-months').fill('0');
    await expect(page.locator('#retire-error')).not.toBeEmpty();
    await expect(page.locator('#retire-results')).toBeHidden();

    await page.locator('#retire-years').fill('10');
    await expect(page.locator('#retire-error')).toBeEmpty();
    await expect(page.locator('#retire-results')).toBeVisible();
  });

  test('退職金を空にすると結果が隠れる', async ({ page }) => {
    await page.goto('/tools/retirement-allowance-tax/');

    await page.locator('#retire-pay').fill('');
    await expect(page.locator('#retire-results')).toBeHidden();
  });

  test('初期表示でaxeの違反がない', async ({ page }) => {
    for (const path of [
      '/tools/retirement-allowance-tax/',
      '/en/tools/retirement-allowance-tax/',
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
