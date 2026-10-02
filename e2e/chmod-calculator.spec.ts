import { test, expect } from './helpers/test';

test.describe('Chmodパーミッション計算機（日本語版）', () => {
  test('直接アクセスして正しく表示され、デフォルトで755が表示される', async ({
    page,
  }) => {
    await page.goto('/tools/chmod-calculator/');

    await expect(page.locator('main h1')).toHaveText(
      'Chmodパーミッション計算機',
    );
    await expect(page.locator('#chmod-octal-input')).toHaveValue('755');
    await expect(page.locator('#chmod-symbolic-input')).toHaveValue(
      'rwxr-xr-x',
    );
    await expect(page.locator('#chmod-command-output')).toHaveValue(
      'chmod 755 ファイル名',
    );

    await expect(page.locator('#chmod-owner-read')).toBeChecked();
    await expect(page.locator('#chmod-owner-write')).toBeChecked();
    await expect(page.locator('#chmod-owner-execute')).toBeChecked();
    await expect(page.locator('#chmod-group-read')).toBeChecked();
    await expect(page.locator('#chmod-group-write')).not.toBeChecked();
    await expect(page.locator('#chmod-group-execute')).toBeChecked();
    await expect(page.locator('#chmod-other-read')).toBeChecked();
    await expect(page.locator('#chmod-other-write')).not.toBeChecked();
    await expect(page.locator('#chmod-other-execute')).toBeChecked();
    await expect(page.locator('#chmod-setuid')).not.toBeChecked();
    await expect(page.locator('#chmod-setgid')).not.toBeChecked();
    await expect(page.locator('#chmod-sticky')).not.toBeChecked();
  });

  test('チェックボックスを変更すると8進数・シンボル表記・chmodコマンドが連動更新される', async ({
    page,
  }) => {
    await page.goto('/tools/chmod-calculator/');

    // 755 -> グループの書き込みも許可 -> 775
    await page.locator('#chmod-group-write').check();

    await expect(page.locator('#chmod-octal-input')).toHaveValue('775');
    await expect(page.locator('#chmod-symbolic-input')).toHaveValue(
      'rwxrwxr-x',
    );
    await expect(page.locator('#chmod-command-output')).toHaveValue(
      'chmod 775 ファイル名',
    );

    // setuidを有効化 -> 4桁の8進数・sフラグが反映される
    await page.locator('#chmod-setuid').check();

    await expect(page.locator('#chmod-octal-input')).toHaveValue('4775');
    await expect(page.locator('#chmod-symbolic-input')).toHaveValue(
      'rwsrwxr-x',
    );
    await expect(page.locator('#chmod-command-output')).toHaveValue(
      'chmod 4775 ファイル名',
    );
  });

  test('8進数欄に直接入力するとチェックボックス・シンボル表記に反映される', async ({
    page,
  }) => {
    await page.goto('/tools/chmod-calculator/');

    await page.locator('#chmod-octal-input').fill('4750');

    await expect(page.locator('#chmod-symbolic-input')).toHaveValue(
      'rwsr-x---',
    );
    await expect(page.locator('#chmod-command-output')).toHaveValue(
      'chmod 4750 ファイル名',
    );

    await expect(page.locator('#chmod-owner-read')).toBeChecked();
    await expect(page.locator('#chmod-owner-write')).toBeChecked();
    await expect(page.locator('#chmod-owner-execute')).toBeChecked();
    await expect(page.locator('#chmod-group-read')).toBeChecked();
    await expect(page.locator('#chmod-group-write')).not.toBeChecked();
    await expect(page.locator('#chmod-group-execute')).toBeChecked();
    await expect(page.locator('#chmod-other-read')).not.toBeChecked();
    await expect(page.locator('#chmod-other-write')).not.toBeChecked();
    await expect(page.locator('#chmod-other-execute')).not.toBeChecked();
    await expect(page.locator('#chmod-setuid')).toBeChecked();
    await expect(page.locator('#chmod-setgid')).not.toBeChecked();
    await expect(page.locator('#chmod-sticky')).not.toBeChecked();
    await expect(page.locator('#chmod-error')).toBeEmpty();
  });

  test('シンボル表記欄に直接入力するとチェックボックス・8進数欄に反映される', async ({
    page,
  }) => {
    await page.goto('/tools/chmod-calculator/');

    await page.locator('#chmod-symbolic-input').fill('rwsr-x---');

    await expect(page.locator('#chmod-octal-input')).toHaveValue('4750');
    await expect(page.locator('#chmod-command-output')).toHaveValue(
      'chmod 4750 ファイル名',
    );
    await expect(page.locator('#chmod-setuid')).toBeChecked();
    await expect(page.locator('#chmod-owner-execute')).toBeChecked();
    await expect(page.locator('#chmod-other-read')).not.toBeChecked();
    await expect(page.locator('#chmod-error')).toBeEmpty();

    // 特殊権限なしの通常表記に戻しても正しく反映される
    await page.locator('#chmod-symbolic-input').fill('rwxr-xr-x');

    await expect(page.locator('#chmod-octal-input')).toHaveValue('755');
    await expect(page.locator('#chmod-setuid')).not.toBeChecked();
  });

  test('不正な8進数を入力するとエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/chmod-calculator/');

    const octalInput = page.locator('#chmod-octal-input');
    const before = await octalInput.inputValue();

    await octalInput.fill('999');

    await expect(page.locator('#chmod-error')).toHaveText(
      '8進数の形式が正しくありません（例: 755、特殊権限込みなら4755）',
    );
    // エラー時は他の欄が壊れた値で上書きされない
    await expect(page.locator('#chmod-symbolic-input')).toHaveValue(
      'rwxr-xr-x',
    );
    expect(before).toBe('755');
  });

  test('不正なシンボル表記を入力するとエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/chmod-calculator/');

    await page.locator('#chmod-symbolic-input').fill('abc');

    await expect(page.locator('#chmod-error')).toHaveText(
      'シンボル表記の形式が正しくありません（例: rwxr-xr-x）',
    );
    await expect(page.locator('#chmod-octal-input')).toHaveValue('755');
  });

  test('コピーボタンで8進数をクリップボードにコピーできる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/chmod-calculator/');

    await page.locator('[data-copy-target="chmod-octal-input"]').click();

    await expect(page.locator('#chmod-status')).toHaveText('コピーしました');
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toBe('755');
  });
});

