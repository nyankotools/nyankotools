import { test, expect } from './helpers/test';

test.describe('Cron式ジェネレーター', () => {
  test('初期状態は毎分の式で、Quartz形式も表示される', async ({ page }) => {
    await page.goto('/tools/cron-generator/');
    await expect(page.locator('#cg-result')).toHaveValue('* * * * *');
    await expect(page.locator('#cg-quartz')).toHaveValue('0 * * * * ?');
  });

  test('間隔・範囲・曜日を指定すると式が生成される', async ({ page }) => {
    await page.goto('/tools/cron-generator/');
    await page.locator('#cg-minute-mode').selectOption('step');
    await page.locator('#cg-minute-a').fill('15');
    await page.locator('#cg-hour-mode').selectOption('range');
    await page.locator('#cg-hour-a').fill('9');
    await page.locator('#cg-hour-b').fill('18');
    await page.locator('#cg-dayOfWeek-mode').selectOption('range');
    await page.locator('#cg-dayOfWeek-a').fill('1');
    await page.locator('#cg-dayOfWeek-b').fill('5');
    await expect(page.locator('#cg-result')).toHaveValue('*/15 9-18 * * 1-5');
    await expect(page.locator('#cg-quartz')).toHaveValue(
      '0 */15 9-18 ? * 2,3,4,5,6',
    );
  });

  test('列挙と不正値のエラー表示', async ({ page }) => {
    await page.goto('/tools/cron-generator/');
    await page.locator('#cg-minute-mode').selectOption('list');
    await page.locator('#cg-minute-list').fill('30,0');
    await expect(page.locator('#cg-result')).toHaveValue('0,30 * * * *');

    await page.locator('#cg-hour-mode').selectOption('single');
    await page.locator('#cg-hour-a').fill('99');
    await expect(page.locator('#cg-hour-error')).toHaveText(
      '指定できる範囲外の値です',
    );
    await expect(page.locator('#cg-result')).toHaveValue('');
  });

  test('日と曜日の両方を指定するとQuartz形式は変換できない', async ({
    page,
  }) => {
    await page.goto('/tools/cron-generator/');
    await page.locator('#cg-dayOfMonth-mode').selectOption('single');
    await page.locator('#cg-dayOfMonth-a').fill('1');
    await page.locator('#cg-dayOfWeek-mode').selectOption('single');
    await page.locator('#cg-dayOfWeek-a').fill('1');
    await expect(page.locator('#cg-result')).toHaveValue('* * 1 * 1');
    await expect(page.locator('#cg-quartz')).toHaveValue('');
    await expect(page.locator('#cg-quartz-note')).not.toBeEmpty();
  });

  test('コピーボタンで式をコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/cron-generator/');
    await page.locator('#cg-copy-button').click();
    await expect(page.locator('#cg-status')).toHaveText('コピーしました');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      '* * * * *',
    );
  });
});

test.describe('Cron Expression Generator (English)', () => {
  test('英語版で式が生成される', async ({ page }) => {
    await page.goto('/en/tools/cron-generator/');
    await expect(page.locator('main h1')).toHaveText(
      'Cron Expression Generator',
    );
    await page.locator('#cg-minute-mode').selectOption('single');
    await page.locator('#cg-minute-a').fill('0');
    await page.locator('#cg-hour-mode').selectOption('single');
    await page.locator('#cg-hour-a').fill('3');
    await expect(page.locator('#cg-result')).toHaveValue('0 3 * * *');
    await expect(page.locator('#cg-quartz')).toHaveValue('0 0 3 * * ?');
  });
});
