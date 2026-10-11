import { test, expect } from './helpers/test';

const modeSelect = '#jsonl-converter-mode';
const delimiterGroup = '#jsonl-converter-delimiter-group';
const delimiterSelect = '#jsonl-converter-delimiter';
const input = '#jsonl-converter-input';
const output = '#jsonl-converter-output';
const errorEl = '#jsonl-converter-error';

test.describe('JSONL⇔JSON/CSV変換ツール（日本語版）', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/tools/jsonl-converter/');
    await expect(page.locator('main h1')).toHaveText(
      'JSONL（NDJSON）⇔JSON/CSV変換ツール',
    );
  });

  test('JSONL → JSON配列に変換できる（既定のモード）', async ({ page }) => {
    await page.goto('/tools/jsonl-converter/');
    await expect(page.locator(modeSelect)).toHaveValue('jsonlToJson');

    await page
      .locator(input)
      .fill('{"name":"Taro","age":30}\n\n{"name":"Hanako","age":25}\n');

    const expected = JSON.stringify(
      [
        { name: 'Taro', age: 30 },
        { name: 'Hanako', age: 25 },
      ],
      null,
      2,
    );
    await expect(page.locator(output)).toHaveValue(expected);
    await expect(page.locator(errorEl)).toBeHidden();
  });

  test('JSON配列 → JSONLに変換できる', async ({ page }) => {
    await page.goto('/tools/jsonl-converter/');

    await page.locator(modeSelect).selectOption('jsonToJsonl');
    await page.locator(input).fill('[{"a":1},{"b":"あ😀"}]');

    await expect(page.locator(output)).toHaveValue('{"a":1}\n{"b":"あ😀"}\n');
    await expect(page.locator(errorEl)).toBeHidden();
  });

  test('JSONL → CSVに変換できる（カンマ区切り）', async ({ page }) => {
    await page.goto('/tools/jsonl-converter/');

    await page.locator(modeSelect).selectOption('jsonlToCsv');
    await page
      .locator(input)
      .fill('{"name":"Taro","age":30}\n{"name":"Hanako","city":"Osaka"}');

    await expect(page.locator(output)).toHaveValue(
      'name,age,city\nTaro,30,\nHanako,,Osaka\n',
    );
  });

  test('CSV → JSONLに変換できる（値は文字列になる）', async ({ page }) => {
    await page.goto('/tools/jsonl-converter/');

    await page.locator(modeSelect).selectOption('csvToJsonl');
    await page.locator(input).fill('name,age\nTaro,30\nHanako,25');

    await expect(page.locator(output)).toHaveValue(
      '{"name":"Taro","age":"30"}\n{"name":"Hanako","age":"25"}\n',
    );
  });

  test('区切り文字は CSV系モードのときだけ表示され、タブ区切りに切り替えられる', async ({
    page,
  }) => {
    await page.goto('/tools/jsonl-converter/');

    // 既定の JSONL → JSON では区切り文字を出さない
    await expect(page.locator(delimiterGroup)).toBeHidden();

    await page.locator(modeSelect).selectOption('jsonlToCsv');
    await expect(page.locator(delimiterGroup)).toBeVisible();
    await expect(page.locator(delimiterSelect)).toHaveValue(',');

    await page.locator(delimiterSelect).selectOption('tab');
    await page.locator(input).fill('{"a":1,"b":"x,y"}');
    await expect(page.locator(output)).toHaveValue('a\tb\n1\tx,y\n');

    // 区切り文字はそのままCSV → JSONL にも効く
    await page.locator(modeSelect).selectOption('csvToJsonl');
    await expect(page.locator(delimiterGroup)).toBeVisible();
    await page.locator(input).fill('name\tage\nTaro\t30');
    await expect(page.locator(output)).toHaveValue(
      '{"name":"Taro","age":"30"}\n',
    );

    // JSON配列 → JSONL に戻すと再び隠れる
    await page.locator(modeSelect).selectOption('jsonToJsonl');
    await expect(page.locator(delimiterGroup)).toBeHidden();
  });

  test('不正な行はエラーとして元の行番号を表示し、結果は空になる', async ({
    page,
  }) => {
    await page.goto('/tools/jsonl-converter/');

    await page.locator(input).fill('{"a":1}\n\n{oops}\n{"a":2}');

    const error = page.locator(errorEl);
    await expect(error).toBeVisible();
    await expect(error).toContainText('エラー:');
    await expect(error).toContainText('3行目');
    await expect(page.locator(output)).toHaveValue('');
  });

  test('CSVの列数不一致は行番号つきで表示される', async ({ page }) => {
    await page.goto('/tools/jsonl-converter/');

    await page.locator(modeSelect).selectOption('csvToJsonl');
    await page.locator(input).fill('name,age\nTaro,30\nHanako');

    const error = page.locator(errorEl);
    await expect(error).toBeVisible();
    await expect(error).toContainText('3行目');
    await expect(error).toContainText('ヘッダー: 2列');
    await expect(error).toContainText('データ: 1列');
  });

  test('JSON配列以外をJSONL変換するとエラーになり、修正すると結果に戻る', async ({
    page,
  }) => {
    await page.goto('/tools/jsonl-converter/');

    await page.locator(modeSelect).selectOption('jsonToJsonl');
    await page.locator(input).fill('{"a":1}');
    await expect(page.locator(errorEl)).toContainText('配列');
    await expect(page.locator(output)).toHaveValue('');

    await page.locator(input).fill('[{"a":1}]');
    await expect(page.locator(errorEl)).toBeHidden();
    await expect(page.locator(output)).toHaveValue('{"a":1}\n');
  });

  test('モードを変えると入力例（プレースホルダー）が切り替わる', async ({
    page,
  }) => {
    await page.goto('/tools/jsonl-converter/');

    await page.locator(modeSelect).selectOption('csvToJsonl');
    await expect(page.locator(input)).toHaveAttribute(
      'placeholder',
      'name,age\nTaro,30\nHanako,25',
    );
  });

  test('コピーボタンで結果がクリップボードに入る', async ({
    page,
    context,
    browserName,
  }) => {
    test.skip(
      browserName !== 'chromium',
      'クリップボードの権限付与はChromiumのみ検証する',
    );
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/jsonl-converter/');

    await page.locator(input).fill('{"a":1}\n{"a":2}');
    await page.locator('#jsonl-converter-copy-button').click();

    await expect(page.locator('#jsonl-converter-status')).toHaveText(
      'コピーしました',
    );
    // Windows のクリップボードは改行を CRLF に変換するため正規化して比較する
    const clip = await page.evaluate(() => navigator.clipboard.readText());
    expect(clip.replace(/\r\n/g, '\n')).toBe(
      '[\n  {\n    "a": 1\n  },\n  {\n    "a": 2\n  }\n]',
    );
  });
});

