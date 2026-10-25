import { test, expect } from './helpers/test';

// ヘッドレスのChromiumでは画面共有の選択UIを出せないため、getDisplayMedia を
// canvas.captureStream() で差し替え、1フレームの取得〜PNG保存の実処理まで通す。
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
  const w = window as unknown as { __stopped: number };
  w.__stopped = 0;
  navigator.mediaDevices.getDisplayMedia = async () => {
    const stream = canvas.captureStream(20);
    stream.getTracks().forEach((track) => {
      const original = track.stop.bind(track);
      track.stop = () => {
        w.__stopped++;
        original();
      };
    });
    return stream;
  };
};

test.describe('スクリーンショット撮影（日本語版）', () => {
  test('撮影するとプレビューが表示され、PNGを保存でき、共有は停止される', async ({
    page,
  }) => {
    await page.addInitScript(stubDisplayMedia);
    await page.goto('/tools/screen-capture/');
    await expect(page.locator('main h1')).toHaveText('スクリーンショット撮影');
    await expect(page.locator('#sc-result')).toBeHidden();

    await page.locator('#sc-capture').click();
    await expect(page.locator('#sc-result')).toBeVisible();
    await expect(page.locator('#sc-size')).toContainText('320 × 180 px');
    expect(
      await page.evaluate(
        () => (window as unknown as { __stopped: number }).__stopped,
      ),
    ).toBeGreaterThan(0);

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#sc-download').click(),
    ]);
    expect(download.suggestedFilename()).toMatch(
      /^screenshot-\d{8}-\d{6}\.png$/,
    );

    await page.locator('#sc-discard').click();
    await expect(page.locator('#sc-result')).toBeHidden();
  });

  test('遅延タイマーを指定するとカウントダウンが表示される', async ({
    page,
  }) => {
    await page.addInitScript(stubDisplayMedia);
    await page.goto('/tools/screen-capture/');
    await page.locator('#sc-delay').selectOption('3');
    await page.locator('#sc-capture').click();
    await expect(page.locator('#sc-status')).toContainText('撮影まで');
    await expect(page.locator('#sc-result')).toBeVisible({ timeout: 10000 });
  });

  test('共有を許可しなかった場合はエラーが表示される', async ({ page }) => {
    await page.addInitScript(() => {
      navigator.mediaDevices.getDisplayMedia = async () => {
        throw new DOMException('denied', 'NotAllowedError');
      };
    });
    await page.goto('/tools/screen-capture/');
    await page.locator('#sc-capture').click();
    await expect(page.locator('#sc-error')).toContainText(
      '許可されなかったか、キャンセルされました',
    );
    await expect(page.locator('#sc-result')).toBeHidden();
    await expect(page.locator('#sc-capture')).toBeEnabled();
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
    await page.goto('/tools/screen-capture/');
    await expect(page.locator('#sc-unsupported')).toBeVisible();
    await expect(page.locator('#sc-capture')).toBeDisabled();
  });
});

test.describe('Screenshot Capture (English)', () => {
  test('captures a frame and shows a preview', async ({ page }) => {
    await page.addInitScript(stubDisplayMedia);
    await page.goto('/en/tools/screen-capture/');
    await expect(page.locator('main h1')).toHaveText('Screenshot Capture');
    await page.locator('#sc-capture').click();
    await expect(page.locator('#sc-result')).toBeVisible();
    await expect(page.locator('#sc-size')).toContainText('Image size');
  });
});
