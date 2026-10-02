import { test, expect } from './helpers/test';

test.describe('フリーランス手取り計算機', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/tools/freelance-income-calculator/');
    await expect(page.locator('main h1')).toHaveText(
      'フリーランス手取り計算機',
    );
  });

  test('初期表示時点で売上600万円・経費100万円・白色申告を基準に自動計算される', async ({
    page,
  }) => {
    await page.goto('/tools/freelance-income-calculator/');

    await expect(page.locator('#freelance-calc-result-net')).toHaveText(
      '￥3,734,224',
    );
    await expect(
      page.locator('#freelance-calc-result-business-income'),
    ).toHaveText('￥5,000,000');
    await expect(page.locator('#freelance-calc-result-income-tax')).toHaveText(
      '￥346,500',
    );
    await expect(
      page.locator('#freelance-calc-result-resident-tax'),
    ).toHaveText('￥412,000');
  });

  test('青色申告特別控除65万円を選ぶと事業所得・税額・手取りが変わる', async ({
    page,
  }) => {
    await page.goto('/tools/freelance-income-calculator/');

    await page
      .getByRole('radio', { name: '65万円（e-Taxまたは電子帳簿保存）' })
      .check();

    await expect(
      page.locator('#freelance-calc-result-business-income'),
    ).toHaveText('￥4,350,000');
    await expect(page.locator('#freelance-calc-result-income-tax')).toHaveText(
      '￥219,500',
    );
    await expect(page.locator('#freelance-calc-result-net')).toHaveText(
      '￥3,928,891',
    );
  });

  test('経費が売上を上回ると事業所得0円・税額0円・手取りはマイナスになる', async ({
    page,
  }) => {
    await page.goto('/tools/freelance-income-calculator/');

    await page.locator('#freelance-calc-revenue').fill('1000000');
    await page.locator('#freelance-calc-expenses').fill('1200000');
    await page.locator('#freelance-calc-social-insurance').fill('0');

    await expect(
      page.locator('#freelance-calc-result-business-income'),
    ).toHaveText('￥0');
    await expect(page.locator('#freelance-calc-result-income-tax')).toHaveText(
      '￥0',
    );
    await expect(page.locator('#freelance-calc-result-net')).toHaveText(
      '-￥200,000',
    );
  });

  test('売上が空だと結果もエラーも表示されない', async ({ page }) => {
    await page.goto('/tools/freelance-income-calculator/');

    await page.locator('#freelance-calc-revenue').fill('');

    await expect(page.locator('#freelance-calc-error')).toHaveText('');
    await expect(page.locator('#freelance-calc-results')).toBeHidden();
  });

  test('経費が負だとエラーメッセージが表示され、結果は非表示になる', async ({
    page,
  }) => {
    await page.goto('/tools/freelance-income-calculator/');

    await page.locator('#freelance-calc-expenses').fill('-1');

    await expect(page.locator('#freelance-calc-error')).toHaveText(
      '計算できませんでした（売上・経費・社会保険料・その他の所得控除は0以上の値を入力してください）',
    );
    await expect(page.locator('#freelance-calc-results')).toBeHidden();
  });
});
