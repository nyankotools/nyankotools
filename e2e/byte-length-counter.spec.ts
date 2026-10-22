import { test, expect } from './helpers/test';

test('テキストを入力するとUTF-8・Shift_JIS・UTF-16のバイト数が表示される', async ({
  page,
}) => {
  await page.goto('/tools/byte-length-counter/');

  await page.locator('#byte-length-input').fill('aあ');
  await expect(page.locator('#byte-length-utf8')).toHaveText('4');
  await expect(page.locator('#byte-length-sjis')).toHaveText('3');
  await expect(page.locator('#byte-length-utf16')).toHaveText('4');
  await expect(page.locator('#byte-length-characters')).toHaveText('2');
  await expect(page.locator('#byte-length-unmappable')).toBeHidden();
});

test('Shift_JISで表現できない文字は一覧に表示され、BOM指定でバイト数が増える', async ({
  page,
}) => {
  await page.goto('/tools/byte-length-counter/');

  await page.locator('#byte-length-input').fill('a😀');
  await expect(page.locator('#byte-length-sjis')).toHaveText('2');
  await expect(page.locator('#byte-length-unmappable-list')).toHaveText('😀');

  await page.locator('#byte-length-bom').check();
  await expect(page.locator('#byte-length-utf8')).toHaveText('8');
});

test('上限を超えると超過位置と超過部分が表示される', async ({ page }) => {
  await page.goto('/tools/byte-length-counter/');

  await page.locator('#byte-length-input').fill('あいうえお');
  await page.locator('#byte-length-limit').fill('7');

  await expect(page.locator('#byte-length-used')).toHaveText('15');
  await expect(page.locator('#byte-length-remaining')).toHaveText('8');
  await expect(page.locator('#byte-length-remaining-label')).toHaveText('超過');
  await expect(page.locator('#byte-length-limit-message')).toHaveText(
    '3文字目から上限を超えます。',
  );
  await expect(page.locator('#byte-length-fit')).toHaveText('あい');
  await expect(page.locator('#byte-length-over')).toHaveText('うえお');
});

test('英語版で上限に収まるとメッセージが切り替わる', async ({ page }) => {
  await page.goto('/en/tools/byte-length-counter/');

  await page.locator('#byte-length-input').fill('hello');
  await expect(page.locator('#byte-length-limit-message')).toHaveText(
    'The text fits within the limit.',
  );
  await expect(page.locator('#byte-length-remaining')).toHaveText('250');
  await expect(page.locator('#byte-length-limit-result')).toBeHidden();
});

test('上限欄を空にすると上限チェックは無効になり、超過とは表示されない', async ({
  page,
}) => {
  await page.goto('/tools/byte-length-counter/');

  await page.locator('#byte-length-input').fill('hello');
  await page.locator('#byte-length-limit').fill('');

  await expect(page.locator('#byte-length-used')).toHaveText('5');
  await expect(page.locator('#byte-length-remaining-label')).not.toHaveText(
    '超過',
  );
  await expect(page.locator('#byte-length-limit-result')).toBeHidden();
});
