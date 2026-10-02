import { test, expect } from './helpers/test';

test.describe('パスワード強度チェッカー（日本語版）', () => {
  test('入力するとスコアと改善点が表示される', async ({ page }) => {
    await page.goto('/tools/password-strength-checker/');
    await expect(page.locator('main h1')).toHaveText(
      'パスワード強度チェッカー',
    );
    await expect(page.locator('#psc-level')).toHaveText('未入力');

    await page.locator('#psc-input').fill('password');
    await expect(page.locator('#psc-level')).toHaveText('非常に弱い');
    await expect(page.locator('[data-psc-issue="common"]')).toBeVisible();

    await page.locator('#psc-input').fill('G7#kLq9!vXz2$mRt');
    await expect(page.locator('#psc-level')).toHaveText('非常に強い');
    await expect(page.locator('#psc-no-issues')).toBeVisible();
    await expect(page.locator('#psc-offline')).toContainText('100万年以上');
  });

  test('表示切替でパスワードの表示・非表示を切り替えられる', async ({
    page,
  }) => {
    await page.goto('/tools/password-strength-checker/');
    await expect(page.locator('#psc-input')).toHaveAttribute(
      'type',
      'password',
    );
    await page.locator('#psc-show').check();
    await expect(page.locator('#psc-input')).toHaveAttribute('type', 'text');
  });
});

test.describe('Password Strength Checker (English)', () => {
  test('英語版が表示され判定される', async ({ page }) => {
    await page.goto('/en/tools/password-strength-checker/');
    await expect(page.locator('main h1')).toHaveText(
      'Password Strength Checker',
    );
    await page.locator('#psc-input').fill('qwerty123');
    await expect(page.locator('#psc-level')).toHaveText('Very weak');
  });
});
