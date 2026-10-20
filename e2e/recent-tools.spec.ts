import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test.describe('最近使ったツール', () => {
  test('ツールページを開くとトップに新しい順で表示され、リンクから開ける', async ({
    page,
  }) => {
    await page.goto('/');
    // 履歴がない間は表示しない
    await expect(page.locator('#home-recent')).toBeHidden();

    await page.goto('/tools/base64/');
    await page.goto('/tools/char-counter/');
    await page.goto('/');

    const chips = page.locator('#home-recent [data-recent-list] a');
    await expect(page.locator('#home-recent')).toBeVisible();
    await expect(chips).toHaveCount(2);
    await expect(chips.first()).toHaveAttribute('href', '/tools/char-counter/');
    await expect(chips.nth(1)).toHaveAttribute('href', '/tools/base64/');

    await chips.nth(1).click();
    await expect(page).toHaveURL(/\/tools\/base64\/$/);
  });

  test('同じツールを開き直しても重複せず先頭に移る', async ({ page }) => {
    await page.goto('/tools/base64/');
    await page.goto('/tools/char-counter/');
    await page.goto('/tools/base64/');
    await page.goto('/');

    const chips = page.locator('#home-recent [data-recent-list] a');
    await expect(chips).toHaveCount(2);
    await expect(chips.first()).toHaveAttribute('href', '/tools/base64/');
  });

  test('検索で絞り込み中は隠れ、クリアすると戻る', async ({ page }) => {
    await page.goto('/tools/base64/');
    await page.goto('/');
    await expect(page.locator('#home-recent')).toBeVisible();

    await page.locator('#tool-search').fill('json');
    await expect(page.locator('#home-recent')).toBeHidden();

    await page.locator('#tool-search').fill('');
    await expect(page.locator('#home-recent')).toBeVisible();
  });

  test('英語版では /en/ のリンクで表示される', async ({ page }) => {
    await page.goto('/en/tools/base64/');
    await page.goto('/en/');

    const chip = page.locator('#home-recent [data-recent-list] a').first();
    await expect(chip).toHaveAttribute('href', '/en/tools/base64/');
  });

  test('コマンドパレットの空クエリでは最近使ったツールが先頭に出る', async ({
    page,
  }) => {
    await page.goto('/tools/uuid-generator/');
    await page.goto('/tools/base64/');
    await page.goto('/tools/char-counter/');

    await page.keyboard.press('Control+k');
    const options = page.locator('#palette-list [role="option"]');
    await expect(options.first()).toBeVisible();
    // 表示中の char-counter 自身は除き、直前に使った順に並ぶ
    await expect(options.nth(0)).toHaveAttribute('data-href', '/tools/base64/');
    await expect(options.nth(1)).toHaveAttribute(
      'data-href',
      '/tools/uuid-generator/',
    );
  });

  test('9件目を開くと最古の1件が履歴から落ちる（上限8件）', async ({
    page,
  }) => {
    const slugs = [
      'base64',
      'char-counter',
      'uuid-generator',
      'json-formatter',
      'url-encode',
      'hash-generator',
      'lorem-ipsum',
      'unix-timestamp',
      'regex-tester',
    ];
    for (const slug of slugs) {
      await page.goto(`/tools/${slug}/`);
    }
    await page.goto('/');

    const chips = page.locator('#home-recent [data-recent-list] a');
    await expect(chips).toHaveCount(8);
    await expect(chips.first()).toHaveAttribute('href', '/tools/regex-tester/');
    await expect(chips.last()).toHaveAttribute('href', '/tools/char-counter/');
    await expect(
      page.locator('#home-recent [data-recent-list] a[href="/tools/base64/"]'),
    ).toHaveCount(0);
  });

  test('localStorageの値が壊れていてもトップは落ちず、不正な要素は無視される', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.addInitScript(() => {
      localStorage.setItem('recent-tools', '{oops');
    });
    await page.goto('/');
    await expect(page.locator('#tool-grid')).toBeVisible();
    await expect(page.locator('#home-recent')).toBeHidden();
    expect(errors).toEqual([]);

    await page.addInitScript(() => {
      localStorage.setItem(
        'recent-tools',
        '[1,null,"no-such-tool","base64",{"x":1}]',
      );
    });
    await page.goto('/');
    const chips = page.locator('#home-recent [data-recent-list] a');
    await expect(chips).toHaveCount(1);
    await expect(chips.first()).toHaveAttribute('href', '/tools/base64/');
    expect(errors).toEqual([]);
  });

  test('英語版の見出しは「Recently used」で表示される', async ({ page }) => {
    await page.goto('/en/tools/base64/');
    await page.goto('/en/');
    await expect(page.locator('#home-recent h2')).toHaveText('Recently used');
  });

  test('お気に入りと最近使ったツールが同時に表示される', async ({ page }) => {
    await page.goto('/tools/base64/');
    await page.goto('/');
    await page
      .locator(
        '[data-tool-slug="char-counter"] [data-favorite-toggle="char-counter"]',
      )
      .click();
    await expect(page.locator('#home-favorites')).toBeVisible();
    await expect(page.locator('#home-recent')).toBeVisible();
    await expect(
      page.locator('#home-recent [data-recent-list] a').first(),
    ).toHaveAttribute('href', '/tools/base64/');
  });

  test.describe('375pxの表示', () => {
    test.use({ viewport: { width: 375, height: 800 } });

    test('履歴8件でもトップは横スクロールせず、チップは44px以上の高さ', async ({
      page,
    }) => {
      const slugs = [
        'base64',
        'char-counter',
        'uuid-generator',
        'json-formatter',
        'url-encode',
        'hash-generator',
        'lorem-ipsum',
        'unix-timestamp',
      ];
      for (const slug of slugs) {
        await page.goto(`/tools/${slug}/`);
      }
      await page.goto('/');
      await expect(page.locator('#home-recent')).toBeVisible();

      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);

      const chips = page.locator('#home-recent [data-recent-list] a');
      await expect(chips).toHaveCount(8);
      for (let i = 0; i < 8; i++) {
        const box = await chips.nth(i).boundingBox();
        expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
      }
    });
  });

  test.describe('ダークモード', () => {
    test.use({ colorScheme: 'dark' });

    test('チップを含むトップでaxe（WCAG 2.x A/AA）の違反がない', async ({
      page,
    }) => {
      await page.goto('/tools/base64/');
      await page.goto('/');
      await expect(page.locator('#home-recent')).toBeVisible();
      await expect(page.locator('html')).toHaveClass(/(^|\s)dark(\s|$)/);

      const results = await new AxeBuilder({ page })
        .include('#home-recent')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(
        results.violations.map((v) => `${v.id}: ${v.nodes.length}`),
      ).toEqual([]);
    });
  });
});
