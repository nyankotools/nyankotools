import { test, expect } from './helpers/test';

test.describe('ビット演算計算機（日本語版）', () => {
  test('既定値のANDが計算される', async ({ page }) => {
    await page.goto('/tools/bitwise-calculator/');
    await page.locator('#bitop-op').selectOption('and');

    await expect(page.locator('#bitop-hex')).toHaveText('0x0000F000');
    await expect(page.locator('#bitop-unsigned')).toHaveText('61440');
    await expect(page.locator('#bitop-popcount')).toHaveText('4');
    await expect(page.locator('#bitop-error')).toBeEmpty();
  });

  test('NOTと負数が2の補数で表示される', async ({ page }) => {
    await page.goto('/tools/bitwise-calculator/');
    await page.locator('#bitop-width').selectOption('8');
    await page.locator('#bitop-op').selectOption('not');
    await page.locator('#bitop-a').fill('0');

    await expect(page.locator('#bitop-unsigned')).toHaveText('255');
    await expect(page.locator('#bitop-signed')).toHaveText('-1');
    await expect(page.locator('#bitop-b')).toBeDisabled();
  });

  test('64bitでも桁あふれしない', async ({ page }) => {
    await page.goto('/tools/bitwise-calculator/');
    await page.locator('#bitop-width').selectOption('64');
    await page.locator('#bitop-op').selectOption('shl');
    await page.locator('#bitop-a').fill('1');
    await page.locator('#bitop-b').fill('63');

    await expect(page.locator('#bitop-unsigned')).toHaveText(
      '9223372036854775808',
    );
  });

  test('範囲外の値でエラーが表示される', async ({ page }) => {
    await page.goto('/tools/bitwise-calculator/');
    await page.locator('#bitop-width').selectOption('8');
    await page.locator('#bitop-a').fill('256');

    await expect(page.locator('#bitop-error')).toContainText('収まらない');
    await expect(page.locator('#bitop-result')).toBeHidden();
  });

  test('コピーボタンで結果をコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/bitwise-calculator/');
    await page.locator('#bitop-copy-button').click();

    await expect(page.locator('#bitop-status')).toHaveText('コピーしました');
    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text).toContain('0x');
  });
});

test.describe('Bitwise Calculator (English)', () => {
  test('computes XOR and shows an English error', async ({ page }) => {
    await page.goto('/en/tools/bitwise-calculator/');
    await page.locator('#bitop-op').selectOption('xor');
    await expect(page.locator('#bitop-hex')).toHaveText('0x00000FF0');

    await page.locator('#bitop-a').fill('hello');
    await expect(page.locator('#bitop-error')).toContainText('Could not read');
  });
});
