import { test, expect } from './helpers/test';

test('ハノイの塔で3枚を最短7手でクリアできる', async ({ page }) => {
  await page.goto('/tools/tower-of-hanoi/');
  await page.locator('#th-discs').selectOption('3');
  await expect(page.locator('#th-min')).toHaveText('7');

  const pegs = page.locator('#th-board button[data-peg]');
  const seq = [
    [0, 2],
    [0, 1],
    [2, 1],
    [0, 2],
    [1, 0],
    [1, 2],
    [0, 2],
  ];
  for (const [from, to] of seq) {
    await pegs.nth(from!).click();
    await pegs.nth(to!).click();
  }
  await expect(page.locator('#th-root')).toHaveAttribute(
    'data-state',
    'solved',
  );
  await expect(page.locator('#th-moves')).toHaveText('7');
  await expect(page.locator('#th-best')).toHaveText('7');
});

test('大きい円盤を小さい円盤の上には置けない', async ({ page }) => {
  await page.goto('/tools/tower-of-hanoi/');
  await page.locator('#th-discs').selectOption('3');
  const pegs = page.locator('#th-board button[data-peg]');
  await pegs.nth(0).click();
  await pegs.nth(1).click();
  await pegs.nth(0).click();
  await pegs.nth(1).click();
  await expect(page.locator('#th-moves')).toHaveText('1');
});

test('杭を選ぶとaria-pressedが切り替わり、数字キーで移動できる', async ({
  page,
}) => {
  await page.goto('/tools/tower-of-hanoi/');
  const pegs = page.locator('#th-board button[data-peg]');
  await expect(pegs.nth(0)).toHaveAttribute('aria-pressed', 'false');
  await page.keyboard.press('1');
  await expect(pegs.nth(0)).toHaveAttribute('aria-pressed', 'true');
  await expect(pegs.nth(1)).toHaveAttribute('aria-pressed', 'false');
  // 数字キーでも選択・移動が効く（1→2 へ最小の円盤を移す）
  await page.keyboard.press('2');
  await expect(page.locator('#th-moves')).toHaveText('1');
  await expect(pegs.nth(0)).toHaveAttribute('aria-pressed', 'false');
  await expect(pegs.nth(1)).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('#th-root')).toHaveAttribute(
    'data-state',
    'playing',
  );
});

test('枚数の選択欄にフォーカスがあるときは数字キーで盤面が動かない', async ({
  page,
}) => {
  await page.goto('/tools/tower-of-hanoi/');
  await page.locator('#th-discs').focus();
  await page.keyboard.press('1');
  await expect(page.locator('#th-moves')).toHaveText('0');
  await expect(
    page.locator('#th-board button[data-peg]').nth(0),
  ).toHaveAttribute('aria-pressed', 'false');
});

test('自動で解くと最適解が再生され、停止できる', async ({ page }) => {
  test.setTimeout(30_000);
  await page.goto('/tools/tower-of-hanoi/');
  await page.locator('#th-discs').selectOption('3');
  await page.locator('#th-auto').click();
  await expect(page.locator('#th-root')).toHaveAttribute('data-state', 'auto');
  await page.locator('#th-auto').click();
  await expect(page.locator('#th-root')).toHaveAttribute(
    'data-state',
    'playing',
  );
  await page.locator('#th-auto').click();
  await expect(page.locator('#th-root')).toHaveAttribute(
    'data-state',
    'solved',
    { timeout: 10_000 },
  );
  await expect(page.locator('#th-moves')).toHaveText('7');
  // 自動解法ではベストに記録されない
  await expect(page.locator('#th-best')).not.toHaveText('7');
});

test('localStorageが使えなくても遊べる', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new Error('blocked');
      },
    });
  });
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/tools/tower-of-hanoi/');
  await page.locator('#th-discs').selectOption('3');
  const pegs = page.locator('#th-board button[data-peg]');
  await pegs.nth(0).click();
  await pegs.nth(1).click();
  await expect(page.locator('#th-moves')).toHaveText('1');
  expect(errors).toEqual([]);
});

test('ハノイの塔（英語）が表示される', async ({ page }) => {
  await page.goto('/en/tools/tower-of-hanoi/');
  await expect(page.locator('main h1')).toContainText('Tower of Hanoi');
  await expect(page.locator('#th-auto')).toHaveText('Auto-solve');
  await expect(page.locator('#th-board button')).toHaveCount(3);
});
