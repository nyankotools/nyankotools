import { test, expect } from './helpers/test';

test.describe('順列・組み合わせ計算ツール', () => {
  test('初期値で各結果が表示される', async ({ page }) => {
    await page.goto('/tools/combination-calculator/');
    await expect(page.locator('#comb-value-factorial')).toHaveText('3628800');
    await expect(page.locator('#comb-value-permutation')).toHaveText('720');
    await expect(page.locator('#comb-value-combination')).toHaveText('120');
    await expect(page.locator('#comb-value-repeatedPermutation')).toHaveText(
      '1000',
    );
    await expect(page.locator('#comb-value-repeatedCombination')).toHaveText(
      '220',
    );
  });

  test('巨大な値は全桁と桁数が表示される', async ({ page }) => {
    await page.goto('/tools/combination-calculator/');
    await page.locator('#comb-n').fill('100');
    await page.locator('#comb-r').fill('50');
    await expect(page.locator('#comb-value-combination')).toHaveText(
      '100891344545564193334812497256',
    );
    await expect(page.locator('#comb-meta-factorial')).toContainText('158');
  });

  test('r が n を超えると順列・組み合わせは計算不可になる', async ({
    page,
  }) => {
    await page.goto('/tools/combination-calculator/');
    await page.locator('#comb-n').fill('3');
    await page.locator('#comb-r').fill('5');
    await expect(page.locator('#comb-value-permutation')).toHaveText('—');
    await expect(page.locator('#comb-notice')).toBeVisible();
    await expect(page.locator('#comb-value-repeatedCombination')).toHaveText(
      '21',
    );
  });

  test('負数・小数・上限超過・空入力はエラーになる', async ({ page }) => {
    await page.goto('/tools/combination-calculator/');
    for (const bad of ['-1', '2.5', '10001', '']) {
      await page.locator('#comb-n').fill(bad);
      await expect(page.locator('#comb-error')).toBeVisible();
      await expect(page.locator('#comb-results')).toBeHidden();
    }
    await page.locator('#comb-n').fill('5');
    await expect(page.locator('#comb-error')).toBeHidden();
  });

  test('コピーボタンで全桁がコピーされる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/combination-calculator/');
    await page.locator('#comb-copy-button-factorial').click();
    await expect(page.locator('#comb-status')).not.toHaveText('');
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toBe('3628800');
  });

  test('n=10000・r=5000 でも全桁と桁数が表示される', async ({ page }) => {
    await page.goto('/tools/combination-calculator/');
    await page.locator('#comb-n').fill('10000');
    await page.locator('#comb-r').fill('5000');
    // 10000! は 35660 桁、10000^5000 は 20001 桁
    await expect(page.locator('#comb-value-factorial')).toHaveText(
      /^2846259680\d{35650}$/,
      { timeout: 15000 },
    );
    await expect(page.locator('#comb-meta-factorial')).toContainText('35660');
    await expect(page.locator('#comb-meta-repeatedPermutation')).toContainText(
      '20001',
    );
    await expect(page.locator('#comb-value-permutation')).not.toHaveText('—');
  });

  test('英語版が表示され計算できる', async ({ page }) => {
    await page.goto('/en/tools/combination-calculator/');
    await expect(page.locator('main h1')).toContainText('Permutation');
    await page.locator('#comb-n').fill('52');
    await page.locator('#comb-r').fill('5');
    await expect(page.locator('#comb-value-combination')).toHaveText('2598960');
  });
});
