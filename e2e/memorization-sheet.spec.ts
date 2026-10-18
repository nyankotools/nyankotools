import { test, expect } from './helpers/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('暗記シート作成（日本語版）', () => {
  test('囲んだ語が隠れ、クリックで表示できる', async ({ page }) => {
    await page.goto('/tools/memorization-sheet/');
    await page.locator('#ms-input').fill('首都は**東京**です');
    const mark = page.locator('#ms-preview .ms-mark');
    await expect(mark).toHaveCount(1);
    await expect(mark).toHaveAttribute('aria-pressed', 'false');
    await expect(mark.locator('.ms-word')).toBeHidden();
    await mark.click();
    await expect(mark).toHaveAttribute('aria-pressed', 'true');
    await expect(mark.locator('.ms-word')).toBeVisible();
    await expect(page.locator('#ms-count')).toContainText('1');
  });

  test('すべて表示・すべて隠すを切り替えられる', async ({ page }) => {
    await page.goto('/tools/memorization-sheet/');
    await page.locator('#ms-input').fill('**a** **b**');
    await page.locator('#ms-show-button').click();
    await expect(
      page.locator('#ms-preview .ms-mark[aria-pressed="true"]'),
    ).toHaveCount(2);
    await page.locator('#ms-hide-button').click();
    await expect(
      page.locator('#ms-preview .ms-mark[aria-pressed="true"]'),
    ).toHaveCount(0);
  });

  test('HTMLは解釈されず文字として表示される', async ({ page }) => {
    await page.goto('/tools/memorization-sheet/');
    await page.locator('#ms-input').fill('<img src=x> **<b>x</b>**');
    await expect(page.locator('#ms-preview img')).toHaveCount(0);
    await expect(page.locator('#ms-preview b')).toHaveCount(0);
    await expect(page.locator('#ms-preview')).toContainText('<img src=x>');
  });

  test('選択範囲を囲める', async ({ page }) => {
    await page.goto('/tools/memorization-sheet/');
    const input = page.locator('#ms-input');
    await input.fill('abc def');
    await input.evaluate((el: HTMLTextAreaElement) =>
      el.setSelectionRange(4, 7),
    );
    await page.locator('#ms-wrap-button').click();
    await expect(input).toHaveValue('abc **def**');
  });

  test('印刷時は入力欄と見出しが消え、答えは設定どおりに出る', async ({
    page,
  }) => {
    await page.goto('/tools/memorization-sheet/');
    await page.locator('#ms-input').fill('首都は**東京**です');
    await page.locator('#ms-show-button').click();
    const word = page.locator('#ms-preview .ms-mark .ms-word');

    // 画面上で表示していても「答えを隠して印刷」なら印刷では隠れる
    await page.locator('#ms-print-hidden').check();
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('#ms-input')).toBeHidden();
    await expect(word).toHaveCSS('visibility', 'hidden');
    await page.emulateMedia({ media: 'screen' });

    // 「答えを表示して印刷」なら印刷でも見える
    await page.locator('#ms-print-shown').check();
    await page.emulateMedia({ media: 'print' });
    await expect(word).toHaveCSS('visibility', 'visible');
  });

  test('印刷時の状態をデータ属性に反映する', async ({ page }) => {
    await page.goto('/tools/memorization-sheet/');
    await page.locator('#ms-print-shown').check();
    await expect(page.locator('#ms-preview')).toHaveAttribute(
      'data-print',
      'shown',
    );
  });

  test('空入力では答えのコピーが無効', async ({ page }) => {
    await page.goto('/tools/memorization-sheet/');
    await page.locator('#ms-input').fill('');
    await expect(page.locator('#ms-copy-button')).toBeDisabled();
  });

  test('axeのアクセシビリティ違反がない', async ({ page }) => {
    await page.goto('/tools/memorization-sheet/');
    await page.locator('#ms-input').fill('首都は**東京**です\n**a**');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
});

test.describe('Memorization Sheet Maker (English)', () => {
  test('英語版で語が隠れる', async ({ page }) => {
    await page.goto('/en/tools/memorization-sheet/');
    await page.locator('#ms-input').fill('Capital: **Tokyo**');
    await expect(page.locator('#ms-preview .ms-mark')).toHaveCount(1);
  });
});
