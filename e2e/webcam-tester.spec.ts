import { test, expect } from '@playwright/test';

// Chromium のフェイクデバイス（映像はテストパターン、音声はビープ音）を使い、
// getUserMedia の実処理まで通す。
test.use({
  permissions: ['camera', 'microphone'],
  launchOptions: {
    args: [
      '--use-fake-device-for-media-stream',
      '--use-fake-ui-for-media-stream',
    ],
  },
});

test.describe('Webカメラ動作確認（日本語版）', () => {
  test('初期状態は停止中で、開始すると解像度・カメラ名が表示される', async ({
    page,
  }) => {
    await page.goto('/tools/webcam-tester/');
    await expect(page.locator('#webcam-camera-toggle')).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    await expect(page.locator('#webcam-placeholder')).toBeVisible();

    await page.locator('#webcam-camera-toggle').click();

    await expect(page.locator('#webcam-placeholder')).toBeHidden();
    await expect(page.locator('#webcam-camera-toggle')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(page.locator('#webcam-info-resolution')).toContainText('×');
    await expect(page.locator('#webcam-info-device')).not.toHaveText('-');
    await expect(page.locator('#webcam-error')).toBeHidden();
  });

  test('解像度が「自動」でもVGA固定にならず、最大フルHDで取得する', async ({
    page,
  }) => {
    await page.goto('/tools/webcam-tester/');
    await page.locator('#webcam-camera-toggle').click();
    await expect(page.locator('#webcam-info-resolution')).toContainText(
      '1920 × 1080',
    );
  });

  test('解像度を指定して開始するとその解像度が反映される', async ({ page }) => {
    await page.goto('/tools/webcam-tester/');
    await page.locator('#webcam-resolution').selectOption('1280x720');
    await page.locator('#webcam-camera-toggle').click();
    await expect(page.locator('#webcam-info-resolution')).toContainText(
      '1280 × 720',
    );
  });

  test('マイクを有効にするとマイク名が表示され、停止で情報がリセットされる', async ({
    page,
  }) => {
    await page.goto('/tools/webcam-tester/');
    await page.locator('#webcam-mic-toggle').click();
    await page.locator('#webcam-camera-toggle').click();
    await expect(page.locator('#webcam-info-mic')).not.toHaveText('-');
    await expect(page.locator('#webcam-info-mic')).not.toHaveText('未使用');
    await expect(page.locator('#webcam-level-wrap')).toBeVisible();

    await page.locator('#webcam-camera-toggle').click();
    await expect(page.locator('#webcam-info-resolution')).toHaveText('-');
    await expect(page.locator('#webcam-camera-toggle')).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    await expect(page.locator('#webcam-placeholder')).toBeVisible();
  });

  test('左右反転ボタンで映像にscaleX(-1)が適用される', async ({ page }) => {
    await page.goto('/tools/webcam-tester/');
    const mirrorBtn = page.locator('#webcam-mirror');
    const video = page.locator('#webcam-video');

    // 初期状態: aria-pressed=false、transformなし
    await expect(mirrorBtn).toHaveAttribute('aria-pressed', 'false');
    await expect(video).toHaveCSS('transform', 'none');

    // クリック後: aria-pressed=true、scaleX(-1)が適用
    await mirrorBtn.click();
    await expect(mirrorBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(video).toHaveCSS('transform', 'matrix(-1, 0, 0, 1, 0, 0)');

    // 再度クリック: aria-pressed=false、transformなし
    await mirrorBtn.click();
    await expect(mirrorBtn).toHaveAttribute('aria-pressed', 'false');
    await expect(video).toHaveCSS('transform', 'none');
  });
});

test.describe('Webcam Test（英語版）', () => {
  test('英語版でも開始でき、解像度が表示される', async ({ page }) => {
    await page.goto('/en/tools/webcam-tester/');
    await page.locator('#webcam-camera-toggle').click();
    await expect(page.locator('#webcam-info-resolution')).toContainText('×');
  });
});

test.describe('権限拒否時（日本語版）', () => {
  test.use({ permissions: [] });

  test('カメラが許可されないとエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/webcam-tester/');
    // --use-fake-ui を外すため、getUserMedia を拒否例外に差し替える
    await page.evaluate(() => {
      navigator.mediaDevices.getUserMedia = () =>
        Promise.reject(new DOMException('denied', 'NotAllowedError'));
    });
    await page.locator('#webcam-camera-toggle').click();
    await expect(page.locator('#webcam-error')).toBeVisible();
    await expect(page.locator('#webcam-error')).toContainText('許可');
    await expect(page.locator('#webcam-camera-toggle')).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });
});

