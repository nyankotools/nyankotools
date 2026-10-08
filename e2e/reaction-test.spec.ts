import { test, expect } from './helpers/test';

test('反応速度テストで待機中のクリックはフライングになる', async ({ page }) => {
  await page.goto('/tools/reaction-test/');
  const pad = page.locator('#rt-pad');
  await expect(pad).toHaveAttribute('data-state', 'idle');

  await pad.click();
  await expect(pad).toHaveAttribute('data-state', 'waiting');

  await pad.click();
  await expect(pad).toHaveAttribute('data-state', 'early');
  await expect(page.locator('#rt-stat-early')).toHaveText('1');
  await expect(page.locator('#rt-stat-last')).toHaveText('-');
});

test('反応速度テストでSpaceキーで測定し、5回で結果が出る', async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto('/tools/reaction-test/');
  const pad = page.locator('#rt-pad');
  await pad.focus();

  for (let i = 1; i <= 5; i++) {
    await page.keyboard.press('Space');
    await expect(pad).toHaveAttribute('data-state', 'waiting');
    await expect(pad).toHaveAttribute('data-state', 'go', { timeout: 7000 });
    await page.waitForTimeout(50);
    await page.keyboard.press('Space');
    await expect(page.locator('#rt-history li')).toHaveCount(i);
  }

  await expect(pad).toHaveAttribute('data-state', 'done');
  await expect(page.locator('#rt-stat-average')).toContainText('ms');
  await expect(page.locator('#rt-stat-rank')).not.toHaveText('-');

  await page.locator('#rt-reset').click();
  await expect(pad).toHaveAttribute('data-state', 'idle');
  await expect(page.locator('#rt-history li')).toHaveCount(0);
});

test('反応速度テスト（英語）が表示される', async ({ page }) => {
  await page.goto('/en/tools/reaction-test/');
  await expect(page.locator('main h1')).toContainText('Reaction');
  await expect(page.locator('#rt-pad')).toContainText('Click');
});
