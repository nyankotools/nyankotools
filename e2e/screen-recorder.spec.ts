import { test, expect } from './helpers/test';

// ヘッドレスのChromiumでは画面共有の選択UIを出せないため、getDisplayMedia を
// canvas.captureStream() で差し替え、MediaRecorder による録画〜保存の実処理まで通す。
const stubDisplayMedia = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 180;
  const ctx = canvas.getContext('2d')!;
  let n = 0;
  setInterval(() => {
    ctx.fillStyle = n++ % 2 ? '#2563eb' : '#f97316';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, 50);
  navigator.mediaDevices.getDisplayMedia = async () => canvas.captureStream(20);
};

test.describe('画面録画（日本語版）', () => {
  test('録画を開始・停止すると、プレビューが表示され動画を保存できる', async ({
    page,
  }) => {
    await page.addInitScript(stubDisplayMedia);
    await page.goto('/tools/screen-recorder/');
    await expect(page.locator('main h1')).toHaveText('画面録画');
    await expect(page.locator('#sr-result')).toBeHidden();

    await page.locator('#sr-toggle').click();
    await expect(page.locator('#sr-status')).toContainText('録画中');
    await expect(page.locator('#sr-toggle')).toHaveText('録画を停止');
    await page.waitForTimeout(1500);

    await page.locator('#sr-toggle').click();
    await expect(page.locator('#sr-result')).toBeVisible();
    await expect(page.locator('#sr-status')).toBeHidden();
    await expect(page.locator('#sr-size')).toContainText('ファイルサイズ');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#sr-download').click(),
    ]);
    expect(download.suggestedFilename()).toMatch(
      /^screen-recording-\d{8}-\d{6}\.(webm|mp4)$/,
    );

    await page.locator('#sr-discard').click();
    await expect(page.locator('#sr-result')).toBeHidden();
  });

  test('共有を許可しなかった場合はエラーが表示される', async ({ page }) => {
    await page.addInitScript(() => {
      navigator.mediaDevices.getDisplayMedia = async () => {
        throw new DOMException('denied', 'NotAllowedError');
      };
    });
    await page.goto('/tools/screen-recorder/');
    await page.locator('#sr-toggle').click();
    await expect(page.locator('#sr-error')).toContainText(
      '許可されなかったか、キャンセルされました',
    );
    await expect(page.locator('#sr-toggle')).toHaveText('録画を開始');
  });

  test('画面共有に非対応の環境では非対応のエラーが表示される', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator.mediaDevices, 'getDisplayMedia', {
        value: undefined,
        configurable: true,
      });
    });
    await page.goto('/tools/screen-recorder/');
    await page.locator('#sr-toggle').click();
    await expect(page.locator('#sr-error')).toContainText('対応していません');
  });
});

test.describe('Screen Recorder (English)', () => {
  test('records and shows a preview', async ({ page }) => {
    await page.addInitScript(stubDisplayMedia);
    await page.goto('/en/tools/screen-recorder/');
    await expect(page.locator('main h1')).toHaveText('Screen Recorder');
    await page.locator('#sr-toggle').click();
    await expect(page.locator('#sr-status')).toContainText('Recording');
    await page.waitForTimeout(1200);
    await page.locator('#sr-toggle').click();
    await expect(page.locator('#sr-result')).toBeVisible();
  });
});
