import { test, expect } from './helpers/test';

test.describe('古典暗号変換（日本語版）', () => {
  test('シーザー暗号で暗号化・復号でき、総当たり一覧に平文が出る', async ({
    page,
  }) => {
    await page.goto('/tools/classical-cipher/');

    await page.locator('#cc-shift').fill('3');
    await page.locator('#cc-input').fill('Hello, World!');
    await expect(page.locator('#cc-output')).toHaveValue('Khoor, Zruog!');

    await page.locator('#cc-direction [data-direction="decrypt"]').click();
    await page.locator('#cc-input').fill('Khoor, Zruog!');
    await expect(page.locator('#cc-output')).toHaveValue('Hello, World!');

    await expect(page.locator('#cc-brute-list li')).toHaveCount(25);
    await expect(page.locator('#cc-brute-list li').nth(2)).toContainText(
      'Hello, World!',
    );
  });

  test('ROT13に切り替えるとシフト欄と総当たりが隠れる', async ({ page }) => {
    await page.goto('/tools/classical-cipher/');

    await page.locator('#cc-method').selectOption('rot13');
    await page.locator('#cc-input').fill('Hello');
    await expect(page.locator('#cc-output')).toHaveValue('Uryyb');
    await expect(page.locator('#cc-shift-field')).toBeHidden();
    await expect(page.locator('#cc-brute')).toBeHidden();
  });

  test('ヴィジュネル暗号で鍵が空ならエラー、鍵を入れると変換される', async ({
    page,
  }) => {
    await page.goto('/tools/classical-cipher/');

    await page.locator('#cc-method').selectOption('vigenere');
    await page.locator('#cc-input').fill('ATTACKATDAWN');
    await expect(page.locator('#cc-error')).toBeVisible();

    await page.locator('#cc-key').fill('LEMON');
    await expect(page.locator('#cc-output')).toHaveValue('LXFOPVEFRNHR');
    await expect(page.locator('#cc-error')).toBeHidden();
  });

  test('アトバシュ暗号とコピー', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/classical-cipher/');

    await page.locator('#cc-method').selectOption('atbash');
    await page.locator('#cc-input').fill('abc');
    await expect(page.locator('#cc-output')).toHaveValue('zyx');

    await page.locator('#cc-copy-button').click();
    await expect(page.locator('#cc-status')).toHaveText('コピーしました');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      'zyx',
    );
  });
});

test.describe('Classical cipher tool (English)', () => {
  test('英語版でシーザー暗号が動作する', async ({ page }) => {
    await page.goto('/en/tools/classical-cipher/');

    await page.locator('#cc-input').fill('abc');
    await expect(page.locator('#cc-output')).toHaveValue('def');
    await expect(page.locator('#cc-brute-list li').first()).toContainText(
      'Shift 1',
    );
  });
});

test.describe('古典暗号変換（追加）', () => {
  test('入力と方式は再読み込みで復元される', async ({ page }) => {
    await page.goto('/tools/classical-cipher/');
    await page.locator('#cc-method').selectOption('rot13');
    await page.locator('#cc-input').fill('Hello');
    await expect
      .poll(() =>
        page.evaluate(() =>
          sessionStorage.getItem('nyanko:input:classical-cipher'),
        ),
      )
      .toContain('Hello');
    await page.reload();
    await expect(page.locator('#cc-method')).toHaveValue('rot13');
    await expect(page.locator('#cc-output')).toHaveValue('Uryyb');
  });

  test('絵文字・サロゲートペアを含む入力でも壊れない', async ({ page }) => {
    await page.goto('/tools/classical-cipher/');
    await page.locator('#cc-method').selectOption('rot47');
    await page.locator('#cc-input').fill('😀Hi');
    await expect(page.locator('#cc-output')).toHaveValue('😀w:');
  });
});
