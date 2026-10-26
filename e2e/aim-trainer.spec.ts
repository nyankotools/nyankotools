import { test, expect } from './helpers/test';

test('エイム練習で的外れはミス、20個命中で結果とベスト記録が出る', async ({
  page,
}) => {
  await page.goto('/tools/aim-trainer/');
  const target = page.locator('#at-target');
  const arena = page.locator('#at-arena');
  await expect(target).toBeHidden();

  await page.locator('#at-start').click();
  await expect(target).toBeVisible();

  // 的から離れた位置をクリックしてミスにする
  const a = (await arena.boundingBox())!;
  const tb = (await target.boundingBox())!;
  const farX = tb.x - a.x > a.width / 2 ? 8 : a.width - 8;
  const farY = tb.y - a.y > a.height / 2 ? 8 : a.height - 8;
  await arena.click({ position: { x: farX, y: farY } });
  await expect(page.locator('#at-stat-misses')).toHaveText('1');
  await expect(page.locator('#at-stat-hits')).toHaveText('0');

  for (let i = 1; i <= 20; i++) {
    await target.click();
    await expect(page.locator('#at-stat-hits')).toHaveText(String(i));
  }

  await expect(target).toBeHidden();
  await expect(page.locator('#at-history li')).toHaveCount(20);
  await expect(page.locator('#at-stat-accuracy')).toHaveText('95.2%');
  await expect(page.locator('#at-stat-average')).toContainText('ms');
  await expect(page.locator('#at-stat-record')).toContainText('ms');
  await expect(page.locator('#at-new-record')).toBeVisible();

  await page.locator('#at-reset').click();
  await expect(page.locator('#at-history li')).toHaveCount(0);
  await expect(page.locator('#at-stat-hits')).toHaveText('0');
  // ベスト記録は残る
  await expect(page.locator('#at-stat-record')).toContainText('ms');
});

test('的の大きさを選べて、プレイ中は変更できない', async ({ page }) => {
  await page.goto('/tools/aim-trainer/');
  const target = page.locator('#at-target');
  const select = page.locator('#at-size');
  await expect(select).toHaveValue('24');
  await select.selectOption('56');
  await page.locator('#at-start').click();
  await expect(target).toBeVisible();
  await expect(select).toBeDisabled();
  expect((await target.boundingBox())!.width).toBe(56);
  await page.locator('#at-reset').click();
  await expect(select).toBeEnabled();
  await select.selectOption('16');
  await page.locator('#at-start').click();
  expect((await target.boundingBox())!.width).toBe(16);
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
  await page.goto('/tools/aim-trainer/');
  await page.locator('#at-start').click();
  await expect(page.locator('#at-target')).toBeVisible();
  expect(errors).toEqual([]);
});

test('エイム練習（英語）が表示される', async ({ page }) => {
  await page.goto('/en/tools/aim-trainer/');
  await expect(page.locator('main h1')).toContainText('Aim Trainer');
  await expect(page.locator('#at-start')).toHaveText('Start');
});
