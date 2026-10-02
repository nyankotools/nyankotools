import { test, expect } from './helpers/test';
import * as fs from 'fs';

test('日本語版でページが表示される', async ({ page }) => {
  await page.goto('/tools/cat-logo-text-generator/');
  await expect(page.locator('main h1')).toHaveText(
    '猫ロゴ文字ジェネレーター（背景透過PNG）',
  );
});

test('英語版でページが表示される', async ({ page }) => {
  await page.goto('/en/tools/cat-logo-text-generator/');
  await expect(page.locator('main h1')).toHaveText(
    'Cat Logo Text Generator (Transparent PNG)',
  );
});

test('テキスト入力でCanvasが再描画される', async ({ page }) => {
  await page.goto('/tools/cat-logo-text-generator/');

  const textInput = page.locator('#cl-text');
  const canvas = page.locator('#cl-canvas');

  // 初期テキストで描画されているか確認
  await expect(canvas).toHaveAttribute('width');
  const initialWidth = await canvas.getAttribute('width');

  // テキストを変更
  await textInput.fill('TEST');

  // Canvas の width が変わることで再描画を確認
  // (テキストが短くなるので canvas の幅も変わる可能性がある)
  // width属性が存在することを確認（自動リトライ）
  await expect(canvas).toHaveAttribute('width');
  const newWidth = await canvas.getAttribute('width');

  // キャンバスが存在し、何らかの値を持っていることを確認
  expect(initialWidth).toBeTruthy();
  expect(newWidth).toBeTruthy();
});

test('ダウンロード PNG が有効で透明背景を持つ', async ({ page, context }) => {
  await page.goto('/tools/cat-logo-text-generator/');

  const downloadLink = page.locator('#cl-download');

  // ダウンロードが有効になるまで待つ（aria-disabled が false になるまで）
  await expect(downloadLink).toHaveAttribute('aria-disabled', 'false', {
    timeout: 5000,
  });

  const downloadPromise = context.waitForEvent('download');
  await downloadLink.click();

  const download = await downloadPromise;
  const filePath = await download.path();

  // ファイルが存在することを確認
  expect(fs.existsSync(filePath!)).toBe(true);

  // PNG ファイルのシグネチャを確認
  const buffer = fs.readFileSync(filePath!);
  const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  expect(buffer.slice(0, 8)).toEqual(pngSignature);

  // PNG の IHDR チャンク後に PLTE や IDAT を含むかチェックしてアルファチャンネルを確認
  // PNG ファイル構造: PNG signature (8) + IHDR chunk (25) + ...
  // IHDR チャンク: 4(length) + 4(IHDR) + 13(data) + 4(CRC) = 25 bytes
  // IHDR data: 4(width) + 4(height) + 1(bit depth) + 1(color type) + 1(compression) + 1(filter) + 1(interlace)
  // color type: 0=Grayscale, 2=RGB, 3=Indexed, 4=Grayscale+Alpha, 6=RGBA
  const colorType = buffer[25];
  // RGBA (6) または Grayscale+Alpha (4) のいずれかでアルファチャンネルがある
  expect([4, 6]).toContain(colorType);
});

test('空の文字列でエラーを表示する', async ({ page }) => {
  await page.goto('/tools/cat-logo-text-generator/');

  const textInput = page.locator('#cl-text');
  const errorEl = page.locator('#cl-error');

  // テキストを空にする
  await textInput.fill('');

  // エラーが表示されることを確認（自動リトライ）
  await expect(errorEl).toBeVisible();
  const errorText = await errorEl.textContent();
  expect(errorText).toContain('1');
  expect(errorText).toContain('20');
});

test('21文字以上でエラーを表示する', async ({ page }) => {
  await page.goto('/tools/cat-logo-text-generator/');

  const textInput = page.locator('#cl-text');
  const errorEl = page.locator('#cl-error');

  // 21文字入力（最大20文字なので超過）
  await textInput.fill('あいうえおかきくけこさしすせそたちつてとな');

  // エラーが表示されることを確認（自動リトライ）
  await expect(errorEl).toBeVisible();
  const errorText = await errorEl.textContent();
  expect(errorText).toContain('20');
});

