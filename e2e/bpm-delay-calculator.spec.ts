import { test, expect } from './helpers/test';

test.describe('BPMディレイタイム計算', () => {
  test('初期値 120 BPM で四分音符 500ms・付点八分 375ms', async ({ page }) => {
    await page.goto('/tools/bpm-delay-calculator/');
    await expect(page.locator('main h1')).toContainText('ディレイタイム');
    await expect(
      page.locator('[data-delay-den="4"][data-kind="straight"]'),
    ).toHaveText('500');
    await expect(
      page.locator('[data-delay-den="8"][data-kind="dotted"]'),
    ).toHaveText('375');
  });

  test('BPM と単位を変えると表が更新される', async ({ page }) => {
    await page.goto('/tools/bpm-delay-calculator/');
    await page.locator('#bpmd-bpm').fill('60');
    await expect(
      page.locator('[data-delay-den="4"][data-kind="straight"]'),
    ).toHaveText('1000');
    await page.locator('#bpmd-unit').selectOption('hz');
    await expect(
      page.locator('[data-delay-den="4"][data-kind="straight"]'),
    ).toHaveText('1');
  });

  test('範囲外の BPM は確定時に収まる', async ({ page }) => {
    await page.goto('/tools/bpm-delay-calculator/');
    const bpm = page.locator('#bpmd-bpm');
    await bpm.fill('999');
    await bpm.blur();
    await expect(bpm).toHaveValue('300');
  });

  test('値のクリックでコピーされる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/bpm-delay-calculator/');
    await page.locator('[data-delay-den="4"][data-kind="straight"]').click();
    await expect(page.locator('#bpmd-copy-status')).toContainText('コピー');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      '500',
    );
  });

  test('タップテンポで BPM が入り、リセットできる', async ({ page }) => {
    await page.goto('/tools/bpm-delay-calculator/');
    const tap = page.locator('#bpmd-tap');
    await tap.click();
    await expect(page.locator('#bpmd-tap-result')).toContainText('もう一度');
    for (let i = 0; i < 3; i++) {
      await page.waitForTimeout(500);
      await tap.click();
    }
    await expect(page.locator('#bpmd-tap-result')).toContainText('4回の平均');
    const value = Number(await page.locator('#bpmd-bpm').inputValue());
    expect(value).toBeGreaterThanOrEqual(100);
    expect(value).toBeLessThanOrEqual(130);
    await page.locator('#bpmd-tap-reset').click();
    await expect(page.locator('#bpmd-tap-result')).toContainText(
      'まだタップされていません',
    );
  });

  test('英語版で表示できる', async ({ page }) => {
    await page.goto('/en/tools/bpm-delay-calculator/');
    await expect(page.locator('main h1')).toContainText('Delay Time');
    await expect(
      page.locator('[data-delay-den="16"][data-kind="triplet"]'),
    ).toHaveText('83.33');
  });
});
