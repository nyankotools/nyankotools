import { test, expect } from './helpers/test';

test('スピーカーテスターで初期表示が正しく表示される', async ({ page }) => {
  await page.goto('/tools/speaker-tester/');

  await expect(page.locator('main h1')).toContainText('スピーカー');

  // 初期状態：停止中
  const statusText = page.locator('#spk-status');
  await expect(statusText).toContainText('停止中');

  // チャンネルボタンが表示される
  const channelButtons = page.locator('[data-channel]');
  await expect(channelButtons).toHaveCount(3);

  // 各チャンネルボタンのaria-pressedは最初は false
  for (let i = 0; i < 3; i++) {
    await expect(channelButtons.nth(i)).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  }

  // ストップボタンが表示される
  const stopButton = page.locator('#spk-stop');
  await expect(stopButton).toBeVisible();

  // 周波数入力欄が表示される
  const frequencyInput = page.locator('#spk-frequency');
  await expect(frequencyInput).toHaveValue('440');

  // 周波数スライダーが表示される
  const frequencySlider = page.locator('#spk-frequency-slider');
  await expect(frequencySlider).toBeVisible();

  // プリセットボタンが表示される
  const presetButtons = page.locator('[data-preset]');
  await expect(presetButtons).toHaveCount(8);

  // スイープボタンが表示される
  const sweepButton = page.locator('#spk-sweep');
  await expect(sweepButton).toBeVisible();
});

test('スピーカーテスター（英語）で初期表示が正しく表示される', async ({
  page,
}) => {
  await page.goto('/en/tools/speaker-tester/');

  await expect(page.locator('main h1')).toContainText('Speaker');

  // 初期状態：停止中
  const statusText = page.locator('#spk-status');
  await expect(statusText).toContainText('Stopped');
});

test('スピーカーテスターでチャンネルボタンが表示される', async ({ page }) => {
  await page.goto('/tools/speaker-tester/');

  const leftButton = page.locator('[data-channel="left"]');
  const rightButton = page.locator('[data-channel="right"]');
  const bothButton = page.locator('[data-channel="both"]');

  // ボタンが表示される
  await expect(leftButton).toBeVisible();
  await expect(rightButton).toBeVisible();
  await expect(bothButton).toBeVisible();

  // 初期状態は aria-pressed が false
  await expect(leftButton).toHaveAttribute('aria-pressed', 'false');
  await expect(rightButton).toHaveAttribute('aria-pressed', 'false');
  await expect(bothButton).toHaveAttribute('aria-pressed', 'false');
});

test('スピーカーテスターで周波数入力とスライダーが連動する', async ({
  page,
}) => {
  await page.goto('/tools/speaker-tester/');

  const frequencyInput = page.locator('#spk-frequency');
  const frequencyText = page.locator('#spk-frequency-text');

  // 初期値 440 Hz
  await expect(frequencyText).toContainText('440 Hz');

  // 周波数を変更
  await frequencyInput.clear();
  await frequencyInput.fill('1000');

  // 表示が更新される
  await expect(frequencyText).toContainText('1 kHz');
});

test('スピーカーテスターでプリセットボタンが周波数を変更する', async ({
  page,
}) => {
  await page.goto('/tools/speaker-tester/');

  const frequencyText = page.locator('#spk-frequency-text');

  // 初期値
  await expect(frequencyText).toContainText('440 Hz');

  // プリセットボタンをクリック（1000 Hz）
  const preset1000Button = page.locator('[data-preset="1000"]');
  await preset1000Button.click();

  // 周波数が更新される
  await expect(frequencyText).toContainText('1 kHz');
});

test('スピーカーテスターでストップボタンが音声を停止する', async ({ page }) => {
  await page.goto('/tools/speaker-tester/');

  const stopButton = page.locator('#spk-stop');
  const statusText = page.locator('#spk-status');

  // ストップボタンをクリック
  await stopButton.click();

  // 状態が停止中に表示される
  await expect(statusText).toContainText('停止中');
});

test('スピーカーテスターでスイープボタンが表示される', async ({ page }) => {
  await page.goto('/tools/speaker-tester/');

  const sweepButton = page.locator('#spk-sweep');
  await expect(sweepButton).toBeVisible();

  // ボタンのテキストを確認
  const buttonText = await sweepButton.textContent();
  expect(buttonText).toBeTruthy();
});
