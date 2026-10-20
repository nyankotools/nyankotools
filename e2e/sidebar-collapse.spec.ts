import { test, expect, type Page } from './helpers/test';

// PC幅（768px以上）でサイドバーを折りたたむ/展開する機能の確認。
// 状態は html.sidebar-collapsed と localStorage('sidebar-collapsed'='1') で持ち、
// theme-init.js（ヘッド内の同期スクリプト）が初回描画前に反映するためリロードでもちらつかない。
// 375px（モバイル）では展開ボタンは出ず、従来のハンバーガーメニューがそのまま動くことも確認する。

const DESKTOP = { width: 1280, height: 800 };
const TABLET_MIN = { width: 768, height: 900 };
const MOBILE = { width: 375, height: 667 };

// 日英の代表ツールページ（h1 の確認と遷移の起点に使う）
const JA_TOOL = '/tools/char-counter/';
const EN_TOOL = '/en/tools/char-counter/';

const STORAGE_KEY = 'sidebar-collapsed';

function collapsedClass(page: Page) {
  return page.evaluate(() =>
    document.documentElement.classList.contains('sidebar-collapsed'),
  );
}

function storedValue(page: Page) {
  return page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
}

function rectOf(page: Page, selector: string) {
  return page.locator(selector).evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
  });
}

test.describe('PC幅のサイドバーの折りたたみ・展開', () => {
  test.use({ viewport: DESKTOP });

  test('初期状態は展開されていて、折りたたみボタンだけが見える', async ({
    page,
  }) => {
    await page.goto(JA_TOOL);

    await expect(page.locator('#sidebar')).toBeVisible();
    await expect(page.locator('#sidebar-collapse')).toBeVisible();
    await expect(page.locator('#sidebar-expand')).toBeHidden();
    expect(await collapsedClass(page)).toBe(false);
    expect(await storedValue(page)).toBeNull();
  });

  test('折りたたみボタンでサイドバーが隠れ、展開ボタンにフォーカスが移り、状態が保存される', async ({
    page,
  }) => {
    await page.goto(JA_TOOL);
    const mainWidthBefore = (await rectOf(page, 'main')).right;

    await page.locator('#sidebar-collapse').click();

    await expect(page.locator('#sidebar')).toBeHidden();
    await expect(page.locator('#sidebar-expand')).toBeVisible();
    await expect(page.locator('#sidebar-expand')).toBeFocused();
    expect(await collapsedClass(page)).toBe(true);
    expect(await storedValue(page)).toBe('1');

    // 折りたたむと本文側が広がる（サイドバー分の幅が本文に回る）
    const mainRect = await rectOf(page, 'main');
    expect(mainRect.right).toBeGreaterThanOrEqual(mainWidthBefore);
  });

  test('展開ボタンで元に戻り、折りたたみボタンにフォーカスが移り、保存値が消える', async ({
    page,
  }) => {
    await page.goto(JA_TOOL);
    await page.locator('#sidebar-collapse').click();
    await expect(page.locator('#sidebar-expand')).toBeFocused();

    await page.locator('#sidebar-expand').click();

    await expect(page.locator('#sidebar')).toBeVisible();
    await expect(page.locator('#sidebar-expand')).toBeHidden();
    await expect(page.locator('#sidebar-collapse')).toBeFocused();
    expect(await collapsedClass(page)).toBe(false);
    expect(await storedValue(page)).toBeNull();
  });

  test('折りたたみ状態はリロード後も維持され、初回描画時点で反映されている', async ({
    page,
  }) => {
    await page.goto(JA_TOOL);
    await page.locator('#sidebar-collapse').click();

    await page.reload({ waitUntil: 'domcontentloaded' });
    // theme-init.js は同期スクリプトなので DOMContentLoaded の時点でクラスが付いている（後付けによるちらつき無し）
    expect(await collapsedClass(page)).toBe(true);

    await expect(page.locator('#sidebar')).toBeHidden();
    await expect(page.locator('#sidebar-expand')).toBeVisible();
  });

  test('折りたたみ状態はページ遷移（サイドバーのリンク）後も維持される', async ({
    page,
  }) => {
    await page.goto(JA_TOOL);
    await page.locator('#sidebar-collapse').click();

    // 別ツールへ遷移（サイドバーは非表示だが、リンクの href は取得できる）
    const href = await page
      .locator('#sidebar a[href^="/tools/"]')
      .first()
      .getAttribute('href');
    expect(href).toBeTruthy();
    await page.goto(href!);

    expect(await collapsedClass(page)).toBe(true);
    await expect(page.locator('#sidebar')).toBeHidden();
    await expect(page.locator('#sidebar-expand')).toBeVisible();
  });

  test('英語版でも折りたたみ・展開のラベルが英語になり、動作する', async ({
    page,
  }) => {
    await page.goto(EN_TOOL);

    const collapse = page.locator('#sidebar-collapse');
    const expand = page.locator('#sidebar-expand');
    await expect(collapse).toHaveAttribute('aria-label', 'Close sidebar');
    await expect(collapse).toHaveAttribute('title', 'Close sidebar');

    await collapse.click();
    await expect(page.locator('#sidebar')).toBeHidden();
    await expect(expand).toHaveAttribute('aria-label', 'Open sidebar');
    await expect(expand).toBeFocused();

    await expand.click();
    await expect(page.locator('#sidebar')).toBeVisible();
    await expect(collapse).toBeFocused();
  });

  test('展開ボタンは本文の見出し h1 と重ならない（日本語・英語、768px と 1280px）', async ({
    page,
  }) => {
    for (const viewport of [TABLET_MIN, DESKTOP]) {
      await page.setViewportSize(viewport);
      for (const url of [JA_TOOL, EN_TOOL]) {
        await page.goto(url);
        await page.locator('#sidebar-collapse').click();
        await expect(page.locator('#sidebar-expand')).toBeVisible();

        const h1 = await rectOf(page, 'main h1');
        const btn = await rectOf(page, '#sidebar-expand');
        const overlaps =
          h1.left < btn.right &&
          btn.left < h1.right &&
          h1.top < btn.bottom &&
          btn.top < h1.bottom;
        expect(
          overlaps,
          `${url} @${viewport.width}px: h1 ${JSON.stringify(h1)} / button ${JSON.stringify(btn)}`,
        ).toBe(false);

        // 後始末: 次のループのために展開しておく
        await page.locator('#sidebar-expand').click();
        await expect(page.locator('#sidebar')).toBeVisible();
      }
    }
  });

  test('サイドバーの保存スクロール位置は、折りたたみ中の離脱で上書きされない', async ({
    page,
  }) => {
    await page.goto(JA_TOOL);
    const sidebar = page.locator('#sidebar');
    const scrollable = await sidebar.evaluate(
      (el) => el.scrollHeight > el.clientHeight,
    );
    test.skip(!scrollable, 'サイドバーがスクロールできない高さのため対象外');

    // 展開中に位置を付けてから離脱すると保存される
    await sidebar.evaluate((el) => {
      el.scrollTop = 120;
    });
    await page.goto(EN_TOOL);
    const saved = await page.evaluate(() =>
      sessionStorage.getItem('sidebar-scroll-top'),
    );
    expect(Number(saved)).toBeGreaterThan(0);

    // 折りたたんだ状態で離脱しても、保存値（0 ではない値）が残る
    await page.locator('#sidebar-collapse').click();
    await page.goto(JA_TOOL);
    const afterCollapsedLeave = await page.evaluate(() =>
      sessionStorage.getItem('sidebar-scroll-top'),
    );
    expect(afterCollapsedLeave).toBe(saved);
  });
});