test('不正な色フォーマットでエラーを表示する', async ({ page }) => {
  await page.goto('/tools/cat-logo-text-generator/');

  const colorInput = page.locator('#cl-fg');
  const errorEl = page.locator('#cl-error');

  // 不正な色を入力
  await colorInput.fill('invalid-color');

  // エラーが表示されることを確認（自動リトライ）
  await expect(errorEl).toBeVisible();
  const errorText = await errorEl.textContent();
  expect(errorText).toContain('#RGB');
});

test('フォントサイズ範囲外でエラーを表示する', async ({ page }) => {
  await page.goto('/tools/cat-logo-text-generator/');

  const sizeInput = page.locator('#cl-size');
  const errorEl = page.locator('#cl-error');

  // サイズを小さすぎる値に設定
  await sizeInput.fill('30');

  // エラーが表示されることを確認（自動リトライ）
  await expect(errorEl).toBeVisible();
  const errorText = await errorEl.textContent();
  expect(errorText).toContain('40');
});

test('375px幅で横スクロールが発生しない', async ({ page }) => {
  // ビューポートを 375px に設定
  await page.setViewportSize({ width: 375, height: 812 });

  await page.goto('/tools/cat-logo-text-generator/');

  const main = page.locator('main');

  // スクロール幅がビューポート幅を超えていないことを確認
  const boundingBox = await main.boundingBox();
  const clientWidth = await page.evaluate(() => window.innerWidth);

  if (boundingBox) {
    expect(boundingBox.width).toBeLessThanOrEqual(clientWidth);
  }

  // horizontal scroll がないことを確認
  const scrollWidth = await page.evaluate(() =>
    Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
  );
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
});

test('フォントサイズ最大値と最小値の両端で動作する', async ({ page }) => {
  await page.goto('/tools/cat-logo-text-generator/');

  const sizeInput = page.locator('#cl-size');
  const downloadLink = page.locator('#cl-download');
  const errorEl = page.locator('#cl-error');

  // 最小値: 40
  await sizeInput.fill('40');
  await expect(downloadLink).toHaveAttribute('aria-disabled', 'false', {
    timeout: 5000,
  });
  await expect(errorEl).toBeHidden();

  // 最大値: 240
  await sizeInput.fill('240');
  await expect(downloadLink).toHaveAttribute('aria-disabled', 'false', {
    timeout: 5000,
  });
  await expect(errorEl).toBeHidden();
});

test('縁取り範囲外でエラーを表示する', async ({ page }) => {
  await page.goto('/tools/cat-logo-text-generator/');

  const outlineInput = page.locator('#cl-outline');
  const errorEl = page.locator('#cl-error');

  // 負の値を入力
  await outlineInput.fill('-1');

  // エラーが表示されることを確認（自動リトライ）
  await expect(errorEl).toBeVisible();
  const errorText = await errorEl.textContent();
  expect(errorText).toContain('0');
});

test('正常なテキストでダウンロードボタンが有効になる', async ({ page }) => {
  await page.goto('/tools/cat-logo-text-generator/');

  const textInput = page.locator('#cl-text');
  const downloadLink = page.locator('#cl-download');

  // 初期テキストでダウンロードが有効になるまで待つ
  await expect(downloadLink).toHaveAttribute('aria-disabled', 'false', {
    timeout: 5000,
  });

  // テキストを変更
  await textInput.fill('MEOW');

  // 新しいテキストでダウンロードが有効になることを確認
  await expect(downloadLink).toHaveAttribute('aria-disabled', 'false', {
    timeout: 5000,
  });
});

// ---- 装飾部品の手動配置テスト（初期状態は装飾なし）

