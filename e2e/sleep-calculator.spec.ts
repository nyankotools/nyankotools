import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test('睡眠計算機: 初期表示でaxeの違反がない', async ({ page }) => {
  for (const path of [
    '/tools/sleep-calculator/',
    '/en/tools/sleep-calculator/',
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

test('睡眠計算機: 起床時刻から就寝時刻の候補が表示される', async ({ page }) => {
  await page.goto('/tools/sleep-calculator/');

  await page.locator('#sleep-wake-input').fill('07:00');
  await page.locator('#sleep-latency-input').fill('15');

  const items = page.locator('#sleep-result-list li');
  await expect(items).toHaveCount(3);
  await expect(items.nth(0)).toContainText('21:45');
  await expect(items.nth(0)).toContainText('前日');
  await expect(items.nth(0)).toContainText('6サイクル');
  await expect(items.nth(1)).toContainText('23:15');
  await expect(items.nth(2)).toContainText('00:45');
});

test('睡眠計算機: 就寝時刻から起床時刻の候補が表示される', async ({ page }) => {
  await page.goto('/tools/sleep-calculator/');

  await page.locator('#sleep-mode [data-mode="bed"]').click();
  await page.locator('#sleep-bed-input').fill('23:00');

  const items = page.locator('#sleep-result-list li');
  await expect(items.nth(0)).toContainText('05:15');
  await expect(items.nth(0)).toContainText('翌日');
  await expect(items.nth(2)).toContainText('08:15');
});

test('睡眠計算機: 今すぐ寝るボタンで現在時刻が入る', async ({ page }) => {
  await page.goto('/tools/sleep-calculator/');

  await page.locator('#sleep-mode [data-mode="bed"]').click();
  await page.locator('#sleep-bed-input').fill('00:00');
  await page.locator('#sleep-now-button').click();

  await expect(page.locator('#sleep-bed-input')).not.toHaveValue('00:00');
  await expect(page.locator('#sleep-result-list li')).toHaveCount(3);
});

test('睡眠計算機: 入眠までの時間が不正だとエラーが出る', async ({ page }) => {
  await page.goto('/tools/sleep-calculator/');

  await page.locator('#sleep-latency-input').fill('500');

  await expect(page.locator('#sleep-error')).toContainText('0〜120');
  await expect(page.locator('#sleep-results')).toHaveClass(/hidden/);
});

test('睡眠計算機: 英語版で結果が表示される', async ({ page }) => {
  await page.goto('/en/tools/sleep-calculator/');

  await page.locator('#sleep-wake-input').fill('07:00');

  const items = page.locator('#sleep-result-list li');
  await expect(items.nth(0)).toContainText('21:45');
  await expect(items.nth(0)).toContainText('previous day');
});
