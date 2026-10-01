import { test, expect } from './helpers/test';

test('割り勘計算: 日本語版が表示される', async ({ page }) => {
  await page.goto('/tools/split-bill-calculator/');

  await expect(page.locator('main h1')).toContainText('割り勘計算');
});

test('割り勘計算: 均等割りで結果が表示される', async ({ page }) => {
  await page.goto('/tools/split-bill-calculator/');

  const totalInput = page.locator('#split-total-input');
  const peopleInput = page.locator('#split-people-input');
  const groupsEl = page.locator('#split-groups');

  // デフォルト値を使用（またはクリア後に入力）
  await totalInput.fill('10000');
  await peopleInput.fill('3');

  // 結果が表示される
  await expect(groupsEl).toContainText(/人/);

  const items = await groupsEl.locator('li').all();
  expect(items.length).toBeGreaterThan(0);
});

test('割り勘計算: 集計と余り・不足が表示される', async ({ page }) => {
  await page.goto('/tools/split-bill-calculator/');

  const totalInput = page.locator('#split-total-input');
  const peopleInput = page.locator('#split-people-input');
  const collectedEl = page.locator('#split-collected');
  const differenceEl = page.locator('#split-difference');

  await totalInput.fill('10000');
  await peopleInput.fill('3');

  // 集計額が表示される
  await expect(collectedEl).toContainText(/￥/);

  // 余り・不足が表示される
  await expect(differenceEl).toContainText(/.+/);
});

test('割り勘計算: 多めに払う人を設定できる', async ({ page }) => {
  await page.goto('/tools/split-bill-calculator/');

  const totalInput = page.locator('#split-total-input');
  const peopleInput = page.locator('#split-people-input');
  const higherCountInput = page.locator('#split-higher-count-input');
  const higherRatioInput = page.locator('#split-higher-ratio-input');
  const groupsEl = page.locator('#split-groups');

  await totalInput.fill('12000');
  await peopleInput.fill('3');
  await higherCountInput.fill('1');
  await higherRatioInput.fill('2');

  // 複数グループが表示される（多めに払う人と普通に払う人）
  const items = await groupsEl.locator('li').all();
  expect(items.length).toBe(2);

  // グループ別の金額が異なる
  const firstAmount = await items[0].textContent();
  const secondAmount = await items[1].textContent();
  expect(firstAmount).not.toBe(secondAmount);
});

test('割り勘計算: 丸め単位を変更できる', async ({ page }) => {
  await page.goto('/tools/split-bill-calculator/');

  const totalInput = page.locator('#split-total-input');
  const peopleInput = page.locator('#split-people-input');
  const unitSelect = page.locator('#split-unit-select');
  const collectedEl = page.locator('#split-collected');

  await totalInput.fill('10000');
  await peopleInput.fill('3');

  // 丸め単位を変更（1円単位に変更）
  await unitSelect.selectOption('1');

  // 丸め単位が変わると金額も変わる可能性がある
  await expect(collectedEl).toContainText(/￥/);
});

test('割り勘計算: 丸めモード（切り上げ・切り捨て・四捨五入）を変更できる', async ({
  page,
}) => {
  await page.goto('/tools/split-bill-calculator/');

  const totalInput = page.locator('#split-total-input');
  const peopleInput = page.locator('#split-people-input');
  const modeSelect = page.locator('#split-mode-select');
  const collectedEl = page.locator('#split-collected');

  await totalInput.fill('10000');
  await peopleInput.fill('3');

  // デフォルト（切り上げ）
  const initialCollected = await collectedEl.textContent();

  // 切り捨てに変更
  await modeSelect.selectOption('down');

  // 結果が更新される（少なくなるはず）
  const newCollected = await collectedEl.textContent();
  expect(initialCollected).not.toBe(newCollected);
});

