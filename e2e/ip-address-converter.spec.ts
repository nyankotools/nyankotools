import { test, expect } from './helpers/test';

test.describe('IPアドレス変換（日本語版）', () => {
  test('既定のIPv4が各表記に変換される', async ({ page }) => {
    await page.goto('/tools/ip-address-converter/');

    await expect(page.locator('#ipconv-decimal')).toHaveText('3232235777');
    await expect(page.locator('#ipconv-hex')).toHaveText('0xC0A80101');
    await expect(page.locator('#ipconv-binary')).toHaveText(
      '11000000.10101000.00000001.00000001',
    );
    await expect(page.locator('#ipconv-type')).toHaveText(
      'プライベートアドレス',
    );
    await expect(page.locator('#ipconv-error')).toBeEmpty();
  });

  test('10進整数からドット表記に戻せる', async ({ page }) => {
    await page.goto('/tools/ip-address-converter/');
    await page.locator('#ipconv-input').fill('2130706433');

    await expect(page.locator('#ipconv-ipv4')).toHaveText('127.0.0.1');
    await expect(page.locator('#ipconv-format')).toHaveText('IPv4（10進整数）');
  });

  test('IPv6の短縮・完全展開が表示される', async ({ page }) => {
    await page.goto('/tools/ip-address-converter/');
    await page
      .locator('#ipconv-input')
      .fill('2001:0db8:0000:0000:0000:0000:0000:0001');

    await expect(page.locator('#ipconv-ipv6-compressed')).toHaveText(
      '2001:db8::1',
    );
    await expect(page.locator('#ipconv-ipv6-full')).toHaveText(
      '2001:0db8:0000:0000:0000:0000:0000:0001',
    );
  });

  test('不正な入力でエラーが表示される', async ({ page }) => {
    await page.goto('/tools/ip-address-converter/');
    await page.locator('#ipconv-input').fill('999.1.1.1');

    await expect(page.locator('#ipconv-error')).toContainText(
      '形式が正しくありません',
    );
    await expect(page.locator('#ipconv-result')).toBeHidden();
  });

  test('コピーボタンで結果をコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/ip-address-converter/');
    await page.locator('#ipconv-copy-button').click();

    await expect(page.locator('#ipconv-status')).toHaveText('コピーしました');
    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text).toContain('3232235777');
  });
});

test.describe('IP Address Converter (English)', () => {
  test('converts the default IPv4 and an IPv6 address', async ({ page }) => {
    await page.goto('/en/tools/ip-address-converter/');

    await expect(page.locator('#ipconv-hex')).toHaveText('0xC0A80101');
    await expect(page.locator('#ipconv-type')).toHaveText('Private');

    await page.locator('#ipconv-input').fill('::ffff:192.168.1.1');
    await expect(page.locator('#ipconv-ipv6-compressed')).toHaveText(
      '::ffff:c0a8:101',
    );
    await expect(page.locator('#ipconv-ipv6-embedded-ipv4')).toHaveText(
      '192.168.1.1',
    );
  });

  test('shows an English error for invalid input', async ({ page }) => {
    await page.goto('/en/tools/ip-address-converter/');
    await page.locator('#ipconv-input').fill('hello');

    await expect(page.locator('#ipconv-error')).toContainText('Invalid format');
  });
});
