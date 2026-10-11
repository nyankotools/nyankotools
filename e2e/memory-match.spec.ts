import { test, expect } from './helpers/test';
import type { Page } from '@playwright/test';

// 配置は乱数で決まるため、めくって絵柄を記憶しながら全ペアを揃える
async function solveBoard(page: Page) {
  const cards = page.locator('#mm-board button');
  const count = await cards.count();
  const known = new Map<number, string>();
  const done = new Set<number>();

  const flip = async (i: number) => {
    await cards.nth(i).click();
    const face = (await cards.nth(i).textContent()) ?? '';
    known.set(i, face);
    return face;
  };
  const partnerOf = (i: number) => {
    const face = known.get(i);
    for (const [j, f] of known) {
      if (j !== i && f === face && !done.has(j)) return j;
    }
    return -1;
  };

  while (done.size < count) {
    // 絵柄が分かっているペアを先に揃える
    let progressed = false;
    for (const i of known.keys()) {
      if (done.has(i)) continue;
      const p = partnerOf(i);
      if (p !== -1) {
        await flip(i);
        await flip(p);
        done.add(i);
        done.add(p);
        progressed = true;
        break;
      }
    }
    if (progressed) continue;
    // 未確認のカードを2枚めくる
    const unknown = [...Array(count).keys()].filter(
      (i) => !known.has(i) && !done.has(i),
    );
    const a = unknown[0];
    const faceA = await flip(a);
    const b = unknown[1];
    if (b === undefined) break;
    const faceB = await flip(b);
    if (faceA === faceB) {
      done.add(a);
      done.add(b);
    }
  }
}

test.describe('神経衰弱', () => {
  test('初期は普通（16枚）で全カードが裏向き', async ({ page }) => {
    await page.goto('/tools/memory-match/');
    const cards = page.locator('#mm-board button');
    await expect(cards).toHaveCount(16);
    await expect(cards.first()).toHaveText('?');
    await expect(page.locator('#mm-moves')).toHaveText('0');
    await expect(page.locator('#mm-pairs')).toHaveText('0 / 8');
  });

  test('難易度を変えると枚数が変わる', async ({ page }) => {
    await page.goto('/tools/memory-match/');
    const cards = page.locator('#mm-board button');
    await page.locator('[data-difficulty="easy"]').click();
    await expect(cards).toHaveCount(12);
    await page.locator('[data-difficulty="hard"]').click();
    await expect(cards).toHaveCount(30);
  });

  test('375px幅で難易度「難しい」（6列）の盤面がはみ出さない', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/tools/memory-match/');
    await page.locator('[data-difficulty="hard"]').click();
    const cards = page.locator('#mm-board button');
    await expect(cards).toHaveCount(30);

    const board = await page.locator('#mm-board').boundingBox();
    expect(board).not.toBeNull();
    expect(board!.x).toBeGreaterThanOrEqual(0);
    expect(board!.x + board!.width).toBeLessThanOrEqual(375);

    // 1行に並ぶ列数（x座標の種類数）が6であること
    const xs = await cards.evaluateAll((els) =>
      els.map((el) => Math.round(el.getBoundingClientRect().x)),
    );
    expect(new Set(xs).size).toBe(6);

    // 各カードが盤面の外へ出ず、中身（絵柄）が切れていないこと
    const boxes = await cards.evaluateAll((els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect();
        return {
          left: r.left,
          right: r.right,
          width: r.width,
          overflowing: el.scrollWidth > el.clientWidth + 1,
        };
      }),
    );
    for (const b of boxes) {
      expect(b.left).toBeGreaterThanOrEqual(0);
      expect(b.right).toBeLessThanOrEqual(375);
      expect(b.width).toBeGreaterThanOrEqual(30);
      expect(b.overflowing).toBe(false);
    }

    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasOverflow).toBe(false);
  });

  test('2枚めくると手数が1増え、不一致なら裏返る', async ({ page }) => {
    await page.goto('/tools/memory-match/');
    const cards = page.locator('#mm-board button');
    await cards.nth(0).click();
    await expect(page.locator('#mm-moves')).toHaveText('0');
    await cards.nth(1).click();
    await expect(page.locator('#mm-moves')).toHaveText('1');
    const same =
      (await cards.nth(0).textContent()) === (await cards.nth(1).textContent());
    if (same) {
      await expect(page.locator('#mm-pairs')).toHaveText('1 / 8');
      await expect(cards.nth(0)).toHaveAttribute('aria-disabled', 'true');
    } else {
      await expect(cards.nth(0)).toHaveText('?');
      await expect(cards.nth(1)).toHaveText('?');
    }
  });

  test('全ペアを揃えるとクリアとなり、ベスト記録が保存される', async ({
    page,
  }) => {
    await page.goto('/tools/memory-match/');
    await page.locator('[data-difficulty="easy"]').click();
    await solveBoard(page);
    await expect(page.locator('#mm-pairs')).toHaveText('6 / 6');
    await expect(page.locator('#mm-status')).toContainText('クリア');
    await expect(page.locator('#mm-status')).toContainText('ベスト記録を更新');
    await expect(page.locator('#mm-best-easy')).toContainText('手');
    await expect(page.locator('#mm-best-easy')).not.toHaveText('記録なし');

    await page.reload();
    await expect(page.locator('#mm-best-easy')).not.toHaveText('記録なし');
    await page.locator('#mm-reset-button').click();
    await expect(page.locator('#mm-best-easy')).toHaveText('記録なし');
  });

  test('英語ページでも動作する', async ({ page }) => {
    await page.goto('/en/tools/memory-match/');
    await expect(page.locator('#mm-board button')).toHaveCount(16);
    await page.locator('#mm-board button').first().click();
    await expect(page.locator('#mm-board button').first()).not.toHaveText('?');
  });
});
