import { test, expect } from './helpers/test';

test.describe('英単語カタカナ変換ツール', () => {
  test('英文中の英単語だけをカタカナに変換し、内訳を表示する', async ({
    page,
  }) => {
    await page.goto('/tools/english-katakana-converter/');
    await page.locator('#ek-input').fill('これは nice school です USB');
    await expect(page.locator('#ek-output')).toHaveValue(
      'これは ナイス スクール です ユーエスビー',
    );
    await expect(page.locator('#ek-summary')).toContainText('3語');
  });

  test('略語の文字読みとヴの表記を切り替えられる', async ({ page }) => {
    await page.goto('/tools/english-katakana-converter/');
    await page.locator('#ek-input').fill('USB van');
    await expect(page.locator('#ek-output')).toHaveValue('ユーエスビー バン');

    await page.locator('#ek-vsound [data-value="vu"]').click();
    await expect(page.locator('#ek-output')).toHaveValue('ユーエスビー ヴァン');

    await page.locator('#ek-acronym').uncheck();
    await expect(page.locator('#ek-output')).not.toHaveValue(
      'ユーエスビー ヴァン',
    );
  });

  test('英語版が表示される', async ({ page }) => {
    await page.goto('/en/tools/english-katakana-converter/');
    await expect(page.locator('main h1')).toContainText('Katakana');
    await page.locator('#ek-input').fill('knife');
    await expect(page.locator('#ek-output')).toHaveValue('ナイフ');
  });
});
