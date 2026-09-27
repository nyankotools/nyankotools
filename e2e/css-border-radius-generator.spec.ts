import { test, expect } from '@playwright/test';

test.describe('CSS border-radiusジェネレーター（日本語版）', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/tools/css-border-radius-generator/');

    await expect(page.locator('main h1')).toHaveText(
      'CSS border-radiusジェネレーター',
    );
    await expect(page.locator('#br-preview')).toBeVisible();
    await expect(page.locator('#br-css-output')).toBeVisible();
  });

  test('初期状態で正しいCSSが生成される', async ({ page }) => {
    await page.goto('/tools/css-border-radius-generator/');

    const cssOutput = await page.locator('#br-css-output').inputValue();
    expect(cssOutput).toBe('border-radius: 8px;');
  });

  test('左上の値を変更するとCSSが更新される', async ({ page }) => {
    await page.goto('/tools/css-border-radius-generator/');

    await page.locator('#br-top-left').fill('16');

    const cssOutput = await page.locator('#br-css-output').inputValue();
    expect(cssOutput).toContain('16px');
  });

  test('4隅がすべて同じ値の場合は単一値に短縮される', async ({ page }) => {
    await page.goto('/tools/css-border-radius-generator/');

    // まず連動チェックボックスをOFFにして個別編集可能にする
    await page.locator('#br-link-corners').uncheck();

    await page.locator('#br-top-left').fill('12');
    await page.locator('#br-top-right').fill('12');
    await page.locator('#br-bottom-right').fill('12');
    await page.locator('#br-bottom-left').fill('12');

    const cssOutput = await page.locator('#br-css-output').inputValue();
    expect(cssOutput).toBe('border-radius: 12px;');
  });

  test('4隅が異なる場合は全値が出力される', async ({ page }) => {
    await page.goto('/tools/css-border-radius-generator/');

    // まず連動チェックボックスをOFFにして個別編集可能にする
    await page.locator('#br-link-corners').uncheck();

    await page.locator('#br-top-left').fill('4');
    await page.locator('#br-top-right').fill('8');
    await page.locator('#br-bottom-right').fill('16');
    await page.locator('#br-bottom-left').fill('32');

    const cssOutput = await page.locator('#br-css-output').inputValue();
    expect(cssOutput).toBe('border-radius: 4px 8px 16px 32px;');
  });

  test('4隅を連動させるチェックボックスをONにすると左上の値が他3隅に伝播する', async ({
    page,
  }) => {
    await page.goto('/tools/css-border-radius-generator/');

    // 連動チェックボックスをまずOFFにして個別編集可能にする
    await page.locator('#br-link-corners').uncheck();

    // 最初に4隅をすべて異なる値に設定
    await page.locator('#br-top-left').fill('10');
    await page.locator('#br-top-right').fill('20');
    await page.locator('#br-bottom-right').fill('30');
    await page.locator('#br-bottom-left').fill('40');

    // 連動チェックボックスをONにする
    await page.locator('#br-link-corners').check();

    // 他の3つのinputが左上の値で上書きされる
    await expect(page.locator('#br-top-right')).toHaveValue('10');
    await expect(page.locator('#br-bottom-right')).toHaveValue('10');
    await expect(page.locator('#br-bottom-left')).toHaveValue('10');

    // CSSは単一値に短縮される
    const cssOutput = await page.locator('#br-css-output').inputValue();
    expect(cssOutput).toBe('border-radius: 10px;');
  });

  test('4隅を連動させるチェックボックスをONにすると他の3つのinputがdisabledになる', async ({
    page,
  }) => {
    await page.goto('/tools/css-border-radius-generator/');

    await page.locator('#br-link-corners').check();

    await expect(page.locator('#br-top-right')).toBeDisabled();
    await expect(page.locator('#br-bottom-right')).toBeDisabled();
    await expect(page.locator('#br-bottom-left')).toBeDisabled();
  });

  test('4隅を連動させるチェックボックスをOFFにすると各inputが個別編集可能になる', async ({
    page,
  }) => {
    await page.goto('/tools/css-border-radius-generator/');

    // ONにしてから
    await page.locator('#br-link-corners').check();
    await page.locator('#br-top-left').fill('20');

    // OFFにする
    await page.locator('#br-link-corners').uncheck();

    // disabledが解除される
    await expect(page.locator('#br-top-right')).not.toBeDisabled();
    await expect(page.locator('#br-bottom-right')).not.toBeDisabled();
    await expect(page.locator('#br-bottom-left')).not.toBeDisabled();

    // 個別に編集できる
    await page.locator('#br-top-right').fill('30');
    const cssOutput = await page.locator('#br-css-output').inputValue();
    expect(cssOutput).toContain('20px 30px 20px 20px');
  });

  test('単位をpxから%に切り替えるとクランプが行われる', async ({ page }) => {
    await page.goto('/tools/css-border-radius-generator/');

    // pxで500を設定
    await page.locator('#br-top-left').fill('500');
    await page.locator('#br-unit-select').selectOption('%');

    // %に切り替わると50（%の上限）にクランプされる
    await expect(page.locator('#br-top-left')).toHaveValue('50');

    const cssOutput = await page.locator('#br-css-output').inputValue();
    expect(cssOutput).toBe('border-radius: 50%;');
  });

  test('単位を%からpxに切り替えるとpxの値に調整される', async ({ page }) => {
    await page.goto('/tools/css-border-radius-generator/');

    // %を選択して50%を設定
    await page.locator('#br-unit-select').selectOption('%');
    await page.locator('#br-top-left').fill('50');

    // pxに戻す
    await page.locator('#br-unit-select').selectOption('px');

    // pxに切り替わる
    const cssOutput = await page.locator('#br-css-output').inputValue();
    expect(cssOutput).toContain('px');
  });

  test('範囲外の値はblur時にクランプされる', async ({ page }) => {
    await page.goto('/tools/css-border-radius-generator/');

    const input = page.locator('#br-top-left');
    await input.fill('600');
    await input.blur();

    // 500にクランプされる
    await expect(input).toHaveValue('500');
  });

  test('負の値は0にクランプされる', async ({ page }) => {
    await page.goto('/tools/css-border-radius-generator/');

    // 連動チェックボックスをOFFにして個別編集可能にする
    await page.locator('#br-link-corners').uncheck();

    const input = page.locator('#br-top-right');
    await input.fill('-50');
    await input.blur();

    await expect(input).toHaveValue('0');
  });

  test('プレビューボックスのborder-radiusスタイルが設定される', async ({
    page,
  }) => {
    await page.goto('/tools/css-border-radius-generator/');

    const style = await page.locator('#br-preview').getAttribute('style');
    expect(style).toContain('border-radius');
  });

  test('コピーボタンでCSSをコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/css-border-radius-generator/');

    const cssOutput = await page.locator('#br-css-output').inputValue();
    await page.locator('#br-copy-button').click();

    await expect(page.locator('#br-status')).toHaveText('コピーしました');

    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toBe(cssOutput);
  });

  test('複数の角を異なる値で設定したときのCSS出力順序が正しい', async ({
    page,
  }) => {
    await page.goto('/tools/css-border-radius-generator/');

    // 連動チェックボックスをOFFにして個別編集可能にする
    await page.locator('#br-link-corners').uncheck();

    // 4隅の値を設定（左上・右上・右下・左下の順）
    await page.locator('#br-top-left').fill('1');
    await page.locator('#br-top-right').fill('2');
    await page.locator('#br-bottom-right').fill('3');
    await page.locator('#br-bottom-left').fill('4');

    const cssOutput = await page.locator('#br-css-output').inputValue();
    // CSS border-radiusの順序: 左上 右上 右下 左下
    expect(cssOutput).toBe('border-radius: 1px 2px 3px 4px;');
  });
});

