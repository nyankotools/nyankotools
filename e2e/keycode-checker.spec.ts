import { test, expect } from '@playwright/test';

test.describe('キーコード（e.code/e.key）チェッカー（日本語版）', () => {
  test('直接アクセスして正しく表示され、初期状態はプレースホルダーのみ表示される', async ({
    page,
  }) => {
    await page.goto('/tools/keycode-checker/');

    await expect(page.locator('main h1')).toHaveText(
      'キーコード（e.code/e.key）チェッカー',
    );
    await expect(page.locator('#keycode-placeholder')).toBeVisible();
    await expect(page.locator('#keycode-result')).toBeHidden();
  });

  test('キーを押すとevent.key/event.code/keyCode/location/修飾キー/リピートが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/keycode-checker/');

    await page.locator('#keycode-capture').click();
    await page.keyboard.press('a');

    await expect(page.locator('#keycode-placeholder')).toBeHidden();
    await expect(page.locator('#keycode-result')).toBeVisible();
    await expect(page.locator('#keycode-key')).toHaveText('a');
    await expect(page.locator('#keycode-code')).toHaveText('KeyA');
    await expect(page.locator('#keycode-keycode')).toHaveText('65');
    await expect(page.locator('#keycode-location')).toHaveText('0（標準）');
    await expect(page.locator('#keycode-modifiers')).toHaveText('なし');
    await expect(page.locator('#keycode-repeat')).toHaveText('いいえ');

    const historyItems = page.locator('#keycode-history li');
    await expect(historyItems).toHaveCount(1);
    await expect(historyItems.first()).toHaveText('KeyA（a）');
  });

  test('Shift+Aのように修飾キーを押しながらキーを押すと修飾キーの状態が表示される', async ({
    page,
  }) => {
    await page.goto('/tools/keycode-checker/');

    await page.locator('#keycode-capture').click();
    // down/up('Shift')でShift修飾キーを押した状態を作り、その間に'a'キーを押す。
    // CDP経由の合成イベントではevent.keyは（実機と異なり）'a'のまま大文字化されないが、
    // shiftKeyフラグは正しくtrueになるため、修飾キー表示のテストとしては有効。
    await page.keyboard.down('Shift');
    await page.keyboard.press('a');
    await page.keyboard.up('Shift');

    await expect(page.locator('#keycode-key')).toHaveText('a');
    await expect(page.locator('#keycode-code')).toHaveText('KeyA');
    await expect(page.locator('#keycode-modifiers')).toHaveText('Shift');
  });

  test('スペースキーを押すとSpace（" "）として表示される', async ({ page }) => {
    await page.goto('/tools/keycode-checker/');

    await page.locator('#keycode-capture').click();
    await page.keyboard.press('Space');

    await expect(page.locator('#keycode-key')).toHaveText('Space（" "）');
    await expect(page.locator('#keycode-code')).toHaveText('Space');

    const historyItems = page.locator('#keycode-history li');
    await expect(historyItems.first()).toHaveText('Space（Space（" "））');
  });

  test('履歴は最大10件までしか保持されず、クリアボタンで空になる', async ({
    page,
  }) => {
    await page.goto('/tools/keycode-checker/');

    await page.locator('#keycode-capture').click();
    const keys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'];
    for (const key of keys) {
      await page.keyboard.press(key);
    }

    const historyItems = page.locator('#keycode-history li');
    await expect(historyItems).toHaveCount(10);
    // 直近10件のみ保持されるため、最初に押したa/bは残っていないはず
    await expect(page.locator('#keycode-history')).not.toContainText(
      'KeyA（a）',
    );
    await expect(page.locator('#keycode-history')).toContainText('KeyL（l）');

    await page.locator('#keycode-clear-button').click();
    await expect(historyItems).toHaveCount(0);
  });

  test('長押し（リピート）中のkeydownは履歴に追加されない', async ({
    page,
  }) => {
    await page.goto('/tools/keycode-checker/');

    const capture = page.locator('#keycode-capture');
    await capture.click();

    // ブラウザの自動リピートは物理的なキー押下でしか発生しないため、
    // 実装のrepeatハンドリングを検証する目的でrepeat: trueのKeyboardEventを直接発火する。
    await page.evaluate(() => {
      const el = document.getElementById('keycode-capture')!;
      el.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'a',
          code: 'KeyA',
          keyCode: 65,
          repeat: true,
          bubbles: true,
          cancelable: true,
        }),
      );
    });

    await expect(page.locator('#keycode-repeat')).toHaveText('はい（長押し）');
    await expect(page.locator('#keycode-history li')).toHaveCount(0);
  });

  test('Escapeキーを押すとフォーカスが外れ、その後Tabキーで通常通りフォーカス移動できる', async ({
    page,
  }) => {
    await page.goto('/tools/keycode-checker/');

    const capture = page.locator('#keycode-capture');
    await capture.click();
    await expect(capture).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(capture).not.toBeFocused();

    // フォーカスがbody等に外れた状態からTabで移動できる（キーボードトラップが解消されている）
    await page.keyboard.press('Tab');
    await expect(capture).not.toBeFocused();
  });

  test('サイドバーからツールページへ遷移できる', async ({ page }) => {
    await page.goto('/');

    await page
      .locator('#sidebar details[data-category="開発"] summary')
      .click();
    await page
      .locator('#sidebar')
      .getByRole('link', { name: 'キーコード（e.code/e.key）チェッカー' })
      .click();

    await expect(page).toHaveURL(/\/tools\/keycode-checker\/?$/);
    await expect(page.locator('main h1')).toHaveText(
      'キーコード（e.code/e.key）チェッカー',
    );
  });

  test('375px幅でも横スクロールが発生しない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/tools/keycode-checker/');

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
});

