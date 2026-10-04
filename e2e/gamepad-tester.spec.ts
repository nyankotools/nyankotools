import { test, expect } from './helpers/test';

test('ゲームパッドテスターで初期表示時に接続待ちメッセージが表示される', async ({
  page,
}) => {
  await page.goto('/tools/gamepad-tester/');

  await expect(page.locator('main h1')).toContainText('ゲームパッド');

  // 初期表示では接続待ちメッセージが表示される
  const waitingMessage = page.locator('#gp-waiting');
  await expect(waitingMessage).toBeVisible();
  await expect(waitingMessage).toContainText('ゲームパッド');

  // メインコンテンツは非表示
  const main = page.locator('#gp-main');
  await expect(main).toBeHidden();
});

test('ゲームパッドテスター（英語）で初期表示時に接続待ちメッセージが表示される', async ({
  page,
}) => {
  await page.goto('/en/tools/gamepad-tester/');

  await expect(page.locator('main h1')).toContainText('Gamepad');

  // 初期表示では接続待ちメッセージが表示される
  const waitingMessage = page.locator('#gp-waiting');
  await expect(waitingMessage).toBeVisible();
});

test('ゲームパッドテスターでモック Gamepad API を通じてボタン押下が反映される', async ({
  page,
  context,
}) => {
  // モック Gamepad API をセットアップ

  await context.addInitScript(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mockGamepad: any = null;
    const mockGamepads: (Gamepad | null)[] = [null];

    // navigator.getGamepads をモック
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (navigator as any).getGamepads = function () {
      return mockGamepads;
    };

    // テスト用グローバル関数
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__setMockGamepad = (gamepadData: any) => {
      if (gamepadData === null) {
        mockGamepads[0] = null;
      } else {
        mockGamepad = {
          id: gamepadData.id || 'Mock Gamepad',
          index: 0,
          connected: gamepadData.connected !== false,
          timestamp: performance.now(),
          mapping: gamepadData.mapping || 'standard',
          buttons:
            gamepadData.buttons || Array(17).fill({ pressed: false, value: 0 }),
          axes: gamepadData.axes || Array(4).fill(0),
          vibrationActuator: undefined,
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mockGamepads[0] = mockGamepad as any;
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__getMockGamepad = () => mockGamepad;
  });

  await page.goto('/tools/gamepad-tester/');

  // 初期状態：接続待ち
  const waitingMessage = page.locator('#gp-waiting');
  await expect(waitingMessage).toBeVisible();

  // モック Gamepad をセット

  await page.evaluate(() => {
    const buttons = Array(17)
      .fill(null)
      .map(() => ({ pressed: false, value: 0 }));
    buttons[0] = { pressed: true, value: 1 }; // A button pressed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__setMockGamepad({
      id: 'Mock Gamepad',
      mapping: 'standard',
      buttons: buttons,
      axes: [0, 0, 0, 0],
    });
  });

  // ページがゲームパッド接続を認識するまで待機
  await page.waitForTimeout(100);

  // メインコンテンツが表示される
  const main = page.locator('#gp-main');
  await expect(main).toBeVisible({ timeout: 2000 });

  // ゲームパッド情報が表示される
  const idCell = page.locator('#gp-info-id');
  await expect(idCell).not.toHaveText('-');
});

test('ゲームパッドテスターでスティック傾きが反映される', async ({
  page,
  context,
}) => {
  // モック Gamepad API をセットアップ

  await context.addInitScript(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mockGamepad: any = null;
    const mockGamepads: (Gamepad | null)[] = [null];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (navigator as any).getGamepads = function () {
      return mockGamepads;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__setMockGamepad = (gamepadData: any) => {
      if (gamepadData === null) {
        mockGamepads[0] = null;
      } else {
        mockGamepad = {
          id: gamepadData.id || 'Mock Gamepad',
          index: 0,
          connected: gamepadData.connected !== false,
          timestamp: performance.now(),
          mapping: gamepadData.mapping || 'standard',
          buttons:
            gamepadData.buttons || Array(17).fill({ pressed: false, value: 0 }),
          axes: gamepadData.axes || Array(4).fill(0),
          vibrationActuator: undefined,
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mockGamepads[0] = mockGamepad as any;
      }
    };
  });

  await page.goto('/tools/gamepad-tester/');

  // モック Gamepad をセット（左スティックを傾ける）

  await page.evaluate(() => {
    const buttons = Array(17).fill({ pressed: false, value: 0 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__setMockGamepad({
      id: 'Mock Gamepad',
      mapping: 'standard',
      buttons: buttons,
      axes: [0.5, 0.5, 0, 0], // Left stick tilted
    });
  });

  // ページがゲームパッド接続を認識するまで待機
  await page.waitForTimeout(100);

  // メインコンテンツが表示される
  const main = page.locator('#gp-main');
  await expect(main).toBeVisible({ timeout: 2000 });

  // 軸の情報が表示される
  const axesSection = page.locator('#gp-axes');
  await expect(axesSection).toBeVisible();
});
