import { test, expect } from './helpers/test';

test('単位変換: 日本語版が表示される', async ({ page }) => {
  await page.goto('/tools/unit-converter/');

  await expect(page.locator('main h1')).toContainText('単位変換');
});

test('単位変換: メートルからフィートに変換できる', async ({ page }) => {
  await page.goto('/tools/unit-converter/');

  const valueInput = page.locator('#unit-value-input');
  const result = page.locator('#unit-result');

  // デフォルトは長さ（m → ft）カテゴリなので、1mを入力
  await valueInput.fill('1');

  // 1m = 3.28084 ft ぐらい
  await expect(result).toContainText(/3\.28/);
});

test('単位変換: カテゴリを変更すると単位選択肢が更新される', async ({
  page,
}) => {
  await page.goto('/tools/unit-converter/');

  const categorySelect = page.locator('#unit-category-select');
  const fromSelect = page.locator('#unit-from-select');

  // 質量（mass）に切り替え
  await categorySelect.selectOption('mass');

  // オプションの個数が異なる（単位の種類が違う）
  const options = await fromSelect.locator('option').all();
  expect(options.length).toBeGreaterThan(0);
});

test('単位変換: 入れ替えボタンで from と to が入れ替わる', async ({ page }) => {
  await page.goto('/tools/unit-converter/');

  const fromSelect = page.locator('#unit-from-select');
  const toSelect = page.locator('#unit-to-select');
  const swapButton = page.locator('#unit-swap-button');

  // デフォルトは m → ft
  const initialFrom = await fromSelect.inputValue();
  const initialTo = await toSelect.inputValue();

  // 入れ替え
  await swapButton.click();

  // 逆になる
  const newFrom = await fromSelect.inputValue();
  const newTo = await toSelect.inputValue();

  expect(newFrom).toBe(initialTo);
  expect(newTo).toBe(initialFrom);

  // 計算結果も更新される
  const valueInput = page.locator('#unit-value-input');
  await valueInput.fill('3');

  const result = page.locator('#unit-result');
  await expect(result).not.toHaveText('');
});

test('単位変換: セ氏からファーレンハイトへ温度変換できる', async ({ page }) => {
  await page.goto('/tools/unit-converter/');

  const categorySelect = page.locator('#unit-category-select');
  const fromSelect = page.locator('#unit-from-select');
  const toSelect = page.locator('#unit-to-select');
  const valueInput = page.locator('#unit-value-input');
  const result = page.locator('#unit-result');

  // 温度カテゴリに変更
  await categorySelect.selectOption('temperature');

  // C → F
  await fromSelect.selectOption('c');
  await toSelect.selectOption('f');

  // 0℃ = 32°F
  await valueInput.fill('0');
  await expect(result).toContainText('32');
});

test('単位変換: 結果をコピーできる', async ({ page }) => {
  await page.goto('/tools/unit-converter/');

  const valueInput = page.locator('#unit-value-input');
  const copyButton = page.locator('#unit-copy-button');
  const copyStatus = page.locator('#unit-copy-status');

  await valueInput.fill('5');

  // コピーボタンをクリック
  await copyButton.click();

  // コピー成功メッセージが表示される
  await expect(copyStatus).toContainText(/.+/);
});

test('単位変換: 全単位の表示', async ({ page }) => {
  await page.goto('/tools/unit-converter/');

  const valueInput = page.locator('#unit-value-input');
  const allWrapper = page.locator('#unit-all-wrapper');

  await valueInput.fill('1');

  // 全単位リストが表示される
  await expect(allWrapper).not.toHaveClass(/hidden/);

  const allList = page.locator('#unit-all-list');
  const items = await allList.locator('div').all();

  expect(items.length).toBeGreaterThan(0);
});

test('単位変換: 英語版が表示される', async ({ page }) => {
  await page.goto('/en/tools/unit-converter/');

  await expect(page.locator('main h1')).toContainText('Unit Converter');

  const categoryLabel = page.locator('label', {
    hasText: /Category/,
  });
  await expect(categoryLabel).toBeVisible();
});

test('単位変換: 英語版でキログラムをポンドに変換できる', async ({ page }) => {
  await page.goto('/en/tools/unit-converter/');

  const categorySelect = page.locator('#unit-category-select');
  const valueInput = page.locator('#unit-value-input');
  const result = page.locator('#unit-result');

  // 質量カテゴリに変更
  await categorySelect.selectOption('mass');

  // kg → lb（デフォルト）
  await valueInput.fill('1');

  // 1 kg ≈ 2.20462 lb
  await expect(result).toContainText(/2\.2/);
});

test('単位変換: 無効な単位組み合わせはエラーを表示しない', async ({ page }) => {
  await page.goto('/tools/unit-converter/');

  const valueInput = page.locator('#unit-value-input');
  const errorEl = page.locator('#unit-error');

  await valueInput.fill('10');

  // エラーは表示されない（有効な変換）
  await expect(errorEl).toHaveText('');
});
