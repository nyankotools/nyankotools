import { test, expect } from './helpers/test';

test('正規表現の解説: パターンが構成要素に分解される', async ({ page }) => {
  await page.goto('/tools/regex-explainer/');

  await page.locator('#rx-pattern').fill('^(\\d{3})-(?<b>\\d+?)$');
  await page.locator('#rx-flags').fill('i');

  await expect(page.locator('#rx-results')).toBeVisible();
  await expect(page.locator('#rx-tokens')).toContainText('入力の先頭に一致');
  await expect(page.locator('#rx-tokens')).toContainText(
    'キャプチャグループ 1',
  );
  await expect(page.locator('#rx-tokens')).toContainText('最短一致');
  await expect(page.locator('#rx-meta')).toContainText(
    'キャプチャグループ: 2個',
  );
  await expect(page.locator('#rx-meta')).toContainText(
    '大文字と小文字を区別しない',
  );
});

test('正規表現の解説: 不正なパターンはエラー位置つきで表示される', async ({
  page,
}) => {
  await page.goto('/tools/regex-explainer/');

  await page.locator('#rx-pattern').fill('ab(c');

  await expect(page.locator('#rx-error')).toBeVisible();
  await expect(page.locator('#rx-error-message')).toContainText('3文字目');
  await expect(page.locator('#rx-error-pattern mark')).toHaveText('(');
  await expect(page.locator('#rx-results')).toBeHidden();
});

test('正規表現の解説: /pattern/flags 形式を読み取る', async ({ page }) => {
  await page.goto('/tools/regex-explainer/');

  await page.locator('#rx-pattern').fill('/a+/gi');

  await expect(page.locator('#rx-literal-note')).toBeVisible();
  await expect(page.locator('#rx-meta')).toContainText('全体検索');
});

test('正規表現の解説: サンプル入力・コピー・クリアが動作する', async ({
  page,
}) => {
  await page.goto('/tools/regex-explainer/');

  await page.locator('#rx-sample-button').click();
  await expect(page.locator('#rx-tokens li').first()).toBeVisible();
  await expect(page.locator('#rx-tokens')).toContainText('否定の後読み');

  await page.locator('#rx-copy-button').click();
  await expect(page.locator('#rx-copy-status')).not.toHaveText('');

  await page.locator('#rx-clear-button').click();
  await expect(page.locator('#rx-results')).toBeHidden();
  await expect(page.locator('#rx-pattern')).toHaveValue('');
});

test('正規表現の解説: 英語版で解説される', async ({ page }) => {
  await page.goto('/en/tools/regex-explainer/');

  await page.locator('#rx-pattern').fill('(?<=\\$)\\d+');

  await expect(page.locator('#rx-tokens')).toContainText('Positive lookbehind');
  await expect(page.locator('#rx-tokens')).toContainText(
    'Repeats the previous element 1 or more times',
  );
});
