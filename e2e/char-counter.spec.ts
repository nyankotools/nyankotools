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

  // トップページではアクティブなツールがないため、カテゴリの<details>は
  // 初期状態で閉じており、中のリンクはアクセシビリティツリー上に現れない。
  // href指定で（隠れていても）要素を取得し、先に該当カテゴリを開いてから
  // リンクをクリックする。
  const link = page.locator('#sidebar a[href="/tools/char-counter/"]');
  await link.locator('xpath=ancestor::details[1]/summary').click();
  await link.click();

  await expect(page).toHaveURL(/\/tools\/char-counter\/?$/);
  await expect(page.locator('main h1')).toHaveText('文字数カウント');
});
