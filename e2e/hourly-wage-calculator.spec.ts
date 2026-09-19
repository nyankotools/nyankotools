import { test, expect } from '@playwright/test';

test.describe('時給・日給・月給換算＆残業代計算機（日本語版）', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/tools/hourly-wage-calculator/');
    await expect(page.locator('main h1')).toHaveText(
      '時給・日給・月給換算＆残業代計算機',
    );
  });

  test('初期表示時点で時給1200円・8時間・20日を基準に自動計算される', async ({
    page,
  }) => {
    await page.goto('/tools/hourly-wage-calculator/');

    await expect(page.locator('#wage-calc-result-hourly')).toHaveText(
      '￥1,200',
    );
    await expect(page.locator('#wage-calc-result-daily')).toHaveText('￥9,600');
    await expect(page.locator('#wage-calc-result-monthly')).toHaveText(
      '￥192,000',
    );
    await expect(page.locator('#wage-calc-result-annual')).toHaveText(
      '￥2,304,000',
    );

    // 基礎時給には自動的に時給の計算結果が入力される
    await expect(page.locator('#wage-calc-base-hourly')).toHaveValue('1200');
  });

  test('給与換算の金額を変更すると、未編集の基礎時給も追従して再計算される', async ({
    page,
  }) => {
    await page.goto('/tools/hourly-wage-calculator/');

    await expect(page.locator('#wage-calc-base-hourly')).toHaveValue('1200');

    // 基礎時給欄を一度も手動編集していない状態で金額を変更すると、
    // 自動入力された値も新しい時給に追従して更新されるべき
    await page.locator('#wage-calc-amount').fill('1500');

    await expect(page.locator('#wage-calc-result-hourly')).toHaveText(
      '￥1,500',
    );
    await expect(page.locator('#wage-calc-base-hourly')).toHaveValue('1500');
  });

  test('日給を基準に時給・月給・年収へ換算できる', async ({ page }) => {
    await page.goto('/tools/hourly-wage-calculator/');

    await page.getByRole('radio', { name: '日給' }).check();
    await page.locator('#wage-calc-amount').fill('9600');

    await expect(page.locator('#wage-calc-result-hourly')).toHaveText(
      '￥1,200',
    );
    await expect(page.locator('#wage-calc-result-monthly')).toHaveText(
      '￥192,000',
    );
    await expect(page.locator('#wage-calc-result-annual')).toHaveText(
      '￥2,304,000',
    );
  });

  test('月給を基準に時給・日給・年収へ換算できる', async ({ page }) => {
    await page.goto('/tools/hourly-wage-calculator/');

    await page.getByRole('radio', { name: '月給' }).check();
    await page.locator('#wage-calc-amount').fill('192000');

    await expect(page.locator('#wage-calc-result-hourly')).toHaveText(
      '￥1,200',
    );
    await expect(page.locator('#wage-calc-result-daily')).toHaveText('￥9,600');
    await expect(page.locator('#wage-calc-result-annual')).toHaveText(
      '￥2,304,000',
    );
  });

  test('年収を基準に時給・日給・月給へ換算できる', async ({ page }) => {
    await page.goto('/tools/hourly-wage-calculator/');

    await page.getByRole('radio', { name: '年収' }).check();
    await page.locator('#wage-calc-amount').fill('2304000');

    await expect(page.locator('#wage-calc-result-hourly')).toHaveText(
      '￥1,200',
    );
    await expect(page.locator('#wage-calc-result-daily')).toHaveText('￥9,600');
    await expect(page.locator('#wage-calc-result-monthly')).toHaveText(
      '￥192,000',
    );
  });

  test('1日の労働時間が0だとエラーメッセージが表示され、結果は非表示になる', async ({
    page,
  }) => {
    await page.goto('/tools/hourly-wage-calculator/');

    await page.locator('#wage-calc-hours-per-day').fill('0');

    await expect(page.locator('#wage-calc-conversion-error')).toHaveText(
      '計算できませんでした（金額・労働時間・労働日数はすべて0より大きい値を入力してください）',
    );
    await expect(page.locator('#wage-calc-conversion-results')).toBeHidden();
  });

  test('金額が0だとエラーメッセージが表示される', async ({ page }) => {
    await page.goto('/tools/hourly-wage-calculator/');

    await page.locator('#wage-calc-amount').fill('0');

    await expect(page.locator('#wage-calc-conversion-error')).toHaveText(
      '計算できませんでした（金額・労働時間・労働日数はすべて0より大きい値を入力してください）',
    );
    await expect(page.locator('#wage-calc-conversion-results')).toBeHidden();
  });

  test('金額を空にすると結果もエラーも表示されない', async ({ page }) => {
    await page.goto('/tools/hourly-wage-calculator/');

    await page.locator('#wage-calc-amount').fill('');

    await expect(page.locator('#wage-calc-conversion-error')).toHaveText('');
    await expect(page.locator('#wage-calc-conversion-results')).toBeHidden();
  });

  test('割増賃金シミュレーターで区分ごとの割増賃金と合計が計算される', async ({
    page,
  }) => {
    await page.goto('/tools/hourly-wage-calculator/');

    // 初期表示時点で基礎時給には1200円が自動入力されている
    await expect(page.locator('#wage-calc-base-hourly')).toHaveValue('1200');

    const rows = page.locator('#wage-calc-overtime-rows tr');

    await rows
      .nth(0)
      .getByLabel('時間外労働（月60時間以内）の労働時間')
      .fill('10');
    await rows.nth(3).getByLabel('深夜労働（22時〜5時）の労働時間').fill('5');

    await expect(rows.nth(0).locator('[data-role="premium"]')).toHaveText(
      '￥3,000',
    );
    await expect(rows.nth(3).locator('[data-role="premium"]')).toHaveText(
      '￥1,500',
    );
    await expect(page.locator('#wage-calc-total-premium')).toHaveText(
      '￥4,500',
    );
    await expect(page.locator('#wage-calc-total-pay')).toHaveText('￥22,500');
  });

  test('割増率を編集すると割増賃金の再計算に反映される', async ({ page }) => {
    await page.goto('/tools/hourly-wage-calculator/');

    const rows = page.locator('#wage-calc-overtime-rows tr');
    await rows
      .nth(1)
      .getByLabel('時間外労働（月60時間超過分）の労働時間')
      .fill('10');
    await rows
      .nth(1)
      .getByLabel('時間外労働（月60時間超過分）の割増率')
      .fill('50');

    // 1200円 × 10時間 × 50% = 6000円
    await expect(rows.nth(1).locator('[data-role="premium"]')).toHaveText(
      '￥6,000',
    );
  });

  test('基礎時給を手動で編集すると割増賃金の計算に反映される', async ({
    page,
  }) => {
    await page.goto('/tools/hourly-wage-calculator/');

    await page.locator('#wage-calc-base-hourly').fill('2000');

    const rows = page.locator('#wage-calc-overtime-rows tr');
    await rows.nth(2).getByLabel('法定休日労働の労働時間').fill('8');

    // 2000円 × 8時間 × 35% = 5600円
    await expect(rows.nth(2).locator('[data-role="premium"]')).toHaveText(
      '￥5,600',
    );
  });

  test('基礎時給を手動で編集した後は、給与換算を変更しても上書きされない', async ({
    page,
  }) => {
    await page.goto('/tools/hourly-wage-calculator/');

    await page.locator('#wage-calc-base-hourly').fill('2000');
    await page.locator('#wage-calc-amount').fill('1500');

    await expect(page.locator('#wage-calc-result-hourly')).toHaveText(
      '￥1,500',
    );
    // 手動編集した基礎時給は給与換算側の変更で上書きされない
    await expect(page.locator('#wage-calc-base-hourly')).toHaveValue('2000');
  });

  test('基礎時給が0だとエラーメッセージが表示され、結果は非表示になる', async ({
    page,
  }) => {
    await page.goto('/tools/hourly-wage-calculator/');

    await page.locator('#wage-calc-base-hourly').fill('0');

    await expect(page.locator('#wage-calc-overtime-error')).toHaveText(
      '計算できませんでした（基礎時給は0より大きく、労働時間・割増率は0以上の値を入力してください）',
    );
    await expect(page.locator('#wage-calc-overtime-results')).toBeHidden();
  });
});

