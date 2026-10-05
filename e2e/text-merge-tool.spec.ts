import { test, expect } from './helpers/test';

test.describe('テキストマージツール（日本語版）', () => {
  test('直接アクセスして表示され、初期状態は差分なし', async ({ page }) => {
    await page.goto('/tools/text-merge-tool/');

    await expect(page.locator('main h1')).toHaveText(
      'テキストマージツール（2つのバージョンを統合）',
    );
    await expect(page.locator('#tm-status')).toContainText('差分はありません');
    await expect(page.locator('#tm-hunks > div')).toHaveCount(0);
  });

  test('差分ごとに採用を選ぶとマージ結果に反映される', async ({ page }) => {
    await page.goto('/tools/text-merge-tool/');

    await page.locator('#tm-input-a').fill('a\nx\nc\ny');
    await page.locator('#tm-input-b').fill('a\nX\nc\nY');

    await expect(page.locator('#tm-status')).toHaveText('差分の箇所: 2件');
    await expect(page.locator('#tm-hunks > div')).toHaveCount(2);
    // 初期はBを採用
    await expect(page.locator('#tm-result')).toHaveValue('a\nX\nc\nY');

    await page.locator('#tm-hunks select').first().selectOption('a');
    await expect(page.locator('#tm-result')).toHaveValue('a\nx\nc\nY');

    await page.locator('#tm-hunks select').nth(1).selectOption('ab');
    await expect(page.locator('#tm-result')).toHaveValue('a\nx\nc\ny\nY');

    await page.locator('#tm-hunks select').nth(1).selectOption('none');
    await expect(page.locator('#tm-result')).toHaveValue('a\nx\nc');
  });

  test('一括ボタンで全差分の採用を切り替えられる', async ({ page }) => {
    await page.goto('/tools/text-merge-tool/');

    await page.locator('#tm-input-a').fill('a\nx\nc\ny');
    await page.locator('#tm-input-b').fill('a\nX\nc\nY');

    await page.locator('#tm-all-a').click();
    await expect(page.locator('#tm-result')).toHaveValue('a\nx\nc\ny');
    await page.locator('#tm-all-b').click();
    await expect(page.locator('#tm-result')).toHaveValue('a\nX\nc\nY');
    await page.locator('#tm-all-ab').click();
    await expect(page.locator('#tm-result')).toHaveValue('a\nx\nX\nc\ny\nY');
  });

  test('入力を変えても、同じ内容の差分の選択は引き継がれる', async ({
    page,
  }) => {
    await page.goto('/tools/text-merge-tool/');

    await page.locator('#tm-input-a').fill('a\nx');
    await page.locator('#tm-input-b').fill('a\nX');
    await page.locator('#tm-hunks select').first().selectOption('a');

    await page.locator('#tm-input-a').fill('a\nx\nc');
    await page.locator('#tm-input-b').fill('a\nX\nc');
    await expect(page.locator('#tm-hunks select').first()).toHaveValue('a');
    await expect(page.locator('#tm-result')).toHaveValue('a\nx\nc');
  });

  test('マージ結果を直接編集でき、コピー操作で完了メッセージが出る', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/text-merge-tool/');

    await page.locator('#tm-sample-button').click();
    await page.locator('#tm-result').fill('edited');
    await expect(page.locator('#tm-result')).toHaveValue('edited');

    await page.locator('#tm-copy-button').click();
    await expect(page.locator('#tm-copy-status')).toHaveText('コピーしました');
  });

  test('ダウンロードでmerged.txtが保存される', async ({ page }) => {
    await page.goto('/tools/text-merge-tool/');

    await page.locator('#tm-input-a').fill('foo');
    await page.locator('#tm-input-b').fill('bar');

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#tm-download-button').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('merged.txt');
  });

  test('入力内のHTMLタグは文字として表示される', async ({ page }) => {
    await page.goto('/tools/text-merge-tool/');

    await page.locator('#tm-input-a').fill('<img src=x onerror=alert(1)>');
    await page.locator('#tm-input-b').fill('b');
    await expect(page.locator('#tm-hunks img')).toHaveCount(0);
    await expect(page.locator('#tm-hunks')).toContainText('<img src=x');
  });
});

test.describe('Text Merge Tool (English)', () => {
  test('英語版が表示され、マージ結果が更新される', async ({ page }) => {
    await page.goto('/en/tools/text-merge-tool/');

    await expect(page.locator('main h1')).toHaveText(
      'Text Merge Tool (Combine Two Versions)',
    );
    await page.locator('#tm-input-a').fill('a\nx');
    await page.locator('#tm-input-b').fill('a\nX');
    await expect(page.locator('#tm-status')).toHaveText('Differences: 1');
    await page.locator('#tm-hunks select').first().selectOption('a');
    await expect(page.locator('#tm-result')).toHaveValue('a\nx');
  });
});
