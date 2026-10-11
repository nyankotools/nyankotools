import { test, expect, type Page } from './helpers/test';

/** ブラウザのCanvas APIで、横長（200×100）のテスト用PNGを生成する */
async function createPng(page: Page): Promise<Buffer> {
  const dataUrl = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 100;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, 200, 100);
    ctx.fillStyle = '#0000ff';
    ctx.fillRect(50, 0, 100, 100);
    return canvas.toDataURL('image/png');
  });
  return Buffer.from(dataUrl.split(',')[1], 'base64');
}

/** 空きマス（aria-label が「空きマス」のタイル）の位置を返す */
async function blankIndex(page: Page): Promise<number> {
  const labels = await page
    .locator('#sp-board button')
    .evaluateAll((els) => els.map((el) => el.getAttribute('aria-label')));
  return labels.indexOf('空きマス');
}

/**
 * 3×3 の盤面（0 = 空きマス）を幅優先探索で解き、各手でクリックするタイルのインデックス列を返す。
 * 盤面は生成時点で解ける並びなので、必ず完成形に到達する。
 */
function solve3x3(start: number[]): number[] {
  const goal = [1, 2, 3, 4, 5, 6, 7, 8, 0].join(',');
  const startKey = start.join(',');
  const prev = new Map<string, { from: string; tile: number }>();
  prev.set(startKey, { from: '', tile: -1 });
  const queue: number[][] = [start];
  for (let head = 0; head < queue.length; head++) {
    const cur = queue[head];
    const key = cur.join(',');
    if (key === goal) break;
    const b = cur.indexOf(0);
    const r = Math.floor(b / 3);
    const c = b % 3;
    for (const [dr, dc] of [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr > 2 || nc < 0 || nc > 2) continue;
      const n = nr * 3 + nc;
      const next = [...cur];
      next[b] = cur[n];
      next[n] = 0;
      const nextKey = next.join(',');
      if (prev.has(nextKey)) continue;
      prev.set(nextKey, { from: key, tile: n });
      queue.push(next);
    }
  }
  const moves: number[] = [];
  let k = goal;
  while (k !== startKey) {
    const p = prev.get(k)!;
    moves.unshift(p.tile);
    k = p.from;
  }
  return moves;
}

/** 盤面の各マスの番号を読む（空きマスは 0）。aria-label の数字から取るので日英どちらでも使える */
async function readBoard(page: Page): Promise<number[]> {
  const labels = await page
    .locator('#sp-board button')
    .evaluateAll((els) => els.map((el) => el.getAttribute('aria-label') ?? ''));
  return labels.map((l) => {
    const m = l.match(/\d+/);
    return m ? Number(m[0]) : 0;
  });
}

