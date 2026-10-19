import { test, expect } from './helpers/test';

test.describe('ディレクトリツリー図作成（日本語版）', () => {
  test('インデントをツリー図に変換する', async ({ page }) => {
    await page.goto('/tools/tree-diagram-generator/');

    await page
      .locator('#tree-diagram-generator-input')
      .fill('r/\n  a.ts\n  b.ts');

    await expect(page.locator('#tree-diagram-generator-output')).toHaveValue(
      'r/\n├── a.ts\n└── b.ts',
    );
  });

  test('ASCII表記に切り替えられる', async ({ page }) => {
    await page.goto('/tools/tree-diagram-generator/');

    await page.locator('#tree-diagram-generator-input').fill('r\n  a');
    await page.locator('#tree-diagram-generator-style').selectOption('ascii');

    await expect(page.locator('#tree-diagram-generator-output')).toHaveValue(
      'r\n`-- a',
    );
  });

  test('階層が飛ぶとエラーを表示する', async ({ page }) => {
    await page.goto('/tools/tree-diagram-generator/');

    await page.locator('#tree-diagram-generator-indent').selectOption('2');
    await page.locator('#tree-diagram-generator-input').fill('a\n    b');

    await expect(page.locator('#tree-diagram-generator-error')).toContainText(
      '2行目',
    );
  });

  test('ツリー図をインデントに戻せる', async ({ page }) => {
    await page.goto('/tools/tree-diagram-generator/');

    await page
      .locator('#tree-diagram-generator-direction')
      .selectOption('reverse');
    await page.locator('#tree-diagram-generator-input').fill('r\n└── a');

    await expect(page.locator('#tree-diagram-generator-output')).toHaveValue(
      'r\n  a',
    );
  });
});

test.describe('Directory Tree Generator (English)', () => {
  test('英語版で変換できる', async ({ page }) => {
    await page.goto('/en/tools/tree-diagram-generator/');

    await page.locator('#tree-diagram-generator-input').fill('r\n  a');
    await expect(page.locator('#tree-diagram-generator-output')).toHaveValue(
      'r\n└── a',
    );
  });
});
