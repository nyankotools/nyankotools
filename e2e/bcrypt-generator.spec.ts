import { test, expect } from './helpers/test';

// PHPマニュアルに載っている既知のペア（パスワード "rasmuslerdorf"）
const KNOWN_HASH =
  '$2y$07$BCryptRequires22Chrcte/VlQH0piJtjXl.0t1XkA8pw9dMXTpOq';

test.describe('bcryptハッシュ生成・照合（日本語版）', () => {
  test('ハッシュを生成して、そのまま照合に使える', async ({ page }) => {
    await page.goto('/tools/bcrypt-generator/');
    await expect(page.locator('main h1')).toHaveText(
      'bcryptハッシュ生成・照合',
    );

    await page.locator('#bcrypt-generator-password').fill('hello');
    await page.locator('#bcrypt-generator-cost').selectOption('4');
    await page.locator('#bcrypt-generator-generate-button').click();
    const result = page.locator('#bcrypt-generator-result');
    await expect(result).toHaveValue(/^\$2b\$04\$.{53}$/);

    const hash = await result.inputValue();
    await page.locator('#bcrypt-generator-verify-password').fill('hello');
    await page.locator('#bcrypt-generator-hash').fill(hash);
    await page.locator('#bcrypt-generator-verify-button').click();
    await expect(page.locator('#bcrypt-generator-match')).toHaveText(
      '一致しました',
    );
    await expect(
      page.locator('#bcrypt-generator-info dd').nth(1),
    ).toContainText('4');
  });

  test('既知のハッシュとの一致・不一致を判定する', async ({ page }) => {
    await page.goto('/tools/bcrypt-generator/');
    await page.locator('#bcrypt-generator-hash').fill(KNOWN_HASH);
    await page
      .locator('#bcrypt-generator-verify-password')
      .fill('rasmuslerdorf');
    await page.locator('#bcrypt-generator-verify-button').click();
    await expect(page.locator('#bcrypt-generator-match')).toHaveText(
      '一致しました',
    );
    await expect(
      page.locator('#bcrypt-generator-info dd').nth(0),
    ).toContainText('$2y$');

    await page.locator('#bcrypt-generator-verify-password').fill('wrong');
    await expect(page.locator('#bcrypt-generator-match')).toBeHidden();
    await page.locator('#bcrypt-generator-verify-button').click();
    await expect(page.locator('#bcrypt-generator-match')).toHaveText(
      '一致しません',
    );
  });

  test('形式が不正なハッシュと72バイト超のパスワードはエラーを表示する', async ({
    page,
  }) => {
    await page.goto('/tools/bcrypt-generator/');
    await page.locator('#bcrypt-generator-hash').fill('not-a-hash');
    await page.locator('#bcrypt-generator-verify-button').click();
    await expect(page.locator('#bcrypt-generator-hash-error')).toBeVisible();

    await page.locator('#bcrypt-generator-password').fill('a'.repeat(73));
    await page.locator('#bcrypt-generator-cost').selectOption('4');
    await page.locator('#bcrypt-generator-generate-button').click();
    await expect(page.locator('#bcrypt-generator-error')).toBeVisible();
    await expect(page.locator('#bcrypt-generator-result-area')).toBeHidden();
  });

  test('コピーボタンでハッシュをコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/bcrypt-generator/');
    await page.locator('#bcrypt-generator-password').fill('hello');
    await page.locator('#bcrypt-generator-cost').selectOption('4');
    await page.locator('#bcrypt-generator-generate-button').click();
    await expect(page.locator('#bcrypt-generator-result')).toHaveValue(
      /^\$2b\$/,
    );
    await page.locator('#bcrypt-generator-copy-button').click();
    await expect(page.locator('#bcrypt-generator-status')).toHaveText(
      'コピーしました',
    );
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toMatch(/^\$2b\$04\$/);
  });
});

test.describe('Bcrypt Hash Generator (English)', () => {
  test('英語版が表示され、照合できる', async ({ page }) => {
    await page.goto('/en/tools/bcrypt-generator/');
    await expect(page.locator('main h1')).toHaveText(
      'Bcrypt Hash Generator & Verifier',
    );
    await page.locator('#bcrypt-generator-hash').fill(KNOWN_HASH);
    await page
      .locator('#bcrypt-generator-verify-password')
      .fill('rasmuslerdorf');
    await page.locator('#bcrypt-generator-verify-button').click();
    await expect(page.locator('#bcrypt-generator-match')).toHaveText('Match');
    await expect(
      page.getByRole('heading', { level: 2, name: 'Glossary' }),
    ).toBeVisible();
  });
});
