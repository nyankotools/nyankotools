import { test, expect } from './helpers/test';

test.describe('Snowflake IDデコード（日本語版）', () => {
  test('ObjectIDの生成時刻を表示する', async ({ page }) => {
    await page.goto('/tools/snowflake-id-decoder/');
    await page.locator('#snowflake-input').fill('507f1f77bcf86cd799439011');
    const results = page.locator('#snowflake-results');
    await expect(results).toContainText('2012-10-17T21:13:27.000Z');
    await expect(results).toContainText('MongoDB ObjectID');
  });

  test('エポックを切り替えると結果が変わる', async ({ page }) => {
    await page.goto('/tools/snowflake-id-decoder/');
    await page.locator('#snowflake-input').fill('4194304');
    const results = page.locator('#snowflake-results');
    await expect(results).toContainText('2010-11-04T01:42:54.658Z');
    await page.locator('#snowflake-epoch').selectOption('discord');
    await expect(results).toContainText('2015-01-01T00:00:00.001Z');
  });

  test('複数行と判別不能な行を扱える', async ({ page }) => {
    await page.goto('/tools/snowflake-id-decoder/');
    await page
      .locator('#snowflake-input')
      .fill('017f22e2-79b0-7cc3-98c4-dc0c0c07398f\nhello');
    const cards = page.locator('#snowflake-results > section');
    await expect(cards).toHaveCount(2);
    await expect(cards.nth(0)).toContainText('2022-02-22T19:22:22.000Z');
    await expect(cards.nth(1)).toContainText('形式を判別できません');
  });

  test('コピーボタンでTSVをコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/snowflake-id-decoder/');
    await page.locator('#snowflake-input').fill('507f1f77bcf86cd799439011');
    await page.locator('#snowflake-copy-button').click();
    await expect(page.locator('#snowflake-status')).toHaveText(
      'コピーしました',
    );
  });
});

test.describe('Snowflake ID Decoder (English)', () => {
  test('英語版で結果が表示される', async ({ page }) => {
    await page.goto('/en/tools/snowflake-id-decoder/');
    await page.locator('#snowflake-input').fill('01ARZ3NDEKTSV4RRFFQ69G5FAV');
    await expect(page.locator('#snowflake-results')).toContainText('ULID');
  });
});
