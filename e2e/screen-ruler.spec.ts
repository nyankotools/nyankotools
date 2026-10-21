import { test, expect } from './helpers/test';

test('画面定規: 既定ではcmの横定規と96dpiの校正値を表示する', async ({
  page,
}) => {
  await page.goto('/tools/screen-ruler/');

  await expect(page.locator('#sr-calibration')).toContainText('96.0 PPI');
  await expect(page.locator('#sr-ruler path').first()).toBeAttached();
  await expect(page.locator('#sr-ruler text').first()).toHaveText('0');
});

test('画面定規: スライダーで校正すると校正値が変わり再読み込み後も残る', async ({
  page,
}) => {
  await page.goto('/tools/screen-ruler/');

  await page.locator('#sr-slider').fill('342.4');
  // 342.4px / 85.6mm = 4.0 px/mm = 101.6 PPI
  await expect(page.locator('#sr-calibration')).toContainText('101.6 PPI');
  // Chromiumのレイアウトは1/64px単位で丸めるため（342.4px → 342.391px）、許容誤差を持たせる
  const cardWidth = await page
    .locator('#sr-card')
    .evaluate((el) => el.getBoundingClientRect().width);
  expect(cardWidth).toBeCloseTo(342.4, 0);

  await page.reload();
  await expect(page.locator('#sr-calibration')).toContainText('101.6 PPI');
});

test('画面定規: 微調整ボタンと96dpiに戻すボタンが動く', async ({ page }) => {
  await page.goto('/tools/screen-ruler/');

  await page.locator('#sr-plus').click();
  await expect(page.locator('#sr-calibration')).not.toContainText('96.0 PPI');

  await page.locator('#sr-reset').click();
  await expect(page.locator('#sr-calibration')).toContainText('96.0 PPI');
  await expect(page.locator('#sr-status')).not.toHaveText('');
});

test('画面定規: 単位と向きを切り替えられる', async ({ page }) => {
  await page.goto('/tools/screen-ruler/');

  await page.locator('#sr-unit button[data-unit="inch"]').click();
  await expect(
    page.locator('#sr-unit button[data-unit="inch"]'),
  ).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#sr-ruler text').nth(1)).toHaveText('1');

  const horizontalWidth = await page
    .locator('#sr-ruler')
    .evaluate((el) => el.getBoundingClientRect().width);
  await page
    .locator('#sr-orientation button[data-orientation="vertical"]')
    .click();
  const verticalWidth = await page
    .locator('#sr-ruler')
    .evaluate((el) => el.getBoundingClientRect().width);
  expect(verticalWidth).toBeLessThan(horizontalWidth);
});

test('画面定規: 英語版でも表示できる', async ({ page }) => {
  await page.goto('/en/tools/screen-ruler/');

  await expect(page.locator('#sr-calibration')).toContainText('PPI');
  await expect(page.locator('#sr-ruler text').first()).toBeAttached();
});
