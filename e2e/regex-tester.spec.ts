import { test, expect } from './helpers/test';

for (const [locale, base, matchText, timeoutText] of [
  [
    'ja',
    '/tools/regex-tester/',
    '2件マッチしました。',
    '処理に時間がかかりすぎた',
  ],
  ['en', '/en/tools/regex-tester/', '2 matches found.', 'took too long'],
] as const) {
  test.describe(`正規表現テスター (${locale})`, () => {
    test('パターンに一致した箇所が件数・ハイライトで表示される', async ({
      page,
    }) => {
      await page.goto(base);
      await page.locator('#regex-test-input').fill('cat bat rat');
      await page.locator('#regex-pattern-input').fill('[cb]at');

      await expect(page.locator('#regex-status')).toHaveText(matchText);
      await expect(page.locator('#regex-highlight mark')).toHaveCount(2);
      await expect(page.locator('#regex-matches-body tr')).toHaveCount(2);
    });

    test('置換結果が表示される', async ({ page }) => {
      await page.goto(base);
      await page.locator('#regex-test-input').fill('cat bat rat');
      await page.locator('#regex-pattern-input').fill('[cb]at');
      await page.locator('#regex-replacement-input').fill('X');

      await expect(page.locator('#regex-replace-result')).toHaveValue(
        'X X rat',
      );
    });

    test('不正なパターンはエラーが表示される', async ({ page }) => {
      await page.goto(base);
      await page.locator('#regex-test-input').fill('abc');
      await page.locator('#regex-pattern-input').fill('(');

      await expect(page.locator('#regex-error')).toBeVisible();
    });

    test('破滅的バックトラッキングのパターンでも画面が固まらず、中断メッセージが出る', async ({
      page,
    }) => {
      await page.goto(base);
      await page.locator('#regex-test-input').fill('a'.repeat(40) + '!');
      await page.locator('#regex-pattern-input').fill('(a+)+$');

      await expect(page.locator('#regex-error')).toContainText(timeoutText, {
        timeout: 15000,
      });

      // 固まった処理を破棄したあとも、別のパターンに直せばすぐ結果が出る
      await page.locator('#regex-pattern-input').fill('a{2}');
      await expect(page.locator('#regex-error')).toBeHidden();
      await expect(page.locator('#regex-status')).not.toHaveText('');
    });

    test('Worker の読み込みでコンソールエラー（CSP違反等）が出ない', async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      page.on('pageerror', (e) => errors.push(String(e)));
      await page.goto(base);
      await page.locator('#regex-test-input').fill('abc');
      await page.locator('#regex-pattern-input').fill('b');
      await expect(page.locator('#regex-highlight mark')).toHaveCount(1);
      expect(errors).toEqual([]);
    });

    test('フラグの切り替えで大文字小文字区別が変わる', async ({ page }) => {
      await page.goto(base);
      await page.locator('#regex-test-input').fill('Cat BAT rat');
      await page.locator('#regex-pattern-input').fill('cat');

      // デフォルトではマッチしない（大文字小文字を区別）
      await expect(page.locator('#regex-status')).toContainText(
        locale === 'ja' ? '0件' : '0 match',
      );

      // i フラグを有効にするとマッチする
      await page.locator('#regex-flag-i').click();
      await expect(page.locator('#regex-status')).toContainText(
        locale === 'ja' ? '1件' : '1 match',
      );
      await expect(page.locator('#regex-highlight mark')).toHaveCount(1);
    });

    test('Worker が使えない環境ではエラーメッセージが表示され、固まらない', async ({
      page,
    }) => {
      const noWorkerText = locale === 'ja' ? 'Web Worker' : 'Web Worker';

      // Worker コンストラクタを削除して、Worker が使えない環境をシミュレート
      await page.addInitScript(() => {
        (window as unknown as Record<string, unknown>).Worker = undefined;
      });

      await page.goto(base);
      await page.locator('#regex-test-input').fill('test');
      await page.locator('#regex-pattern-input').fill('t');

      // エラーメッセージが表示される
      const errorEl = page.locator('#regex-error');
      await expect(errorEl).toBeVisible({ timeout: 5000 });
      await expect(errorEl).toContainText(noWorkerText);

      // 画面は固まらず、操作可能
      await page.locator('#regex-pattern-input').fill('s');
      await expect(errorEl).toBeVisible();
      // ハイライトはしない（エラー状態なので）
      await expect(page.locator('#regex-highlight')).toContainText('test');
    });
  });
}