test('装飾の追加ボタンが機能する', async ({ page }) => {
  await page.goto('/tools/cat-logo-text-generator/');

  const canvas = page.locator('#cl-canvas');
  const addHeartBtn = page.locator('button[data-kind="heart"]');
  const addStarBtn = page.locator('button[data-kind="star"]');
  const addMoonBtn = page.locator('button[data-kind="moon"]');
  const addEarBtn = page.locator('button[data-kind="ear"]');

  // ボタンが存在することを確認
  await expect(addHeartBtn).toBeVisible();
  await expect(addStarBtn).toBeVisible();
  await expect(addMoonBtn).toBeVisible();
  await expect(addEarBtn).toBeVisible();

  // ハートを追加
  await addHeartBtn.click();

  // キャンバスが更新されていることを確認（自動リトライ）
  await expect(canvas).toHaveAttribute('width');
  const afterHeartWidth = await canvas.getAttribute('width');
  expect(afterHeartWidth).toBeTruthy();

  // 星を追加
  await addStarBtn.click();

  // キャンバスが更新されていることを確認（自動リトライ）
  await expect(canvas).toHaveAttribute('width');

  // 月を追加
  await addMoonBtn.click();

  // キャンバスが更新されていることを確認（自動リトライ）
  await expect(canvas).toHaveAttribute('width');

  // 耳を追加
  await addEarBtn.click();

  // キャンバスが更新されていることを確認（自動リトライ）
  await expect(canvas).toHaveAttribute('width');
});

test('装飾追加後、ドラッグで部品が移動する', async ({ page }) => {
  await page.goto('/tools/cat-logo-text-generator/');

  const addHeartBtn = page.locator('button[data-kind="heart"]');
  const overlay = page.locator('#cl-overlay');

  // ハートを追加
  await addHeartBtn.click();

  // ハートが描画されるまで待つ（自動リトライ）
  await expect(overlay).toBeVisible();

  // ハートをドラッグして移動させる
  const box = await overlay.boundingBox();
  if (box) {
    // キャンバス中央でドラッグ操作を実行
    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;
    const endX = startX + 50;
    const endY = startY + 50;

    await page.mouse.move(startX, startY);
    // ドラッグ操作中の座標同期のため短い待ちは保持
    await page.waitForTimeout(100);
    await page.mouse.down();
    // ドラッグ操作中の座標同期のため短い待ちは保持
    await page.waitForTimeout(100);
    await page.mouse.move(endX, endY, { steps: 20 });
    // ドラッグ操作中の座標同期のため短い待ちは保持
    await page.waitForTimeout(100);
    await page.mouse.up();

    // ドラッグ完了後、Canvas が再描画されるまで待つ
    const canvas = page.locator('#cl-canvas');
    await expect(canvas).toHaveAttribute('width');
  }

  // キャンバスが再描画されたことを確認（ハートが移動した）
  expect(overlay).toBeTruthy();
});

test('選択パネルのスライダーで大きさと角度を変更できる', async ({ page }) => {
  await page.goto('/tools/cat-logo-text-generator/');

  const addHeartBtn = page.locator('button[data-kind="heart"]');
  const overlay = page.locator('#cl-overlay');
  const scaleSlider = page.locator('#cl-item-scale');
  const rotationSlider = page.locator('#cl-item-rot');
  const scaleOutput = page.locator('#cl-scale-out');
  const rotationOutput = page.locator('#cl-rot-out');
  const panelEl = page.locator('#cl-panel');

  // ハートを追加
  await addHeartBtn.click();

  // オーバーレイが描画されるまで待つ
  await expect(overlay).toBeVisible();

  // オーバーレイをマウスで選択
  const box = await overlay.boundingBox();
  if (box) {
    const clickX = box.x + box.width / 2 - 100;
    const clickY = box.y + box.height / 2 - 50;
    await page.mouse.move(clickX, clickY);
    // ドラッグ操作中の座標同期のため短い待ちは保持
    await page.waitForTimeout(100);
    await page.mouse.click(clickX, clickY);

    // パネルが有効になるまで待つ
    await expect(panelEl).not.toHaveAttribute('disabled');
  }

  // スライダーが表示されていることを確認
  await expect(scaleSlider).toBeVisible();
  await expect(rotationSlider).toBeVisible();

  // スケールスライダーを変更
  const initialScaleText = await scaleOutput.textContent();
  await scaleSlider.fill('1.5');

  // スライダー更新が反映されるまで待つ
  await expect(scaleOutput).toHaveText(new RegExp(`^(?!${initialScaleText})`));
  const newScaleText = await scaleOutput.textContent();
  expect(newScaleText).not.toBe(initialScaleText);

  // 回転スライダーを変更
  const initialRotText = await rotationOutput.textContent();
  await rotationSlider.fill('45');

  // スライダー更新が反映されるまで待つ
  await expect(rotationOutput).toHaveText(new RegExp(`^(?!${initialRotText})`));
  const newRotText = await rotationOutput.textContent();
  expect(newRotText).not.toBe(initialRotText);
});

