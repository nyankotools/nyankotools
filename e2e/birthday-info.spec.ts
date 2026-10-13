import { test, expect } from './helpers/test';

test.describe('誕生日情報ツール（日本語版）', () => {
  test('生年月日から干支・星座・誕生石・曜日が表示される', async ({ page }) => {
    await page.goto('/tools/birthday-info/');

    await page.locator('#birthday-info-year').fill('1990');
    await page.locator('#birthday-info-month').fill('5');
    await page.locator('#birthday-info-day').fill('5');

    await expect(page.locator('#birthday-info-eto')).toHaveText('午（うま）');
    await expect(page.locator('#birthday-info-sexagenary')).toHaveText('庚午');
    await expect(page.locator('#birthday-info-zodiac')).toHaveText('牡牛座');
    await expect(page.locator('#birthday-info-birthstone')).toHaveText(
      'エメラルド',
    );
    await expect(page.locator('#birthday-info-weekday')).toHaveText('土曜日');
  });

  test('実在しない日付ではエラーが表示され結果が隠れる', async ({ page }) => {
    await page.goto('/tools/birthday-info/');

    await page.locator('#birthday-info-year').fill('2001');
    await page.locator('#birthday-info-month').fill('2');
    await page.locator('#birthday-info-day').fill('29');

    await expect(page.locator('#birthday-info-error')).not.toBeEmpty();
    await expect(page.locator('#birthday-info-results')).toBeHidden();
  });
});

test.describe('Birthday Info (English)', () => {
  test('英名で表示される', async ({ page }) => {
    await page.goto('/en/tools/birthday-info/');

    await page.locator('#birthday-info-year').fill('2000');
    await page.locator('#birthday-info-month').fill('2');
    await page.locator('#birthday-info-day').fill('29');

    await expect(page.locator('#birthday-info-eto')).toHaveText('Dragon');
    await expect(page.locator('#birthday-info-sexagenary')).toHaveText(
      'Yang Metal Dragon',
    );
    await expect(page.locator('#birthday-info-zodiac')).toHaveText('Pisces');
    await expect(page.locator('#birthday-info-birthstone')).toHaveText(
      'Amethyst',
    );
    await expect(page.locator('#birthday-info-weekday')).toHaveText('Tuesday');
  });
});
