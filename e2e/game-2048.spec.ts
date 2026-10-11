import { test, expect, type Page } from './helpers/test';
import { solveTo2048 } from './helpers/game-2048-solver';

const KEYS = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'] as const;

/** 盤面の各マスの数値を読む（空きマスは 0）。タイルの aria-label の数字から取るので日英どちらでも使える */
async function readBoard(page: Page): Promise<number[]> {
  const cells = await page.locator('#g2048-board > [data-cell]').count();
  const board = new Array<number>(cells).fill(0);
  const tiles = await page
    .locator('#g2048-board [data-index]')
    .evaluateAll((els) =>
      els.map((el) => [
        Number((el as HTMLElement).dataset.index),
        el.getAttribute('aria-label') ?? '',
      ]),
    );
  for (const [index, label] of tiles) {
    board[Number(index)] = Number(String(label).match(/\d+/)?.[0] ?? 0);
  }
  return board;
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

/**
 * 乱数を固定したうえで、ランダムな向きへ動かし続けてゲームオーバーの表示が出るまで進める。
 * 盤面の生成（crypto.getRandomValues）を決定的にするので、何度実行しても同じ手順で終わる。
 */
async function playUntilGameOver(page: Page, path: string, statusText: string) {
  await page.addInitScript(() => {
    let s = 20240601;
    const fakeRandom = (arr: ArrayBufferView) => {
      const view = new Uint32Array(
        arr.buffer,
        arr.byteOffset,
        arr.byteLength / 4,
      );
      for (let i = 0; i < view.length; i++) {
        s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
        view[i] = s;
      }
      return arr;
    };
    Object.defineProperty(crypto, 'getRandomValues', {
      value: fakeRandom,
      configurable: true,
    });
  });
  await page.goto(path);
  const status = page.locator('#g2048-status');
  let seed = 99;
  for (let i = 0; i < 3000; i++) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    await page.keyboard.press(KEYS[Math.floor((seed / 2147483648) * 4)]);
    if ((await status.textContent())?.includes(statusText)) return;
  }
  throw new Error('ゲームオーバーにならなかった');
}

const overlayText = (page: Page, text: string) =>
  page.getByText(text, { exact: true });

