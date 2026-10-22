import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test('Wi-Fi QRコード: 初期表示でaxeの違反がない', async ({ page }) => {
  for (const path of [
    '/tools/wifi-qr-generator/',
    '/en/tools/wifi-qr-generator/',
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

test('Wi-Fi QRコード: 日本語SSIDでもダウンロードできる', async ({ page }) => {
  await page.goto('/tools/wifi-qr-generator/');
  await page.locator('#wifi-qr-ssid').fill('自宅;Wi-Fi');
  await page.locator('#wifi-qr-password').fill('パスワード12345');
  await expect(page.locator('#wifi-qr-download-button')).toBeEnabled();
});

test.describe('Wi-Fi QRコード生成（日本語版）', () => {
  test('SSIDとパスワードを入力するとダウンロードできる', async ({ page }) => {
    await page.goto('/tools/wifi-qr-generator/');
    const download = page.locator('#wifi-qr-download-button');
    await expect(download).toBeDisabled();

    await page.locator('#wifi-qr-ssid').fill('MyHomeWiFi');
    await expect(download).toBeDisabled();
    await expect(page.locator('#wifi-qr-message')).toContainText(
      'パスワードを入力',
    );

    await page.locator('#wifi-qr-password').fill('secret-pass-123');
    await expect(download).toBeEnabled();

    const downloadPromise = page.waitForEvent('download');
    await download.click();
    const file = await downloadPromise;
    expect(file.suggestedFilename()).toBe('wifi-qrcode.png');
  });

  test('パスワードなしを選ぶとパスワード欄が隠れる', async ({ page }) => {
    await page.goto('/tools/wifi-qr-generator/');
    await page.locator('#wifi-qr-ssid').fill('FreeWiFi');
    await page.locator('#wifi-qr-security').selectOption('nopass');
    await expect(page.locator('#wifi-qr-password')).toBeHidden();
    await expect(page.locator('#wifi-qr-download-button')).toBeEnabled();
  });

  test('パスワード表示の切り替えができる', async ({ page }) => {
    await page.goto('/tools/wifi-qr-generator/');
    const password = page.locator('#wifi-qr-password');
    await expect(password).toHaveAttribute('type', 'password');
    await page.locator('#wifi-qr-show-password').check();
    await expect(password).toHaveAttribute('type', 'text');
  });

  test('WPAのパスワードが短いと警告が出る', async ({ page }) => {
    await page.goto('/tools/wifi-qr-generator/');
    await page.locator('#wifi-qr-ssid').fill('net');
    await page.locator('#wifi-qr-password').fill('short');
    await expect(page.locator('#wifi-qr-message')).toContainText('8文字以上');
    await expect(page.locator('#wifi-qr-download-button')).toBeEnabled();
  });
});

test.describe('Wi-Fi QR Code Generator (English)', () => {
  test('英語版で生成できる', async ({ page }) => {
    await page.goto('/en/tools/wifi-qr-generator/');
    await page.locator('#wifi-qr-ssid').fill('MyHomeWiFi');
    await page.locator('#wifi-qr-password').fill('secret-pass-123');
    await expect(page.locator('#wifi-qr-download-button')).toBeEnabled();
  });
});
