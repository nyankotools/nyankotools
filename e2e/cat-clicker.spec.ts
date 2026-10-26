import { test, expect } from './helpers/test';

test('猫をクリックして増え、アップグレードを買える', async ({ page }) => {
  await page.goto('/tools/cat-clicker/');
  const points = page.locator('#cc-points');
  const paw = page.locator('li[data-upgrade="paw"]');
  await expect(points).toHaveText('0');
  await expect(paw.locator('[data-role="buy"]')).toBeDisabled();

  for (let i = 0; i < 20; i++) await page.locator('#cc-cat').click();
  await expect(points).toHaveText('20');
  await expect(page.locator('#cc-stat-clicks')).toHaveText('20');

  await paw.locator('[data-role="buy"]').click();
  await expect(paw.locator('[data-role="level"]')).toHaveText('1');
  await expect(points).toHaveText('0');
  await expect(page.locator('#cc-stat-perclick')).toHaveText('2');
});

test('リロードしても進行が残り、リセットで消える', async ({ page }) => {
  await page.goto('/tools/cat-clicker/');
  for (let i = 0; i < 5; i++) await page.locator('#cc-cat').click();
  await page.locator('#cc-reset').focus(); // 保存のきっかけ
  await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
  await page.reload();
  await expect(page.locator('#cc-stat-clicks')).toHaveText('5');
  await expect(page.locator('#cc-points')).toHaveText('5');

  page.once('dialog', (d) => d.accept());
  await page.locator('#cc-reset').click();
  await expect(page.locator('#cc-points')).toHaveText('0');
  await page.reload();
  await expect(page.locator('#cc-stat-clicks')).toHaveText('0');
});

test('放置ぶんが加算される（保存データから復元）', async ({ page }) => {
  await page.addInitScript(() => {
    if (localStorage.getItem('nyankotools:cat-clicker:save')) return;
    localStorage.setItem(
      'nyankotools:cat-clicker:save',
      JSON.stringify({
        v: 1,
        points: 0,
        total: 0,
        clicks: 0,
        levels: { kitten: 2 },
        savedAt: Date.now() - 100 * 1000,
      }),
    );
  });
  await page.goto('/tools/cat-clicker/');
  // 2/秒 × 100秒 = 200 以上
  await expect(page.locator('#cc-message')).not.toBeEmpty();
  const text = (await page.locator('#cc-points').textContent())!;
  expect(Number(text.replace(/,/g, ''))).toBeGreaterThanOrEqual(200);
});

test('localStorageが使えなくても遊べる', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new Error('blocked');
      },
    });
  });
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/tools/cat-clicker/');
  await page.locator('#cc-cat').click();
  await expect(page.locator('#cc-points')).toHaveText('1');
  await expect(page.locator('#cc-save-failed')).toBeVisible();
  expect(errors).toEqual([]);
});

test('猫クリッカー（英語）が表示される', async ({ page }) => {
  await page.goto('/en/tools/cat-clicker/');
  await expect(page.locator('main h1')).toContainText('Cat Clicker');
  await expect(page.locator('#cc-reset')).toHaveText('Reset');
});
