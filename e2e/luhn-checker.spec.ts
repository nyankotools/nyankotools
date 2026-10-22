import { test, expect } from './helpers/test';

test.describe('Luhnチェック・カード番号ブランド判定ツール', () => {
  test('テスト番号を入れると合格とブランドを表示する', async ({ page }) => {
    await page.goto('/tools/luhn-checker/');
    await page.locator('#luhn-input').fill('4111 1111 1111 1111');
    await expect(page.locator('#luhn-result')).toContainText('合格');
    await expect(page.locator('#luhn-brand')).toContainText('Visa');
  });

  test('検査桁が違うと不合格と期待値を表示する', async ({ page }) => {
    await page.goto('/tools/luhn-checker/');
    await page.locator('#luhn-input').fill('4111111111111112');
    await expect(page.locator('#luhn-result')).toContainText('不合格');
    await expect(page.locator('#luhn-detail')).toContainText('1');
  });

  test('テスト番号ボタンで入力される', async ({ page }) => {
    await page.goto('/tools/luhn-checker/');
    await page.locator('[data-test-number="378282246310005"]').click();
    await expect(page.locator('#luhn-input')).toHaveValue('378282246310005');
    await expect(page.locator('#luhn-brand')).toContainText('American Express');
  });

  test('数字以外はエラー表示', async ({ page }) => {
    await page.goto('/tools/luhn-checker/');
    await page.locator('#luhn-input').fill('4111x');
    await expect(page.locator('#luhn-result')).toContainText('数字以外');
  });

  test('入力はURLクエリで初期化されず、再読み込みで残らない', async ({
    page,
  }) => {
    await page.goto('/tools/luhn-checker/?text=4111111111111111');
    await expect(page.locator('#luhn-input')).toHaveValue('');
    await page.locator('#luhn-input').fill('4111111111111111');
    await page.reload();
    await expect(page.locator('#luhn-input')).toHaveValue('');
  });

  test('英語版が表示される', async ({ page }) => {
    await page.goto('/en/tools/luhn-checker/');
    await expect(page.locator('main h1')).toContainText('Luhn');
    await page.locator('#luhn-input').fill('5555555555554444');
    await expect(page.locator('#luhn-result')).toContainText('passes');
    await expect(page.locator('#luhn-brand')).toContainText('Mastercard');
  });
});
