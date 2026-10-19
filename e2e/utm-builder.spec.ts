import { test, expect } from './helpers/test';

test.describe('UTMビルダー（日本語版）', () => {
  test('プリセットと入力からUTM付きURLを生成し、既存クエリとハッシュを保つ', async ({
    page,
  }) => {
    await page.goto('/tools/utm-builder/');

    await page
      .locator('#utm-builder-urls')
      .fill('https://example.com/lp?a=1#top');
    await page.getByRole('button', { name: 'google / cpc' }).click();
    await page.getByRole('button', { name: 'spring_sale' }).click();

    await expect(page.locator('#utm-builder-output')).toHaveValue(
      'https://example.com/lp?a=1&utm_source=google&utm_medium=cpc&utm_campaign=spring_sale#top',
    );
    await expect(page.locator('#utm-builder-missing')).toBeHidden();
  });

  test('複数URLを一括生成し、不正な行はエラー表示される', async ({ page }) => {
    await page.goto('/tools/utm-builder/');

    await page
      .locator('#utm-builder-urls')
      .fill('https://a.example/\nexample.com/x\nhttps://b.example/');
    await page.locator('#utm-builder-source').fill('News');
    await page.locator('#utm-builder-lowercase').check();

    await expect(page.locator('#utm-builder-output')).toHaveValue(
      'https://a.example/?utm_source=news\nhttps://b.example/?utm_source=news',
    );
    await expect(page.locator('#utm-builder-errors li')).toHaveCount(1);
    await expect(page.locator('#utm-builder-errors')).toContainText('行 2');
    await expect(page.locator('#utm-builder-missing')).toBeVisible();
  });

  test('コピーすると履歴に保存され、読み込める', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/utm-builder/');

    await page.locator('#utm-builder-urls').fill('https://example.com/');
    await page.locator('#utm-builder-source').fill('x');
    await page.locator('#utm-builder-medium').fill('social');
    await page.locator('#utm-builder-copy-button').click();
    await expect(page.locator('#utm-builder-status')).toContainText(
      'コピーしました',
    );
    await expect(page.locator('#utm-builder-history > li')).toHaveCount(1);

    await page.reload();
    await expect(page.locator('#utm-builder-history > li')).toHaveCount(1);
    await page.getByRole('button', { name: '読み込む' }).click();
    await expect(page.locator('#utm-builder-source')).toHaveValue('x');

    await page.getByRole('button', { name: '履歴を消去' }).click();
    await expect(page.locator('#utm-builder-history > li')).toHaveCount(0);
  });
});

test.describe('UTM Builder (English)', () => {
  test('英語版でUTM付きURLを生成できる', async ({ page }) => {
    await page.goto('/en/tools/utm-builder/');

    await page.locator('#utm-builder-urls').fill('https://example.com/');
    await page.locator('#utm-builder-campaign').fill('launch');
    await expect(page.locator('#utm-builder-output')).toHaveValue(
      'https://example.com/?utm_campaign=launch',
    );
  });
});
