import { test, expect } from '@playwright/test';

test.describe('metaタグ・OGPタグ生成（日本語版）', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/tools/meta-tag-generator/');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('main h1')).toHaveText('metaタグ・OGPタグ生成');
  });

  test('ページが正常に読み込まれてフォーム要素が表示される', async ({
    page,
  }) => {
    await page.goto('/tools/meta-tag-generator/');
    // Wait for the script to be ready by checking if the title input element is available
    await page.waitForFunction(
      () => document.getElementById('mtg-title') !== null,
      { timeout: 5000 },
    );

    // Verify that key elements exist
    await expect(page.locator('#mtg-title')).toBeVisible();
    await expect(page.locator('#mtg-description')).toBeVisible();
    await expect(page.locator('#mtg-output')).toBeVisible();
  });

  test('タイトルを入力するとメタタグが生成される', async ({ page }) => {
    await page.goto('/tools/meta-tag-generator/');
    await page.waitForFunction(
      () => document.getElementById('mtg-title') !== null,
    );

    await page.locator('#mtg-title').fill('テストページ');

    const output = page.locator('#mtg-output');
    await expect(output).toHaveValue(/テストページ/);
  });

  test('タイトルと説明文でメタタグが生成される', async ({ page }) => {
    await page.goto('/tools/meta-tag-generator/');
    await page.waitForFunction(
      () => document.getElementById('mtg-title') !== null,
    );

    await page.locator('#mtg-title').fill('テスト');
    await page.locator('#mtg-description').fill('説明文');

    const output = page.locator('#mtg-output');
    await expect(output).toHaveValue(/テスト/);
    await expect(output).toHaveValue(/説明文/);
  });

  test('Twitter Cardタグが生成される', async ({ page }) => {
    await page.goto('/tools/meta-tag-generator/');
    await page.waitForFunction(
      () => document.getElementById('mtg-title') !== null,
    );

    await page.locator('#mtg-title').fill('ツイート用');
    await page.locator('#mtg-twitter-site').fill('nyankotools');

    const output = page.locator('#mtg-output');
    await expect(output).toHaveValue(/twitter:card/);
    await expect(output).toHaveValue(/@nyankotools/);
  });

  test('HTML特殊文字が自動的にエスケープされる', async ({ page }) => {
    await page.goto('/tools/meta-tag-generator/');
    await page.waitForFunction(
      () => document.getElementById('mtg-title') !== null,
    );

    await page.locator('#mtg-title').fill('"引用符" & <タグ>');

    const output = page.locator('#mtg-output');
    await expect(output).toHaveValue(/&quot;/);
    await expect(output).toHaveValue(/&amp;/);
    await expect(output).toHaveValue(/&lt;/);
    // Verify the malicious HTML is NOT in the output
    await expect(output).not.toHaveValue(/<タグ>/);
  });

  test('コピーボタンで出力をクリップボードにコピーできる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/meta-tag-generator/');
    await page.waitForFunction(
      () => document.getElementById('mtg-title') !== null,
    );

    await page.locator('#mtg-title').fill('コピーテスト');
    await page.locator('#mtg-copy-button').click();

    await expect(page.locator('#mtg-status')).toContainText('コピーしました');
  });

  test('Twitter Cardのタイプをsummaryに変更できる', async ({ page }) => {
    await page.goto('/tools/meta-tag-generator/');
    await page.waitForFunction(
      () => document.getElementById('mtg-title') !== null,
    );

    await page.locator('#mtg-title').fill('タイトル');
    await page.locator('#mtg-twitter-card').selectOption('summary');

    const output = page.locator('#mtg-output');
    await expect(output).toHaveValue(/summary[^_]/);
  });
});

test.describe('Meta Tag & OGP Generator (English)', () => {
  test('English version displays correctly', async ({ page }) => {
    await page.goto('/en/tools/meta-tag-generator/');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('main h1')).toHaveText(
      'Meta Tag & OGP Generator',
    );
  });

  test('Form elements are visible and ready', async ({ page }) => {
    await page.goto('/en/tools/meta-tag-generator/');
    await page.waitForFunction(
      () => document.getElementById('mtg-title') !== null,
    );

    await expect(page.locator('#mtg-title')).toBeVisible();
    await expect(page.locator('#mtg-output')).toBeVisible();
  });

  test('Generates meta tags from English input', async ({ page }) => {
    await page.goto('/en/tools/meta-tag-generator/');
    await page.waitForFunction(
      () => document.getElementById('mtg-title') !== null,
    );

    await page.locator('#mtg-title').fill('Test Page');
    await page.locator('#mtg-description').fill('Test description');

    const output = page.locator('#mtg-output');
    await expect(output).toHaveValue(/Test Page/);
    await expect(output).toHaveValue(/Test description/);
  });

  test('Escapes HTML special characters in English', async ({ page }) => {
    await page.goto('/en/tools/meta-tag-generator/');
    await page.waitForFunction(
      () => document.getElementById('mtg-title') !== null,
    );

    await page.locator('#mtg-title').fill('"Quote" & <Tag>');

    const output = page.locator('#mtg-output');
    await expect(output).toHaveValue(/&quot;/);
    await expect(output).toHaveValue(/&amp;/);
    await expect(output).toHaveValue(/&lt;/);
  });

  test('Copy button works in English version', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/en/tools/meta-tag-generator/');
    await page.waitForFunction(
      () => document.getElementById('mtg-title') !== null,
    );

    await page.locator('#mtg-title').fill('Copy test');
    await page.locator('#mtg-copy-button').click();

    await expect(page.locator('#mtg-status')).toContainText('Copied');
  });
});
