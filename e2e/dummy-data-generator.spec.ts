import { test, expect } from './helpers/test';

test('ダミーデータ: 日本語版で初期表示にJSONが生成される', async ({ page }) => {
  await page.goto('/tools/dummy-data-generator/');

  const value = await page.locator('#ddg-output').inputValue();
  const records = JSON.parse(value);
  expect(records).toHaveLength(10);
  expect(Object.keys(records[0])).toEqual([
    'name',
    'email',
    'phone',
    'address',
    'birthday',
  ]);
});

test('ダミーデータ: 同じシードなら同じデータになる', async ({ page }) => {
  await page.goto('/tools/dummy-data-generator/');

  await page.locator('#ddg-seed').fill('abc');
  await page.locator('#ddg-seed').press('Tab');
  const first = await page.locator('#ddg-output').inputValue();

  await page.locator('#ddg-generate-button').click();
  expect(await page.locator('#ddg-output').inputValue()).toBe(first);
});

test('ダミーデータ: CSV形式と件数指定が反映される', async ({ page }) => {
  await page.goto('/tools/dummy-data-generator/');

  await page.locator('#ddg-count').fill('3');
  await page.locator('#ddg-count').press('Tab');
  await page.locator('#ddg-format [data-format="csv"]').click();

  const lines = (await page.locator('#ddg-output').inputValue()).split('\n');
  expect(lines[0]).toBe('name,email,phone,address,birthday');
  expect(lines).toHaveLength(4);
});

test('ダミーデータ: 項目をすべて外すとエラーが表示される', async ({ page }) => {
  await page.goto('/tools/dummy-data-generator/');

  for (const field of ['name', 'email', 'phone', 'address', 'birthday']) {
    await page.locator(`#ddg-field-${field}`).uncheck();
  }

  await expect(page.locator('#ddg-error')).not.toHaveText('');
  await expect(page.locator('#ddg-output')).toHaveValue('');
});

test('ダミーデータ: 英語データに切り替えるとふりがなが無効になる', async ({
  page,
}) => {
  await page.goto('/tools/dummy-data-generator/');

  await page.locator('#ddg-locale [data-locale="en"]').click();

  await expect(page.locator('#ddg-field-kana')).toBeDisabled();
  const records = JSON.parse(await page.locator('#ddg-output').inputValue());
  expect(records[0].phone).toMatch(/^\d{3}-555-01\d{2}$/);
});

test('ダミーデータ: コピーボタンが機能する', async ({ page }) => {
  await page.goto('/tools/dummy-data-generator/');

  await page.locator('#ddg-copy-button').click();

  await expect(page.locator('#ddg-copy-status')).not.toHaveText('');
});

test('ダミーデータ: ダウンロードできる', async ({ page }) => {
  await page.goto('/tools/dummy-data-generator/');

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('#ddg-download-button').click(),
  ]);
  expect(download.suggestedFilename()).toBe('dummy-data.json');
});

test('ダミーデータ: 英語版ページで英語データが初期選択される', async ({
  page,
}) => {
  await page.goto('/en/tools/dummy-data-generator/');

  const records = JSON.parse(await page.locator('#ddg-output').inputValue());
  expect(records[0].email).toMatch(/@example\.(com|net|org)$/);
  expect(records[0].phone).toMatch(/555-01/);
});

test('ダミーデータ: 上限1000件に制限される', async ({ page }) => {
  await page.goto('/tools/dummy-data-generator/');

  // 1500件を指定
  await page.locator('#ddg-count').fill('1500');
  await page.locator('#ddg-count').press('Tab');

  const records = JSON.parse(await page.locator('#ddg-output').inputValue());
  expect(records).toHaveLength(1000);
});

test('ダミーデータ: 1件から1000件までのあらゆる件数で正常に生成される', async ({
  page,
}) => {
  await page.goto('/tools/dummy-data-generator/');

  // テスト用の件数
  for (const count of [1, 100, 999, 1000]) {
    await page.locator('#ddg-count').fill(String(count));
    await page.locator('#ddg-count').press('Tab');

    const records = JSON.parse(await page.locator('#ddg-output').inputValue());
    expect(records).toHaveLength(count);
  }
});

test('ダミーデータ: 複数のシードで異なるデータが生成される', async ({
  page,
}) => {
  await page.goto('/tools/dummy-data-generator/');

  // シードを設定してデータを取得
  await page.locator('#ddg-seed').fill('seed-a');
  await page.locator('#ddg-seed').press('Tab');
  const firstData = await page.locator('#ddg-output').inputValue();

  // 異なるシードに変更
  await page.locator('#ddg-seed').fill('seed-b');
  await page.locator('#ddg-seed').press('Tab');
  const secondData = await page.locator('#ddg-output').inputValue();

  expect(firstData).not.toBe(secondData);

  // 元のシードに戻すと同じになる
  await page.locator('#ddg-seed').fill('seed-a');
  await page.locator('#ddg-seed').press('Tab');
  const thirdData = await page.locator('#ddg-output').inputValue();

  expect(firstData).toBe(thirdData);
});
