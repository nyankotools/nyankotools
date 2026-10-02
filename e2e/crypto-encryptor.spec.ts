import { test, expect } from './helpers/test';

const output = '#crypto-encryptor-output';

test.describe('テキスト暗号化・復号（日本語版）', () => {
  test('暗号化した文字列を、復号モードで元のテキストに戻せる', async ({
    page,
  }) => {
    await page.goto('/tools/crypto-encryptor/');
    await expect(page.locator('main h1')).toHaveText(
      'テキスト暗号化・復号（AES-256-GCM）',
    );

    await page.locator('#crypto-encryptor-input').fill('こんにちは 🐱');
    await page.locator('#crypto-encryptor-password').fill('pass123');
    await page.locator('#crypto-encryptor-run-button').click();
    await expect(page.locator(output)).toHaveValue(/^[A-Za-z0-9+/]+=*$/);
    const encrypted = await page.locator(output).inputValue();

    await page.getByRole('button', { name: '復号', exact: true }).click();
    await expect(page.locator(output)).toHaveValue('');
    await page.locator('#crypto-encryptor-input').fill(encrypted);
    await page.locator('#crypto-encryptor-run-button').click();
    await expect(page.locator(output)).toHaveValue('こんにちは 🐱');
  });

  test('未入力・パスワード違い・形式不正ではエラーを表示する', async ({
    page,
  }) => {
    await page.goto('/tools/crypto-encryptor/');
    await page.locator('#crypto-encryptor-run-button').click();
    await expect(page.locator('#crypto-encryptor-error')).toHaveText(
      'テキストを入力してください。',
    );

    await page.locator('#crypto-encryptor-input').fill('secret');
    await page.locator('#crypto-encryptor-run-button').click();
    await expect(page.locator('#crypto-encryptor-error')).toHaveText(
      'パスワードを入力してください。',
    );

    await page.locator('#crypto-encryptor-password').fill('right');
    await page.locator('#crypto-encryptor-run-button').click();
    await expect(page.locator(output)).not.toHaveValue('');
    const encrypted = await page.locator(output).inputValue();

    await page.getByRole('button', { name: '復号', exact: true }).click();
    await page.locator('#crypto-encryptor-input').fill(encrypted);
    await page.locator('#crypto-encryptor-password').fill('wrong');
    await page.locator('#crypto-encryptor-run-button').click();
    await expect(page.locator('#crypto-encryptor-error')).toContainText(
      '復号できませんでした',
    );

    await page.locator('#crypto-encryptor-input').fill('not-encrypted');
    await page.locator('#crypto-encryptor-run-button').click();
    await expect(page.locator('#crypto-encryptor-error')).toContainText(
      '形式が正しくありません',
    );
  });

  test('パスワードの表示切り替えと結果のコピーができる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/crypto-encryptor/');
    const password = page.locator('#crypto-encryptor-password');
    await expect(password).toHaveAttribute('type', 'password');
    await page.locator('#crypto-encryptor-show-password').check();
    await expect(password).toHaveAttribute('type', 'text');

    await page.locator('#crypto-encryptor-input').fill('copy me');
    await password.fill('pw');
    await page.locator('#crypto-encryptor-run-button').click();
    await expect(page.locator(output)).not.toHaveValue('');
    await page.locator('#crypto-encryptor-copy-button').click();
    await expect(page.locator('#crypto-encryptor-status')).toHaveText(
      'コピーしました',
    );
  });
});

test.describe('Text Encryptor & Decryptor (English)', () => {
  test('英語版で暗号化・復号できる', async ({ page }) => {
    await page.goto('/en/tools/crypto-encryptor/');
    await expect(page.locator('main h1')).toHaveText(
      'Text Encryptor & Decryptor (AES-256-GCM)',
    );
    await page.locator('#crypto-encryptor-input').fill('hello');
    await page.locator('#crypto-encryptor-password').fill('pw');
    await page.locator('#crypto-encryptor-run-button').click();
    await expect(page.locator(output)).not.toHaveValue('');
    const encrypted = await page.locator(output).inputValue();

    await page.getByRole('button', { name: 'Decrypt', exact: true }).click();
    await page.locator('#crypto-encryptor-input').fill(encrypted);
    await page.locator('#crypto-encryptor-run-button').click();
    await expect(page.locator(output)).toHaveValue('hello');
  });
});
