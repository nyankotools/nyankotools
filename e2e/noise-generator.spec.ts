import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test('ノイズジェネレーターの初期表示と種類の切り替え', async ({ page }) => {
  await page.goto('/tools/noise-generator/');

  await expect(page.locator('#ng-status')).toContainText('停止中');
  const buttons = page.locator('[data-noise]');
  await expect(buttons).toHaveCount(3);
  await expect(page.locator('[data-noise="white"]')).toHaveAttribute(
    'aria-pressed',
    'true',
  );

  await page.locator('[data-noise="brown"]').click();
  await expect(page.locator('[data-noise="brown"]')).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.locator('[data-noise="white"]')).toHaveAttribute(
    'aria-pressed',
    'false',
  );
});

test('ノイズジェネレーターで再生・タイマー表示・停止ができる', async ({
  page,
}) => {
  await page.goto('/tools/noise-generator/');

  await page.selectOption('#ng-timer', '5');
  await page.locator('#ng-play').click();
  await expect(page.locator('#ng-status')).toContainText('再生中');
  await expect(page.locator('#ng-status')).toContainText('残り');

  await page.locator('#ng-stop').click();
  await expect(page.locator('#ng-status')).toContainText('停止中');
});

test('ノイズジェネレーター（英語）で再生と停止ができる', async ({ page }) => {
  await page.goto('/en/tools/noise-generator/');

  await expect(page.locator('#ng-status')).toContainText('Stopped');
  await page.locator('#ng-play').click();
  await expect(page.locator('#ng-status')).toContainText('Playing');
  await page.locator('#ng-stop').click();
  await expect(page.locator('#ng-status')).toContainText('Stopped');
});

test('ノイズジェネレーターの音量表示が更新される', async ({ page }) => {
  await page.goto('/tools/noise-generator/');

  await page.locator('#ng-volume').fill('60');
  await expect(page.locator('#ng-volume-value')).toHaveText('60');
});

test('ノイズジェネレーターの初期表示でaxeの違反がない', async ({ page }) => {
  await page.goto('/tools/noise-generator/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});
