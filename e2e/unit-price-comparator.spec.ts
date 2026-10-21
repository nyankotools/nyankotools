import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test('単価比較: 初期値で最安が判定される', async ({ page }) => {
  await page.goto('/tools/unit-price-comparator/');

  // 徳用 698円/1kg = 69.8円/100g が最安
  await expect(page.locator('#upc-summary')).toContainText('徳用');
  await expect(page.locator('#upc-list li')).toHaveCount(3);
  await expect(page.locator('#upc-list li').nth(2)).toContainText('最安');
});

test('単価比較: 価格を変更すると最安が切り替わる', async ({ page }) => {
  await page.goto('/tools/unit-price-comparator/');

  await page.locator('#upc-price-0').fill('50');
  await expect(page.locator('#upc-summary')).toContainText('小パック');
});

test('単価比較: 個数と税抜を反映する', async ({ page }) => {
  await page.goto('/tools/unit-price-comparator/');

  await page.locator('#upc-clear-button').click();
  await page.locator('#upc-price-0').fill('600');
  await page.locator('#upc-qty-0').fill('500');
  await page.locator('#upc-unit-0').selectOption('ml');
  await page.locator('#upc-count-0').fill('6');
  await page.locator('#upc-price-1').fill('100');
  await page.locator('#upc-qty-1').fill('500');
  await page.locator('#upc-unit-1').selectOption('ml');
  await page.locator('#upc-tax-1').selectOption('excl10');

  // 600/3000*100=20円、110/500*100=22円
  await expect(page.locator('#upc-summary')).toContainText('商品1');
  await expect(page.locator('#upc-list li').nth(1)).toContainText('割高');
});

test('単価比較: 1商品だけだと案内が出て、種類違いは除外される', async ({
  page,
}) => {
  await page.goto('/tools/unit-price-comparator/');

  await page.locator('#upc-clear-button').click();
  await page.locator('#upc-price-0').fill('100');
  await page.locator('#upc-qty-0').fill('100');
  await expect(page.locator('#upc-issues')).toContainText('2つ以上');

  await page.locator('#upc-price-1').fill('100');
  await page.locator('#upc-qty-1').fill('100');
  await page.locator('#upc-unit-1').selectOption('ml');
  await expect(page.locator('#upc-issues')).toContainText('商品2');
});

test('単価比較: 結果をコピーできる', async ({ page }) => {
  await page.goto('/tools/unit-price-comparator/');

  await page.locator('#upc-copy-button').click();
  await expect(page.locator('#upc-copy-status')).toContainText(/.+/);
});

test('単価比較: 英語版で動作する', async ({ page }) => {
  await page.goto('/en/tools/unit-price-comparator/');

  await expect(page.locator('main h1')).toContainText('Unit Price');
  await expect(page.locator('#upc-summary')).toContainText('Bulk');
  await expect(page.locator('#upc-list li').nth(2)).toContainText('Cheapest');
});

test('単価比較: 初期表示でaxeの違反がない', async ({ page }) => {
  for (const path of [
    '/tools/unit-price-comparator/',
    '/en/tools/unit-price-comparator/',
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
