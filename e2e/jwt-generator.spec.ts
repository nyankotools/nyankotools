import { test, expect } from './helpers/test';

const EXPECTED =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

test.describe('JWT生成・署名（日本語版）', () => {
  test('既定値でjwt.ioのサンプルと同じJWTが生成される', async ({ page }) => {
    await page.goto('/tools/jwt-generator/');
    await expect(page.locator('main h1')).toHaveText(
      'JWT生成・署名（HS256/HS384/HS512）',
    );
    await expect(page.locator('#jwt-generator-result')).toHaveValue(EXPECTED);
  });

  test('アルゴリズム変更とエラー表示', async ({ page }) => {
    await page.goto('/tools/jwt-generator/');
    await page.locator('#jwt-generator-algorithm').selectOption('HS512');
    await expect(page.locator('#jwt-generator-result')).toHaveValue(
      /^eyJhbGciOiJIUzUxMiIs/,
    );
    await page.locator('#jwt-generator-payload').fill('{');
    await expect(page.locator('#jwt-generator-error')).toBeVisible();
    await expect(page.locator('#jwt-generator-result')).toHaveValue('');
  });

  test('iat/expボタンでペイロードに日時が入り、exp は iat の1時間後になる', async ({
    page,
  }) => {
    await page.goto('/tools/jwt-generator/');
    await page.locator('#jwt-generator-timestamps').click();
    await expect(page.locator('#jwt-generator-payload')).toHaveValue(/"exp"/);
    const payload = JSON.parse(
      await page.locator('#jwt-generator-payload').inputValue(),
    );
    expect(payload.exp - payload.iat).toBe(3600);
    // 生成されたトークンのペイロード部も更新後の内容と一致する
    const token = await page.locator('#jwt-generator-result').inputValue();
    const decoded = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64url').toString('utf8'),
    );
    expect(decoded).toEqual(payload);
  });

  test('不正なヘッダー・16進数の鍵でエラーが表示され、結果が空になる', async ({
    page,
  }) => {
    await page.goto('/tools/jwt-generator/');
    const error = page.locator('#jwt-generator-error');
    const result = page.locator('#jwt-generator-result');

    await page.locator('#jwt-generator-header').fill('{"alg":');
    await expect(error).toBeVisible();
    await expect(error).toHaveText(
      'ヘッダーがJSONオブジェクトとして正しくありません。',
    );
    await expect(result).toHaveValue('');

    await page.locator('#jwt-generator-header').fill('{"typ":"JWT"}');
    await expect(error).toBeHidden();
    await expect(result).not.toHaveValue('');

    await page.locator('#jwt-generator-secret-format').selectOption('hex');
    await page.locator('#jwt-generator-secret').fill('xyz');
    await expect(error).toHaveText(
      '鍵が正しい16進数ではありません（偶数桁の0-9・a-fで入力）。',
    );
    await expect(result).toHaveValue('');
  });
});

test.describe('JWT Generator（英語版）', () => {
  test('既定値でJWTが生成される', async ({ page }) => {
    await page.goto('/en/tools/jwt-generator/');
    await expect(page.locator('main h1')).toHaveText(
      'JWT Generator & Signer (HS256/HS384/HS512)',
    );
    await expect(page.locator('#jwt-generator-result')).toHaveValue(EXPECTED);
  });

  test('invalid payload shows an English error and iat/exp can be set', async ({
    page,
  }) => {
    await page.goto('/en/tools/jwt-generator/');
    await page.locator('#jwt-generator-payload').fill('[1]');
    await expect(page.locator('#jwt-generator-error')).toHaveText(
      'The payload is not a valid JSON object.',
    );
    await page.locator('#jwt-generator-payload').fill('{}');
    await page.locator('#jwt-generator-timestamps').click();
    await expect(page.locator('#jwt-generator-payload')).toHaveValue(/"exp"/);
  });
});
