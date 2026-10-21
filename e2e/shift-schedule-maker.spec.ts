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
    // 希望休は丸囲み（span.rounded-full）。4日目は希望休ではないので丸囲みなし
    // （自動の休みで「休」になることはあるため、テキストでは判定しない）
    await expect(
      first.locator('td').nth(0).locator('span.rounded-full'),
    ).toHaveCount(1);
    await expect(
      first.locator('td').nth(3).locator('span.rounded-full'),
    ).toHaveCount(0);
  });

  test('希望休の表をクリックすると休みが指定・解除され、入力欄とも連動する', async ({
    page,
  }) => {
    await page.locator('#shift-closed').uncheck();
    const cell = (name: string, day: number) =>
      page.locator(
        `#shift-off-grid button[data-member="${name}"][data-day="${day}"]`,
      );
    await cell('田中', 1).click();
    await cell('田中', 2).click();
    await cell('田中', 3).click();
    await expect(cell('田中', 2)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#shift-offs')).toHaveValue('田中: 1-3');
    const first = page.locator('#shift-table tbody tr').first();
    await expect(first.locator('td').nth(2)).toHaveText('休');
    await expect(
      first.locator('td').nth(3).locator('span.rounded-full'),
    ).toHaveCount(0);

    await cell('田中', 2).click();
    await expect(cell('田中', 2)).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('#shift-offs')).toHaveValue('田中: 1, 3');

    // テキスト入力を変えると表にも反映される
    await page.locator('#shift-offs').fill('佐藤: 10');
    await expect(cell('佐藤', 10)).toHaveAttribute('aria-pressed', 'true');
    await expect(cell('田中', 1)).toHaveAttribute('aria-pressed', 'false');
  });

  test('人数が足りない日は警告が表示される', async ({ page }) => {
    await page.locator('#shift-members').fill('田中');
    await page.locator('#shift-per-day').fill('2');
    await expect(page.locator('#shift-warnings')).toBeVisible();
    await expect(page.locator('#shift-warnings li').first()).toContainText(
      '必要2人',
    );
  });

  test('人数が足りないとき、解消のヒントが表示され従うと解消する', async ({
    page,
  }) => {
    await page.locator('#shift-closed').uncheck();
    await page.locator('#shift-members').fill('田中\n佐藤');
    await page.locator('#shift-per-day').fill('2');
    await page.locator('#shift-max-consecutive').fill('3');
    await expect(page.locator('#shift-warnings')).toBeVisible();
    await expect(page.locator('#shift-hints')).toContainText('連勤の上限を');
    await page.locator('#shift-max-consecutive').fill('31');
    await expect(page.locator('#shift-warnings')).toHaveCount(0);
    await expect(page.locator('#shift-hints')).toHaveCount(0);
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

  test('印刷時は週ごとの表だけが残り、月間表と日別一覧は出ない', async ({
    page,
  }) => {
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('h1')).toBeHidden();
    await expect(page.locator('[data-faq]')).toBeHidden();
    await expect(page.locator('#shift-members')).toBeHidden();
    await expect(page.locator('#shift-table')).toBeHidden();
    await expect(page.locator('#shift-daily')).toBeHidden();
    await expect(page.locator('#shift-print-weeks')).toBeVisible();
  });

  test('画面では週ごとの印刷用の表は表示されない', async ({ page }) => {
    await expect(page.locator('#shift-print-weeks')).toBeHidden();
    await expect(page.locator('#shift-table')).toBeVisible();
    await expect(page.locator('#shift-daily')).toBeVisible();
  });

  test('印刷用の表は日曜始まりで1週1つ、列は7日分＋名前＋計に揃う', async ({
    page,
  }) => {
    // 2026年10月1日は木曜。日〜土の週に分けると 1-3 / 4-10 / 11-17 / 18-24 / 25-31 の5週
    const weeks = page.locator('#shift-print-weeks .shift-print-week');
    await expect(weeks).toHaveCount(5);
    for (let i = 0; i < 5; i++) {
      const week = weeks.nth(i);
      await expect(week.locator('thead th')).toHaveCount(9);
      await expect(week.locator('tbody tr')).toHaveCount(5);
      const row = week.locator('tbody tr').first();
      await expect(row.locator('th')).toHaveCount(1);
      await expect(row.locator('td')).toHaveCount(8);
    }
    // 第1週は木曜始まりなので日〜水の3列（+名前列の次）が空欄
    const firstHead = weeks.nth(0).locator('thead th');
    await expect(firstHead.nth(0)).toHaveText('名前');
    for (let c = 1; c <= 4; c++) {
      await expect(firstHead.nth(c)).toBeEmpty();
    }
    await expect(firstHead.nth(5)).toContainText('1');
    // 第5週は土曜で終わるので末尾の空き列なし、最終日の31が土曜の列に入る
    const lastHead = weeks.nth(4).locator('thead th');
    await expect(lastHead.nth(1)).toContainText('25');
    await expect(lastHead.nth(7)).toContainText('31');
  });

  test('自動の休みにも「休」が出て、丸囲みは希望休だけに付く', async ({
    page,
  }) => {
    await page.locator('#shift-closed').uncheck();
    await page.locator('#shift-members').fill('田中\n佐藤');
    await page.locator('#shift-per-day').fill('1');
    await page.locator('#shift-offs').fill('田中: 1-3');
    const rows = page.locator('#shift-table tbody tr');
    // 佐藤は希望休なしでも1人だけ担当の日は自動の休みになり「休」と出る
    await expect(
      rows.nth(1).locator('td', { hasText: '休' }).first(),
    ).toBeVisible();
    await expect(rows.nth(1).locator('span.rounded-full')).toHaveCount(0);
    // 丸囲みは田中の希望休3日分（画面の表・印刷用の表とも）だけ
    await expect(page.locator('#shift-table span.rounded-full')).toHaveCount(3);
    await expect(
      page.locator('#shift-print-weeks span.rounded-full'),
    ).toHaveCount(3);
    await expect(
      page.locator('#shift-table span.rounded-full').first(),
    ).toHaveText('休');
  });

  test('見出しは「2026年10月 シフト表」で月が重複しない', async ({ page }) => {
    await expect(page.locator('#shift-output h2').first()).toHaveText(
      '2026年10月 シフト表',
    );
  });

  test('375pxでも希望休・自動の休みを含む表示がはみ出さない', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.locator('#shift-closed').uncheck();
    await page.locator('#shift-offs').fill('田中: 1-3');
    await expect(page.locator('#shift-table span.rounded-full')).toHaveCount(3);
    const pageOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(pageOverflow).toBe(false);
    await expect(page.locator('#shift-print-weeks')).toBeHidden();
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
