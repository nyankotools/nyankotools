import { test, expect } from './helpers/test';

test.describe('Unicode装飾文字変換ツール', () => {
  test('入力した英数字が各スタイルに変換される', async ({ page }) => {
    await page.goto('/tools/unicode-decorator/');
    await page.locator('#ud-input').fill('Ab1 こんにちは');
    const row = (style: string) =>
      page.locator(`#ud-list [data-style="${style}"] .ud-output`);
    await expect(row('bold')).toHaveText('𝐀𝐛𝟏 こんにちは');
    await expect(row('circled')).toHaveText('Ⓐⓑ① こんにちは');
    await expect(row('fullwidth')).toHaveText('Ａｂ１　こんにちは');
  });

  test('入力が空のときは見本を薄く表示し、コピーを無効にする', async ({
    page,
  }) => {
    await page.goto('/tools/unicode-decorator/');
    await expect(
      page.locator('#ud-list [data-style="bold"] .ud-copy'),
    ).toBeDisabled();
    await page.locator('#ud-input').fill('x');
    await expect(
      page.locator('#ud-list [data-style="bold"] .ud-copy'),
    ).toBeEnabled();
  });

  test('コピーボタンで完了メッセージが出る', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/unicode-decorator/');
    await page.locator('#ud-input').fill('Hi');
    await page.locator('#ud-list [data-style="bold"] .ud-copy').click();
    await expect(page.locator('#ud-status')).toHaveText('コピーしました');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      '𝐇𝐢',
    );
  });

  test('英語版が表示される', async ({ page }) => {
    await page.goto('/en/tools/unicode-decorator/');
    await expect(page.locator('main h1')).toContainText('Decorator');
    await page.locator('#ud-input').fill('a');
    await expect(
      page.locator('#ud-list [data-style="monospace"] .ud-output'),
    ).toHaveText('𝚊');
  });
});
