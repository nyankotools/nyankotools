import { test, expect } from './helpers/test';

test.describe('URLスラッグ生成（日本語版）', () => {
  test('かなをローマ字にしてハイフン区切りのスラッグを生成する', async ({
    page,
  }) => {
    await page.goto('/tools/slug-generator/');
    await page.locator('#slug-input').fill('Hello, World! ラーメン');
    await expect(page.locator('#slug-output')).toHaveValue('hello-world-ramen');
  });

  test('区切り文字と最大文字数のオプションが反映される', async ({ page }) => {
    await page.goto('/tools/slug-generator/');
    await page.locator('#slug-input').fill('aaa bbb ccc');
    await page.locator('#slug-separator').selectOption('_');
    await page.locator('#slug-max-length').fill('7');
    await expect(page.locator('#slug-output')).toHaveValue('aaa_bbb');
  });

  test('漢字を残すオプション', async ({ page }) => {
    await page.goto('/tools/slug-generator/');
    await page.locator('#slug-input').fill('東京 tower');
    await expect(page.locator('#slug-output')).toHaveValue('tower');
    await page.locator('#slug-kanji').selectOption('keep');
    await expect(page.locator('#slug-output')).toHaveValue('東京-tower');
  });

  test('コピーボタンで結果をコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/slug-generator/');
    await page.locator('#slug-input').fill('Hello World');
    await page.locator('#slug-copy-button').click();
    await expect(page.locator('#slug-status')).toHaveText('コピーしました');
    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text).toBe('hello-world');
  });
});

test.describe('URL Slug Generator (English)', () => {
  test('英語版でスラッグを生成してコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/en/tools/slug-generator/');
    await page.locator('#slug-input').fill("Don't Stop Me Now!");
    await expect(page.locator('#slug-output')).toHaveValue('dont-stop-me-now');
    await page.locator('#slug-copy-button').click();
    await expect(page.locator('#slug-status')).toHaveText('Copied');
  });
});
