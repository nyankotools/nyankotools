import { test, expect } from './helpers/test';

test.describe('数独', () => {
  test('盤面が81マス表示され、ヒント数が一定以上ある', async ({ page }) => {
    await page.goto('/tools/sudoku/');
    await expect(page.locator('#sd-board button')).toHaveCount(81);
    const filled = await page
      .locator('#sd-board button')
      .evaluateAll(
        (els) => els.filter((e) => /^[1-9]$/.test(e.textContent ?? '')).length,
      );
    expect(filled).toBeGreaterThanOrEqual(17);
    expect(filled).toBeLessThan(81);
  });

  test('難易度を変えるとヒント数が変わる', async ({ page }) => {
    await page.goto('/tools/sudoku/');
    const count = () =>
      page
        .locator('#sd-board button')
        .evaluateAll(
          (els) =>
            els.filter((e) => /^[1-9]$/.test(e.textContent ?? '')).length,
        );
    await page.locator('[data-difficulty="easy"]').click();
    const easy = await count();
    await page.locator('[data-difficulty="hard"]').click();
    const hard = await count();
    expect(hard).toBeLessThan(easy);
  });

  test('ヒントで空きマスが1つ埋まる', async ({ page }) => {
    await page.goto('/tools/sudoku/');
    const left = page.locator('#sd-progress');
    const before = (await left.textContent()) ?? '';
    await page.locator('#sd-hint-button').click();
    await expect(left).not.toHaveText(before);
    await expect(page.locator('#sd-status')).toContainText('ヒント');
  });

  test('パッドで入力でき、メモと消去が動く', async ({ page }) => {
    await page.goto('/tools/sudoku/');
    // 最初に選択されているのは空きマス
    const sel = page.locator('#sd-board button[tabindex="0"]');
    await page.locator('#sd-note-button').click();
    await page.locator('[data-pad="5"]').click();
    await expect(sel.locator('span span').filter({ hasText: '5' })).toHaveCount(
      1,
    );
    await page.locator('#sd-note-button').click();
    await page.locator('[data-pad="3"]').click();
    await expect(sel).toHaveText('3');
    await page.locator('#sd-erase-button').click();
    await expect(sel).toHaveText('');
  });

  test('キーボードで矢印移動・入力できる', async ({ page }) => {
    await page.goto('/tools/sudoku/');
    const sel = page.locator('#sd-board button[tabindex="0"]');
    await sel.focus();
    const before = await sel.getAttribute('data-index');
    await page.keyboard.press('ArrowRight');
    const after = await page
      .locator('#sd-board button[tabindex="0"]')
      .getAttribute('data-index');
    expect(Number(after)).toBe(Math.min(80, Number(before) + 1));
  });

  test('ヒント後の誤りチェックは間違いなしと表示する', async ({ page }) => {
    await page.goto('/tools/sudoku/');
    await page.locator('#sd-hint-button').click();
    await page.locator('#sd-check-button').click();
    await expect(page.locator('#sd-status')).toContainText(
      '間違いはありません',
    );
  });

  test('誤りがあるときチェックボタンで誤りが検出される', async ({ page }) => {
    await page.goto('/tools/sudoku/');
    // 複数の空きマスを見つけて、誤った数字を入力
    const cells = page.locator('#sd-board button');
    const count = await cells.count();
    // 最初の空きマスを見つけて1を入力
    for (let i = 0; i < count; i++) {
      const cell = cells.nth(i);
      const text = await cell.textContent();
      if (text === '') {
        await cell.click();
        await page.locator('[data-pad="1"]').click();
        break;
      }
    }
    // 次の空きマスを見つけて1を入力（同じ行・列・ブロックに1が二重になる可能性あり）
    for (let i = 0; i < count; i++) {
      const cell = cells.nth(i);
      const text = await cell.textContent();
      if (text === '') {
        await cell.click();
        await page.locator('[data-pad="1"]').click();
        break;
      }
    }
    // チェックで誤りが検出される
    await page.locator('#sd-check-button').click();
    await expect(page.locator('#sd-status')).toContainText('正解と違うマス');
  });

  test('最初からで入力が消える', async ({ page }) => {
    await page.goto('/tools/sudoku/');
    const left = page.locator('#sd-progress');
    const before = await left.textContent();
    await page.locator('#sd-hint-button').click();
    await page.locator('#sd-restart-button').click();
    await expect(left).toHaveText(before ?? '');
  });

  test('英語ページでも動作する', async ({ page }) => {
    await page.goto('/en/tools/sudoku/');
    await expect(page.locator('#sd-board button')).toHaveCount(81);
    await page.locator('#sd-hint-button').click();
    await expect(page.locator('#sd-status')).toContainText('Hint');
  });
});
