import { test, expect } from './helpers/test';

test.describe('CSS box-shadowジェネレーター（日本語版）', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/tools/css-box-shadow-generator/');

    await expect(page.locator('main h1')).toHaveText(
      'CSS box-shadowジェネレーター',
    );
    await expect(page.locator('#bs-preview')).toBeVisible();
    await expect(page.locator('#bs-css-output')).toBeVisible();
  });

  test('初期状態で正しいCSSが生成される', async ({ page }) => {
    await page.goto('/tools/css-box-shadow-generator/');

    await expect(page.locator('#bs-css-output')).toHaveValue(
      'box-shadow: 0px 4px 8px 0px #000000;',
    );
  });

  test('オフセットを変更すると出力CSSが更新される', async ({ page }) => {
    await page.goto('/tools/css-box-shadow-generator/');

    await page.locator('[data-offset-x]').first().fill('10');
    await page.locator('[data-offset-y]').first().fill('20');

    await expect(page.locator('#bs-css-output')).toHaveValue(/10px 20px/);
  });

  test('ぼかし・広がりを変更すると出力CSSが更新される', async ({ page }) => {
    await page.goto('/tools/css-box-shadow-generator/');

    await page.locator('[data-blur]').first().fill('16');
    await page.locator('[data-spread]').first().fill('-4');

    await expect(page.locator('#bs-css-output')).toHaveValue(/16px -4px/);
  });

  test('色を変更すると出力CSSが更新される', async ({ page }) => {
    await page.goto('/tools/css-box-shadow-generator/');

    await page.locator('[data-color]').first().fill('#ff0000');

    await expect(page.locator('#bs-css-output')).toHaveValue(/#ff0000/);
  });

  test('insetを有効にすると出力CSSに`inset`が付与される', async ({ page }) => {
    await page.goto('/tools/css-box-shadow-generator/');

    await page.locator('[data-inset]').first().check();

    await expect(page.locator('#bs-css-output')).toHaveValue(
      /inset 0px 4px 8px 0px #000000/,
    );
  });

  test('範囲外のオフセット値は自動的にクランプされる', async ({ page }) => {
    await page.goto('/tools/css-box-shadow-generator/');

    const offsetX = page.locator('[data-offset-x]').first();
    await offsetX.fill('500');
    await offsetX.blur();

    await expect(offsetX).toHaveValue('200');
  });

  test('シャドウレイヤーが1個の状態では削除ボタンが無効化される', async ({
    page,
  }) => {
    await page.goto('/tools/css-box-shadow-generator/');

    await expect(page.locator('[data-remove]')).toBeDisabled();
  });

  test('シャドウを追加すると2個になり削除ボタンが有効になる', async ({
    page,
  }) => {
    await page.goto('/tools/css-box-shadow-generator/');

    await page.locator('#bs-add-shadow-button').click();

    const rows = page.locator('[data-shadow-row]');
    await expect(rows).toHaveCount(2);

    const removeButtons = page.locator('[data-remove]');
    for (let i = 0; i < (await removeButtons.count()); i++) {
      await expect(removeButtons.nth(i)).not.toBeDisabled();
    }

    await expect
      .poll(
        async () =>
          (await page.locator('#bs-css-output').inputValue()).split(',').length,
      )
      .toBe(2);
  });

  test('シャドウレイヤーを6個まで追加できるが、それ以上は追加ボタンが無効になる', async ({
    page,
  }) => {
    await page.goto('/tools/css-box-shadow-generator/');

    const addButton = page.locator('#bs-add-shadow-button');

    for (let i = 0; i < 5; i++) {
      await expect(addButton).not.toBeDisabled();
      await addButton.click();
    }

    await expect(addButton).toBeDisabled();
    await expect(page.locator('[data-shadow-row]')).toHaveCount(6);
  });

  test('シャドウレイヤーを削除するとCSSが更新される', async ({ page }) => {
    await page.goto('/tools/css-box-shadow-generator/');

    await page.locator('#bs-add-shadow-button').click();
    await page.locator('[data-remove]').last().click();

    await expect
      .poll(
        async () =>
          (await page.locator('#bs-css-output').inputValue()).split(',').length,
      )
      .toBe(1);
    await expect(page.locator('[data-remove]')).toBeDisabled();
  });

  test('プレビューのbox-shadowスタイルが設定される', async ({ page }) => {
    await page.goto('/tools/css-box-shadow-generator/');

    const style = await page.locator('#bs-preview').getAttribute('style');
    expect(style).toContain('box-shadow');
  });

  test('コピーボタンでCSSをコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/css-box-shadow-generator/');

    const cssOutput = await page.locator('#bs-css-output').inputValue();
    await page.locator('#bs-copy-button').click();

    await expect(page.locator('#bs-status')).toHaveText('コピーしました');

    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toBe(cssOutput);
  });
});

