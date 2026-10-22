import { test, expect } from './helpers/test';

test.describe('抵抗カラーコード計算', () => {
  test('初期状態の色帯（黄紫赤金）を4.7kΩ ±5%と読む', async ({ page }) => {
    await page.goto('/tools/resistor-color-code/');
    await expect(page.locator('#rc-read-value')).toHaveText('4.7 kΩ ±5%');
    await expect(page.locator('#rc-read-e')).toContainText('E24の標準値');
  });

  test('色を変えると抵抗値が変わる', async ({ page }) => {
    await page.goto('/tools/resistor-color-code/');
    await page.locator('#rc-band-2').selectOption('orange');
    await expect(page.locator('#rc-read-value')).toHaveText('47 kΩ ±5%');
    await expect(page.locator('#rc-read-range')).toContainText('44.65 kΩ');
  });

  test('6本線にすると温度係数の帯が増える', async ({ page }) => {
    await page.goto('/tools/resistor-color-code/');
    await expect(page.locator('#rc-band-5')).toBeHidden();
    await page.locator('[data-count="6"]').click();
    await expect(page.locator('#rc-band-5')).toBeVisible();
    await expect(page.locator('#rc-read-tempco')).toContainText('100 ppm');
  });

  test('抵抗値から色帯を求めて色名をコピーできる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/resistor-color-code/');
    await page.locator('#rc-value').fill('4k7');
    await expect(page.locator('#rc-find-names')).toHaveText(
      '黄 / 紫 / 赤 / 金',
    );
    await page.locator('#rc-copy-button').click();
    await expect(page.locator('#rc-copy-status')).toHaveText('コピーしました');
  });

  test('表せない値はエラーと近い標準値の導線を出す', async ({ page }) => {
    await page.goto('/tools/resistor-color-code/');
    await page.locator('#rc-value').fill('4810');
    await expect(page.locator('#rc-find-error')).toBeVisible();
    await expect(page.locator('#rc-find-e')).toContainText('E24で最も近い値');
    await page.locator('#rc-use-nearest').click();
    await expect(page.locator('#rc-find-error')).toBeHidden();
  });

  test('英語版が表示される', async ({ page }) => {
    await page.goto('/en/tools/resistor-color-code/');
    await expect(page.locator('main h1')).toContainText('Resistor Color Code');
    await page.locator('#rc-value').fill('2.2M');
    await expect(page.locator('#rc-find-names')).toHaveText(
      'Red / Red / Green / Gold',
    );
  });
});
