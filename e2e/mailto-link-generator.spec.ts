import { test, expect } from './helpers/test';

test.describe('mailto・tel・SMSリンク生成', () => {
  test('メールの宛先・件名・本文からエンコード済みhrefとaタグを生成する', async ({
    page,
  }) => {
    await page.goto('/tools/mailto-link-generator/');

    await page.locator('#ml-to').fill('a@example.com');
    await page.locator('#ml-cc').fill('c@example.com');
    await page.locator('#ml-subject').fill('Hello World');
    await page.locator('#ml-body').fill('1行目\n2行目');

    await expect(page.locator('#ml-href-output')).toHaveValue(
      `mailto:a@example.com?cc=c@example.com&subject=Hello%20World&body=${encodeURIComponent('1行目')}%0D%0A${encodeURIComponent('2行目')}`,
    );
    await expect(page.locator('#ml-html-output')).toHaveValue(
      /^<a href="mailto:a@example\.com\?cc=c@example\.com&amp;subject=/,
    );
  });

  test('電話に切り替えると全角が半角になり、内線が付く', async ({ page }) => {
    await page.goto('/tools/mailto-link-generator/');

    await page.locator('[data-kind="tel"]').click();
    await expect(page.locator('#ml-error')).toBeHidden();
    await page.locator('#ml-phone').fill('０３－１２３４－５６７８');
    await page.locator('#ml-ext').fill('12');
    await expect(page.locator('#ml-href-output')).toHaveValue(
      'tel:03-1234-5678;ext=12',
    );

    await page.locator('#ml-phone').fill('abc');
    await expect(page.locator('#ml-error')).toBeVisible();
    await expect(page.locator('#ml-href-output')).toHaveValue('');
  });

  test('SMSはiOS向けの区切りに切り替えられる', async ({ page }) => {
    await page.goto('/tools/mailto-link-generator/');

    await page.locator('[data-kind="sms"]').click();
    await page.locator('#ml-sms-numbers').fill('09012345678');
    await page.locator('#ml-sms-body').fill('hi there');
    await expect(page.locator('#ml-href-output')).toHaveValue(
      'sms:09012345678?body=hi%20there',
    );
    await page.locator('#ml-sms-style').selectOption('ios');
    await expect(page.locator('#ml-href-output')).toHaveValue(
      'sms:09012345678&body=hi%20there',
    );
  });

  test('hrefをコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/mailto-link-generator/');

    await page.locator('#ml-to').fill('a@example.com');
    await page.locator('#ml-copy-href-button').click();
    await expect(page.locator('#ml-status')).toHaveText('コピーしました');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      'mailto:a@example.com',
    );
  });
});

test.describe('mailto, tel & SMS Link Generator (English)', () => {
  test('generates a mailto link and copies the HTML', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/en/tools/mailto-link-generator/');

    await page.locator('#ml-to').fill('a@example.com');
    await page.locator('#ml-subject').fill('Quote request');
    await expect(page.locator('#ml-href-output')).toHaveValue(
      'mailto:a@example.com?subject=Quote%20request',
    );
    await page.locator('#ml-copy-html-button').click();
    await expect(page.locator('#ml-status')).toHaveText('Copied');
  });
});
