import { test, expect, type Page } from './helpers/test';

// サイドバー上部（ロゴ・検索ボタン）の固定と、サイドバーのスクロール周りのCSSを確認する。
// 上部は Layout.astro で `[@media(min-height:600px)]:sticky top-0` が付いた要素で、
// 画面高さ600px未満では固定されず、通常のフローとしてリストと一緒にスクロールする。
// 固定される要素はスクロール要素 #sidebar 自身の中の要素なので、#sidebar のスクロールに追従する。

const HEADER = '#sidebar > div:first-child';

async function setTheme(page: Page, theme: 'light' | 'dark') {
  await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
}

// 上部ブロックの「サイドバー上端からのずれ」と、検索ボタンが
// サイドバーの表示領域に入っているかを返す
function measureHeader(page: Page) {
  return page.evaluate(() => {
    const sidebar = document.getElementById('sidebar');
    const header = sidebar?.firstElementChild as HTMLElement | null;
    if (!sidebar || !header) return null;
    const sr = sidebar.getBoundingClientRect();
    const hr = header.getBoundingClientRect();
    const switcher = document
      .querySelector('[data-palette-open]')
      ?.getBoundingClientRect();
    return {
      dTop: hr.top - sr.top,
      headerHeight: hr.height,
      switcherInside:
        !!switcher &&
        switcher.top >= sr.top &&
        switcher.bottom <= sr.bottom + 0.5,
      scrollTop: sidebar.scrollTop,
    };
  });
}

