import { test, expect } from '@playwright/test';

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

test.describe('UUID生成ツール（日本語版）', () => {
  test('直接アクセスして正しく表示され、初期状態で5件のUUIDが生成される', async ({
    page,
  }) => {
    await page.goto('/tools/uuid-generator/');

    await expect(page.locator('main h1')).toHaveText('UUID生成（v4）');

    const output = page.locator('#uuid-generator-output');
    const lines = (await output.inputValue())
      .split('\n')
      .filter((line) => line.length > 0);
    expect(lines).toHaveLength(5);
    for (const line of lines) {
      expect(line).toMatch(UUID_V4_REGEX);
    }
  });

  test('生成する個数を指定して再生成できる', async ({ page }) => {
    await page.goto('/tools/uuid-generator/');

    await page.locator('#uuid-generator-count').fill('3');
    await page.locator('#uuid-generator-generate-button').click();

    const lines = (await page.locator('#uuid-generator-output').inputValue())
      .split('\n')
      .filter((line) => line.length > 0);
    expect(lines).toHaveLength(3);
  });

  test('100を超える個数を指定すると100件にクランプされる', async ({ page }) => {
    await page.goto('/tools/uuid-generator/');

    const countInput = page.locator('#uuid-generator-count');
    await countInput.fill('9999');
    await countInput.dispatchEvent('change');

    await expect(countInput).toHaveValue('100');
    const lines = (await page.locator('#uuid-generator-output').inputValue())
      .split('\n')
      .filter((line) => line.length > 0);
    expect(lines).toHaveLength(100);
  });

  test('ハイフンなし・大文字オプションを組み合わせて生成できる', async ({
    page,
  }) => {
    await page.goto('/tools/uuid-generator/');

    await page.locator('#uuid-generator-count').fill('1');
    await page.locator('#uuid-generator-remove-hyphens').check();
    await page.locator('#uuid-generator-uppercase').check();
    await page.locator('#uuid-generator-generate-button').click();

    const value = (
      await page.locator('#uuid-generator-output').inputValue()
    ).trim();
    expect(value).toMatch(/^[0-9A-F]{32}$/);
  });

  test('コピーボタンで結果をクリップボードにコピーできる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/uuid-generator/');

    const output = await page.locator('#uuid-generator-output').inputValue();
    await page.locator('#uuid-generator-copy-button').click();

    await expect(page.locator('#uuid-generator-status')).toHaveText(
      'コピーしました',
    );
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    // Windowsのクリップボードは改行をCRLFに正規化することがあるため、
    // 比較前にLFへ統一する。
    expect(clipboardText.replace(/\r\n/g, '\n')).toBe(
      output.replace(/\r\n/g, '\n'),
    );
  });
});

test.describe('UUID Generator (English)', () => {
  test('英語版が正しく表示され、UUIDが生成される', async ({ page }) => {
    await page.goto('/en/tools/uuid-generator/');

    await expect(page.locator('main h1')).toHaveText('UUID Generator (v4)');

    const lines = (await page.locator('#uuid-generator-output').inputValue())
      .split('\n')
      .filter((line) => line.length > 0);
    expect(lines).toHaveLength(5);
  });

  test('コピーボタンで結果をクリップボードにコピーでき、英語のメッセージが表示される', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/en/tools/uuid-generator/');

    await page.locator('#uuid-generator-copy-button').click();
    await expect(page.locator('#uuid-generator-status')).toHaveText('Copied');
  });
});
