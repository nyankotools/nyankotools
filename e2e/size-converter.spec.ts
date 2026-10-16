import { test, expect } from './helpers/test';

test('サイズ変換: レディース服の9号がUS 4・UK 8・EU 36に換算される', async ({
  page,
}) => {
  await page.goto('/tools/size-converter/');
  await expect(page.locator('main h1')).toContainText('サイズ変換');

  await page.locator('#size-category-select').selectOption('womens-clothing');
  await page.locator('#size-value-select').selectOption('9');

  await expect(page.locator('#size-result [data-column="us"]')).toHaveText('4');
  await expect(page.locator('#size-result [data-column="uk"]')).toHaveText('8');
  await expect(page.locator('#size-result [data-column="eu"]')).toHaveText(
    '36',
  );
});

test('サイズ変換: 靴のUSサイズを基準に足長を逆引きできる', async ({ page }) => {
  await page.goto('/tools/size-converter/');

  await page.locator('#size-category-select').selectOption('mens-shoes');
  await page.locator('#size-column-select').selectOption('us');
  await page.locator('#size-value-select').selectOption('8');

  await expect(page.locator('#size-result [data-column="cm"]')).toHaveText(
    '26.0',
  );
});

test('サイズ変換: メンズ服は列名の上書きとUS基準の逆引きが効く', async ({
  page,
}) => {
  await page.goto('/tools/size-converter/');

  await page.locator('#size-category-select').selectOption('mens-clothing');
  await expect(
    page.locator('#size-column-select option[value="us"]'),
  ).toHaveText('US（チェスト inch）');

  await page.locator('#size-column-select').selectOption('us');
  await page.locator('#size-value-select').selectOption('38');

  await expect(page.locator('#size-result [data-column="alpha"]')).toHaveText(
    'L',
  );
  await expect(page.locator('#size-result [data-column="chest"]')).toHaveText(
    '97',
  );
  await expect(page.locator('#size-result [data-column="eu"]')).toHaveText(
    '48',
  );
});

test('サイズ変換: 英語版で指輪を換算できる', async ({ page }) => {
  await page.goto('/en/tools/size-converter/');

  await page.locator('#size-category-select').selectOption('ring');
  await page.locator('#size-value-select').selectOption('9');

  await expect(page.locator('#size-result [data-column="us"]')).toHaveText('5');
  await expect(page.locator('#size-result [data-column="uk"]')).toHaveText('J');
});
