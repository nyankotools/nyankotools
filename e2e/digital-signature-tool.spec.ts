import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { test, expect } from './helpers/test';

async function generatePems(page: Page) {
  return page.evaluate(async () => {
    const toPem = (der: ArrayBuffer, label: string) => {
      let bin = '';
      for (const b of new Uint8Array(der)) bin += String.fromCharCode(b);
      return `-----BEGIN ${label}-----\n${btoa(bin)}\n-----END ${label}-----\n`;
    };
    const pair = await crypto.subtle.generateKey(
      { name: 'ECDSA', namedCurve: 'P-256' },
      true,
      ['sign', 'verify'],
    );
    return {
      publicPem: toPem(
        await crypto.subtle.exportKey('spki', pair.publicKey),
        'PUBLIC KEY',
      ),
      privatePem: toPem(
        await crypto.subtle.exportKey('pkcs8', pair.privateKey),
        'PRIVATE KEY',
      ),
    };
  });
}

test.describe('デジタル署名の作成・検証（日本語版）', () => {
  test('ECDSAで署名し、検証でき、改ざんすると失敗する', async ({ page }) => {
    await page.goto('/tools/digital-signature-tool/');
    const { publicPem, privatePem } = await generatePems(page);

    await page.locator('#dsig-algorithm').selectOption('ecdsa-p256');
    await page.locator('#dsig-message').fill('hello 署名');
    await page.locator('#dsig-private-key').fill(privatePem);
    await page.locator('#dsig-sign-button').click();
    await expect(page.locator('#dsig-signature-output')).not.toHaveValue('');
    const signature = await page.locator('#dsig-signature-output').inputValue();

    await page.locator('#dsig-mode [data-mode="verify"]').click();
    await page.locator('#dsig-public-key').fill(publicPem);
    await page.locator('#dsig-signature-input').fill(signature);
    await page.locator('#dsig-verify-button').click();
    await expect(page.locator('#dsig-verify-result')).toContainText(
      '署名は有効です',
    );

    await page.locator('#dsig-message').fill('hello 署名!');
    await page.locator('#dsig-verify-button').click();
    await expect(page.locator('#dsig-verify-result')).toContainText(
      '署名が一致しません',
    );
  });

  test('不正なPEMとアルゴリズム不一致でエラーが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/digital-signature-tool/');
    const { privatePem } = await generatePems(page);

    await page.locator('#dsig-private-key').fill('not a pem');
    await page.locator('#dsig-sign-button').click();
    await expect(page.locator('#dsig-error')).toContainText(
      'PEMとして読み取れません',
    );

    // ECDSA鍵をRSA-PSSとして読み込む
    await page.locator('#dsig-private-key').fill(privatePem);
    await page.locator('#dsig-sign-button').click();
    await expect(page.locator('#dsig-error')).toContainText('読み込めません');
  });
});

test.describe('Digital Signature Tool (English)', () => {
  test('英語版で署名できる', async ({ page }) => {
    await page.goto('/en/tools/digital-signature-tool/');
    const { privatePem } = await generatePems(page);
    await page.locator('#dsig-algorithm').selectOption('ecdsa-p256');
    await page.locator('#dsig-message').fill('hello');
    await page.locator('#dsig-private-key').fill(privatePem);
    await page.locator('#dsig-sign-button').click();
    await expect(page.locator('#dsig-signature-output')).not.toHaveValue('');
  });
});

test('デジタル署名: 初期表示でaxeの違反がない（ja/en）', async ({ page }) => {
  for (const path of [
    '/tools/digital-signature-tool/',
    '/en/tools/digital-signature-tool/',
  ]) {
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
