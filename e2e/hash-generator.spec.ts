import { test, expect } from '@playwright/test';

test.describe('ハッシュ生成ツール（日本語版）', () => {
  test('直接アクセスして正しく表示され、入力するとMD5/SHA-1/SHA-256が計算される', async ({
    page,
  }) => {
    await page.goto('/tools/hash-generator/');

    await expect(page.locator('main h1')).toHaveText(
      'ハッシュ生成（MD5/SHA-1/SHA-256）',
    );

    await page.locator('#hash-generator-input').fill('hello');

    await expect(page.locator('#hash-generator-md5')).toHaveValue(
      '5d41402abc4b2a76b9719d911017c592',
    );
    await expect(page.locator('#hash-generator-sha1')).toHaveValue(
      'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
    );
    await expect(page.locator('#hash-generator-sha256')).toHaveValue(
      '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
    );
  });

  test('入力を空にすると空文字列のハッシュ値が表示される', async ({ page }) => {
    await page.goto('/tools/hash-generator/');

    await page.locator('#hash-generator-input').fill('hello');
    await expect(page.locator('#hash-generator-md5')).not.toHaveValue(
      'd41d8cd98f00b204e9800998ecf8427e',
    );

    // 空文字列にもMD5等のハッシュ値は定義されているため、
    // 他ツールと異なり結果欄は空にならず既知のハッシュ値が表示され続ける仕様。
    await page.locator('#hash-generator-input').fill('');
    await expect(page.locator('#hash-generator-md5')).toHaveValue(
      'd41d8cd98f00b204e9800998ecf8427e',
    );
  });

  test('コピーボタンでハッシュ値をクリップボードにコピーできる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/hash-generator/');

    await page.locator('#hash-generator-input').fill('hello');
    await page.locator('[data-copy-target="hash-generator-sha256"]').click();

    await expect(page.locator('#hash-generator-status')).toHaveText(
      'コピーしました',
    );
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toBe(
      '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
    );
  });

  test('用語解説セクションが表示される', async ({ page }) => {
    await page.goto('/tools/hash-generator/');

    await expect(
      page.getByRole('heading', { level: 2, name: '用語解説' }),
    ).toBeVisible();
    await expect(page.getByText('ハッシュ値', { exact: true })).toBeVisible();
  });
});

test.describe('Hash Generator (English)', () => {
  test('英語版が正しく表示され、入力するとハッシュ値が計算される', async ({
    page,
  }) => {
    await page.goto('/en/tools/hash-generator/');

    await expect(page.locator('main h1')).toHaveText(
      'Hash Generator (MD5/SHA-1/SHA-256)',
    );

    await page.locator('#hash-generator-input').fill('hello');
    await expect(page.locator('#hash-generator-md5')).toHaveValue(
      '5d41402abc4b2a76b9719d911017c592',
    );
  });

  test('コピーボタンで結果をクリップボードにコピーでき、英語のメッセージが表示される', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/en/tools/hash-generator/');

    await page.locator('#hash-generator-input').fill('hello');
    await page.locator('[data-copy-target="hash-generator-md5"]').click();

    await expect(page.locator('#hash-generator-status')).toHaveText('Copied');
  });

  test('用語解説（Glossary）セクションが英語で表示される', async ({ page }) => {
    await page.goto('/en/tools/hash-generator/');

    await expect(
      page.getByRole('heading', { level: 2, name: 'Glossary' }),
    ).toBeVisible();
  });
});
