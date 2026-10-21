import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test.describe('賞与の手取り計算', () => {
  test('前月給与が0だとエラーを表示し、結果を隠す（ja）', async ({ page }) => {
    await page.goto('/tools/bonus-take-home/');

    await page.locator('#bonus-previous-salary').fill('0');
    await expect(page.locator('#bonus-error')).not.toBeEmpty();
    await expect(page.locator('#bonus-results')).toBeHidden();

    // 前月給与を入れ直すと結果が戻る
    await page.locator('#bonus-previous-salary').fill('300000');
    await expect(page.locator('#bonus-error')).toBeEmpty();
    await expect(page.locator('#bonus-results')).toBeVisible();
  });

  test('前月給与を空にするとエラーを表示する（en）', async ({ page }) => {
    await page.goto('/en/tools/bonus-take-home/');

    await page.locator('#bonus-previous-salary').fill('');
    await expect(page.locator('#bonus-error')).not.toBeEmpty();
    await expect(page.locator('#bonus-results')).toBeHidden();
  });

  test('初期表示でaxeの違反がない', async ({ page }) => {
    for (const path of [
      '/tools/bonus-take-home/',
      '/en/tools/bonus-take-home/',
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

  test('日本語版: 初期値（賞与100万円・前月30万円）で手取りが計算される', async ({
    page,
  }) => {
    await page.goto('/tools/bonus-take-home/');

    await expect(page.locator('#bonus-gross')).toHaveValue('1,000,000');
    await expect(page.locator('#bonus-result-social-insurance')).toHaveText(
      '￥146,550',
    );
    await expect(page.locator('#bonus-result-income-tax')).toHaveText(
      '￥52,282',
    );
    await expect(page.locator('#bonus-result-take-home')).toHaveText(
      '￥801,168',
    );
  });

  test('扶養人数を増やすと源泉所得税が減る', async ({ page }) => {
    await page.goto('/tools/bonus-take-home/');

    await page.locator('#bonus-dependents').fill('2');
    await expect(page.locator('#bonus-result-rate')).toHaveText('2.042%');
  });

  test('40歳以上にすると介護保険料が表示される', async ({ page }) => {
    await page.goto('/tools/bonus-take-home/');

    await page.locator('#bonus-age40').check();
    await expect(page.locator('#bonus-result-nursing')).toHaveText('￥7,950');
  });

  test('賞与を空にすると結果が隠れる', async ({ page }) => {
    await page.goto('/tools/bonus-take-home/');

    await page.locator('#bonus-gross').fill('');
    await expect(page.locator('#bonus-results')).toBeHidden();
  });

  test('英語版が表示され手取りが計算される', async ({ page }) => {
    await page.goto('/en/tools/bonus-take-home/');

    await expect(page.locator('#bonus-result-take-home')).toHaveText(
      '¥801,168',
    );
  });
});