test.describe('CSS box-shadowジェネレーター（アクセシビリティ・レイアウト）', () => {
  test('375px幅でもシャドウ行が崩れずに表示される', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/tools/css-box-shadow-generator/');

    const shadowRow = page.locator('[data-shadow-row]').first();
    await expect(shadowRow).toBeVisible();

    // シャドウ行内のすべての入力要素が見える（flex-wrapで折り返される）
    const offsetXInput = shadowRow.locator('[data-offset-x]');
    const offsetYInput = shadowRow.locator('[data-offset-y]');
    const colorInput = shadowRow.locator('[data-color]');
    const insetCheckbox = shadowRow.locator('[data-inset]');
    const removeButton = shadowRow.locator('[data-remove]');

    await expect(offsetXInput).toBeVisible();
    await expect(offsetYInput).toBeVisible();
    await expect(colorInput).toBeVisible();
    await expect(insetCheckbox).toBeVisible();
    await expect(removeButton).toBeVisible();
  });

  test('375px幅で追加・削除ボタンが機能する', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/tools/css-box-shadow-generator/');

    const addButton = page.locator('#bs-add-shadow-button');
    await expect(addButton).toBeVisible();
    await addButton.click();

    await expect(page.locator('[data-shadow-row]')).toHaveCount(2);

    const removeButton = page.locator('[data-remove]').first();
    await removeButton.click();

    await expect(page.locator('[data-shadow-row]')).toHaveCount(1);
  });

  test('キーボード操作でTab移動できる', async ({ page }) => {
    await page.goto('/tools/css-box-shadow-generator/');

    // シャドウ行の最初の入力要素にフォーカス
    const offsetXInput = page.locator('[data-offset-x]').first();
    await offsetXInput.focus();
    await expect(offsetXInput).toBeFocused();

    // Tabキーで次の入力へ移動
    await page.keyboard.press('Tab');
    const offsetYInput = page.locator('[data-offset-y]').first();
    await expect(offsetYInput).toBeFocused();
  });

  test('色入力のaria-labelが正しく設定されている', async ({ page }) => {
    await page.goto('/tools/css-box-shadow-generator/');

    const colorInput = page.locator('[data-color]').first();
    const ariaLabel = await colorInput.getAttribute('aria-label');
    expect(ariaLabel).toBe('色');
  });

  test('ステータスメッセージがaria-live="polite"で設定されている', async ({
    page,
  }) => {
    await page.goto('/tools/css-box-shadow-generator/');

    const statusEl = page.locator('#bs-status');
    const ariaLive = await statusEl.getAttribute('aria-live');
    expect(ariaLive).toBe('polite');
  });

  test('英語版でもaria-labelが正しい', async ({ page }) => {
    await page.goto('/en/tools/css-box-shadow-generator/');

    const colorInput = page.locator('[data-color]').first();
    const ariaLabel = await colorInput.getAttribute('aria-label');
    expect(ariaLabel).toBe('Color');
  });
});

test.describe('CSS Box-Shadow Generator (Dark mode)', () => {
  test('ダークモード（dark-class）で正しく表示される', async ({ page }) => {
    await page.goto('/tools/css-box-shadow-generator/');

    // 手動でダークモードを有効化（html に dark クラスを追加）
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });

    // ページ要素がダークモード対応のクラスで表示されていることを確認
    const container = page.locator('#bs-preview-container');
    const classes = await container.getAttribute('class');
    expect(classes).toContain('dark:');

    // プレビューとCSSボタンが見える
    await expect(page.locator('#bs-preview')).toBeVisible();
    await expect(page.locator('#bs-copy-button')).toBeVisible();
  });

  test('ダークモード時もプレビューが正しく機能する', async ({ page }) => {
    await page.goto('/tools/css-box-shadow-generator/');

    // ダークモード有効化
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });

    // オフセット変更してプレビューが更新されることを確認
    await page.locator('[data-offset-x]').first().fill('10');
    await expect(page.locator('#bs-css-output')).toHaveValue(/10px/);
  });

  test('ダークモード時のテキストが見える', async ({ page }) => {
    await page.goto('/tools/css-box-shadow-generator/');

    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });

    const h1 = page.locator('main h1');
    await expect(h1).toBeVisible();
    const text = await h1.textContent();
    expect(text).toBe('CSS box-shadowジェネレーター');
  });
});

test.describe('CSS Box-Shadow Generator (English)', () => {
  test('displays correctly in English', async ({ page }) => {
    await page.goto('/en/tools/css-box-shadow-generator/');

    await expect(page.locator('main h1')).toHaveText(
      'CSS Box-Shadow Generator',
    );
  });

  test('initial CSS output in English', async ({ page }) => {
    await page.goto('/en/tools/css-box-shadow-generator/');

    await expect(page.locator('#bs-css-output')).toHaveValue(
      'box-shadow: 0px 4px 8px 0px #000000;',
    );
  });

  test('add shadow button in English', async ({ page }) => {
    await page.goto('/en/tools/css-box-shadow-generator/');

    await page.locator('#bs-add-shadow-button').click();
    await expect(page.locator('[data-shadow-row]')).toHaveCount(2);
  });

  test('offset clamping works in English', async ({ page }) => {
    await page.goto('/en/tools/css-box-shadow-generator/');

    const offsetY = page.locator('[data-offset-y]').first();
    await offsetY.fill('-500');
    await offsetY.blur();

    await expect(offsetY).toHaveValue('-200');
  });

  test('copy button displays copied message in English', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/en/tools/css-box-shadow-generator/');

    await page.locator('#bs-copy-button').click();
    await expect(page.locator('#bs-status')).toHaveText('Copied');
  });

  test('keyboard navigation works in English', async ({ page }) => {
    await page.goto('/en/tools/css-box-shadow-generator/');

    const offsetXInput = page.locator('[data-offset-x]').first();
    await offsetXInput.focus();
    await expect(offsetXInput).toBeFocused();

    await page.keyboard.press('Tab');
    const offsetYInput = page.locator('[data-offset-y]').first();
    await expect(offsetYInput).toBeFocused();
  });

  test('375px layout works in English', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/en/tools/css-box-shadow-generator/');

    const addButton = page.locator('#bs-add-shadow-button');
    await expect(addButton).toBeVisible();
    await addButton.click();

    const removeButtons = page.locator('[data-remove]');
    await expect(removeButtons.first()).not.toBeDisabled();
    await expect(removeButtons.first()).toBeVisible();
  });
});
