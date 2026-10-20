import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test.describe('パスフレーズ生成（日本語版）', () => {
  test('生成すると指定語数・区切り文字で出力され、強度が表示される', async ({
    page,
  }) => {
    await page.goto('/tools/passphrase-generator/');
    await page.locator('#passphrase-generator-words').fill('5');
    await page.locator('#passphrase-generator-separator').fill('.');
    await page.locator('#passphrase-generator-generate-button').click();

    const output = page.locator('#passphrase-generator-output');
    await expect(output).not.toHaveValue('');
    const value = await output.inputValue();
    const parts = value.split('.');
    expect(parts).toHaveLength(5);
    for (const part of parts) expect(part).toMatch(/^[a-z-]+$/);
    await expect(page.locator('#passphrase-generator-strength')).toContainText(
      '65',
    );
  });

  test('大文字化と数字付加が反映され、複数個を生成できる', async ({ page }) => {
    await page.goto('/tools/passphrase-generator/');
    await page.locator('#passphrase-generator-capitalize').check();
    await page.locator('#passphrase-generator-append-number').check();
    await page.locator('#passphrase-generator-count').fill('3');
    await page.locator('#passphrase-generator-generate-button').click();

    const output = page.locator('#passphrase-generator-output');
    await expect(output).not.toHaveValue('');
    const lines = (await output.inputValue()).split('\n');
    expect(lines).toHaveLength(3);
    for (const line of lines) {
      expect(line).toMatch(/^[A-Z]/);
      expect(line.match(/[0-9]/g)).toHaveLength(1);
    }
  });

  test('コピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/passphrase-generator/');
    await page.locator('#passphrase-generator-generate-button').click();
    await expect(page.locator('#passphrase-generator-output')).not.toHaveValue(
      '',
    );
    await page.locator('#passphrase-generator-copy-button').click();
    await expect(page.locator('#passphrase-generator-status')).toHaveText(
      'コピーしました',
    );
    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text.length).toBeGreaterThan(0);
  });

  test('出典とライセンスが表示される', async ({ page }) => {
    await page.goto('/tools/passphrase-generator/');
    await expect(page.locator('main')).toContainText('CC BY 3.0 US');
  });
});

test.describe('Passphrase Generator (English)', () => {
  test('英語版で生成できる', async ({ page }) => {
    await page.goto('/en/tools/passphrase-generator/');
    await page.locator('#passphrase-generator-separator').fill('.');
    await page.locator('#passphrase-generator-generate-button').click();
    const output = page.locator('#passphrase-generator-output');
    await expect(output).not.toHaveValue('');
    expect((await output.inputValue()).split('.')).toHaveLength(6);
    await expect(page.locator('#passphrase-generator-strength')).toContainText(
      'Strength',
    );
  });
});

test.describe('パスフレーズ生成（アクセシビリティ）', () => {
  test('初期表示でaxeのWCAG 2.1 A/AA違反がない', async ({ page }) => {
    await page.goto('/tools/passphrase-generator/');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
});
