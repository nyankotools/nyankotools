import { test, expect } from './helpers/test';

const PATHS = [
  {
    path: '/tools/tetris-game/',
    start: 'ゲーム開始',
    pause: '一時停止',
    gameOver: 'ゲームオーバー',
  },
  {
    path: '/en/tools/tetris-game/',
    start: 'Start game',
    pause: 'Pause',
    gameOver: 'Game over',
  },
];

for (const { path, start, pause, gameOver } of PATHS) {
  test.describe(`落ち物パズル ${path}`, () => {
    test('開始前は一時停止が押せず、スコア0・レベル1', async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('#tetris-root')).toHaveAttribute(
        'data-mode',
        'idle',
      );
      await expect(page.locator('#tetris-pause-button')).toBeDisabled();
      await expect(page.locator('#tetris-score')).toHaveText('0');
      await expect(page.locator('#tetris-level')).toHaveText('1');
    });

    test('開始ボタンで始まり、一時停止・Pキーで再開できる', async ({
      page,
    }) => {
      await page.goto(path);
      await page.getByRole('button', { name: start }).click();
      const root = page.locator('#tetris-root');
      await expect(root).toHaveAttribute('data-mode', 'playing');
      await page.getByRole('button', { name: pause }).click();
      await expect(root).toHaveAttribute('data-mode', 'paused');
      await page.keyboard.press('p');
      await expect(root).toHaveAttribute('data-mode', 'playing');
    });

    test('盤面にフォーカスしたスペースキーで開始できる', async ({ page }) => {
      await page.goto(path);
      await page.locator('#tetris-canvas').focus();
      await page.keyboard.press('Space');
      await expect(page.locator('#tetris-root')).toHaveAttribute(
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
      await expect(page.locator('#tetris-root')).toHaveAttribute(
        'data-mode',
        'idle',
      );
    });

    test('ハードドロップを繰り返すと積み上がってゲームオーバーになり、スコアがベストに保存される', async ({
      page,
    }) => {
      await page.goto(path);
      const root = page.locator('#tetris-root');
      await page.locator('#tetris-canvas').focus();
      await page.keyboard.press('Space');
      await expect(root).toHaveAttribute('data-mode', 'playing');
      // 同じ位置に落とし続ければ、ラインは揃わずいずれ積み上がる
      for (
        let i = 0;
        i < 60 && (await root.getAttribute('data-mode')) === 'playing';
        i++
      ) {
        await page.keyboard.press('Space');
      }
      await expect(root).toHaveAttribute('data-mode', 'over');
      await expect(page.locator('#tetris-status')).toContainText(gameOver);
      const score = Number(await page.locator('#tetris-score').textContent());
      expect(score).toBeGreaterThan(0);
      await expect(page.locator('#tetris-best')).toHaveText(String(score));
    });

    test('ゲームオーバー直後のスペースでは再開せず、800ms後なら再開できる', async ({
      page,
    }) => {
      await page.clock.install();
      await page.goto(path);
      const root = page.locator('#tetris-root');
      await page.locator('#tetris-canvas').focus();
      await page.keyboard.press('Space');
      for (
        let i = 0;
        i < 60 && (await root.getAttribute('data-mode')) === 'playing';
        i++
      ) {
        await page.keyboard.press('Space');
      }
      await expect(root).toHaveAttribute('data-mode', 'over');
      await page.keyboard.press('Space');
      await expect(root).toHaveAttribute('data-mode', 'over');
      await page.clock.runFor(900);
      await page.keyboard.press('Space');
      await expect(root).toHaveAttribute('data-mode', 'playing');
      await expect(page.locator('#tetris-score')).toHaveText('0');
    });

    test('時間が経つとブロックが自動で落ち、積み上がってゲームオーバーになる', async ({
      page,
    }) => {
      await page.clock.install();
      await page.goto(path);
      const root = page.locator('#tetris-root');
      await page.getByRole('button', { name: start }).click();
      for (
        let i = 0;
        i < 400 && (await root.getAttribute('data-mode')) === 'playing';
        i++
      ) {
        await page.clock.runFor(500);
      }
      await expect(root).toHaveAttribute('data-mode', 'over');
    });

    test('↓キーで1段ずつ下がって加点される', async ({ page }) => {
      await page.goto(path);
      await page.locator('#tetris-canvas').focus();
      await page.keyboard.press('Space');
      await page.keyboard.press('ArrowDown');
      await expect(page.locator('#tetris-score')).not.toHaveText('0');
    });

    test('画面のボタンで操作できる（落とすで加点・一時停止中は再開）', async ({
      page,
    }) => {
      await page.goto(path);
      const root = page.locator('#tetris-root');
      await page.getByRole('button', { name: start }).click();
      await page.locator('[data-control="left"]').dispatchEvent('pointerdown');
      await page
        .locator('[data-control="rotate"]')
        .dispatchEvent('pointerdown');
      await page.locator('[data-control="hold"]').dispatchEvent('pointerdown');
      await page.locator('[data-control="drop"]').dispatchEvent('pointerdown');
      await expect(page.locator('#tetris-score')).not.toHaveText('0');
      await page.getByRole('button', { name: pause }).click();
      await expect(root).toHaveAttribute('data-mode', 'paused');
      await page.locator('[data-control="down"]').dispatchEvent('pointerdown');
      await expect(root).toHaveAttribute('data-mode', 'playing');
    });

    test('タブが隠れると自動で一時停止する', async ({ page }) => {
      await page.goto(path);
      const root = page.locator('#tetris-root');
      await page.getByRole('button', { name: start }).click();
      await expect(root).toHaveAttribute('data-mode', 'playing');
      await page.evaluate(() => window.dispatchEvent(new Event('blur')));
      await expect(root).toHaveAttribute('data-mode', 'paused');
    });

    test('ゲーム開始ボタンを押すと盤面にフォーカスが移る', async ({ page }) => {
      await page.goto(path);
      await page.getByRole('button', { name: start }).click();
      await expect(page.locator('#tetris-canvas')).toBeFocused();
    });

    test('保存済みのベストスコアを読み込める', async ({ page }) => {
      await page.goto(path);
      await page.evaluate(() =>
        localStorage.setItem('tetris-game-best', '5000'),
      );
      await page.reload();
      await expect(page.locator('#tetris-best')).toHaveText('5000');
    });

    test('一時停止中は矢印キーでページがスクロールする', async ({ page }) => {
      await page.goto(path);
      await page.getByRole('button', { name: start }).click();
      await page.getByRole('button', { name: pause }).click();
      await expect(page.locator('#tetris-root')).toHaveAttribute(
        'data-mode',
        'paused',
      );
      const before = await page.evaluate(() => window.scrollY);
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await expect
        .poll(() => page.evaluate(() => window.scrollY))
        .toBeGreaterThan(before);
    });

    test('ホールドは1つのミノにつき1回だけ（連打しても保持は変わらない）', async ({
      page,
    }) => {
      await page.goto(path);
      const hold = page.locator('#tetris-hold');
      const dataUrl = () =>
        hold.evaluate((c: HTMLCanvasElement) => c.toDataURL());
      const blank = await dataUrl();
      await page.locator('#tetris-canvas').focus();
      await page.keyboard.press('Space');
      await page.keyboard.press('c');
      const first = await dataUrl();
      expect(first).not.toBe(blank);
      for (let i = 0; i < 5; i++) await page.keyboard.press('c');
      expect(await dataUrl()).toBe(first);
    });

    test('マウスの右ボタンでは操作ボタンが反応しない', async ({ page }) => {
      await page.goto(path);
      const root = page.locator('#tetris-root');
      await page.getByRole('button', { name: start }).click();
      await page.locator('[data-control="drop"]').click({ button: 'right' });
      await expect(page.locator('#tetris-score')).toHaveText('0');
      await expect(root).toHaveAttribute('data-mode', 'playing');
      await page.getByRole('button', { name: pause }).click();
      await expect(root).toHaveAttribute('data-mode', 'paused');
      await page.locator('[data-control="rotate"]').click({ button: 'right' });
      await expect(root).toHaveAttribute('data-mode', 'paused');
    });

    test('操作ボタンを押し続けると繰り返し、離すと止まる', async ({ page }) => {
      await page.goto(path);
      await page.getByRole('button', { name: start }).click();
      const button = page.locator('[data-control="down"]');
      await button.scrollIntoViewIfNeeded();
      const box = (await button.boundingBox())!;
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.waitForTimeout(600);
      await page.mouse.up();
      const score = page.locator('#tetris-score');
      const held = Number(await score.textContent());
      expect(held).toBeGreaterThan(2);
      await page.waitForTimeout(400);
      await expect(score).toHaveText(String(held));
    });

    test('操作ボタンにフォーカスしたスペースでは、クリックが二重に発火しない', async ({
      page,
    }) => {
      await page.goto(path);
      await page.getByRole('button', { name: start }).click();
      await expect(page.locator('#tetris-root')).toHaveAttribute(
        'data-mode',
        'playing',
      );
      await page.locator('[data-control="drop"]').focus();
      await page.evaluate(() => {
        const w = window as unknown as { clicks: number };
        w.clicks = 0;
        document
          .querySelector('[data-control="drop"]')!
          .addEventListener('click', () => w.clicks++);
      });
      await page.keyboard.press('Space');
      await expect(page.locator('#tetris-score')).not.toHaveText('0');
      const clicks = await page.evaluate(
        () => (window as unknown as { clicks: number }).clicks,
      );
      expect(clicks).toBe(0);
    });
  });
}
