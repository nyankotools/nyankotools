import { test, expect } from './helpers/test';
import type { Page } from '@playwright/test';

async function solveWithHints(page: Page) {
  const status = page.locator('#os-status');
  for (let i = 0; i < 40; i++) {
    const state = await page.locator('#os-root').getAttribute('data-state');
    if (state === 'solved') return;
    await page.locator('#os-hint').click();
    const n = Number((await status.textContent())!.match(/\d+/)![0]);
    await page.locator(`#os-board [data-vertex="${n - 1}"]`).click();
  }
}

test('ヒントに従って進めると一筆書きでクリアできる', async ({ page }) => {
  await page.goto('/tools/one-stroke-puzzle/');
  await expect(page.locator('#os-root')).toHaveAttribute('data-state', 'ready');
  await expect(page.locator('#os-board [data-vertex]').first()).toBeVisible();
  await solveWithHints(page);
  await expect(page.locator('#os-root')).toHaveAttribute(
    'data-state',
    'solved',
  );
  const used = (await page.locator('#os-used').textContent())!.split(' / ');
  expect(used[0]).toBe(used[1]);
});

test('1手戻すとリセット、難易度変更で新しい問題になる', async ({ page }) => {
  await page.goto('/tools/one-stroke-puzzle/');
  const undo = page.locator('#os-undo');
  await expect(undo).toBeDisabled();
  await page.locator('#os-hint').click();
  const n = Number(
    (await page.locator('#os-status').textContent())!.match(/\d+/)![0],
  );
  await page.locator(`#os-board [data-vertex="${n - 1}"]`).click();
  await expect(page.locator('#os-root')).toHaveAttribute(
    'data-state',
    'playing',
  );
  await expect(undo).toBeEnabled();
  await undo.click();
  await expect(page.locator('#os-root')).toHaveAttribute('data-state', 'ready');
  await expect(undo).toBeDisabled();

  await page.locator('#os-level').selectOption('hard');
  await expect(page.locator('#os-used')).toHaveText('0 / 14');
  await page.locator('#os-reset').click();
  await expect(page.locator('#os-used')).toHaveText('0 / 14');
});

test('同じ頂点を押し直しても線は増えない', async ({ page }) => {
  await page.goto('/tools/one-stroke-puzzle/');
  await page.locator('#os-level').selectOption('hard');
  const first = page.locator('#os-board [data-vertex]').first();
  await first.click();
  // 同じ頂点を押しても何も起きない
  await first.click();
  await expect(page.locator('#os-used')).toHaveText('0 / 14');
});

test('一筆書きパズル（英語）が表示される', async ({ page }) => {
  await page.goto('/en/tools/one-stroke-puzzle/');
  await expect(page.locator('main h1')).toContainText('One-Stroke Puzzle');
  await expect(page.locator('#os-hint')).toHaveText('Hint');
  await solveWithHints(page);
  await expect(page.locator('#os-root')).toHaveAttribute(
    'data-state',
    'solved',
  );
});
