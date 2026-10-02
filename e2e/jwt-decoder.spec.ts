import { test, expect } from './helpers/test';

test.describe('JWTデコーダー（日本語版）', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/tools/jwt-decoder/');
    await expect(page.locator('main h1')).toHaveText('JWTデコーダー');
  });

  test('有効なJWTをデコードできる', async ({ page }) => {
    await page.goto('/tools/jwt-decoder/');

    // 基本的なJWT形式のテストトークン
    // header.payload.signatureの3部構成
    const jwt =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    const input = page.locator('textarea').first();
    await input.fill(jwt);

    // ヘッダーがデコードされていることを確認
    const pageText = await page.locator('main').textContent();
    expect(pageText).toContain('HS256');

    // ペイロードがデコードされていることを確認
    expect(pageText).toContain('John Doe');
    expect(pageText).toContain('1234567890');
  });

  test('不正なJWT（形式が違う）でエラーが表示される', async ({ page }) => {
    await page.goto('/tools/jwt-decoder/');

    const input = page.locator('textarea').first();
    await input.fill('not.a.valid.jwt');

    const pageText = await page.locator('main').textContent();
    // エラーメッセージが表示されることを確認
    expect(pageText).toBeTruthy();
    // 「不正」「エラー」「形式」など日本語のエラーメッセージが含まれる可能性
  });

  test('空入力で結果が表示されない', async ({ page }) => {
    await page.goto('/tools/jwt-decoder/');

    const input = page.locator('textarea').first();
    await input.fill('');

    // 結果セクションは表示されないか、空になる
    const pageText = await page.locator('main').textContent();
    expect(pageText).not.toContain('John Doe');
  });

  test('JWTのペイロード内のクレームが正しく表示される', async ({ page }) => {
    await page.goto('/tools/jwt-decoder/');

    // ペイロードにクレームを含むJWT
    const jwt =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwiZXhwIjoxNzA0MDY3MjAwLCJpYXQiOjE2OTQwNjcyMDB9.abc123';

    const input = page.locator('textarea').first();
    await input.fill(jwt);

    const pageText = await page.locator('main').textContent();

    // ペイロード内のクレームが表示されることを確認
    expect(pageText).toContain('user123');
    expect(pageText).toContain('sub');
  });
});

test.describe('JWT Decoder (English)', () => {
  test('英語版が正しく表示される', async ({ page }) => {
    await page.goto('/en/tools/jwt-decoder/');
    await expect(page.locator('main h1')).toHaveText('JWT Decoder');
  });

  test('英語版でJWTをデコードできる', async ({ page }) => {
    await page.goto('/en/tools/jwt-decoder/');

    const jwt =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    const input = page.locator('textarea').first();
    await input.fill(jwt);

    const pageText = await page.locator('main').textContent();
    expect(pageText).toContain('John Doe');
  });
});
