import { test, expect } from '@playwright/test';

test.describe('テキスト差分比較（diff）ツール（日本語版）', () => {
  test('直接アクセスして正しく表示され、初期状態は差分なしと表示される', async ({
    page,
  }) => {
    await page.goto('/tools/text-diff/');

    await expect(page.locator('main h1')).toHaveText(
      'テキスト差分比較（diff）',
    );
    await expect(page.locator('#diff-status')).toHaveText(
      '追加: 0行 / 削除: 0行 / 変更なし: 1行',
    );
  });

  test('2つのテキストを入力すると追加・削除・変更なしがハイライト表示され、件数が更新される', async ({
    page,
  }) => {
    await page.goto('/tools/text-diff/');

    await page.locator('#diff-input-a').fill('foo\nbar\nbaz');
    await page.locator('#diff-input-b').fill('foo\nBAR\nbaz\nqux');

    await expect(page.locator('#diff-status')).toHaveText(
      '追加: 2行 / 削除: 1行 / 変更なし: 2行',
    );

    const rows = page.locator('#diff-body tr');
    await expect(rows).toHaveCount(5);
    await expect(page.locator('#diff-body tr.bg-red-50')).toHaveCount(1);
    await expect(page.locator('#diff-body tr.bg-green-50')).toHaveCount(2);

    // 削除行(bar)と追加行(BAR, qux)の内容を確認
    await expect(page.locator('#diff-body tr.bg-red-50')).toContainText('bar');
    await expect(
      page.locator('#diff-body tr.bg-green-50').first(),
    ).toContainText('BAR');
    await expect(
      page.locator('#diff-body tr.bg-green-50').nth(1),
    ).toContainText('qux');
  });

  test('「大文字・小文字の違いを無視する」を有効にすると大文字小文字だけ異なる行が変更なし扱いになる', async ({
    page,
  }) => {
    await page.goto('/tools/text-diff/');

    await page.locator('#diff-input-a').fill('foo\nbar\nbaz');
    await page.locator('#diff-input-b').fill('foo\nBAR\nbaz\nqux');

    await expect(page.locator('#diff-status')).toHaveText(
      '追加: 2行 / 削除: 1行 / 変更なし: 2行',
    );

    await page.locator('#diff-ignore-case').check();

    await expect(page.locator('#diff-status')).toHaveText(
      '追加: 1行 / 削除: 0行 / 変更なし: 3行',
    );
  });

  test('「行頭・行末の空白の違いを無視する」を有効にすると空白だけ異なる行が変更なし扱いになる', async ({
    page,
  }) => {
    await page.goto('/tools/text-diff/');

    await page.locator('#diff-input-a').fill('  hello  \nworld');
    await page.locator('#diff-input-b').fill('hello\nworld');

    await expect(page.locator('#diff-status')).toHaveText(
      '追加: 1行 / 削除: 1行 / 変更なし: 1行',
    );

    await page.locator('#diff-ignore-whitespace').check();

    await expect(page.locator('#diff-status')).toHaveText(
      '追加: 0行 / 削除: 0行 / 変更なし: 2行',
    );
  });
});

test.describe('Text Diff Checker (English)', () => {
  test('英語版が正しく表示され、差分件数が英語表記で更新される', async ({
    page,
  }) => {
    await page.goto('/en/tools/text-diff/');

    await expect(page.locator('main h1')).toHaveText('Text Diff Checker');
    await expect(page.locator('#diff-status')).toHaveText(
      'Added: 0 / Removed: 0 / Unchanged: 1',
    );

    await page.locator('#diff-input-a').fill('foo\nbar');
    await page.locator('#diff-input-b').fill('foo\nBAR');

    await expect(page.locator('#diff-status')).toHaveText(
      'Added: 1 / Removed: 1 / Unchanged: 1',
    );
  });
});
