import { test, expect } from './helpers/test';

const ED25519 =
  'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOO5oum+3qqVZlGjw8biKqsamenET2qniWYO1tcPZIjl test@ed25519';
const ED25519_SHA256 = 'SHA256:TQ9cFb19k0BLT9WpzmPuuhdvjzPcqLWmRsL3wGvC6YY';
const ED25519_MD5 = 'MD5:3e:ab:04:dc:04:d2:e7:0f:cb:44:d7:64:de:f3:34:b8';

test.describe('SSH鍵フィンガープリント表示（日本語版）', () => {
  test('公開鍵からSHA256とMD5が表示され、コピーできる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/ssh-fingerprint/');
    await expect(page.locator('main h1')).toHaveText(
      'SSH鍵フィンガープリント表示',
    );

    await page.locator('#ssh-fingerprint-input').fill(ED25519);
    const results = page.locator('#ssh-fingerprint-results');
    await expect(results.locator('input').nth(0)).toHaveValue(ED25519_SHA256);
    await expect(results.locator('input').nth(1)).toHaveValue(ED25519_MD5);
    await expect(results).toContainText('ED25519');
    await expect(results).toContainText('test@ed25519');

    await page.locator('#ssh-fingerprint-copy-button-1').click();
    await expect(page.locator('#ssh-fingerprint-status')).toHaveText(
      'コピーしました',
    );
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      ED25519_SHA256,
    );
  });

  test('複数行は行ごとに結果とエラーを表示する', async ({ page }) => {
    await page.goto('/tools/ssh-fingerprint/');
    await page
      .locator('#ssh-fingerprint-input')
      .fill(`${ED25519}\ngarbage line`);
    const results = page.locator('#ssh-fingerprint-results');
    await expect(results.locator('section')).toHaveCount(1);
    await expect(results.locator('.ui-error')).toContainText('2行目');
  });
});

test.describe('SSH Key Fingerprint Viewer (English)', () => {
  test('英語版が表示され、フィンガープリントが計算される', async ({ page }) => {
    await page.goto('/en/tools/ssh-fingerprint/');
    await expect(page.locator('main h1')).toHaveText(
      'SSH Key Fingerprint Viewer',
    );
    await page.locator('#ssh-fingerprint-input').fill(ED25519);
    await expect(
      page.locator('#ssh-fingerprint-results input').first(),
    ).toHaveValue(ED25519_SHA256);
    await expect(
      page.getByRole('heading', { level: 2, name: 'Glossary' }),
    ).toBeVisible();
  });
});
