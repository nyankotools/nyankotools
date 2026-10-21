import { test, expect } from './helpers/test';

test.describe('二次方程式・連立方程式ソルバー', () => {
  test('初期値で x²-3x+2=0 の解が表示される', async ({ page }) => {
    await page.goto('/tools/quadratic-solver/');

    await expect(page.locator('#quad-roots')).toHaveText('x₁ = 2, x₂ = 1');
    await expect(page.locator('#quad-steps li')).toHaveCount(4);
  });

  test('判別式が負のとき虚数解が表示される', async ({ page }) => {
    await page.goto('/tools/quadratic-solver/');

    await page.locator('#quad-a').fill('1');
    await page.locator('#quad-b').fill('2');
    await page.locator('#quad-c').fill('5');

    await expect(page.locator('#quad-roots')).toHaveText(
      'x₁ = -1 + 2i, x₂ = -1 - 2i',
    );
  });

  test('重解になる', async ({ page }) => {
    await page.goto('/tools/quadratic-solver/');

    await page.locator('#quad-b').fill('-2');
    await page.locator('#quad-c').fill('1');

    await expect(page.locator('#quad-roots')).toHaveText('x = 1');
  });

  test('2元連立方程式を解ける', async ({ page }) => {
    await page.goto('/tools/quadratic-solver/');

    await page.locator('#sys-1-1').fill('2');
    await page.locator('#sys-1-2').fill('1');
    await page.locator('#sys-1-const').fill('5');
    await page.locator('#sys-2-1').fill('1');
    await page.locator('#sys-2-2').fill('-1');
    await page.locator('#sys-2-const').fill('1');

    await expect(page.locator('#sys-solutions')).toHaveText('x = 2, y = 1');
  });

  test('3元に切り替えて解ける', async ({ page }) => {
    await page.goto('/tools/quadratic-solver/');

    await page.locator('input[name="sys-size"][value="3"]').check();

    await expect(page.locator('#sys-solutions')).toHaveText(
      'x = 5, y = 3, z = -2',
    );
  });

  test('解なしの連立方程式で解の欄が非表示になる', async ({ page }) => {
    await page.goto('/tools/quadratic-solver/');

    await page.locator('#sys-1-1').fill('1');
    await page.locator('#sys-1-2').fill('1');
    await page.locator('#sys-1-const').fill('1');
    await page.locator('#sys-2-1').fill('2');
    await page.locator('#sys-2-2').fill('2');
    await page.locator('#sys-2-const').fill('3');

    await expect(page.locator('#sys-kind')).toContainText('解なし');
    await expect(page.locator('#sys-solutions')).toBeHidden();
  });

  test('3元の途中式を表示しても375px幅で横スクロールしない', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/tools/quadratic-solver/');

    await page.locator('input[name="sys-size"][value="3"]').check();
    await expect(page.locator('#sys-solutions')).toBeVisible();
    await expect(page.locator('#sys-steps li').first()).toBeVisible();

    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasOverflow, '3元の途中式表示時の375px横スクロール').toBe(false);
  });

  test('英語ページが表示される', async ({ page }) => {
    await page.goto('/en/tools/quadratic-solver/');

    await expect(page.locator('main h1')).toHaveText(
      'Quadratic Equation & Linear System Solver (with Steps)',
    );
    await expect(page.locator('#quad-roots')).toHaveText('x₁ = 2, x₂ = 1');
  });
});