test.describe('Chmod Permission Calculator (English)', () => {
  test('英語版が正しく表示され、相互変換が動作する', async ({ page }) => {
    await page.goto('/en/tools/chmod-calculator/');

    await expect(page.locator('main h1')).toHaveText(
      'Chmod Permission Calculator',
    );
    await expect(page.locator('#chmod-octal-input')).toHaveValue('755');
    await expect(page.locator('#chmod-symbolic-input')).toHaveValue(
      'rwxr-xr-x',
    );
    await expect(page.locator('#chmod-command-output')).toHaveValue(
      'chmod 755 file',
    );

    await page.locator('#chmod-octal-input').fill('4750');
    await expect(page.locator('#chmod-symbolic-input')).toHaveValue(
      'rwsr-x---',
    );
    await expect(page.locator('#chmod-command-output')).toHaveValue(
      'chmod 4750 file',
    );
    await expect(page.locator('#chmod-setuid')).toBeChecked();
  });

  test('不正な入力でエラーメッセージが英語で表示される', async ({ page }) => {
    await page.goto('/en/tools/chmod-calculator/');

    await page.locator('#chmod-symbolic-input').fill('abc');
    await expect(page.locator('#chmod-error')).toHaveText(
      'Invalid symbolic format (e.g. rwxr-xr-x)',
    );

    await page.locator('#chmod-symbolic-input').fill('rwxr-xr-x');
    await page.locator('#chmod-octal-input').fill('999');
    await expect(page.locator('#chmod-error')).toHaveText(
      'Invalid octal format (e.g. 755, or 4755 with special permissions)',
    );
  });
});