test.describe('Keycode (e.code / e.key) Checker (English)', () => {
  test('英語版が正しく表示され、キー入力でkey/code/repeatが更新される', async ({
    page,
  }) => {
    await page.goto('/en/tools/keycode-checker/');

    await expect(page.locator('main h1')).toHaveText(
      'Keycode (e.code / e.key) Checker',
    );
    await expect(page.locator('#keycode-placeholder')).toBeVisible();
    await expect(page.locator('#keycode-result')).toBeHidden();

    await page.locator('#keycode-capture').click();
    await page.keyboard.press('a');

    await expect(page.locator('#keycode-key')).toHaveText('a');
    await expect(page.locator('#keycode-code')).toHaveText('KeyA');
    await expect(page.locator('#keycode-repeat')).toHaveText('No');
  });

  test('locationラベルが英語で表示される', async ({ page }) => {
    await page.goto('/en/tools/keycode-checker/');

    await page.locator('#keycode-capture').click();
    await page.keyboard.press('a');

    await expect(page.locator('#keycode-location')).toHaveText('0 (standard)');
  });

  test('修飾キーなしのとき、英語で"None"と表示される', async ({ page }) => {
    await page.goto('/en/tools/keycode-checker/');

    await page.locator('#keycode-capture').click();
    await page.keyboard.press('a');

    await expect(page.locator('#keycode-modifiers')).toHaveText('None');
  });

  test('スペースキーを押すとSpace (" ")として表示される', async ({ page }) => {
    await page.goto('/en/tools/keycode-checker/');

    await page.locator('#keycode-capture').click();
    await page.keyboard.press('Space');

    await expect(page.locator('#keycode-key')).toHaveText('Space (" ")');
  });

  test('サイドバーからツールページへ遷移できる', async ({ page }) => {
    await page.goto('/en/');

    await page
      .locator('#sidebar details[data-category="Development"] summary')
      .click();
    await page
      .locator('#sidebar')
      .getByRole('link', { name: 'Keycode (e.code / e.key) Checker' })
      .click();

    await expect(page).toHaveURL(/\/en\/tools\/keycode-checker\/?$/);
    await expect(page.locator('main h1')).toHaveText(
      'Keycode (e.code / e.key) Checker',
    );
  });

  test('375px幅でも横スクロールが発生しない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/en/tools/keycode-checker/');

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
});
