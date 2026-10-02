import { test, expect } from './helpers/test';

test.describe('CSV/JSON変換ツール（日本語版）', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/tools/csv-json-converter/');
    await expect(page.locator('main h1')).toHaveText('CSV⇔JSON変換ツール');
  });

  test('CSVをJSONに変換できる', async ({ page }) => {
    await page.goto('/tools/csv-json-converter/');

    // 初期状態はCSVからJSONモード
    await expect(
      page.locator('#csv-json-converter-mode [data-mode="csvToJson"]'),
    ).toHaveAttribute('aria-pressed', 'true');

    const csv = 'name,age,city\nAlice,30,Tokyo\nBob,25,Osaka\nCharlie,35,Kyoto';
    const input = page.locator('#csv-json-converter-input');
    await input.fill(csv);

    const output = page.locator('#csv-json-converter-output');
    // JSONが出力されることを確認
    const outputText = await output.inputValue();
    expect(outputText).toContain('"name"');
    expect(outputText).toContain('"Alice"');
    expect(outputText).toContain('"age"');
    expect(outputText).toContain('30');

    // エラーが表示されていないことを確認
    await expect(page.locator('#csv-json-converter-error')).toBeHidden();
  });

  test('JSONをCSVに変換できる', async ({ page }) => {
    await page.goto('/tools/csv-json-converter/');

    // JSONからCSVモードに切り替え
    await page
      .locator('#csv-json-converter-mode [data-mode="jsonToCsv"]')
      .click();

    const json = '[{"name":"Alice","age":30},{"name":"Bob","age":25}]';
    const input = page.locator('#csv-json-converter-input');
    await input.fill(json);

    const output = page.locator('#csv-json-converter-output');
    const outputText = await output.inputValue();
    // CSVのヘッダーと最初の行が含まれることを確認
    expect(outputText).toContain('name');
    expect(outputText).toContain('age');
    expect(outputText).toContain('Alice');
    expect(outputText).toContain('30');

    await expect(page.locator('#csv-json-converter-error')).toBeHidden();
  });

  test('不正なJSONをJSONからCSVで入力するとエラーが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/csv-json-converter/');

    await page
      .locator('#csv-json-converter-mode [data-mode="jsonToCsv"]')
      .click();
    const input = page.locator('#csv-json-converter-input');
    await input.fill('not valid json');

    const errorEl = page.locator('#csv-json-converter-error');
    await expect(errorEl).toBeVisible();
    const errorText = await errorEl.textContent();
    expect(errorText).toBeTruthy();
  });

  test('空入力で結果も空になる', async ({ page }) => {
    await page.goto('/tools/csv-json-converter/');

    const input = page.locator('#csv-json-converter-input');
    const output = page.locator('#csv-json-converter-output');

    await input.fill('name,age\nAlice,30');
    // 出力が生成される
    let outputText = await output.inputValue();
    expect(outputText.length).toBeGreaterThan(0);

    // 入力をクリア
    await input.fill('');
    // 出力も空になる
    outputText = await output.inputValue();
    expect(outputText).toBe('');
    await expect(page.locator('#csv-json-converter-error')).toBeHidden();
  });

  test('デリミタを変更できる', async ({ page }) => {
    await page.goto('/tools/csv-json-converter/');

    // デリミタをタブに変更
    await page.locator('#csv-json-converter-delimiter').selectOption('tab');

    const input = page.locator('#csv-json-converter-input');
    const output = page.locator('#csv-json-converter-output');

    // タブで区切られたデータ
    await input.fill('name\tage\tcity\nAlice\t30\tTokyo\nBob\t25\tOsaka');

    const outputText = await output.inputValue();
    expect(outputText).toContain('"name"');
    expect(outputText).toContain('"Alice"');
  });
});

test.describe('CSV to JSON Converter (English)', () => {
  test('英語版が正しく表示される', async ({ page }) => {
    await page.goto('/en/tools/csv-json-converter/');
    await expect(page.locator('main h1')).toHaveText('CSV ⇔ JSON Converter');
  });

  test('英語版でCSVをJSONに変換できる', async ({ page }) => {
    await page.goto('/en/tools/csv-json-converter/');

    const csv = 'name,age\nAlice,30\nBob,25';
    await page.locator('#csv-json-converter-input').fill(csv);

    const output = page.locator('#csv-json-converter-output');
    const outputText = await output.inputValue();
    expect(outputText).toContain('"name"');
    expect(outputText).toContain('"Alice"');
  });
});
