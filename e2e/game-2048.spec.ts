import { test, expect, type Page } from './helpers/test';

const KEYS = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'] as const;

/** 盤面の各マスの数値を読む（空きマスは 0）。aria-label の数字から取るので日英どちらでも使える */
async function readBoard(page: Page): Promise<number[]> {
  const labels = await page
    .locator('#g2048-board > div')
    .evaluateAll((els) => els.map((el) => el.getAttribute('aria-label') ?? ''));
  return labels.map((l) => {
    const m = l.match(/\d+/);
    return m ? Number(m[0]) : 0;
  });
}

const sum = (board: number[]) => board.reduce((a, v) => a + v, 0);

/** 盤面が変わるまで4方向を試す（初期は2枚だけなので、どれかは必ず動く） */
async function moveOnce(page: Page) {
  const before = (await readBoard(page)).join(',');
  for (const key of KEYS) {
    await page.keyboard.press(key);
    if ((await readBoard(page)).join(',') !== before) return;
  }
  throw new Error('どの向きにも動かなかった');
}

test.describe('2048', () => {
  test('初期は4×4でタイルが2枚（2か4）・スコア0', async ({ page }) => {
    await page.goto('/tools/game-2048/');
    await expect(page.locator('#g2048-board > div')).toHaveCount(16);
    const board = await readBoard(page);
    const tiles = board.filter((v) => v !== 0);
    expect(tiles).toHaveLength(2);
    expect(tiles.every((v) => v === 2 || v === 4)).toBe(true);
    await expect(page.locator('#g2048-score')).toHaveText('0');
    await expect(page.locator('#g2048-undo-button')).toBeDisabled();
  });

  test('矢印キーで動かすと新しいタイルが1枚増える', async ({ page }) => {
    await page.goto('/tools/game-2048/');
    const before = sum(await readBoard(page));
    await moveOnce(page);
    const after = await readBoard(page);
    expect(after.filter((v) => v !== 0).length).toBeGreaterThanOrEqual(2);
    // 合体では総和が変わらず、新しいタイルの 2 または 4 だけ増える
    expect([2, 4]).toContain(sum(after) - before);
  });

  test('WASDでも動かせる', async ({ page }) => {
    await page.goto('/tools/game-2048/');
    const before = (await readBoard(page)).join(',');
    for (const key of ['a', 'w', 'd', 's']) {
      await page.keyboard.press(key);
      if ((await readBoard(page)).join(',') !== before) return;
    }
    throw new Error('WASDで動かなかった');
  });

  test('画面の矢印ボタンで動かせる', async ({ page }) => {
    await page.goto('/tools/game-2048/');
    const before = (await readBoard(page)).join(',');
    let moved = false;
    for (const dir of ['left', 'up', 'right', 'down']) {
      await page.locator(`[data-move="${dir}"]`).click();
      if ((await readBoard(page)).join(',') !== before) {
        moved = true;
        break;
      }
    }
    expect(moved).toBe(true);
  });

  test('盤面の上のスワイプで動かせる', async ({ page }) => {
    await page.goto('/tools/game-2048/');
    const board = page.locator('#g2048-board');
    const box = (await board.boundingBox())!;
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    const before = (await readBoard(page)).join(',');
    const swipes = [
      [-80, 0],
      [0, -80],
      [80, 0],
      [0, 80],
    ];
    let moved = false;
    for (const [dx, dy] of swipes) {
      await page.mouse.move(cx, cy);
      await page.mouse.down();
      await page.mouse.move(cx + dx, cy + dy, { steps: 4 });
      await page.mouse.up();
      if ((await readBoard(page)).join(',') !== before) {
        moved = true;
        break;
      }
    }
    expect(moved).toBe(true);
  });

  test('短い移動（タップ相当）では動かない', async ({ page }) => {
    await page.goto('/tools/game-2048/');
    const box = (await page.locator('#g2048-board').boundingBox())!;
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    const before = (await readBoard(page)).join(',');
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx + 5, cy + 3);
    await page.mouse.up();
    expect((await readBoard(page)).join(',')).toBe(before);
  });

  test('「元に戻す」で1手前の盤面に戻り、続けては戻せない', async ({
    page,
  }) => {
    await page.goto('/tools/game-2048/');
    const initial = await readBoard(page);
    await moveOnce(page);
    const undo = page.locator('#g2048-undo-button');
    await expect(undo).toBeEnabled();
    await undo.click();
    expect(await readBoard(page)).toEqual(initial);
    await expect(undo).toBeDisabled();
  });

  test('「新しいゲーム」でスコアと盤面がリセットされる', async ({ page }) => {
    await page.goto('/tools/game-2048/');
    await moveOnce(page);
    await page.locator('#g2048-new-button').click();
    await expect(page.locator('#g2048-score')).toHaveText('0');
    const tiles = (await readBoard(page)).filter((v) => v !== 0);
    expect(tiles).toHaveLength(2);
    await expect(page.locator('#g2048-undo-button')).toBeDisabled();
  });

  test('盤面の大きさを切り替えられる', async ({ page }) => {
    await page.goto('/tools/game-2048/');
    await page.locator('[data-size="5"]').click();
    await expect(page.locator('#g2048-board > div')).toHaveCount(25);
    await expect(page.locator('[data-size="5"]')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await page.locator('[data-size="6"]').click();
    await expect(page.locator('#g2048-board > div')).toHaveCount(36);
    await page.locator('[data-size="4"]').click();
    await expect(page.locator('#g2048-board > div')).toHaveCount(16);
  });

  test('入力欄にフォーカスがあるときは矢印キーで盤面を動かさない', async ({
    page,
  }) => {
    await page.goto('/tools/game-2048/');
    // サイドバー等の検索欄など、ページ内の入力欄を一時的に追加して確認する
    await page.evaluate(() => {
      const input = document.createElement('input');
      input.id = 'tmp-input';
      document.body.append(input);
    });
    await page.locator('#tmp-input').focus();
    const before = (await readBoard(page)).join(',');
    for (const key of KEYS) await page.keyboard.press(key);
    expect((await readBoard(page)).join(',')).toBe(before);
  });

  test('ベスト記録を読み込み、リセットできる', async ({ page }) => {
    await page.goto('/tools/game-2048/');
    await page.evaluate(() => {
      localStorage.setItem(
        'game-2048-best',
        JSON.stringify({ 4: { score: 1234, maxTile: 128 } }),
      );
    });
    await page.reload();
    await expect(page.locator('#g2048-best-4')).toContainText('1234');
    await expect(page.locator('#g2048-best-4')).toContainText('128');
    await expect(page.locator('#g2048-best-score')).toHaveText('1234');
    await expect(page.locator('#g2048-best-5')).toHaveText('記録なし');

    await page.locator('#g2048-reset-button').click();
    await expect(page.locator('#g2048-best-4')).toHaveText('記録なし');
    await expect(page.locator('#g2048-best-score')).toHaveText('0');
  });

  test('壊れた保存値は無視して起動できる', async ({ page }) => {
    await page.goto('/tools/game-2048/');
    await page.evaluate(() => {
      localStorage.setItem('game-2048-best', '{broken');
    });
    await page.reload();
    await expect(page.locator('#g2048-board > div')).toHaveCount(16);
    await expect(page.locator('#g2048-best-4')).toHaveText('記録なし');
  });

  test('英語ページでも動く', async ({ page }) => {
    await page.goto('/en/tools/game-2048/');
    await expect(page.locator('h1')).toContainText('2048');
    await expect(page.locator('#g2048-board > div')).toHaveCount(16);
    await expect(page.locator('#g2048-best-4')).toHaveText('No record yet');
    await moveOnce(page);
  });
});
