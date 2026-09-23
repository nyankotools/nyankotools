import { test, expect } from '@playwright/test';

test.describe('HTML/JS文字列エスケープ・アンエスケープツール（日本語版）', () => {
  test('直接アクセスして正しく表示され、初期状態はHTMLエスケープモード', async ({
    page,
  }) => {
    await page.goto('/tools/html-escape/');

    await expect(page.locator('main h1')).toHaveText(
      'HTML/JavaScript文字列 エスケープ・アンエスケープ',
    );

    await expect(
      page.locator('#html-escape-mode [data-mode="html-escape"]'),
    ).toHaveAttribute('aria-pressed', 'true');

    await page.locator('#html-escape-input').fill('<p class="a">it\'s</p>');
    await expect(page.locator('#html-escape-output')).toHaveValue(
      '&lt;p class=&quot;a&quot;&gt;it&#39;s&lt;/p&gt;',
    );
  });

  test('HTMLアンエスケープモードで実体参照を元の文字列に戻せる', async ({
    page,
  }) => {
    await page.goto('/tools/html-escape/');

    await page.locator('#html-escape-mode [data-mode="html-unescape"]').click();
    await expect(
      page.locator('#html-escape-mode [data-mode="html-unescape"]'),
    ).toHaveAttribute('aria-pressed', 'true');

    await page
      .locator('#html-escape-input')
      .fill('&lt;p class=&quot;a&quot;&gt;');
    await expect(page.locator('#html-escape-output')).toHaveValue(
      '<p class="a">',
    );
  });

  test('JS文字列エスケープ・アンエスケープが相互に変換できる', async ({
    page,
  }) => {
    await page.goto('/tools/html-escape/');

    await page.locator('#html-escape-mode [data-mode="js-escape"]').click();
    await page.locator('#html-escape-input').fill("it's");
    await expect(page.locator('#html-escape-output')).toHaveValue("it\\'s");

    await page.locator('#html-escape-mode [data-mode="js-unescape"]').click();
    await page.locator('#html-escape-input').fill("it\\'s");
    await expect(page.locator('#html-escape-output')).toHaveValue("it's");
  });

  test('入力を空にすると結果も空になる', async ({ page }) => {
    await page.goto('/tools/html-escape/');

    await page.locator('#html-escape-input').fill('<p>');
    await expect(page.locator('#html-escape-output')).toHaveValue('&lt;p&gt;');

    await page.locator('#html-escape-input').fill('');
    await expect(page.locator('#html-escape-output')).toHaveValue('');
  });

  test('コピーボタンで結果をクリップボードにコピーできる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/html-escape/');

    await page.locator('#html-escape-input').fill('<p>');
    await page.locator('#html-escape-copy-button').click();

    await expect(page.locator('#html-escape-status')).toHaveText(
      'コピーしました',
    );
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toBe('&lt;p&gt;');
  });
});

test.describe('HTML/JS String Escape & Unescape (English)', () => {
  test('英語版が正しく表示され、入力するとエスケープされる', async ({
    page,
  }) => {
    await page.goto('/en/tools/html-escape/');

    await expect(page.locator('main h1')).toHaveText(
      'HTML / JavaScript String Escape & Unescape',
    );

    await page.locator('#html-escape-input').fill('<p>');
    await expect(page.locator('#html-escape-output')).toHaveValue('&lt;p&gt;');
  });

  test('コピーボタンで結果をクリップボードにコピーでき、英語のメッセージが表示される', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/en/tools/html-escape/');

    await page.locator('#html-escape-input').fill('<p>');
    await page.locator('#html-escape-copy-button').click();

    await expect(page.locator('#html-escape-status')).toHaveText('Copied');
  });
});
