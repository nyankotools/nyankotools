import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test('賃貸初期費用計算: 初期値で総額と内訳が表示される', async ({ page }) => {
  await page.goto('/tools/rent-initial-cost/');

  await expect(page.locator('#rent-cost-results')).not.toHaveClass(/hidden/);
  // 敷金1ヶ月・家賃10万円
  await expect(page.locator('#rent-cost-item-deposit')).toContainText(
    '100,000',
  );
  // 仲介手数料 10万円 x 1.1
  await expect(page.locator('#rent-cost-item-brokerage')).toContainText(
    '110,000',
  );
  // ja-JP の Intl 表記は全角「￥」
  await expect(page.locator('#rent-cost-total')).toContainText('￥');
});

test('賃貸初期費用計算: 家賃を変えると総額が更新される', async ({ page }) => {
  await page.goto('/tools/rent-initial-cost/');

  const before = await page.locator('#rent-cost-total').textContent();
  await page.locator('#rent-cost-rent').fill('200000');
  await expect(page.locator('#rent-cost-total')).not.toHaveText(before ?? '');
  await expect(page.locator('#rent-cost-item-keyMoney')).toContainText(
    '200,000',
  );
});

test('賃貸初期費用計算: 年収を入力すると家賃の目安が表示される', async ({
  page,
}) => {
  await page.goto('/tools/rent-initial-cost/');

  await expect(page.locator('#rent-cost-guideline')).toHaveClass(/hidden/);
  await page.locator('#rent-cost-income').fill('4800000');
  await expect(page.locator('#rent-cost-guideline')).not.toHaveClass(/hidden/);
  await expect(page.locator('#rent-cost-upper')).toContainText('133,333');
  await expect(page.locator('#rent-cost-comfortable')).toContainText('100,000');
});

test('賃貸初期費用計算: 不正な値ではエラーが表示される', async ({ page }) => {
  await page.goto('/tools/rent-initial-cost/');

  await page.locator('#rent-cost-deposit').fill('30');
  await expect(page.locator('#rent-cost-error')).toContainText(
    '計算できませんでした',
  );
  await expect(page.locator('#rent-cost-results')).toHaveClass(/hidden/);
});

test('賃貸初期費用計算: 英語版で結果が表示される', async ({ page }) => {
  await page.goto('/en/tools/rent-initial-cost/');

  await expect(page.locator('#rent-cost-total')).toContainText('¥');
  await expect(page.locator('#rent-cost-months')).toContainText('months');
});

test('賃貸初期費用計算: 初期表示でaxeの違反がない', async ({ page }) => {
  for (const path of [
    '/tools/rent-initial-cost/',
    '/en/tools/rent-initial-cost/',
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