test.describe('サイドバー上部の固定（デスクトップ・高さ768px）', () => {
  test.use({ viewport: { width: 1024, height: 768 } });

  test('高さ600px以上では上部が sticky になり、リストをスクロールしても見え続ける', async ({
    page,
  }) => {
    await page.goto('/tools/char-counter/');
    const sidebar = page.locator('#sidebar');
    const header = page.locator(HEADER);

    await expect(header).toHaveCSS('position', 'sticky');
    await expect(header.locator('[data-palette-open]')).toBeVisible();

    // 固定が意味を持つには、リストが実際にスクロールできる必要がある
    const overflow = await sidebar.evaluate(
      (el) => el.scrollHeight - el.clientHeight,
    );
    expect(overflow).toBeGreaterThan(100);

    const before = await measureHeader(page);
    expect(before?.dTop).toBeCloseTo(0, 0);

    await sidebar.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });

    // スクロールされたあとも上部はサイドバーの先頭に留まり、検索ボタンが見えたまま
    await expect
      .poll(async () => (await measureHeader(page))?.scrollTop ?? 0)
      .toBeGreaterThan(100);
    await expect
      .poll(async () => (await measureHeader(page))?.dTop ?? -999)
      .toBeCloseTo(0, 0);
    expect((await measureHeader(page))?.switcherInside).toBe(true);
  });

  test('画面高さ600px未満では固定されず、リストと一緒にスクロールする', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 599 });
    await page.goto('/tools/char-counter/');
    const sidebar = page.locator('#sidebar');
    const header = page.locator(HEADER);

    await expect(header).toHaveCSS('position', 'static');

    await sidebar.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });
    // 通常フローなので、上部はサイドバーの上端より上へ流れて行く
    await expect
      .poll(async () => (await measureHeader(page))?.dTop ?? 0)
      .toBeLessThan(-50);
  });

  test('ライト/ダークとも上部の背景は不透明で、下のリスト項目を透かさない', async ({
    page,
  }) => {
    for (const theme of ['light', 'dark'] as const) {
      await setTheme(page, theme);
      await page.goto('/tools/char-counter/');
      const header = page.locator(HEADER);
      await expect(header).toHaveCSS('position', 'sticky');

      // Chromium の計算値は bg-white が rgb()、gray-900 が oklch() で返る。
      // 不透明なら alpha 指定（"/ a" や rgba）が付かない。明るさは rgb の平均、oklch の L で見る
      const bg = await header.evaluate(
        (el) => getComputedStyle(el).backgroundColor,
      );
      expect(bg).not.toBe('transparent');
      expect(bg).not.toMatch(/rgba\(|\/\s*[\d.]+\)/);
      let brightness: number;
      const rgb = bg.match(/^rgb\((\d+), (\d+), (\d+)\)$/);
      if (rgb) {
        brightness = (Number(rgb[1]) + Number(rgb[2]) + Number(rgb[3])) / 765;
      } else {
        expect(bg).toMatch(/^oklch\(/);
        brightness = parseFloat(bg.slice('oklch('.length));
      }
      if (theme === 'dark') {
        expect(brightness).toBeLessThan(0.3);
      } else {
        expect(brightness).toBeGreaterThan(0.95);
      }
      const isDark = await page.evaluate(() =>
        document.documentElement.classList.contains('dark'),
      );
      expect(isDark).toBe(theme === 'dark');

      // 下にリストをスクロールしたとき、上部の位置に当たるのは上部ブロック自身（リスト項目ではない）
      await page.locator('#sidebar').evaluate((el) => {
        el.scrollTop = el.scrollHeight;
      });
      await expect
        .poll(async () => (await measureHeader(page))?.dTop ?? -999)
        .toBeCloseTo(0, 0);
      const hitInHeader = await page.evaluate(() => {
        const sidebar = document.getElementById('sidebar')!;
        const sr = sidebar.getBoundingClientRect();
        const hit = document.elementFromPoint(
          sr.left + sr.width / 2,
          sr.top + 4,
        );
        return !!hit?.closest('#sidebar > div:first-child');
      });
      expect(hitInHeader).toBe(true);
    }
  });

  test('overscroll-behavior は contain、バーは thin、scrollbar-gutter は stable', async ({
    page,
  }) => {
    await page.goto('/tools/char-counter/');
    const sidebar = page.locator('#sidebar');
    await expect(sidebar).toHaveCSS('overscroll-behavior-x', 'contain');
    await expect(sidebar).toHaveCSS('overscroll-behavior-y', 'contain');
    await expect(sidebar).toHaveCSS('scrollbar-width', 'thin');
    await expect(sidebar).toHaveCSS('scrollbar-gutter', 'stable');
  });

  test('scrollbar-gutter により、スクロールバーの有無で nav の幅が変わらない', async ({
    page,
  }) => {
    // 中身がスクロールしない高さにしてから、高さを足してスクロールバーを出す
    await page.setViewportSize({ width: 1024, height: 12000 });
    await page.goto('/tools/char-counter/');
    const sidebar = page.locator('#sidebar');

    const overflowBefore = await sidebar.evaluate(
      (el) => el.scrollHeight - el.clientHeight,
    );
    expect(overflowBefore).toBeLessThanOrEqual(0);

    const navWidthBefore = await page
      .locator('#sidebar nav')
      .evaluate((el) => el.getBoundingClientRect().width);

    await sidebar.evaluate((el) => {
      const spacer = document.createElement('div');
      spacer.id = 'qa-spacer';
      spacer.style.height = '20000px';
      el.appendChild(spacer);
    });

    const scrollable = await sidebar.evaluate(
      (el) => el.scrollHeight > el.clientHeight,
    );
    expect(scrollable).toBe(true);
    // バーが実際に幅を取っていること（取っていないなら本テストは意味を持たない）
    const gutter = await sidebar.evaluate(
      (el) => (el as HTMLElement).offsetWidth - el.clientWidth,
    );
    expect(gutter).toBeGreaterThan(0);

    const navWidthAfter = await page
      .locator('#sidebar nav')
      .evaluate((el) => el.getBoundingClientRect().width);
    expect(Math.abs(navWidthAfter - navWidthBefore)).toBeLessThan(0.5);
  });

  test('サイドバーのスクロール位置はページ遷移後に復元される', async ({
    page,
  }) => {
    await page.goto('/tools/char-counter/');
    const sidebar = page.locator('#sidebar');
    const overflow = await sidebar.evaluate(
      (el) => el.scrollHeight - el.clientHeight,
    );
    expect(overflow).toBeGreaterThan(150);

    await sidebar.evaluate((el) => {
      el.scrollTop = 150;
    });
    await expect
      .poll(() => sidebar.evaluate((el) => el.scrollTop))
      .toBeGreaterThan(140);
    const saved = await sidebar.evaluate((el) => el.scrollTop);

    // 同じカテゴリの別ツールへ（遷移先のサイドバーも同じ高さになる）
    await page.goto('/tools/zenkaku-hankaku/');
    await expect
      .poll(() => sidebar.evaluate((el) => el.scrollTop))
      .toBeGreaterThan(saved - 10);
    const restored = await sidebar.evaluate((el) => el.scrollTop);
    expect(restored).toBeGreaterThanOrEqual(saved - 10);
    expect(restored).toBeLessThanOrEqual(saved + 10);
  });
});

test.describe('サイドバー上部の固定（モバイル・375px）', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('開いたドロワーでも上部が固定され、横にはみ出さない', async ({
    page,
  }) => {
    await page.goto('/tools/char-counter/');
    await page.locator('#sidebar-toggle').click();
    const sidebar = page.locator('#sidebar');
    await expect(sidebar).toBeFocused();

    await expect(page.locator(HEADER)).toHaveCSS('position', 'sticky');

    const overflowX = await sidebar.evaluate(
      (el) => el.scrollWidth - el.clientWidth,
    );
    expect(overflowX).toBeLessThanOrEqual(0);

    await sidebar.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });
    await expect
      .poll(async () => (await measureHeader(page))?.dTop ?? -999)
      .toBeCloseTo(0, 0);
    expect((await measureHeader(page))?.switcherInside).toBe(true);
  });
});
