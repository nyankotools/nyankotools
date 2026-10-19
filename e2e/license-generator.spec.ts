import { test, expect } from './helpers/test';

test.describe('OSSライセンス文生成（日本語版）', () => {
  test('MITに著作者名と年が入り、SPDXが表示される', async ({ page }) => {
    await page.goto('/tools/license-generator/');
    await page.locator('#license-generator-holder').fill('Taro Yamada');
    await page.locator('#license-generator-year').fill('2024');
    await expect(page.locator('#license-generator-output')).toHaveValue(
      /^MIT License\n\nCopyright \(c\) 2024 Taro Yamada\n/,
    );
    await expect(page.locator('#license-generator-spdx')).toHaveText('MIT');
    await expect(page.locator('#license-generator-package')).toHaveValue(
      '"license": "MIT"',
    );
  });

  test('GPL-3.0は注記のみを出力し、案内を表示する', async ({ page }) => {
    await page.goto('/tools/license-generator/');
    await page.locator('#license-generator-license').selectOption('GPL-3.0');
    await expect(page.locator('#license-generator-notice-note')).toBeVisible();
    await expect(page.locator('#license-generator-spdx')).toHaveText(
      'GPL-3.0-or-later',
    );
    await expect(page.locator('#license-generator-output')).toHaveValue(
      /GNU General Public License/,
    );
  });

  test('全文ライセンスはLICENSEとしてダウンロードできる', async ({ page }) => {
    await page.goto('/tools/license-generator/');
    await page.locator('#license-generator-license').selectOption('MIT');
    await page.locator('#license-generator-holder').fill('Taro Yamada');
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#license-generator-download-button').click(),
    ]);
    // Chromium は拡張子なしの text/plain に .txt を補うことがあるため両方許容する
    expect(download.suggestedFilename()).toMatch(/^LICENSE(\.txt)?$/);
  });

  test('注記のみのライセンスはLICENSE-NOTICE.txtになる', async ({ page }) => {
    await page.goto('/tools/license-generator/');
    await page.locator('#license-generator-license').selectOption('GPL-3.0');
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#license-generator-download-button').click(),
    ]);
    expect(download.suggestedFilename()).toBe('LICENSE-NOTICE.txt');
  });

  test('コピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/license-generator/');
    await page.locator('#license-generator-license').selectOption('ISC');
    await page.locator('#license-generator-copy-button').click();
    await expect(page.locator('#license-generator-status')).toHaveText(
      'コピーしました',
    );
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toMatch(/^ISC License/);
  });
});

test.describe('License Generator (English)', () => {
  test('英語版が表示され、Apache-2.0を生成できる', async ({ page }) => {
    await page.goto('/en/tools/license-generator/');
    await expect(page.locator('main h1')).toContainText('License Generator');
    await page.locator('#license-generator-license').selectOption('Apache-2.0');
    await page.locator('#license-generator-holder').fill('Jane Doe');
    await expect(page.locator('#license-generator-output')).toHaveValue(
      /Copyright \d{4} Jane Doe/,
    );
  });
});
