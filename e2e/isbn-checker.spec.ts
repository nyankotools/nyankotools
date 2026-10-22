import { test, expect } from './helpers/test';

test.describe('ISBN・JANチェックデジット検証（日本語版）', () => {
  test('ISBN-13を検証しISBN-10に変換する', async ({ page }) => {
    await page.goto('/tools/isbn-checker/');
    await page.locator('#isbn-checker-input').fill('978-0-306-40615-7');
    await expect(page.locator('#isbn-checker-status')).toHaveText(
      'チェックデジットは正しいです。',
    );
    await expect(page.locator('#isbn-checker-list')).toContainText(
      '0306406152',
    );
  });

  test('チェックデジット誤りと桁数エラーを表示する', async ({ page }) => {
    await page.goto('/tools/isbn-checker/');
    await page.locator('#isbn-checker-input').fill('4901234567895');
    await expect(page.locator('#isbn-checker-status')).toContainText(
      '正しい値は 4 です',
    );
    await page.locator('#isbn-checker-input').fill('12345');
    await expect(page.locator('#isbn-checker-error')).toBeVisible();
    await expect(page.locator('#isbn-checker-result')).toBeHidden();
  });
});

test.describe('ISBN & EAN-13 Check Digit Validator (English)', () => {
  test('12桁からチェックデジットを補完する', async ({ page }) => {
    await page.goto('/en/tools/isbn-checker/');
    await page.locator('#isbn-checker-input').fill('490123456789');
    await expect(page.locator('#isbn-checker-status')).toHaveText(
      'Check digit calculated: 4.',
    );
    await expect(page.locator('#isbn-checker-list')).toContainText(
      '4901234567894',
    );
  });
});