test.describe('CSS border-radiusジェネレーター（レスポンシブ・アクセシビリティ）', () => {
  test('375px幅でも入力フィールドが見える', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/tools/css-border-radius-generator/');

    await expect(page.locator('#br-top-left')).toBeVisible();
    await expect(page.locator('#br-top-right')).toBeVisible();
    await expect(page.locator('#br-bottom-right')).toBeVisible();
    await expect(page.locator('#br-bottom-left')).toBeVisible();
  });

  test('375px幅で連動チェックボックスが機能する', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/tools/css-border-radius-generator/');

    await page.locator('#br-link-corners').check();
    await expect(page.locator('#br-top-right')).toBeDisabled();
  });

  test('キーボード操作でTab移動できる', async ({ page }) => {
    await page.goto('/tools/css-border-radius-generator/');

    const linkCheckbox = page.locator('#br-link-corners');
    await linkCheckbox.focus();
    await expect(linkCheckbox).toBeFocused();

    await page.keyboard.press('Tab');
    const unitSelect = page.locator('#br-unit-select');
    await expect(unitSelect).toBeFocused();
  });

  test('ステータスメッセージがaria-live="polite"で設定されている', async ({
    page,
  }) => {
    await page.goto('/tools/css-border-radius-generator/');

    const statusEl = page.locator('#br-status');
    const ariaLive = await statusEl.getAttribute('aria-live');
    expect(ariaLive).toBe('polite');
  });
});

