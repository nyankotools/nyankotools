import type { Page } from '@playwright/test';
import { test, expect } from './helpers/test';

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
    // スクリプト読み込み後、エラーが表示されないことを確認（同一 URL では通知しない仕様）
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
    // ページ外由来の拒否ではトーストが表示されないことを確認
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

test.describe('コマンドパレット（追加）', () => {
  test('パレット表示中の Ctrl+Enter では遷移もツールの実行もしない', async ({
    page,
  }) => {
    await page.goto('/tools/uuid-generator/');
    const before = await page.locator('#uuid-generator-output').inputValue();
    await page.keyboard.press('Control+k');
    await page.keyboard.press('Control+Enter');
    // ページ URL が確認されるまで待つ（自動リトライ）
    await expect(page).toHaveURL(/\/tools\/uuid-generator\/$/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#uuid-generator-output')).toHaveValue(before);
  });

  test('候補のタップ領域が44px以上ある（375px）', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/');
    await page.locator('[data-palette-open]').evaluate((el) => {
      (el as HTMLElement).click();
    });
    const h = await page
      .locator('#palette-list [role=option]')
      .first()
      .evaluate((el) => el.getBoundingClientRect().height);
    expect(h).toBeGreaterThanOrEqual(44);
  });
});

test.describe('URLクエリ（全対象ツール）', () => {
  const targets: Record<string, string> = {
    'char-counter': '#char-counter-input',
    'zenkaku-hankaku': '#zenkaku-hankaku-input',
    'kana-converter': '#kana-converter-input',
    'html-escape': '#html-escape-input',
    'line-ending-converter': '#lec-input',
    'text-case-converter': '#text-case-input',
    'text-list-tools': '#tlt-input',
    'qr-generator': '#qr-generator-input',
    'kishu-izon-checker': '#kishu-izon-input',
  };
  for (const [slug, sel] of Object.entries(targets)) {
    test(`${slug}: 反映・HTMLとして解釈しない・5001文字は無視・textだけ消す`, async ({
      page,
    }) => {
      const xss = '<img src=x onerror=alert(1)>';
      await page.goto(
        `/tools/${slug}/?text=${encodeURIComponent(xss)}&utm_source=x#h`,
      );
      await expect(page.locator(sel)).toHaveValue(xss);
      expect(new URL(page.url()).search).toBe('?utm_source=x');
      expect(new URL(page.url()).hash).toBe('#h');
      // 保存のデバウンス完了を待つ（debounce タイミングの確実な確認のため保持）
      await page.waitForTimeout(400);
      await page.evaluate(() => sessionStorage.clear());
      await page.goto(`/tools/${slug}/?text=${'a'.repeat(5001)}`);
      await expect(page.locator(sel)).toHaveValue('');
      expect(new URL(page.url()).search).toBe('');
    });
  }

  for (const path of ['/', '/tools/category/text/', '/about/']) {
    test(`ツール以外のページ ${path} でも text が消える`, async ({ page }) => {
      await page.goto(`${path}?text=secret&utm_source=x`);
      await expect.poll(() => new URL(page.url()).search).toBe('?utm_source=x');
    });
  }
});

test.describe('コマンドパレットのツール登録簿の遅延読み込み', () => {
  // トップは自身のスクリプトが登録簿を静的に読むため、登録簿を読まないツールページで確認する
  const emptyText = {
    '/tools/char-counter/': '該当するツールがありません',
    '/en/tools/char-counter/': 'No matching tools',
  } as const;

  for (const path of [
    '/tools/char-counter/',
    '/en/tools/char-counter/',
  ] as const) {
    test(`${path}: 登録簿の読み込み中は「該当なし」を出さず、読み込み後に出す`, async ({
      page,
    }) => {
      let held = false;
      let release!: () => void;
      const gate = new Promise<void>((resolve) => (release = resolve));
      // 登録簿チャンク（tools.*.js）の取得を保留して、読み込み中の表示を確認する
      await page.route('**/_astro/tools.*.js', async (route) => {
        held = true;
        await gate;
        await route.continue();
      });
      await page.goto(path);
      await page.keyboard.press('Control+k');
      await expect(page.locator('#command-palette')).toBeVisible();
      await page.locator('#palette-input').fill('zzzzzz');
      await expect.poll(() => held).toBe(true);
      await expect(page.locator('#palette-empty')).toBeHidden();
      await expect(page.locator('#palette-list [role="option"]')).toHaveCount(
        0,
      );

      release();
      await expect(page.locator('#palette-empty')).toBeVisible();
      await expect(page.locator('#palette-empty')).toContainText(
        emptyText[path],
      );
    });
  }

  test('読み込みに失敗しても「該当なし」は出ず、次に開いたときに再試行して結果が出る', async ({
    page,
  }) => {
    let attempts = 0;
    await page.route('**/_astro/tools.*.js', async (route) => {
      attempts += 1;
      if (attempts === 1) await route.abort();
      else await route.continue();
    });
    await page.goto('/tools/char-counter/');
    await page.keyboard.press('Control+k');
    await page.locator('#palette-input').fill('文字数');
    await expect.poll(() => attempts).toBe(1);
    await expect(page.locator('#palette-empty')).toBeHidden();
    await page.keyboard.press('Escape');
    await expect(page.locator('#command-palette')).toBeHidden();

    await page.keyboard.press('Control+k');
    await expect(page.locator('#palette-input')).toHaveValue('');
    await page.locator('#palette-input').fill('文字数');
    await expect(
      page.locator('#palette-list [role="option"]').first(),
    ).toHaveText(/文字数カウント/);
    expect(attempts).toBe(2);
  });
});

