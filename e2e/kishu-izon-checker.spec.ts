import { test, expect } from '@playwright/test';

test.describe('機種依存文字（環境依存文字）チェッカー（日本語版）', () => {
  test('直接アクセスして正しく表示され、機種依存文字を入力すると検出結果が表示される', async ({
    page,
  }) => {
    await page.goto('/tools/kishu-izon-checker/');

    await expect(page.locator('main h1')).toHaveText(
      '機種依存文字（環境依存文字）チェッカー',
    );

    await page.locator('#kishu-izon-input').fill('①①②');

    await expect(page.locator('#kishu-izon-status')).toHaveText(
      '3件の機種依存文字が見つかりました（2種類）。',
    );
    await expect(page.locator('#kishu-izon-highlight mark')).toHaveCount(3);
    await expect(page.locator('#kishu-izon-table-wrapper')).toBeVisible();

    const rows = page.locator('#kishu-izon-table-body tr');
    await expect(rows).toHaveCount(2);
    await expect(rows.first()).toContainText('①');
    await expect(rows.first()).toContainText('2件');
  });

  test('該当する文字がない場合は該当なしと表示される', async ({ page }) => {
    await page.goto('/tools/kishu-izon-checker/');

    await page.locator('#kishu-izon-input').fill('こんにちは、World!');

    await expect(page.locator('#kishu-izon-status')).toHaveText(
      '機種依存文字は見つかりませんでした。',
    );
    await expect(page.locator('#kishu-izon-table-wrapper')).toBeHidden();
  });

  test('入力を空にすると結果表示もクリアされる', async ({ page }) => {
    await page.goto('/tools/kishu-izon-checker/');

    await page.locator('#kishu-izon-input').fill('①');
    await expect(page.locator('#kishu-izon-status')).not.toHaveText('');

    await page.locator('#kishu-izon-input').fill('');
    await expect(page.locator('#kishu-izon-status')).toHaveText('');
    await expect(page.locator('#kishu-izon-table-wrapper')).toBeHidden();
  });

  test('置き換え候補で置換したテキストをコピーできる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/kishu-izon-checker/');

    await page.locator('#kishu-izon-input').fill('①㍉㈱髙');
    await page.locator('#kishu-izon-copy-button').click();

    await expect(page.locator('#kishu-izon-copy-status')).toHaveText(
      'コピーしました',
    );
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toBe('(1)ミリ(株)高');
  });

  test('検出結果の分類名・説明・置き換え候補が日本語で表示される', async ({
    page,
  }) => {
    await page.goto('/tools/kishu-izon-checker/');

    await page.locator('#kishu-izon-input').fill('Ⅰ Ⅱ Ⅲ ㈱');
    const rows = page.locator('#kishu-izon-table-body tr');
    await expect(rows).toHaveCount(4);

    const row = rows.filter({ hasText: '㈱' });
    await expect(row).toContainText('丸括弧付き略号');
    await expect(row).toContainText('㈱（株式会社）');
    await expect(row).toContainText('(株)');

    const romanRow = rows.filter({ hasText: 'Ⅰ' });
    await expect(romanRow).toContainText('ローマ数字');
    await expect(romanRow).toContainText('I');
  });

  test('用語解説セクションが表示される', async ({ page }) => {
    await page.goto('/tools/kishu-izon-checker/');

    await expect(
      page.getByRole('heading', { level: 2, name: '用語解説' }),
    ).toBeVisible();
    await expect(
      page.getByText('機種依存文字（環境依存文字）', { exact: true }),
    ).toBeVisible();
  });

  test('サイドバーからツールページへ遷移できる', async ({ page }) => {
    await page.goto('/');

    const link = page.locator('#sidebar a[href="/tools/kishu-izon-checker/"]');
    await link.locator('xpath=ancestor::details[1]/summary').click();
    await link.click();

    await expect(page).toHaveURL(/\/tools\/kishu-izon-checker\/?$/);
    await expect(page.locator('main h1')).toHaveText(
      '機種依存文字（環境依存文字）チェッカー',
    );
  });

  test('375px幅でも横スクロールが発生しない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/tools/kishu-izon-checker/');

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
});

