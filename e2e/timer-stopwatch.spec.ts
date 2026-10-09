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

test('ぴったりチャレンジ: カウントが隠れ、ストップすると記録と差が残る', async ({
  page,
}) => {
  await page.goto('/tools/timer-stopwatch/');
  await page.getByRole('button', { name: 'ぴったりチャレンジ' }).click();
  await expect(page.locator('#ts-message')).toContainText('10秒ぴったり');
  await page.locator('#ts-target').fill('1');
  await page.locator('#ts-main-button').click();
  await expect(page.locator('#ts-display')).toHaveText('??:??.??');
  await expect(page.locator('#ts-main-button')).toHaveText('ストップ');
  await page.waitForTimeout(1000);
  await page.locator('#ts-main-button').click();
  await expect(page.locator('#ts-display')).toHaveText(/^00:0[01]\.\d\d$/);
  await expect(page.locator('#ts-message')).toContainText('目標との差');
  await expect(page.locator('#ts-attempts tr')).toHaveCount(1);
  await expect(page.locator('#ts-best')).toContainText('ベスト: 1回目');
  await page.locator('#ts-main-button').click();
  await page.waitForTimeout(300);
  await page.locator('#ts-main-button').click();
  await expect(page.locator('#ts-attempts tr')).toHaveCount(2);
  await page.locator('#ts-reset-button').click();
  await expect(page.locator('#ts-attempts-wrap')).toBeHidden();
  await expect(page.locator('#ts-display')).toHaveText('00:00.00');
});

test('ぴったりチャレンジ: カウントを隠さなければ経過が見え、不正な目標はエラー', async ({
  page,
}) => {
  await page.goto('/tools/timer-stopwatch/');
  await page.getByRole('button', { name: 'ぴったりチャレンジ' }).click();
  await page.locator('#ts-hide').uncheck();
  await page.locator('#ts-main-button').click();
  await expect(page.locator('#ts-display')).not.toHaveText('??:??.??');
  await page.locator('#ts-main-button').click();
  await page.locator('#ts-target').fill('0');
  await page.locator('#ts-main-button').click();
  await expect(page.locator('#ts-error')).not.toBeEmpty();
  await expect(page.locator('#ts-main-button')).toHaveText('スタート');
});

test('ぴったりチャレンジ: 計測中にモードを切り替えても他モードは動き、戻ると計測が続く', async ({
  page,
}) => {
  await page.goto('/tools/timer-stopwatch/');
  await page.getByRole('button', { name: 'ぴったりチャレンジ' }).click();
  await page.locator('#ts-main-button').click();
  await expect(page.locator('#ts-display')).toHaveText('??:??.??');

  // 別モード（ストップウォッチ）で計測を始めても、チャレンジの表示は乱れない
  await page
    .getByRole('button', { name: 'ストップウォッチ', exact: true })
    .click();
  await expect(page.locator('#ts-panel-challenge')).toBeHidden();
  await page.locator('#ts-main-button').click();
  await page.waitForTimeout(300);
  await page.locator('#ts-lap-button').click();
  await expect(page.locator('#ts-laps tr')).toHaveCount(1);
  await expect(page.locator('#ts-display')).not.toHaveText('00:00.00');
  await page.locator('#ts-main-button').click(); // ストップウォッチを一時停止
  await expect(page.locator('#ts-main-button')).toHaveText('再開');

  // チャレンジに戻ると、隠した計測中の表示とストップ操作が残っている
  await page.getByRole('button', { name: 'ぴったりチャレンジ' }).click();
  await expect(page.locator('#ts-display')).toHaveText('??:??.??');
  await expect(page.locator('#ts-main-button')).toHaveText('ストップ');
  await page.locator('#ts-main-button').click();
  await expect(page.locator('#ts-attempts tr')).toHaveCount(1);
  await expect(page.locator('#ts-laps-wrap')).toBeVisible(); // ストップウォッチ側の記録は残る
});

test('ぴったりチャレンジ: 目標秒数を変えるとヒントが更新される', async ({
  page,
}) => {
  await page.goto('/tools/timer-stopwatch/');
  await page.getByRole('button', { name: 'ぴったりチャレンジ' }).click();
  await page.locator('#ts-target').fill('3');
  await expect(page.locator('#ts-message')).toContainText('3秒ぴったり');
  await page.locator('#ts-target').fill('7');
  await expect(page.locator('#ts-message')).toContainText('7秒ぴったり');
});

test('ぴったりチャレンジ: 再読み込み後も保存された目標でヒントが更新される', async ({
  page,
}) => {
  await page.goto('/tools/timer-stopwatch/');
  await page.getByRole('button', { name: 'ぴったりチャレンジ' }).click();
  await page.locator('#ts-target').fill('3');
  await page.waitForTimeout(500); // 入力保持の保存（300ms遅延）を待つ
  await page.reload();
  // 再読み込み直後はストップウォッチ。保存された目標（3秒）がチャレンジのヒントに出ないこと
  await page.getByRole('button', { name: 'ぴったりチャレンジ' }).click();
  await expect(page.locator('#ts-message')).toContainText('3秒ぴったり');
  await page.locator('#ts-target').fill('5');
  await expect(page.locator('#ts-message')).toContainText('5秒ぴったり');
});

test('ぴったりチャレンジの目標を復元後にストップウォッチへ戻しても、別モードにヒントが残らない', async ({
  page,
}) => {
  await page.goto('/tools/timer-stopwatch/');
  await page.getByRole('button', { name: 'ぴったりチャレンジ' }).click();
  await page.locator('#ts-target').fill('3');
  await page.waitForTimeout(500);
  await page.reload();
  // 再読み込み直後（ストップウォッチ表示中）は、復元処理によるヒントが出ていてはいけない
  await expect(page.locator('#ts-message')).toBeEmpty();
});

test('375px: 記録表やポモドーロ設定が増えても横スクロールが出ない', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/tools/timer-stopwatch/');
  const hasOverflow = () =>
    page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
  await page.getByRole('button', { name: 'ぴったりチャレンジ' }).click();
  await page.locator('#ts-target').fill('1');
  await page.locator('#ts-hide').uncheck();
  for (let i = 0; i < 3; i++) {
    await page.locator('#ts-main-button').click();
    await page.locator('#ts-main-button').click();
  }
  await expect(page.locator('#ts-attempts tr')).toHaveCount(3);
  expect(await hasOverflow(), 'ぴったりチャレンジの記録表').toBe(false);
  await page.getByRole('button', { name: 'ポモドーロ' }).click();
  expect(await hasOverflow(), 'ポモドーロの設定').toBe(false);
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
