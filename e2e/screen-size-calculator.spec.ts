import { test, expect } from './helpers/test';

test('画面サイズ計算機: 27インチ4Kの幅・高さ・PPIを表示する', async ({
  page,
}) => {
  await page.goto('/tools/screen-size-calculator/');

  await expect(page.locator('#sc-width')).toContainText('59.77 cm');
  await expect(page.locator('#sc-height')).toContainText('33.62 cm');
  await expect(page.locator('#sc-ppi')).toContainText('163.2');
});

test('画面サイズ計算機: 解像度プリセットで縦横比とPPIが追従する', async ({
  page,
}) => {
  await page.goto('/tools/screen-size-calculator/');

  await page.locator('#sc-res-preset').selectOption('2560x1600');

  await expect(page.locator('#sc-res-w')).toHaveValue('2560');
  await expect(page.locator('#sc-ratio-preset')).toHaveValue('16:10');
  await expect(page.locator('#sc-ratio-w')).toHaveValue('16');
  await expect(page.locator('#sc-ppi')).toContainText('111.8');
});

test('画面サイズ計算機: 0を入力するとエラーを表示する', async ({ page }) => {
  await page.goto('/tools/screen-size-calculator/');

  await page.locator('#sc-diagonal').fill('0');
  await expect(page.locator('#sc-screen-error')).not.toHaveText('');
  await expect(page.locator('#sc-width')).toHaveText('');
});

test('画面サイズ計算機: 結果をコピーできる', async ({ page }) => {
  await page.goto('/tools/screen-size-calculator/');

  await page.locator('#sc-copy-button').click();
  await expect(page.locator('#sc-copy-status')).toContainText(/.+/);
});

test('画面サイズ計算機: 幅×高さ(cm)から対角インチを求める', async ({
  page,
}) => {
  await page.goto('/tools/screen-size-calculator/');

  await page.locator('#sc-cm-w').fill('40');
  await page.locator('#sc-cm-h').fill('30');

  await expect(page.locator('#sc-diag')).toContainText('19.69');
  await expect(page.locator('#sc-nearest')).toContainText('4:3');

  await page.locator('#sc-cm-h').fill('-1');
  await expect(page.locator('#sc-size-error')).not.toHaveText('');
});

test('画面サイズ計算機: 英語版で計算できる', async ({ page }) => {
  await page.goto('/en/tools/screen-size-calculator/');

  await page.locator('#sc-diagonal').fill('32');
  await expect(page.locator('#sc-width')).toContainText('70.84 cm');
  await expect(page.locator('#sc-width')).toContainText('in)');
});

test('画面サイズ計算機: 解像度を変えると縦横比が解像度の比率に追従する', async ({
  page,
}) => {
  await page.goto('/tools/screen-size-calculator/');

  await page.locator('#sc-res-w').fill('2560');
  await page.locator('#sc-res-h').fill('1080');
  await expect(page.locator('#sc-ratio-w')).toHaveValue('64');
  await expect(page.locator('#sc-ratio-h')).toHaveValue('27');
  await expect(page.locator('#sc-ratio-preset')).toHaveValue('custom');
  await expect(page.locator('#sc-mismatch')).toBeHidden();
});

test('画面サイズ計算機: 縦横比を21:9にして再読み込みしても入力欄と結果が一致する', async ({
  page,
}) => {
  await page.goto('/tools/screen-size-calculator/');

  await page.locator('#sc-res-w').fill('2560');
  await page.locator('#sc-res-h').fill('1080');
  await page.locator('#sc-ratio-preset').selectOption('21:9');
  await expect(page.locator('#sc-ratio-w')).toHaveValue('21');
  await page.waitForFunction(
    () =>
      sessionStorage.getItem('nyanko:input:screen-size-calculator') !== null,
  );

  await page.reload();

  await expect(page.locator('#sc-res-w')).toHaveValue('2560');
  await expect(page.locator('#sc-ratio-w')).toHaveValue('21');
  await expect(page.locator('#sc-ratio-h')).toHaveValue('9');
  await expect(page.locator('#sc-ratio-preset')).toHaveValue('21:9');
  // 27インチ・21:9 の幅は 24.82 in（63.03 cm）
  await expect(page.locator('#sc-width')).toContainText('63.03 cm');
  await expect(page.locator('#sc-width')).toContainText('24.82 インチ');
});
