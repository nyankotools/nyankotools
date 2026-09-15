import { test, expect } from '@playwright/test';

test('文字数カウントツールでテキストを入力すると結果が更新される', async ({
  page,
}) => {
  await page.goto('/tools/char-counter/');

  const input = page.locator('#char-counter-input');
  await input.fill('hello world\nsecond line');

  await expect(page.locator('#char-counter-characters')).toHaveText('23');
  await expect(page.locator('#char-counter-words')).toHaveText('4');
  await expect(page.locator('#char-counter-lines')).toHaveText('2');
});

test('サイドバーからツールページへ遷移できる', async ({ page }) => {
  await page.goto('/');

  await page
    .locator('#sidebar')
    .getByRole('link', { name: '文字数カウント' })
    .click();

  await expect(page).toHaveURL(/\/tools\/char-counter\/?$/);
  await expect(page.locator('main h1')).toHaveText('文字数カウント');
});
