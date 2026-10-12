import { test, expect, type Page } from './helpers/test';

const PATHS = [
  {
    path: '/tools/invaders-game/',
    start: 'ゲーム開始',
    pause: '一時停止',
    gameOver: 'ゲームオーバー',
  },
  {
    path: '/en/tools/invaders-game/',
    start: 'Start game',
    pause: 'Pause',
    gameOver: 'Game over',
  },
];

/**
 * 自機（#38bdf8）が描かれたピクセルの横方向の中心を canvas から求める（x は論理座標の px）。
 * 自機が見つからなければ null。下のほう（自機の高さ付近）だけを読む。
 */
function readPlayerX(page: Page) {
  return page.locator('#invaders-canvas').evaluate((c: HTMLCanvasElement) => {
    const ctx = c.getContext('2d')!;
    const { data, width, height } = ctx.getImageData(0, 0, c.width, c.height);
    const scale = 2;
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
    return n > 0 ? sum / n / scale : null;
  });
}

function snapshot(page: Page) {
  return page
    .locator('#invaders-canvas')
    .evaluate((c: HTMLCanvasElement) => c.toDataURL());
}

for (const { path, start, pause, gameOver } of PATHS) {
  test.describe(`インベーダーゲーム ${path}`, () => {
    test('開始前は一時停止が押せず、スコア0・残機3・ステージ1', async ({
      page,
    }) => {
      await page.goto(path);
      await expect(page.locator('#invaders-root')).toHaveAttribute(
        'data-mode',
        'idle',
      );
      await expect(page.locator('#invaders-pause-button')).toBeDisabled();
      await expect(page.locator('#invaders-score')).toHaveText('0');
      await expect(page.locator('#invaders-lives')).toHaveText('3');
      await expect(page.locator('#invaders-level')).toHaveText('1');
    });

    test('開始ボタンで始まり、一時停止・再開できる', async ({ page }) => {
      await page.goto(path);
      await page.getByRole('button', { name: start }).click();
      const root = page.locator('#invaders-root');
      await expect(root).toHaveAttribute('data-mode', 'playing');
      await page.getByRole('button', { name: pause }).click();
      await expect(root).toHaveAttribute('data-mode', 'paused');
      await page.keyboard.press('p');
      await expect(root).toHaveAttribute('data-mode', 'playing');
    });

    test('スペースキーで開始でき、撃ち続けると得点が入る', async ({ page }) => {
      await page.goto(path);
      await page.locator('#invaders-canvas').focus();
      await page.keyboard.press('Space');
      await expect(page.locator('#invaders-root')).toHaveAttribute(
        'data-mode',
        'playing',
      );
      // 隊列は左右に動くので、いずれ自機の真上の列に敵が来て当たる
      await page.keyboard.down('Space');
      const score = page.locator('#invaders-score');
      await expect
        .poll(async () => Number(await score.textContent()), {
          timeout: 15_000,
        })
        .toBeGreaterThan(0);
      await page.keyboard.up('Space');
    });

    test('画面ボタンの「発射」でも開始できる（スマホ）', async ({ page }) => {
      await page.goto(path);
      await page.locator('[data-control="fire"]').dispatchEvent('pointerdown');
      await expect(page.locator('#invaders-root')).toHaveAttribute(
        'data-mode',
        'playing',
      );
    });

    test('開始前、ページ本文にフォーカスがあるスペースキーでは開始せず、ページがスクロールする', async ({
      page,
    }) => {
      await page.goto(path);
      await expect(page.locator('#invaders-root')).toHaveAttribute(
        'data-mode',
        'idle',
      );
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.locator('h1').click();
      await page.keyboard.press('Space');
      await expect(page.locator('#invaders-root')).toHaveAttribute(
        'data-mode',
        'idle',
      );
      await expect
        .poll(() => page.evaluate(() => window.scrollY))
        .toBeGreaterThan(0);
    });

    test('矢印キー・A/D・画面ボタンで自機が左右に動く', async ({ page }) => {
      await page.goto(path);
      await page.locator('#invaders-canvas').focus();
      await page.keyboard.press('Space');
      await expect(page.locator('#invaders-root')).toHaveAttribute(
        'data-mode',
        'playing',
      );
      const x0 = await readPlayerX(page);
      expect(x0).not.toBeNull();

      await page.keyboard.down('ArrowRight');
      await page.waitForTimeout(400);
      await page.keyboard.up('ArrowRight');
      const x1 = await readPlayerX(page);
      expect(x1!).toBeGreaterThan(x0! + 20);

      await page.keyboard.down('a');
      await page.waitForTimeout(600);
      await page.keyboard.up('a');
      const x2 = await readPlayerX(page);
      expect(x2!).toBeLessThan(x1! - 20);

      const right = page.locator('[data-control="right"]');
      await right.dispatchEvent('pointerdown');
      await page.waitForTimeout(400);
      await right.dispatchEvent('pointerup');
      const x3 = await readPlayerX(page);
      expect(x3!).toBeGreaterThan(x2! + 20);
    });

    test('一時停止中は画面が止まり、スペースキーで再開すると動き出す', async ({
      page,
    }) => {
      await page.goto(path);
      const root = page.locator('#invaders-root');
      await page.locator('#invaders-canvas').focus();
      await page.keyboard.press('Space');
      await expect(root).toHaveAttribute('data-mode', 'playing');
      await page.getByRole('button', { name: pause }).click();
      await expect(root).toHaveAttribute('data-mode', 'paused');
      const frozen = await snapshot(page);
      await page.waitForTimeout(700);
      expect(await snapshot(page)).toBe(frozen);

      await page.keyboard.press('Space');
      await expect(root).toHaveAttribute('data-mode', 'playing');
      await page.waitForTimeout(700);
      expect(await snapshot(page)).not.toBe(frozen);
    });

    test('ウィンドウから離れる・タブが隠れると自動で一時停止し、キーで再開できる', async ({
      page,
    }) => {
      await page.goto(path);
      const root = page.locator('#invaders-root');
      await page.locator('#invaders-canvas').focus();
      await page.keyboard.press('Space');
      await expect(root).toHaveAttribute('data-mode', 'playing');

      // 実際のタブ切り替えは再現できないので、同じイベントを発火させる
      await page.evaluate(() => window.dispatchEvent(new Event('blur')));
      await expect(root).toHaveAttribute('data-mode', 'paused');
      await page.keyboard.press('p');
      await expect(root).toHaveAttribute('data-mode', 'playing');

      await page.evaluate(() => {
        Object.defineProperty(document, 'hidden', {
          configurable: true,
          get: () => true,
        });
        document.dispatchEvent(new Event('visibilitychange'));
      });
      await expect(root).toHaveAttribute('data-mode', 'paused');
      await page.evaluate(() => {
        Object.defineProperty(document, 'hidden', {
          configurable: true,
          get: () => false,
        });
      });
      await page.keyboard.press('p');
      await expect(root).toHaveAttribute('data-mode', 'playing');
    });

    test('ゲームオーバー後は800msの間は再開できず、その後スペースで再開でき、ベストが保存される', async ({
      page,
    }) => {
      // ゲーム内の時間（rAF・performance.now）を進めて、ゲームオーバーまで決定的に進める
      await page.clock.install();
      await page.goto(path);
      const root = page.locator('#invaders-root');
      await page.locator('#invaders-canvas').focus();
      await page.keyboard.press('Space');
      await expect(root).toHaveAttribute('data-mode', 'playing');

      // 撃ち続けながら、やられて終わるまで進める
      await page.keyboard.down('Space');
      for (
        let i = 0;
        i < 3000 && (await root.getAttribute('data-mode')) === 'playing';
        i++
      ) {
        await page.clock.runFor(100);
      }
      await page.keyboard.up('Space');
      await expect(root).toHaveAttribute('data-mode', 'over');
      await expect(page.locator('#invaders-status')).toContainText(gameOver);

      // 終了直後の連打は無視される
      await page.keyboard.press('Space');
      await expect(root).toHaveAttribute('data-mode', 'over');
      await page.clock.runFor(500);
      await page.keyboard.press('Space');
      await expect(root).toHaveAttribute('data-mode', 'over');

      // 800ms を超えたら再開できる
      await page.clock.runFor(400);
      await page.keyboard.press('Space');
      await expect(root).toHaveAttribute('data-mode', 'playing');
      await expect(page.locator('#invaders-score')).toHaveText('0');
      await expect(page.locator('#invaders-lives')).toHaveText('3');
    });

    test('ゲームオーバー時のスコアがベストとして保存・表示される', async ({
      page,
    }) => {
      await page.clock.install();
      await page.goto(path);
      const root = page.locator('#invaders-root');
      await page.locator('#invaders-canvas').focus();
      await page.keyboard.press('Space');
      await expect(root).toHaveAttribute('data-mode', 'playing');
      await page.keyboard.down('Space');
      for (
        let i = 0;
        i < 3000 && (await root.getAttribute('data-mode')) === 'playing';
        i++
      ) {
        await page.clock.runFor(100);
      }
      await page.keyboard.up('Space');
      await expect(root).toHaveAttribute('data-mode', 'over');

      const score = Number(await page.locator('#invaders-score').textContent());
      const stored = await page.evaluate(() =>
        localStorage.getItem('invaders-game-best'),
      );
      expect(Number(stored ?? 0)).toBe(score);
      await expect(page.locator('#invaders-best')).toHaveText(String(score));
    });
  });
}
