import { test, expect } from '@playwright/test';

test.describe('Cron式スケジュールシミュレーター（日本語版）', () => {
  test('直接アクセスして正しく表示され、デフォルト値で説明・次回実行一覧が表示される', async ({
    page,
  }) => {
    await page.goto('/tools/cron-parser/');

    await expect(page.locator('main h1')).toHaveText(
      'Cron式スケジュールシミュレーター',
    );

    await expect(page.locator('#cron-input')).toHaveValue('*/15 9-18 * * 1-5');
    await expect(page.locator('#cron-description')).toHaveText(
      '毎週月曜日から金曜日の9時から18時の15分ごとに実行されます',
    );
    await expect(page.locator('#cron-error')).toBeEmpty();
    await expect(page.locator('#cron-next-runs li')).toHaveCount(5);
  });

  test('プリセットボタンをクリックすると説明が切り替わる', async ({ page }) => {
    await page.goto('/tools/cron-parser/');

    await page.locator('[data-cron-preset="0 3 * * *"]').click();
    await expect(page.locator('#cron-input')).toHaveValue('0 3 * * *');
    await expect(page.locator('#cron-description')).toHaveText(
      '毎日3時0分に実行されます',
    );
  });

  test('時のフィールドがステップ指定の場合、「時ごと」ではなく「時間ごと」と表示される', async ({
    page,
  }) => {
    await page.goto('/tools/cron-parser/');

    await page.locator('#cron-input').fill('30 */2 * * *');
    await expect(page.locator('#cron-description')).toHaveText(
      '毎日2時間ごと30分に実行されます',
    );
  });

  test('月のフィールドがステップ指定の場合、「月ごと」ではなく「ヶ月ごと」と表示される', async ({
    page,
  }) => {
    await page.goto('/tools/cron-parser/');

    await page.locator('#cron-input').fill('0 0 1 */3 *');
    await expect(page.locator('#cron-description')).toHaveText(
      '毎年3ヶ月ごとの1日の0時0分に実行されます',
    );
  });

  test('不正なcron式を入力するとエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/cron-parser/');

    await page.locator('#cron-input').fill('99 * * * *');

    await expect(page.locator('#cron-error')).toHaveText(
      '分のフィールドが不正です（0〜59の範囲で指定してください）',
    );
    await expect(page.locator('#cron-description')).toBeEmpty();
    await expect(page.locator('#cron-next-runs li')).toHaveCount(0);
  });

  test('表示件数を変更すると次回実行一覧の件数が変わる', async ({ page }) => {
    await page.goto('/tools/cron-parser/');

    await page.locator('#cron-count').selectOption('10');
    await expect(page.locator('#cron-next-runs li')).toHaveCount(10);
  });

  test('一覧をコピーするとコピー完了メッセージが表示される', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/cron-parser/');

    await page.locator('#cron-copy').click();
    await expect(page.locator('#cron-status')).toHaveText('コピーしました');
  });
});

test.describe('Cron Expression Simulator (English)', () => {
  test('英語版が正しく表示され、デフォルト値で説明が破綻せずに表示される', async ({
    page,
  }) => {
    await page.goto('/en/tools/cron-parser/');

    await expect(page.locator('main h1')).toHaveText(
      'Cron Expression Simulator',
    );
    await expect(page.locator('#cron-input')).toHaveValue('*/15 9-18 * * 1-5');
    await expect(page.locator('#cron-description')).toHaveText(
      'Runs on Monday through Friday, during hours 9-18, every 15 minutes.',
    );
    await expect(page.locator('#cron-next-runs li')).toHaveCount(5);
  });

  test('ステップ指定の手入力（分がステップ、時が*）で説明が自然文になる', async ({
    page,
  }) => {
    await page.goto('/en/tools/cron-parser/');

    await page.locator('#cron-input').fill('*/15 * * * *');
    await expect(page.locator('#cron-description')).toHaveText(
      'Runs every 15 minutes.',
    );
  });

  test('制限のない式（月・日・曜日すべて*）で説明の先頭に不要なカンマが付かない', async ({
    page,
  }) => {
    await page.goto('/en/tools/cron-parser/');

    await page.locator('#cron-input').fill('0 3 * * *');
    await expect(page.locator('#cron-description')).toHaveText(
      'Runs at hour 3, minute 0.',
    );
  });

  test('不正なcron式で英語のエラーメッセージが表示される', async ({ page }) => {
    await page.goto('/en/tools/cron-parser/');

    await page.locator('#cron-input').fill('99 * * * *');

    await expect(page.locator('#cron-error')).toHaveText(
      'The minute field is invalid (must be 0-59)',
    );
  });

  test('カンマ区切りの複数値・複数曜日は最後の項目の前に"and"が入る', async ({
    page,
  }) => {
    await page.goto('/en/tools/cron-parser/');

    await page.locator('#cron-input').fill('0,15,30,45 * * * *');
    await expect(page.locator('#cron-description')).toHaveText(
      'Runs every hour at minute 0, 15, 30, and 45.',
    );

    await page.locator('#cron-input').fill('0 0 * * 1,3,5');
    await expect(page.locator('#cron-description')).toHaveText(
      'Runs on Monday, Wednesday, and Friday, at hour 0, minute 0.',
    );
  });
});