test.describe('2048', () => {
  test('初期は4×4でタイルが2枚（2か4）・スコア0', async ({ page }) => {
    await page.goto('/tools/game-2048/');
    await expect(page.locator('#g2048-board > [data-cell]')).toHaveCount(16);
    const board = await readBoard(page);
    const tiles = board.filter((v) => v !== 0);
    expect(tiles).toHaveLength(2);
    expect(tiles.every((v) => v === 2 || v === 4)).toBe(true);
    await expect(page.locator('#g2048-score')).toHaveText('0');
    await expect(page.locator('#g2048-undo-button')).toBeDisabled();
    // ゲームオーバー表示は、動かせる間は出ていない
    await expect(
      page.getByText('ゲームオーバー', { exact: true }),
    ).toBeHidden();
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
    await expect(page.locator('#g2048-board > [data-cell]')).toHaveCount(25);
    await expect(page.locator('[data-size="5"]')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await page.locator('[data-size="6"]').click();
    await expect(page.locator('#g2048-board > [data-cell]')).toHaveCount(36);
    await page.locator('[data-size="4"]').click();
    await expect(page.locator('#g2048-board > [data-cell]')).toHaveCount(16);
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
    await expect(page.locator('#g2048-board > [data-cell]')).toHaveCount(16);
    await expect(page.locator('#g2048-best-4')).toHaveText('記録なし');
  });

  test('動かしたあと、合体の残像が残らず盤面の見た目が確定する', async ({
    page,
  }) => {
    await page.goto('/tools/game-2048/');
    await moveOnce(page);
    await page.waitForTimeout(400);
    const tiles = page.locator('#g2048-board [data-index]');
    const board = await readBoard(page);
    await expect(tiles).toHaveCount(board.filter((v) => v !== 0).length);
    // 残像（aria-hidden のタイル）が残っていない
    await expect(
      page.locator('#g2048-board > :not([data-cell]) > [aria-hidden]'),
    ).toHaveCount(0);
  });

  test('prefers-reduced-motion でもタイルが正しく表示される', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/tools/game-2048/');
    const before = sum(await readBoard(page));
    await moveOnce(page);
    expect([2, 4]).toContain(sum(await readBoard(page)) - before);
  });

  test('2048を作ると盤面中央に達成が表示され、次に動かすと消えて続けられる', async ({
    page,
  }) => {
    test.setTimeout(180_000);
    const SEED = 8;
    const keys: Record<string, string> = {
      left: 'ArrowLeft',
      up: 'ArrowUp',
      right: 'ArrowRight',
      down: 'ArrowDown',
    };
    const sequence = solveTo2048(SEED);
    // ページの乱数を、手順を求めたときと同じ線形合同法に差し替える
    await page.addInitScript((seed) => {
      let s = seed;
      Object.defineProperty(crypto, 'getRandomValues', {
        value: (arr: ArrayBufferView) => {
          const view = new Uint32Array(
            arr.buffer,
            arr.byteOffset,
            arr.byteLength / 4,
          );
          for (let i = 0; i < view.length; i++) {
            s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
            view[i] = s;
          }
          return arr;
        },
        configurable: true,
      });
    }, SEED);
    await page.goto('/tools/game-2048/');
    // 手順の最後の1手の直前までは、達成の表示が出ない
    for (const d of sequence.slice(0, -1)) {
      await page.keyboard.press(keys[d]);
    }
    const overlay = overlayText(page, '2048達成！');
    await expect(overlay).toBeHidden();
    await page.keyboard.press(keys[sequence[sequence.length - 1]]);
    await expect(overlay).toBeVisible();
    await expect(page.locator('#g2048-status')).toContainText('2048を達成');
    expect(Math.max(...(await readBoard(page)))).toBeGreaterThanOrEqual(2048);

    // 盤面の中央に表示されている
    const box = (await page.locator('#g2048-board').boundingBox())!;
    const label = (await overlay.boundingBox())!;
    expect(
      Math.abs(label.x + label.width / 2 - (box.x + box.width / 2)),
    ).toBeLessThan(4);

    // 次に動かすと消え、ゲームは続けられる
    await moveOnce(page);
    await expect(overlay).toBeHidden();
    await expect(page.locator('#g2048-undo-button')).toBeEnabled();
  });

  test('英語ページでも動く', async ({ page }) => {
    await page.goto('/en/tools/game-2048/');
    await expect(page.locator('h1')).toContainText('2048');
    await expect(page.locator('#g2048-board > [data-cell]')).toHaveCount(16);
    await expect(page.locator('#g2048-best-4')).toHaveText('No record yet');
    await moveOnce(page);
  });

  test('ゲームオーバーになると盤面中央に表示され、「元に戻す」で消えて続けられる', async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await playUntilGameOver(page, '/tools/game-2048/', 'ゲームオーバーです');
    const overlay = overlayText(page, 'ゲームオーバー');
    await expect(overlay).toBeVisible();
    // 表示は読み上げ対象外（読み上げはステータス欄が担当）
    await expect(
      page.locator('#g2048-board > div[aria-hidden]:not([data-cell])'),
    ).toBeVisible();
    // 動かせない状態では矢印キーを押しても盤面は変わらない
    const stuck = (await readBoard(page)).join(',');
    for (const key of KEYS) await page.keyboard.press(key);
    expect((await readBoard(page)).join(',')).toBe(stuck);

    const undo = page.locator('#g2048-undo-button');
    await expect(undo).toBeEnabled();
    await undo.click();
    await expect(overlay).toBeHidden();
    await expect(page.locator('#g2048-status')).toHaveText('1手戻しました。');
    // 戻った盤面はまだ動かせる
    await moveOnce(page);
    await expect(page.locator('#g2048-status')).not.toContainText(
      'ゲームオーバー',
    );
  });

  test('ゲームオーバーの表示は「新しいゲーム」で消える', async ({ page }) => {
    test.setTimeout(120_000);
    await playUntilGameOver(page, '/tools/game-2048/', 'ゲームオーバーです');
    await expect(overlayText(page, 'ゲームオーバー')).toBeVisible();
    await page.locator('#g2048-new-button').click();
    await expect(overlayText(page, 'ゲームオーバー')).toBeHidden();
    await expect(page.locator('#g2048-score')).toHaveText('0');
    expect((await readBoard(page)).filter((v) => v !== 0)).toHaveLength(2);
  });

  test('ゲームオーバーの表示は盤面の大きさを変えると消える', async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await playUntilGameOver(page, '/tools/game-2048/', 'ゲームオーバーです');
    await expect(overlayText(page, 'ゲームオーバー')).toBeVisible();
    await page.locator('[data-size="5"]').click();
    await expect(overlayText(page, 'ゲームオーバー')).toBeHidden();
    await expect(page.locator('#g2048-board > [data-cell]')).toHaveCount(25);
  });

  test('英語ページでもゲームオーバーが表示され、元に戻すで消える', async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await playUntilGameOver(page, '/en/tools/game-2048/', 'Game over.');
    await expect(overlayText(page, 'Game over')).toBeVisible();
    await page.locator('#g2048-undo-button').click();
    await expect(overlayText(page, 'Game over')).toBeHidden();
  });
});
