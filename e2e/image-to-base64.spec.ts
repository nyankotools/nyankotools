import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 1x1の透過PNG（テスト用）
const PNG_BUFFER = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
  0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
  0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
  0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
  0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
]);

test.describe('画像のBase64変換ツール（日本語版）', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/tools/image-to-base64/');

    await expect(page.locator('main h1')).toHaveText(
      '画像のBase64（Data URL）変換',
    );
  });

  test('画像→Base64モードで画像をアップロードしてBase64に変換できる', async ({
    page,
  }) => {
    await page.goto('/tools/image-to-base64/');

    // テスト用PNG画像を作成
    const pngPath = path.join(__dirname, 'temp-itb-test.png');
    fs.writeFileSync(pngPath, PNG_BUFFER);

    try {
      // 初期状態はエンコードモード
      await expect(
        page.locator('#itb-mode [data-mode="encode"]'),
      ).toHaveAttribute('aria-pressed', 'true');

      // ファイルを選択
      const fileInput = page.locator('#itb-file-input');
      await fileInput.setInputFiles(pngPath);

      // 出力セクションが表示される
      const encodeResult = page.locator('#itb-encode-result');
      await expect(encodeResult).not.toHaveAttribute('hidden');

      // プレビューが表示される
      const preview = page.locator('#itb-encode-preview');
      await expect(preview).toHaveAttribute('src');

      // ファイル情報が表示される
      const fileInfo = page.locator('#itb-encode-file-info');
      await expect(fileInfo).toContainText('temp-itb-test.png');

      // 出力がBase64形式（Data URL）で表示される
      const output = page.locator('#itb-output');
      const outputValue = await output.inputValue();
      expect(outputValue).toMatch(/^data:image\/png;base64,/);
    } finally {
      if (fs.existsSync(pngPath)) {
        fs.unlinkSync(pngPath);
      }
    }
  });

  test('出力形式をBase64のみに切り替えられる', async ({ page }) => {
    await page.goto('/tools/image-to-base64/');

    const pngPath = path.join(__dirname, 'temp-itb-test2.png');
    fs.writeFileSync(pngPath, PNG_BUFFER);

    try {
      // ファイルを選択
      const fileInput = page.locator('#itb-file-input');
      await fileInput.setInputFiles(pngPath);

      // 初期状態はData URL形式
      await expect(
        page.locator('#itb-output-style [data-style="data-url"]'),
      ).toHaveAttribute('aria-pressed', 'true');

      // Base64のみに切り替え
      const base64Button = page.locator('#itb-output-style [data-style="base64-only"]');
      await base64Button.click();

      await expect(base64Button).toHaveAttribute('aria-pressed', 'true');

      // 出力がData URLプレフィックスなしになる
      const output = page.locator('#itb-output');
      const outputValue = await output.inputValue();
      expect(outputValue).not.toMatch(/^data:/);
      expect(outputValue).toMatch(/^[A-Za-z0-9+/=]+$/);
    } finally {
      if (fs.existsSync(pngPath)) {
        fs.unlinkSync(pngPath);
      }
    }
  });

  test('コピーボタンで出力をクリップボードにコピーできる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/image-to-base64/');

    const pngPath = path.join(__dirname, 'temp-itb-test3.png');
    fs.writeFileSync(pngPath, PNG_BUFFER);

    try {
      const fileInput = page.locator('#itb-file-input');
      await fileInput.setInputFiles(pngPath);

      const copyButton = page.locator('#itb-copy-button');
      await copyButton.click();

      // コピー成功メッセージが表示される
      const copyStatus = page.locator('#itb-copy-status');
      await expect(copyStatus).toContainText('コピーしました');

      // クリップボードに内容がコピーされている
      const output = page.locator('#itb-output');
      const outputValue = await output.inputValue();
      const clipboardText = await page.evaluate(() =>
        navigator.clipboard.readText(),
      );
      expect(clipboardText).toBe(outputValue);
    } finally {
      if (fs.existsSync(pngPath)) {
        fs.unlinkSync(pngPath);
      }
    }
  });

  test('Base64→画像モードで Base64 文字列をペーストして画像をデコードできる', async ({
    page,
  }) => {
    await page.goto('/tools/image-to-base64/');

    // デコードモードに切り替え
    const decodeButton = page.locator('#itb-mode [data-mode="decode"]');
    await decodeButton.click();

    await expect(decodeButton).toHaveAttribute('aria-pressed', 'true');

    // デコードセクションが表示される
    const decodeSection = page.locator('#itb-decode-section');
    await expect(decodeSection).not.toHaveAttribute('hidden');

    // PNG のBase64文字列（Data URL形式）をペースト
    const decodeInput = page.locator('#itb-decode-input');
    const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
    const dataUrl = `data:image/png;base64,${pngBase64}`;
    await decodeInput.fill(dataUrl);

    // デバウンス時間を待機
    await page.waitForTimeout(300);

    // プレビューが表示される
    const preview = page.locator('#itb-decode-preview');
    await expect(preview).toHaveAttribute('src', dataUrl);

    // 結果セクションが表示される
    const decodeResult = page.locator('#itb-decode-result');
    await expect(decodeResult).not.toHaveAttribute('hidden');

    // 画像情報が表示される
    const info = page.locator('#itb-decode-info');
    await expect(info).toContainText('image/png');

    // ダウンロードボタンが存在する
    const downloadLink = page.locator('#itb-decode-download-link');
    await expect(downloadLink).toBeVisible();
  });

  test('Base64→画像モードでBase64のみ（プレフィックスなし）もデコードできる', async ({
    page,
  }) => {
    await page.goto('/tools/image-to-base64/');

    // デコードモードに切り替え
    const decodeButton = page.locator('#itb-mode [data-mode="decode"]');
    await decodeButton.click();

    // PNGのBase64文字列（プレフィックスなし）をペースト
    const decodeInput = page.locator('#itb-decode-input');
    const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
    await decodeInput.fill(pngBase64);

    // デバウンス時間を待機
    await page.waitForTimeout(300);

    // プレビューが表示される（自動的にData URLに変換される）
    const preview = page.locator('#itb-decode-preview');
    const previewSrc = await preview.getAttribute('src');
    expect(previewSrc).toMatch(/^data:image\/png;base64,/);

    // 結果セクションが表示される
    const decodeResult = page.locator('#itb-decode-result');
    await expect(decodeResult).not.toHaveAttribute('hidden');
  });

  test('Base64→画像モードで不正な入力はエラーを表示する', async ({
    page,
  }) => {
    await page.goto('/tools/image-to-base64/');

    // デコードモードに切り替え
    const decodeButton = page.locator('#itb-mode [data-mode="decode"]');
    await decodeButton.click();

    // 不正なBase64文字列をペースト
    const decodeInput = page.locator('#itb-decode-input');
    await decodeInput.fill('not-valid-base64-@@@');

    // デバウンス時間を待機
    await page.waitForTimeout(300);

    // エラーメッセージが表示される
    const error = page.locator('#itb-decode-error');
    await expect(error).not.toHaveAttribute('hidden');
    await expect(error).toContainText('画像として解釈できませんでした');

    // 結果セクションが非表示になる
    const decodeResult = page.locator('#itb-decode-result');
    await expect(decodeResult).toHaveAttribute('hidden');
  });

  test('クリアボタンで状態をリセットできる', async ({ page }) => {
    await page.goto('/tools/image-to-base64/');

    const pngPath = path.join(__dirname, 'temp-itb-test4.png');
    fs.writeFileSync(pngPath, PNG_BUFFER);

    try {
      const fileInput = page.locator('#itb-file-input');
      await fileInput.setInputFiles(pngPath);

      // 出力が表示される
      const encodeResult = page.locator('#itb-encode-result');
      await expect(encodeResult).not.toHaveAttribute('hidden');

      // クリアボタンをクリック
      const clearButton = page.locator('#itb-clear-button');
      await clearButton.click();

      // 出力が非表示になる
      await expect(encodeResult).toHaveAttribute('hidden');

      // プレビューがリセットされる
      const preview = page.locator('#itb-encode-preview');
      await expect(preview).not.toHaveAttribute('src');
    } finally {
      if (fs.existsSync(pngPath)) {
        fs.unlinkSync(pngPath);
      }
    }
  });
});

