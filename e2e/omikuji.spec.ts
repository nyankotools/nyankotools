import { test, expect } from './helpers/test';

test.describe('おみくじ・今日の運勢ツール', () => {
  test('今日の運勢は同じ名前なら何度引いても同じ結果になる', async ({
    page,
  }) => {
    await page.goto('/tools/omikuji/');
    await page.locator('#omikuji-name').fill('にゃんこ');
    await page.locator('#omikuji-draw-button').click();
    await expect(page.locator('#omikuji-result')).toBeVisible();
    const first = await page.locator('#omikuji-result').innerText();
    await page.locator('#omikuji-draw-button').click();
    expect(await page.locator('#omikuji-result').innerText()).toBe(first);
    await expect(page.locator('#omikuji-heading')).toHaveText(
      'にゃんこさんのおみくじ',
    );
    await expect(page.locator('#omikuji-items > div')).toHaveCount(6);
  });

  test('引き直しモードでは名前欄が隠れ、運勢が表示される', async ({ page }) => {
    await page.goto('/tools/omikuji/');
    await page.locator('#omikuji-mode [data-mode="redraw"]').click();
    await expect(page.locator('#omikuji-name')).toBeHidden();
    await page.locator('#omikuji-draw-button').click();
    await expect(page.locator('#omikuji-fortune')).toHaveText(
      /^(大吉|吉|中吉|小吉|末吉|凶|大凶)$/,
    );
    await expect(page.locator('#omikuji-lucky')).toContainText(
      'ラッキーカラー',
    );
  });

  test('英語版でも結果が表示される', async ({ page }) => {
    await page.goto('/en/tools/omikuji/');
    await page.locator('#omikuji-draw-button').click();
    await expect(page.locator('#omikuji-result')).toBeVisible();
    await expect(page.locator('#omikuji-lucky')).toContainText('Lucky color');
  });
});
