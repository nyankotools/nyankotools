import { test, expect, type Page } from './helpers/test';

/** 画面のガイド文（標準表記）をそのまま打って、全問を終える */
async function typeAll(page: Page, rounds: number) {
  for (let i = 0; i < rounds; i++) {
    const guide = (await page.locator('#typing-guide').textContent()) ?? '';
    expect(guide.length).toBeGreaterThan(0);
    await page.keyboard.type(guide);
  }
}

test.describe('タイピング速度テスト', () => {
  test('日本語: ガイドどおりに打つと結果が出て、正確性が100%になる', async ({
    page,
  }) => {
    await page.goto('/tools/typing-test/');
    await page.locator('#typing-size [data-size="3"]').click();
    await page.locator('#typing-start-button').click();
    await expect(page.locator('#typing-text')).toBeVisible();
    await expect(page.locator('#typing-kana')).toBeVisible();
    await expect(page.locator('#typing-progress')).toContainText('1 / 3');

    await typeAll(page, 3);
    await expect(page.locator('#typing-result')).toBeVisible();
    await expect(page.locator('#typing-r-accuracy')).toHaveText('100%');
    await expect(page.locator('#typing-r-miss')).toHaveText('0');
    await expect(page.locator('#typing-weak')).toContainText(
      'ミスはありません',
    );
  });

  test('ミスしたキーは進まず、苦手キーに集計される', async ({ page }) => {
    await page.goto('/tools/typing-test/');
    await page.locator('#typing-size [data-size="3"]').click();
    await page.locator('#typing-start-button').click();
    const first = (await page.locator('#typing-guide').textContent()) ?? '';
    // 日本語のガイドは小文字の英字・記号のみなので、大文字の「0」は必ず不正解
    await page.keyboard.press('0');
    await expect(page.locator('#typing-guide')).toHaveText(first);
    await page.keyboard.type(first);
    await typeAll(page, 2);
    await expect(page.locator('#typing-r-miss')).toHaveText('1');
    await expect(page.locator('#typing-weak li')).toHaveCount(1);
    await expect(page.locator('#typing-weak')).toContainText(
      `${first[0]}：1回`,
    );
  });

  test('開始前や領域外のキー入力は計測されない', async ({ page }) => {
    await page.goto('/tools/typing-test/');
    await page.locator('#typing-area').focus();
    await page.keyboard.type('abc');
    await expect(page.locator('#typing-result')).toBeHidden();
    await expect(page.locator('#typing-guide')).toHaveText('');
  });

  test('英語: 大文字小文字を区別し、打ち終えると結果が出る', async ({
    page,
  }) => {
    await page.goto('/en/tools/typing-test/');
    await page.locator('#typing-mode [data-mode="en"]').click();
    await page.locator('#typing-size [data-size="3"]').click();
    await page.locator('#typing-start-button').click();
    await expect(page.locator('#typing-text')).toBeHidden();
    await typeAll(page, 3);
    await expect(page.locator('#typing-result')).toBeVisible();
    await expect(page.locator('#typing-r-accuracy')).toHaveText('100%');
    await expect(page.locator('#typing-copy-button')).toBeVisible();
  });

  test('言語を切り替えると進行中のテストがリセットされる', async ({ page }) => {
    await page.goto('/tools/typing-test/');
    await page.locator('#typing-start-button').click();
    await expect(page.locator('#typing-guide')).not.toHaveText('');
    await page.locator('#typing-mode [data-mode="en"]').click();
    await expect(page.locator('#typing-guide')).toHaveText('');
  });
});
