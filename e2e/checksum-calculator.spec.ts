import { test, expect } from './helpers/test';

test.describe('チェックサム計算（日本語版）', () => {
  test('テキストを入力するとチェックサムが表示される', async ({ page }) => {
    await page.goto('/tools/checksum-calculator/');
    await page.locator('#cks-input').fill('123456789');
    await expect(
      page.getByLabel('入力したテキスト CRC-32', { exact: true }),
    ).toHaveValue('cbf43926');
    await expect(page.getByLabel('入力したテキスト Adler-32')).toHaveValue(
      '091e01de',
    );
  });

  test('ファイルを選択して計算し、値を照合できる', async ({ page }) => {
    await page.goto('/tools/checksum-calculator/');
    await page.locator('#cks-file-input').setInputFiles({
      name: 'nums.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('123456789'),
    });
    await expect(
      page.getByLabel('nums.txt CRC-32', { exact: true }),
    ).toHaveValue('cbf43926');

    await page.locator('#cks-compare').fill('CBF43926');
    await expect(page.locator('#cks-results [role="status"]')).toContainText(
      '一致しました（CRC-32）',
    );
    await page.locator('#cks-compare').fill('00000000');
    await expect(page.locator('#cks-results [role="status"]')).toContainText(
      '一致しません',
    );
  });

  test('大文字表示に切り替えられる', async ({ page }) => {
    await page.goto('/tools/checksum-calculator/');
    await page.locator('#cks-input').fill('123456789');
    await page.locator('#cks-uppercase').check();
    await expect(
      page.getByLabel('入力したテキスト CRC-32', { exact: true }),
    ).toHaveValue('CBF43926');
  });
});

test.describe('Checksum Calculator (English)', () => {
  test('英語版でチェックサムが計算される', async ({ page }) => {
    await page.goto('/en/tools/checksum-calculator/');
    await page.locator('#cks-input').fill('123456789');
    await expect(
      page.getByLabel('Entered text CRC-32', { exact: true }),
    ).toHaveValue('cbf43926');
  });
});
