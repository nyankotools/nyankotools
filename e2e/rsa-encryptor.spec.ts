import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { test, expect } from './helpers/test';

const output = '#rsa-encryptor-output';

async function makeKeys(page: Page, bits = 2048) {
  return page.evaluate(async (modulusLength) => {
    const pair = await crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      true,
      ['encrypt', 'decrypt'],
    );
    const pem = async (
      fmt: 'spki' | 'pkcs8',
      key: CryptoKey,
      label: string,
    ) => {
      const buf = new Uint8Array(await crypto.subtle.exportKey(fmt, key));
      let bin = '';
      for (const b of buf) bin += String.fromCharCode(b);
      return `-----BEGIN ${label}-----\n${btoa(bin)}\n-----END ${label}-----\n`;
    };
    return {
      pub: await pem('spki', pair.publicKey, 'PUBLIC KEY'),
      priv: await pem('pkcs8', pair.privateKey, 'PRIVATE KEY'),
    };
  }, bits);
}

test.describe('RSA暗号化・復号（日本語版）', () => {
  test('公開鍵で暗号化し、秘密鍵で復号できる。鍵情報と上限を表示する', async ({
    page,
  }) => {
    await page.goto('/tools/rsa-encryptor/');
    await expect(page.locator('main h1')).toHaveText(
      'RSA暗号化・復号（RSA-OAEP）',
    );
    const keys = await makeKeys(page);

    await page.locator('#rsa-encryptor-key').fill(keys.pub);
    await expect(page.locator('#rsa-encryptor-key-info')).toContainText(
      'RSA 2048ビット',
    );
    await expect(page.locator('#rsa-encryptor-key-info')).toContainText(
      '190 バイト',
    );
    await page.locator('#rsa-encryptor-input').fill('こんにちは 🐱');
    await expect(page.locator('#rsa-encryptor-length')).toContainText(
      '/ 190 バイト',
    );
    await page.locator('#rsa-encryptor-run-button').click();
    await expect(page.locator(output)).toHaveValue(/^[A-Za-z0-9+/]+=*$/);
    const encrypted = await page.locator(output).inputValue();

    await page.getByRole('button', { name: '復号', exact: true }).click();
    await page.locator('#rsa-encryptor-key').fill(keys.priv);
    await page.locator('#rsa-encryptor-input').fill(encrypted);
    await page.locator('#rsa-encryptor-run-button').click();
    await expect(page.locator(output)).toHaveValue('こんにちは 🐱');
  });

  test('未入力・鍵の取り違え・上限超過ではエラーを表示する', async ({
    page,
  }) => {
    await page.goto('/tools/rsa-encryptor/');
    const error = page.locator('#rsa-encryptor-error');
    await page.locator('#rsa-encryptor-run-button').click();
    await expect(error).toHaveText('鍵（PEM）を入力してください。');

    const keys = await makeKeys(page);
    await page.locator('#rsa-encryptor-key').fill(keys.priv);
    await page.locator('#rsa-encryptor-input').fill('x');
    await page.locator('#rsa-encryptor-run-button').click();
    await expect(error).toContainText('公開鍵');

    await page.locator('#rsa-encryptor-key').fill('not a pem');
    await page.locator('#rsa-encryptor-run-button').click();
    await expect(error).toContainText('PEM形式の鍵として読み込めませんでした');

    await page.locator('#rsa-encryptor-key').fill(keys.pub);
    await page.locator('#rsa-encryptor-input').fill('a'.repeat(191));
    await page.locator('#rsa-encryptor-run-button').click();
    await expect(error).toContainText('長すぎます');
  });

  test('結果をコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/rsa-encryptor/');
    const keys = await makeKeys(page);
    await page.locator('#rsa-encryptor-key').fill(keys.pub);
    await page.locator('#rsa-encryptor-input').fill('copy me');
    await page.locator('#rsa-encryptor-run-button').click();
    await expect(page.locator(output)).not.toHaveValue('');
    await page.locator('#rsa-encryptor-copy-button').click();
    await expect(page.locator('#rsa-encryptor-status')).toHaveText(
      'コピーしました',
    );
  });
});

test.describe('RSA Encrypt & Decrypt (English)', () => {
  test('英語版で暗号化・復号できる', async ({ page }) => {
    await page.goto('/en/tools/rsa-encryptor/');
    await expect(page.locator('main h1')).toHaveText(
      'RSA Encrypt & Decrypt (RSA-OAEP)',
    );
    const keys = await makeKeys(page);
    await page.locator('#rsa-encryptor-key').fill(keys.pub);
    await expect(page.locator('#rsa-encryptor-key-info')).toContainText(
      'RSA 2048-bit',
    );
    await page.locator('#rsa-encryptor-input').fill('hello');
    await page.locator('#rsa-encryptor-run-button').click();
    await expect(page.locator(output)).not.toHaveValue('');
    const encrypted = await page.locator(output).inputValue();

    await page.getByRole('button', { name: 'Decrypt', exact: true }).click();
    await page.locator('#rsa-encryptor-key').fill(keys.priv);
    await page.locator('#rsa-encryptor-input').fill(encrypted);
    await page.locator('#rsa-encryptor-run-button').click();
    await expect(page.locator(output)).toHaveValue('hello');
  });
});

test('RSA暗号化: 初期表示でaxeの違反がない（ja/en）', async ({ page }) => {
  for (const path of ['/tools/rsa-encryptor/', '/en/tools/rsa-encryptor/']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(
      results.violations.map((v) => v.id),
      path,
    ).toEqual([]);
  }
});
