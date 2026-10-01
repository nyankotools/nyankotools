import { test, expect } from './helpers/test';

const lines = async (page: import('@playwright/test').Page) =>
  (await page.locator('#ulid-nanoid-output').inputValue())
    .split('\n')
    .filter((line) => line.length > 0);

test.describe('ULID・NanoID生成ツール（日本語版）', () => {
  test('初期状態で5件のULIDが生成される', async ({ page }) => {
    await page.goto('/tools/ulid-nanoid-generator/');
    await expect(page.locator('main h1')).toHaveText('ULID・NanoID生成');

    const ids = await lines(page);
    expect(ids).toHaveLength(5);
    for (const id of ids) expect(id).toMatch(/^[0-9A-HJKMNP-TV-Z]{26}$/);
  });

  test('NanoIDに切り替えて長さと文字セットを指定できる', async ({ page }) => {
    await page.goto('/tools/ulid-nanoid-generator/');

    await page.locator('#ulid-nanoid-kind').selectOption('nanoid');
    await page.locator('#ulid-nanoid-size').fill('10');
    await page.locator('#ulid-nanoid-size').dispatchEvent('change');
    await page.locator('#ulid-nanoid-alphabet').fill('xyz');
    await page.locator('#ulid-nanoid-alphabet').dispatchEvent('change');

    const ids = await lines(page);
    expect(ids).toHaveLength(5);
    for (const id of ids) expect(id).toMatch(/^[xyz]{10}$/);
  });

  test('文字セットが1種類だけだとエラーになる', async ({ page }) => {
    await page.goto('/tools/ulid-nanoid-generator/');

    await page.locator('#ulid-nanoid-kind').selectOption('nanoid');
    await page.locator('#ulid-nanoid-alphabet').fill('aaa');
    await page.locator('#ulid-nanoid-alphabet').dispatchEvent('change');

    await expect(page.locator('#ulid-nanoid-error')).not.toBeEmpty();
    await expect(page.locator('#ulid-nanoid-output')).toHaveValue('');
  });

  test('コピーボタンで結果をコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/ulid-nanoid-generator/');

    await page.locator('#ulid-nanoid-copy-button').click();
    await expect(page.locator('#ulid-nanoid-status')).toHaveText(
      'コピーしました',
    );
  });
});

test.describe('ULID & NanoID Generator (English)', () => {
  test('英語版が表示されULIDが生成される', async ({ page }) => {
    await page.goto('/en/tools/ulid-nanoid-generator/');
    await expect(page.locator('main h1')).toHaveText('ULID & NanoID Generator');
    expect(await lines(page)).toHaveLength(5);
  });
});