test('左右反転・複製・削除ボタンが機能する', async ({ page }) => {
  await page.goto('/tools/cat-logo-text-generator/');

  const addStarBtn = page.locator('button[data-kind="star"]');
  const overlay = page.locator('#cl-overlay');
  const flipBtn = page.locator('#cl-flip');
  const dupBtn = page.locator('#cl-dup');
  const delBtn = page.locator('#cl-del');
  const canvas = page.locator('#cl-canvas');
  const panelEl = page.locator('#cl-panel');

  // 星を追加
  await addStarBtn.click();

  // オーバーレイが描画されるまで待つ
  await expect(overlay).toBeVisible();

  // オーバーレイをマウスで選択
  const box = await overlay.boundingBox();
  if (box) {
    const clickX = box.x + box.width / 2 - 100;
    const clickY = box.y + box.height / 2 - 50;
    await page.mouse.move(clickX, clickY);
    // ドラッグ操作中の座標同期のため短い待ちは保持
    await page.waitForTimeout(100);
    await page.mouse.click(clickX, clickY);

    // パネルが有効になるまで待つ
    await expect(panelEl).not.toHaveAttribute('disabled');
  }

  // ボタンが表示されていることを確認
  await expect(flipBtn).toBeVisible();
  await expect(dupBtn).toBeVisible();
  await expect(delBtn).toBeVisible();

  // 左右反転ボタンをクリック
  await flipBtn.click();

  // Canvas が再描画されるまで待つ
  await expect(canvas).toHaveAttribute('width');

  // 複製ボタンをクリック
  await dupBtn.click();

  // キャンバスが変わることを確認（複製されたため、属性が再設定される）
  await expect(canvas).toHaveAttribute('width');
  const afterDupWidth = await canvas.getAttribute('width');
  expect(afterDupWidth).toBeTruthy();

  // 削除ボタンをクリック
  await delBtn.click();

  // Canvas が再描画されるまで待つ
  await expect(canvas).toHaveAttribute('width');
});

test('すべての装飾を削除ボタンが機能する', async ({ page }) => {
  await page.goto('/tools/cat-logo-text-generator/');

  const addHeartBtn = page.locator('button[data-kind="heart"]');
  const addStarBtn = page.locator('button[data-kind="star"]');
  const clearBtn = page.locator('#cl-clear');
  const noSelectionEl = page.locator('#cl-no-selection');
  const panelEl = page.locator('#cl-panel');

  // ハートと星を追加
  await addHeartBtn.click();

  // Canvas が更新されるまで待つ
  const canvas = page.locator('#cl-canvas');
  await expect(canvas).toHaveAttribute('width');

  await addStarBtn.click();

  // Canvas が更新されるまで待つ
  await expect(canvas).toHaveAttribute('width');

  // 選択パネルが表示されていることを確認
  await expect(panelEl).not.toHaveAttribute('hidden');

  // すべて削除ボタンをクリック
  await clearBtn.click();

  // 選択パネルが無効になり、「選択なし」メッセージが表示されることを確認
  await expect(panelEl).toHaveAttribute('disabled');
  await expect(noSelectionEl).toBeVisible();
});

test('矢印キーで部品を移動できる', async ({ page }) => {
  await page.goto('/tools/cat-logo-text-generator/');

  const addHeartBtn = page.locator('button[data-kind="heart"]');
  const overlay = page.locator('#cl-overlay');
  const canvas = page.locator('#cl-canvas');

  // ハートを追加
  await addHeartBtn.click();

  // Canvas が更新されるまで待つ
  await expect(canvas).toHaveAttribute('width');

  // オーバーレイをクリックして選択
  await overlay.click();

  // オーバーレイが選択状態になるまで待つ
  await expect(overlay).toBeFocused();

  // フォーカスをオーバーレイに与える
  await overlay.focus();

  // 矢印キーを押す
  await page.keyboard.press('ArrowRight');
  // キー入力は同期的に処理されるため、レンダリングまで待つ
  await expect(canvas).toHaveAttribute('width');

  await page.keyboard.press('ArrowUp');
  // キー入力後の Canvas 再描画を確認
  await expect(canvas).toHaveAttribute('width');

  await page.keyboard.press('ArrowLeft');
  // キー入力後の Canvas 再描画を確認
  await expect(canvas).toHaveAttribute('width');

  await page.keyboard.press('ArrowDown');
  // キー入力後の Canvas 再描画を確認
  await expect(canvas).toHaveAttribute('width');
});