test('割り勘計算: 結果をコピーできる', async ({ page }) => {
  await page.goto('/tools/split-bill-calculator/');

  const totalInput = page.locator('#split-total-input');
  const peopleInput = page.locator('#split-people-input');
  const copyButton = page.locator('#split-copy-button');
  const copyStatus = page.locator('#split-copy-status');

  await totalInput.fill('10000');
  await peopleInput.fill('3');

  // コピーボタンをクリック
  await copyButton.click();

  // コピー成功メッセージが表示される
  await expect(copyStatus).toContainText(/.+/);
});

test('割り勘計算: 金額が空の場合、結果は表示されない', async ({ page }) => {
  await page.goto('/tools/split-bill-calculator/');

  const groupsEl = page.locator('#split-groups');
  const totalInput = page.locator('#split-total-input');
  const peopleInput = page.locator('#split-people-input');

  // 金額を空にしてから人数を入力
  await totalInput.fill('');
  await peopleInput.fill('3');

  // 結果が表示されない（グループリストが空）
  const items = await groupsEl.locator('li').all();
  expect(items.length).toBe(0);
});

test('割り勘計算: 人数が空の場合、結果は表示されない', async ({ page }) => {
  await page.goto('/tools/split-bill-calculator/');

  const groupsEl = page.locator('#split-groups');
  const totalInput = page.locator('#split-total-input');
  const peopleInput = page.locator('#split-people-input');

  // 人数を空にしてから金額を入力
  await totalInput.fill('10000');
  await peopleInput.fill('');

  // 結果が表示されない（グループリストが空）
  const items = await groupsEl.locator('li').all();
  expect(items.length).toBe(0);
});

test('割り勘計算: 無効な金額（0以下）でエラーを表示', async ({ page }) => {
  await page.goto('/tools/split-bill-calculator/');

  const totalInput = page.locator('#split-total-input');
  const peopleInput = page.locator('#split-people-input');
  const errorEl = page.locator('#split-error');

  await totalInput.fill('0');
  await peopleInput.fill('3');

  // エラーメッセージが表示される
  await expect(errorEl).toContainText(/.+/);
});

test('割り勘計算: 無効な人数（1未満）でエラーを表示', async ({ page }) => {
  await page.goto('/tools/split-bill-calculator/');

  const totalInput = page.locator('#split-total-input');
  const peopleInput = page.locator('#split-people-input');
  const errorEl = page.locator('#split-error');

  await totalInput.fill('10000');
  await peopleInput.fill('0');

  // エラーメッセージが表示される
  await expect(errorEl).toContainText(/.+/);
});

test('割り勘計算: 多めに払う人数が全員を超える場合エラーを表示', async ({
  page,
}) => {
  await page.goto('/tools/split-bill-calculator/');

  const totalInput = page.locator('#split-total-input');
  const peopleInput = page.locator('#split-people-input');
  const higherCountInput = page.locator('#split-higher-count-input');
  const errorEl = page.locator('#split-error');

  await totalInput.fill('10000');
  await peopleInput.fill('3');
  await higherCountInput.fill('5'); // 3人なのに5人が多めに払う？

  // エラーメッセージが表示される
  await expect(errorEl).toContainText(/.+/);
});

test('割り勘計算: 英語版が表示される', async ({ page }) => {
  await page.goto('/en/tools/split-bill-calculator/');

  await expect(page.locator('main h1')).toContainText('Split Bill Calculator');

  const totalLabel = page.locator('label', { hasText: /Total/ });
  await expect(totalLabel).toBeVisible();
});

test('割り勘計算: 英語版で計算できる', async ({ page }) => {
  await page.goto('/en/tools/split-bill-calculator/');

  const totalInput = page.locator('#split-total-input');
  const peopleInput = page.locator('#split-people-input');
  const groupsEl = page.locator('#split-groups');

  await totalInput.fill('30');
  await peopleInput.fill('3');

  // 結果が表示される
  await expect(groupsEl).toContainText(/Everyone|people/);
});
