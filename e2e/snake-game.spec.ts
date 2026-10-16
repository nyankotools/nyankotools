import { test, expect } from './helpers/test';

const PATHS = [
  {
    path: '/tools/snake-game/',
    start: 'ゲーム開始',
    pause: '一時停止',
    gameOver: 'ゲームオーバー',
  },
  {
    path: '/en/tools/snake-game/',
    start: 'Start game',
    pause: 'Pause',
    gameOver: 'Game over',
  },
];

for (const { path, start, pause, gameOver } of PATHS) {
  test.describe(`スネークゲーム ${path}`, () => {
    test('開始前は一時停止が押せず、スコア0・長さ3', async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('#snake-root')).toHaveAttribute(
        'data-mode',
        'idle',
      );
      await expect(page.locator('#snake-pause-button')).toBeDisabled();
      await expect(page.locator('#snake-score')).toHaveText('0');
      await expect(page.locator('#snake-length')).toHaveText('3');
    });

    test('開始ボタンで始まり、一時停止・Pキーで再開できる', async ({
      page,
    }) => {
      await page.goto(path);
      await page.getByRole('button', { name: start }).click();
      const root = page.locator('#snake-root');
      await expect(root).toHaveAttribute('data-mode', 'playing');
      await page.getByRole('button', { name: pause }).click();
      await expect(root).toHaveAttribute('data-mode', 'paused');
      await page.keyboard.press('p');
      await expect(root).toHaveAttribute('data-mode', 'playing');
    });

    test('盤面にフォーカスしたスペースキーで開始できる', async ({ page }) => {
      await page.goto(path);
      await page.locator('#snake-canvas').focus();
      await page.keyboard.press('Space');
      await expect(page.locator('#snake-root')).toHaveAttribute(
        'data-mode',
        'playing',
      );
    });

    test('開始前、ページ本文にフォーカスがあるスペースキーでは開始しない', async ({
      page,
    }) => {
      await page.goto(path);
      await page.locator('h1').click();
      await page.keyboard.press('Space');
      await expect(page.locator('#snake-root')).toHaveAttribute(
        'data-mode',
        'idle',
      );
    });

    test('壁にぶつかるとゲームオーバーになり、800ms後にスペースで再開できる', async ({
      page,
    }) => {
      await page.clock.install();
      await page.goto(path);
      const root = page.locator('#snake-root');
      await page.locator('#snake-canvas').focus();
      await page.keyboard.press('Space');
      await expect(root).toHaveAttribute('data-mode', 'playing');

      // 右向きのまま進み続ければ、いずれ壁に当たる
      for (
        let i = 0;
        i < 100 && (await root.getAttribute('data-mode')) === 'playing';
        i++
      ) {
        await page.clock.runFor(200);
      }
      await expect(root).toHaveAttribute('data-mode', 'over');
      await expect(page.locator('#snake-status')).toContainText(gameOver);

      await page.keyboard.press('Space');
      await expect(root).toHaveAttribute('data-mode', 'over');
      await page.clock.runFor(900);
      await page.keyboard.press('Space');
      await expect(root).toHaveAttribute('data-mode', 'playing');
      await expect(page.locator('#snake-score')).toHaveText('0');
    });

    test('反対向きの入力は無視され、曲がる入力は反映される（自滅しない）', async ({
      page,
    }) => {
      await page.clock.install();
      await page.goto(path);
      const root = page.locator('#snake-root');
      await page.locator('#snake-canvas').focus();
      await page.keyboard.press('Space');
      // 右向きに進んでいるときの「左」は無視されるので、すぐには終わらない
      await page.keyboard.press('ArrowLeft');
      await page.clock.runFor(500);
      await expect(root).toHaveAttribute('data-mode', 'playing');
      // 上へ曲がって進むと、いずれ上の壁に当たる
      await page.keyboard.press('ArrowUp');
      for (
        let i = 0;
        i < 100 && (await root.getAttribute('data-mode')) === 'playing';
        i++
      ) {
        await page.clock.runFor(200);
      }
      await expect(root).toHaveAttribute('data-mode', 'over');
    });

    test('画面の矢印ボタンで曲がれる', async ({ page }) => {
      await page.clock.install();
      await page.goto(path);
      const root = page.locator('#snake-root');
      await page.getByRole('button', { name: start }).click();
      await expect(root).toHaveAttribute('data-mode', 'playing');
      await page.locator('[data-control="down"]').dispatchEvent('pointerdown');
      for (
        let i = 0;
        i < 100 && (await root.getAttribute('data-mode')) === 'playing';
        i++
      ) {
        await page.clock.runFor(200);
      }
      await expect(root).toHaveAttribute('data-mode', 'over');
    });

    test('ゲームオーバー時のスコア（0以上）がベストとして保存される', async ({
      page,
    }) => {
      await page.clock.install();
      await page.goto(path);
      const root = page.locator('#snake-root');
      await page.getByRole('button', { name: start }).click();
      for (
        let i = 0;
        i < 100 && (await root.getAttribute('data-mode')) === 'playing';
        i++
      ) {
        await page.clock.runFor(200);
      }
      await expect(root).toHaveAttribute('data-mode', 'over');
      const score = Number(await page.locator('#snake-score').textContent());
      await expect(page.locator('#snake-best')).toHaveText(String(score));
    });

    test('タブが隠れると自動で一時停止する', async ({ page }) => {
      await page.goto(path);
      const root = page.locator('#snake-root');
      await page.getByRole('button', { name: start }).click();
      await expect(root).toHaveAttribute('data-mode', 'playing');
      await page.evaluate(() => window.dispatchEvent(new Event('blur')));
      await expect(root).toHaveAttribute('data-mode', 'paused');
    });

    test('ゲーム開始ボタンを押すと、続けてスペースで操作できるよう盤面にフォーカスが移る', async ({
      page,
    }) => {
      await page.goto(path);
      await page.getByRole('button', { name: start }).click();
      await expect(page.locator('#snake-canvas')).toBeFocused();
    });

    test('一時停止中にキーボードで矢印ボタンを押すと再開する（Enter で操作できる）', async ({
      page,
    }) => {
      await page.goto(path);
      const root = page.locator('#snake-root');
      await page.getByRole('button', { name: start }).click();
      await page.getByRole('button', { name: pause }).click();
      await expect(root).toHaveAttribute('data-mode', 'paused');
      await page.locator('[data-control="down"]').focus();
      await page.keyboard.press('Enter');
      await expect(root).toHaveAttribute('data-mode', 'playing');
    });

    test('保存済みのベストスコアを読み込み、ゲームオーバー後も維持される', async ({
      page,
    }) => {
      await page.clock.install();
      await page.goto(path);
      await page.evaluate(() => localStorage.setItem('snake-game-best', '50'));
      await page.reload();
      const root = page.locator('#snake-root');
      await expect(page.locator('#snake-best')).toHaveText('50');

      await page.getByRole('button', { name: start }).click();
      for (
        let i = 0;
        i < 100 && (await root.getAttribute('data-mode')) === 'playing';
        i++
      ) {
        await page.clock.runFor(200);
      }
      await expect(root).toHaveAttribute('data-mode', 'over');
      // スコアが50を超えない限り、ベストは保存値の50のまま
      const score = Number(await page.locator('#snake-score').textContent());
      await expect(page.locator('#snake-best')).toHaveText(
        String(Math.max(50, score)),
      );
      const saved = await page.evaluate(() =>
        localStorage.getItem('snake-game-best'),
      );
      expect(Number(saved)).toBe(Math.max(50, score));
    });
  });
}
