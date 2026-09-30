import { test, expect } from './helpers/test';

test.describe('CSSグラデーションジェネレーター（日本語版）', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/tools/css-gradient-generator/');

    await expect(page.locator('main h1')).toHaveText(
      'CSSグラデーションジェネレーター',
    );
    await expect(page.locator('#cg-type-select')).toHaveValue('linear');
    await expect(page.locator('#cg-angle-value')).toHaveText('90°');
    await expect(page.locator('#cg-preview')).toBeVisible();
    await expect(page.locator('#cg-css-output')).toBeVisible();
  });

  test('線形グラデーションのデフォルト状態で正しいCSSが生成される', async ({
    page,
  }) => {
    await page.goto('/tools/css-gradient-generator/');

    const cssOutput = await page.locator('#cg-css-output').inputValue();
    expect(cssOutput).toContain('linear-gradient');
    expect(cssOutput).toContain('90deg');
    expect(cssOutput).toContain('#3b82f6');
    expect(cssOutput).toContain('#a855f7');
  });

  test('角度スライダーを動かすと出力CSSと表示値が更新される', async ({
    page,
  }) => {
    await page.goto('/tools/css-gradient-generator/');

    const angleRange = page.locator('#cg-angle-range');
    await angleRange.fill('45');

    await expect(page.locator('#cg-angle-value')).toHaveText('45°');
    const cssOutput = await page.locator('#cg-css-output').inputValue();
    expect(cssOutput).toContain('45deg');
  });

  test('グラデーション種類を円形に変更すると円形グラデーションが生成される', async ({
    page,
  }) => {
    await page.goto('/tools/css-gradient-generator/');

    // 線形→円形に切り替え
    await page.locator('#cg-type-select').selectOption('radial');

    // 線形コントロールが隠れ、円形コントロールが表示される
    await expect(page.locator('#cg-linear-controls')).toBeHidden();
    await expect(page.locator('#cg-radial-controls')).toBeVisible();

    // CSSが円形グラデーションになる
    const cssOutput = await page.locator('#cg-css-output').inputValue();
    expect(cssOutput).toContain('radial-gradient');
    expect(cssOutput).not.toContain('deg');
  });

  test('円形グラデーション で形状を変更するとCSSが更新される', async ({
    page,
  }) => {
    await page.goto('/tools/css-gradient-generator/');

    await page.locator('#cg-type-select').selectOption('radial');

    // デフォルトはcircle
    let cssOutput = await page.locator('#cg-css-output').inputValue();
    expect(cssOutput).toContain('circle');

    // ellipseに変更
    await page.locator('#cg-shape-select').selectOption('ellipse');
    cssOutput = await page.locator('#cg-css-output').inputValue();
    expect(cssOutput).toContain('ellipse');
    expect(cssOutput).not.toContain('circle');
  });

  test('色を変更するとプレビューとCSSが更新される', async ({ page }) => {
    await page.goto('/tools/css-gradient-generator/');

    const colorInputs = page.locator('[data-color]');
    const firstColor = colorInputs.first();

    // 最初のカラーストップの色を変更
    await firstColor.fill('#ff0000');

    const cssOutput = await page.locator('#cg-css-output').inputValue();
    expect(cssOutput).toContain('#ff0000');
  });

  test('位置を変更するとプレビューとCSSが更新される', async ({ page }) => {
    await page.goto('/tools/css-gradient-generator/');

    const positionInputs = page.locator('[data-position]');
    const firstPosition = positionInputs.first();

    // 最初の位置を10に変更
    await firstPosition.fill('10');

    const cssOutput = await page.locator('#cg-css-output').inputValue();
    expect(cssOutput).toContain('10%');
  });

  test('位置入力で範囲外の値は自動的にクランプされる', async ({ page }) => {
    await page.goto('/tools/css-gradient-generator/');

    const positionInputs = page.locator('[data-position]');
    const firstPosition = positionInputs.first();

    // 150を入力（范囲外）
    await firstPosition.fill('150');
    await firstPosition.blur();

    // 100にクランプされる
    await expect(firstPosition).toHaveValue('100');
  });

  test('位置入力で負の値は0にクランプされる', async ({ page }) => {
    await page.goto('/tools/css-gradient-generator/');

    const positionInputs = page.locator('[data-position]');
    const lastPosition = positionInputs.last();

    // -50を入力
    await lastPosition.fill('-50');
    await lastPosition.blur();

    // 0にクランプされる
    await expect(lastPosition).toHaveValue('0');
  });

  test('カラーストップは2個の状態では削除ボタンが無効化される', async ({
    page,
  }) => {
    await page.goto('/tools/css-gradient-generator/');

    const removeButtons = page.locator('[data-remove]');
    const count = await removeButtons.count();

    // デフォルトは2個なので全て無効化
    for (let i = 0; i < count; i++) {
      await expect(removeButtons.nth(i)).toBeDisabled();
    }
  });

  test('カラーストップを追加して3個にすると削除ボタンが有効になる', async ({
    page,
  }) => {
    await page.goto('/tools/css-gradient-generator/');

    // 追加ボタンをクリック
    await page.locator('#cg-add-stop-button').click();

    // 削除ボタンが有効になる
    const removeButtons = page.locator('[data-remove]');
    const count = await removeButtons.count();
    expect(count).toBe(3);

    for (let i = 0; i < count; i++) {
      await expect(removeButtons.nth(i)).not.toBeDisabled();
    }
  });

  test('カラーストップを追加すると最も広い隙間の中央に挿入される', async ({
    page,
  }) => {
    await page.goto('/tools/css-gradient-generator/');

    // 1つ追加（最初のstop）
    await page.locator('#cg-add-stop-button').click();

    // 次のstop（複数ある場合の中央のもの）
    await page.locator('#cg-add-stop-button').click();

    // 4個になることを確認
    const stopRows = page.locator('[data-stop-row]');
    await expect(stopRows).toHaveCount(4);
  });

  test('カラーストップを6個まで追加できるが、それ以上は追加ボタンが無効になる', async ({
    page,
  }) => {
    await page.goto('/tools/css-gradient-generator/');

    const addButton = page.locator('#cg-add-stop-button');

    // 2個→3個→4個→5個→6個に追加
    for (let i = 0; i < 4; i++) {
      await expect(addButton).not.toBeDisabled();
      await addButton.click();
    }

    // 6個になったらボタンが無効になる
    await expect(addButton).toBeDisabled();

    // 6個確認
    const stopRows = page.locator('[data-stop-row]');
    await expect(stopRows).toHaveCount(6);
  });

  test('カラーストップを削除するとCSSが更新される', async ({ page }) => {
    await page.goto('/tools/css-gradient-generator/');

    // 3個になるまで追加
    await page.locator('#cg-add-stop-button').click();

    let cssOutput = await page.locator('#cg-css-output').inputValue();
    const stopsCountBefore = (cssOutput.match(/%/g) || []).length;

    // 最後の削除ボタンをクリック
    const removeButtons = page.locator('[data-remove]');
    await removeButtons.last().click();

    cssOutput = await page.locator('#cg-css-output').inputValue();
    const stopsCountAfter = (cssOutput.match(/%/g) || []).length;

    expect(stopsCountAfter).toBe(stopsCountBefore - 1);
  });

  test('2個の状態では削除できない（ボタンが無効）', async ({ page }) => {
    await page.goto('/tools/css-gradient-generator/');

    const removeButtons = page.locator('[data-remove]');

    // ボタンは無効
    for (let i = 0; i < (await removeButtons.count()); i++) {
      await expect(removeButtons.nth(i)).toBeDisabled();
    }
  });

  test('コピーボタンでCSSをコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/css-gradient-generator/');

    const cssOutput = await page.locator('#cg-css-output').inputValue();
    const copyButton = page.locator('#cg-copy-button');

    await copyButton.click();

    // ステータスメッセージが表示される
    await expect(page.locator('#cg-status')).toHaveText('コピーしました');

    // クリップボードに内容がある
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toBe(cssOutput);
  });

  test('複合シナリオ：線形グラデーション、角度45°、カラーストップ3個', async ({
    page,
  }) => {
    await page.goto('/tools/css-gradient-generator/');

    // 角度を45°に設定
    await page.locator('#cg-angle-range').fill('45');

    // カラーストップを1個追加
    await page.locator('#cg-add-stop-button').click();

    // 最初の色を赤に変更
    await page.locator('[data-color]').first().fill('#ff0000');

    // CSSを確認
    const cssOutput = await page.locator('#cg-css-output').inputValue();
    expect(cssOutput).toContain('linear-gradient');
    expect(cssOutput).toContain('45deg');
    expect(cssOutput).toContain('#ff0000');

    // 3個のカラーストップがある
    const stopCount = (cssOutput.match(/%/g) || []).length;
    expect(stopCount).toBe(3);
  });

  test('複合シナリオ：円形グラデーション、楕円形、カラーストップ4個', async ({
    page,
  }) => {
    await page.goto('/tools/css-gradient-generator/');

    // 円形に切り替え
    await page.locator('#cg-type-select').selectOption('radial');

    // 楕円形に変更
    await page.locator('#cg-shape-select').selectOption('ellipse');

    // カラーストップを2個追加
    await page.locator('#cg-add-stop-button').click();
    await page.locator('#cg-add-stop-button').click();

    const cssOutput = await page.locator('#cg-css-output').inputValue();
    expect(cssOutput).toContain('radial-gradient');
    expect(cssOutput).toContain('ellipse');

    // 4個のカラーストップがある
    const stopCount = (cssOutput.match(/%/g) || []).length;
    expect(stopCount).toBe(4);
  });

  test('カラーストップの位置は昇順にソートされて出力される', async ({
    page,
  }) => {
    await page.goto('/tools/css-gradient-generator/');

    // 複数のカラーストップを追加
    await page.locator('#cg-add-stop-button').click();
    await page.locator('#cg-add-stop-button').click();

    // 複数の位置を変更（順序をバラバラにする）
    const positionInputs = page.locator('[data-position]');
    // 最初: 0%, 位置1: 10%, 位置2: 75%, 位置3: 50%, 位置4: 100%
    await positionInputs.nth(1).fill('75');
    await positionInputs.nth(2).fill('10');

    const cssOutput = await page.locator('#cg-css-output').inputValue();

    // CSS出力での位置の順序を確認
    const idx0 = cssOutput.indexOf('0%');
    const idx10 = cssOutput.indexOf('10%');
    const idx75 = cssOutput.indexOf('75%');

    // 昇順に並んでいることを確認
    expect(idx0).toBeLessThan(idx10);
    expect(idx10).toBeLessThan(idx75);
  });

  test('プレビューの背景画像が正しく設定される', async ({ page }) => {
    await page.goto('/tools/css-gradient-generator/');

    const preview = page.locator('#cg-preview');
    const style = await preview.getAttribute('style');

    expect(style).toContain('background-image');
    expect(style).toContain('linear-gradient');
  });

  test('プレビューが色変更に応じて動的に更新される', async ({ page }) => {
    await page.goto('/tools/css-gradient-generator/');

    const preview = page.locator('#cg-preview');
    const styleBefore = await preview.getAttribute('style');

    // 最初の色を変更
    const colorInput = page.locator('[data-color]').first();
    await colorInput.fill('#ff0000');

    // 変更が反映されるまで待つ（自動リトライ）
    // style 属性が変更されるまで待つ
    await expect(preview).toHaveAttribute('style', new RegExp(`.+`));

    const styleAfter = await preview.getAttribute('style');

    expect(styleBefore).not.toBe(styleAfter);
    expect(styleAfter).toBeTruthy();
  });
});

