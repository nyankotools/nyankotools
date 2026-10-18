import { test, expect } from './helpers/test';
import AxeBuilder from '@axe-core/playwright';

const DECOMPOSED = 'が';
const COMPOSED = 'が';

test.describe('Unicode正規化ツール', () => {
  test('NFCで分離した濁点が合成され、変更箇所が表示される', async ({
    page,
  }) => {
    await page.goto('/tools/unicode-normalizer/');
    await page.locator('#un-input').fill(`x${DECOMPOSED}y`);
    await expect(page.locator('#un-output')).toHaveText(`x${COMPOSED}y`);
    await expect(page.locator('#un-warning')).not.toBeEmpty();
    await expect(page.locator('#un-change-list li')).toHaveCount(1);
  });

  test('NFDに切り替えると濁点が分離する', async ({ page }) => {
    await page.goto('/tools/unicode-normalizer/');
    await page.locator('#un-input').fill(COMPOSED);
    await page.locator('#un-form-nfd').check();
    await expect(page.locator('#un-output')).toHaveText(DECOMPOSED);
  });

  test('NFKCで半角カナが全角になる', async ({ page }) => {
    await page.goto('/tools/unicode-normalizer/');
    await page.locator('#un-input').fill('ﾊﾞｲﾄ');
    await page.locator('#un-form-nfkc').check();
    await expect(page.locator('#un-output')).toHaveText('バイト');
  });

  test('変化がない場合はメッセージが出る', async ({ page }) => {
    await page.goto('/tools/unicode-normalizer/');
    await page.locator('#un-input').fill('abc');
    await expect(page.locator('#un-unchanged')).toBeVisible();
    await expect(page.locator('#un-changes')).toBeHidden();
  });

  test('結果をコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/unicode-normalizer/');
    await page.locator('#un-input').fill(DECOMPOSED);
    await page.locator('#un-copy-button').click();
    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text).toBe(COMPOSED);
  });
});

test.describe('Unicode正規化ツール（a11y）', () => {
  test('変換結果と変更一覧にaxeのアクセシビリティ違反がない', async ({
    page,
  }) => {
    await page.goto('/tools/unicode-normalizer/');
    await page.locator('#un-input').fill(`x${DECOMPOSED}y`);
    await expect(page.locator('#un-change-list li')).toHaveCount(1);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
});

test.describe('Unicode Normalizer (English)', () => {
  test('英語版でも変換できる', async ({ page }) => {
    await page.goto('/en/tools/unicode-normalizer/');
    await page.locator('#un-input').fill(DECOMPOSED);
    await expect(page.locator('#un-output')).toHaveText(COMPOSED);
  });
});
