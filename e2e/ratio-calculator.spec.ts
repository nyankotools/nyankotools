import { test, expect } from '@playwright/test';

test.describe('割合・比率計算機', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/tools/ratio-calculator/');
    await expect(page.locator('main h1')).toHaveText('割合・比率計算機');
  });

  test('初期表示時点で4:6が2:3に約分される', async ({ page }) => {
    await page.goto('/tools/ratio-calculator/');

    await expect(page.locator('#ratio-result')).toHaveText('2 : 3');
    await expect(page.locator('#ratio-results')).toBeVisible();
  });

  test('比の簡略化：小数を含む比も約分できる', async ({ page }) => {
    await page.goto('/tools/ratio-calculator/');

    await page.locator('#ratio-input-a').fill('1.5');
    await page.locator('#ratio-input-b').fill('2');

    await expect(page.locator('#ratio-result')).toHaveText('3 : 4');
  });

  test('比の簡略化：Aが0のときエラーが表示される', async ({ page }) => {
    await page.goto('/tools/ratio-calculator/');

    await page.locator('#ratio-input-a').fill('0');

    await expect(page.locator('#ratio-error')).toHaveText(
      '計算できませんでした（A・Bは0より大きい値を入力してください）'
    );
    await expect(page.locator('#ratio-results')).toBeHidden();
  });

  test('比の簡略化：Bが0のときエラーが表示される', async ({ page }) => {
    await page.goto('/tools/ratio-calculator/');

    await page.locator('#ratio-input-b').fill('0');

    await expect(page.locator('#ratio-error')).toHaveText(
      '計算できませんでした（A・Bは0より大きい値を入力してください）'
    );
    await expect(page.locator('#ratio-results')).toBeHidden();
  });

  test('比の簡略化：Aが負のときエラーが表示される', async ({ page }) => {
    await page.goto('/tools/ratio-calculator/');

    await page.locator('#ratio-input-a').fill('-4');

    await expect(page.locator('#ratio-error')).toHaveText(
      '計算できませんでした（A・Bは0より大きい値を入力してください）'
    );
    await expect(page.locator('#ratio-results')).toBeHidden();
  });

  test('比の簡略化：入力を空にすると結果・エラーも表示されない', async ({
    page,
  }) => {
    await page.goto('/tools/ratio-calculator/');

    await page.locator('#ratio-input-a').fill('');

    await expect(page.locator('#ratio-error')).toHaveText('');
    await expect(page.locator('#ratio-results')).toBeHidden();
  });

  test('初期表示時点で比例式は3:4=6:dでd=8に計算される', async ({
    page,
  }) => {
    await page.goto('/tools/ratio-calculator/');

    await expect(page.locator('#proportion-result')).toHaveText('D = 8');
    await expect(page.locator('#proportion-results')).toBeVisible();
  });

  test('比例式：未知項をAに切り替えると計算される', async ({ page }) => {
    await page.goto('/tools/ratio-calculator/');

    await page.locator('input[name="proportion-unknown"][value="a"]').check();
    // a is now disabled, so fill b, c, d
    await page.locator('#proportion-input-b').fill('4');
    await page.locator('#proportion-input-c').fill('6');
    await page.locator('#proportion-input-d').fill('8');

    await expect(page.locator('#proportion-result')).toHaveText('A = 3');
  });

  test('比例式：未知項をBに切り替えると計算される', async ({ page }) => {
    await page.goto('/tools/ratio-calculator/');

    await page.locator('input[name="proportion-unknown"][value="b"]').check();
    // b is now disabled, so fill a, c, d
    await page.locator('#proportion-input-a').fill('3');
    await page.locator('#proportion-input-c').fill('6');
    await page.locator('#proportion-input-d').fill('8');

    await expect(page.locator('#proportion-result')).toHaveText('B = 4');
  });

  test('比例式：未知項をCに切り替えると計算される', async ({ page }) => {
    await page.goto('/tools/ratio-calculator/');

    await page.locator('input[name="proportion-unknown"][value="c"]').check();
    // c is now disabled, so fill a, b, d
    await page.locator('#proportion-input-a').fill('3');
    await page.locator('#proportion-input-b').fill('4');
    await page.locator('#proportion-input-d').fill('8');

    await expect(page.locator('#proportion-result')).toHaveText('C = 6');
  });

  test('比例式：Aを未知にして他の値を入力すると計算される', async ({
    page,
  }) => {
    await page.goto('/tools/ratio-calculator/');

    await page.locator('input[name="proportion-unknown"][value="a"]').check();
    await page.locator('#proportion-input-b').fill('6');
    await page.locator('#proportion-input-c').fill('8');
    await page.locator('#proportion-input-d').fill('9');

    // a:6 = 8:9 => a = 48/9 = 5.3333
    await expect(page.locator('#proportion-result')).toHaveText('A = 5.3333');
  });

  test('比例式：未知項以外すべてが入力されていないと何も表示されない', async ({
    page,
  }) => {
    await page.goto('/tools/ratio-calculator/');

    await page.locator('input[name="proportion-unknown"][value="a"]').check();
    // Clear one of the required fields
    await page.locator('#proportion-input-c').fill('');

    await expect(page.locator('#proportion-error')).toHaveText('');
    await expect(page.locator('#proportion-results')).toBeHidden();
  });

  test('比例式：既知の値に0が含まれるとエラーが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/ratio-calculator/');

    await page.locator('input[name="proportion-unknown"][value="a"]').check();
    await page.locator('#proportion-input-b').fill('4');
    await page.locator('#proportion-input-c').fill('6');
    await page.locator('#proportion-input-d').fill('0');

    await expect(page.locator('#proportion-error')).toHaveText(
      '計算できませんでした（空欄以外の3項に0より大きい値を入力してください）'
    );
    await expect(page.locator('#proportion-results')).toBeHidden();
  });

  test('割合の計算：初期表示時点で部分25・全体200で割合12.5%が計算される', async ({
    page,
  }) => {
    await page.goto('/tools/ratio-calculator/');

    await expect(page.locator('#percent-result')).toHaveText('12.5%');
    await expect(page.locator('#percent-results')).toBeVisible();
  });

  test('割合の計算：「全体の値と割合(%) → 部分の値」に切り替えられる', async ({
    page,
  }) => {
    await page.goto('/tools/ratio-calculator/');

    await page.getByRole('radio', { name: '全体の値と割合' }).check();

    await expect(page.locator('#percent-value1-label')).toHaveText('全体の値');
    await expect(page.locator('#percent-value2-label')).toHaveText('割合(%)');
    await expect(page.locator('#percent-result-label')).toHaveText('部分の値');
  });

  test('割合の計算：「全体の値と割合(%) → 部分の値」で200と12.5を入力すると25になる', async ({
    page,
  }) => {
    await page.goto('/tools/ratio-calculator/');

    await page.getByRole('radio', { name: '全体の値と割合' }).check();
    await page.locator('#percent-input-value1').fill('200');
    await page.locator('#percent-input-value2').fill('12.5');

    await expect(page.locator('#percent-result')).toHaveText('25');
  });

  test('割合の計算：「部分の値と割合(%) → 全体の値」で25と12.5を入力すると200になる', async ({
    page,
  }) => {
    await page.goto('/tools/ratio-calculator/');

    await page.getByRole('radio', { name: '部分の値と割合' }).check();
    await page.locator('#percent-input-value1').fill('25');
    await page.locator('#percent-input-value2').fill('12.5');

    await expect(page.locator('#percent-result')).toHaveText('200');
  });

  test('割合の計算：「元の値と新しい値 → 増減率(%)」で100と120を入力すると20%になる', async ({
    page,
  }) => {
    await page.goto('/tools/ratio-calculator/');

    await page.getByRole('radio', { name: '元の値と新しい値' }).check();
    await page.locator('#percent-input-value1').fill('100');
    await page.locator('#percent-input-value2').fill('120');

    await expect(page.locator('#percent-result')).toHaveText('20%');
  });

  test('割合の計算：増減率モード - 減少の場合は負の値が表示される', async ({
    page,
  }) => {
    await page.goto('/tools/ratio-calculator/');

    await page.getByRole('radio', { name: '元の値と新しい値' }).check();
    await page.locator('#percent-input-value1').fill('200');
    await page.locator('#percent-input-value2').fill('150');

    await expect(page.locator('#percent-result')).toHaveText('-25%');
  });

  test('割合の計算：partToPercentで全体が0だとエラーが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/ratio-calculator/');

    await page.locator('#percent-input-value1').fill('25');
    await page.locator('#percent-input-value2').fill('0');

    await expect(page.locator('#percent-error')).toHaveText(
      '計算できませんでした（入力値を確認してください。割合(%)を求める場合は全体の値、増減率を求める場合は元の値を0より大きい値にしてください）'
    );
    await expect(page.locator('#percent-results')).toBeHidden();
  });

  test('割合の計算：partToPercentで部分が負だとエラーが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/ratio-calculator/');

    await page.locator('#percent-input-value1').fill('-25');
    await page.locator('#percent-input-value2').fill('200');

    await expect(page.locator('#percent-error')).toHaveText(
      '計算できませんでした（入力値を確認してください。割合(%)を求める場合は全体の値、増減率を求める場合は元の値を0より大きい値にしてください）'
    );
    await expect(page.locator('#percent-results')).toBeHidden();
  });

  test('割合の計算：changeRateで元の値が0だとエラーが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/ratio-calculator/');

    await page.getByRole('radio', { name: '元の値と新しい値' }).check();
    await page.locator('#percent-input-value1').fill('0');
    await page.locator('#percent-input-value2').fill('150');

    await expect(page.locator('#percent-error')).toHaveText(
      '計算できませんでした（入力値を確認してください。割合(%)を求める場合は全体の値、増減率を求める場合は元の値を0より大きい値にしてください）'
    );
    await expect(page.locator('#percent-results')).toBeHidden();
  });

  test('割合の計算：入力を空にすると結果・エラーも表示されない', async ({
    page,
  }) => {
    await page.goto('/tools/ratio-calculator/');

    await page.locator('#percent-input-value1').fill('');

    await expect(page.locator('#percent-error')).toHaveText('');
    await expect(page.locator('#percent-results')).toBeHidden();
  });

  test('英語ページにアクセスできる', async ({ page }) => {
    await page.goto('/en/tools/ratio-calculator/');
    await expect(page.locator('main h1')).toHaveText('Ratio & Percentage Calculator');
  });

  test('英語ページで初期値が計算される', async ({ page }) => {
    await page.goto('/en/tools/ratio-calculator/');

    await expect(page.locator('#ratio-result')).toHaveText('2 : 3');
  });
});