test.describe('Machine-Dependent Character Checker (English)', () => {
  test('英語版が正しく表示され、機種依存文字を入力すると検出結果が英語で表示される', async ({
    page,
  }) => {
    await page.goto('/en/tools/kishu-izon-checker/');

    await expect(page.locator('main h1')).toHaveText(
      'Machine-Dependent Character Checker',
    );

    await page.locator('#kishu-izon-input').fill('①');

    await expect(page.locator('#kishu-izon-status')).toHaveText(
      'Found 1 machine-dependent character (1 unique).',
    );
  });

  test('該当する文字がない場合は英語で該当なしと表示される', async ({
    page,
  }) => {
    await page.goto('/en/tools/kishu-izon-checker/');

    await page.locator('#kishu-izon-input').fill('Hello World!');

    await expect(page.locator('#kishu-izon-status')).toHaveText(
      'No machine-dependent characters were found.',
    );
  });

  test('検出件数が複数のときは複数形の文言になる', async ({ page }) => {
    await page.goto('/en/tools/kishu-izon-checker/');

    await page.locator('#kishu-izon-input').fill('①②');

    await expect(page.locator('#kishu-izon-status')).toHaveText(
      'Found 2 machine-dependent characters (2 unique).',
    );
  });

  test('検出結果の分類名・説明・置き換え候補が英語で表示される', async ({
    page,
  }) => {
    await page.goto('/en/tools/kishu-izon-checker/');

    await page.locator('#kishu-izon-input').fill('㈱');
    const rows = page.locator('#kishu-izon-table-body tr');
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText('Parenthesized abbreviation');
    await expect(rows.first()).toContainText('㈱ (stock company)');
    await expect(rows.first()).toContainText('(K.K.)');
    // 出現数セルはja版と異なり「件」が付かず数値のみ
    await expect(rows.first()).toContainText('1');
  });

  test('コピーボタンで結果をクリップボードにコピーでき、英語のメッセージが表示される', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/en/tools/kishu-izon-checker/');

    await page.locator('#kishu-izon-input').fill('①');
    await page.locator('#kishu-izon-copy-button').click();

    await expect(page.locator('#kishu-izon-copy-status')).toHaveText('Copied');
  });

  test('英語版のロケールで置き換え候補（英語表記）に置換したテキストをコピーできる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/en/tools/kishu-izon-checker/');

    // ja版なら「(1)ミリ(株)高」になる組み合わせが、en版では英語表記で置換されることを確認する
    await page.locator('#kishu-izon-input').fill('①㍉㈱髙');
    await page.locator('#kishu-izon-copy-button').click();

    await expect(page.locator('#kishu-izon-copy-status')).toHaveText('Copied');
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toBe('(1)milli(K.K.)高');
  });

  test('用語解説（Glossary）セクションが英語で表示される', async ({ page }) => {
    await page.goto('/en/tools/kishu-izon-checker/');

    await expect(
      page.getByRole('heading', { level: 2, name: 'Glossary' }),
    ).toBeVisible();
  });

  test('サイドバーからツールページへ遷移できる（英語版）', async ({ page }) => {
    await page.goto('/en/');

    const link = page.locator(
      '#sidebar a[href="/en/tools/kishu-izon-checker/"]',
    );
    await link.locator('xpath=ancestor::details[1]/summary').click();
    await link.click();

    await expect(page).toHaveURL(/\/en\/tools\/kishu-izon-checker\/?$/);
    await expect(page.locator('main h1')).toHaveText(
      'Machine-Dependent Character Checker',
    );
  });

  test('375px幅でも横スクロールが発生しない（英語版）', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/en/tools/kishu-izon-checker/');

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
});
