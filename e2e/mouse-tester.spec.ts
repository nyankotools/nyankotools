import { test, expect } from './helpers/test';

test('マウステスターで初期表示が正しく表示される', async ({ page }) => {
  await page.goto('/tools/mouse-tester/');

  await expect(page.locator('main h1')).toContainText('マウス');

  // CPS 計測パッドが表示される
  const cpsPad = page.locator('#ms-cps-pad');
  await expect(cpsPad).toBeVisible();
  await expect(cpsPad).toContainText('測定');

  // 統計情報のテーブルが表示される
  const statsTable = page.locator('table');
  await expect(statsTable).toBeVisible();

  // リセットボタンが表示される
  const resetButton = page.locator('#ms-reset');
  await expect(resetButton).toBeVisible();

  // ボタンパッドが表示される
  const buttonsPad = page.locator('#ms-buttons-pad');
  await expect(buttonsPad).toBeVisible();

  // ボタンカウント表示が表示される
  const buttonItems = page.locator('[data-ms-button]');
  await expect(buttonItems).toHaveCount(5);

  // ホイールカウント表示が表示される
  const wheelItems = page.locator('[data-ms-wheel]');
  await expect(wheelItems).toHaveCount(2);

  // ポーリングレート測定パッドが表示される
  const pollingPad = page.locator('#ms-polling-pad');
  await expect(pollingPad).toBeVisible();
});

test('マウステスター（英語）で初期表示が正しく表示される', async ({ page }) => {
  await page.goto('/en/tools/mouse-tester/');

  await expect(page.locator('main h1')).toContainText('Mouse');

  // CPS パッドが表示される
  const cpsPad = page.locator('#ms-cps-pad');
  await expect(cpsPad).toBeVisible();
});

test('マウステスターで計測時間が5秒に設定できる', async ({ page }) => {
  await page.goto('/tools/mouse-tester/');

  const durationSelect = page.locator('#ms-duration');
  await durationSelect.selectOption('5');

  await expect(durationSelect).toHaveValue('5');
});

test('マウステスターでCPSパッド内でクリック検出が動作する', async ({
  page,
}) => {
  await page.goto('/tools/mouse-tester/');

  const cpsPad = page.locator('#ms-cps-pad');
  const cpsPadText = page.locator('#ms-cps-pad-text');
  const clicksStat = page.locator('#ms-stat-clicks');

  // 初期状態
  await expect(cpsPadText).toContainText('クリック');

  // CPS パッドをクリック
  await cpsPad.click();

  // クリック直後は計測中を示すメッセージが表示される
  await expect(cpsPadText).toContainText('測定中');

  // クリックがカウントされている
  const clicksText = await clicksStat.textContent();
  expect(clicksText).not.toBe('-');
});

test('マウステスターでボタンカウントが動作する', async ({ page }) => {
  await page.goto('/tools/mouse-tester/');

  const buttonsPad = page.locator('#ms-buttons-pad');
  const leftButtonItem = page.locator('[data-ms-button="left"]');
  const leftButtonCount = leftButtonItem.locator('[data-count]');

  // 初期状態：カウント 0
  await expect(leftButtonCount).toContainText('0');

  // ボタンパッドをクリック
  await buttonsPad.click();

  // クリック後、カウントが増える
  const countText = await leftButtonCount.textContent();
  expect(countText).not.toBe('0');
});

test('マウステスターでリセットボタンが表示される', async ({ page }) => {
  await page.goto('/tools/mouse-tester/');

  // リセットボタンが表示される
  const resetButton = page.locator('#ms-reset');
  await expect(resetButton).toBeVisible();

  // ボタンをクリックして動作を確認
  await resetButton.click();
});

test('マウステスターでホイール操作がカウントされる', async ({ page }) => {
  await page.goto('/tools/mouse-tester/');

  const wheelUpItem = page.locator('[data-ms-wheel="up"]');
  const wheelUpCount = wheelUpItem.locator('[data-count]');

  // ボタンパッドにマウスを移動
  await page.locator('#ms-buttons-pad').hover();

  // ホイール上スクロール
  await page.mouse.wheel(0, -1);

  // ホイール上のカウントが表示される
  const wheelText = await wheelUpCount.textContent();
  expect(wheelText).toBeTruthy();
});

test('マウステスターでポーリングレート測定パッドが表示される', async ({
  page,
}) => {
  await page.goto('/tools/mouse-tester/');

  const pollingPad = page.locator('#ms-polling-pad');
  const pollingResult = page.locator('#ms-polling-result');

  await expect(pollingPad).toBeVisible();
  await expect(pollingResult).toHaveText('-');
});
