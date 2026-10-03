import { test, expect } from './helpers/test';

test.describe('読了時間・原稿用紙換算', () => {
  test('日本語版: 500字で読了1分・原稿用紙2枚（切り上げ）', async ({
    page,
  }) => {
    await page.goto('/tools/reading-time-calculator/');
    await expect(page.locator('main h1')).toHaveText(
      '読了時間・原稿用紙換算ツール',
    );

    await page.locator('#rtc-input').fill('あ'.repeat(500));
    await expect(page.locator('#rtc-ja-chars')).toHaveText('500');
    await expect(page.locator('#rtc-non-space')).toHaveText('500');
    await expect(page.locator('#rtc-reading')).toHaveText('1分0秒');
    await expect(page.locator('#rtc-speaking')).toHaveText('1分40秒');
    await expect(page.locator('#rtc-manuscript-value')).toHaveText('1.3枚');
    await expect(page.locator('#rtc-manuscript-sub')).toContainText(
      '25行・切り上げて2枚',
    );
  });

  test('読む速さと原稿用紙の種類を変えると結果が更新される', async ({
    page,
  }) => {
    await page.goto('/tools/reading-time-calculator/');
    await page.locator('#rtc-input').fill('あ'.repeat(500));

    await page.locator('#rtc-ja-speed').fill('250');
    await expect(page.locator('#rtc-reading')).toHaveText('2分0秒');

    await page.locator('#rtc-manuscript').selectOption('200');
    await expect(page.locator('#rtc-manuscript-value')).toHaveText('2.5枚');
  });

  test('英語版: 英単語を数えて秒表示する', async ({ page }) => {
    await page.goto('/en/tools/reading-time-calculator/');
    await expect(page.locator('main h1')).toContainText('Reading Time');
    await page.locator('#rtc-en-speed').fill('60');
    await page.locator('#rtc-input').fill('one two three four five');
    await expect(page.locator('#rtc-en-words')).toHaveText('5');
    await expect(page.locator('#rtc-reading')).toHaveText('5 sec');
  });
});
