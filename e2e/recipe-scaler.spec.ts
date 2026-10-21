import { test, expect } from './helpers/test';

test.describe('レシピ人数換算', () => {
  test('2人分→4人分に換算され、数値のない行はそのまま残る', async ({
    page,
  }) => {
    await page.goto('/tools/recipe-scaler/');
    await page
      .locator('#rs-input')
      .fill('鶏もも肉 300g\n水 1と1/2カップ\n卵 2〜3個\n塩 少々');

    await expect(page.locator('#rs-output')).toHaveValue(
      '鶏もも肉 600g\n水 3カップ\n卵 4〜6個\n塩 少々',
    );
    await expect(page.locator('#rs-summary')).toContainText('倍率 2 倍');
  });

  test('縮小すると分数に丸められ、丸め方を小数に切り替えられる', async ({
    page,
  }) => {
    await page.goto('/tools/recipe-scaler/');
    await page.locator('#rs-input').fill('玉ねぎ 1個');
    await page.locator('#rs-to').fill('1');
    await expect(page.locator('#rs-output')).toHaveValue('玉ねぎ 1/2個');

    // 既定の元人数は2。3人分は倍率1.5なので 1個 → 1.5個
    await page.locator('#rs-to').fill('3');
    await expect(page.locator('#rs-output')).toHaveValue('玉ねぎ 1と1/2個');
    await page.locator('#rs-rounding').selectOption('decimal');
    await expect(page.locator('#rs-output')).toHaveValue('玉ねぎ 1.5個');
  });

  test('人数が0だとエラーが表示される', async ({ page }) => {
    await page.goto('/tools/recipe-scaler/');
    await page.locator('#rs-input').fill('卵 1個');
    await page.locator('#rs-to').fill('0');

    await expect(page.locator('#rs-error')).toHaveText(
      '人数は0より大きい数値を入力してください',
    );
    await expect(page.locator('#rs-output')).toHaveValue('');
  });

  test('結果をコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/recipe-scaler/');
    await page.locator('#rs-input').fill('卵 1個');
    await expect(page.locator('#rs-output')).toHaveValue('卵 2個');

    await page.locator('#rs-copy-button').click();
    await expect(page.locator('#rs-status')).toHaveText('コピーしました');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      '卵 2個',
    );
  });

  test('英語ページでは帯分数が半角スペースで区切られる', async ({ page }) => {
    await page.goto('/en/tools/recipe-scaler/');
    await page.locator('#rs-input').fill('1 cup milk');
    await page.locator('#rs-to').fill('3');
    await page.locator('#rs-from').fill('2');

    await expect(page.locator('#rs-output')).toHaveValue('1 1/2 cup milk');
  });
});
