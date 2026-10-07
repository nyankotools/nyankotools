import { test, expect } from './helpers/test';
import { blockAnalytics } from './helpers/block-analytics';

const FIREFOX_WIN =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0';

test.describe('User-Agent解析（日本語版）', () => {
  test('自分のUAが自動表示され、判定結果が空欄でない', async ({ browser }) => {
    const context = await browser.newContext({ userAgent: FIREFOX_WIN });
    await blockAnalytics(context);
    const page = await context.newPage();
    await page.goto('/tools/user-agent-parser/');

    await expect(page.locator('#ua-own-string')).toHaveText(FIREFOX_WIN);
    await expect(page.locator('#ua-own-browser')).toHaveText('Firefox 121.0');
    await expect(page.locator('#ua-own-engine')).toHaveText('Gecko 121.0');
    await expect(page.locator('#ua-own-os')).toHaveText('Windows 10 / 11');
    await expect(page.locator('#ua-own-device')).toHaveText('デスクトップ');
    await context.close();
  });

  test('UA文字列を貼り付けると判定結果が表示される', async ({ page }) => {
    await page.goto('/tools/user-agent-parser/');
    await expect(page.locator('#ua-empty')).toBeVisible();

    await page
      .locator('#ua-input')
      .fill(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
      );

    await expect(page.locator('#ua-empty')).toBeHidden();
    await expect(page.locator('#ua-in-browser')).toHaveText('Safari 17.2');
    await expect(page.locator('#ua-in-os')).toHaveText('iOS 17.2');
    await expect(page.locator('#ua-in-device')).toHaveText(
      'モバイル（スマートフォン）',
    );
    await expect(page.locator('#ua-in-model')).toHaveText('iPhone');
  });

  test('解釈できない文字列は「不明」と表示される', async ({ page }) => {
    await page.goto('/tools/user-agent-parser/');
    await page.locator('#ua-input').fill('hello world');

    await expect(page.locator('#ua-in-browser')).toHaveText('不明');
    await expect(page.locator('#ua-in-os')).toHaveText('不明');
  });

  test('「自分のUAを入力」で入力欄に自分のUAが入る', async ({ page }) => {
    await page.goto('/tools/user-agent-parser/');
    const own = await page.locator('#ua-own-string').textContent();
    await page.locator('#ua-use-own').click();

    await expect(page.locator('#ua-input')).toHaveValue(own ?? '');
    await expect(page.locator('#ua-in-table')).toBeVisible();
  });
});

test.describe('User-Agent Parser (English)', () => {
  test('英語版で判定結果が英語表記になる', async ({ page }) => {
    await page.goto('/en/tools/user-agent-parser/');
    await page
      .locator('#ua-input')
      .fill(
        'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36',
      );

    await expect(page.locator('#ua-in-browser')).toHaveText(
      'Chrome 120.0.6099.144',
    );
    await expect(page.locator('#ua-in-os')).toHaveText('Android 13');
    await expect(page.locator('#ua-in-device')).toHaveText(
      'Mobile (smartphone)',
    );
    await expect(page.locator('#ua-in-model')).toHaveText('Pixel 7');
  });
});
