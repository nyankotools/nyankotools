import { test, expect } from './helpers/test';

test.describe('大きな数の早見表（日本語版）', () => {
  test('早見表が表示され、10の3乗〜68乗の行が並ぶ', async ({ page }) => {
    await page.goto('/tools/large-number-chart/');

    await expect(page.locator('main h1')).toContainText('大きな数の早見表');
    await expect(page.locator('#large-number-chart tbody tr')).toHaveCount(66);
    const firstRow = page.locator('#large-number-chart tbody tr').first();
    await expect(firstRow).toContainText('1K');
    await expect(firstRow).toContainText('1,000');
    await expect(
      page.locator('#large-number-chart tbody tr').last(),
    ).toContainText('1無量大数');
  });

  test('数値を入力すると4つの表記が同時に表示される', async ({ page }) => {
    await page.goto('/tools/large-number-chart/');

    await page.locator('#large-number-input').fill('1234567890');
    await expect(page.locator('#large-number-commas')).toHaveText(
      '1,234,567,890',
    );
    await expect(page.locator('#large-number-short')).toHaveText('1.23B');
    await expect(page.locator('#large-number-ja')).toHaveText('12億3456万7890');
    await expect(page.locator('#large-number-scientific')).toHaveText(
      '1.23456789e+9',
    );
    await expect(page.locator('#large-number-digits')).toHaveText('10 桁');
  });

  test('「1.5M」「3億」「1e50」の書式を受け付ける', async ({ page }) => {
    await page.goto('/tools/large-number-chart/');
    const input = page.locator('#large-number-input');

    await input.fill('1.5M');
    await expect(page.locator('#large-number-commas')).toHaveText('1,500,000');

    await input.fill('2億3000万');
    await expect(page.locator('#large-number-commas')).toHaveText(
      '230,000,000',
    );

    await input.fill('1e50');
    await expect(page.locator('#large-number-ja')).toHaveText('100極');
    await expect(page.locator('#large-number-scientific')).toHaveText('1e+50');
  });

  test('不正な入力ではエラーが表示される', async ({ page }) => {
    await page.goto('/tools/large-number-chart/');

    await page.locator('#large-number-input').fill('abc');
    await expect(page.locator('#large-number-error')).not.toBeEmpty();
    await page.locator('#large-number-input').fill('1.5');
    await expect(page.locator('#large-number-error')).toContainText('整数');
    await page.locator('#large-number-input').fill('');
    await expect(page.locator('#large-number-error')).toBeEmpty();
  });
});

test.describe('Large Number Chart (English)', () => {
  test('shows the chart and converts input', async ({ page }) => {
    await page.goto('/en/tools/large-number-chart/');

    await expect(page.locator('main h1')).toContainText('Large Number Chart');
    await page.locator('#large-number-input').fill('3Qa');
    await expect(page.locator('#large-number-commas')).toHaveText(
      '3,000,000,000,000,000',
    );
    await expect(page.locator('#large-number-short')).toHaveText('3Qa');
    await expect(page.locator('#large-number-ja')).toHaveText('3000兆');
  });
});