test.describe('JSONL⇔JSON/CSV変換ツール（英語版）', () => {
  test('直接アクセスして英語のh1が表示される', async ({ page }) => {
    await page.goto('/en/tools/jsonl-converter/');
    await expect(page.locator('main h1')).toHaveText(
      'JSONL (NDJSON) ⇔ JSON / CSV Converter',
    );
  });

  test('英語版でもJSONL → JSON配列の変換とエラー表示が動く', async ({
    page,
  }) => {
    await page.goto('/en/tools/jsonl-converter/');

    await page.locator(input).fill('{"a":1}\n{oops}');
    await expect(page.locator(errorEl)).toContainText('Line 2: not valid JSON');
    await expect(page.locator(output)).toHaveValue('');

    await page.locator(input).fill('{"a":1}\n{"a":2}');
    await expect(page.locator(output)).toHaveValue(
      JSON.stringify([{ a: 1 }, { a: 2 }], null, 2),
    );
  });

  test('英語版のモード選択肢と区切り文字の表示切替が動く', async ({ page }) => {
    await page.goto('/en/tools/jsonl-converter/');

    await expect(page.locator(`${modeSelect} option`).nth(2)).toHaveText(
      'JSONL → CSV',
    );

    await page.locator(modeSelect).selectOption('jsonlToCsv');
    await expect(page.locator(delimiterGroup)).toBeVisible();
    await expect(page.locator(delimiterSelect)).toHaveValue(',');
    await expect(page.locator(`${delimiterSelect} option`).nth(1)).toHaveText(
      'Tab',
    );

    await page.locator(modeSelect).selectOption('jsonToJsonl');
    await expect(page.locator(delimiterGroup)).toBeHidden();
  });
});
