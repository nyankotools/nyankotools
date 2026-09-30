import { test, expect } from '@playwright/test';

// サイト機能 Step 3: バッジ（No.150）・ショートカット（No.151）・コマンドパレット（No.152）・
// URLクエリ初期値（No.153）・カテゴリ別LP（No.154）・エラー境界（No.175）

test.describe('ブラウザ内完結バッジ', () => {
  test('ツールページにja/enでバッジが表示される', async ({ page }) => {
    await page.goto('/tools/char-counter/');
    await expect(page.locator('[data-local-badge]')).toContainText(
      'サーバーに送信されません',
    );
    await page.goto('/en/tools/char-counter/');
    await expect(page.locator('[data-local-badge]')).toContainText(
      'never sent to a server',
    );
  });
});

test.describe('コマンドパレット', () => {
  test('Ctrl+K で開き、絞り込んで Enter でツールへ遷移する', async ({
    page,
  }) => {
    await page.goto('/');
    await page.keyboard.press('Control+k');
    const dialog = page.locator('#command-palette');
    await expect(dialog).toBeVisible();
    await expect(page.locator('#palette-input')).toBeFocused();

    await page.locator('#palette-input').fill('文字数');
    await expect(
      page.locator('#palette-list [role="option"]').first(),
    ).toHaveText(/文字数カウント/);
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/tools\/char-counter\/$/);
  });

  test('Esc で閉じ、一致なしなら空メッセージを表示する', async ({ page }) => {
    await page.goto('/en/');
    await page.keyboard.press('Control+k');
    await page.locator('#palette-input').fill('zzzzzz');
    await expect(page.locator('#palette-empty')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#command-palette')).toBeHidden();
  });

  test('サイドバーのボタンからも開け、enでは/en/のURLへ遷移する', async ({
    page,
  }) => {
    await page.goto('/en/');
    await page.locator('[data-palette-open]').click();
    await page.locator('#palette-input').fill('base64');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/en\/tools\/base64\/$/);
  });
});

test.describe('ショートカット', () => {
  test('Alt+Shift+C でコピーボタンが押される', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/html-escape/');
    await page.locator('#html-escape-input').fill('<b>');
    await page.keyboard.press('Alt+Shift+C');
    await expect(page.locator('#html-escape-status')).not.toBeEmpty();
    await expect(
      page.evaluate(() => navigator.clipboard.readText()),
    ).resolves.toContain('&lt;b&gt;');
  });

  test('Ctrl+Enter で主ボタンが押される', async ({ page }) => {
    await page.goto('/tools/uuid-generator/');
    const before = await page.locator('#uuid-generator-output').inputValue();
    await page.locator('main').click({ position: { x: 5, y: 5 } });
    await page.keyboard.press('Control+Enter');
    await expect(page.locator('#uuid-generator-output')).not.toHaveValue(
      before,
    );
  });
});

test.describe('URLクエリ初期値', () => {
  test('?text= が対象ツールの入力欄に入り、結果が更新される', async ({
    page,
  }) => {
    await page.goto('/tools/char-counter/?text=hello');
    await expect(page.locator('#char-counter-input')).toHaveValue('hello');
    await expect(page.locator('#char-counter-characters')).toHaveText('5');
  });

  test('日本語（エンコード済み）も渡せる', async ({ page }) => {
    await page.goto('/tools/char-counter/?text=%E3%81%82%E3%81%84');
    await expect(page.locator('#char-counter-input')).toHaveValue('あい');
  });

  test('読み込み後はURLからクエリが消える', async ({ page }) => {
    await page.goto('/tools/char-counter/?text=hello');
    await expect(page.locator('#char-counter-input')).toHaveValue('hello');
    await expect(page).toHaveURL(/\/tools\/char-counter\/$/);
  });

  test('utm_* は残し、機微ツールでもtextはURLから消える', async ({ page }) => {
    await page.goto('/tools/char-counter/?text=hello&utm_source=x');
    await expect(page.locator('#char-counter-input')).toHaveValue('hello');
    await expect(page).toHaveURL(/\/tools\/char-counter\/\?utm_source=x$/);

    await page.goto('/tools/base64/?text=secret');
    await expect(page.locator('textarea').first()).toHaveValue('');
    await expect(page).toHaveURL(/\/tools\/base64\/$/);
  });

  test('入力をHTMLとして描画するツール（markdown-preview）では無視する', async ({
    page,
  }) => {
    await page.goto('/tools/markdown-preview/?text=%3Cb%3Ex%3C%2Fb%3E');
    await expect(page.locator('#markdown-preview-input')).toHaveValue('');
  });

  test('機微ツール（base64）ではクエリを無視する', async ({ page }) => {
    await page.goto('/tools/base64/?text=secret');
    await expect(page.locator('textarea').first()).toHaveValue('');
  });
});

