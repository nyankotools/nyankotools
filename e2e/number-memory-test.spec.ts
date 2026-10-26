import { test, expect } from './helpers/test';

test('数字記憶テストで正解すると桁数が増え、ベストが保存される', async ({
  page,
}) => {
  test.setTimeout(30_000);
  await page.goto('/tools/number-memory-test/');
  await page.locator('#nm-start').click();

  const number = page.locator('#nm-number');
  await expect(number).toBeVisible();
  const first = (await number.textContent())!.trim();
  expect(first).toMatch(/^[0-9]$/);

  const input = page.locator('#nm-input');
  await expect(input).toBeVisible({ timeout: 3000 });
  await expect(input).toHaveAttribute('inputmode', 'numeric');
  await input.fill(first);
  await input.press('Enter');
  await expect(page.locator('#nm-result')).toBeVisible();
  await expect(page.locator('#nm-best')).toContainText('1');

  await page.locator('#nm-start').click();
  const second = (await number.textContent())!.trim();
  expect(second).toMatch(/^[0-9]{2}$/);
  await expect(input).toBeVisible({ timeout: 4000 });
  await input.fill(second + '9');
  await input.press('Enter');
  await expect(page.locator('#nm-result-detail')).toContainText(second);

  await page.reload();
  await expect(page.locator('#nm-best')).toContainText('1');
});

test('数字記憶テストで不正解だと終了してやり直せる', async ({ page }) => {
  await page.goto('/tools/number-memory-test/');
  await page.locator('#nm-start').click();
  const input = page.locator('#nm-input');
  await expect(input).toBeVisible({ timeout: 3000 });
  // 入力欄は pattern="[0-9]*" のため 'x' は送信できない。空入力は必ず不正解になる
  await input.fill('');
  await input.press('Enter');
  await expect(page.locator('#nm-result')).toBeVisible();
  await expect(page.locator('#nm-level')).toContainText('1');
  await page.locator('#nm-start').click();
  await expect(page.locator('#nm-number')).toBeVisible();
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
  await page.goto('/tools/number-memory-test/');
  await page.locator('#nm-start').click();
  await expect(page.locator('#nm-number')).toBeVisible();
  expect(errors).toEqual([]);
});

test('数字記憶テスト（英語）が表示される', async ({ page }) => {
  await page.goto('/en/tools/number-memory-test/');
  await expect(page.locator('main h1')).toContainText('Number Memory');
  await expect(page.locator('#nm-start')).toHaveText('Start');
});
