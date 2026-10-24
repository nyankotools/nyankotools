import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test.describe('源泉徴収税額の計算', () => {
  test('日本語版: 初期値（税抜10万円）で源泉徴収と振込額が計算される', async ({
    page,
  }) => {
    await page.goto('/tools/withholding-tax-calculator/');

    await expect(page.locator('#wh-amount')).toHaveValue('100,000');
    await expect(page.locator('#wh-result-withholding')).toHaveText('￥10,210');
    await expect(page.locator('#wh-result-invoice-total')).toHaveText(
      '￥110,000',
    );
    await expect(page.locator('#wh-result-payment')).toHaveText('￥99,790');
  });

  test('英語版が表示される', async ({ page }) => {
    await page.goto('/en/tools/withholding-tax-calculator/');

    await expect(page.locator('#wh-result-payment')).toHaveText('¥99,790');
  });

  test('税込モードでは税込額全体が対象になる', async ({ page }) => {
    await page.goto('/tools/withholding-tax-calculator/');

    await page.locator('#wh-mode').selectOption('incl');
    await page.locator('#wh-amount').fill('110000');
    await expect(page.locator('#wh-result-withholding')).toHaveText('￥11,231');
    await expect(page.locator('#wh-result-payment')).toHaveText('￥98,769');
  });

  test('100万円を超えると高い税率の区分になる', async ({ page }) => {
    await page.goto('/tools/withholding-tax-calculator/');

    await page.locator('#wh-mode').selectOption('incl');
    await page.locator('#wh-amount').fill('2000000');
    await expect(page.locator('#wh-result-withholding')).toHaveText(
      '￥306,300',
    );
    await expect(page.locator('#wh-result-band')).toContainText('20.42%');
  });

  test('100万円ちょうどと100万1円は、どちらも超過分の区分に入らない税額', async ({
    page,
  }) => {
    await page.goto('/tools/withholding-tax-calculator/');

    await page.locator('#wh-mode').selectOption('incl');
    await page.locator('#wh-amount').fill('1000000');
    await expect(page.locator('#wh-result-withholding')).toHaveText(
      '￥102,100',
    );
    await expect(page.locator('#wh-result-band')).toContainText('10.21%');
    await page.locator('#wh-amount').fill('1000001');
    await expect(page.locator('#wh-result-withholding')).toHaveText(
      '￥102,100',
    );
    await expect(page.locator('#wh-result-band')).toContainText('20.42%');
  });

  test('司法書士モードで1万円を控除する', async ({ page }) => {
    await page.goto('/tools/withholding-tax-calculator/');

    await page.locator('#wh-mode').selectOption('incl');
    await page.locator('#wh-judicial').check();
    await expect(page.locator('#wh-result-withholding')).toHaveText('￥9,189');
  });

  test('手取りから逆算すると振込額が手取りと一致する', async ({ page }) => {
    await page.goto('/tools/withholding-tax-calculator/');

    await page.locator('#wh-mode').selectOption('net-incl');
    await page.locator('#wh-amount').fill('100000');
    await expect(page.locator('#wh-result-payment')).toHaveText('￥100,000');
  });

  test('金額を空にすると結果が隠れる', async ({ page }) => {
    await page.goto('/tools/withholding-tax-calculator/');

    await page.locator('#wh-amount').fill('');
    await expect(page.locator('#wh-results')).toBeHidden();
  });

  test('初期表示でaxeの違反がない', async ({ page }) => {
    for (const path of [
      '/tools/withholding-tax-calculator/',
      '/en/tools/withholding-tax-calculator/',
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