test.describe('全画面表示（日本語版）', () => {
  test('全画面ボタンで映像エリアが全画面になり、再度押すと戻る', async ({
    page,
  }) => {
    await page.goto('/tools/webcam-tester/');
    const button = page.locator('#webcam-fullscreen');
    await expect(button).toBeVisible();

    await button.click();
    await expect
      .poll(() => page.evaluate(() => document.fullscreenElement?.id ?? null))
      .toBe('webcam-stage');
    await expect(button).toHaveAttribute('aria-label', '全画面を終了');

    await button.click();
    await expect
      .poll(() => page.evaluate(() => document.fullscreenElement))
      .toBeNull();
    await expect(button).toHaveAttribute('aria-label', '全画面表示');
  });
});

test.describe('マイクのみ失敗時（日本語版）', () => {
  test.use({ permissions: ['camera'] });

  test('オーディオ付きgetUserMediaが拒否されるとマイクボタンがOFFに戻る', async ({
    page,
  }) => {
    await page.goto('/tools/webcam-tester/');
    // マイクを有効にする
    await page.locator('#webcam-mic-toggle').click();
    await expect(page.locator('#webcam-mic-toggle')).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    // getUserMedia を差し替えてオーディオリクエスト時のみ拒否
    await page.evaluate(() => {
      const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(
        navigator.mediaDevices,
      );
      navigator.mediaDevices.getUserMedia = (constraints) => {
        // audio付きのリクエストは拒否
        if (
          constraints &&
          typeof constraints === 'object' &&
          'audio' in constraints &&
          constraints.audio
        ) {
          return Promise.reject(
            new DOMException('audio denied', 'NotAllowedError'),
          );
        }
        return originalGetUserMedia(constraints);
      };
    });

    // カメラ開始を試みる（マイクも含まれる）
    await page.locator('#webcam-camera-toggle').click();

    // エラーが表示される
    await expect(page.locator('#webcam-error')).toBeVisible();
    // マイクボタンがOFFに戻る
    await expect(page.locator('#webcam-mic-toggle')).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });
});

