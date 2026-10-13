import { test, expect } from './helpers/test';

test.describe('GPA計算ツール', () => {
  test('日本の大学スケールでGPAが計算される', async ({ page }) => {
    await page.goto('/tools/gpa-calculator/');
    const rows = page.locator('.gpa-row');
    await expect(rows).toHaveCount(5);
    await expect(page.locator('#gpa-empty')).toBeVisible();

    await rows.nth(0).locator('.gpa-credits').fill('2');
    await rows.nth(0).locator('.gpa-grade').selectOption('S');
    await rows.nth(1).locator('.gpa-credits').fill('4');
    await rows.nth(1).locator('.gpa-grade').selectOption('A');
    await rows.nth(2).locator('.gpa-credits').fill('2');
    await rows.nth(2).locator('.gpa-grade').selectOption('D');

    // (2*4 + 4*3 + 2*0) / 8 = 2.5
    await expect(page.locator('#gpa-value')).toHaveText('2.50');
    await expect(page.locator('#gpa-total-credits')).toHaveText('8');
    await expect(page.locator('#gpa-earned-credits')).toHaveText('6');
  });

  test('スケールを切り替えると評価の選択肢と結果が変わる', async ({ page }) => {
    await page.goto('/tools/gpa-calculator/');
    await page.locator('#gpa-scale').selectOption('us-43');
    const row = page.locator('.gpa-row').first();
    await row.locator('.gpa-credits').fill('3');
    await row.locator('.gpa-grade').selectOption('A+');
    await expect(page.locator('#gpa-value')).toHaveText('4.30');
    await page.locator('#gpa-scale').selectOption('us-4-plus');
    await expect(page.locator('#gpa-value')).toHaveText('4.00');
  });

  test('科目の追加・削除と評価未選択行の除外', async ({ page }) => {
    await page.goto('/tools/gpa-calculator/');
    await page.locator('#gpa-add-button').click();
    await expect(page.locator('.gpa-row')).toHaveCount(6);
    const rows = page.locator('.gpa-row');
    await rows.nth(0).locator('.gpa-credits').fill('2');
    await rows.nth(0).locator('.gpa-grade').selectOption('B');
    await rows.nth(1).locator('.gpa-credits').fill('3');
    await expect(page.locator('#gpa-ungraded')).toBeVisible();
    await expect(page.locator('#gpa-value')).toHaveText('2.00');
    await rows.nth(1).locator('.gpa-remove').click();
    await expect(page.locator('.gpa-row')).toHaveCount(5);
    await expect(page.locator('#gpa-ungraded')).toBeHidden();
  });

  test('不正な単位数はエラー表示になる', async ({ page }) => {
    await page.goto('/tools/gpa-calculator/');
    const row = page.locator('.gpa-row').first();
    await row.locator('.gpa-credits').fill('-2');
    await row.locator('.gpa-grade').selectOption('A');
    await expect(page.locator('#gpa-invalid')).toBeVisible();
    await expect(page.locator('#gpa-empty')).toBeVisible();
  });

  test('英語版が表示され計算できる', async ({ page }) => {
    await page.goto('/en/tools/gpa-calculator/');
    await expect(page.locator('main h1')).toContainText('GPA Calculator');
    await page.locator('#gpa-scale').selectOption('us-4');
    const row = page.locator('.gpa-row').first();
    await row.locator('.gpa-credits').fill('3');
    await row.locator('.gpa-grade').selectOption('B');
    await expect(page.locator('#gpa-value')).toHaveText('3.00');
  });
});
