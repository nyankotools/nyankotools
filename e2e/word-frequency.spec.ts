import { readFileSync } from 'node:fs';
import { test, expect } from './helpers/test';
import AxeBuilder from '@axe-core/playwright';

test('文字単位で出現頻度が多い順に表示される', async ({ page }) => {
  await page.goto('/tools/word-frequency/');

  await page.locator('#wf-input').fill('ああいう、あ！');

  const rows = page.locator('#wf-tbody tr');
  await expect(rows).toHaveCount(3);
  await expect(rows.first().locator('td').nth(1)).toHaveText('あ');
  await expect(rows.first().locator('td').nth(2)).toHaveText('3');
  await expect(page.locator('#wf-summary')).toContainText('合計 5 件');
});

test('英語版は単語単位が既定で、大文字小文字の区別を切り替えられる', async ({
  page,
}) => {
  await page.goto('/en/tools/word-frequency/');

  await expect(page.locator('#wf-unit-word')).toBeChecked();
  await page.locator('#wf-input').fill('The the THE cat');

  const first = page.locator('#wf-tbody tr').first().locator('td');
  await expect(first.nth(1)).toHaveText('the');
  await expect(first.nth(2)).toHaveText('3');

  await page.locator('#wf-ignore-case').uncheck();
  await expect(page.locator('#wf-tbody tr')).toHaveCount(4);
});

test('上位件数で絞り込める', async ({ page }) => {
  await page.goto('/en/tools/word-frequency/');

  await page.locator('#wf-input').fill('a a a b b c');
  await page.locator('#wf-top-n').fill('2');
  await expect(page.locator('#wf-tbody tr')).toHaveCount(2);

  await page.locator('#wf-top-n').fill('0');
  await expect(page.locator('#wf-tbody tr')).toHaveCount(3);
});

test('入力が空のときは表とCSVボタンが無効になる', async ({ page }) => {
  await page.goto('/tools/word-frequency/');

  await expect(page.locator('#wf-table-wrap')).toBeHidden();
  await expect(page.locator('#wf-empty')).toBeVisible();
  await expect(page.locator('#wf-copy-button')).toBeDisabled();
  await expect(page.locator('#wf-download-button')).toBeDisabled();
});

test('CSVをダウンロードでき、内容は表と一致する', async ({ page }) => {
  await page.goto('/en/tools/word-frequency/');

  await page.locator('#wf-input').fill('x y x');
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#wf-download-button').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('word-frequency.csv');
  await expect(page.locator('#wf-status')).toHaveText('Downloaded');

  const path = await download.path();
  expect(path).toBeTruthy();
  // Excel での文字化け防止のため先頭にBOMが付く（それ以外は内容を検証する）
  const csv = readFileSync(path as string, 'utf8').replace(/^\uFEFF/, '');
  expect(csv).toBe(
    'Rank,Character / word,Count,Share(%)\r\n1,x,2,66.67\r\n2,y,1,33.33',
  );
});

test('結果表にaxeのアクセシビリティ違反がない', async ({ page }) => {
  await page.goto('/tools/word-frequency/');
  await page.locator('#wf-input').fill('ああいう、あ！');
  await expect(page.locator('#wf-tbody tr')).toHaveCount(3);

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});
