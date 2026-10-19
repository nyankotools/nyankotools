import { test, expect } from './helpers/test';

test.describe('.htpasswd生成（日本語版）', () => {
  test('SHA-1で複数ユーザーの行とヘッダーを生成する', async ({ page }) => {
    await page.goto('/tools/htpasswd-generator/');
    await page
      .locator('#htpasswd-generator-users')
      .fill('alice:password\nbob:x');
    await page.locator('#htpasswd-generator-algorithm').selectOption('sha1');
    await expect(page.locator('#htpasswd-generator-cost-area')).toBeHidden();
    await page.locator('#htpasswd-generator-generate-button').click();
    await expect(page.locator('#htpasswd-generator-output')).toHaveValue(
      /^alice:\{SHA\}W6ph5Mm5Pz8GgiULbPgzG37mj9g=\nbob:\{SHA\}/,
    );
    await expect(page.locator('#htpasswd-generator-headers')).toHaveValue(
      /^Authorization: Basic YWxpY2U6cGFzc3dvcmQ=\n/,
    );
  });

  test('bcryptを生成し、コピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/htpasswd-generator/');
    await page.locator('#htpasswd-generator-users').fill('alice:secret');
    await page.locator('#htpasswd-generator-cost').selectOption('4');
    await page.locator('#htpasswd-generator-generate-button').click();
    await expect(page.locator('#htpasswd-generator-output')).toHaveValue(
      /^alice:\$2y\$04\$.{53}$/,
    );
    await page.locator('#htpasswd-generator-copy-button').click();
    await expect(page.locator('#htpasswd-generator-status')).toHaveText(
      'コピーしました',
    );
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toMatch(/^alice:\$2y\$04\$/);
  });

  test('不正な行は行番号つきでエラーを表示する', async ({ page }) => {
    await page.goto('/tools/htpasswd-generator/');
    await page.locator('#htpasswd-generator-users').fill('nocolon');
    await page.locator('#htpasswd-generator-generate-button').click();
    await expect(page.locator('#htpasswd-generator-issues')).toContainText(
      '1行目',
    );
    await expect(page.locator('#htpasswd-generator-result-area')).toBeHidden();
  });
});

test.describe('Htpasswd Generator (English)', () => {
  test('英語版が表示され、生成できる', async ({ page }) => {
    await page.goto('/en/tools/htpasswd-generator/');
    await expect(page.locator('main h1')).toContainText('Htpasswd Generator');
    await page.locator('#htpasswd-generator-users').fill('alice:password');
    await page.locator('#htpasswd-generator-algorithm').selectOption('sha1');
    await page.locator('#htpasswd-generator-generate-button').click();
    await expect(page.locator('#htpasswd-generator-output')).toHaveValue(
      'alice:{SHA}W6ph5Mm5Pz8GgiULbPgzG37mj9g=',
    );
  });
});
