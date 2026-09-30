import { test, expect } from './helpers/test';

test.describe('消費税・割引計算機', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/tools/tax-calculator/');
    await expect(page.locator('main h1')).toHaveText('消費税・割引計算機');
  });

  test('初期表示時点で税抜1000円・標準税率10%を基準に自動計算される', async ({
    page,
  }) => {
    await page.goto('/tools/tax-calculator/');

    await expect(page.locator('#tax-calc-result-excluded')).toHaveText(
      '￥1,000',
    );
    await expect(page.locator('#tax-calc-result-tax')).toHaveText('￥100');
    await expect(page.locator('#tax-calc-result-included')).toHaveText(
      '￥1,100',
    );
  });

  test('初期表示時点で元の価格5000円・割引率20%を基準に自動計算される', async ({
    page,
  }) => {
    await page.goto('/tools/tax-calculator/');

    await expect(page.locator('#discount-calc-result-amount')).toHaveText(
      '￥1,000',
    );
    await expect(page.locator('#discount-calc-result-price')).toHaveText(
      '￥4,000',
    );
    await expect(page.locator('#discount-calc-result-rate')).toHaveText('20%');
  });

  test('税込金額を入力すると税抜金額・消費税額へ逆算される', async ({
    page,
  }) => {
    await page.goto('/tools/tax-calculator/');

    await page.getByRole('radio', { name: '税込金額' }).check();
    await page.locator('#tax-calc-amount').fill('1100');

    await expect(page.locator('#tax-calc-result-excluded')).toHaveText(
      '￥1,000',
    );
    await expect(page.locator('#tax-calc-result-tax')).toHaveText('￥100');
    await expect(page.locator('#tax-calc-result-included')).toHaveText(
      '￥1,100',
    );
  });

  test('軽減税率8%に切り替えて計算できる', async ({ page }) => {
    await page.goto('/tools/tax-calculator/');

    await page.getByRole('radio', { name: '軽減税率（8%）' }).check();

    await expect(page.locator('#tax-calc-result-tax')).toHaveText('￥80');
    await expect(page.locator('#tax-calc-result-included')).toHaveText(
      '￥1,080',
    );
  });

  test('カスタム税率入力欄はカスタムを選択したときだけ有効になる', async ({
    page,
  }) => {
    await page.goto('/tools/tax-calculator/');

    const customInput = page.locator('#tax-calc-rate-custom');
    await expect(customInput).toBeDisabled();

    await page.getByRole('radio', { name: 'カスタム' }).check();
    await expect(customInput).toBeEnabled();

    await customInput.fill('5.5');
    await expect(page.locator('#tax-calc-result-tax')).toHaveText('￥55');
    await expect(page.locator('#tax-calc-result-included')).toHaveText(
      '￥1,055',
    );

    // 標準税率に戻すとカスタム入力欄は再び無効化され、10%の結果に戻る
    await page.getByRole('radio', { name: '標準税率（10%）' }).check();
    await expect(customInput).toBeDisabled();
    await expect(page.locator('#tax-calc-result-tax')).toHaveText('￥100');
  });

  test('金額が負だとエラーメッセージが表示され、結果は非表示になる', async ({
    page,
  }) => {
    await page.goto('/tools/tax-calculator/');

    await page.locator('#tax-calc-amount').fill('-100');

    await expect(page.locator('#tax-calc-error')).toHaveText(
      '計算できませんでした（金額・税率は0以上の値を入力してください）',
    );
    await expect(page.locator('#tax-calc-results')).toBeHidden();
  });

  test('金額を空にすると結果もエラーも表示されない', async ({ page }) => {
    await page.goto('/tools/tax-calculator/');

    await page.locator('#tax-calc-amount').fill('');

    await expect(page.locator('#tax-calc-error')).toHaveText('');
    await expect(page.locator('#tax-calc-results')).toBeHidden();
  });

  test('割引額（円）指定に切り替えて割引後価格を計算できる', async ({
    page,
  }) => {
    await page.goto('/tools/tax-calculator/');

    await page.getByRole('radio', { name: '割引額（円）' }).check();
    await expect(page.locator('label[for="discount-calc-value"]')).toHaveText(
      '割引額（円）',
    );

    await page.locator('#discount-calc-value').fill('1500');

    await expect(page.locator('#discount-calc-result-amount')).toHaveText(
      '￥1,500',
    );
    await expect(page.locator('#discount-calc-result-price')).toHaveText(
      '￥3,500',
    );
    await expect(page.locator('#discount-calc-result-rate')).toHaveText('30%');
  });

  test('割引率が100%を超えるとエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/tax-calculator/');

    await page.locator('#discount-calc-value').fill('150');

    await expect(page.locator('#discount-calc-error')).toHaveText(
      '計算できませんでした（元の価格は0より大きく、割引率は0〜100%、割引額は元の価格以下で入力してください）',
    );
    await expect(page.locator('#discount-calc-results')).toBeHidden();
  });

  test('セクション1の端数処理を変更してもセクション2の割引計算結果は変わらない', async ({
    page,
  }) => {
    await page.goto('/tools/tax-calculator/');

    // 999円の10%は99.9円 -> 割引側は初期値floorのまま99円
    await page.locator('#discount-calc-original').fill('999');
    await page.locator('#discount-calc-value').fill('10');
    await expect(page.locator('#discount-calc-result-amount')).toHaveText(
      '￥99',
    );

    // 999円の10%は99.9円 -> 税計算側をceilに変えると100円になる
    await page.locator('#tax-calc-amount').fill('999');
    await page.getByRole('radio', { name: '切り上げ' }).first().check();
    await expect(page.locator('#tax-calc-result-tax')).toHaveText('￥100');

    // 割引側の結果は税計算側の端数処理変更の影響を受けない
    await expect(page.locator('#discount-calc-result-amount')).toHaveText(
      '￥99',
    );
  });

  test('セクション2の端数処理を変更してもセクション1の消費税計算結果は変わらない', async ({
    page,
  }) => {
    await page.goto('/tools/tax-calculator/');

    // 999円の10%は99.9円 -> 税計算側は初期値floorのまま99円
    await page.locator('#tax-calc-amount').fill('999');
    await expect(page.locator('#tax-calc-result-tax')).toHaveText('￥99');

    // 999円の10%割引は99.9円 -> 割引側をceilに変えると100円になる
    await page.locator('#discount-calc-original').fill('999');
    await page.locator('#discount-calc-value').fill('10');
    await page.getByRole('radio', { name: '切り上げ' }).last().check();
    await expect(page.locator('#discount-calc-result-amount')).toHaveText(
      '￥100',
    );

    // 税計算側の結果は割引側の端数処理変更の影響を受けない
    await expect(page.locator('#tax-calc-result-tax')).toHaveText('￥99');
  });
});
