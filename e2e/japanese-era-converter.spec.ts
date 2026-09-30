import { test, expect } from './helpers/test';

test.describe('和暦⇔西暦変換（日本語版）', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/tools/japanese-era-converter/');
    await expect(page.locator('main h1')).toHaveText('和暦⇔西暦変換');
  });

  test('西暦→和暦の変換ができる', async ({ page }) => {
    await page.goto('/tools/japanese-era-converter/');

    await page.locator('#era-w2j-year').fill('2024');
    await page.locator('#era-w2j-month').fill('6');
    await page.locator('#era-w2j-day').fill('15');

    await expect(page.locator('#era-w2j-result')).toHaveText('令和6年');
    await expect(page.locator('#era-w2j-error')).toBeEmpty();
  });

  test('和暦→西暦の変換ができる', async ({ page }) => {
    await page.goto('/tools/japanese-era-converter/');

    await page.locator('#era-j2w-era').selectOption('令和');
    await page.locator('#era-j2w-year').fill('6');
    await page.locator('#era-j2w-month').fill('6');
    await page.locator('#era-j2w-day').fill('15');

    await expect(page.locator('#era-j2w-result')).toHaveText(
      '西暦2024年6月15日',
    );
    await expect(page.locator('#era-j2w-error')).toBeEmpty();
  });

  test('昭和→平成の改元日をまたぐ境界日付を正しく判定する', async ({
    page,
  }) => {
    await page.goto('/tools/japanese-era-converter/');
    const yearInput = page.locator('#era-w2j-year');
    const monthInput = page.locator('#era-w2j-month');
    const dayInput = page.locator('#era-w2j-day');
    const resultEl = page.locator('#era-w2j-result');

    await yearInput.fill('1989');
    await monthInput.fill('1');
    await dayInput.fill('7');
    await expect(resultEl).toHaveText('昭和64年');

    await dayInput.fill('8');
    await expect(resultEl).toHaveText('平成元年');
  });

  test('平成→令和の改元日をまたぐ境界日付を正しく判定する', async ({
    page,
  }) => {
    await page.goto('/tools/japanese-era-converter/');
    const yearInput = page.locator('#era-w2j-year');
    const monthInput = page.locator('#era-w2j-month');
    const dayInput = page.locator('#era-w2j-day');
    const resultEl = page.locator('#era-w2j-result');

    await yearInput.fill('2019');
    await monthInput.fill('4');
    await dayInput.fill('30');
    await expect(resultEl).toHaveText('平成31年');

    await monthInput.fill('5');
    await dayInput.fill('1');
    await expect(resultEl).toHaveText('令和元年');
  });

  test('存在しない日付を入力するとエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/japanese-era-converter/');

    await page.locator('#era-j2w-era').selectOption('令和');
    await page.locator('#era-j2w-year').fill('6');
    await page.locator('#era-j2w-month').fill('2');
    await page.locator('#era-j2w-day').fill('30');

    await expect(page.locator('#era-j2w-error')).toHaveText(
      '変換できませんでした（存在しない日付か、その元号の期間外の日付です）',
    );
    await expect(page.locator('#era-j2w-result')).toBeEmpty();
  });

  test('元号の範囲外の年を入力するとエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/japanese-era-converter/');

    // 昭和は64年（1月7日）までで、65年は存在しない
    await page.locator('#era-j2w-era').selectOption('昭和');
    await page.locator('#era-j2w-year').fill('65');
    await page.locator('#era-j2w-month').fill('1');
    await page.locator('#era-j2w-day').fill('1');

    await expect(page.locator('#era-j2w-error')).toHaveText(
      '変換できませんでした（存在しない日付か、その元号の期間外の日付です）',
    );
    await expect(page.locator('#era-j2w-result')).toBeEmpty();
  });

  test('明治より前の日付を入力するとエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/japanese-era-converter/');

    await page.locator('#era-w2j-year').fill('1800');
    await page.locator('#era-w2j-month').fill('1');
    await page.locator('#era-w2j-day').fill('1');

    await expect(page.locator('#era-w2j-error')).toHaveText(
      '変換できませんでした（明治元年1868年1月25日以降の日付を指定してください）',
    );
    await expect(page.locator('#era-w2j-result')).toBeEmpty();
  });
});

test.describe('Japanese Era Converter (English)', () => {
  test('英語版が正しく表示され、変換できる', async ({ page }) => {
    await page.goto('/en/tools/japanese-era-converter/');
    await expect(page.locator('main h1')).toHaveText('Japanese Era Converter');

    await page.locator('#era-w2j-year').fill('2024');
    await page.locator('#era-w2j-month').fill('6');
    await page.locator('#era-w2j-day').fill('15');
    await expect(page.locator('#era-w2j-result')).toHaveText('Reiwa 6');

    await page.locator('#era-j2w-era').selectOption('令和');
    await page.locator('#era-j2w-year').fill('6');
    await page.locator('#era-j2w-month').fill('6');
    await page.locator('#era-j2w-day').fill('15');
    await expect(page.locator('#era-j2w-result')).toHaveText('2024-06-15');
  });
});
