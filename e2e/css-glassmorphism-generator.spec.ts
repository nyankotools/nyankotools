import { test, expect } from './helpers/test';

test.describe('CSSグラスモーフィズム・ニューモーフィズムジェネレーター', () => {
  test('初期状態でグラスのCSSが生成される', async ({ page }) => {
    await page.goto('/tools/css-glassmorphism-generator/');

    const out = page.locator('#gm-css-output');
    await expect(out).toHaveValue(/background: rgba\(255, 255, 255, 0\.25\);/);
    await expect(out).toHaveValue(
      /backdrop-filter: blur\(10px\) saturate\(150%\);/,
    );
    await expect(out).toHaveValue(/-webkit-backdrop-filter: blur\(10px\)/);
  });

  test('ぼかしスライダーを変更するとCSSが更新される', async ({ page }) => {
    await page.goto('/tools/css-glassmorphism-generator/');

    await page.locator('#gm-g-blur').fill('20');
    await expect(page.locator('#gm-css-output')).toHaveValue(/blur\(20px\)/);
  });

  test('質感プリセットで設定が切り替わる', async ({ page }) => {
    await page.goto('/tools/css-glassmorphism-generator/');

    await page.locator('[data-preset="dark"]').click();
    await expect(page.locator('#gm-css-output')).toHaveValue(
      /background: rgba\(0, 0, 0, 0\.3\);/,
    );
  });

  test('ニューモーフィズムに切り替えて形状を変更できる', async ({ page }) => {
    await page.goto('/tools/css-glassmorphism-generator/');

    await page.locator('#gm-mode-neu').click();
    await expect(page.locator('#gm-neu-panel')).toBeVisible();
    await expect(page.locator('#gm-glass-panel')).toBeHidden();
    await expect(page.locator('#gm-css-output')).toHaveValue(
      /box-shadow: 10px 10px 20px #[0-9a-f]{6}, -10px -10px 20px #[0-9a-f]{6};/,
    );

    await page.locator('[data-shape="pressed"]').click();
    await expect(page.locator('#gm-css-output')).toHaveValue(
      /box-shadow: inset 10px 10px 20px/,
    );

    await page.locator('[data-shape="convex"]').click();
    await expect(page.locator('#gm-css-output')).toHaveValue(
      /linear-gradient\(145deg/,
    );
  });

  test('コピーボタンでCSSをコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/css-glassmorphism-generator/');

    const css = await page.locator('#gm-css-output').inputValue();
    await page.locator('#gm-copy-button').click();
    await expect(page.locator('#gm-status')).toHaveText('コピーしました');
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    // Windows のクリップボードは LF を CRLF に変換するため正規化して比較する
    expect(copied.replace(/\r\n/g, '\n')).toBe(css);
  });
});

test.describe('CSS Glassmorphism & Neumorphism Generator (English)', () => {
  test('switches mode and copies', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/en/tools/css-glassmorphism-generator/');

    await page.locator('#gm-mode-neu').click();
    await page.locator('#gm-n-distance').fill('20');
    await expect(page.locator('#gm-css-output')).toHaveValue(/20px 20px/);

    await page.locator('#gm-copy-button').click();
    await expect(page.locator('#gm-status')).toHaveText('Copied');
  });
});
