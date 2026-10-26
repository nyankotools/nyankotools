import { test, expect } from './helpers/test';

test('モグラ叩きで開始してネコを叩くとスコアが増え、30秒で終了する', async ({
  page,
}) => {
  test.setTimeout(60_000);
  await page.goto('/tools/whack-a-mole/');
  const root = page.locator('#wam-root');
  await expect(root).toHaveAttribute('data-state', 'ready');

  await page.locator('#wam-start').click();
  await expect(root).toHaveAttribute('data-state', 'playing');

  const active = page.locator('#wam-board [data-active="true"]');
  await expect(active.first()).toBeVisible({ timeout: 3000 });
  await active.first().locator('xpath=..').dispatchEvent('pointerdown', {
    button: 0,
    pointerType: 'mouse',
  });
  await expect(page.locator('#wam-score')).toHaveText('1');

  // 空の穴を叩くとミスになる。空き穴の判定と叩く操作を同じページ内の処理で行い、
  // モグラが出現する競合（フレーク）を避ける
  await page.evaluate(() => {
    const holes = Array.from(
      document.querySelectorAll<HTMLButtonElement>('#wam-board button'),
    );
    const empty = holes.find(
      (b) =>
        b.querySelector('[data-active]')?.getAttribute('data-active') !==
        'true',
    );
    if (!empty) throw new Error('空の穴がありません');
    empty.dispatchEvent(
      new PointerEvent('pointerdown', {
        button: 0,
        pointerType: 'mouse',
        bubbles: true,
      }),
    );
  });
  await expect(page.locator('#wam-miss')).toHaveText('1');

  await expect(root).toHaveAttribute('data-state', 'finished', {
    timeout: 35_000,
  });
  await expect(page.locator('#wam-status')).toContainText('1');
  await expect(page.locator('#wam-best')).toHaveText('1');
  expect(
    await page.evaluate(() => localStorage.getItem('whack-a-mole-best')),
  ).toBe('1');

  await page.locator('#wam-reset-best').click();
  await expect(page.locator('#wam-best')).not.toHaveText('1');
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
  await page.goto('/tools/whack-a-mole/');
  await page.locator('#wam-start').click();
  await expect(page.locator('#wam-root')).toHaveAttribute(
    'data-state',
    'playing',
  );
  expect(errors).toEqual([]);
});

test('モグラ叩き（英語）が表示される', async ({ page }) => {
  await page.goto('/en/tools/whack-a-mole/');
  await expect(page.locator('main h1')).toContainText('Whack-a-Mole');
  await expect(page.locator('#wam-start')).toHaveText('Start');
  await expect(page.locator('#wam-board button')).toHaveCount(9);
});