test.describe('カテゴリ別ランディングページ', () => {
  test('ja/en のカテゴリ一覧にツールへのリンクが並ぶ', async ({ page }) => {
    await page.goto('/tools/category/pdf/');
    await expect(page.locator('main h1')).toHaveText('PDFのツール一覧');
    await expect(
      page.locator('main a[href="/tools/pdf-compressor/"]'),
    ).toBeVisible();
    await expect(page.locator('main a[href="/tools/base64/"]')).toHaveCount(0);

    await page.goto('/en/tools/category/pdf/');
    await expect(page.locator('main h1')).toHaveText('PDF Tools');
    await expect(
      page.locator('main a[href="/en/tools/pdf-compressor/"]'),
    ).toBeVisible();
  });

  test('トップにカテゴリ別一覧へのリンクがある', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.locator('a[href="/tools/category/pdf/"]').last(),
    ).toBeVisible();
  });

  test('375px で横スクロールが出ない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/tools/category/image/');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow).toBe(false);
  });
});

test.describe('エラー境界', () => {
  test('自サイトのスクリプト由来の未処理Promise拒否で通知が出て、閉じたら再表示しない', async ({
    page,
  }) => {
    await page.route('**/boom.js*', (route) =>
      route.fulfill({
        contentType: 'application/javascript',
        body: 'Promise.reject(new Error("boom"));',
      }),
    );
    await page.goto('/tools/char-counter/');
    await expect(page.locator('#error-toast')).toBeHidden();
    await page.addScriptTag({ url: '/boom.js' });
    await expect(page.locator('#error-toast')).toBeVisible();
    await page.locator('#error-toast-close').click();
    await expect(page.locator('#error-toast')).toBeHidden();
    await page.addScriptTag({ url: '/boom.js?again' });
    await page.waitForTimeout(300);
    await expect(page.locator('#error-toast')).toBeHidden();
  });

  test('ページ外（拡張機能など）由来と分かる拒否では通知しない', async ({
    page,
  }) => {
    await page.goto('/tools/char-counter/');
    await page.evaluate(() => {
      void Promise.reject(new Error('from extension'));
    });
    await page.waitForTimeout(300);
    await expect(page.locator('#error-toast')).toBeHidden();
  });
});

test.describe('ツールページのレイアウト', () => {
  test('フッターはツール本体より下に表示される（トップのグリッド並べ替えと干渉しない）', async ({
    page,
  }) => {
    await page.goto('/tools/char-counter/');
    const footerY = await page
      .locator('main > footer')
      .evaluate((el) => el.getBoundingClientRect().y);
    const h1Y = await page
      .locator('main h1')
      .evaluate((el) => el.getBoundingClientRect().y);
    expect(footerY).toBeGreaterThan(h1Y);
    await expect(page.locator('main > *').last()).toHaveJSProperty(
      'tagName',
      'FOOTER',
    );
  });
});

test.describe('GA4 グローバル gtag', () => {
  test('window.gtag が定義され、dataLayer には Arguments が積まれる', async ({
    page,
  }) => {
    await page.route('https://www.googletagmanager.com/**', (route) =>
      route.abort(),
    );
    await page.goto('/tools/char-counter/?text=hi&utm_source=x');
    const info = await page.evaluate(() => {
      const w = window as unknown as {
        gtag?: unknown;
        dataLayer?: unknown[];
      };
      return {
        type: typeof w.gtag,
        kinds: (w.dataLayer ?? []).map((e) =>
          Object.prototype.toString.call(e),
        ),
        config: JSON.stringify(
          Array.from((w.dataLayer?.[1] ?? []) as ArrayLike<unknown>),
        ),
      };
    });
    expect(info.type).toBe('function');
    expect(info.kinds.every((k) => k === '[object Arguments]')).toBe(true);
    expect(info.config).toContain('utm_source=x');
    expect(info.config).not.toContain('text=hi');
  });
});
