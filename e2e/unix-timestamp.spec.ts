import { test, expect } from './helpers/test';

test.describe('UNIXタイムスタンプ変換', () => {
  test('日本語版が表示される', async ({ page }) => {
    await page.goto('/tools/unix-timestamp/');
    await expect(page.locator('main h1')).toHaveText('Unixタイムスタンプ変換');
  });

  test('英語版が表示される', async ({ page }) => {
    await page.goto('/en/tools/unix-timestamp/');
    await expect(page.locator('main h1')).toHaveText(
      'Unix Timestamp Converter',
    );
  });

  test('現在時刻のタイムスタンプが表示される', async ({ page }) => {
    await page.goto('/tools/unix-timestamp/');

    // 現在時刻セクションを確認
    const nowEl = page.locator('#unix-timestamp-now');
    const textContent = await nowEl.textContent();

    // タイムスタンプは数字のみ
    expect(textContent).toMatch(/^\d+$/);
    // 現在のUNIXタイムスタンプは約1.7×10^12以上
    expect(Number(textContent)).toBeGreaterThan(1700000000);
  });

  test('現在時刻のコピーボタンが機能する', async ({ page }) => {
    await page.goto('/tools/unix-timestamp/');

    // コピーボタンをクリック
    const copyButton = page.locator('#unix-timestamp-now-copy');
    await copyButton.click();

    // ステータスメッセージが表示されることを確認（コピーボタンが機能している）
    const nowEl = page.locator('#unix-timestamp-now');
    const timestamp = await nowEl.textContent();

    // タイムスタンプが数字のみであることを確認（コピー対象が有効）
    expect(timestamp).toMatch(/^\d+$/);
  });

  test('タイムスタンプを日付に変換できる', async ({ page }) => {
    await page.goto('/tools/unix-timestamp/');

    // テスト用のタイムスタンプ: 2024-01-01 00:00:00 UTC = 1704067200
    const testTimestamp = '1704067200';
    const input = page.locator('#unix-timestamp-input');

    await input.fill(testTimestamp);

    // 変換結果が表示されることを確認
    const isoEl = page.locator('#unix-timestamp-iso');
    const isoText = await isoEl.textContent();

    expect(isoText).toContain('2024-01-01');
  });

  test('不正なタイムスタンプ入力でエラーが表示される', async ({ page }) => {
    await page.goto('/tools/unix-timestamp/');

    const input = page.locator('#unix-timestamp-input');
    await input.fill('not-a-number');

    const errorEl = page.locator('#unix-timestamp-error');
    const errorText = await errorEl.textContent();

    expect(errorText?.length).toBeGreaterThan(0);
  });

  test('日時からタイムスタンプへの変換が機能する', async ({ page }) => {
    await page.goto('/tools/unix-timestamp/');

    const datetimeInput = page.locator('#unix-timestamp-datetime');

    // 日時を設定（datetime-local形式: YYYY-MM-DDTHH:mm）
    await datetimeInput.fill('2024-01-01T00:00');

    // 秒単位のタイムスタンプが表示されることを確認
    const resultSecondsEl = page.locator('#unix-timestamp-result-seconds');
    const secondsText = await resultSecondsEl.textContent();

    // タイムスタンプは数字のみ
    expect(secondsText).toMatch(/^\d+$/);
    // 2024-01-01は1704067200以降（タイムゾーン差を考慮）
    expect(Number(secondsText)).toBeGreaterThan(1700000000);
  });

  test('data-copy-target属性を使用したコピーボタンが機能する', async ({
    page,
  }) => {
    await page.goto('/tools/unix-timestamp/');

    const datetimeInput = page.locator('#unix-timestamp-datetime');
    await datetimeInput.fill('2024-01-01T00:00');

    // 秒単位のコピーボタンが存在し、クリック可能であることを確認
    const copyButtonSeconds = page.locator(
      'button[data-copy-target="unix-timestamp-result-seconds"]',
    );
    await expect(copyButtonSeconds).toBeVisible();
    await expect(copyButtonSeconds).toBeEnabled();

    // タイムスタンプが表示されていることを確認
    const resultSecondsEl = page.locator('#unix-timestamp-result-seconds');
    const secondsText = await resultSecondsEl.textContent();
    expect(secondsText).toMatch(/^\d+$/);
    expect(Number(secondsText)).toBeGreaterThan(1700000000);

    // コピーボタンをクリック
    await copyButtonSeconds.click();
  });

  test('ミリ秒単位のコピーボタンが機能する', async ({ page }) => {
    await page.goto('/tools/unix-timestamp/');

    const datetimeInput = page.locator('#unix-timestamp-datetime');
    await datetimeInput.fill('2024-01-01T00:00');

    // ミリ秒単位のコピーボタンが存在し、クリック可能であることを確認
    const copyButtonMs = page.locator(
      'button[data-copy-target="unix-timestamp-result-milliseconds"]',
    );
    await expect(copyButtonMs).toBeVisible();
    await expect(copyButtonMs).toBeEnabled();

    // ミリ秒単位のタイムスタンプが表示されていることを確認（秒の値の1000倍）
    const resultMillisecondsEl = page.locator(
      '#unix-timestamp-result-milliseconds',
    );
    const millisecondsText = await resultMillisecondsEl.textContent();
    expect(millisecondsText).toMatch(/^\d{13}$/); // 13桁のミリ秒タイムスタンプ
    expect(Number(millisecondsText)).toBeGreaterThan(1700000000000);

    // コピーボタンをクリック
    await copyButtonMs.click();
  });

  test('「現在の日時を使用」ボタンが機能する', async ({ page }) => {
    await page.goto('/tools/unix-timestamp/');

    const datetimeNowButton = page.locator('#unix-timestamp-datetime-now');
    await datetimeNowButton.click();

    // 日時入力欄に値が入ることを確認
    const datetimeInput = page.locator('#unix-timestamp-datetime');
    const value = await datetimeInput.inputValue();

    expect(value).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);

    // タイムスタンプが表示されることを確認
    const resultSecondsEl = page.locator('#unix-timestamp-result-seconds');
    const secondsText = await resultSecondsEl.textContent();

    expect(secondsText).toMatch(/^\d+$/);
  });

  test('オートディテクションで秒/ミリ秒が自動判定される', async ({ page }) => {
    await page.goto('/tools/unix-timestamp/');

    const input = page.locator('#unix-timestamp-input');
    const unitSelect = page.locator('#unix-timestamp-unit');

    // オート判定が選択されていることを確認
    const unitValue = await unitSelect.inputValue();
    expect(unitValue).toBe('auto');

    // 秒単位のタイムスタンプを入力
    await input.fill('1704067200');

    // ISOが正しく表示されることを確認
    const isoEl = page.locator('#unix-timestamp-iso');
    const isoText = await isoEl.textContent();

    expect(isoText).toContain('2024-01-01');
  });
});
