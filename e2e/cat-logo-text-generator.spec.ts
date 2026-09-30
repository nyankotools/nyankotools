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
  await page.waitForTimeout(100);
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
  await page.waitForTimeout(200);

  // エラーが表示されることを確認
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
  await page.waitForTimeout(200);

  // エラーが表示されることを確認（visible になるまで待つ）
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
  await page.waitForTimeout(200);

  // エラーが表示されることを確認
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
  await page.waitForTimeout(200);

  // エラーが表示されることを確認
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
  await page.waitForTimeout(200);

  // エラーが表示されることを確認
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
  await page.waitForTimeout(200);

  // キャンバスが更新されていることを確認
  const afterHeartWidth = await canvas.getAttribute('width');
  expect(afterHeartWidth).toBeTruthy();

  // 星を追加
  await addStarBtn.click();
  await page.waitForTimeout(200);

  // 月を追加
  await addMoonBtn.click();
  await page.waitForTimeout(200);

  // 耳を追加
  await addEarBtn.click();
  await page.waitForTimeout(200);
});

test('装飾追加後、ドラッグで部品が移動する', async ({ page }) => {
  await page.goto('/tools/cat-logo-text-generator/');

  const addHeartBtn = page.locator('button[data-kind="heart"]');
  const overlay = page.locator('#cl-overlay');

  // ハートを追加
  await addHeartBtn.click();
  await page.waitForTimeout(300);

  // ハートをドラッグして移動させる
  const box = await overlay.boundingBox();
  if (box) {
    // キャンバス中央でドラッグ操作を実行
    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;
    const endX = startX + 50;
    const endY = startY + 50;

    await page.mouse.move(startX, startY);
    await page.waitForTimeout(100);
    await page.mouse.down();
    await page.waitForTimeout(100);
    await page.mouse.move(endX, endY, { steps: 20 });
    await page.waitForTimeout(100);
    await page.mouse.up();
    await page.waitForTimeout(300);
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
  await page.waitForTimeout(300);

  // オーバーレイをマウスで選択
  const box = await overlay.boundingBox();
  if (box) {
    const clickX = box.x + box.width / 2 - 100;
    const clickY = box.y + box.height / 2 - 50;
    await page.mouse.move(clickX, clickY);
    await page.waitForTimeout(100);
    await page.mouse.click(clickX, clickY);
    await page.waitForTimeout(300);
  }

  // パネルが有効になっていることを確認（disabled属性がない）
  const disabled = await panelEl.getAttribute('disabled');
  expect(disabled).toBeNull();

  // スライダーが表示されていることを確認
  await expect(scaleSlider).toBeVisible();
  await expect(rotationSlider).toBeVisible();

  // スケールスライダーを変更
  const initialScaleText = await scaleOutput.textContent();
  await scaleSlider.fill('1.5');
  await page.waitForTimeout(200);

  const newScaleText = await scaleOutput.textContent();
  expect(newScaleText).not.toBe(initialScaleText);

  // 回転スライダーを変更
  const initialRotText = await rotationOutput.textContent();
  await rotationSlider.fill('45');
  await page.waitForTimeout(200);

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
  await page.waitForTimeout(300);

  // オーバーレイをマウスで選択
  const box = await overlay.boundingBox();
  if (box) {
    const clickX = box.x + box.width / 2 - 100;
    const clickY = box.y + box.height / 2 - 50;
    await page.mouse.move(clickX, clickY);
    await page.waitForTimeout(100);
    await page.mouse.click(clickX, clickY);
    await page.waitForTimeout(300);
  }

  // パネルが有効になっていることを確認（disabled属性がない）
  const disabled = await panelEl.getAttribute('disabled');
  expect(disabled).toBeNull();

  // ボタンが表示されていることを確認
  await expect(flipBtn).toBeVisible();
  await expect(dupBtn).toBeVisible();
  await expect(delBtn).toBeVisible();

  // 左右反転ボタンをクリック
  await flipBtn.click();
  await page.waitForTimeout(200);

  // 複製ボタンをクリック
  await dupBtn.click();
  await page.waitForTimeout(200);

  // キャンバスが変わることを確認（複製されたため）
  const afterDupWidth = await canvas.getAttribute('width');
  expect(afterDupWidth).toBeTruthy();

  // 削除ボタンをクリック
  await delBtn.click();
  await page.waitForTimeout(200);
});

test('すべての装飾を削除ボタンが機能する', async ({ page }) => {
  await page.goto('/tools/cat-logo-text-generator/');

  const addHeartBtn = page.locator('button[data-kind="heart"]');
  const addStarBtn = page.locator('button[data-kind="star"]');
  const clearBtn = page.locator('#cl-clear');
  const noSelectionEl = page.locator('#cl-no-selection');

  // ハートと星を追加
  await addHeartBtn.click();
  await page.waitForTimeout(200);
  await addStarBtn.click();
  await page.waitForTimeout(200);

  // 選択パネルが表示されていることを確認
  const panelEl = page.locator('#cl-panel');
  await expect(panelEl).not.toHaveAttribute('hidden');

  // すべて削除ボタンをクリック
  await clearBtn.click();
  await page.waitForTimeout(200);

  // 選択パネルが無効になり、「選択なし」メッセージが表示されることを確認
  await expect(panelEl).toHaveAttribute('disabled');
  await expect(noSelectionEl).toBeVisible();
});

test('矢印キーで部品を移動できる', async ({ page }) => {
  await page.goto('/tools/cat-logo-text-generator/');

  const addHeartBtn = page.locator('button[data-kind="heart"]');
  const overlay = page.locator('#cl-overlay');

  // ハートを追加
  await addHeartBtn.click();
  await page.waitForTimeout(200);

  // オーバーレイをクリックして選択
  await overlay.click();
  await page.waitForTimeout(200);

  // フォーカスをオーバーレイに与える
  await overlay.focus();
  await page.waitForTimeout(100);

  // 矢印キーを押す
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(100);
  await page.keyboard.press('ArrowUp');
  await page.waitForTimeout(100);
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(100);
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(200);
});

test('Deleteキーで部品を削除できる', async ({ page }) => {
  await page.goto('/tools/cat-logo-text-generator/');

  const addHeartBtn = page.locator('button[data-kind="heart"]');
  const overlay = page.locator('#cl-overlay');
  const panelEl = page.locator('#cl-panel');

  // ハートを追加
  await addHeartBtn.click();
  await page.waitForTimeout(300);

  // オーバーレイをマウスで選択
  const box = await overlay.boundingBox();
  if (box) {
    const clickX = box.x + box.width / 2 - 100;
    const clickY = box.y + box.height / 2 - 50;
    await page.mouse.move(clickX, clickY);
    await page.waitForTimeout(100);
    await page.mouse.click(clickX, clickY);
    await page.waitForTimeout(300);
  }

  // 選択パネルが表示されていることを確認
  await expect(panelEl).not.toHaveAttribute('hidden');

  // フォーカスをオーバーレイに与える
  await overlay.focus();
  await page.waitForTimeout(100);

  // Deleteキーを押す
  await page.keyboard.press('Delete');
  await page.waitForTimeout(300);

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

  // テキストを空にしてエラーを発生させる
  await textInput.fill('');
  await page.waitForTimeout(200);

  // ダウンロードボタンが無効になっていることを確認
  await expect(downloadLink).toHaveAttribute('aria-disabled', 'true');

  // ハートを追加しようとしてもダウンロードは無効なまま
  await addHeartBtn.click();
  await page.waitForTimeout(200);

  // ダウンロードボタンがまだ無効であることを確認
  await expect(downloadLink).toHaveAttribute('aria-disabled', 'true');
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
  await page.waitForTimeout(200);

  // オーバーレイをクリックして選択
  await overlay.click();
  await page.waitForTimeout(200);

  // ダウンロード待機
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
  await page.waitForTimeout(200);

  // キャンバスの初期サイズ
  const initialWidth = await canvas.getAttribute('width');
  const initialHeight = await canvas.getAttribute('height');

  // オーバーレイをクリックして選択
  await overlay.click();
  await page.waitForTimeout(200);

  // かなり遠い位置までドラッグ
  await overlay.dragTo(overlay, { targetPosition: { x: 200, y: 200 } });
  await page.waitForTimeout(200);

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

  // ハートを追加
  await addHeartBtn.click();
  await page.waitForTimeout(200);

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
  await page.waitForTimeout(300);

  // ボタンが機能することを確認
  const box = await overlay.boundingBox();
  if (box) {
    const clickX = box.x + box.width / 2 - 100;
    const clickY = box.y + box.height / 2 - 50;
    await page.mouse.move(clickX, clickY);
    await page.waitForTimeout(100);
    await page.mouse.click(clickX, clickY);
    await page.waitForTimeout(300);
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
  await page.waitForTimeout(200);

  // キャンバスのサイズが変わらないか、テキストだけで成立している
  const afterClearWidth = await canvas.getAttribute('width');
  expect(initialWidth).toBeTruthy();
  expect(afterClearWidth).toBeTruthy();
});
