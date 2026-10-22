import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

const publicJwk = JSON.stringify({
  kty: 'EC',
  crv: 'P-256',
  x: 'f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU',
  y: 'x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0',
});

test.describe('JWK⇔PEM変換（日本語版）', () => {
  test('JWKからPEM、PEMからJWKへ変換できる', async ({ page }) => {
    await page.goto('/tools/jwk-pem-converter/');
    await page.locator('#jwkpem-input').fill(publicJwk);
    await expect(page.locator('#jwkpem-output')).toHaveValue(
      /^-----BEGIN PUBLIC KEY-----/,
    );
    await expect(page.locator('#jwkpem-info')).toContainText('JWK → PEM');

    const pem = await page.locator('#jwkpem-output').inputValue();
    await page.locator('#jwkpem-input').fill(pem);
    await expect(page.locator('#jwkpem-output')).toHaveValue(/"kty": "EC"/);
    await expect(page.locator('#jwkpem-info')).toContainText('PEM → JWK');
  });

  test('不正な入力でエラーを表示し、コピーとクリアができる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/jwk-pem-converter/');
    await page.locator('#jwkpem-input').fill('{"kty":');
    await expect(page.locator('#jwkpem-error')).toBeVisible();

    await page.locator('#jwkpem-input').fill(publicJwk);
    await expect(page.locator('#jwkpem-error')).toBeHidden();
    await page.locator('#jwkpem-copy-button').click();
    await expect(page.locator('#jwkpem-status')).toHaveText('コピーしました');

    await page.locator('#jwkpem-clear-button').click();
    await expect(page.locator('#jwkpem-input')).toHaveValue('');
    await expect(page.locator('#jwkpem-output')).toHaveValue('');
  });
});

test.describe('JWK to PEM Converter (English)', () => {
  test('英語版でJWKをPEMに変換できる', async ({ page }) => {
    await page.goto('/en/tools/jwk-pem-converter/');
    await page.locator('#jwkpem-input').fill(publicJwk);
    await expect(page.locator('#jwkpem-output')).toHaveValue(
      /^-----BEGIN PUBLIC KEY-----/,
    );
    await expect(page.locator('#jwkpem-info')).toContainText(
      'Converted JWK to PEM',
    );
  });
});

test('JWK⇔PEM: 初期表示でaxeの違反がない（ja/en）', async ({ page }) => {
  for (const path of [
    '/tools/jwk-pem-converter/',
    '/en/tools/jwk-pem-converter/',
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
