import { test, expect } from './helpers/test';

test.describe('罫線表作成（日本語版）', () => {
  test('CSVをASCII罫線の表に変換する', async ({ page }) => {
    await page.goto('/tools/ascii-table-generator/');

    await page.locator('#ascii-table-generator-input').fill('a,b\n1,2');

    await expect(page.locator('#ascii-table-generator-output')).toHaveValue(
      '+---+---+\n| a | b |\n+---+---+\n| 1 | 2 |\n+---+---+',
    );
    await expect(page.locator('#ascii-table-generator-error')).toBeHidden();
  });

  test('Unicode罫線に切り替えられる', async ({ page }) => {
    await page.goto('/tools/ascii-table-generator/');

    await page.locator('#ascii-table-generator-input').fill('a');
    await page.locator('#ascii-table-generator-style').selectOption('single');

    await expect(page.locator('#ascii-table-generator-output')).toHaveValue(
      '┌───┐\n│ a │\n└───┘',
    );
  });

  test('閉じていない引用符はエラーを表示する', async ({ page }) => {
    await page.goto('/tools/ascii-table-generator/');

    await page.locator('#ascii-table-generator-input').fill('a,"b');

    await expect(page.locator('#ascii-table-generator-error')).toContainText(
      'ダブルクォートが閉じられていません',
    );
  });
});

test.describe('ASCII Table Generator (English)', () => {
  test('英語版で変換できる', async ({ page }) => {
    await page.goto('/en/tools/ascii-table-generator/');

    await page.locator('#ascii-table-generator-input').fill('x\n1');
    await expect(page.locator('#ascii-table-generator-output')).toHaveValue(
      '+---+\n| x |\n+---+\n| 1 |\n+---+',
    );
  });
});