test.describe('スライドパズル', () => {
  test('初期は4×4（15枚＋空きマス）で、解ける配置・完成済みでない', async ({
    page,
  }) => {
    await page.goto('/tools/slide-puzzle/');
    const tiles = page.locator('#sp-board button');
    await expect(tiles).toHaveCount(16);
    await expect(page.locator('#sp-moves')).toHaveText('0');
    const labels = await tiles.evaluateAll((els) =>
      els.map((el) => el.textContent ?? ''),
    );
    const numbers = labels.filter((l) => l !== '').map(Number);
    expect(numbers.sort((a, b) => a - b)).toEqual(
      Array.from({ length: 15 }, (_, i) => i + 1),
    );
    await expect(page.locator('#sp-status')).toHaveText('');
  });

  test('大きさを変えるとタイル数が変わる', async ({ page }) => {
    await page.goto('/tools/slide-puzzle/');
    const tiles = page.locator('#sp-board button');
    await page.locator('[data-size="3"]').click();
    await expect(tiles).toHaveCount(9);
    await page.locator('[data-size="5"]').click();
    await expect(tiles).toHaveCount(25);
  });

  test('空きマスの隣をクリックすると手数が1増え、離れたタイルは動かない', async ({
    page,
  }) => {
    await page.goto('/tools/slide-puzzle/');
    await page.locator('[data-size="3"]').click();
    const blank = await blankIndex(page);
    const row = Math.floor(blank / 3);
    const col = blank % 3;
    // 空きマスと別の行・別の列にあるタイル（斜め方向）は動かない
    const diag = (row === 0 ? 1 : row - 1) * 3 + (col === 0 ? 1 : col - 1);
    await page.locator('#sp-board button').nth(diag).click();
    await expect(page.locator('#sp-moves')).toHaveText('0');

    const neighbor = col < 2 ? blank + 1 : blank - 1;
    await page.locator('#sp-board button').nth(neighbor).click();
    await expect(page.locator('#sp-moves')).toHaveText('1');
    expect(await blankIndex(page)).toBe(neighbor);
  });

  test('矢印キーでタイルを動かせる', async ({ page }) => {
    await page.goto('/tools/slide-puzzle/');
    await page.locator('[data-size="3"]').click();
    const blank = await blankIndex(page);
    const col = blank % 3;
    // 空きマスが右端でなければ ← で右隣のタイルが動き、空きマスは右へ移る
    await page.locator('#sp-board button').first().focus();
    if (col < 2) {
      await page.keyboard.press('ArrowLeft');
      expect(await blankIndex(page)).toBe(blank + 1);
    } else {
      await page.keyboard.press('ArrowRight');
      expect(await blankIndex(page)).toBe(blank - 1);
    }
    await expect(page.locator('#sp-moves')).toHaveText('1');
  });

  test('「新しいゲーム」で手数が0に戻る', async ({ page }) => {
    await page.goto('/tools/slide-puzzle/');
    await page.locator('[data-size="3"]').click();
    const blank = await blankIndex(page);
    const neighbor = blank % 3 < 2 ? blank + 1 : blank - 1;
    await page.locator('#sp-board button').nth(neighbor).click();
    await expect(page.locator('#sp-moves')).toHaveText('1');
    await page.locator('#sp-new-button').click();
    await expect(page.locator('#sp-moves')).toHaveText('0');
  });

  test('画像モード: 画像を読み込むと分割表示と完成イメージが出る', async ({
    page,
  }) => {
    await page.goto('/tools/slide-puzzle/');
    await expect(page.locator('#sp-image-panel')).toBeHidden();
    await page.locator('[data-mode="image"]').click();
    await expect(page.locator('#sp-image-panel')).toBeVisible();

    await page.locator('#sp-file-input').setInputFiles({
      name: 'photo.png',
      mimeType: 'image/png',
      buffer: await createPng(page),
    });
    await expect(page.locator('#sp-preview-figure')).toBeVisible();
    await expect(page.locator('#sp-status')).toContainText(
      '画像を読み込みました',
    );
    // 空きマスは背景画像を持たないので、番号付きのタイルを選ぶ（乱数で空きマスが先頭に来ることがある）
    const first = page
      .locator('#sp-board button[aria-label^="タイル"]')
      .first();
    const bg = await first.evaluate(
      (el) => getComputedStyle(el).backgroundImage,
    );
    expect(bg).toContain('blob:');

    // 番号表示を切ると、タイルの番号バッジが消える
    await expect(page.locator('#sp-board button span').first()).toBeVisible();
    await page.locator('#sp-show-numbers').uncheck();
    await expect(page.locator('#sp-board button span')).toHaveCount(0);
  });

  test('画像モード: 対応していないファイルはエラーを表示する', async ({
    page,
  }) => {
    await page.goto('/tools/slide-puzzle/');
    await page.locator('[data-mode="image"]').click();
    await page.locator('#sp-file-input').setInputFiles({
      name: 'note.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello'),
    });
    await expect(page.locator('#sp-error')).toBeVisible();
    await expect(page.locator('#sp-preview-figure')).toBeHidden();
  });

  test('375px幅で5×5の盤面がはみ出さない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/tools/slide-puzzle/');
    await page.locator('[data-size="5"]').click();
    const tiles = page.locator('#sp-board button');
    await expect(tiles).toHaveCount(25);
    const boxes = await tiles.evaluateAll((els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect();
        return { left: r.left, right: r.right, width: r.width };
      }),
    );
    for (const b of boxes) {
      expect(b.left).toBeGreaterThanOrEqual(0);
      expect(b.right).toBeLessThanOrEqual(375);
      expect(b.width).toBeGreaterThanOrEqual(40);
    }
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasOverflow).toBe(false);
  });

  test('英語ページでも動作する', async ({ page }) => {
    await page.goto('/en/tools/slide-puzzle/');
    await expect(page.locator('#sp-board button')).toHaveCount(16);
    await expect(page.locator('#sp-correct')).toContainText('/ 15');
  });

  test('3×3を解くと完成し、完成後も1〜9の番号が重複なく並ぶ', async ({
    page,
  }) => {
    await page.goto('/tools/slide-puzzle/');
    await page.locator('[data-size="3"]').click();
    const start = await readBoard(page);
    const path = solve3x3(start);
    expect(path.length).toBeGreaterThan(0);

    const tiles = page.locator('#sp-board button');
    for (const i of path) {
      await tiles.nth(i).click();
    }
    await expect(page.locator('#sp-moves')).toHaveText(String(path.length));
    await expect(page.locator('#sp-status')).toContainText('クリア');
    const done = await readBoard(page);
    expect([...done].sort((a, b) => a - b)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9,
    ]);
  });

  test('画像モードで3×3を解くと、9枚すべての切り出し位置が異なる（完成イメージが欠けない）', async ({
    page,
  }) => {
    await page.goto('/tools/slide-puzzle/');
    await page.locator('[data-mode="image"]').click();
    await page.locator('[data-size="3"]').click();
    await page.locator('#sp-file-input').setInputFiles({
      name: 'photo.png',
      mimeType: 'image/png',
      buffer: await createPng(page),
    });
    await expect(page.locator('#sp-status')).toContainText(
      '画像を読み込みました',
    );
    const path = solve3x3(await readBoard(page));
    const tiles = page.locator('#sp-board button');
    for (const i of path) {
      await tiles.nth(i).click();
    }
    await expect(page.locator('#sp-status')).toContainText('クリア');
    const positions = await tiles.evaluateAll((els) =>
      els.map((el) => (el as HTMLElement).style.backgroundPosition),
    );
    expect(new Set(positions).size).toBe(9);
  });
});
