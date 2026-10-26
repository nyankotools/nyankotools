import { test, expect } from './helpers/test';

const cell = (page: import('@playwright/test').Page, i: number) =>
  page.locator(`#ps-board [data-index="${i}"]`);

test.describe('ペグソリティア', () => {
  test('初期は英国式33穴で、残りは32個', async ({ page }) => {
    await page.goto('/tools/peg-solitaire/');
    await expect(page.locator('#ps-board button')).toHaveCount(33);
    await expect(page.locator('#ps-remaining')).toHaveText('32');
    await expect(page.locator('#ps-undo-button')).toBeDisabled();
  });

  test('欧州式に切り替えると37穴・残り36個になる', async ({ page }) => {
    await page.goto('/tools/peg-solitaire/');
    await page.locator('[data-board="european"]').click();
    await expect(page.locator('#ps-board button')).toHaveCount(37);
    await expect(page.locator('#ps-remaining')).toHaveText('36');
  });

  test('駒を選んで中央へジャンプし、戻す・リセットができる', async ({
    page,
  }) => {
    await page.goto('/tools/peg-solitaire/');
    await cell(page, 10).click();
    await expect(cell(page, 10)).toHaveAttribute('aria-pressed', 'true');
    await cell(page, 24).click();
    await expect(page.locator('#ps-remaining')).toHaveText('31');
    await expect(page.locator('#ps-moves')).toHaveText('1');
    await expect(cell(page, 17)).toHaveAttribute('aria-label', /空き/);

    await page.locator('#ps-undo-button').click();
    await expect(page.locator('#ps-remaining')).toHaveText('32');
    await expect(page.locator('#ps-undo-button')).toBeDisabled();

    await cell(page, 10).click();
    await cell(page, 24).click();
    await page.locator('#ps-reset-button').click();
    await expect(page.locator('#ps-remaining')).toHaveText('32');
    await expect(page.locator('#ps-moves')).toHaveText('0');
  });

  test('盤面を切り替えると手が初期化され、取り消しは使えなくなる', async ({
    page,
  }) => {
    await page.goto('/tools/peg-solitaire/');
    await cell(page, 10).click();
    await cell(page, 24).click();
    await expect(page.locator('#ps-undo-button')).toBeEnabled();

    await page.locator('[data-board="european"]').click();
    await expect(page.locator('#ps-board button')).toHaveCount(37);
    await expect(page.locator('#ps-remaining')).toHaveText('36');
    await expect(page.locator('#ps-moves')).toHaveText('0');
    await expect(page.locator('#ps-undo-button')).toBeDisabled();
    await expect(page.locator('[data-board="european"]')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(page.locator('[data-board="english"]')).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  test('動かせない駒を選ぶと案内が出る', async ({ page }) => {
    await page.goto('/tools/peg-solitaire/');
    await cell(page, 2).click();
    await expect(page.locator('#ps-status')).toContainText('動かせません');
  });

  test('375px幅で盤面がはみ出さない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/tools/peg-solitaire/');
    const board = await page.locator('#ps-board').boundingBox();
    expect(board).not.toBeNull();
    expect(board!.x).toBeGreaterThanOrEqual(0);
    expect(board!.x + board!.width).toBeLessThanOrEqual(375);
    const box = await cell(page, 24).boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(30);
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasOverflow).toBe(false);
  });

  test('英語ページでも動作する', async ({ page }) => {
    await page.goto('/en/tools/peg-solitaire/');
    await expect(page.locator('#ps-board button')).toHaveCount(33);
    await cell(page, 10).click();
    await cell(page, 24).click();
    await expect(page.locator('#ps-remaining')).toHaveText('31');
  });
});
