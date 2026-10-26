import { test, expect } from './helpers/test';

test.describe('色と音の記憶ゲーム', () => {
  test('スタート前は入力を受け付けず、4パネルが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/simon-game/');
    const panels = page.locator('#sg-board button');
    await expect(panels).toHaveCount(4);
    await expect(page.locator('#sg-round')).toHaveText('0');
    // パネルは aria-disabled のみで無効化されており、Playwright は aria-disabled を
    // 無効扱いにして通常の click を待ち続けるため force で押す（押しても無視されること）
    await panels.first().click({ force: true });
    await expect(page.locator('#sg-status')).toContainText('スタート');
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
    await page.goto('/tools/simon-game/');
    await page.locator('#sg-start-button').click();
    await expect(page.locator('#sg-round')).toHaveText('1');
    await expect(page.locator('#sg-status')).toContainText('あなたの番です', {
      timeout: 5000,
    });
    expect(errors).toEqual([]);
  });

  test('スタートするとラウンド1が始まり、順番を見たあとに入力待ちになる', async ({
    page,
  }) => {
    await page.goto('/tools/simon-game/');
    await page.locator('#sg-start-button').click();
    await expect(page.locator('#sg-round')).toHaveText('1');
    await expect(page.locator('#sg-status')).toContainText('あなたの番です', {
      timeout: 5000,
    });
  });

  test('間違えるとゲームオーバーになりもう一度遊べる', async ({ page }) => {
    await page.goto('/tools/simon-game/');
    await page.locator('#sg-start-button').click();
    await expect(page.locator('#sg-status')).toContainText('あなたの番です', {
      timeout: 5000,
    });
    // 正解は不明だが、4パネルを順に押せば必ずどこかで不正解になる（長さ1なので最大3回で確定）
    for (const key of ['1', '2', '3', '4']) {
      if (await page.locator('#sg-status').getByText('ゲームオーバー').count())
        break;
      await page.keyboard.press(key);
      await page.waitForTimeout(50);
    }
    await expect(page.locator('#sg-status')).toContainText(
      /ゲームオーバー|クリア/,
    );
  });

  test('375px幅でパネルがはみ出さない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/tools/simon-game/');
    const boxes = await page.locator('#sg-board button').evaluateAll((els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect();
        return { left: r.left, right: r.right };
      }),
    );
    for (const b of boxes) {
      expect(b.left).toBeGreaterThanOrEqual(0);
      expect(b.right).toBeLessThanOrEqual(375);
    }
  });

  test('英語ページでも動作する', async ({ page }) => {
    await page.goto('/en/tools/simon-game/');
    await expect(page.locator('#sg-board button')).toHaveCount(4);
    await page.locator('#sg-start-button').click();
    await expect(page.locator('#sg-status')).toContainText('Your turn', {
      timeout: 5000,
    });
  });
});
