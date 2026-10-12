import { test, expect, type Page } from './helpers/test';

const PAGES = {
  ja: '/tools/color-sense-test/',
  en: '/en/tools/color-sense-test/',
} as const;

const STORAGE_KEY = 'color-sense-test-best';

// 違うタイルは背景色が1つだけ異なる。その位置を返す
const findOddIndex = (page: Page) =>
  page.locator('#cs-board button').evaluateAll((els) => {
    const colors = els.map((e) => (e as HTMLElement).style.backgroundColor);
    return colors.findIndex((c) => colors.filter((x) => x === c).length === 1);
  });

const findWrongIndex = (page: Page) =>
  page.locator('#cs-board button').evaluateAll((els) => {
    const colors = els.map((e) => (e as HTMLElement).style.backgroundColor);
    return colors.findIndex((c) => colors.filter((x) => x === c).length > 1);
  });

async function answerCorrectly(page: Page, times: number) {
  for (let i = 0; i < times; i++) {
    const idx = await findOddIndex(page);
    await page.locator('#cs-board button').nth(idx).click();
  }
}

for (const locale of ['ja', 'en'] as const) {
  test.describe(`色彩感覚テスト (${locale})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(PAGES[locale]);
      await expect(page.locator('#cs-start-button')).toBeVisible();
    });

    test('開始前はタイルが表示されず、スタートで2×2が出る', async ({
      page,
    }) => {
      await expect(page.locator('#cs-board')).toBeHidden();
      await expect(page.locator('#cs-idle')).toBeVisible();
      await page.locator('#cs-start-button').click();
      await expect(page.locator('#cs-board button')).toHaveCount(4);
      await expect(page.locator('#cs-start-button')).toBeDisabled();
    });

    test('違うタイルを選ぶと正解数が増え、タイルが増える', async ({ page }) => {
      await page.locator('#cs-start-button').click();
      await answerCorrectly(page, 3);
      await expect(page.locator('#cs-score')).toHaveText('3');
      // 4問目は3×3
      await expect(page.locator('#cs-board button')).toHaveCount(9);
      await expect(page.locator('#cs-stage')).toHaveText('4');
    });

    test('間違えると残り時間が減り、正解数は増えない', async ({ page }) => {
      await page.locator('#cs-start-button').click();
      const buttons = page.locator('#cs-board button');
      const wrong = await findWrongIndex(page);
      await buttons.nth(wrong).click();
      await expect(page.locator('#cs-score')).toHaveText('0');
      const left = await page.locator('#cs-time').innerText();
      const [m, s] = left.split(':').map(Number);
      expect(m * 60 + s).toBeLessThanOrEqual(57);
      await expect(page.locator('#cs-board button')).toHaveCount(4);
    });

    test('キーボードで正解すると先頭タイルへフォーカスが戻り、誤答ではフォーカスが動かない', async ({
      page,
    }) => {
      await page.locator('#cs-start-button').click();
      const tiles = page.locator('#cs-board button');
      await expect(tiles.first()).toBeFocused();

      // 誤答: Enter で押しても盤面は作り直されず、同じタイルにフォーカスが残る
      const wrong = await findWrongIndex(page);
      await tiles.nth(wrong).focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('#cs-score')).toHaveText('0');
      await expect(tiles.nth(wrong)).toBeFocused();

      // 正解: Enter で正解し、新しい盤面の先頭へフォーカスが戻る
      const odd = await findOddIndex(page);
      await tiles.nth(odd).focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('#cs-score')).toHaveText('1');
      // 2問目はまだ2×2（ステージ2）
      await expect(page.locator('#cs-board button')).toHaveCount(4);
      await expect(page.locator('#cs-board button').first()).toBeFocused();
    });

    test('ベストスコアの消去ボタンで記録なしに戻る', async ({ page }) => {
      await page.evaluate(
        (key) => localStorage.setItem(key, '12'),
        STORAGE_KEY,
      );
      await page.reload();
      await expect(page.locator('#cs-best')).toContainText('12');
      await page.locator('#cs-reset-button').click();
      await expect(page.locator('#cs-best')).not.toContainText('12');
      expect(
        await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY),
      ).toBe('0');
    });
  });

  test.describe(`色彩感覚テスト・時間切れ フロー (${locale})`, () => {
    test.beforeEach(async ({ page }) => {
      // タイマーを手動で進めるため、ページ読み込み前に時計を固定する
      await page.clock.install({ time: new Date('2026-01-01T00:00:00') });
      await page.goto(PAGES[locale]);
      await page.clock.pauseAt(new Date('2026-01-01T00:00:01'));
      await expect(page.locator('#cs-start-button')).toBeVisible();
    });

    test('時間切れで結果が出てベストが更新され、もう一度で再開できる', async ({
      page,
    }) => {
      const root = page.locator('#cs-root');
      const newBest = (await root.getAttribute('data-new-best')) ?? '';
      const bestValue = (await root.getAttribute('data-best-value')) ?? '';
      const restart =
        (await page.locator('#cs-start-button').getAttribute('data-restart')) ??
        '';

      await page.locator('#cs-start-button').click();
      await answerCorrectly(page, 2);
      await expect(page.locator('#cs-score')).toHaveText('2');

      // 60秒経過させて時間切れ
      await page.clock.runFor(60_000);
      await expect(page.locator('#cs-board')).toBeHidden();
      await expect(page.locator('#cs-idle')).toBeVisible();
      await expect(page.locator('#cs-time')).toHaveText('0:00');
      await expect(page.locator('#cs-status')).toContainText(newBest);
      await expect(page.locator('#cs-best')).toContainText(
        bestValue.replace('{score}', '2'),
      );
      expect(
        await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY),
      ).toBe('2');
      // 結果後はスタートボタンが「もう一度」になり、フォーカスが戻る
      await expect(page.locator('#cs-start-button')).toBeEnabled();
      await expect(page.locator('#cs-start-button')).toHaveText(restart);
      await expect(page.locator('#cs-start-button')).toBeFocused();

      // もう一度: 盤面が出て、正解数とステージがリセットされる
      await page.locator('#cs-start-button').click();
      await expect(page.locator('#cs-board button')).toHaveCount(4);
      await expect(page.locator('#cs-score')).toHaveText('0');
      await expect(page.locator('#cs-stage')).toHaveText('1');
      await expect(page.locator('#cs-status')).toBeEmpty();

      // 下回る結果ではベストは変わらず、新記録の文言も出ない
      await answerCorrectly(page, 1);
      await page.clock.runFor(60_000);
      await expect(page.locator('#cs-idle')).toBeVisible();
      await expect(page.locator('#cs-status')).not.toContainText(newBest);
      expect(
        await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY),
      ).toBe('2');
    });

    test('ミスの罰則で残り時間が短くなり、時間切れの判定に反映される', async ({
      page,
    }) => {
      await page.locator('#cs-start-button').click();
      // 罰則 3秒 × 20回 = 60秒で残りは0になる
      const wrong = await findWrongIndex(page);
      for (let i = 0; i < 20; i++) {
        await page.locator('#cs-board button').nth(wrong).click();
      }
      await expect(page.locator('#cs-board')).toBeHidden();
      await expect(page.locator('#cs-idle')).toBeVisible();
      await expect(page.locator('#cs-start-button')).toBeFocused();
    });

    test('7×7 でもタイルが小さくなりすぎず、横に溢れない（375px）', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 375, height: 800 });
      await page.locator('#cs-start-button').click();
      // 10問正解するとステージ11=7×7
      await answerCorrectly(page, 10);
      await expect(page.locator('#cs-board button')).toHaveCount(49);

      const board = await page.locator('#cs-board').boundingBox();
      const tile = await page.locator('#cs-board button').first().boundingBox();
      expect(board).not.toBeNull();
      expect(tile).not.toBeNull();
      expect(board!.x + board!.width).toBeLessThanOrEqual(375);
      expect(tile!.width).toBeGreaterThanOrEqual(30);
      expect(Math.abs(tile!.width - tile!.height)).toBeLessThan(1);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  });
}
