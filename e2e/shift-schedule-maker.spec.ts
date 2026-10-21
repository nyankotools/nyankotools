import { test, expect } from './helpers/test';

test.describe('シフト表・当番表作成', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/shift-schedule-maker/');
    await page.locator('#shift-year').fill('2026');
    await page.locator('#shift-month').selectOption('10');
  });

  test('2026年10月のシフト表が31日分・5人で作られる', async ({ page }) => {
    await expect(page.locator('#shift-table thead th')).toHaveCount(31 + 2);
    await expect(page.locator('#shift-table tbody tr')).toHaveCount(5);
    await expect(page.locator('#shift-daily li')).toHaveCount(31);
  });

  test('希望休の日は担当にならず「休」が表示される', async ({ page }) => {
    await page.locator('#shift-closed').uncheck();
    await page.locator('#shift-offs').fill('田中: 1-3');
    const first = page.locator('#shift-table tbody tr').first();
    await expect(first.locator('td').nth(0)).toHaveText('休');
    await expect(first.locator('td').nth(2)).toHaveText('休');
    await expect(first.locator('td').nth(3)).not.toHaveText('休');
  });

  test('人数が足りない日は警告が表示される', async ({ page }) => {
    await page.locator('#shift-members').fill('田中');
    await page.locator('#shift-per-day').fill('2');
    await expect(page.locator('#shift-warnings')).toBeVisible();
    await expect(page.locator('#shift-warnings li').first()).toContainText(
      '必要2人',
    );
  });

  test('十分な人数なら警告なしと表示される', async ({ page }) => {
    await expect(page.locator('#shift-no-warnings')).toBeVisible();
    await expect(page.locator('#shift-warnings')).toHaveCount(0);
  });

  test('土日祝休みで土日の列が休みになる', async ({ page }) => {
    // 10/3(土)は休みの日: 全員の担当なし
    await expect(page.locator('#shift-daily li').nth(2)).toContainText('休み');
    await page.locator('#shift-closed').uncheck();
    await expect(page.locator('#shift-daily li').nth(2)).not.toContainText(
      '休み',
    );
  });

  test('メンバーが空ならエラー、不正な希望休は一覧に出る', async ({ page }) => {
    await page.locator('#shift-offs').fill('山田: 1\n田中: 99');
    await expect(page.locator('#shift-issues li')).toHaveCount(2);
    await page.locator('#shift-members').fill('');
    await expect(page.locator('#shift-error')).toContainText('1人以上');
    await expect(page.locator('#shift-table')).toHaveCount(0);
  });

  test('CSVをコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.locator('#shift-copy-button').click();
    await expect(page.locator('#shift-status')).toHaveText('コピーしました');
    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text.split('\n')).toHaveLength(6);
    expect(text.split('\n')[0]).toContain('1(木)');
  });

  test('375px幅ではシフト表だけが枠内で横スクロールし、名前列は残る', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    const wrap = page.locator('#shift-table-wrap');
    const scrolls = await wrap.evaluate(
      (el) => el.scrollWidth > el.clientWidth,
    );
    expect(scrolls).toBe(true);
    const pageOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(pageOverflow).toBe(false);

    await wrap.evaluate((el) => {
      el.scrollLeft = el.scrollWidth;
    });
    const wrapBox = (await wrap.boundingBox())!;
    // 名前列（行見出しの th）は sticky のため、右端までスクロールしても枠の左端に残る
    const nameBox = (await page
      .locator('#shift-table tbody tr')
      .first()
      .locator('th')
      .first()
      .boundingBox())!;
    expect(Math.abs(nameBox.x - wrapBox.x)).toBeLessThan(2);
  });

  test('印刷時はシフト表だけが残る', async ({ page }) => {
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('h1')).toBeHidden();
    await expect(page.locator('[data-faq]')).toBeHidden();
    await expect(page.locator('#shift-members')).toBeHidden();
    await expect(page.locator('#shift-table')).toBeVisible();
  });

  test('英語版でも表が作られる', async ({ page }) => {
    await page.goto('/en/tools/shift-schedule-maker/');
    await page.locator('#shift-year').fill('2026');
    await page.locator('#shift-month').selectOption('10');
    await expect(page.locator('#shift-table tbody tr')).toHaveCount(5);
    await expect(page.locator('#shift-output h2')).toHaveText(
      'Shift schedule, October 2026',
    );
  });
});
