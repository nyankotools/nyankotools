import { test, expect } from './helpers/test';

test.describe('キーボードテスト', () => {
  test('キーを押すと図のキーが光り、離すと「押した」状態になる', async ({
    page,
  }) => {
    await page.goto('/tools/keyboard-tester/');
    await page.locator('#kbd-area').focus();
    const keyA = page.locator('[data-kbd-key="KeyA"]');
    await expect(keyA).not.toHaveAttribute('data-state', /.+/);

    await page.keyboard.down('a');
    await expect(keyA).toHaveAttribute('data-state', 'down');
    await expect(page.locator('#kbd-info-code')).toHaveText('KeyA');
    await expect(page.locator('#kbd-progress')).toHaveText('1 / 104');

    await page.keyboard.up('a');
    await expect(keyA).toHaveAttribute('data-state', 'pressed');
    await expect(page.locator('#kbd-progress')).toHaveText('1 / 104');
  });

  test('左右のShiftは別のキーとして判定され、位置が表示される', async ({
    page,
  }) => {
    await page.goto('/tools/keyboard-tester/');
    await page.locator('#kbd-area').focus();
    await page.keyboard.press('ShiftRight');
    await expect(page.locator('[data-kbd-key="ShiftRight"]')).toHaveAttribute(
      'data-state',
      'pressed',
    );
    await expect(
      page.locator('[data-kbd-key="ShiftLeft"]'),
    ).not.toHaveAttribute('data-state', /.+/);
    await expect(page.locator('#kbd-info-location')).toHaveText('右');
  });

  test('テスト中はスペースキーでページがスクロールしない', async ({ page }) => {
    await page.goto('/tools/keyboard-tester/');
    await page.locator('#kbd-area').focus();
    await page.keyboard.press('Space');
    await expect(page.locator('[data-kbd-key="Space"]')).toHaveAttribute(
      'data-state',
      'pressed',
    );
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });

  test('配置にないキーは「配置図にないキー」に表示される', async ({ page }) => {
    await page.goto('/tools/keyboard-tester/');
    const kbdArea = page.locator('#kbd-area');
    await kbdArea.focus();
    // IntlYen をシミュレート（Playwrightが直接サポートしないキーなのでdispatchEventで）
    await page.evaluate(() => {
      const event = new KeyboardEvent('keydown', {
        code: 'IntlYen',
        key: '¥',
        bubbles: true,
        cancelable: true,
      });
      document.getElementById('kbd-area')?.dispatchEvent(event);
    });
    await expect(page.locator('#kbd-other li')).toHaveCount(1);
    await expect(page.locator('#kbd-other')).toContainText('IntlYen');
    await expect(page.locator('#kbd-progress')).toHaveText('0 / 104');
  });

  test('リセットで状態が初期化される', async ({ page }) => {
    await page.goto('/tools/keyboard-tester/');
    await page.locator('#kbd-area').focus();
    await page.keyboard.press('KeyQ');
    await expect(page.locator('#kbd-progress')).toHaveText('1 / 104');
    await page.locator('#kbd-reset').click();
    await expect(page.locator('#kbd-progress')).toHaveText('0 / 104');
    await expect(page.locator('[data-kbd-key="KeyQ"]')).not.toHaveAttribute(
      'data-state',
      /.+/,
    );
    await expect(page.locator('#kbd-info-code')).toHaveText('-');
  });

  test('英語版でも動作する', async ({ page }) => {
    await page.goto('/en/tools/keyboard-tester/');
    await page.locator('#kbd-area').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-kbd-key="Enter"]')).toHaveAttribute(
      'data-state',
      'pressed',
    );
  });
});