test.describe('Image to Base64 (Data URL) Converter (English)', () => {
  test('英語版が正しく表示される', async ({ page }) => {
    await page.goto('/en/tools/image-to-base64/');

    await expect(page.locator('main h1')).toHaveText(
      'Image to Base64 (Data URL) Converter',
    );
  });

  test('画像→Base64モードで画像をアップロードしてBase64に変換できる（英語版）', async ({
    page,
  }) => {
    await page.goto('/en/tools/image-to-base64/');

    const pngPath = path.join(__dirname, 'temp-itb-test-en.png');
    fs.writeFileSync(pngPath, PNG_BUFFER);

    try {
      const fileInput = page.locator('#itb-file-input');
      await fileInput.setInputFiles(pngPath);

      const output = page.locator('#itb-output');
      const outputValue = await output.inputValue();
      expect(outputValue).toMatch(/^data:image\/png;base64,/);

      // ダウンロードボタンが表示される
      const downloadLink = page.locator('#itb-download-link');
      await expect(downloadLink).toBeVisible();
    } finally {
      if (fs.existsSync(pngPath)) {
        fs.unlinkSync(pngPath);
      }
    }
  });

  test('Base64→画像モードでBase64をデコードできる（英語版）', async ({
    page,
  }) => {
    await page.goto('/en/tools/image-to-base64/');

    const decodeButton = page.locator('#itb-mode [data-mode="decode"]');
    await decodeButton.click();

    const decodeInput = page.locator('#itb-decode-input');
    const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
    await decodeInput.fill(`data:image/png;base64,${pngBase64}`);

    await page.waitForTimeout(300);

    const preview = page.locator('#itb-decode-preview');
    await expect(preview).toHaveAttribute('src');

    const error = page.locator('#itb-decode-error');
    await expect(error).toHaveAttribute('hidden');
  });
});
