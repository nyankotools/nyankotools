import { test, expect } from './helpers/test';

test.describe('URLパーサー（日本語版）', () => {
  test('URLを分解し、パラメータを編集して再組み立てできる', async ({
    page,
  }) => {
    await page.goto('/tools/url-parser/');

    await page
      .locator('#url-parser-input')
      .fill('https://example.com:8080/a/b?x=1&y=2&x=3#top');

    await expect(page.locator('#url-parser-part-hostname')).toHaveValue(
      'example.com',
    );
    await expect(page.locator('#url-parser-part-port')).toHaveValue('8080');
    await expect(page.locator('#url-parser-part-hash')).toHaveValue('top');
    await expect(page.locator('#url-parser-params > li')).toHaveCount(3);
    await expect(page.locator('#url-parser-duplicates')).toContainText('x');
    await expect(page.locator('#url-parser-output')).toHaveValue(
      'https://example.com:8080/a/b?x=1&y=2&x=3#top',
    );

    // 値の編集
    await page
      .locator('#url-parser-params > li')
      .nth(1)
      .getByLabel('値')
      .fill('日 本');
    await expect(page.locator('#url-parser-output')).toHaveValue(
      'https://example.com:8080/a/b?x=1&y=%E6%97%A5%20%E6%9C%AC&x=3#top',
    );

    // 削除
    await page
      .locator('#url-parser-params > li')
      .first()
      .getByRole('button', { name: '削除' })
      .click();
    await expect(page.locator('#url-parser-params > li')).toHaveCount(2);

    // 追加
    await page.locator('#url-parser-add').click();
    await page
      .locator('#url-parser-params > li')
      .last()
      .getByLabel('キー')
      .fill('n');
    await expect(page.locator('#url-parser-output')).toHaveValue(
      'https://example.com:8080/a/b?y=%E6%97%A5%20%E6%9C%AC&x=3&n=#top',
    );

    // 並べ替え
    await page.locator('#url-parser-sort').click();
    await expect(page.locator('#url-parser-output')).toHaveValue(
      'https://example.com:8080/a/b?n=&x=3&y=%E6%97%A5%20%E6%9C%AC#top',
    );
  });

  test('相対URLはベースURLで解決される', async ({ page }) => {
    await page.goto('/tools/url-parser/');

    await page.locator('#url-parser-input').fill('/p?q=1');
    await expect(page.locator('#url-parser-error')).toBeVisible();

    await page.locator('#url-parser-base').fill('https://example.com/dir/');
    await expect(page.locator('#url-parser-error')).toBeHidden();
    await expect(page.locator('#url-parser-output')).toHaveValue(
      'https://example.com/p?q=1',
    );
  });

  test('不正なポートを入力すると組み立てエラーが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/url-parser/');

    await page.locator('#url-parser-input').fill('https://example.com/');
    await page.locator('#url-parser-part-port').fill('99999');
    await expect(page.locator('#url-parser-error')).toBeVisible();
    await expect(page.locator('#url-parser-output')).toHaveValue('');

    await page.locator('#url-parser-part-port').fill('8443');
    await expect(page.locator('#url-parser-error')).toBeHidden();
  });

  test('コピーボタンで結果をコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/url-parser/');

    await page.locator('#url-parser-input').fill('https://example.com/?a=b');
    await page.locator('#url-parser-copy-button').click();
    await expect(page.locator('#url-parser-status')).toHaveText(
      'コピーしました',
    );
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      'https://example.com/?a=b',
    );
  });

  test('キー欄を同名に編集すると重複警告が出て、直すと消える', async ({
    page,
  }) => {
    await page.goto('/tools/url-parser/');
    await page
      .locator('#url-parser-input')
      .fill('https://example.com/?a=1&b=2');
    await expect(page.locator('#url-parser-duplicates')).toBeHidden();

    // キー欄を編集して同名にする（a と b の最初の方を a に統一）
    await page
      .locator('#url-parser-params > li')
      .nth(1)
      .getByLabel('キー')
      .fill('a');
    await expect(page.locator('#url-parser-duplicates')).toBeVisible();
    await expect(page.locator('#url-parser-duplicates')).toContainText('a');

    // 修正して異なる名前に変更（重複警告が消える）
    await page
      .locator('#url-parser-params > li')
      .nth(1)
      .getByLabel('キー')
      .fill('b');
    await expect(page.locator('#url-parser-duplicates')).toBeHidden();
  });
});

test.describe('URL Parser (English)', () => {
  test('英語版で分解と不正入力のエラー表示ができる', async ({ page }) => {
    await page.goto('/en/tools/url-parser/');

    await page.locator('#url-parser-input').fill('https://example.com/?k=v');
    await expect(page.locator('#url-parser-params > li')).toHaveCount(1);
    await expect(page.locator('#url-parser-output')).toHaveValue(
      'https://example.com/?k=v',
    );

    await page.locator('#url-parser-input').fill('not a url');
    await expect(page.locator('#url-parser-error')).toContainText(
      'Could not parse this as a URL',
    );
  });
});
