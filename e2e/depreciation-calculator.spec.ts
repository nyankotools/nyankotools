import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test.describe('減価償却計算機', () => {
  test('日本語版: 初期値（100万円・4年・定率法）で年別の表が表示される', async ({
    page,
  }) => {
    await page.goto('/tools/depreciation-calculator/');

    await expect(page.locator('#dep-cost')).toHaveValue('1,000,000');
    await expect(page.locator('#dep-result-first')).toHaveText('￥500,000');
    await expect(page.locator('#dep-result-total')).toHaveText('￥999,999');
    await expect(page.locator('#dep-result-years')).toHaveText('4年間');
    await expect(page.locator('#dep-schedule tr')).toHaveCount(4);
    await expect(page.locator('#dep-rate-row-4')).toHaveClass(/font-bold/);
  });

  test('英語版が表示され償却費が計算される', async ({ page }) => {
    await page.goto('/en/tools/depreciation-calculator/');

    await expect(page.locator('#dep-result-first')).toHaveText('¥500,000');
    await expect(page.locator('#dep-result-years')).toHaveText('4 years');
  });

  test('定額法に切り替えると毎年同額になり、最終年に1円を残す', async ({
    page,
  }) => {
    await page.goto('/tools/depreciation-calculator/');

    await page.locator('#dep-life').fill('5');
    await page.locator('#dep-method').selectOption('straight');
    await expect(page.locator('#dep-result-first')).toHaveText('￥200,000');
    await expect(page.locator('#dep-schedule tr')).toHaveCount(5);
    await expect(page.locator('#dep-schedule tr').last()).toContainText(
      '￥199,999',
    );
  });

  test('定率法・10年・100万円: 20%の初年度と改定後の最終年1円残し（表示値）', async ({
    page,
  }) => {
    await page.goto('/tools/depreciation-calculator/');

    await page.locator('#dep-life').fill('10');
    await expect(page.locator('#dep-result-first')).toHaveText('￥200,000');
    await expect(page.locator('#dep-result-years')).toHaveText('10年間');
    await expect(page.locator('#dep-schedule tr')).toHaveCount(10);
    await expect(page.locator('#dep-schedule tr').first()).toContainText(
      '￥200,000',
    );
    await expect(page.locator('#dep-schedule tr').last()).toContainText(
      '￥65,535',
    );
  });

  test('期中取得（6か月）は初年度が月割りになり、年数が延びる', async ({
    page,
  }) => {
    await page.goto('/tools/depreciation-calculator/');

    await page.locator('#dep-life').fill('5');
    await page.locator('#dep-method').selectOption('straight');
    await page.locator('#dep-months').fill('6');
    await expect(page.locator('#dep-result-first')).toHaveText('￥100,000');
    await expect(page.locator('#dep-schedule tr')).toHaveCount(6);
  });

  test('資産の種類を選ぶと耐用年数が入り、建物は定率法を選ぶとエラーになる', async ({
    page,
  }) => {
    await page.goto('/tools/depreciation-calculator/');

    await page.locator('#dep-asset').selectOption({ index: 9 });
    await expect(page.locator('#dep-life')).toHaveValue('24');
    await expect(page.locator('#dep-error')).toContainText(
      '定額法を選んでください',
    );
    await expect(page.locator('#dep-results')).toBeHidden();

    await page.locator('#dep-method').selectOption('straight');
    await expect(page.locator('#dep-error')).toHaveText('');
    await expect(page.locator('#dep-result-rate')).toHaveText('0.042');
  });

  test('少額減価償却資産の判定: 中小企業者等は令和8年3月31日以前は30万円未満、4月1日以後は40万円未満', async ({
    page,
  }) => {
    await page.goto('/tools/depreciation-calculator/');

    await page.locator('#dep-cost').fill('250000');
    await page.locator('#dep-date').fill('2026-03-31');
    await page.locator('#dep-sme').check();
    await expect(page.locator('#dep-judge-list')).toContainText('30万円未満');

    await page.locator('#dep-date').fill('2026-04-01');
    await expect(page.locator('#dep-judge-list')).toContainText('40万円未満');

    await page.locator('#dep-cost').fill('400000');
    await expect(page.locator('#dep-judge-list')).toContainText(
      '当てはまらない',
    );

    await page.locator('#dep-cost').fill('350000');
    await page.locator('#dep-date').fill('2029-04-01');
    await expect(page.locator('#dep-judge-list')).toContainText(
      '当てはまらない',
    );
  });

  test('10万円以上20万円未満は一括償却資産の案内と3年の金額を表示する', async ({
    page,
  }) => {
    await page.goto('/tools/depreciation-calculator/');

    await page.locator('#dep-cost').fill('150000');
    await page.locator('#dep-date').fill('2026-01-10');
    await expect(page.locator('#dep-judge-list')).toContainText('一括償却資産');
    await expect(page.locator('#dep-judge-lump')).toContainText('￥50,000');
  });

  test('取得価額を空にすると結果が隠れる', async ({ page }) => {
    await page.goto('/tools/depreciation-calculator/');

    await page.locator('#dep-cost').fill('');
    await expect(page.locator('#dep-results')).toBeHidden();
  });

  test('初期表示でaxeの違反がない（ja/en）', async ({ page }) => {
    for (const path of [
      '/tools/depreciation-calculator/',
      '/en/tools/depreciation-calculator/',
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
});
