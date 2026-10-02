import { test, expect } from './helpers/test';

const HELLO_MD5 = '5d41402abc4b2a76b9719d911017c592';
const HELLO_SHA256 =
  '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824';

const helloFile = {
  name: 'hello.txt',
  mimeType: 'text/plain',
  buffer: Buffer.from('hello'),
};

test.describe('ファイルハッシュ計算（日本語版）', () => {
  test('ファイルを選択すると各ハッシュ値が表示される', async ({ page }) => {
    await page.goto('/tools/file-hash-calculator/');
    await expect(page.locator('main h1')).toHaveText(
      'ファイルハッシュ計算（MD5・SHA-256）',
    );

    await page.locator('#fhc-file-input').setInputFiles(helloFile);

    await expect(page.getByLabel('hello.txt MD5')).toHaveValue(HELLO_MD5);
    await expect(page.getByLabel('hello.txt SHA-256')).toHaveValue(
      HELLO_SHA256,
    );
    await expect(page.getByLabel('hello.txt SHA-512')).toHaveValue(
      /^[0-9a-f]{128}$/,
    );
  });

  test('配布元のハッシュ値と照合できる', async ({ page }) => {
    await page.goto('/tools/file-hash-calculator/');
    await page.locator('#fhc-file-input').setInputFiles(helloFile);
    await expect(page.getByLabel('hello.txt MD5')).toHaveValue(HELLO_MD5);

    await page.locator('#fhc-compare').fill(HELLO_SHA256.toUpperCase());
    await expect(page.locator('#fhc-results [role="status"]')).toContainText(
      '一致しました（SHA-256）',
    );

    await page.locator('#fhc-compare').fill('0'.repeat(64));
    await expect(page.locator('#fhc-results [role="status"]')).toContainText(
      '一致しません',
    );
  });

  test('大文字表示に切り替えられる', async ({ page }) => {
    await page.goto('/tools/file-hash-calculator/');
    await page.locator('#fhc-file-input').setInputFiles(helloFile);
    await page.locator('#fhc-uppercase').check();
    await expect(page.getByLabel('hello.txt MD5')).toHaveValue(
      HELLO_MD5.toUpperCase(),
    );
  });
});

test.describe('File Hash Calculator (English)', () => {
  test('英語版でハッシュ値が計算される', async ({ page }) => {
    await page.goto('/en/tools/file-hash-calculator/');
    await expect(page.locator('main h1')).toHaveText(
      'File Hash Calculator (MD5, SHA-256)',
    );
    await page.locator('#fhc-file-input').setInputFiles(helloFile);
    await expect(page.getByLabel('hello.txt SHA-256')).toHaveValue(
      HELLO_SHA256,
    );
  });
});
