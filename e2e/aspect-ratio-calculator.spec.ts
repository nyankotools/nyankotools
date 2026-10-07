import { test, expect } from './helpers/test';

test('アスペクト比計算機: 幅と高さから約分した比率を表示する', async ({
  page,
}) => {
  await page.goto('/tools/aspect-ratio-calculator/');

  await page.locator('#ar-size-w').fill('1920');
  await page.locator('#ar-size-h').fill('1080');

  await expect(page.locator('#ar-simplified')).toHaveText('16:9');
  await expect(page.locator('#ar-decimal')).toHaveText('1.7778');
});

test('アスペクト比計算機: 比率と幅から高さを計算できる', async ({ page }) => {
  await page.goto('/tools/aspect-ratio-calculator/');

  await page.locator('#ar-preset').selectOption('4:3');
  await page.locator('#ar-known-value').fill('800');

  await expect(page.locator('#ar-result-w')).toHaveText('800');
  await expect(page.locator('#ar-result-h')).toHaveText('600');
});

test('アスペクト比計算機: 高さから幅を計算し、結果をコピーできる', async ({
  page,
}) => {
  await page.goto('/tools/aspect-ratio-calculator/');

  await page.locator('#ar-known').selectOption('height');
  await page.locator('#ar-known-value').fill('1080');

  await expect(page.locator('#ar-result-w')).toHaveText('1920');
  await page.locator('#ar-copy-button').click();
  await expect(page.locator('#ar-copy-status')).toContainText(/.+/);
});

test('アスペクト比計算機: 不正な値でエラーを表示する', async ({ page }) => {
  await page.goto('/tools/aspect-ratio-calculator/');

  await page.locator('#ar-size-w').fill('0');
  await expect(page.locator('#ar-size-error')).not.toHaveText('');
  await expect(page.locator('#ar-simplified')).toHaveText('');
});

test('アスペクト比計算機: 英語版でこの比率を使うボタンが動く', async ({
  page,
}) => {
  await page.goto('/en/tools/aspect-ratio-calculator/');

  await page.locator('#ar-size-w').fill('1080');
  await page.locator('#ar-size-h').fill('1920');
  await page.locator('#ar-use-button').click();

  await expect(page.locator('#ar-ratio-w')).toHaveValue('9');
  await expect(page.locator('#ar-ratio-h')).toHaveValue('16');
  await expect(page.locator('#ar-preset')).toHaveValue('9:16');
});
