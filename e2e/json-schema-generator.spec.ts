import { test, expect } from './helpers/test';

test.describe('JSON Schema生成', () => {
  test('サンプルからスキーマが生成され、オプションで切り替わる', async ({
    page,
  }) => {
    await page.goto('/tools/json-schema-generator/');
    await expect(page.locator('main h1')).toHaveText('JSON Schema生成');

    const output = page.locator('#jsg-output');
    await expect(output).toHaveValue(/draft\/2020-12\/schema/);
    await expect(output).toHaveValue(/"format": "email"/);
    await expect(output).toHaveValue(/"type": "integer"/);
    await expect(output).not.toHaveValue(/additionalProperties/);

    await page.locator('#jsg-draft').selectOption('07');
    await expect(output).toHaveValue(/draft-07\/schema#/);
    await page.locator('#jsg-no-additional').check();
    await expect(output).toHaveValue(/"additionalProperties": false/);
    await page.locator('#jsg-formats').uncheck();
    await expect(output).not.toHaveValue(/"format"/);
    await page.locator('#jsg-title').fill('User');
    await expect(output).toHaveValue(/"title": "User"/);
  });

  test('不正なJSONはエラーになり、空にすると消える', async ({ page }) => {
    await page.goto('/tools/json-schema-generator/');
    const input = page.locator('#jsg-input');
    await input.fill('{a:1}');
    await expect(page.locator('#jsg-error')).toBeVisible();
    await expect(page.locator('#jsg-output')).toHaveValue('');
    await input.fill('');
    await expect(page.locator('#jsg-error')).toBeHidden();
  });

  test('ダウンロードできる', async ({ page }) => {
    await page.goto('/tools/json-schema-generator/');
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#jsg-download-button').click(),
    ]);
    expect(download.suggestedFilename()).toBe('schema.json');
  });

  test('複数の format（date、date-time、email、uri、uuid）を検出する', async ({
    page,
  }) => {
    await page.goto('/tools/json-schema-generator/');
    const data = JSON.stringify({
      birthday: '2024-01-15',
      createdAt: '2024-01-15T14:30:00Z',
      email: 'test@example.com',
      website: 'https://example.com/page',
      id: '550e8400-e29b-41d4-a716-446655440000',
    });
    await page.locator('#jsg-input').fill(data);

    const output = page.locator('#jsg-output');
    await expect(output).toHaveValue(/"birthday"[\s\S]*?"format": "date"/);
    await expect(output).toHaveValue(
      /"createdAt"[\s\S]*?"format": "date-time"/,
    );
    await expect(output).toHaveValue(/"email"[\s\S]*?"format": "email"/);
    await expect(output).toHaveValue(/"website"[\s\S]*?"format": "uri"/);
    await expect(output).toHaveValue(/"id"[\s\S]*?"format": "uuid"/);
  });

  test('ルートがプリミティブ値でもスキーマが生成される', async ({ page }) => {
    await page.goto('/tools/json-schema-generator/');
    const output = page.locator('#jsg-output');

    // 文字列をルートに
    await page.locator('#jsg-input').fill('"hello world"');
    await expect(output).toHaveValue(/"type": "string"/);
    await expect(output).toHaveValue(/"\$schema"/);

    // 数値をルートに
    await page.locator('#jsg-input').fill('42');
    await expect(output).toHaveValue(/"type": "integer"/);

    // 真偽値をルートに
    await page.locator('#jsg-input').fill('true');
    await expect(output).toHaveValue(/"type": "boolean"/);

    // null をルートに
    await page.locator('#jsg-input').fill('null');
    await expect(output).toHaveValue(/"type": "null"/);
  });

  test('配列内のオブジェクトの必須フィールドを推論する', async ({ page }) => {
    await page.goto('/tools/json-schema-generator/');
    const data = JSON.stringify([
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob' }, // email がない
    ]);
    await page.locator('#jsg-input').fill(data);

    const output = page.locator('#jsg-output');
    // items の required には id と name のみ（email は欠けている）
    await expect(output).toHaveValue(/"required"[\s\S]*?"id"[\s\S]*?"name"/);
    await expect(output).not.toHaveValue(/"required"[\s\S]*?"email"/);
  });

  test('required チェックを OFF にすると required が消える', async ({
    page,
  }) => {
    await page.goto('/tools/json-schema-generator/');
    const data = JSON.stringify({ a: 1, b: 2 });
    await page.locator('#jsg-input').fill(data);

    const output = page.locator('#jsg-output');
    // デフォルトは required がある
    await expect(output).toHaveValue(/"required"/);

    // required チェックを OFF にする
    await page.locator('#jsg-required').uncheck();
    await expect(output).not.toHaveValue(/"required"/);

    // 再度 ON にする
    await page.locator('#jsg-required').check();
    await expect(output).toHaveValue(/"required"/);
  });

  test('title が空の場合は title フィールドが出力されない', async ({
    page,
  }) => {
    await page.goto('/tools/json-schema-generator/');
    const data = JSON.stringify({ x: 1 });
    await page.locator('#jsg-input').fill(data);

    const output = page.locator('#jsg-output');
    // title 入力が空のままなら title フィールドなし
    await expect(output).not.toHaveValue(/"title":/);

    // title を入力
    await page.locator('#jsg-title').fill('Test');
    await expect(output).toHaveValue(/"title": "Test"/);

    // title をクリア
    await page.locator('#jsg-title').clear();
    await expect(output).not.toHaveValue(/"title":/);
  });

  test('スキーマをコピーするとクリップボードに入る', async ({ page }) => {
    await page.goto('/tools/json-schema-generator/');
    await page.locator('#jsg-input').fill('{"x":1}');

    // コピーボタンをクリック
    await page.locator('#jsg-copy-button').click();

    // ステータス表示でコピー成功を確認
    await expect(page.locator('#jsg-status')).toContainText('コピー');
  });

  test('nested オブジェクト・配列が混在する複雑な構造に対応する', async ({
    page,
  }) => {
    await page.goto('/tools/json-schema-generator/');
    const data = JSON.stringify({
      users: [
        {
          name: 'Alice',
          tags: ['admin', 'user'],
          metadata: { active: true, score: 95 },
        },
        {
          name: 'Bob',
          tags: ['user'],
          metadata: { active: true, score: 87 },
        },
      ],
    });
    await page.locator('#jsg-input').fill(data);

    const output = page.locator('#jsg-output');
    // type がobject（ルート）
    await expect(output).toHaveValue(/"type": "object"/);
    // users が配列
    await expect(output).toHaveValue(/"users"[\s\S]*?"type": "array"/);
    // items がobject
    await expect(output).toHaveValue(/"items"[\s\S]*?"type": "object"/);
    // tags が配列
    await expect(output).toHaveValue(/"tags"[\s\S]*?"type": "array"/);
    // metadata が object
    await expect(output).toHaveValue(/"metadata"[\s\S]*?"type": "object"/);
    // プリミティブも含まれる
    await expect(output).toHaveValue(/"name"[\s\S]*?"type": "string"/);
    await expect(output).toHaveValue(/"score"[\s\S]*?"type": "integer"/);
    await expect(output).toHaveValue(/"active"[\s\S]*?"type": "boolean"/);
  });
});

test.describe('JSON Schema Generator (en)', () => {
  test('displays and generates', async ({ page }) => {
    await page.goto('/en/tools/json-schema-generator/');
    await expect(page.locator('main h1')).toHaveText('JSON Schema Generator');
    await expect(page.locator('#jsg-output')).toHaveValue(/"\$schema"/);
  });
});
