import { test, expect } from './helpers/test';

// Chromium のフェイクデバイス（音声はビープ音）を使い、getUserMedia の実処理まで通す。
test.use({
  permissions: ['microphone'],
  launchOptions: {
    args: [
      '--use-fake-device-for-media-stream',
      '--use-fake-ui-for-media-stream',
    ],
  },
});

test.describe('騒音計', () => {
  test('開始すると現在・最大・平均が数値で表示され、停止できる', async ({
    page,
  }) => {
    await page.goto('/tools/noise-meter/');
    await expect(page.locator('#nm-current')).toHaveText('-');
    await expect(page.locator('#nm-apply')).toBeDisabled();

    await page.locator('#nm-toggle').click();
    await expect(page.locator('#nm-current')).toHaveText(/^\d+$/);
    await expect(page.locator('#nm-max')).toHaveText(/^\d+$/);
    await expect(page.locator('#nm-avg')).toHaveText(/^\d+$/);
    await expect(page.locator('#nm-band')).not.toBeEmpty();
    await expect(page.locator('#nm-apply')).toBeEnabled();
    await expect(page.locator('#nm-error')).toBeHidden();

    await page.locator('#nm-toggle').click();
    await expect(page.locator('#nm-toggle')).toHaveText('計測を開始');
    await expect(page.locator('#nm-apply')).toBeDisabled();
  });

  test('オフセットを変えると表示が変わり、基準値に合わせられる', async ({
    page,
  }) => {
    await page.goto('/tools/noise-meter/');
    await page.locator('#nm-toggle').click();
    await expect(page.locator('#nm-current')).toHaveText(/^\d+$/);

    await page.locator('#nm-offset').fill('140');
    await expect(page.locator('#nm-bar')).toHaveAttribute(
      'aria-valuenow',
      /^([4-9]\d|1[0-3]\d)$/,
    );

    await page.locator('#nm-reference').fill('50');
    await page.locator('#nm-apply').click();
    const offset = Number(await page.locator('#nm-offset').inputValue());
    expect(offset).toBeGreaterThanOrEqual(40);
    expect(offset).toBeLessThanOrEqual(140);
  });

  test('英語版でも開始できる', async ({ page }) => {
    await page.goto('/en/tools/noise-meter/');
    await page.locator('#nm-toggle').click();
    await expect(page.locator('#nm-current')).toHaveText(/^\d+$/);
  });
});

test.describe('権限拒否時', () => {
  test('マイクが許可されないとエラーが表示され、開始前の状態に戻る', async ({
    page,
  }) => {
    await page.goto('/tools/noise-meter/');
    await page.evaluate(() => {
      navigator.mediaDevices.getUserMedia = () =>
        Promise.reject(new DOMException('denied', 'NotAllowedError'));
    });
    await page.locator('#nm-toggle').click();
    await expect(page.locator('#nm-error')).toBeVisible();
    await expect(page.locator('#nm-error')).toContainText('許可');
    await expect(page.locator('#nm-toggle')).toHaveText('計測を開始');
  });
});
