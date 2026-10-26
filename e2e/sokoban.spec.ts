import { test, expect } from './helpers/test';

test.describe('箱押しパズル', () => {
  test('初期表示はステージ1で、手数0・記録なし', async ({ page }) => {
    await page.goto('/tools/sokoban/');
    await expect(page.locator('#sk-level')).toHaveValue('0');
    await expect(page.locator('#sk-moves')).toHaveText('0');
    await expect(page.locator('#sk-boxes')).toHaveText('0/1');
    await expect(page.locator('#sk-best')).toHaveText('記録なし');
    await expect(page.locator('#sk-undo-button')).toBeDisabled();
    await expect(page.locator('#sk-prev-button')).toBeDisabled();
    await expect(page.locator('#sk-level option')).toHaveCount(20);
  });

  test('矢印キーで箱を押してクリアし、最短記録が保存される', async ({
    page,
  }) => {
    await page.goto('/tools/sokoban/');
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#sk-boxes')).toHaveText('1/1');
    await expect(page.locator('#sk-moves')).toHaveText('1');
    await expect(page.locator('#sk-pushes')).toHaveText('1');
    await expect(page.locator('#sk-status')).toContainText('クリア');
    await expect(page.locator('#sk-best')).toHaveText('1');

    await page.reload();
    await expect(page.locator('#sk-best')).toHaveText('1');
    await expect(page.locator('#sk-level option').first()).toContainText(
      'クリア済み',
    );
  });

  test('方向ボタンで動かせ、1手戻す・リセットができる', async ({ page }) => {
    await page.goto('/tools/sokoban/');
    await page.locator('#sk-level').selectOption('1');
    await expect(page.locator('#sk-moves')).toHaveText('0');
    await page.locator('[data-dir="up"]').click();
    await expect(page.locator('#sk-moves')).toHaveText('1');
    await expect(page.locator('#sk-undo-button')).toBeEnabled();
    await page.locator('#sk-undo-button').click();
    await expect(page.locator('#sk-moves')).toHaveText('0');
    await page.locator('[data-dir="left"]').click();
    await page.locator('#sk-reset-button').click();
    await expect(page.locator('#sk-moves')).toHaveText('0');
    await expect(page.locator('#sk-pushes')).toHaveText('0');
  });

  test('前の面・次の面で切り替えられる', async ({ page }) => {
    await page.goto('/tools/sokoban/');
    await page.locator('#sk-next-button').click();
    await expect(page.locator('#sk-level')).toHaveValue('1');
    await expect(page.locator('#sk-prev-button')).toBeEnabled();
    await page.locator('#sk-prev-button').click();
    await expect(page.locator('#sk-level')).toHaveValue('0');
  });

  test('375px幅で盤面がはみ出さない', async ({ page }) => {
    // 盤面の列数はJSがCSSOMで設定する。CSPに弾かれず、コンソールエラーも出ないことを確認する
    const cspErrors: string[] = [];
    page.on('console', (msg) => {
      if (
        msg.type() === 'error' &&
        /Content[- ]Security[- ]Policy/i.test(msg.text())
      )
        cspErrors.push(msg.text());
    });
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/tools/sokoban/');
    // option の value は 0 始まり（表示は「面 19」）
    await page.locator('#sk-level').selectOption('19');
    await expect(page.locator('#sk-level')).toHaveValue('19');
    // CSSOMで設定された列数が反映されている（ブロックされていない）ことを確認
    expect(
      await page
        .locator('#sk-board')
        .evaluate((el) => (el as HTMLElement).style.gridTemplateColumns),
    ).toMatch(/^repeat\(\d+, minmax\(0(px)?, 1fr\)\)$/);
    const board = await page.locator('#sk-board').boundingBox();
    expect(board).not.toBeNull();
    expect(board!.x).toBeGreaterThanOrEqual(0);
    expect(board!.x + board!.width).toBeLessThanOrEqual(375);
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasOverflow).toBe(false);
    expect(cspErrors).toEqual([]);
  });

  test('英語ページでも動作する', async ({ page }) => {
    await page.goto('/en/tools/sokoban/');
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#sk-status')).toContainText('cleared');
    await expect(page.locator('#sk-best')).toHaveText('1');
  });
});
