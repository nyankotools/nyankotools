import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test.describe('育児休業給付金・出産手当金・傷病手当金の計算', () => {
  test('日本語版: 初期値（月給30万円・180日）で67%の給付が計算される', async ({
    page,
  }) => {
    await page.goto('/tools/childcare-leave-benefit/');

    await expect(page.locator('#cl-result-cc-total')).toHaveText('￥1,206,000');
    await expect(page.locator('#cl-result-cc-monthly-first')).toHaveText(
      '￥201,000',
    );
  });

  test('181日目以降は50%で加算され、出生後休業支援給付金も加算できる', async ({
    page,
  }) => {
    await page.goto('/tools/childcare-leave-benefit/');

    await page.locator('#cl-days').fill('365');
    await expect(page.locator('#cl-result-cc-total')).toHaveText('￥2,131,000');
    await page.locator('#cl-support').check();
    await expect(page.locator('#cl-result-cc-support')).toHaveText('￥36,400');
  });

  test('育休日数が0だとエラーを表示し、結果を隠す', async ({ page }) => {
    await page.goto('/tools/childcare-leave-benefit/');

    await page.locator('#cl-days').fill('0');
    await expect(page.locator('#cl-error')).not.toBeEmpty();
    await expect(page.locator('#cl-results-childcare')).toBeHidden();
    await page.locator('#cl-days').fill('30');
    await expect(page.locator('#cl-error')).toBeEmpty();
    await expect(page.locator('#cl-results-childcare')).toBeVisible();
  });

  test('出産手当金と傷病手当金に切り替えて計算できる', async ({ page }) => {
    await page.goto('/tools/childcare-leave-benefit/');

    await page.getByRole('button', { name: '出産手当金' }).click();
    await expect(page.locator('#cl-result-mt-total')).toHaveText('￥653,366');
    await expect(page.locator('#cl-result-mt-days')).toHaveText('98');

    await page.getByRole('button', { name: '傷病手当金' }).click();
    await expect(page.locator('#cl-result-sk-paid-days')).toHaveText('27');
    await expect(page.locator('#cl-results-maternity')).toBeHidden();
  });

  test('英語版が表示され計算される', async ({ page }) => {
    await page.goto('/en/tools/childcare-leave-benefit/');

    await expect(page.locator('#cl-result-cc-total')).toHaveText('¥1,206,000');
    await page.getByRole('button', { name: 'Sickness allowance' }).click();
    await expect(page.locator('#cl-result-sk-benefit-daily')).toHaveText(
      '¥6,667',
    );
  });

  test('初期表示でaxeの違反がない', async ({ page }) => {
    for (const path of [
      '/tools/childcare-leave-benefit/',
      '/en/tools/childcare-leave-benefit/',
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
