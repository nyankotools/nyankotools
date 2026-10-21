import { test, expect } from './helpers/test';

test.describe('パスポート用ローマ字氏名変換ツール', () => {
  test('姓名をパスポート表記に変換し、OH表記・並び順を切り替えられる', async ({
    page,
  }) => {
    await page.goto('/tools/passport-romaji-converter/');
    await page.locator('#passport-surname').fill('おおの');
    await page.locator('#passport-given').fill('じゅんいち');
    await expect(page.locator('#passport-result-surname')).toHaveText('ONO');
    await expect(page.locator('#passport-result-given')).toHaveText('JUNICHI');
    await expect(page.locator('#passport-result-full')).toHaveText(
      'ONO JUNICHI',
    );

    await page.locator('#passport-long-vowel [data-value="oh"]').click();
    await expect(page.locator('#passport-result-surname')).toHaveText('OHNO');

    await page.locator('#passport-order [data-value="given-first"]').click();
    await expect(page.locator('#passport-result-full')).toHaveText(
      'JUNICHI OHNO',
    );
  });

  test('「ん」はB・M・Pの前でMになる', async ({ page }) => {
    await page.goto('/tools/passport-romaji-converter/');
    await page.locator('#passport-surname').fill('なんば');
    await expect(page.locator('#passport-result-surname')).toHaveText('NAMBA');
  });

  test('漢字を入力すると警告が出る', async ({ page }) => {
    await page.goto('/tools/passport-romaji-converter/');
    await expect(page.locator('#passport-warning')).toBeHidden();
    await page.locator('#passport-surname').fill('佐藤');
    await expect(page.locator('#passport-warning')).toBeVisible();
    await expect(page.locator('#passport-warning')).toContainText('佐');
  });

  test('英語版が表示される', async ({ page }) => {
    await page.goto('/en/tools/passport-romaji-converter/');
    await expect(page.locator('main h1')).toContainText('Passport');
    await page.locator('#passport-surname').fill('いとう');
    await expect(page.locator('#passport-result-surname')).toHaveText('ITO');
  });
});
