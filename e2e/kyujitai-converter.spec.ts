import { test, expect } from './helpers/test';

test.describe('旧字体⇔新字体変換ツール', () => {
  test('旧字体→新字体に変換し、変換した文字を一覧表示する', async ({
    page,
  }) => {
    await page.goto('/tools/kyujitai-converter/');
    await page.locator('#kyujitai-input').fill('國會 學校 體育 髙﨑橋');
    await expect(page.locator('#kyujitai-output')).toHaveValue(
      '国会 学校 体育 高崎橋',
    );
    await expect(page.locator('#kyujitai-changes')).toContainText('國→国');
    await expect(page.locator('#kyujitai-summary')).toContainText('6');
  });

  test('異体字の変換をオフにできる', async ({ page }) => {
    await page.goto('/tools/kyujitai-converter/');
    await page.locator('#kyujitai-variants').uncheck();
    await page.locator('#kyujitai-input').fill('髙橋');
    await expect(page.locator('#kyujitai-output')).toHaveValue('髙橋');
  });

  test('新字体→旧字体に切り替えられる（異体字オプションは隠れる）', async ({
    page,
  }) => {
    await page.goto('/tools/kyujitai-converter/');
    await page.locator('#kyujitai-mode [data-mode="toKyujitai"]').click();
    await expect(page.locator('#kyujitai-variants-wrap')).toBeHidden();
    await page.locator('#kyujitai-input').fill('国会 学校');
    await expect(page.locator('#kyujitai-output')).toHaveValue('國會 學校');
  });

  test('英語版が表示される', async ({ page }) => {
    await page.goto('/en/tools/kyujitai-converter/');
    await expect(page.locator('main h1')).toContainText('Kyujitai');
    await page.locator('#kyujitai-input').fill('體');
    await expect(page.locator('#kyujitai-output')).toHaveValue('体');
  });
});
