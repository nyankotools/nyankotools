import { test, expect } from '@playwright/test';

test.describe('SQL整形（日本語版）', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/tools/sql-formatter/');
    await expect(page.locator('main h1')).toHaveText(
      'SQL整形・ミニファイツール',
    );
  });

  test('入力すると自動で整形される', async ({ page }) => {
    await page.goto('/tools/sql-formatter/');

    await page
      .locator('#sql-formatter-input')
      .fill('select a,b from t where a=1');

    await expect(page.locator('#sql-formatter-output')).toHaveValue(
      'SELECT\n  a,\n  b\nFROM\n  t\nWHERE\n  a = 1',
    );
    await expect(page.locator('#sql-formatter-error')).toBeHidden();
  });

  test('インデント幅を変更すると結果が変わる', async ({ page }) => {
    await page.goto('/tools/sql-formatter/');

    await page.locator('#sql-formatter-input').fill('SELECT a FROM t');
    await page.locator('#sql-formatter-indent').selectOption('4');

    await expect(page.locator('#sql-formatter-output')).toHaveValue(
      'SELECT\n    a\nFROM\n    t',
    );
  });

  test('キーワードの大文字/小文字を変更すると結果が変わる', async ({
    page,
  }) => {
    await page.goto('/tools/sql-formatter/');

    await page.locator('#sql-formatter-input').fill('SELECT a FROM t');
    await page.locator('#sql-formatter-keyword-case').selectOption('lower');

    await expect(page.locator('#sql-formatter-output')).toHaveValue(
      'select\n  a\nfrom\n  t',
    );
  });

  test('方言を切り替えるとバッククォート識別子等が保持される', async ({
    page,
  }) => {
    await page.goto('/tools/sql-formatter/');

    await page.locator('#sql-formatter-dialect').selectOption('mysql');
    await page.locator('#sql-formatter-input').fill('SELECT `a` FROM `t`');

    await expect(page.locator('#sql-formatter-output')).toHaveValue(/`a`/);
  });

  test('構文エラーのSQLを入力するとエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/sql-formatter/');

    await page.locator('#sql-formatter-input').fill('SELECT * FROM (((');

    await expect(page.locator('#sql-formatter-error')).toBeVisible();
    await expect(page.locator('#sql-formatter-output')).toHaveValue('');
  });

  test('ミニファイボタンで1行に圧縮できる', async ({ page }) => {
    await page.goto('/tools/sql-formatter/');

    await page
      .locator('#sql-formatter-input')
      .fill('SELECT\n  a,\n  b\nFROM\n  t -- comment');
    await page.locator('#sql-formatter-minify-button').click();

    await expect(page.locator('#sql-formatter-output')).toHaveValue(
      'SELECT a, b FROM t',
    );
  });

  test('コピーボタンで結果をクリップボードにコピーできる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/sql-formatter/');

    await page.locator('#sql-formatter-input').fill('SELECT a FROM t');
    await page.locator('#sql-formatter-copy-button').click();

    await expect(page.locator('#sql-formatter-status')).toHaveText(
      'コピーしました',
    );
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    // Windows環境ではOSのクリップボードがLFをCRLFに正規化することがあるため、
    // 改行コードの違いを吸収した上で内容を比較する
    expect(clipboardText.replace(/\r\n/g, '\n')).toBe('SELECT\n  a\nFROM\n  t');
  });

  test('サイドバーからツールページへ遷移できる', async ({ page }) => {
    await page.goto('/');

    await page
      .locator('#sidebar details[data-category="変換"] summary')
      .click();
    await page
      .locator('#sidebar')
      .getByRole('link', { name: 'SQL整形' })
      .click();

    await expect(page).toHaveURL(/\/tools\/sql-formatter\/?$/);
    await expect(page.locator('main h1')).toHaveText(
      'SQL整形・ミニファイツール',
    );
  });

  test('375px幅でも横スクロールが発生しない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/tools/sql-formatter/');

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
});

test.describe('SQL Formatter (English)', () => {
  test('英語版が正しく表示され、整形・ミニファイできる', async ({ page }) => {
    await page.goto('/en/tools/sql-formatter/');
    await expect(page.locator('main h1')).toHaveText(
      'SQL Formatter & Minifier',
    );

    await page
      .locator('#sql-formatter-input')
      .fill('select a,b from t where a=1');
    await expect(page.locator('#sql-formatter-output')).toHaveValue(
      'SELECT\n  a,\n  b\nFROM\n  t\nWHERE\n  a = 1',
    );

    // ミニファイは大文字/小文字や記号周りの空白を作り直すわけではなく、
    // 既存の空白の連続とコメントを取り除くだけの挙動であることを確認する
    await page
      .locator('#sql-formatter-input')
      .fill('SELECT\n  a,\n  b\nFROM\n  t -- comment');
    await page.locator('#sql-formatter-minify-button').click();
    await expect(page.locator('#sql-formatter-output')).toHaveValue(
      'SELECT a, b FROM t',
    );
  });
});
