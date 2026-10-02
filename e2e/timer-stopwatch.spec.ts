import { test, expect } from './helpers/test';

test('ストップウォッチ: スタート・ラップ・リセットができる', async ({
  page,
}) => {
  await page.goto('/tools/timer-stopwatch/');
  const display = page.locator('#ts-display');
  await expect(display).toHaveText('00:00.00');
  await page.locator('#ts-main-button').click();
  await expect(display).not.toHaveText('00:00.00');
  await page.locator('#ts-lap-button').click();
  await expect(page.locator('#ts-laps tr')).toHaveCount(1);
  await page.locator('#ts-main-button').click(); // 一時停止
  await expect(page.locator('#ts-main-button')).toHaveText('再開');
  await page.locator('#ts-reset-button').click();
  await expect(display).toHaveText('00:00.00');
  await expect(page.locator('#ts-laps-wrap')).toBeHidden();
});

test('タイマー: 1秒のタイマーが終了メッセージを表示する', async ({ page }) => {
  await page.goto('/tools/timer-stopwatch/');
  await page.getByRole('button', { name: 'タイマー', exact: true }).click();
  await page.locator('#ts-minutes').fill('0');
  await page.locator('#ts-seconds').fill('1');
  await expect(page.locator('#ts-display')).toHaveText('00:01');
  await page.locator('#ts-sound').uncheck();
  await page.locator('#ts-main-button').click();
  await expect(page.locator('#ts-message')).toContainText('時間になりました', {
    timeout: 5000,
  });
});

test('タイマー: 0秒の入力はエラーになる', async ({ page }) => {
  await page.goto('/tools/timer-stopwatch/');
  await page.getByRole('button', { name: 'タイマー', exact: true }).click();
  await page.locator('#ts-minutes').fill('0');
  await page.locator('#ts-seconds').fill('0');
  await page.locator('#ts-main-button').click();
  await expect(page.locator('#ts-error')).not.toBeEmpty();
});

test('ポモドーロ: 初期表示は25:00で、スキップすると休憩に切り替わる', async ({
  page,
}) => {
  await page.goto('/tools/timer-stopwatch/');
  await page.getByRole('button', { name: 'ポモドーロ' }).click();
  await expect(page.locator('#ts-display')).toHaveText('25:00');
  await expect(page.locator('#ts-phase')).toContainText('作業');
  await page.locator('#ts-skip-button').click();
  await expect(page.locator('#ts-display')).toHaveText('05:00');
  await expect(page.locator('#ts-phase')).toContainText('短い休憩');
});

test('タイマー: 一時停止と再開ができる', async ({ page }) => {
  await page.goto('/tools/timer-stopwatch/');
  await page.getByRole('button', { name: 'タイマー', exact: true }).click();
  await page.locator('#ts-minutes').fill('0');
  await page.locator('#ts-seconds').fill('10');
  await page.locator('#ts-sound').uncheck();
  await page.locator('#ts-main-button').click();
  await page.waitForTimeout(500); // 少し進める
  await page.locator('#ts-main-button').click(); // 一時停止
  await expect(page.locator('#ts-main-button')).toHaveText('再開');
  const afterPause = await page.locator('#ts-display').textContent();
  await page.waitForTimeout(500);
  const stillPaused = await page.locator('#ts-display').textContent();
  // 一時停止中は表示が変わらない
  expect(afterPause).toBe(stillPaused);
  // 再開すると前に進む
  await page.locator('#ts-main-button').click();
  await expect(page.locator('#ts-main-button')).toHaveText('一時停止');
  await page.waitForTimeout(500);
  const afterResume = await page.locator('#ts-display').textContent();
  expect(afterResume).not.toBe(afterPause);
});

test('ポモドーロ: 複数回スキップして各フェーズが遷移する', async ({ page }) => {
  await page.goto('/tools/timer-stopwatch/');
  await page.getByRole('button', { name: 'ポモドーロ' }).click();
  // 最初は25:00（作業フェーズ）
  await expect(page.locator('#ts-display')).toHaveText('25:00');
  await expect(page.locator('#ts-phase')).toContainText('作業');
  // スキップして短い休憩（5:00）に
  await page.locator('#ts-skip-button').click();
  await expect(page.locator('#ts-display')).toHaveText('05:00');
  await expect(page.locator('#ts-phase')).toContainText('短い休憩');
  // スキップして作業（25:00）に戻る
  await page.locator('#ts-skip-button').click();
  await expect(page.locator('#ts-display')).toHaveText('25:00');
  await expect(page.locator('#ts-phase')).toContainText('作業');
});

test('Timer/Stopwatch: English page works', async ({ page }) => {
  await page.goto('/en/tools/timer-stopwatch/');
  const h1 = page.locator('h1');
  await expect(h1).toContainText('Timer');
  const stopwatchButton = page.getByRole('button', {
    name: 'Stopwatch',
    exact: true,
  });
  await expect(stopwatchButton).toBeVisible();
});