test.describe('CSS Border-Radius Generator（ダークモード）', () => {
  test('ダークモード（dark-class）で正しく表示される', async ({ page }) => {
    await page.goto('/tools/css-border-radius-generator/');

    // 手動でダークモードを有効化
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });

    // プレビューとCSSボタンが見える
    await expect(page.locator('#br-preview')).toBeVisible();
    await expect(page.locator('#br-copy-button')).toBeVisible();
  });

  test('ダークモード時も入力が機能する', async ({ page }) => {
    await page.goto('/tools/css-border-radius-generator/');

    // ダークモード有効化
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });

    await page.locator('#br-top-left').fill('20');
    const cssOutput = await page.locator('#br-css-output').inputValue();
    expect(cssOutput).toContain('20px');
  });

  test('ダークモード時のテキストが見える', async ({ page }) => {
    await page.goto('/tools/css-border-radius-generator/');

    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });

    const h1 = page.locator('main h1');
    await expect(h1).toBeVisible();
    const text = await h1.textContent();
    expect(text).toBe('CSS border-radiusジェネレーター');
  });
});

test.describe('CSS Border-Radius Generator（英語版）', () => {
  test('displays correctly in English', async ({ page }) => {
    await page.goto('/en/tools/css-border-radius-generator/');

    await expect(page.locator('main h1')).toHaveText(
      'CSS Border-Radius Generator',
    );
  });

  test('initial CSS output in English', async ({ page }) => {
    await page.goto('/en/tools/css-border-radius-generator/');

    const cssOutput = await page.locator('#br-css-output').inputValue();
    expect(cssOutput).toBe('border-radius: 8px;');
  });

  test('link corners checkbox works in English', async ({ page }) => {
    await page.goto('/en/tools/css-border-radius-generator/');

    await page.locator('#br-link-corners').check();
    await expect(page.locator('#br-top-right')).toBeDisabled();
  });

  test('unit switching works in English', async ({ page }) => {
    await page.goto('/en/tools/css-border-radius-generator/');

    await page.locator('#br-top-left').fill('50');
    await page.locator('#br-unit-select').selectOption('%');

    const cssOutput = await page.locator('#br-css-output').inputValue();
    expect(cssOutput).toContain('%');
  });

  test('copy button displays copied message in English', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/en/tools/css-border-radius-generator/');

    await page.locator('#br-copy-button').click();
    await expect(page.locator('#br-status')).toHaveText('Copied');
  });

  test('375px layout works in English', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/en/tools/css-border-radius-generator/');

    await expect(page.locator('#br-top-left')).toBeVisible();
    await page.locator('#br-top-left').fill('15');
    const cssOutput = await page.locator('#br-css-output').inputValue();
    expect(cssOutput).toContain('15px');
  });
});
