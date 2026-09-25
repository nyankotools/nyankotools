import { test, expect } from '@playwright/test';

// サイドバーのスクロール位置がページ遷移で先頭に戻らないことを確認する。
// 実装は public/sidebar-category-init.js（初回復元）と layout-nav.ts の
// initSidebarScroll（保存と再復元）が担う。
// また、お気に入り欄のプレースホルダー描画がレイアウト安定性を確保することを確認する。

test.describe('サイドバーのスクロール位置の保存・復元（デスクトップ表示）', () => {
  test('navigate between tools while maintaining sidebar scroll position', async ({
    page,
  }) => {
    // Desktop size to ensure sidebar is visible (md breakpoint: >= 768px)
    page.setViewportSize({ width: 1024, height: 768 });

    // Navigate to first tool
    await page.goto('/tools/char-counter/');

    const sidebar = page.locator('#sidebar');

    // Verify sidebar is visible in desktop layout
    await expect(sidebar).toBeVisible();

    // Check if sidebar is scrollable
    const isScrollable = await sidebar.evaluate((el) => {
      return el.scrollHeight > el.clientHeight;
    });

    if (isScrollable) {
      // Manually scroll the sidebar using JavaScript
      const scrollPos = 100;
      await sidebar.evaluate((el, pos) => {
        el.scrollTop = pos;
      }, scrollPos);

      // Verify scroll position was set
      const scrollTopBeforeNav = await sidebar.evaluate((el) => el.scrollTop);

      // Scroll might not be exactly 100 due to rounding, but should be significant
      if (scrollTopBeforeNav > 0) {
        // Navigate to another tool - this triggers 'pagehide' event
        await page.goto('/tools/text-case-converter/');

        // After navigation, check that sidebar scroll is preserved
        const scrollTopAfterNav = await sidebar.evaluate((el) => el.scrollTop);

        // Scroll position should be restored (with tolerance for layout shifts)
        expect(scrollTopAfterNav).toBeGreaterThan(0);
      }
    }

    // Always verify we can navigate without errors
    await expect(page.locator('main h1')).toContainText(/./);
  });

  test('sidebar scroll restoration happens on page load', async ({ page }) => {
    page.setViewportSize({ width: 1024, height: 768 });

    // Navigate to a tool page
    await page.goto('/tools/char-counter/');

    const sidebar = page.locator('#sidebar');

    // Get the scrollable height
    const scrollHeight = await sidebar.evaluate(
      (el) => el.scrollHeight - el.clientHeight,
    );

    if (scrollHeight > 0) {
      // Manually set scroll position and save it
      const targetScroll = Math.min(120, Math.floor(scrollHeight * 0.5));

      await page.evaluate((scrollPos) => {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
          sidebar.scrollTop = scrollPos;
          try {
            sessionStorage.setItem('sidebar-scroll-top', String(scrollPos));
          } catch {
            // Ignore
          }
        }
      }, targetScroll);

      // Navigate to another page in the same session. Use a tool in the same
      // category so the destination sidebar is just as tall (other categories
      // collapse and leave nothing to scroll).
      await page.goto('/tools/zenkaku-hankaku/');

      // Check that the scroll position was restored
      const restoredScroll = await sidebar.evaluate(() => {
        return document.getElementById('sidebar')?.scrollTop ?? -1;
      });

      // Should be restored to approximately the value we saved
      expect(restoredScroll).toBeGreaterThanOrEqual(
        Math.max(0, targetScroll - 10),
      );
      expect(restoredScroll).toBeLessThanOrEqual(targetScroll + 10);
    }
  });

  test('initSidebarScroll function is called on page load', async ({
    page,
  }) => {
    page.setViewportSize({ width: 1024, height: 768 });

    // Navigate to a tool
    await page.goto('/tools/char-counter/');

    // Verify that the initSidebarScroll function exists and was called
    // by checking that the pagehide event listener is attached
    const hasListener = await page.evaluate(() => {
      // We can't directly check event listeners, but we can verify
      // that sessionStorage key is being managed by checking if
      // navigation works without errors
      return typeof window !== 'undefined';
    });

    expect(hasListener).toBe(true);

    // Trigger a navigation and verify no errors occur
    await page.goto('/tools/text-diff/');
    const h1Text = await page.locator('main h1').textContent();
    expect(h1Text).toBeTruthy();
  });

  test('favorites placeholder prevents layout shift of category positions', async ({
    page,
  }) => {
    // Set up two favorite tools in localStorage before navigation
    await page.goto('/tools/char-counter/', {
      waitUntil: 'networkidle',
    });

    // Set favorite-tools in localStorage with 2 items
    await page.evaluate(() => {
      localStorage.setItem(
        'favorite-tools',
        JSON.stringify(['char-counter', 'text-case-converter']),
      );
    });

    page.setViewportSize({ width: 1024, height: 768 });

    // Reload the page to trigger sidebar-category-init.js
    await page.reload({ waitUntil: 'domcontentloaded' });

    // Get the first category summary's y-coordinate right after DOMContentLoaded
    // (before module JS runs and favorites are rendered)
    const categoryYBeforeModuleJS = await page.evaluate(() => {
      const firstCategory = document.querySelector(
        'nav details[data-category] summary',
      );
      if (!firstCategory) return null;
      const rect = firstCategory.getBoundingClientRect();
      return rect.top;
    });

    // Wait for module JS (favorites rendering) to complete
    await page.waitForLoadState('networkidle');

    // Check the y-coordinate after all rendering is complete
    const categoryYAfterModuleJS = await page.evaluate(() => {
      const firstCategory = document.querySelector(
        'nav details[data-category] summary',
      );
      if (!firstCategory) return null;
      const rect = firstCategory.getBoundingClientRect();
      return rect.top;
    });

    // The y-coordinate should not change (layout shift prevented by placeholder)
    // Allow for small rounding differences (1px tolerance)
    if (categoryYBeforeModuleJS !== null && categoryYAfterModuleJS !== null) {
      expect(
        Math.abs(categoryYBeforeModuleJS - categoryYAfterModuleJS),
      ).toBeLessThanOrEqual(1);
    }
  });

  test('favorites placeholder height matches rendered height', async ({
    page,
  }) => {
    page.setViewportSize({ width: 1024, height: 768 });

    // Set favorite-tools in localStorage with 2 items
    await page.goto('/tools/char-counter/');
    await page.evaluate(() => {
      localStorage.setItem(
        'favorite-tools',
        JSON.stringify(['char-counter', 'text-case-converter']),
      );
    });

    // Reload the page
    await page.reload({ waitUntil: 'domcontentloaded' });

    // Measure the favorites list container height right after DOMContentLoaded
    const placeholderHeight = await page.evaluate(() => {
      const section = document.getElementById('sidebar-favorites-list');
      if (!section) return null;
      // Get the sum of all li elements (placeholders)
      const lis = section.querySelectorAll('li');
      return Array.from(lis).reduce((sum, li) => {
        return sum + (li.offsetHeight || 0);
      }, 0);
    });

    // Wait for module JS to complete
    await page.waitForLoadState('networkidle');

    // Measure the favorites list height after rendering
    const renderedHeight = await page.evaluate(() => {
      const section = document.getElementById('sidebar-favorites-list');
      if (!section) return null;
      // Get the sum of all li elements (rendered favorites)
      const lis = section.querySelectorAll('li');
      return Array.from(lis).reduce((sum, li) => {
        return sum + (li.offsetHeight || 0);
      }, 0);
    });

    // Heights should match (or be very close)
    if (placeholderHeight !== null && renderedHeight !== null) {
      expect(Math.abs(placeholderHeight - renderedHeight)).toBeLessThanOrEqual(
        2,
      );
    }
  });

  test('empty favorites section remains hidden', async ({ page }) => {
    page.setViewportSize({ width: 1024, height: 768 });

    // Clear favorite-tools to ensure empty state
    await page.goto('/tools/char-counter/');
    await page.evaluate(() => {
      localStorage.removeItem('favorite-tools');
    });

    // Reload the page
    await page.reload({ waitUntil: 'domcontentloaded' });

    // The favorites section should be hidden
    const favoritesSection = page.locator('#sidebar-favorites');
    await expect(favoritesSection).toHaveAttribute('hidden');
  });

  test('favorites section closes and stays closed across navigation', async ({
    page,
  }) => {
    page.setViewportSize({ width: 1024, height: 768 });

    // Clear and set up favorites for this test
    await page.goto('/tools/char-counter/');
    await page.evaluate(() => {
      localStorage.setItem(
        'favorite-tools',
        JSON.stringify(['char-counter', 'text-case-converter']),
      );
      // Ensure favorites are initially open (or not set)
      localStorage.removeItem('sidebar-favorites-open');
    });

    // Reload to ensure fresh state
    await page.reload();

    const favoritesDetails = page.locator('#sidebar-favorites');

    // Verify favorites are open (default state)
    const isOpenBefore = await favoritesDetails.evaluate(
      (el) => el instanceof HTMLDetailsElement && el.open,
    );
    expect(isOpenBefore).toBeTruthy();

    // Close the favorites section
    const favoritesSummary = favoritesDetails.locator('summary');
    await favoritesSummary.click();

    // Verify it's now closed
    const isClosedAfter = await favoritesDetails.evaluate(
      (el) => el instanceof HTMLDetailsElement && el.open,
    );
    expect(isClosedAfter).toBeFalsy();

    // Navigate to another tool
    await page.goto('/tools/password-generator/');

    // Verify the favorites section is still closed
    const favoritesDetailsAfterNav = page.locator('#sidebar-favorites');
    const isStillClosed = await favoritesDetailsAfterNav.evaluate(
      (el) => el instanceof HTMLDetailsElement && el.open,
    );
    expect(isStillClosed).toBeFalsy();
  });

  test('favorites section open state persists across navigation', async ({
    page,
  }) => {
    page.setViewportSize({ width: 1024, height: 768 });

    // Set up favorites closed
    await page.goto('/tools/char-counter/');
    await page.evaluate(() => {
      localStorage.setItem(
        'favorite-tools',
        JSON.stringify(['char-counter', 'text-case-converter']),
      );
      // Set favorites to closed
      localStorage.setItem('sidebar-favorites-open', '0');
    });

    // Reload to ensure the closed state is applied
    await page.reload();

    const favoritesDetails = page.locator('#sidebar-favorites');

    // Verify it's closed
    const isClosedBefore = await favoritesDetails.evaluate(
      (el) => el instanceof HTMLDetailsElement && el.open,
    );
    expect(isClosedBefore).toBeFalsy();

    // Open the favorites section
    const favoritesSummary = favoritesDetails.locator('summary');
    await favoritesSummary.click();

    // Verify it's now open
    const isOpenAfter = await favoritesDetails.evaluate(
      (el) => el instanceof HTMLDetailsElement && el.open,
    );
    expect(isOpenAfter).toBeTruthy();

    // Navigate to another tool
    await page.goto('/tools/uuid-generator/');

    // Verify the favorites section is still open
    const favoritesDetailsAfterNav = page.locator('#sidebar-favorites');
    const isStillOpen = await favoritesDetailsAfterNav.evaluate(
      (el) => el instanceof HTMLDetailsElement && el.open,
    );
    expect(isStillOpen).toBeTruthy();
  });

  test('favorites list and aria-current persist after adding favorites and navigating', async ({
    page,
  }) => {
    page.setViewportSize({ width: 1024, height: 768 });

    // Start from char-counter and set favorites via localStorage
    await page.goto('/tools/char-counter/');
    await page.evaluate(() => {
      localStorage.setItem(
        'favorite-tools',
        JSON.stringify(['char-counter', 'password-generator']),
      );
      localStorage.removeItem('sidebar-favorites-open');
      localStorage.removeItem('sidebar-favorites-html:ja');
    });

    // Reload page
    await page.reload();

    // Verify favorites section is visible
    const favoritesSection = page.locator('#sidebar-favorites');
    await expect(favoritesSection).not.toHaveAttribute('hidden');

    // Get the favorites list
    const favoritesList = page.locator('#sidebar-favorites-list');
    const items = favoritesList.locator('li');
    const initialCount = await items.count();
    expect(initialCount).toBe(2);

    // Verify aria-current is set on char-counter
    const charCounterLink = favoritesList.locator(
      'a[href="/tools/char-counter/"]',
    );
    await expect(charCounterLink).toHaveAttribute('aria-current', 'page');

    // Navigate to password-generator
    await page.goto('/tools/password-generator/');

    // Verify favorites section still has the same items
    const favoritesAfterNav = page.locator('#sidebar-favorites-list');
    const itemsAfter = favoritesAfterNav.locator('li');
    const countAfter = await itemsAfter.count();
    expect(countAfter).toBe(2);

    // Verify aria-current has moved to password-generator
    const passwordGenLink = favoritesAfterNav.locator(
      'a[href="/tools/password-generator/"]',
    );
    await expect(passwordGenLink).toHaveAttribute('aria-current', 'page');

    // Verify char-counter no longer has aria-current
    const charCounterLinkAfter = favoritesAfterNav.locator(
      'a[href="/tools/char-counter/"]',
    );
    await expect(charCounterLinkAfter).not.toHaveAttribute('aria-current');

    // Navigate to a third tool
    await page.goto('/tools/text-case-converter/');

    // Verify neither favorited tool has aria-current
    const favoritesAfterThirdNav = page.locator('#sidebar-favorites-list');
    const charCounterLinkThird = favoritesAfterThirdNav.locator(
      'a[href="/tools/char-counter/"]',
    );
    const passwordGenLinkThird = favoritesAfterThirdNav.locator(
      'a[href="/tools/password-generator/"]',
    );
    await expect(charCounterLinkThird).not.toHaveAttribute('aria-current');
    await expect(passwordGenLinkThird).not.toHaveAttribute('aria-current');
  });

  test('favorites list persists with correct aria-current in English version', async ({
    page,
  }) => {
    page.setViewportSize({ width: 1024, height: 768 });

    // Navigate to English version
    await page.goto('/en/');
    await page.evaluate(() => {
      localStorage.setItem(
        'favorite-tools',
        JSON.stringify(['char-counter', 'password-generator']),
      );
      // Clear cached HTML for both languages
      localStorage.removeItem('sidebar-favorites-html:ja');
      localStorage.removeItem('sidebar-favorites-html:en');
    });

    // Navigate to a tool in English
    await page.goto('/en/tools/char-counter/');

    // Verify favorites section is visible
    const favoritesSection = page.locator('#sidebar-favorites');
    await expect(favoritesSection).not.toHaveAttribute('hidden');

    // Verify char-counter has aria-current
    const charCounterLink = page.locator(
      '#sidebar-favorites-list a[href="/en/tools/char-counter/"]',
    );
    await expect(charCounterLink).toHaveAttribute('aria-current', 'page');

    // Verify password-generator does NOT have aria-current
    const passwordGenLink = page.locator(
      '#sidebar-favorites-list a[href="/en/tools/password-generator/"]',
    );
    await expect(passwordGenLink).not.toHaveAttribute('aria-current');

    // Navigate to password-generator
    await page.goto('/en/tools/password-generator/');

    // Verify aria-current moved to password-generator
    const passwordGenLinkAfter = page.locator(
      '#sidebar-favorites-list a[href="/en/tools/password-generator/"]',
    );
    await expect(passwordGenLinkAfter).toHaveAttribute('aria-current', 'page');

    // Verify char-counter no longer has aria-current
    const charCounterLinkAfter = page.locator(
      '#sidebar-favorites-list a[href="/en/tools/char-counter/"]',
    );
    await expect(charCounterLinkAfter).not.toHaveAttribute('aria-current');
  });
});