test.describe('モバイル幅（375px）では折りたたみの影響を受けない', () => {
  test.use({ viewport: MOBILE });

  test('展開ボタンも折りたたみボタンも見えず、ハンバーガーで従来どおり開閉できる', async ({
    page,
  }) => {
    await page.goto(JA_TOOL);

    await expect(page.locator('#sidebar-expand')).toBeHidden();
    await expect(page.locator('#sidebar-collapse')).toBeHidden();

    const toggle = page.locator('#sidebar-toggle');
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(page.locator('#sidebar')).toHaveJSProperty('inert', false);
    await expect(page.locator('#sidebar')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(toggle).toBeFocused();
    await expect(page.locator('#sidebar')).toHaveJSProperty('inert', true);
  });

  test('PC幅で折りたたんだ状態の保存値があっても、モバイルではメニューが開く', async ({
    page,
  }) => {
    // PCで折りたたんだ状態を作る（同一オリジンの localStorage を共有するため、同じ context で行う）
    await page.setViewportSize(DESKTOP);
    await page.goto(JA_TOOL);
    await page.locator('#sidebar-collapse').click();
    expect(await storedValue(page)).toBe('1');

    await page.setViewportSize(MOBILE);
    await page.reload();
    await expect(page.locator('#sidebar-expand')).toBeHidden();

    await page.locator('#sidebar-toggle').click();
    await expect(page.locator('#sidebar')).toHaveJSProperty('inert', false);
    // 開いたサイドバーが画面内（左端0）に出ている
    // 開く際は transform のアニメーション（200ms）があるため、落ち着くまで待つ
    await expect
      .poll(async () => (await page.locator('#sidebar').boundingBox())?.x ?? -1)
      .toBeGreaterThanOrEqual(0);
    const box = await page.locator('#sidebar').boundingBox();
    expect(box?.x ?? -1).toBeLessThan(1);
  });

  test('768px未満では展開ボタンは出ない（PCでも折りたたみ状態のとき）', async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(JA_TOOL);
    await page.locator('#sidebar-collapse').click();
    await expect(page.locator('#sidebar-expand')).toBeVisible();

    await page.setViewportSize({ width: 767, height: 800 });
    await expect(page.locator('#sidebar-expand')).toBeHidden();
  });
});
