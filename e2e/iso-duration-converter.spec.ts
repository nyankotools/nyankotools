import { test, expect } from './helpers/test';

test.describe('ISO 8601期間変換', () => {
  test('PT1H30M を秒・分・時間に変換できる', async ({ page }) => {
    await page.goto('/tools/iso-duration-converter/');
    await page.locator('#iso-duration-input').fill('PT1H30M');
    await expect(page.locator('#iso-duration-total-seconds')).toHaveText(
      '5400',
    );
    await expect(page.locator('#iso-duration-total-minutes')).toHaveText('90');
    await expect(page.locator('#iso-duration-total-hours')).toHaveText('1.5');
    await expect(page.locator('#iso-duration-breakdown')).toHaveText(
      '1時間 30分',
    );
    await expect(page.locator('#iso-duration-approximate')).toBeHidden();
  });

  test('年・月を含むと概算の注記が表示される', async ({ page }) => {
    await page.goto('/en/tools/iso-duration-converter/');
    await page.locator('#iso-duration-input').fill('P1Y2M3DT4H5M6S');
    await expect(page.locator('#iso-duration-breakdown')).toHaveText(
      '1y 2mo 3d 4h 5min 6s',
    );
    await expect(page.locator('#iso-duration-approximate')).toBeVisible();
  });

  test('不正な入力でエラーが表示され、直すと消える', async ({ page }) => {
    await page.goto('/tools/iso-duration-converter/');
    const input = page.locator('#iso-duration-input');
    const error = page.locator('#iso-duration-error');
    await input.fill('1H30M');
    await expect(error).not.toBeEmpty();
    await input.fill('PT1H');
    await expect(error).toBeEmpty();
    await expect(page.locator('#iso-duration-total-seconds')).toHaveText(
      '3600',
    );
  });

  test('秒数からISO 8601期間に逆変換できる', async ({ page }) => {
    await page.goto('/tools/iso-duration-converter/');
    await page.locator('#iso-duration-seconds-input').fill('5400');
    await expect(page.locator('#iso-duration-seconds-result')).toHaveText(
      'PT1H30M',
    );
    await page.locator('#iso-duration-seconds-input').fill('abc');
    await expect(page.locator('#iso-duration-seconds-error')).not.toBeEmpty();
  });

  test('基準日時に期間を足せる', async ({ page }) => {
    await page.goto('/tools/iso-duration-converter/');
    await page.locator('#iso-duration-input').fill('P1D');
    // Chromium drops zero seconds on read-back, so Playwright's fill needs the normalized form.
    await page.locator('#iso-duration-base').fill('2024-01-31T10:00');
    await expect(page.locator('#iso-duration-end')).toContainText(
      '2024-02-01T10:00:00',
    );
  });
});
