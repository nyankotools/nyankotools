import { test, expect, type Page } from './helpers/test';
import { tools } from '../src/data/tools';

// トップページ（/）のカテゴリフィルタが、新しい9分類で正しく表示され、
// 375px幅での横はみ出しがないことを確認する。

test.describe('ホームページのカテゴリフィルタ', () => {
  test('ja: 10個のカテゴリフィルタボタンがすべて表示される', async ({
    page,
  }) => {
    await page.goto('/');

    const expectedCategories = [
      'テキスト',
      'データ変換',
      'エンコード/デコード',
      '日付・時間',
      '計算',
      '画像・デザイン',
      'PDF',
      '開発',
      '生成',
      'カメラ',
    ];

    for (const category of expectedCategories) {
      const button = page.locator(`button:has-text("${category}")`).first();
      await expect(button).toBeVisible({ timeout: 5000 });
    }
  });

  test('en: 10個のカテゴリフィルタボタンがすべて表示される', async ({
    page,
  }) => {
    await page.goto('/en/');

    const expectedCategories = [
      'Text',
      'Data Formats',
      'Encode/Decode',
      'Date & Time',
      'Calculate',
      'Image & Design',
      'PDF',
      'Development',
      'Generate',
      'Camera',
    ];

    for (const category of expectedCategories) {
      const button = page.locator(`button:has-text("${category}")`).first();
      await expect(button).toBeVisible({ timeout: 5000 });
    }
  });

  test('ja: カテゴリフィルタが375px幅で横スクロールしない', async ({
    page,
  }) => {
    // 375px幅のビューポートでテスト
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');

    // ページ全体の水平スクロールがないことを確認
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    const clientWidth = await page.evaluate(
      () => document.documentElement.clientWidth,
    );
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('en: カテゴリフィルタが375px幅で横スクロールしない', async ({
    page,
  }) => {
    // 375px幅のビューポートでテスト
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/en/');

    // ページ全体の水平スクロールがないことを確認
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    const clientWidth = await page.evaluate(
      () => document.documentElement.clientWidth,
    );
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('ja: カテゴリボタンが存在してクリック可能', async ({ page }) => {
    await page.goto('/');

    // 「画像・デザイン」カテゴリボタンが存在することを確認
    const categoryButton = page
      .locator('button:has-text("画像・デザイン")')
      .first();
    await expect(categoryButton).toBeEnabled();

    // ボタンをクリック可能であることを確認
    await categoryButton.click({ timeout: 5000 });
  });
});

test.describe('ホームページの検索（keywords・表記ゆれ）', () => {
  test('ja: keywords・全角入力で検索でき、該当なしで見つかりません表示', async ({
    page,
  }) => {
    await page.goto('/');
    const search = page.locator('#tool-search');
    const card = (slug: string) => page.locator(`[data-tool-slug="${slug}"]`);

    await search.fill('クロン');
    await expect(card('cron-parser')).toBeVisible();

    await search.fill('パスワード解除');
    await expect(card('pdf-page-editor')).toBeVisible();
    await expect(card('pdf-password-protector')).toBeHidden();

    await search.fill('ＪＳＯＮ');
    await expect(card('json-formatter')).toBeVisible();

    await search.fill('zzqxjk該当なし');
    await expect(page.locator('#no-results')).toBeVisible();

    await search.fill('　');
    await expect(page.locator('[data-tool-slug]:not([hidden])')).toHaveCount(
      tools.length,
    );
  });

  test('旧形式（日本語名）の sidebar-open-categories でもエラーが出ない', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/');
    await page.evaluate(() =>
      localStorage.setItem('sidebar-open-categories', '["テキスト","計算"]'),
    );
    await page.goto('/tools/uuid-generator/');
    await expect(
      page.locator('nav details[data-category="generate"]'),
    ).toHaveAttribute('open', '');
    expect(errors).toEqual([]);
  });
});

// トップの絞り込み状態（?q=検索語&c=カテゴリ）と、カテゴリ行の横スクロール（ドラッグ・端フェード）の確認。
const homePages = [
  { lang: 'ja', path: '/', toolPath: '/tools/' },
  { lang: 'en', path: '/en/', toolPath: '/en/tools/' },
] as const;

const dataSlugs = tools.filter((t) => t.category === 'data').map((t) => t.slug);
const devSlugs = tools.filter((t) => t.category === 'dev').map((t) => t.slug);

async function visibleSlugs(page: Page): Promise<string[]> {
  return page
    .locator('[data-tool-slug]:not([hidden])')
    .evaluateAll((els) =>
      els.map((el) => (el as HTMLElement).dataset.toolSlug ?? ''),
    );
}

function pressedFilter(page: Page) {
  return page.locator('[data-category-filter][aria-pressed="true"]');
}

for (const { lang, path, toolPath } of homePages) {
  test.describe(`${lang}: トップの絞り込みURL（?q= / ?c=）`, () => {
    test('クエリから検索語・カテゴリ・カード表示が復元される', async ({
      page,
    }) => {
      await page.goto(`${path}?q=json&c=data`);

      await expect(page.locator('#tool-search')).toHaveValue('json');
      await expect(pressedFilter(page)).toHaveCount(1);
      await expect(
        page.locator('[data-category-filter="data"]'),
      ).toHaveAttribute('aria-pressed', 'true');
      await expect(
        page.locator('[data-category-filter="all"]'),
      ).toHaveAttribute('aria-pressed', 'false');

      const visible = await visibleSlugs(page);
      expect(visible).toContain('json-formatter');
      // 表示されるのは data カテゴリのツールだけ
      for (const slug of visible) {
        expect(dataSlugs).toContain(slug);
      }
      expect(visible.length).toBeLessThan(tools.length);
    });

    test('不正な c（存在しないID・プロトタイプ名）は無視され、全件表示のまま', async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));

      for (const c of ['bogus', 'constructor']) {
        await page.goto(`${path}?c=${c}`);
        await expect(
          page.locator('[data-category-filter="all"]'),
        ).toHaveAttribute('aria-pressed', 'true');
        await expect(pressedFilter(page)).toHaveCount(1);
        expect(await visibleSlugs(page)).toHaveLength(tools.length);
      }
      expect(errors).toEqual([]);
    });

    test('入力とクリックでURLが更新され、履歴は増えない', async ({ page }) => {
      await page.goto(path);
      const search = page.locator('#tool-search');
      const before = await page.evaluate(() => history.length);

      await search.pressSequentially('json');
      await expect(page).toHaveURL(/[?&]q=json(&|$)/);

      await page.locator('[data-category-filter="data"]').click();
      await expect(page).toHaveURL(/[?&]c=data/);
      await expect(page).toHaveURL(/[?&]q=json/);

      await page.locator('[data-category-filter="all"]').click();
      await expect(page).not.toHaveURL(/[?&]c=/);

      await page.locator('[data-category-filter="dev"]').click();
      await expect(page).toHaveURL(/[?&]c=dev/);

      expect(await page.evaluate(() => history.length)).toBe(before);
    });

    test('空白のみの検索語はURLに入らない', async ({ page }) => {
      await page.goto(path);
      await page.locator('#tool-search').fill('   ');
      await expect(page.locator('[data-tool-slug]:not([hidden])')).toHaveCount(
        tools.length,
      );
      expect(new URL(page.url()).searchParams.has('q')).toBe(false);
    });

    test('検索語を消して全件カテゴリに戻すとURLからクエリが消える', async ({
      page,
    }) => {
      await page.goto(`${path}?q=json&c=data`);
      await page.locator('#tool-search').fill('');
      await page.locator('[data-category-filter="all"]').click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
    });

    test('ツールページへ移動して戻っても絞り込みが保たれる', async ({
      page,
    }) => {
      await page.goto(path);
      await page.locator('#tool-search').pressSequentially('json');
      await page.locator('[data-category-filter="data"]').click();
      await page
        .locator('#tool-grid [data-tool-slug="json-formatter"] a')
        .click();
      await page.waitForURL(new RegExp(`${toolPath}json-formatter/`));

      await page.goBack();
      await expect(page).toHaveURL(/[?&]q=json/);
      await expect(page).toHaveURL(/[?&]c=data/);
      await expect(page.locator('#tool-search')).toHaveValue('json');
      await expect(
        page.locator('[data-category-filter="data"]'),
      ).toHaveAttribute('aria-pressed', 'true');
      expect(await visibleSlugs(page)).toContain('json-formatter');
    });

    test('GA の page_location から q と c が除かれ、他のパラメータは残る', async ({
      page,
    }) => {
      await page.goto(`${path}?q=secret&c=data&utm_source=test`);
      const config = await page.evaluate(() => {
        const w = window as unknown as { dataLayer?: ArrayLike<unknown>[] };
        const entry = (w.dataLayer ?? [])
          .map((e) => Array.from(e))
          .find((a) => a[0] === 'config');
        return entry ? (entry[2] as { page_location?: string }) : null;
      });
      expect(config?.page_location).toBeTruthy();
      const loc = new URL(config?.page_location ?? '');
      expect(loc.searchParams.has('q')).toBe(false);
      expect(loc.searchParams.has('c')).toBe(false);
      expect(loc.searchParams.get('utm_source')).toBe('test');
    });
  });

  test.describe(`${lang}: カテゴリ行の横スクロール`, () => {
    test('375px幅で行がビューポート内に収まり、復元時は選択中のボタンが見える', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(`${path}?c=camera`);
      const group = page.locator('[data-drag-scroll]');
      const groupBox = await group.boundingBox();
      expect(groupBox).not.toBeNull();
      expect(groupBox!.x).toBeGreaterThanOrEqual(0);
      expect(groupBox!.x + groupBox!.width).toBeLessThanOrEqual(375);

      const scrollable = await group.evaluate(
        (el) => el.scrollWidth > el.clientWidth,
      );
      expect(scrollable).toBe(true);

      const pressedBox = await pressedFilter(page).boundingBox();
      expect(pressedBox).not.toBeNull();
      expect(pressedBox!.x).toBeGreaterThanOrEqual(0);
      expect(pressedBox!.x + pressedBox!.width).toBeLessThanOrEqual(375);
    });

    test('マウスドラッグで横スクロールし、ドラッグ直後のクリックではカテゴリが切り替わらない', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(path);
      const group = page.locator('[data-drag-scroll]');
      const box = await group.boundingBox();
      expect(box).not.toBeNull();
      const y = box!.y + box!.height / 2;
      const startX = box!.x + box!.width - 16;

      await page.mouse.move(startX, y);
      await page.mouse.down();
      await page.mouse.move(startX - 60, y, { steps: 5 });
      await expect(group).toHaveClass(/cursor-grabbing/);
      await page.mouse.move(box!.x + 16, y, { steps: 10 });
      await page.mouse.up();

      expect(await group.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
      await expect(group).not.toHaveClass(/cursor-grabbing/);
      // ドラッグの結果、どのボタンの上で離しても選択は変わらない
      await expect(
        page.locator('[data-category-filter="all"]'),
      ).toHaveAttribute('aria-pressed', 'true');
      await expect(page).not.toHaveURL(/[?&]c=/);
    });

    test('ドラッグの後でも、通常のクリックではカテゴリが切り替わる', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(path);
      const group = page.locator('[data-drag-scroll]');
      const box = await group.boundingBox();
      const y = box!.y + box!.height / 2;

      await page.mouse.move(box!.x + box!.width - 16, y);
      await page.mouse.down();
      await page.mouse.move(box!.x + 16, y, { steps: 10 });
      await page.mouse.up();

      await page.locator('[data-category-filter="dev"]').click();
      await expect(
        page.locator('[data-category-filter="dev"]'),
      ).toHaveAttribute('aria-pressed', 'true');
      await expect(page).toHaveURL(/[?&]c=dev/);
      const visible = await visibleSlugs(page);
      expect(visible.length).toBeGreaterThan(0);
      for (const slug of visible) {
        expect(devSlugs).toContain(slug);
      }
    });

    test('スクロール可能なときだけ端フェード（mask-image）が付き、端に達すると状態が変わる', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(path);
      const group = page.locator('[data-drag-scroll]');

      const maskAtStart = await group.evaluate(
        (el) => getComputedStyle(el).maskImage,
      );
      expect(maskAtStart).toContain('linear-gradient');

      await group.evaluate((el) => {
        el.scrollLeft = el.scrollWidth;
      });
      await expect
        .poll(() => group.evaluate((el) => el.scrollLeft))
        .toBeGreaterThan(0);
      const maskAtEnd = await group.evaluate(
        (el) => getComputedStyle(el).maskImage,
      );
      expect(maskAtEnd).toContain('linear-gradient');
      expect(maskAtEnd).not.toBe(maskAtStart);
    });

    test('スクロール不要な幅ではフェードが付かない', async ({ page }) => {
      // 1920px でもサイドバー分の余白で行が収まりきらないため、十分広い幅で確認する
      await page.setViewportSize({ width: 2560, height: 1000 });
      await page.goto(path);
      const group = page.locator('[data-drag-scroll]');
      expect(
        await group.evaluate((el) => el.scrollWidth <= el.clientWidth),
      ).toBe(true);
      expect(await group.evaluate((el) => getComputedStyle(el).maskImage)).toBe(
        'none',
      );
    });
  });
}

test.describe('トップのお気に入りとの共存', () => {
  test('絞り込み中でもカード内のお気に入りボタンが動き、絞り込みは変わらない', async ({
    page,
  }) => {
    await page.goto('/?c=data');
    const card = page.locator('[data-tool-slug="json-formatter"]');
    await expect(card).toBeVisible();
    await card.locator('[data-favorite-toggle]').click();
    await expect(card.locator('[data-favorite-toggle]')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(page).toHaveURL(/[?&]c=data/);
  });
});