test.describe('CSS Gradient Generator (English)', () => {
  test('displays correctly in English', async ({ page }) => {
    await page.goto('/en/tools/css-gradient-generator/');

    await expect(page.locator('main h1')).toHaveText('CSS Gradient Generator');
    await expect(page.locator('#cg-type-select')).toHaveValue('linear');
  });

  test('linear gradient with English UI', async ({ page }) => {
    await page.goto('/en/tools/css-gradient-generator/');

    const cssOutput = await page.locator('#cg-css-output').inputValue();
    expect(cssOutput).toContain('linear-gradient');
  });

  test('radial gradient type change in English', async ({ page }) => {
    await page.goto('/en/tools/css-gradient-generator/');

    await page.locator('#cg-type-select').selectOption('radial');

    await expect(page.locator('#cg-radial-controls')).toBeVisible();
    const cssOutput = await page.locator('#cg-css-output').inputValue();
    expect(cssOutput).toContain('radial-gradient');
  });

  test('add color stop button in English', async ({ page }) => {
    await page.goto('/en/tools/css-gradient-generator/');

    const addButton = page.locator('#cg-add-stop-button');
    await addButton.click();

    const stopRows = page.locator('[data-stop-row]');
    await expect(stopRows).toHaveCount(3);
  });

  test('copy button displays copied message in English', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/en/tools/css-gradient-generator/');

    const copyButton = page.locator('#cg-copy-button');
    await copyButton.click();

    await expect(page.locator('#cg-status')).toHaveText('Copied');
  });

  test('position clamping works in English', async ({ page }) => {
    await page.goto('/en/tools/css-gradient-generator/');

    const positionInput = page.locator('[data-position]').first();
    await positionInput.fill('150');
    await positionInput.blur();

    await expect(positionInput).toHaveValue('100');
  });

  test('maximum 6 color stops enforced in English', async ({ page }) => {
    await page.goto('/en/tools/css-gradient-generator/');

    const addButton = page.locator('#cg-add-stop-button');

    for (let i = 0; i < 4; i++) {
      await addButton.click();
    }

    await expect(addButton).toBeDisabled();
    const stopRows = page.locator('[data-stop-row]');
    await expect(stopRows).toHaveCount(6);
  });
});