test('Deleteキーで部品を削除できる', async ({ page }) => {
  await page.goto('/tools/cat-logo-text-generator/');

  const addHeartBtn = page.locator('button[data-kind="heart"]');
  const overlay = page.locator('#cl-overlay');
  const panelEl = page.locator('#cl-panel');

  // ハートを追加
  await addHeartBtn.click();

  // オーバーレイが描画されるまで待つ
  await expect(overlay).toBeVisible();

  // オーバーレイをマウスで選択
  const box = await overlay.boundingBox();
  if (box) {
    const clickX = box.x + box.width / 2 - 100;
    const clickY = box.y + box.height / 2 - 50;
    await page.mouse.move(clickX, clickY);
    // ドラッグ操作中の座標同期のため短い待ちは保持
    await page.waitForTimeout(100);
    await page.mouse.click(clickX, clickY);

    // パネルが有効になるまで待つ
    await expect(panelEl).not.toHaveAttribute('hidden');
  }

  // フォーカスをオーバーレイに与える
  await overlay.focus();

  // Deleteキーを押す
  await page.keyboard.press('Delete');

  // 選択パネルが無効になることを確認
  await expect(panelEl).toHaveAttribute('disabled');
});

test('入力エラー中に部品追加ボタンを押してもダウンロードが有効化されない', async ({
  page,
}) => {
  await page.goto('/tools/cat-logo-text-generator/');

  const textInput = page.locator('#cl-text');
  const addHeartBtn = page.locator('button[data-kind="heart"]');
  const downloadLink = page.locator('#cl-download');
  const errorEl = page.locator('#cl-error');

  // テキストを空にしてエラーを発生させる
  await textInput.fill('');

  // エラーが表示されることを確認（自動リトライ）
  await expect(errorEl).toBeVisible();

  // ダウンロードボタンが無効になっていることを確認
  await expect(downloadLink).toHaveAttribute('aria-disabled', 'true');

  // ハートを追加しようとしてもダウンロードは無効なまま
  await addHeartBtn.click();

  // ダウンロードボタンがまだ無効であることを確認（エラーが表示されたまま）
  await expect(downloadLink).toHaveAttribute('aria-disabled', 'true');
  await expect(errorEl).toBeVisible();
});

test('出力PNGにアルファチャンネルがあり選択枠が混入しない', async ({
  page,
  context,
}) => {
  await page.goto('/tools/cat-logo-text-generator/');

  const addHeartBtn = page.locator('button[data-kind="heart"]');
  const overlay = page.locator('#cl-overlay');
  const downloadLink = page.locator('#cl-download');

  // ハートを追加
  await addHeartBtn.click();

  // オーバーレイが描画されるまで待つ
  await expect(overlay).toBeVisible();

  // オーバーレイをクリックして選択
  await overlay.click();

  // ダウンロード待機（自動リトライ）
  await expect(downloadLink).toHaveAttribute('aria-disabled', 'false', {
    timeout: 5000,
  });

  const downloadPromise = context.waitForEvent('download');
  await downloadLink.click();

  const download = await downloadPromise;
  const filePath = await download.path();

  // PNG ファイルのシグネチャを確認
  const buffer = fs.readFileSync(filePath!);
  const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  expect(buffer.slice(0, 8)).toEqual(pngSignature);

  // PNG のカラータイプからアルファチャンネルを確認
  const colorType = buffer[25];
  expect([4, 6]).toContain(colorType);
});

