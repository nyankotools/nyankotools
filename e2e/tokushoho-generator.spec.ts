import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test('特定商取引法の表記: 初期表示でaxeの違反がない', async ({ page }) => {
  for (const path of [
    '/tools/tokushoho-generator/',
    '/en/tools/tokushoho-generator/',
  ]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(
      results.violations.map((v) => v.id),
      path,
    ).toEqual([]);
  }
});

const paths = [
  { path: '/tools/tokushoho-generator/', copied: 'コピーしました' },
  { path: '/en/tools/tokushoho-generator/', copied: 'Copied' },
];

for (const { path, copied } of paths) {
  test.describe(`特定商取引法に基づく表記 ${path}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('#tkg-output')).toHaveValue(/【販売業者】/);
    });

    test('未入力の項目は【要記入】で出力され、確認事項にエラーが出る', async ({
      page,
    }) => {
      await expect(page.locator('#tkg-output')).toHaveValue(/【要記入】/);
      await expect(page.locator('#tkg-issues li').first()).toBeVisible();
    });

    test('入力した内容がテキストに反映される', async ({ page }) => {
      await page.locator('#tkg-f-seller').fill('猫野商店');
      await page.locator('#tkg-f-email').fill('info@example.com');
      await expect(page.locator('#tkg-output')).toHaveValue(
        /【販売業者】\n猫野商店\n/,
      );
      await expect(page.locator('#tkg-output')).toHaveValue(
        /【メールアドレス】\ninfo@example\.com\n/,
      );
    });

    test('住所・電話番号を非公開にすると定型文になる', async ({ page }) => {
      await page.locator('#tkg-hide-address').check();
      await page.locator('#tkg-hide-phone').check();
      await expect(page.locator('#tkg-output')).toHaveValue(
        /【所在地】\n請求があった場合には遅滞なく開示します。/,
      );
      await expect(page.locator('#tkg-output')).toHaveValue(
        /【電話番号】\n請求があった場合には遅滞なく開示します。/,
      );
      await expect(page.locator('#tkg-f-address')).toBeDisabled();
    });

    test('定型文を挿入できる', async ({ page }) => {
      await page.locator('[data-tkg-preset="returns"]').first().click();
      await expect(page.locator('#tkg-f-returns')).toHaveValue(/返品/);
      await expect(page.locator('#tkg-output')).toHaveValue(/返品/);
    });

    test('出力形式をMarkdownとHTMLに切り替えられる', async ({ page }) => {
      await page.locator('#tkg-format').selectOption('markdown');
      await expect(page.locator('#tkg-output')).toHaveValue(
        /^\| 項目 \| 内容 \|/,
      );
      await page.locator('#tkg-format').selectOption('html');
      await expect(page.locator('#tkg-output')).toHaveValue(/^<table>/);
    });

    test('コピーできる', async ({ page, context }) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      await page.locator('#tkg-copy-button').click();
      await expect(page.locator('#tkg-status')).toHaveText(copied);
    });

    test('形式に応じた拡張子でダウンロードできる', async ({ page }) => {
      const [txt] = await Promise.all([
        page.waitForEvent('download'),
        page.locator('#tkg-download-button').click(),
      ]);
      expect(txt.suggestedFilename()).toBe('tokushoho.txt');

      await page.locator('#tkg-format').selectOption('html');
      const [html] = await Promise.all([
        page.waitForEvent('download'),
        page.locator('#tkg-download-button').click(),
      ]);
      expect(html.suggestedFilename()).toBe('tokushoho.html');
    });
  });
}
