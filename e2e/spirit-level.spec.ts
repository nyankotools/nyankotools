import { test, expect } from './helpers/test';

// デスクトップ Chromium にはセンサーが無いので、deviceorientation を合成して送る。
async function sendOrientation(
  page: import('@playwright/test').Page,
  beta: number,
  gamma: number,
) {
  await page.evaluate(
    ([b, g]) => {
      // 平滑化があるため複数回送って値を収束させる
      for (let i = 0; i < 40; i++) {
        window.dispatchEvent(
          new DeviceOrientationEvent('deviceorientation', {
            beta: b,
            gamma: g,
          }),
        );
      }
    },
    [beta, gamma],
  );
}

test.describe('水平器', () => {
  // Chromium は DeviceOrientationEvent.requestPermission を持ち、未許可扱いで返すため、
  // 通常系のテストでは許可済み (granted) として扱わせる (iOS 向けの分岐を通さない)。
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (
        window.DeviceOrientationEvent as unknown as {
          requestPermission: () => Promise<string>;
        }
      ).requestPermission = () => Promise.resolve('granted');
    });
  });

  test('水平なら「水平です」、傾けると角度が出る', async ({ page }) => {
    await page.goto('/tools/spirit-level/');
    await expect(page.locator('#sl-zero')).toBeDisabled();
    await page.locator('#sl-toggle').click();
    await expect(page.locator('#sl-toggle')).toHaveText('センサーを停止');

    await sendOrientation(page, 0, 0);
    await expect(page.locator('#sl-status')).toHaveText('水平です');
    await expect(page.locator('#sl-total')).toHaveText('0.0');

    await sendOrientation(page, 5, 0);
    await expect(page.locator('#sl-status')).toHaveText('傾いています');
    await expect(page.locator('#sl-total')).toHaveText(/^5\.0$/);
    await expect(page.locator('#sl-y')).toHaveText('5.0');
  });

  test('ゼロ点を設定すると現在の傾きが 0 になり、リセットで戻る', async ({
    page,
  }) => {
    await page.goto('/tools/spirit-level/');
    await page.locator('#sl-toggle').click();
    await sendOrientation(page, 3, 0);
    await expect(page.locator('#sl-status')).toHaveText('傾いています');

    await page.locator('#sl-zero').click();
    await expect(page.locator('#sl-status')).toHaveText('水平です');
    await expect(page.locator('#sl-zero-state')).toBeVisible();

    await page.locator('#sl-zero-reset').click();
    await expect(page.locator('#sl-status')).toHaveText('傾いています');
    await expect(page.locator('#sl-zero-state')).toBeHidden();
  });

  test('立てて測るに切り替えると回転のずれを表示する', async ({ page }) => {
    await page.goto('/tools/spirit-level/');
    await page.locator('#sl-toggle').click();
    await sendOrientation(page, 0, 0);
    await expect(page.locator('#sl-status')).toHaveText('水平です');

    await page.locator('#sl-mode [data-mode="upright"]').click();
    // 画面が上を向いたままでは測れない
    await expect(page.locator('#sl-status')).toContainText('測れません');

    await sendOrientation(page, 90, 0);
    await expect(page.locator('#sl-status')).toHaveText('水平です');
    await expect(page.locator('#sl-y-card')).toBeHidden();
  });

  test('センサーの値が来ないとエラーを表示して停止する', async ({ page }) => {
    await page.goto('/tools/spirit-level/');
    await page.locator('#sl-toggle').click();
    // 許可エラーではなく「値が来ない」エラーになることを確認する
    await expect(page.locator('#sl-error')).toContainText(
      '傾きセンサーの値が取得できませんでした',
      { timeout: 5000 },
    );
    await expect(page.locator('#sl-toggle')).toHaveText('センサーを開始');
  });

  test('英語版でも動く', async ({ page }) => {
    await page.goto('/en/tools/spirit-level/');
    await page.locator('#sl-toggle').click();
    await sendOrientation(page, 0, 0);
    await expect(page.locator('#sl-status')).toHaveText('Level');
  });
});

test.describe('iOS の許可ダイアログ', () => {
  test('許可を拒否すると案内を表示する', async ({ page }) => {
    await page.addInitScript(() => {
      (
        window.DeviceOrientationEvent as unknown as {
          requestPermission: () => Promise<string>;
        }
      ).requestPermission = () => Promise.resolve('denied');
    });
    await page.goto('/tools/spirit-level/');
    await page.locator('#sl-toggle').click();
    await expect(page.locator('#sl-error')).toContainText('許可');
    await expect(page.locator('#sl-toggle')).toHaveText('センサーを開始');
  });

  test('許可すると計測を開始する', async ({ page }) => {
    await page.addInitScript(() => {
      (
        window.DeviceOrientationEvent as unknown as {
          requestPermission: () => Promise<string>;
        }
      ).requestPermission = () => Promise.resolve('granted');
    });
    await page.goto('/tools/spirit-level/');
    await page.locator('#sl-toggle').click();
    await expect(page.locator('#sl-toggle')).toHaveText('センサーを停止');
    await sendOrientation(page, 0, 0);
    await expect(page.locator('#sl-status')).toHaveText('水平です');
  });
});
