import { test, expect } from './helpers/test';

async function fillDate(
  page: import('@playwright/test').Page,
  y: string,
  m: string,
  d: string,
) {
  await page.locator('#kigaku-year').fill(y);
  await page.locator('#kigaku-month-input').fill(m);
  await page.locator('#kigaku-day').fill(d);
}

test.describe('九星気学（日本語版）', () => {
  test('立春の前日は前年の本命星、当日から当年になる', async ({ page }) => {
    await page.goto('/tools/kyusei-kigaku/');

    await fillDate(page, '2024', '2', '3');
    await expect(page.locator('#kigaku-honmei')).toHaveText('四緑木星（木）');
    await expect(page.locator('#kigaku-judge')).toContainText('前年（2023年）');

    await fillDate(page, '2024', '2', '4');
    await expect(page.locator('#kigaku-honmei')).toHaveText('三碧木星（木）');
    await expect(page.locator('#kigaku-getsumei')).toHaveText('二黒土星（土）');
  });

  test('実在しない日付ではエラーが表示され結果が隠れる', async ({ page }) => {
    await page.goto('/tools/kyusei-kigaku/');

    await fillDate(page, '2001', '2', '29');
    await expect(page.locator('#kigaku-error')).not.toBeEmpty();
    await expect(page.locator('#kigaku-results')).toBeHidden();
  });

  test('早見表に9つの星が表示される', async ({ page }) => {
    await page.goto('/tools/kyusei-kigaku/');
    await expect(page.locator('#kigaku-table tbody tr')).toHaveCount(9);
  });
});

test.describe('Nine Star Ki (English)', () => {
  test('英語名で表示される', async ({ page }) => {
    await page.goto('/en/tools/kyusei-kigaku/');

    await fillDate(page, '2025', '2', '2');
    await expect(page.locator('#kigaku-honmei')).toHaveText(
      '3 Jade Wood (Wood)',
    );

    await fillDate(page, '2025', '2', '3');
    await expect(page.locator('#kigaku-honmei')).toHaveText(
      '2 Black Earth (Earth)',
    );
  });
});
