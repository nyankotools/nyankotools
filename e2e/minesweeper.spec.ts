import { test, expect, type Page } from './helpers/test';
import {
  neighbors,
  placeMines,
  PRESETS,
  type Difficulty,
  type GameConfig,
} from '../src/lib/tools/minesweeper';

// 盤面の地雷配置はページ側の乱数（crypto.getRandomValues）から決まる。
// このspecでは同じ乱数列をテスト側でも作り、アプリと同じ placeMines で地雷位置を求める。
const SEED = 20240601;
const PAGES = {
  ja: '/tools/minesweeper/',
  en: '/en/tools/minesweeper/',
} as const;
const MID = 40; // 初級 9×9 の中央

type Msg = Record<string, string>;

/**
 * ページ側の乱数を、seed から決まる LCG に差し替える（ページを開き直すたびに同じ列になる）。
 * 盤面の地雷は最初に開いたときだけ乱数を使うので、この指定で配置が決定的になる。
 * 注意: addInitScript は呼ぶたびに積み重なるため、テスト1件につき1回だけ呼ぶこと。
 */
async function useSeed(page: Page, seed = SEED) {
  await page.addInitScript((initial: number) => {
    let state = initial;
    Object.defineProperty(crypto, 'getRandomValues', {
      configurable: true,
      value: (arr: ArrayBufferView) => {
        const view = new Uint32Array(
          arr.buffer,
          arr.byteOffset,
          arr.byteLength / 4,
        );
        for (let i = 0; i < view.length; i++) {
          state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
          view[i] = state;
        }
        return arr;
      },
    });
  }, seed);
}

/** テスト側で同じ乱数列を作る（アプリの secureRandomInt と同じ棄却サンプリング） */
function seededRandomInt(seed: number) {
  let s = seed;
  return (max: number) => {
    const limit = Math.floor(0x100000000 / max) * max;
    for (;;) {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      if (s < limit) return s % max;
    }
  };
}

/** 最初に index を開いたときに置かれる地雷の配置（アプリと同じ関数・同じ乱数） */
function minesAfterFirstClick(config: GameConfig, index: number) {
  return placeMines(config, index, seededRandomInt(SEED));
}

/** 画面の文言（data-* 属性に入っている ja/en の表示文字列）を読む */
async function readMsg(page: Page): Promise<Msg> {
  return page
    .locator('#ms-root')
    .evaluate((el) => ({ ...(el as HTMLElement).dataset }) as Msg);
}

/** {key} を値で置き換える（アプリ側の fill と同じ規則） */
const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (m, k: string) =>
    k in values ? String(values[k]) : m,
  );

const cell = (page: Page, index: number) =>
  page.locator(`#ms-board [data-index="${index}"]`);

const cellCount = (page: Page) =>
  page.locator('#ms-board [data-index]').count();

async function labels(page: Page): Promise<string[]> {
  return page
    .locator('#ms-board [data-index]')
    .evaluateAll((els) => els.map((el) => el.getAttribute('aria-label') ?? ''));
}

/**
 * aria-label から「状態の文言」（未開封・旗・数字など）だけを取り出す。
 * cellLabel の {row} {col} を埋めた前後の文字列を外すので、日英どちらでも同じ判定ができる。
 */
function stateText(label: string, index: number, cols: number, m: Msg) {
  const marker = '\u0000';
  const [pre, post] = fill(m.cellLabel, {
    row: Math.floor(index / cols) + 1,
    col: (index % cols) + 1,
    state: marker,
  }).split(marker);
  return label.slice(pre.length, label.length - post.length);
}

async function cellStates(page: Page, cols: number, m: Msg) {
  return (await labels(page)).map((l, i) => stateText(l, i, cols, m));
}

async function stateOf(page: Page, index: number, cols: number, m: Msg) {
  const label = (await cell(page, index).getAttribute('aria-label')) ?? '';
  return stateText(label, index, cols, m);
}

async function focusedIndex(page: Page) {
  return page.evaluate(() =>
    Number((document.activeElement as HTMLElement | null)?.dataset.index),
  );
}

/** 長押し（touch の pointerdown → hold ms 待つ → pointerup）を再現する */
async function touchHold(page: Page, index: number, holdMs: number) {
  await cell(page, index).evaluate(async (el, hold) => {
    const init = {
      bubbles: true,
      cancelable: true,
      pointerId: 7,
      pointerType: 'touch',
      isPrimary: true,
      clientX: 0,
      clientY: 0,
    };
    el.dispatchEvent(new PointerEvent('pointerdown', init));
    await new Promise((r) => setTimeout(r, hold));
    el.dispatchEvent(new PointerEvent('pointerup', init));
  }, holdMs);
}

