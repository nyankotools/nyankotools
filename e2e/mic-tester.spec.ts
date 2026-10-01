import { test, expect } from './helpers/test';

// Chromium のフェイクデバイス（音声はビープ音）を使い、getUserMedia・MediaRecorder の実処理まで通す。
test.use({
  permissions: ['microphone'],
  launchOptions: {
    args: [
      '--use-fake-device-for-media-stream',
      '--use-fake-ui-for-media-stream',
    ],
  },
});

test.describe('マイクテスト', () => {
  test('開始するとマイク名・サンプルレートが表示され、停止でリセットされる', async ({
    page,
  }) => {
    await page.goto('/tools/mic-tester/');
    await expect(page.locator('#mic-meter-wrap')).toBeHidden();
    await expect(page.locator('#mic-record')).toBeDisabled();

    await page.locator('#mic-toggle').click();
    await expect(page.locator('#mic-meter-wrap')).toBeVisible();
    await expect(page.locator('#mic-info-device')).not.toHaveText('-');
    await expect(page.locator('#mic-info-sample-rate')).toContainText('Hz');
    await expect(page.locator('#mic-record')).toBeEnabled();
    await expect(page.locator('#mic-error')).toBeHidden();

    await page.locator('#mic-toggle').click();
    await expect(page.locator('#mic-meter-wrap')).toBeHidden();
    await expect(page.locator('#mic-info-device')).toHaveText('-');
    await expect(page.locator('#mic-record')).toBeDisabled();
  });

  test('録音して停止すると、再生プレイヤーが表示されダウンロードできる', async ({
    page,
  }) => {
    await page.goto('/tools/mic-tester/');
    await page.locator('#mic-toggle').click();
    await expect(page.locator('#mic-record')).toBeEnabled();

    await page.locator('#mic-record').click();
    await expect(page.locator('#mic-record-status')).toBeVisible();
    await page.waitForTimeout(1200);
    await page.locator('#mic-record').click();

    await expect(page.locator('#mic-playback')).toBeVisible();
    // blob: URLをCSPにブロックされず読み込めている（本番相当のビルドで検証される）
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            (document.getElementById('mic-audio') as HTMLAudioElement)
              .readyState,
        ),
      )
      .toBeGreaterThan(0);

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#mic-download').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^recording\.(webm|m4a|ogg)$/);
  });

  test('英語版でも開始できる', async ({ page }) => {
    await page.goto('/en/tools/mic-tester/');
    await page.locator('#mic-toggle').click();
    await expect(page.locator('#mic-info-device')).not.toHaveText('-');
  });
});

test.describe('権限拒否時', () => {
  test('マイクが許可されないとエラーが表示され、開始前の状態に戻る', async ({
    page,
  }) => {
    await page.goto('/tools/mic-tester/');
    await page.evaluate(() => {
      navigator.mediaDevices.getUserMedia = () =>
        Promise.reject(new DOMException('denied', 'NotAllowedError'));
    });
    await page.locator('#mic-toggle').click();
    await expect(page.locator('#mic-error')).toBeVisible();
    await expect(page.locator('#mic-error')).toContainText('許可');
    await expect(page.locator('#mic-toggle')).toHaveText('マイクテストを開始');
  });
});
