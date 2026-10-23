import { test, expect } from './helpers/test';

test.describe('umask計算機（日本語版）', () => {
  test('初期値022でファイル644・ディレクトリ755が表示される', async ({
    page,
  }) => {
    await page.goto('/tools/umask-calculator/');

    await expect(page.locator('main h1')).toHaveText('umask計算機');
    await expect(page.locator('#umask-file-octal')).toHaveValue('644');
    await expect(page.locator('#umask-file-symbolic')).toHaveValue('rw-r--r--');
    await expect(page.locator('#umask-dir-octal')).toHaveValue('755');
    await expect(page.locator('#umask-dir-symbolic')).toHaveValue('rwxr-xr-x');
    await expect(page.locator('#umask-command')).toHaveValue('umask 022');
    await expect(page.locator('#umask-symbolic-output')).toHaveValue(
      'u=rwx,g=rx,o=rx',
    );
  });

  test('umaskを変更すると結果が更新される', async ({ page }) => {
    await page.goto('/tools/umask-calculator/');

    await page.locator('#umask-input').fill('077');
    await expect(page.locator('#umask-file-octal')).toHaveValue('600');
    await expect(page.locator('#umask-dir-octal')).toHaveValue('700');
    await expect(page.locator('#umask-command')).toHaveValue('umask 077');

    await page.locator('#umask-input').fill('2');
    await expect(page.locator('#umask-file-octal')).toHaveValue('664');
    await expect(page.locator('#umask-dir-octal')).toHaveValue('775');
  });

  test('不正なumaskでエラーが表示される', async ({ page }) => {
    await page.goto('/tools/umask-calculator/');

    await page.locator('#umask-input').fill('089');
    await expect(page.locator('#umask-error')).toHaveText(
      'umaskの形式が正しくありません（0〜7の数字で最大3桁。例: 022）',
    );
    await expect(page.locator('#umask-file-octal')).toHaveValue('');
  });

  test('逆算: ファイル644→022、ディレクトリ750→027', async ({ page }) => {
    await page.goto('/tools/umask-calculator/');

    await expect(page.locator('#umask-reverse-result')).toHaveValue('022');

    await page.locator('#umask-kind-directory').check();
    await page.locator('#umask-desired-input').fill('750');
    await expect(page.locator('#umask-reverse-result')).toHaveValue('027');
  });

  test('逆算: ファイルに実行権限を指定すると警告が出る', async ({ page }) => {
    await page.goto('/tools/umask-calculator/');

    await page.locator('#umask-desired-input').fill('755');
    await expect(page.locator('#umask-reverse-result')).toHaveValue('022');
    await expect(page.locator('#umask-reverse-warning')).toContainText(
      '644 (rw-r--r--)',
    );
  });

  test('コピーボタンでumaskコマンドをコピーできる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/umask-calculator/');

    await page.locator('#umask-copy-button').click();
    await expect(page.locator('#umask-status')).toHaveText('コピーしました');
    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text).toBe('umask 022');
  });
});

test.describe('umask Calculator (English)', () => {
  test('英語版が表示され、計算が動作する', async ({ page }) => {
    await page.goto('/en/tools/umask-calculator/');

    await expect(page.locator('main h1')).toHaveText('umask Calculator');
    await expect(page.locator('#umask-file-octal')).toHaveValue('644');

    await page.locator('#umask-input').fill('027');
    await expect(page.locator('#umask-file-octal')).toHaveValue('640');
    await expect(page.locator('#umask-dir-octal')).toHaveValue('750');

    await page.locator('#umask-input').fill('9');
    await expect(page.locator('#umask-error')).toHaveText(
      'Invalid umask (up to 3 digits from 0-7, e.g. 022)',
    );
  });
});