/** 短いタップ（touch の pointerdown → pointerup → click）を再現する */
async function touchTap(page: Page, index: number) {
  await cell(page, index).evaluate((el) => {
    const init = {
      bubbles: true,
      cancelable: true,
      pointerId: 8,
      pointerType: 'touch',
      isPrimary: true,
    };
    el.dispatchEvent(new PointerEvent('pointerdown', init));
    el.dispatchEvent(new PointerEvent('pointerup', init));
    (el as HTMLElement).click();
  });
}

/** 初級の中央を開いたあと、安全なマスをすべて開いて勝ちまで進める */
async function winBeginner(page: Page) {
  await cell(page, MID).click();
  const mines = minesAfterFirstClick(PRESETS.beginner, MID);
  for (let i = 0; i < mines.length; i++) {
    if (!mines[i]) await cell(page, i).click();
  }
  return mines;
}

for (const lang of ['ja', 'en'] as const) {
  test.describe(`マインスイーパー（${lang}）`, () => {
    test('直接アクセスすると初級の盤面（9×9・地雷10）が表示される', async ({
      page,
    }) => {
      await page.goto(PAGES[lang]);
      await expect(page.locator('h1')).toContainText(
        lang === 'ja' ? 'マインスイーパー' : 'Minesweeper',
      );
      expect(await cellCount(page)).toBe(81);
      await expect(page.locator('#ms-mines-left')).toHaveText('10');
      await expect(page.locator('#ms-time')).toHaveText('0:00.0');
      await expect(
        page.locator('[data-difficulty="beginner"]'),
      ).toHaveAttribute('aria-pressed', 'true');
    });

    test('難易度の切替で盤面サイズと残りの地雷数が変わる', async ({ page }) => {
      await page.goto(PAGES[lang]);
      const m = await readMsg(page);
      const cases = [
        ['beginner', 9, 9, 81, 10],
        ['intermediate', 16, 16, 256, 40],
        ['expert', 30, 16, 480, 99],
      ] as const;
      for (const [d, cols, rows, total, mines] of cases) {
        await page.locator(`[data-difficulty="${d}"]`).click();
        expect(await cellCount(page)).toBe(total);
        await expect(page.locator('#ms-mines-left')).toHaveText(String(mines));
        await expect(page.locator('#ms-status')).toHaveText(
          fill(m.started, { cols, rows, mines }),
        );
        await expect(page.locator(`[data-difficulty="${d}"]`)).toHaveAttribute(
          'aria-pressed',
          'true',
        );
      }
    });

    test('最初の1手では負けず、開いたマスは周囲に地雷がなく周囲8マスも開く', async ({
      page,
    }) => {
      await useSeed(page);
      const cases: [Difficulty, GameConfig, number][] = [
        ['beginner', PRESETS.beginner, 0],
        ['beginner', PRESETS.beginner, 8],
        ['beginner', PRESETS.beginner, 72],
        ['beginner', PRESETS.beginner, 80],
        ['beginner', PRESETS.beginner, MID],
        ['expert', PRESETS.expert, 0],
        ['expert', PRESETS.expert, 479],
      ];
      for (const [d, config, index] of cases) {
        // 各ケースは開き直して、同じ乱数列から最初の1手を打つ
        await page.goto(PAGES[lang]);
        const m = await readMsg(page);
        await page.locator(`[data-difficulty="${d}"]`).click();
        await cell(page, index).click();
        const states = await cellStates(page, config.cols, m);
        expect(states[index], `${d} #${index}`).toBe(m.cellEmpty);
        for (const n of neighbors(index, config.cols, config.rows)) {
          expect(states[n], `${d} #${index} の周囲 #${n}`).not.toBe(
            m.cellHidden,
          );
        }
        await expect(page.locator('#ms-status')).not.toHaveText(m.lost);
        await expect(page.locator('#ms-mines-left')).toHaveText(
          String(config.mines),
        );
      }
    });

    test('右クリックで旗（残りの地雷数が減る）、旗モードのタップで旗、掘るモードで開く', async ({
      page,
    }) => {
      await useSeed(page);
      await page.goto(PAGES[lang]);
      const m = await readMsg(page);
      await cell(page, MID).click();
      const mines = minesAfterFirstClick(PRESETS.beginner, MID);
      const states = await cellStates(page, 9, m);
      const h = states.findIndex((s) => s === m.cellHidden);
      const h2 = mines.findIndex(
        (isMine, i) => !isMine && i !== h && states[i] === m.cellHidden,
      );
      expect(h).toBeGreaterThanOrEqual(0);
      expect(h2).toBeGreaterThanOrEqual(0);

      // 右クリックで旗 → 残りの地雷数が1減る → もう一度で外れる
      await cell(page, h).click({ button: 'right' });
      expect(await stateOf(page, h, 9, m)).toBe(m.cellFlag);
      await expect(page.locator('#ms-mines-left')).toHaveText('9');
      await cell(page, h).click({ button: 'right' });
      expect(await stateOf(page, h, 9, m)).toBe(m.cellHidden);
      await expect(page.locator('#ms-mines-left')).toHaveText('10');
      await cell(page, h).click({ button: 'right' });
      await expect(page.locator('#ms-mines-left')).toHaveText('9');

      // 旗モードでは通常のタップで旗が外れる・立つ
      await page.locator('[data-mode="flag"]').click();
      await expect(page.locator('[data-mode="flag"]')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      await cell(page, h).click();
      await expect(page.locator('#ms-mines-left')).toHaveText('10');
      await cell(page, h).click();
      await expect(page.locator('#ms-mines-left')).toHaveText('9');
      expect(await stateOf(page, h, 9, m)).toBe(m.cellFlag);

      // 掘るモードに戻すと、旗のマスは開かず、ほかの安全なマスは開く
      await page.locator('[data-mode="open"]').click();
      await expect(page.locator('[data-mode="open"]')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      await cell(page, h).click();
      expect(await stateOf(page, h, 9, m)).toBe(m.cellFlag);
      await cell(page, h2).click();
      const opened = await stateOf(page, h2, 9, m);
      expect(opened).not.toBe(m.cellHidden);
      expect(opened).not.toBe(m.cellFlag);
      await expect(page.locator('#ms-mines-left')).toHaveText('9');
      await expect(page.locator('#ms-status')).not.toHaveText(m.lost);
    });

    test('地雷を開くと負けの表示になり、新しいゲームで復帰できる', async ({
      page,
    }) => {
      await useSeed(page);
      await page.goto(PAGES[lang]);
      const m = await readMsg(page);
      await cell(page, MID).click();
      const mines = minesAfterFirstClick(PRESETS.beginner, MID);
      const states = await cellStates(page, 9, m);
      const w = mines.findIndex(
        (isMine, i) => !isMine && states[i] === m.cellHidden,
      );
      const mine = mines.findIndex(
        (isMine, i) => isMine && states[i] === m.cellHidden,
      );
      expect(w).toBeGreaterThanOrEqual(0);
      expect(mine).toBeGreaterThanOrEqual(0);

      // 安全なマスに立てた旗は、負けたあとに「地雷のない場所の旗」として示される
      await cell(page, w).click({ button: 'right' });

      await cell(page, mine).click();
      await expect(page.locator('#ms-status')).toHaveText(m.lost);
      const after = await cellStates(page, 9, m);
      expect(after[mine]).toBe(m.cellExploded);
      expect(after[w]).toBe(m.cellWrongFlag);
      // 爆発した1個を除く残りの地雷が明らかになる
      expect(after.filter((s) => s === m.cellMine)).toHaveLength(9);

      // 負けたあとはタイマーが止まる
      const t1 = await page.locator('#ms-time').textContent();
      await page.waitForTimeout(300);
      await expect(page.locator('#ms-time')).toHaveText(t1 ?? '');

      // 負けたあとのクリックは無効
      await cell(page, 0).click();
      await expect(page.locator('#ms-status')).toHaveText(m.lost);

      // 新しいゲームで盤面が戻り、また遊べる
      await page.locator('#ms-new-button').click();
      await expect(page.locator('#ms-status')).toHaveText(
        fill(m.started, { cols: 9, rows: 9, mines: 10 }),
      );
      await expect(page.locator('#ms-mines-left')).toHaveText('10');
      const reset = await cellStates(page, 9, m);
      expect(reset.every((s) => s === m.cellHidden)).toBe(true);
      await cell(page, MID).click();
      await expect(page.locator('#ms-status')).not.toHaveText(m.lost);
    });

    test('安全なマスをすべて開くと勝ちの表示になり、残りの地雷に旗が立つ', async ({
      page,
    }) => {
      await useSeed(page);
      await page.goto(PAGES[lang]);
      const m = await readMsg(page);
      const mines = await winBeginner(page);

      await expect(page.locator('#ms-status')).toContainText(
        m.won.split('{time}')[0].trim(),
      );
      await expect(page.locator('#ms-status')).toContainText(m.newBest);
      await expect(page.locator('#ms-mines-left')).toHaveText('0');

      const states = await cellStates(page, 9, m);
      mines.forEach((isMine, i) => {
        if (isMine) expect(states[i]).toBe(m.cellFlag);
        else expect(states[i]).not.toBe(m.cellHidden);
      });

      await expect(page.locator('#ms-best-beginner')).toHaveText(
        /^\d+:\d{2}\.\d$/,
      );
      await expect(page.locator('#ms-best-time')).toHaveText(/^\d+:\d{2}\.\d$/);
      const saved = JSON.parse(
        (await page.evaluate(() => localStorage.getItem('minesweeper-best'))) ??
          '{}',
      );
      expect(saved.beginner).toBeGreaterThanOrEqual(1);
    });

    test('ベストタイムは再読み込み後も残り、リセットで消える', async ({
      page,
    }) => {
      await useSeed(page);
      await page.goto(PAGES[lang]);
      const m = await readMsg(page);
      await winBeginner(page);
      await expect(page.locator('#ms-best-beginner')).toHaveText(
        /^\d+:\d{2}\.\d$/,
      );

      await page.reload();
      await expect(page.locator('#ms-best-beginner')).toHaveText(
        /^\d+:\d{2}\.\d$/,
      );

      await page.locator('#ms-reset-button').click();
      await expect(page.locator('#ms-best-beginner')).toHaveText(m.bestNone);
      await expect(page.locator('#ms-status')).toHaveText(m.recordsCleared);
      expect(
        await page.evaluate(() => localStorage.getItem('minesweeper-best')),
      ).toBe('{}');
    });

    test('カスタム: 範囲外・空欄・地雷の上限超えはエラーを表示し、正常値で盤面が変わる', async ({
      page,
    }) => {
      await page.goto(PAGES[lang]);
      const m = await readMsg(page);
      await page.locator('[data-difficulty="custom"]').click();
      await expect(page.locator('#ms-custom')).toBeVisible();
      const error = page.locator('#ms-error');
      const setInputs = async (cols: string, rows: string, mines: string) => {
        await page.locator('#ms-cols').fill(cols);
        await page.locator('#ms-rows').fill(rows);
        await page.locator('#ms-mines').fill(mines);
        await page.locator('#ms-custom-start').click();
      };

      await setInputs('4', '9', '10');
      await expect(error).toBeVisible();
      await expect(error).toHaveText(fill(m.errorCols, { min: 5, max: 30 }));

      await setInputs('9', '25', '10');
      await expect(error).toHaveText(fill(m.errorRows, { min: 5, max: 24 }));

      await setInputs('', '9', '10');
      await expect(error).toHaveText(m.errorInvalid);

      // 5×5 はマス数25、最初の9マスを除いた16が地雷の上限
      await setInputs('5', '5', '17');
      await expect(error).toHaveText(fill(m.errorMines, { min: 1, max: 16 }));
      // エラーのあいだは盤面が変わらない（初級のまま）
      expect(await cellCount(page)).toBe(81);

      await setInputs('12', '10', '20');
      await expect(error).toBeHidden();
      expect(await cellCount(page)).toBe(120);
      await expect(page.locator('#ms-mines-left')).toHaveText('20');
      await expect(page.locator('#ms-status')).toHaveText(
        fill(m.started, { cols: 12, rows: 10, mines: 20 }),
      );
      // カスタムはベスト記録に残さない
      await expect(page.locator('#ms-best-time')).toHaveText(m.bestNone);
      expect(
        await page.evaluate(() => localStorage.getItem('minesweeper-best')),
      ).toBeNull();
    });

    test('チョード: 数字と同じ数の旗を立てて数字を開くと、残りの周囲をまとめて開く', async ({
      page,
    }) => {
      await useSeed(page);
      await page.goto(PAGES[lang]);
      const m = await readMsg(page);
      await cell(page, MID).click();
      const mines = minesAfterFirstClick(PRESETS.beginner, MID);
      const states = await cellStates(page, 9, m);

      // 開いていて、周囲に地雷が1つ以上ある数字のマスを探す
      const target = states.findIndex(
        (s, i) =>
          s !== m.cellHidden &&
          s !== m.cellEmpty &&
          s !== m.cellFlag &&
          neighbors(i, 9, 9).some((j) => mines[j]),
      );
      expect(target).toBeGreaterThanOrEqual(0);
      const around = neighbors(target, 9, 9);
      // 周囲の地雷の位置に旗を立てる（旗の数 = 数字）
      for (const j of around.filter((j) => mines[j])) {
        await cell(page, j).click({ button: 'right' });
      }
      await cell(page, target).click();

      await expect(page.locator('#ms-status')).not.toHaveText(m.lost);
      const after = await cellStates(page, 9, m);
      for (const j of around) {
        expect(after[j], `周囲 #${j}`).not.toBe(m.cellHidden);
      }
    });

    test('キーボード: 矢印で移動、F で旗（もう一度で外す）、Enter で開く', async ({
      page,
    }) => {
      await useSeed(page);
      await page.goto(PAGES[lang]);
      const m = await readMsg(page);
      await cell(page, 0).focus();
      await page.keyboard.press('ArrowRight');
      expect(await focusedIndex(page)).toBe(1);
      await page.keyboard.press('ArrowDown');
      expect(await focusedIndex(page)).toBe(10);
      await page.keyboard.press('f');
      expect(await stateOf(page, 10, 9, m)).toBe(m.cellFlag);
      await expect(page.locator('#ms-mines-left')).toHaveText('9');
      await page.keyboard.press('F');
      await expect(page.locator('#ms-mines-left')).toHaveText('10');
      await page.keyboard.press('f');
      await expect(page.locator('#ms-mines-left')).toHaveText('9');

      // 上へ戻って Enter で開く（1回目なので安全）
      await page.keyboard.press('ArrowUp');
      expect(await focusedIndex(page)).toBe(1);
      await page.keyboard.press('Enter');
      const opened = await stateOf(page, 1, 9, m);
      expect(opened).not.toBe(m.cellHidden);
      await expect(page.locator('#ms-status')).not.toHaveText(m.lost);

      // 端では移動しない
      await page.keyboard.press('ArrowLeft');
      expect(await focusedIndex(page)).toBe(0);
      await page.keyboard.press('ArrowLeft');
      expect(await focusedIndex(page)).toBe(0);
    });

    test('長押し（タッチ）で旗が立ち外れ、短いタップは開く操作になる', async ({
      page,
    }) => {
      await useSeed(page);
      await page.goto(PAGES[lang]);
      const m = await readMsg(page);
      await cell(page, MID).click();
      const mines = minesAfterFirstClick(PRESETS.beginner, MID);
      const states = await cellStates(page, 9, m);
      const h = states.findIndex((s) => s === m.cellHidden);
      const safe = mines.findIndex(
        (isMine, i) => !isMine && i !== h && states[i] === m.cellHidden,
      );
      expect(h).toBeGreaterThanOrEqual(0);
      expect(safe).toBeGreaterThanOrEqual(0);

      await touchHold(page, h, 500);
      expect(await stateOf(page, h, 9, m)).toBe(m.cellFlag);
      await expect(page.locator('#ms-mines-left')).toHaveText('9');

      // もう一度長押しで外れる
      await touchHold(page, h, 500);
      expect(await stateOf(page, h, 9, m)).toBe(m.cellHidden);
      await expect(page.locator('#ms-mines-left')).toHaveText('10');

      // 短いタップ（450ms 未満）は旗ではなく開く操作
      await touchTap(page, safe);
      const opened = await stateOf(page, safe, 9, m);
      expect(opened).not.toBe(m.cellHidden);
      expect(opened).not.toBe(m.cellFlag);
      await expect(page.locator('#ms-mines-left')).toHaveText('10');
    });
  });
}

test.describe('マインスイーパー 375px', () => {
  test.use({ viewport: { width: 375, height: 800 } });

  for (const lang of ['ja', 'en'] as const) {
    test(`上級（30×16）の盤面でもページ全体が横にはみ出さない（${lang}）`, async ({
      page,
    }) => {
      await page.goto(PAGES[lang]);
      await page.locator('[data-difficulty="expert"]').click();
      await expect(page.locator('#ms-board [data-index]')).toHaveCount(480);
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
      // 盤面は枠の中で横にスクロールする設計
      const overflowX = await page
        .locator('#ms-board')
        .evaluate(
          (el) => getComputedStyle(el.parentElement as HTMLElement).overflowX,
        );
      expect(overflowX).toBe('auto');
    });
  }
});
