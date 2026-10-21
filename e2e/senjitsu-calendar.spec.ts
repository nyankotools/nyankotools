import { test, expect } from './helpers/test';

test.describe('選日カレンダー', () => {
  test('2026年3月: 天赦日（3/5）に印と色が付き、一覧にも出る', async ({
    page,
  }) => {
    await page.goto('/tools/senjitsu-calendar/');
    await page.locator('#sj-year').fill('2026');
    await page.locator('#sj-month').selectOption('3');
    await page.locator('#sj-occasion').selectOption('all');
    await expect(page.locator('#sj-output caption')).toHaveText('2026年3月');
    const cell = page.locator('#sj-output td', { hasText: /^5戊寅/ });
    await expect(cell).toHaveCount(1);
    await expect(cell).toContainText('天赦日');
    await expect(cell).toHaveClass(/bg-amber-100/);
    await expect(page.locator('#sj-list')).toContainText('3月5日');
  });

  test('用途を結婚にすると寅の日が一覧から外れ、財布では残る', async ({
    page,
  }) => {
    await page.goto('/tools/senjitsu-calendar/');
    await page.locator('#sj-year').fill('2026');
    await page.locator('#sj-month').selectOption('1');
    await page.locator('#sj-occasion').selectOption('wallet');
    // 2026-01-04 は戊寅（寅の日）。冬なので天赦日ではないが財布には吉
    await expect(
      page.locator('#sj-list li', { hasText: '1月4日' }),
    ).toHaveCount(1);
    await page.locator('#sj-occasion').selectOption('wedding');
    await expect(
      page.locator('#sj-list li', { hasText: '1月4日' }),
    ).toHaveCount(0);
  });

  test('範囲を「その年全体」にすると年間の一覧になる', async ({ page }) => {
    await page.goto('/tools/senjitsu-calendar/');
    await page.locator('#sj-year').fill('2026');
    await page.locator('#sj-scope').selectOption('year');
    await expect(page.locator('#sj-list h2')).toContainText('2026年の吉日');
    const count = await page.locator('#sj-list li').count();
    expect(count).toBeGreaterThan(30);
  });

  test('日付入力で干支・旧暦・選日を調べられる', async ({ page }) => {
    await page.goto('/tools/senjitsu-calendar/');
    await page.locator('#sj-lookup-date').fill('2024-01-01');
    await expect(page.locator('#sj-lookup-result')).toContainText('甲子');
    await expect(page.locator('#sj-lookup-result')).toContainText('天赦日');
  });

  test('年の範囲外はエラーになり、範囲内に直すと復帰する', async ({ page }) => {
    await page.goto('/tools/senjitsu-calendar/');
    await page.locator('#sj-year').fill('2101');
    await expect(page.locator('#sj-error')).toContainText('1900〜2100');
    await expect(page.locator('#sj-output table')).toHaveCount(0);
    await page.locator('#sj-year').fill('2100');
    await expect(page.locator('#sj-error')).toHaveText('');
    await expect(page.locator('#sj-output table')).toHaveCount(1);
  });

  test('英語版でも表示できる', async ({ page }) => {
    await page.goto('/en/tools/senjitsu-calendar/');
    await page.locator('#sj-year').fill('2026');
    await page.locator('#sj-month').selectOption('3');
    await page.locator('#sj-occasion').selectOption('all');
    await expect(page.locator('#sj-list')).toContainText('Lucky days in');
    await expect(page.locator('#sj-list')).toContainText('Mar 5');
  });
});
