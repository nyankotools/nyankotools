import { test, expect } from './helpers/test';

test.describe('時間計算ツール（日本語版）', () => {
  test('初期行（9:00〜18:00・休憩60分）で実働8時間が表示される', async ({
    page,
  }) => {
    await page.goto('/tools/time-calculator/');
    await expect(page.locator('#tc-total-hm')).toHaveText('8:00');
    await expect(page.locator('#tc-total-decimal')).toHaveText('8 時間');
  });

  test('行を追加すると合計され、日またぎも計算できる', async ({ page }) => {
    await page.goto('/tools/time-calculator/');
    await page.locator('#tc-add-row').click();
    await page.getByLabel('2行目の出勤時刻').fill('22:00');
    await page.getByLabel('2行目の退勤時刻').fill('06:00');
    await page.getByLabel('2行目の休憩（分）').fill('45');
    // 8:00 + 7:15
    await expect(page.locator('#tc-total-hm')).toHaveText('15:15');
    await expect(page.locator('#tc-total-decimal')).toHaveText('15.25 時間');
  });

  test('休憩が長すぎる行はエラーになる', async ({ page }) => {
    await page.goto('/tools/time-calculator/');
    await page.getByLabel('1行目の休憩（分）').fill('600');
    await expect(page.locator('#tc-work-error')).toContainText(
      '計算できない行があります',
    );
  });

  test('行を削除できる', async ({ page }) => {
    await page.goto('/tools/time-calculator/');
    await page.getByRole('button', { name: '1行目を削除' }).click();
    await expect(page.locator('#tc-total-hm')).toHaveText('0:00');
  });

  test('時刻の足し算・引き算で日またぎが表示される', async ({ page }) => {
    await page.goto('/tools/time-calculator/');
    await page.locator('#tc-base-time').fill('23:00');
    await page.locator('#tc-delta-h').fill('2');
    await expect(page.locator('#tc-addsub-result')).toHaveText('1:00 (翌日)');
    await page.getByRole('radio', { name: '引く' }).check();
    await expect(page.locator('#tc-addsub-result')).toHaveText('21:00');
  });

  test('時間・分と小数時間を相互に換算できる', async ({ page }) => {
    await page.goto('/tools/time-calculator/');
    await page.locator('#tc-conv-h').fill('7');
    await page.locator('#tc-conv-m').fill('45');
    await expect(page.locator('#tc-hm-result')).toHaveText('7.75 時間');
    await page.locator('#tc-conv-decimal').fill('7.75');
    await expect(page.locator('#tc-decimal-result')).toHaveText('7:45');
    await page.locator('#tc-conv-decimal').fill('-1');
    await expect(page.locator('#tc-decimal-error')).toHaveText(
      '0以上の数値を入力してください',
    );
  });
});

test.describe('Time Calculator (English)', () => {
  test('英語版で合計と換算ができる', async ({ page }) => {
    await page.goto('/en/tools/time-calculator/');
    await expect(page.locator('#tc-total-hm')).toHaveText('8:00');
    await page.locator('#tc-conv-decimal').fill('0.5');
    await expect(page.locator('#tc-decimal-result')).toHaveText('0:30');
  });
});
