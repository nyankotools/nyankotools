import { test, expect } from './helpers/test';

test.describe('キーペア生成（日本語版）', () => {
  test('ECDSA・RSAの鍵ペアをPEMで生成できる', async ({ page }) => {
    await page.goto('/tools/keypair-generator/');
    await expect(page.locator('main h1')).toHaveText(
      'キーペア生成（RSA・ECDSA・Ed25519）',
    );

    await page.locator('#keypair-algorithm').selectOption('ec-p256');
    await page.locator('#keypair-generate-button').click();
    await expect(page.locator('#keypair-public')).toHaveValue(
      /^-----BEGIN PUBLIC KEY-----/,
    );
    await expect(page.locator('#keypair-private')).toHaveValue(
      /^-----BEGIN PRIVATE KEY-----/,
    );
    const first = await page.locator('#keypair-private').inputValue();

    await page.locator('#keypair-algorithm').selectOption('rsa-2048');
    await page.locator('#keypair-generate-button').click();
    await expect(page.locator('#keypair-private')).not.toHaveValue(first);
    await expect(page.locator('#keypair-private')).toHaveValue(
      /^-----BEGIN PRIVATE KEY-----/,
    );
  });

  test('公開鍵をコピーでき、.pemとして保存できる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/keypair-generator/');
    await page.locator('#keypair-algorithm').selectOption('ec-p256');
    await page.locator('#keypair-generate-button').click();
    await expect(page.locator('#keypair-public')).not.toHaveValue('');

    await page.locator('#keypair-public-copy-button').click();
    await expect(page.locator('#keypair-public-status')).toHaveText(
      'コピーしました',
    );

    const download = page.waitForEvent('download');
    await page.locator('#keypair-private-download-button').click();
    expect((await download).suggestedFilename()).toBe('private.pem');
  });
});

test.describe('Key Pair Generator (English)', () => {
  test('英語版で鍵ペアを生成できる', async ({ page }) => {
    await page.goto('/en/tools/keypair-generator/');
    await expect(page.locator('main h1')).toHaveText(
      'Key Pair Generator (RSA, ECDSA, Ed25519)',
    );
    await page.locator('#keypair-algorithm').selectOption('ec-p384');
    await page.locator('#keypair-generate-button').click();
    await expect(page.locator('#keypair-public')).toHaveValue(
      /^-----BEGIN PUBLIC KEY-----/,
    );
  });
});