test.describe('お気に入りとツール一覧の同期（ja/en）', () => {
  const gridSlugs = (page: Page): Promise<string[]> =>
    page
      .locator('#tool-grid [data-tool-slug]')
      .evaluateAll((els) =>
        els.map((el) => (el as HTMLElement).dataset.toolSlug ?? ''),
      );

  for (const path of ['/', '/en/'] as const) {
    test(`${path}: サイドバーのお気に入り名はツール一覧の名前と一致する`, async ({
      page,
    }) => {
      await page.goto(path);
      const slugs = ['html-escape', 'char-counter', 'base64'];
      for (const slug of slugs) {
        await page
          .locator(
            `[data-tool-slug="${slug}"] [data-favorite-toggle="${slug}"]`,
          )
          .click();
      }
      const favLinks = await page
        .locator('#sidebar-favorites-list a')
        .evaluateAll((els) =>
          els.map((a) => ({
            href: a.getAttribute('href'),
            text: (a.textContent ?? '').trim(),
          })),
        );
      expect(favLinks).toHaveLength(slugs.length);
      const categoryNames = await page
        .locator('nav details[data-category] ul a')
        .evaluateAll((els) =>
          Object.fromEntries(
            els.map((a) => [
              a.getAttribute('href'),
              (a.textContent ?? '').trim(),
            ]),
          ),
        );
      for (const link of favLinks) {
        expect(link.text).not.toBe('');
        expect(link.text).toBe(categoryNames[link.href ?? '']);
      }
    });

    test(`${path}: お気に入りはトップのグリッドの先頭に来て、解除すると元の順に戻る（リロード後も同じ）`, async ({
      page,
    }) => {
      await page.goto(path);
      const original = await gridSlugs(page);
      expect(original.length).toBeGreaterThan(3);

      const fav = ['password-generator', 'char-counter'];
      for (const slug of fav) {
        await page
          .locator(
            `[data-tool-slug="${slug}"] [data-favorite-toggle="${slug}"]`,
          )
          .click();
      }
      const rest = original.filter((s) => !fav.includes(s));
      await expect.poll(() => gridSlugs(page)).toEqual([...fav, ...rest]);

      await page.reload();
      await expect.poll(() => gridSlugs(page)).toEqual([...fav, ...rest]);

      for (const slug of fav) {
        await page
          .locator(
            `[data-tool-slug="${slug}"] [data-favorite-toggle="${slug}"]`,
          )
          .click();
      }
      await expect.poll(() => gridSlugs(page)).toEqual(original);
    });
  }

  test('ja: サイドバーで並べ替えると、トップのグリッドの先頭も同じ順になる', async ({
    page,
  }) => {
    await page.goto('/');
    const original = await gridSlugs(page);
    await page
      .locator(
        '[data-tool-slug="password-generator"] [data-favorite-toggle="password-generator"]',
      )
      .click();
    await page
      .locator(
        '[data-tool-slug="char-counter"] [data-favorite-toggle="char-counter"]',
      )
      .click();
    const rest = original.filter(
      (s) => s !== 'password-generator' && s !== 'char-counter',
    );
    await expect
      .poll(() => gridSlugs(page))
      .toEqual(['password-generator', 'char-counter', ...rest]);

    // 2番目（char-counter）を上に移動 → グリッドの先頭も char-counter になる
    await page
      .locator('#sidebar-favorites-list li')
      .nth(1)
      .getByLabel('上に移動')
      .click();
    await expect
      .poll(() => gridSlugs(page))
      .toEqual(['char-counter', 'password-generator', ...rest]);
  });
});
