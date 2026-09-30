import { test, expect } from './helpers/test';

// サイト機能 Step 0: 先頭に戻る（No.083）・シェア先追加（No.148）・GitHubリンク（No.149）・スキップリンク（No.177）

test.describe('ページ先頭に戻るボタン', () => {
  test('スクロールで表示され、クリックで先頭に戻る', async ({ page }) => {
    await page.goto('/tools/char-counter/');
    const button = page.locator('#back-to-top');
    await expect(button).toBeHidden();

    await page.evaluate(() => {
      document.body.style.minHeight = '3000px';
      window.scrollTo(0, 1500);
    });
    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute('aria-label', 'ページの先頭に戻る');

    await button.click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect(button).toBeHidden();
    await expect(page.locator('#main-content')).toBeFocused();
  });

  test('375px幅でページ末尾のフッターリンクと重ならない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 700 });
    await page.goto('/tools/char-counter/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const button = page.locator('#back-to-top');
    await expect(button).toBeVisible();
    const b = (await button.boundingBox())!;
    const links = await page.locator('footer a').all();
    for (const link of links) {
      const r = (await link.boundingBox())!;
      const overlap =
        r.x < b.x + b.width &&
        r.x + r.width > b.x &&
        r.y < b.y + b.height &&
        r.y + r.height > b.y;
      expect(overlap).toBe(false);
    }
  });

  test('英語版のラベル', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('#back-to-top')).toHaveAttribute(
      'aria-label',
      'Back to top',
    );
  });
});

test.describe('シェア先の追加', () => {
  test('Threads・Bluesky・Reddit のリンクがURLと題名を含む', async ({
    page,
  }) => {
    await page.goto('/tools/char-counter/');
    const links = page.locator('[data-share-popup]');
    const hrefs = await links.evaluateAll((els) =>
      els.map((el) => (el as HTMLAnchorElement).href),
    );
    const threads = hrefs.find((h) => h.startsWith('https://www.threads.com/'));
    const bluesky = hrefs.find((h) => h.startsWith('https://bsky.app/'));
    const reddit = hrefs.find((h) => h.startsWith('https://www.reddit.com/'));
    for (const href of [threads, bluesky, reddit]) {
      expect(href).toBeTruthy();
      expect(decodeURIComponent(href!)).toContain(
        'nyankotools.com/tools/char-counter/',
      );
    }
    expect(new URL(reddit!).searchParams.get('title')).toBeTruthy();
  });

  test('英語版にも表示され、はてブは出ない', async ({ page }) => {
    await page.goto('/en/tools/char-counter/');
    await expect(
      page.locator('[data-share-popup][aria-label="Share on Bluesky"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-share-popup]', { hasText: 'B!' }),
    ).toHaveCount(0);
  });
});

test.describe('GitHubリンク', () => {
  test('フッターに別タブで開くリンクがある（ja/en）', async ({ page }) => {
    for (const [path, text] of [
      ['/', 'GitHub（ソースコード公開）'],
      ['/en/', 'GitHub (source code)'],
    ]) {
      await page.goto(path);
      const link = page.locator('footer a', { hasText: text });
      await expect(link).toHaveAttribute(
        'href',
        'https://github.com/nyankotools/nyankotools',
      );
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });
});

test.describe('スキップリンク', () => {
  test('最初のTabで表示され、Enterで本文にフォーカスが移る', async ({
    page,
  }) => {
    await page.goto('/tools/char-counter/');
    await page.keyboard.press('Tab');
    const skip = page.locator('a[href="#main-content"]');
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await expect(skip).toHaveText('本文へスキップ');

    await page.keyboard.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();
  });
});
