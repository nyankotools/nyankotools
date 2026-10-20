import { test, expect } from './helpers/test';
import { readFile } from 'node:fs/promises';

test.describe('vCard作成（日本語版）', () => {
  test('入力するとvCardとQRコードが表示される', async ({ page }) => {
    await page.goto('/tools/vcard-generator/');
    await expect(page.locator('#vcard-generator-result')).toBeHidden();

    await page.locator('#vcard-generator-family').fill('山田');
    await page.locator('#vcard-generator-given').fill('太郎');
    await page.locator('#vcard-generator-phone-0').fill('090-1234-5678');
    await page.locator('#vcard-generator-email-0').fill('taro@example.com');

    await expect(page.locator('#vcard-generator-result')).toBeVisible();
    const text = page.locator('#vcard-generator-text');
    await expect(text).toHaveValue(
      /BEGIN:VCARD\nVERSION:3\.0\nN:山田;太郎;;;\nFN:山田 太郎/,
    );
    await expect(text).toHaveValue(/TEL;TYPE=CELL:090-1234-5678/);
    await expect(text).toHaveValue(/EMAIL;TYPE=INTERNET:taro@example\.com/);
    await expect(page.locator('#vcard-generator-canvas')).toBeVisible();
  });

  test('.vcfをCRLFで保存できる', async ({ page }) => {
    await page.goto('/tools/vcard-generator/');
    await page.locator('#vcard-generator-family').fill('山田');
    await page.locator('#vcard-generator-given').fill('太郎');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#vcard-generator-download-button').click(),
    ]);
    expect(download.suggestedFilename()).toBe('山田_太郎.vcf');
    const body = await readFile((await download.path())!, 'utf8');
    expect(body.startsWith('BEGIN:VCARD\r\nVERSION:3.0\r\n')).toBe(true);
    expect(body.endsWith('END:VCARD\r\n')).toBe(true);
  });

  test('容量を超えるとQRは出さず警告し、.vcfは保存できる', async ({ page }) => {
    await page.goto('/tools/vcard-generator/');
    await page.locator('#vcard-generator-given').fill('太郎');
    await page.locator('#vcard-generator-note').fill('あ'.repeat(2000));

    await expect(page.locator('#vcard-generator-canvas')).toBeHidden();
    await expect(page.locator('#vcard-generator-warnings')).toContainText(
      'QRコードにできません',
    );
    await expect(page.locator('#vcard-generator-qr-button')).toBeDisabled();
    await expect(
      page.locator('#vcard-generator-download-button'),
    ).toBeEnabled();
  });

  test('不正なメールアドレスで警告が出る', async ({ page }) => {
    await page.goto('/tools/vcard-generator/');
    await page.locator('#vcard-generator-given').fill('太郎');
    await page.locator('#vcard-generator-email-0').fill('abc');
    await expect(page.locator('#vcard-generator-warnings')).toContainText(
      'メールアドレスの形式',
    );
  });
});

test.describe('vCard Generator (English)', () => {
  test('英語版は名姓の順でFNを作る', async ({ page }) => {
    await page.goto('/en/tools/vcard-generator/');
    await page.locator('#vcard-generator-family').fill('Smith');
    await page.locator('#vcard-generator-given').fill('Alex');
    await expect(page.locator('#vcard-generator-text')).toHaveValue(
      /FN:Alex Smith/,
    );
  });
});
