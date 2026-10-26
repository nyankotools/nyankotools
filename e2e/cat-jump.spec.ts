import { test, expect } from './helpers/test';

test('猫ジャンプゲームはスペースキーで始まり、何もしないと地面に落ちて終了する', async ({
  page,
}) => {
  await page.goto('/tools/cat-jump/');
  const root = page.locator('#ffc-root');
  await expect(root).toHaveAttribute('data-state', 'ready');

  await page.keyboard.press('Space');
  await expect(root).toHaveAttribute('data-state', 'playing');

  await expect(root).toHaveAttribute('data-state', 'finished', {
    timeout: 10_000,
  });
  await expect(page.locator('#ffc-status')).toContainText('0');
  await expect(page.locator('#ffc-start')).toHaveText('もう一度遊ぶ');

  // 終了直後は誤操作防止のため再開しないが、少し待てば再開できる
  await page.waitForTimeout(800);
  await page.locator('#ffc-canvas').dispatchEvent('pointerdown', {
    button: 0,
    pointerType: 'mouse',
  });
  await expect(root).toHaveAttribute('data-state', 'playing');
});

test('スペースを連打すると羽ばたいて、地面に落ちずに続けられる', async ({
  page,
}) => {
  await page.goto('/tools/cat-jump/');
  const root = page.locator('#ffc-root');
  await page.keyboard.press('Space');
  await expect(root).toHaveAttribute('data-state', 'playing');
  // 最初の土管は約2秒後に猫へ届くため、この間は連打で高度を保てる
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('Space');
    await page.waitForTimeout(150);
  }
  await expect(root).toHaveAttribute('data-state', 'playing');
});

test('スタートボタンを押した後はフォーカスが外れ、Spaceで再スタートしない', async ({
  page,
}) => {
  await page.goto('/tools/cat-jump/');
  const start = page.locator('#ffc-start');
  await start.click();
  await expect(page.locator('#ffc-root')).toHaveAttribute(
    'data-state',
    'playing',
  );
  await expect(start).not.toBeFocused();
});

test('プレイ中にキャンバスをクリックしても中断せず羽ばたく', async ({
  page,
}) => {
  await page.goto('/tools/cat-jump/');
  const root = page.locator('#ffc-root');
  await page.locator('#ffc-canvas').click();
  await expect(root).toHaveAttribute('data-state', 'playing');
  await page.locator('#ffc-canvas').click();
  await expect(root).toHaveAttribute('data-state', 'playing');
});

test('ベスト記録を消すボタンで保存値が消える', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('cat-jump-best', '7');
  });
  await page.goto('/tools/cat-jump/');
  await expect(page.locator('#ffc-best')).toHaveText('7');
  await page.locator('#ffc-reset-best').click();
  await expect(page.locator('#ffc-best')).not.toHaveText('7');
  expect(
    await page.evaluate(() => localStorage.getItem('cat-jump-best')),
  ).toBeNull();
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
  await page.goto('/tools/cat-jump/');
  await page.locator('#ffc-start').click();
  await expect(page.locator('#ffc-root')).toHaveAttribute(
    'data-state',
    'playing',
  );
  expect(errors).toEqual([]);
});

test('猫ジャンプゲーム（英語）が表示される', async ({ page }) => {
  await page.goto('/en/tools/cat-jump/');
  await expect(page.locator('main h1')).toContainText('Cat Jump Game');
  await expect(page.locator('#ffc-start')).toHaveText('Start');
});