test.describe('Hourly Wage Converter & Overtime Pay Calculator (English)', () => {
  test('英語版が正しく表示され、換算・割増賃金計算ができる', async ({
    page,
  }) => {
    await page.goto('/en/tools/hourly-wage-calculator/');
    await expect(page.locator('main h1')).toHaveText(
      'Hourly Wage Converter & Overtime Pay Calculator',
    );

    await expect(page.locator('#wage-calc-result-hourly')).toHaveText('¥1,200');
    await expect(page.locator('#wage-calc-result-annual')).toHaveText(
      '¥2,304,000',
    );

    const rows = page.locator('#wage-calc-overtime-rows tr');
    await rows
      .nth(0)
      .getByLabel('Overtime (up to 60 hrs/month) hours')
      .fill('10');

    // ¥1,200 × 10 hrs × 25% = ¥3,000
    await expect(rows.nth(0).locator('[data-role="premium"]')).toHaveText(
      '¥3,000',
    );
    await expect(page.locator('#wage-calc-total-premium')).toHaveText('¥3,000');
  });

  test('金額が0だとエラーメッセージが表示される', async ({ page }) => {
    await page.goto('/en/tools/hourly-wage-calculator/');

    await page.locator('#wage-calc-amount').fill('0');

    await expect(page.locator('#wage-calc-conversion-error')).toHaveText(
      'Could not calculate (amount, hours per day, and days per month must all be greater than 0)',
    );
  });
});
