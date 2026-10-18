import { test, expect } from './helpers/test';
import AxeBuilder from '@axe-core/playwright';

const SAMPLE =
  'info@example.com 03-1234-5678 https://example.com/a 2026-10-18 info@example.com #tag 192.168.0.1';

test('メール・URL・電話番号・日付を抽出し、重複を除去する', async ({
  page,
}) => {
  await page.goto('/tools/text-extractor/');
  await page.locator('#te-input').fill(SAMPLE);

  await expect(page.locator('#te-output')).toHaveValue(
    'info@example.com\n03-1234-5678\nhttps://example.com/a\n2026-10-18',
  );
  await expect(page.locator('#te-summary')).toContainText('4件');
  await expect(page.locator('#te-summary')).toContainText('5件');
});

test('種類の選択と区切りを切り替えられる', async ({ page }) => {
  await page.goto('/tools/text-extractor/');
  await page.locator('#te-input').fill(SAMPLE);

  await page.locator('#te-type-email').uncheck();
  await page.locator('#te-type-hashtag').check();
  await page.locator('#te-type-ipv4').check();
  await page.locator('#te-join').selectOption('comma');
  await expect(page.locator('#te-output')).toHaveValue(
    '03-1234-5678, https://example.com/a, 2026-10-18, #tag, 192.168.0.1',
  );
});

test('抽出結果にaxeのアクセシビリティ違反がない', async ({ page }) => {
  await page.goto('/tools/text-extractor/');
  await page.locator('#te-input').fill(SAMPLE);
  await expect(page.locator('#te-output')).not.toHaveValue('');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});

test('重複除去をオフにすると全件が出る', async ({ page }) => {
  await page.goto('/en/tools/text-extractor/');
  await page.locator('#te-input').fill('a@b.com a@b.com');
  await page.locator('#te-unique').uncheck();
  await expect(page.locator('#te-output')).toHaveValue('a@b.com\na@b.com');
});

test('種類を全て外すと案内が出て、HTMLは注入されない', async ({ page }) => {
  await page.goto('/en/tools/text-extractor/');
  await page.locator('#te-input').fill('<img src=x onerror=alert(1)> a@b.com');
  await expect(page.locator('#te-output')).toHaveValue('a@b.com');
  await expect(page.locator('#te-input ~ img, #te-output ~ img')).toHaveCount(
    0,
  );

  for (const type of ['email', 'url', 'phone', 'date']) {
    await page.locator(`#te-type-${type}`).uncheck();
  }
  await expect(page.locator('#te-summary')).toContainText('Select at least');
  await expect(page.locator('#te-output')).toHaveValue('');
});
