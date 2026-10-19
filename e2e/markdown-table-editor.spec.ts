import { test, expect } from './helpers/test';
import AxeBuilder from '@axe-core/playwright';

const output = '#markdown-table-editor-output';

test.describe('Markdownテーブルエディタ（日本語版）', () => {
  test('セルを編集すると整形Markdownが出力される', async ({ page }) => {
    await page.goto('/tools/markdown-table-editor/');

    await page.getByLabel('見出し 1').fill('名前');
    await page.getByLabel('見出し 2').fill('年齢');
    await page.getByLabel('セル 1-1').fill('田中');
    await page.getByLabel('セル 1-2').fill('30');

    const value = await page.locator(output).inputValue();
    const lines = value.split('\n');
    expect(lines[0]).toContain('| 名前 | 年齢 |');
    expect(lines[2]).toContain('| 田中 | 30   |');
  });

  test('Markdownを読み込み、列の配置と行追加ができる', async ({ page }) => {
    await page.goto('/tools/markdown-table-editor/');

    await page
      .locator('#markdown-table-editor-import')
      .fill('| a | b |\n| :-- | --: |\n| 1 | 2 |');
    await page.getByRole('button', { name: '読み込む' }).click();
    await expect(page.locator(output)).toHaveValue(
      '| a   |   b |\n| :-- | --: |\n| 1   |   2 |',
    );

    await page.getByRole('button', { name: '行を追加' }).click();
    await expect(page.locator(output)).toHaveValue(/\n\| {5}\| {5}\|$/);
  });

  test('Enterで下のセルへ移動し、最終行では行が増える', async ({ page }) => {
    await page.goto('/tools/markdown-table-editor/');

    await page.getByLabel('セル 2-1').focus();
    await page.keyboard.press('Enter');
    await expect(page.getByLabel('セル 3-1')).toBeFocused();
  });

  test('セル内の縦線と改行はエスケープされる', async ({ page }) => {
    await page.goto('/tools/markdown-table-editor/');

    await page.getByLabel('セル 1-1').fill('a|b');
    await page.getByLabel('セル 1-1').press('Shift+Enter');
    await page.getByLabel('セル 1-1').pressSequentially('c');
    await expect(page.locator(output)).toHaveValue(/a\\\|b<br>c/);
  });
});

test.describe('Markdown Table Editor (English)', () => {
  test('英語版で表示され、読み込みと出力ができる', async ({ page }) => {
    await page.goto('/en/tools/markdown-table-editor/');

    await expect(page.locator('main h1')).toHaveText('Markdown Table Editor');
    await page
      .locator('#markdown-table-editor-import')
      .fill('| x | y |\n| --- | --- |\n| 1 | 2 |');
    await page.getByRole('button', { name: 'Load table' }).click();
    await expect(page.locator(output)).toHaveValue(
      '| x   | y   |\n| --- | --- |\n| 1   | 2   |',
    );
  });
});

test.describe('Markdownテーブルエディタのアクセシビリティ', () => {
  test('日本語版・英語版でaxe違反がない', async ({ page }) => {
    for (const path of [
      '/tools/markdown-table-editor/',
      '/en/tools/markdown-table-editor/',
    ]) {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(results.violations.map((v) => v.id)).toEqual([]);
    }
  });

  test('Shift+Tabで前のセルへ戻れる（キーボードのみ）', async ({ page }) => {
    await page.goto('/tools/markdown-table-editor/');
    await page.getByLabel('見出し 2').focus();
    await page.keyboard.press('Shift+Tab');
    await expect(page.getByLabel('見出し 1')).toBeFocused();
  });
});
