import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test('料理の分量換算: 初期表示でaxeの違反がない', async ({ page }) => {
  for (const path of [
    '/tools/cooking-unit-converter/',
    '/en/tools/cooking-unit-converter/',
  ]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(
      results.violations.map((v) => v.id),
      path,
    ).toEqual([]);
  }
});

test('料理の分量換算: 小麦粉大さじ1は9g・小さじ3', async ({ page }) => {
  await page.goto('/tools/cooking-unit-converter/');
  await expect(page.locator('#cook-result-g')).toHaveText('9');
  await expect(page.locator('#cook-result-tsp')).toHaveText('3');
  await expect(page.locator('#cook-result-ml')).toHaveText('15');
});

test('料理の分量換算: gから大さじへ逆算できる', async ({ page }) => {
  await page.goto('/tools/cooking-unit-converter/');
  await page.locator('#cook-ingredient').selectOption('honey');
  await page.locator('#cook-from').selectOption('g');
  await page.locator('#cook-amount').fill('21');
  await expect(page.locator('#cook-result-tbsp')).toHaveText('1');
});

test('料理の分量換算: 米国カップに切り替えるとmlが変わる', async ({ page }) => {
  await page.goto('/tools/cooking-unit-converter/');
  await page.locator('#cook-from').selectOption('cup');
  await expect(page.locator('#cook-result-ml')).toHaveText('200');
  await page.locator('#cook-cup').selectOption('us');
  await expect(page.locator('#cook-result-ml')).toHaveText('240');
});

test('料理の分量換算: 負の値はエラーを表示する', async ({ page }) => {
  await page.goto('/tools/cooking-unit-converter/');
  await page.locator('#cook-amount').fill('-1');
  await expect(page.locator('#cook-error')).toContainText('0以上');
  await expect(page.locator('#cook-results')).toBeHidden();
});

test('料理の分量換算: 英語版で結果と早見表が表示される', async ({ page }) => {
  await page.goto('/en/tools/cooking-unit-converter/');
  await page.locator('#cook-amount').fill('2');
  await expect(page.locator('#cook-result-g')).toHaveText('18');
  await expect(page.locator('main table tbody tr')).toHaveCount(13);
});
