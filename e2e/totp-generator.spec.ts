import { test, expect } from './helpers/test';

// RFC 6238 のテストベクタ（秘密鍵 "12345678901234567890"、時刻59秒 → 下6桁 287082）
const RFC_SECRET = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';

test.describe('TOTPコード生成・検証（日本語版）', () => {
  test('秘密鍵から現在のコードが生成され、コードを検証できる', async ({
    page,
  }) => {
    await page.clock.setFixedTime(new Date(59_000));
    await page.goto('/tools/totp-generator/');
    await expect(page.locator('main h1')).toHaveText(
      'TOTPコード生成・検証（2段階認証）',
    );

    await page.locator('#totp-generator-secret').fill(RFC_SECRET);
    await expect(page.locator('#totp-generator-code')).toContainText('287082');
    await expect(page.locator('#totp-generator-remaining')).toHaveText(
      '残り1秒',
    );

    await page.locator('#totp-generator-verify').fill('287082');
    await expect(page.locator('#totp-generator-verify-result')).toContainText(
      '現在のコード',
    );
    await page.locator('#totp-generator-verify').fill('000000');
    await expect(page.locator('#totp-generator-verify-result')).toHaveText(
      '無効です',
    );
  });

  test('otpauth:// URIを貼り付けると鍵と設定が取り込まれる', async ({
    page,
  }) => {
    await page.clock.setFixedTime(new Date(59_000));
    await page.goto('/tools/totp-generator/');
    await page
      .locator('#totp-generator-secret')
      .fill(`otpauth://totp/Test?secret=${RFC_SECRET}&digits=8&period=30`);
    await expect(page.locator('#totp-generator-secret')).toHaveValue(
      RFC_SECRET,
    );
    await expect(page.locator('#totp-generator-digits')).toHaveValue('8');
    await expect(page.locator('#totp-generator-code')).toContainText(
      '94287082',
    );
  });

  test('不正なBase32はエラーを表示し、ランダム鍵の生成でコードが出る', async ({
    page,
  }) => {
    await page.goto('/tools/totp-generator/');
    await page.locator('#totp-generator-secret').fill('invalid-1!');
    await expect(page.locator('#totp-generator-error')).toBeVisible();
    await expect(page.locator('#totp-generator-result')).toBeHidden();

    await page.locator('#totp-generator-generate-button').click();
    await expect(page.locator('#totp-generator-error')).toBeHidden();
    await expect(page.locator('#totp-generator-code')).toContainText(/^\d{6}$/);
  });
});

test.describe('TOTP Code Generator (English)', () => {
  test('英語版が表示され、コードが生成される', async ({ page }) => {
    await page.clock.setFixedTime(new Date(59_000));
    await page.goto('/en/tools/totp-generator/');
    await expect(page.locator('main h1')).toHaveText(
      'TOTP Code Generator & Verifier (2FA)',
    );
    await page.locator('#totp-generator-secret').fill(RFC_SECRET);
    await expect(page.locator('#totp-generator-code')).toContainText('287082');
    await expect(page.locator('#totp-generator-remaining')).toHaveText(
      '1s left',
    );
  });
});
