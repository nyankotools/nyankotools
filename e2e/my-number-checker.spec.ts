import { test, expect } from './helpers/test';

test.describe('マイナンバー・法人番号チェックデジット検証ツール', () => {
  test('正しい個人番号を検証できる', async ({ page }) => {
    await page.goto('/tools/my-number-checker/');
    await page.locator('#mn-input').fill('1234 5678 9018');
    await expect(page.locator('#mn-result')).toContainText('正しい');
  });

  test('検査用数字が違う番号は不正と表示する', async ({ page }) => {
    await page.goto('/tools/my-number-checker/');
    await page.locator('#mn-input').fill('123456789019');
    await expect(page.locator('#mn-result')).toContainText('一致しません');
    await expect(page.locator('#mn-detail')).toContainText('8');
  });

  test('11桁なら検査用数字を補って完成した番号を出す', async ({ page }) => {
    await page.goto('/tools/my-number-checker/');
    await page.locator('#mn-input').fill('12345678901');
    await expect(page.locator('#mn-detail')).toContainText('123456789018');
    await expect(page.locator('#mn-copy-button')).toBeVisible();
  });

  test('法人番号（T付き）を検証し、インボイス登録番号を表示する', async ({
    page,
  }) => {
    await page.goto('/tools/my-number-checker/');
    await page.locator('#mn-kind [data-kind="corporate"]').click();
    await page.locator('#mn-input').fill('T7000012050002');
    await expect(page.locator('#mn-result')).toContainText('正しい');
    await expect(page.locator('#mn-invoice')).toContainText('T7000012050002');
  });

  test('桁数違い・数字以外はエラー表示', async ({ page }) => {
    await page.goto('/tools/my-number-checker/');
    await page.locator('#mn-input').fill('123');
    await expect(page.locator('#mn-result')).toContainText('12桁');
    await page.locator('#mn-input').fill('12345678901x');
    await expect(page.locator('#mn-result')).toContainText('数字以外');
  });

  test('入力はURLクエリで初期化されず、再読み込みで残らない', async ({
    page,
  }) => {
    await page.goto('/tools/my-number-checker/?text=123456789018');
    await expect(page.locator('#mn-input')).toHaveValue('');
    await page.locator('#mn-input').fill('123456789018');
    await page.reload();
    await expect(page.locator('#mn-input')).toHaveValue('');
  });

  test('英語版が表示される', async ({ page }) => {
    await page.goto('/en/tools/my-number-checker/');
    await expect(page.locator('main h1')).toContainText('My Number');
    await page.locator('#mn-input').fill('123456789018');
    await expect(page.locator('#mn-result')).toContainText('correct');
  });
});
