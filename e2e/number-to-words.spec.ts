import { test, expect } from './helpers/test';

test.describe('数字→英語表記・日本語読み変換ツール', () => {
  test('整数を英語表記・序数・小切手表記・読みに変換する', async ({ page }) => {
    await page.goto('/tools/number-to-words/');
    await page.locator('#ntw-input').fill('1,234');
    await expect(page.locator('#ntw-cardinal')).toHaveText(
      'one thousand two hundred thirty-four',
    );
    await expect(page.locator('#ntw-ordinal')).toHaveText(
      'one thousand two hundred thirty-fourth (1234th)',
    );
    await expect(page.locator('#ntw-check')).toHaveText(
      'One thousand two hundred thirty-four and 00/100 dollars',
    );
    await expect(page.locator('#ntw-reading')).toHaveText(
      'せんにひゃくさんじゅうよん',
    );
  });

  test('英国式・通貨・小数を切り替えられる', async ({ page }) => {
    await page.goto('/tools/number-to-words/');
    await page.locator('#ntw-input').fill('101.5');
    await page.locator('#ntw-british').check();
    await page.locator('#ntw-currency').selectOption('pounds');
    await expect(page.locator('#ntw-cardinal')).toHaveText(
      'one hundred and one point five',
    );
    await expect(page.locator('#ntw-check')).toHaveText(
      'One hundred and one and 50/100 pounds',
    );
    await expect(page.locator('#ntw-ordinal')).toContainText('—');
  });

  test('数字でない入力はエラーを表示する', async ({ page }) => {
    await page.goto('/tools/number-to-words/');
    await page.locator('#ntw-input').fill('12abc');
    await expect(page.locator('#ntw-error')).toBeVisible();
    await page.locator('#ntw-input').fill('5');
    await expect(page.locator('#ntw-error')).toBeHidden();
    await expect(page.locator('#ntw-cardinal')).toHaveText('five');
  });

  test('英語ページでも動作する', async ({ page }) => {
    await page.goto('/en/tools/number-to-words/');
    await page.locator('#ntw-input').fill('21');
    await expect(page.locator('#ntw-ordinal')).toHaveText(
      'twenty-first (21st)',
    );
  });

  test('3桁区切りでないカンマは入力エラーになる', async ({ page }) => {
    await page.goto('/tools/number-to-words/');
    await page.locator('#ntw-input').fill('1,5');
    await expect(page.locator('#ntw-error')).toHaveText(
      '数字として読み取れません。半角または全角の数字、カンマ、小数点、先頭のマイナスだけを入力してください。',
    );
    await expect(page.locator('#ntw-cardinal')).toHaveText('');
  });

  test('桁数超過（整数37桁）はエラーを表示する（英語版）', async ({ page }) => {
    await page.goto('/en/tools/number-to-words/');
    await page.locator('#ntw-input').fill('1'.repeat(37));
    await expect(page.locator('#ntw-error')).toContainText('36 integer digits');
    await page.locator('#ntw-input').fill('9'.repeat(36));
    await expect(page.locator('#ntw-error')).toBeHidden();
    await expect(page.locator('#ntw-cardinal')).toContainText('decillion');
  });

  test('?text= の値が初期入力として反映され、URLから消える', async ({
    page,
  }) => {
    await page.goto('/tools/number-to-words/?text=2026');
    await expect(page.locator('#ntw-input')).toHaveValue('2026');
    await expect(page.locator('#ntw-cardinal')).toHaveText(
      'two thousand twenty-six',
    );
    await expect(page).toHaveURL(/\/tools\/number-to-words\/?$/);
  });

  test('36桁の入力でも375pxで横あふれしない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/tools/number-to-words/');
    await page
      .locator('#ntw-input')
      .fill('9'.repeat(36) + '.' + '1'.repeat(30));
    await expect(page.locator('#ntw-cardinal')).toContainText('decillion');
    await expect(page.locator('#ntw-reading')).not.toBeEmpty();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
    for (const id of [
      'ntw-cardinal',
      'ntw-ordinal',
      'ntw-check',
      'ntw-reading',
    ]) {
      const box = await page.locator(`#${id}`).boundingBox();
      expect(box!.x + box!.width).toBeLessThanOrEqual(375);
    }
  });

  test('コピーボタンで結果をクリップボードへコピーする', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/number-to-words/');
    await page.locator('#ntw-input').fill('1,234');
    await page.locator('#ntw-copy-button').click();
    await expect(page.locator('#ntw-status')).toHaveText('コピーしました');
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toBe('one thousand two hundred thirty-four');
  });
});
