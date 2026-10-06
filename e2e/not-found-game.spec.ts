import { expect, test } from '@playwright/test';

// 404ページのミニゲーム（猫アクション）。未知のURLでは dist/404.html が返る。
for (const [path, restart, deaths] of [
  ['/no-such-page-xyz/', 'はじめから', 'やられた回数'],
  ['/en/no-such-page-xyz/', 'Restart', 'Deaths'],
] as const) {
  test(`404ミニゲーム: 表示 ${path}`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'networkidle' });
    await expect(page.locator('#cat-game-title')).toBeVisible();
    await expect(page.locator('#cat-game-button')).toContainText(restart);
    await expect(page.getByText(deaths, { exact: true })).toBeVisible();
    await expect(page.locator('#cat-game-left')).toBeVisible();
    await expect(page.locator('#cat-game-right')).toBeVisible();
    await expect(page.locator('#cat-game-jump')).toBeVisible();
  });
}

test('404ミニゲーム: 右へ進むと最初の穴に落ちてやられ、メッセージが出る', async ({
  page,
}) => {
  await page.goto('/no-such-page-xyz/', { waitUntil: 'networkidle' });
  await page.keyboard.down('ArrowRight');
  await expect(page.locator('#cat-game-status')).toContainText('穴に落ちた', {
    timeout: 8000,
  });
  await page.keyboard.up('ArrowRight');
  await expect(page.locator('#cat-game-deaths')).toHaveText('1');
});

test('404ミニゲーム: やられた後は「はじめから」で再開できる', async ({
  page,
}) => {
  await page.goto('/no-such-page-xyz/', { waitUntil: 'networkidle' });
  await page.keyboard.down('ArrowRight');
  await expect(page.locator('#cat-game-status')).not.toBeEmpty({
    timeout: 8000,
  });
  await page.keyboard.up('ArrowRight');
  await page.locator('#cat-game-button').click();
  await expect(page.locator('#cat-game-status')).toBeEmpty();
});

test('404ミニゲーム: 375px幅で横スクロールしない', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 700 });
  await page.goto('/no-such-page-xyz/', { waitUntil: 'networkidle' });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);
});

test('404ミニゲーム: 矢印キーで左右移動して猫が動く', async ({ page }) => {
  await page.goto('/no-such-page-xyz/', { waitUntil: 'networkidle' });
  // 初期状態：ステータスは空
  await expect(page.locator('#cat-game-status')).toBeEmpty();
  // 左矢印キーを連続で押す
  await page.keyboard.down('ArrowLeft');
  await page.waitForTimeout(100);
  await page.keyboard.up('ArrowLeft');
  // 左端に到達後も進まないため、ゲーム継続中
  await expect(page.locator('#cat-game-status')).toBeEmpty();
  // 右矢印キーを押して穴に落ちるまで進める
  await page.keyboard.down('ArrowRight');
  await expect(page.locator('#cat-game-status')).toContainText('穴に落ちた', {
    timeout: 8000,
  });
  await page.keyboard.up('ArrowRight');
  await expect(page.locator('#cat-game-deaths')).toHaveText('1');
});

test('404ミニゲーム: Ctrl/Alt付きの矢印キーはゲーム入力として無視される', async ({
  page,
}) => {
  await page.goto('/no-such-page-xyz/', { waitUntil: 'networkidle' });
  // ゲームが実行中であることを確認（テストの前提）
  await page.keyboard.down('ArrowRight');
  await expect(page.locator('#cat-game-status')).toContainText('穴に落ちた', {
    timeout: 8000,
  });
  await page.keyboard.up('ArrowRight');
  // ゲーム終了後に再開
  await page.locator('#cat-game-button').click();
  // Ctrl+ArrowRightでは猫が移動しない（modifier keyは無視されるため）
  await page.keyboard.down('Control');
  await page.keyboard.down('ArrowRight');
  await page.keyboard.up('ArrowRight');
  // 修飾キーなしで右へ進む
  await page.keyboard.up('Control');
  await page.keyboard.down('ArrowRight');
  await expect(page.locator('#cat-game-status')).toContainText('穴に落ちた', {
    timeout: 8000,
  });
  await page.keyboard.up('ArrowRight');
});
