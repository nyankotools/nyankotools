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

test.describe('Preview image message (shared across locales)', () => {
  test('Japanese version displays "画像は表示されません" message at initial state', async ({
    page,
  }) => {
    await page.goto('/tools/meta-tag-generator/');
    await page.waitForFunction(
      () => document.getElementById('mtg-title') !== null,
    );

    // Check that the fixed message "画像は表示されません" is displayed
    const previewImageNotShown = page.locator('text=画像は表示されません');
    await expect(previewImageNotShown).toBeVisible();
  });

  test('Japanese version still shows message after entering OGP image URL', async ({
    page,
  }) => {
    await page.goto('/tools/meta-tag-generator/');
    await page.waitForFunction(
      () => document.getElementById('mtg-title') !== null,
    );

    // Enter an OGP image URL
    await page.locator('#mtg-image-url').fill('https://example.com/image.png');

    // The fixed message should still be visible
    const previewImageNotShown = page.locator('text=画像は表示されません');
    await expect(previewImageNotShown).toBeVisible();

    // Also verify the URL is shown in the preview area (as text, not as an actual image)
    const previewLabel = page.locator('#mtg-preview-image-label');
    await expect(previewLabel).toContainText('https://example.com/image.png');
  });

  test('English version displays "Image not shown" message at initial state', async ({
    page,
  }) => {
    await page.goto('/en/tools/meta-tag-generator/');
    await page.waitForFunction(
      () => document.getElementById('mtg-title') !== null,
    );

    // Check that the fixed message "Image not shown" is displayed
    const previewImageNotShown = page.locator('text=Image not shown');
    await expect(previewImageNotShown).toBeVisible();
  });

  test('English version still shows message after entering OGP image URL', async ({
    page,
  }) => {
    await page.goto('/en/tools/meta-tag-generator/');
    await page.waitForFunction(
      () => document.getElementById('mtg-title') !== null,
    );

    // Enter an OGP image URL
    await page.locator('#mtg-image-url').fill('https://example.com/image.png');

    // The fixed message should still be visible
    const previewImageNotShown = page.locator('text=Image not shown');
    await expect(previewImageNotShown).toBeVisible();

    // Also verify the URL is shown in the preview area
    const previewLabel = page.locator('#mtg-preview-image-label');
    await expect(previewLabel).toContainText('https://example.com/image.png');
  });

  test('Preview layout does not break at narrow width (375px)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/tools/meta-tag-generator/');
    await page.waitForFunction(
      () => document.getElementById('mtg-title') !== null,
    );

    // Verify that the fixed message is still visible
    const previewImageNotShown = page.locator('text=画像は表示されません');
    await expect(previewImageNotShown).toBeVisible();

    // Verify the layout does not break (check that the preview area is visible)
    const previewSection = page
      .locator('text=シェアプレビュー')
      .locator('..')
      .first();
    await expect(previewSection).toBeVisible();

    // Enter an OGP image URL
    await page.locator('#mtg-image-url').fill('https://example.com/image.png');

    // Verify layout is still OK with the URL displayed
    await expect(previewImageNotShown).toBeVisible();
    await expect(page.locator('#mtg-preview-image-label')).toContainText(
      'https://example.com/image.png',
    );
  });
});
