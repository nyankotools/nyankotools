import { test, expect } from './helpers/test';
import AxeBuilder from '@axe-core/playwright';

test('ランニングペース計算: 距離とタイムからペースと予想タイムが出る', async ({
  page,
}) => {
  await page.goto('/tools/running-pace-calculator/');

  await page.locator('#rpc-distance-input').fill('10');
  await page.locator('#rpc-hours-input').fill('0');
  await page.locator('#rpc-minutes-input').fill('50');
  await page.locator('#rpc-seconds-input').fill('0');

  await expect(page.locator('#rpc-result-pace')).toContainText('5:00');
  await expect(page.locator('#rpc-result-speed')).toContainText('12');
  await expect(page.locator('#rpc-races')).toContainText('3:30:59');
});

test('ランニングペース計算: 距離とペースからタイムを求められる', async ({
  page,
}) => {
  await page.goto('/tools/running-pace-calculator/');

  await page.locator('input[name="rpc-mode"][value="time"]').check();
  await page.locator('#rpc-distance-input').fill('10');
  await page.locator('#rpc-pace-min-input').fill('6');
  await page.locator('#rpc-pace-sec-input').fill('0');

  await expect(page.locator('#rpc-result-time')).toHaveText('1:00:00');
});

test('ランニングペース計算: 0の距離でエラーが出る', async ({ page }) => {
  await page.goto('/tools/running-pace-calculator/');

  await page.locator('#rpc-distance-input').fill('0');
  await expect(page.locator('#rpc-error')).toContainText(/.+/);
  await expect(page.locator('#rpc-results')).toHaveClass(/hidden/);
});

test('ランニングペース計算: 0の距離のエラー表示でもaxeの違反がない', async ({
  page,
}) => {
  await page.goto('/tools/running-pace-calculator/');
  await page.locator('#rpc-distance-input').fill('0');
  await expect(page.locator('#rpc-error')).toContainText(/.+/);

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});

test('ランニングペース計算: 心拍ゾーンが計算される', async ({ page }) => {
  await page.goto('/tools/running-pace-calculator/');

  await page.locator('#rpc-age-input').fill('40');
  await page.locator('#rpc-rest-input').fill('60');

  await expect(page.locator('#rpc-hr-max')).toContainText('180');
  await expect(page.locator('#rpc-hr-zones')).toContainText('120–132');
});
