import { test, expect } from './helpers/test';

test.describe('CSSボタン・トグルスイッチ・三角形ジェネレーター', () => {
  test('初期状態でボタンのHTMLとCSSが生成される', async ({ page }) => {
    await page.goto('/tools/css-button-generator/');

    await expect(page.locator('#cb-html-output')).toHaveValue(
      /<button type="button" class="nk-btn">ボタン<\/button>/,
    );
    await expect(page.locator('#cb-css-output')).toHaveValue(
      /background-color: #2563eb;/,
    );
    await expect(page.locator('#cb-css-output')).toHaveValue(/\.nk-btn:hover/);
    await expect(page.locator('#cb-preview button')).toBeVisible();
  });

  test('テーマ色を変えるとCSSとコントラスト表示が更新される', async ({
    page,
  }) => {
    await page.goto('/tools/css-button-generator/');

    await page.locator('#cb-color-hex').fill('#ffff00');
    await expect(page.locator('#cb-css-output')).toHaveValue(
      /background-color: #ffff00;/,
    );
    await expect(page.locator('#cb-css-output')).toHaveValue(/color: #111827;/);
    await expect(page.locator('#cb-contrast-normal')).toContainText(
      /^1\d\.\d\d : 1/,
    );
  });

  test('不正な色コードは反映されない', async ({ page }) => {
    await page.goto('/tools/css-button-generator/');

    await page.locator('#cb-color-hex').fill('red;} body{display:none');
    await expect(page.locator('#cb-css-output')).not.toHaveValue(/body/);
    await expect(page.locator('#cb-css-output')).toHaveValue(/#2563eb/);
  });

  test('プレビューのホバーが実際に反映される', async ({ page }) => {
    await page.goto('/tools/css-button-generator/');

    const btn = page.locator('#cb-preview button');
    await expect(btn).toHaveCSS('background-color', 'rgb(37, 99, 235)');
    await btn.hover();
    await expect(btn).not.toHaveCSS('background-color', 'rgb(37, 99, 235)');
  });

  test('トグルスイッチに切り替えるとcheckbox構造になり、クリックで切り替わる', async ({
    page,
  }) => {
    await page.goto('/tools/css-button-generator/');

    await page.locator('[data-kind="toggle"]').click();
    await expect(page.locator('#cb-html-output')).toHaveValue(
      /type="checkbox"/,
    );
    await expect(page.locator('#cb-css-output')).toHaveValue(/:checked/);
    const track = page.locator('#cb-preview .nk-toggle__track');
    await expect(track).toHaveCSS('background-color', 'rgb(37, 99, 235)');
    await track.click();
    // クリック後もポインターは上にあるため、オフ状態のホバー色になる
    await expect(track).toHaveCSS('background-color', 'rgb(148, 163, 184)');
  });

  test('三角形の向きを変えるとborderが変わる', async ({ page }) => {
    await page.goto('/tools/css-button-generator/');

    await page.locator('[data-kind="triangle"]').click();
    await page.locator('#cb-direction').selectOption('up');
    await expect(page.locator('#cb-css-output')).toHaveValue(
      /border-width: 0 20px 35px 20px;/,
    );
  });

  test('コピーボタンでCSSをコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/css-button-generator/');

    const css = await page.locator('#cb-css-output').inputValue();
    await page.locator('#cb-copy-css-button').click();
    await expect(page.locator('#cb-status')).toHaveText('コピーしました');
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied.replace(/\r\n/g, '\n')).toBe(css);
  });
});

test.describe('CSS Button & Toggle Switch Generator (English)', () => {
  test('switches to arrow and copies the HTML', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/en/tools/css-button-generator/');

    await page.locator('[data-kind="arrow"]').click();
    await page.locator('#cb-direction').selectOption('down');
    await expect(page.locator('#cb-css-output')).toHaveValue(
      /rotate\(135deg\)/,
    );

    await page.locator('#cb-copy-html-button').click();
    await expect(page.locator('#cb-status')).toHaveText('Copied');
  });
});
