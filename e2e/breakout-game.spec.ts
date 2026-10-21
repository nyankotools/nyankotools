import { test, expect, type Page } from './helpers/test';

const PATHS = [
  {
    path: '/tools/breakout-game/',
    start: 'ゲーム開始',
    pause: '一時停止',
    gameOver: 'ゲームオーバー',
  },
  {
    path: '/en/tools/breakout-game/',
    start: 'Start game',
    pause: 'Pause',
    gameOver: 'Game over',
  },
];

/** パドル（#38bdf8）が描かれたピクセルの横方向の中心を canvas から求める（x は論理座標の px） */
function readPaddleX(page: Page) {
  return page.locator('#breakout-canvas').evaluate((c: HTMLCanvasElement) => {
    const ctx = c.getContext('2d')!;
    const { data, width, height } = ctx.getImageData(0, 0, c.width, c.height);
    let sum = 0;
    let n = 0;
    for (let y = Math.floor(height * 0.85); y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        if (
          Math.abs(data[i] - 56) < 8 &&
          Math.abs(data[i + 1] - 189) < 8 &&
          Math.abs(data[i + 2] - 248) < 8
        ) {
          sum += x;
          n++;
        }
      }
    }
    return n > 0 ? sum / n / 2 : null;
  });
}

for (const { path, start, pause, gameOver } of PATHS) {
  test.describe(`ブロック崩し ${path}`, () => {
    test('開始前は一時停止が押せず、スコア0・残機3・ステージ1', async ({
      page,
    }) => {
      await page.goto(path);
      await expect(page.locator('#breakout-root')).toHaveAttribute(
        'data-mode',
        'idle',
      );
      await expect(page.locator('#breakout-pause-button')).toBeDisabled();
      await expect(page.locator('#breakout-score')).toHaveText('0');
      await expect(page.locator('#breakout-lives')).toHaveText('3');
      await expect(page.locator('#breakout-level')).toHaveText('1');
    });

    test('開始ボタンで始まり、一時停止・再開できる', async ({ page }) => {
      await page.goto(path);
      await page.getByRole('button', { name: start }).click();
      const root = page.locator('#breakout-root');
      await expect(root).toHaveAttribute('data-mode', 'playing');
      await page.getByRole('button', { name: pause }).click();
      await expect(root).toHaveAttribute('data-mode', 'paused');
      await page.keyboard.press('p');
      await expect(root).toHaveAttribute('data-mode', 'playing');
    });

    test('矢印キー・画面ボタン・マウスでパドルが動く', async ({ page }) => {
      await page.goto(path);
      await page.locator('#breakout-canvas').focus();
      await page.keyboard.press('Space');
      await expect(page.locator('#breakout-root')).toHaveAttribute(
        'data-mode',
        'playing',
      );
      const x0 = await readPaddleX(page);
      expect(x0).not.toBeNull();

      await page.keyboard.down('ArrowRight');
      await page.waitForTimeout(400);
      await page.keyboard.up('ArrowRight');
      const x1 = await readPaddleX(page);
      expect(x1!).toBeGreaterThan(x0! + 20);

      const left = page.locator('[data-control="left"]');
      await left.dispatchEvent('pointerdown');
      await page.waitForTimeout(400);
      await left.dispatchEvent('pointerup');
      const x2 = await readPaddleX(page);
      expect(x2!).toBeLessThan(x1! - 20);

      const box = (await page.locator('#breakout-canvas').boundingBox())!;
      await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.5);
      await expect
        .poll(async () => (await readPaddleX(page))!)
        .toBeLessThan(100);
    });

    test('画面ボタンの「発射」でも開始でき、盤面のタップで発射できる', async ({
      page,
    }) => {
      await page.goto(path);
      await page
        .locator('[data-control="launch"]')
        .dispatchEvent('pointerdown');
      await expect(page.locator('#breakout-root')).toHaveAttribute(
        'data-mode',
        'playing',
      );
      await page.locator('#breakout-canvas').click();
      await expect(page.locator('#breakout-root')).toHaveAttribute(
        'data-mode',
        'playing',
      );
    });

    test('盤面は touch-action: none でスクロールを奪わない', async ({
      page,
    }) => {
      await page.goto(path);
      const action = await page
        .locator('#breakout-canvas')
        .evaluate((el) => getComputedStyle(el).touchAction);
      expect(action).toBe('none');
    });

    test('開始前、ページ本文にフォーカスがあるスペースキーでは開始しない', async ({
      page,
    }) => {
      await page.goto(path);
      await page.locator('h1').click();
      await page.keyboard.press('Space');
      await expect(page.locator('#breakout-root')).toHaveAttribute(
        'data-mode',
        'idle',
      );
    });

    test('ウィンドウから離れると自動で一時停止し、キーで再開できる', async ({
      page,
    }) => {
      await page.goto(path);
      const root = page.locator('#breakout-root');
      await page.locator('#breakout-canvas').focus();
      await page.keyboard.press('Space');
      await expect(root).toHaveAttribute('data-mode', 'playing');
      await page.evaluate(() => window.dispatchEvent(new Event('blur')));
      await expect(root).toHaveAttribute('data-mode', 'paused');
      await page.keyboard.press('p');
      await expect(root).toHaveAttribute('data-mode', 'playing');
    });

    test('ボールを落とし続けるとゲームオーバーになり、ベストが保存され、800ms後に再開できる', async ({
      page,
    }) => {
      await page.clock.install();
      await page.goto(path);
      const root = page.locator('#breakout-root');
      await page.locator('#breakout-canvas').focus();
      await page.keyboard.press('Space');
      await expect(root).toHaveAttribute('data-mode', 'playing');

      // パドルを左端に寄せ、発射し続けて、何度かボールを落とす
      await page.keyboard.down('ArrowLeft');
      for (
        let i = 0;
        i < 3000 && (await root.getAttribute('data-mode')) === 'playing';
        i++
      ) {
        await page.keyboard.press('Space');
        await page.clock.runFor(100);
      }
      await page.keyboard.up('ArrowLeft');
      await expect(root).toHaveAttribute('data-mode', 'over');
      await expect(page.locator('#breakout-status')).toContainText(gameOver);

      const score = Number(await page.locator('#breakout-score').textContent());
      const stored = await page.evaluate(() =>
        localStorage.getItem('breakout-game-best'),
      );
      expect(Number(stored ?? 0)).toBe(score);

      // 終了直後の連打は無視される
      await page.keyboard.press('Space');
      await expect(root).toHaveAttribute('data-mode', 'over');
      await page.clock.runFor(900);
      await page.keyboard.press('Space');
      await expect(root).toHaveAttribute('data-mode', 'playing');
      await expect(page.locator('#breakout-score')).toHaveText('0');
      await expect(page.locator('#breakout-lives')).toHaveText('3');
    });
  });
}
