import { test, expect } from './helpers/test';

test.describe('テキスト一括置換・行操作（日本語版）', () => {
  test('置換できて件数が表示される', async ({ page }) => {
    await page.goto('/tools/text-replace-tools/');
    await expect(page.locator('main h1')).toHaveText(
      'テキスト一括置換・行操作ツール',
    );

    await page.locator('#tr-input').fill('a-b-c');
    await page.locator('#tr-find').fill('-');
    await page.locator('#tr-replace').fill('+');
    await expect(page.locator('#tr-output')).toHaveValue('a+b+c');
    await expect(page.locator('#tr-status')).toHaveText('2件を置換しました');
  });

  test('正規表現でキャプチャ参照でき、不正な式はエラー表示', async ({
    page,
  }) => {
    await page.goto('/tools/text-replace-tools/');
    await page.locator('#tr-input').fill('a=1\nb=2');
    await page.locator('#tr-replace-regex').check();
    await page.locator('#tr-find').fill('([a-z])=([0-9])');
    await page.locator('#tr-replace').fill('$2:$1');
    await expect(page.locator('#tr-output')).toHaveValue('1:a\n2:b');

    await page.locator('#tr-find').fill('(');
    await expect(page.locator('#tr-error')).toBeVisible();
    await expect(page.locator('#tr-output')).toHaveValue('');
  });

  test('モードを切り替えて行番号付与・抽出ができる', async ({ page }) => {
    await page.goto('/tools/text-replace-tools/');
    await page.locator('#tr-input').fill('apple\nbanana\ncherry');

    await page.locator('#tr-mode').selectOption('numberAdd');
    await expect(page.locator('#tr-output')).toHaveValue(
      '1. apple\n2. banana\n3. cherry',
    );

    await page.locator('#tr-mode').selectOption('extract');
    await page.locator('#tr-keyword').fill('an');
    await expect(page.locator('#tr-output')).toHaveValue('banana');
    await page.locator('#tr-extract-invert').check();
    await expect(page.locator('#tr-output')).toHaveValue('apple\ncherry');

    await page.locator('#tr-mode').selectOption('reverse');
    await expect(page.locator('#tr-output')).toHaveValue(
      'cherry\nbanana\napple',
    );
  });
});

test.describe('Find & Replace and Line Tools (English)', () => {
  test('shows h1 and adds a prefix to each line', async ({ page }) => {
    await page.goto('/en/tools/text-replace-tools/');
    await expect(page.locator('main h1')).toHaveText(
      'Find & Replace and Line Operations',
    );
    await page.locator('#tr-input').fill('a\nb');
    await page.locator('#tr-mode').selectOption('affix');
    await page.locator('#tr-prefix').fill('- ');
    await expect(page.locator('#tr-output')).toHaveValue('- a\n- b');
  });
});