test.describe('375pxレイアウト（日本語版）', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('375pxでコントロールバー・メーター・プレースホルダーが重ならない', async ({
    page,
  }) => {
    await page.goto('/tools/webcam-tester/');

    // カメラ開始
    await page.locator('#webcam-camera-toggle').click();
    await expect(page.locator('#webcam-placeholder')).toBeHidden();

    // マイク有効化
    await page.locator('#webcam-mic-toggle').click();

    // メーターが表示されるまで待機
    await expect(page.locator('#webcam-level-wrap')).toBeVisible();

    // 各要素のバウンディングボックスを取得
    const stage = await page.locator('#webcam-stage').boundingBox();
    const levelWrap = await page.locator('#webcam-level-wrap').boundingBox();
    const mirrorBtn = await page.locator('#webcam-mirror').boundingBox();
    const fullscreenBtn = await page
      .locator('#webcam-fullscreen')
      .boundingBox();
    const cameraBtn = await page.locator('#webcam-camera-toggle').boundingBox();
    const micBtn = await page.locator('#webcam-mic-toggle').boundingBox();

    // Nullガードを明示的にexpectで行う
    expect(stage).not.toBeNull();
    expect(levelWrap).not.toBeNull();
    expect(mirrorBtn).not.toBeNull();
    expect(cameraBtn).not.toBeNull();
    expect(micBtn).not.toBeNull();

    // メーターはステージ内か確認
    if (levelWrap && stage) {
      expect(levelWrap.x).toBeGreaterThanOrEqual(stage.x);
      expect(levelWrap.x + levelWrap.width).toBeLessThanOrEqual(
        stage.x + stage.width,
      );
      expect(levelWrap.y).toBeGreaterThanOrEqual(stage.y);
      expect(levelWrap.y + levelWrap.height).toBeLessThanOrEqual(
        stage.y + stage.height,
      );
    }

    // ボタンが互いに交差していないことを確認
    const buttons = [
      { name: 'camera', box: cameraBtn },
      { name: 'mic', box: micBtn },
      { name: 'mirror', box: mirrorBtn },
      ...(fullscreenBtn ? [{ name: 'fullscreen', box: fullscreenBtn }] : []),
    ];

    for (let i = 0; i < buttons.length; i++) {
      for (let j = i + 1; j < buttons.length; j++) {
        const btn1 = buttons[i].box;
        const btn2 = buttons[j].box;
        if (btn1 && btn2) {
          // 交差していない: btn1.right <= btn2.left || btn2.right <= btn1.left || btn1.bottom <= btn2.top || btn2.bottom <= btn1.top
          const noOverlapHorizontal =
            btn1.x + btn1.width <= btn2.x || btn2.x + btn2.width <= btn1.x;
          const noOverlapVertical =
            btn1.y + btn1.height <= btn2.y || btn2.y + btn2.height <= btn1.y;
          const noOverlap = noOverlapHorizontal || noOverlapVertical;
          expect(noOverlap).toBe(true);
        }
      }
    }
  });

  test('375pxでプレースホルダー表示時（カメラOFF）に、アイコンと文言がステージ内に収まる', async ({
    page,
  }) => {
    await page.goto('/tools/webcam-tester/');

    // カメラがOFF状態でプレースホルダーが表示されている
    await expect(page.locator('#webcam-placeholder')).toBeVisible();

    const stage = await page.locator('#webcam-stage').boundingBox();
    const placeholder = await page.locator('#webcam-placeholder').boundingBox();
    const controlBar = await page.evaluate(() => {
      const bar = document.querySelector(
        '#webcam-stage > div:last-child',
      ) as HTMLElement | null;
      if (!bar) return null;
      const rect = bar.getBoundingClientRect();
      return {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      };
    });

    expect(stage).not.toBeNull();
    expect(placeholder).not.toBeNull();

    // プレースホルダーはステージ内か確認
    if (stage && placeholder) {
      expect(placeholder.x).toBeGreaterThanOrEqual(stage.x);
      expect(placeholder.x + placeholder.width).toBeLessThanOrEqual(
        stage.x + stage.width,
      );
      expect(placeholder.y).toBeGreaterThanOrEqual(stage.y);
      expect(placeholder.y + placeholder.height).toBeLessThanOrEqual(
        stage.y + stage.height,
      );
    }

    // プレースホルダーとコントロールバーが重ならないか確認
    if (placeholder && controlBar) {
      // placeholder.bottom <= controlBar.top || controlBar.bottom <= placeholder.top
      const noOverlap =
        placeholder.y + placeholder.height <= controlBar.y ||
        controlBar.y + controlBar.height <= placeholder.y;
      expect(noOverlap).toBe(true);
    }
  });
});

test.describe('375pxレイアウト（英語版）', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('375pxでプレースホルダー表示時（カメラOFF）に、アイコンと文言がステージ内に収まる', async ({
    page,
  }) => {
    await page.goto('/en/tools/webcam-tester/');

    // カメラがOFF状態でプレースホルダーが表示されている
    await expect(page.locator('#webcam-placeholder')).toBeVisible();

    const stage = await page.locator('#webcam-stage').boundingBox();
    const placeholder = await page.locator('#webcam-placeholder').boundingBox();
    const controlBar = await page.evaluate(() => {
      const bar = document.querySelector(
        '#webcam-stage > div:last-child',
      ) as HTMLElement | null;
      if (!bar) return null;
      const rect = bar.getBoundingClientRect();
      return {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      };
    });

    expect(stage).not.toBeNull();
    expect(placeholder).not.toBeNull();

    // プレースホルダーはステージ内か確認
    if (stage && placeholder) {
      expect(placeholder.x).toBeGreaterThanOrEqual(stage.x);
      expect(placeholder.x + placeholder.width).toBeLessThanOrEqual(
        stage.x + stage.width,
      );
      expect(placeholder.y).toBeGreaterThanOrEqual(stage.y);
      expect(placeholder.y + placeholder.height).toBeLessThanOrEqual(
        stage.y + stage.height,
      );
    }

    // プレースホルダーとコントロールバーが重ならないか確認
    if (placeholder && controlBar) {
      const noOverlap =
        placeholder.y + placeholder.height <= controlBar.y ||
        controlBar.y + controlBar.height <= placeholder.y;
      expect(noOverlap).toBe(true);
    }
  });
});
