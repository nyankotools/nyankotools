import { test, expect } from '@playwright/test';

test.describe('文字列の重複削除・ソート・シャッフル（日本語版）', () => {
  test('直接アクセスして正しく表示され、入力すると結果が反映される', async ({
    page,
  }) => {
    await page.goto('/tools/text-list-tools/');

    await expect(page.locator('main h1')).toHaveText(
      '文字列の重複削除・ソート・シャッフル',
    );

    await page.locator('#tlt-input').fill('banana\napple\napple\ncherry');

    await expect(page.locator('#tlt-output')).toHaveValue(
      'banana\napple\napple\ncherry',
    );
    await expect(page.locator('#tlt-count')).toHaveText('4行');
  });

  test('重複削除・ソートのオプションを組み合わせて適用できる', async ({
    page,
  }) => {
    await page.goto('/tools/text-list-tools/');

    await page.locator('#tlt-input').fill('banana\napple\napple\ncherry');
    await page.locator('#tlt-dedupe').check();
    await page.locator('#tlt-sort-order').selectOption('asc');

    await expect(page.locator('#tlt-output')).toHaveValue(
      'apple\nbanana\ncherry',
    );
    await expect(page.locator('#tlt-count')).toHaveText('3行');
  });

  test('空行削除と前後の空白削除が反映される', async ({ page }) => {
    await page.goto('/tools/text-list-tools/');

    await page.locator('#tlt-input').fill('  a  \n\n b \n');
    await page.locator('#tlt-trim').check();
    await page.locator('#tlt-remove-empty').check();

    await expect(page.locator('#tlt-output')).toHaveValue('a\nb');
    await expect(page.locator('#tlt-count')).toHaveText('2行');
  });

  test('シャッフルを選択すると「もう一度シャッフルする」ボタンが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/text-list-tools/');

    await page.locator('#tlt-input').fill('a\nb\nc\nd');
    await expect(page.locator('#tlt-reshuffle-button')).toBeHidden();

    await page.locator('#tlt-sort-order').selectOption('shuffle');
    await expect(page.locator('#tlt-reshuffle-button')).toBeVisible();

    const before = await page.locator('#tlt-output').inputValue();
    expect(before.split('\n').sort()).toEqual(['a', 'b', 'c', 'd']);
  });

  test('コピーボタンで結果をクリップボードにコピーできる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/text-list-tools/');

    await page.locator('#tlt-input').fill('banana\napple');
    await page.locator('#tlt-copy-button').click();

    await expect(page.locator('#tlt-status')).toHaveText('コピーしました');
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    // WindowsのOSクリップボードはLFをCRLFへ正規化することがあるため、
    // 改行コードの違いを吸収してから比較する。
    expect(clipboardText.replace(/\r\n/g, '\n')).toBe('banana\napple');
  });
});

test.describe('Text List Deduplicate, Sort & Shuffle (English)', () => {
  test('英語版が正しく表示され、入力すると結果が反映される', async ({
    page,
  }) => {
    await page.goto('/en/tools/text-list-tools/');

    await expect(page.locator('main h1')).toHaveText(
      'Text List Deduplicate, Sort & Shuffle',
    );

    await page.locator('#tlt-input').fill('banana\napple\napple\ncherry');
    await page.locator('#tlt-dedupe').check();
    await page.locator('#tlt-sort-order').selectOption('asc');

    await expect(page.locator('#tlt-output')).toHaveValue(
      'apple\nbanana\ncherry',
    );
    await expect(page.locator('#tlt-count')).toHaveText('3 lines');
  });

  test('コピーボタンで結果をクリップボードにコピーでき、英語のメッセージが表示される', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/en/tools/text-list-tools/');

    await page.locator('#tlt-input').fill('banana\napple');
    await page.locator('#tlt-copy-button').click();

    await expect(page.locator('#tlt-status')).toHaveText('Copied');
  });
});