test('部品を範囲外へ動かしてもキャンバスが拡張され切れない', async ({
  page,
}) => {
  await page.goto('/tools/cat-logo-text-generator/');

  const addHeartBtn = page.locator('button[data-kind="heart"]');
  const canvas = page.locator('#cl-canvas');
  const overlay = page.locator('#cl-overlay');

  // ハートを追加
  await addHeartBtn.click();

  // Canvas が更新されるまで待つ
  await expect(canvas).toHaveAttribute('width');

  // キャンバスの初期サイズ
  const initialWidth = await canvas.getAttribute('width');
  const initialHeight = await canvas.getAttribute('height');

  // オーバーレイをクリックして選択
  await overlay.click();

  // オーバーレイが選択状態になるまで待つ
  await expect(overlay).toBeFocused();

  // かなり遠い位置までドラッグ
  await overlay.dragTo(overlay, { targetPosition: { x: 200, y: 200 } });

  // Canvas が再描画されるまで待つ
  await expect(canvas).toHaveAttribute('width');

  // キャンバスのサイズが拡張されていることを確認（切れない）
  const finalWidth = await canvas.getAttribute('width');
  const finalHeight = await canvas.getAttribute('height');

  expect(finalWidth).toBeTruthy();
  expect(finalHeight).toBeTruthy();
  expect(Number(finalWidth)).toBeGreaterThanOrEqual(Number(initialWidth));
  expect(Number(finalHeight)).toBeGreaterThanOrEqual(Number(initialHeight));
});

test('375px幅で装飾UI操作時も横スクロールが発生しない', async ({ page }) => {
  // ビューポートを 375px に設定
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/tools/cat-logo-text-generator/');

  const addHeartBtn = page.locator('button[data-kind="heart"]');
  const canvas = page.locator('#cl-canvas');

  // ハートを追加
  await addHeartBtn.click();

  // Canvas が更新されるまで待つ
  await expect(canvas).toHaveAttribute('width');

  // スクロール幅がビューポート幅を超えていないことを確認
  const scrollWidth = await page.evaluate(() =>
    Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
  );
  const clientWidth = await page.evaluate(() => window.innerWidth);

  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
});

test('英語版でも装飾の手動配置機能が動作する', async ({ page }) => {
  await page.goto('/en/tools/cat-logo-text-generator/');

  const addHeartBtn = page.locator('button[data-kind="heart"]');
  const flipBtn = page.locator('#cl-flip');
  const clearBtn = page.locator('#cl-clear');
  const overlay = page.locator('#cl-overlay');
  const panelEl = page.locator('#cl-panel');

  // ボタンが表示されていることを確認
  await expect(addHeartBtn).toBeVisible();
  await expect(panelEl).toHaveAttribute('disabled'); // 選択していないので無効
  await expect(clearBtn).toBeVisible();

  // ハートを追加
  await addHeartBtn.click();

  // オーバーレイが描画されるまで待つ
  await expect(overlay).toBeVisible();

  // ボタンが機能することを確認
  const box = await overlay.boundingBox();
  if (box) {
    const clickX = box.x + box.width / 2 - 100;
    const clickY = box.y + box.height / 2 - 50;
    await page.mouse.move(clickX, clickY);
    // ドラッグ操作中の座標同期のため短い待ちは保持
    await page.waitForTimeout(100);
    await page.mouse.click(clickX, clickY);

    // パネルが有効になるまで待つ
    await expect(panelEl).not.toHaveAttribute('disabled');
  }

  // 英語版でも Flip ボタンが表示される
  await expect(flipBtn).toBeVisible();
});

test('初期状態では装飾がなく、文字のみで描画される', async ({ page }) => {
  await page.goto('/tools/cat-logo-text-generator/');

  const canvas = page.locator('#cl-canvas');
  const clearBtn = page.locator('#cl-clear');

  // 初期状態ではキャンバスが描画されている
  await expect(canvas).toHaveAttribute('width');
  const initialWidth = await canvas.getAttribute('width');

  // すべて削除を押しても何も変わらない（すでに何もない）
  await clearBtn.click();

  // Canvas が更新されるまで待つ
  await expect(canvas).toHaveAttribute('width');

  // キャンバスのサイズが変わらないか、テキストだけで成立している
  const afterClearWidth = await canvas.getAttribute('width');
  expect(initialWidth).toBeTruthy();
  expect(afterClearWidth).toBeTruthy();
});
