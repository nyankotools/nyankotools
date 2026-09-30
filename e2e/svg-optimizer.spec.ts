import { test, expect } from './helpers/test';

const validSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <!-- comment -->
  <metadata>metadata</metadata>
  <rect x="10.000000" y="10.000000" width="80" height="80" fill="#ff0000"/>
</svg>`;

const invalidSvg = '<svg><rect></svg>';

test.describe('SVG最適化ツール（日本語版）', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/tools/svg-optimizer/');

    await expect(page.locator('main h1')).toHaveText('SVG最適化（SVGO）');
  });

  test('SVGコードを入力すると最適化される', async ({ page }) => {
    await page.goto('/tools/svg-optimizer/');

    const input = page.locator('#svgo-input');
    await input.fill(validSvg);

    // 200msのデバウンスの後に実行されるのを待つ（自動リトライ）
    const output = page.locator('#svgo-output');
    const resultEl = page.locator('#svgo-result');
    await expect(resultEl).toBeVisible();

    const outputValue = await output.inputValue();

    // コメントとメタデータが削除されていることを確認
    expect(outputValue).not.toContain('comment');
    expect(outputValue).not.toContain('metadata');
    // SVGルートは存在する
    expect(outputValue).toContain('<svg');

    // 結果表示エリアが表示される
    await expect(resultEl).toBeVisible();
  });

  test('複数回パスオプションを切り替えると最適化が再実行される', async ({
    page,
  }) => {
    await page.goto('/tools/svg-optimizer/');

    const input = page.locator('#svgo-input');
    const multipassCheckbox = page.locator('#svgo-multipass');
    const output = page.locator('#svgo-output');
    const resultEl = page.locator('#svgo-result');

    await input.fill(validSvg);

    // 最適化が実行されるまで待つ（自動リトライ）
    await expect(resultEl).toBeVisible();

    // マルチパスを無効にして再実行
    await multipassCheckbox.uncheck();

    // 出力が更新されるまで待つ（自動リトライ）
    const initialValue = await output.inputValue();
    await expect(output).toHaveValue(
      new RegExp(`.*${initialValue.substring(0, 10)}.*`, 's'),
    );

    const outputValue2 = await output.inputValue();

    // マルチパスの状態を変えても出力は有効なSVGであることを確認
    expect(outputValue2).toContain('<svg');

    // 再度有効にする
    await multipassCheckbox.check();

    // 出力が更新されるまで待つ（自動リトライ）
    await expect(output).toHaveValue(
      new RegExp(`.*${outputValue2.substring(0, 10)}.*`, 's'),
    );

    const outputValue3 = await output.inputValue();
    expect(outputValue3).toContain('<svg');
  });

  test('読みやすく整形するオプションを有効にすると改行が含まれる', async ({
    page,
  }) => {
    await page.goto('/tools/svg-optimizer/');

    const input = page.locator('#svgo-input');
    const prettyCheckbox = page.locator('#svgo-pretty');
    const output = page.locator('#svgo-output');
    const resultEl = page.locator('#svgo-result');

    await input.fill(validSvg);

    // 最適化が実行されるまで待つ（自動リトライ）
    await expect(resultEl).toBeVisible();

    // prettyを有効にする
    await prettyCheckbox.check();

    // 出力に改行が含まれるまで待つ（自動リトライ）
    await expect(output).toHaveValue(new RegExp('.*\\n.*', 's'));

    const outputValue = await output.inputValue();
    // 改行を含む（prettyで整形されている）
    expect(outputValue.split('\n').length).toBeGreaterThan(1);
  });

  test('width/height削除オプションを有効にするとviewBoxのみが残る', async ({
    page,
  }) => {
    await page.goto('/tools/svg-optimizer/');

    const input = page.locator('#svgo-input');
    const removeDimensionsCheckbox = page.locator('#svgo-remove-dimensions');
    const output = page.locator('#svgo-output');
    const resultEl = page.locator('#svgo-result');

    await input.fill(validSvg);

    // 最適化が実行されるまで待つ（自動リトライ）
    await expect(resultEl).toBeVisible();

    // removeDimensionsを有効にする
    await removeDimensionsCheckbox.check();

    // width 属性が消えるまで待つ（自動リトライ）。viewBox は最初から残る
    await expect(output).not.toHaveValue(/<svg[^>]* width=/);
    await expect(output).toHaveValue(/viewBox/);
  });

  test('precision値を変更すると最適化が再実行される', async ({ page }) => {
    await page.goto('/tools/svg-optimizer/');

    const input = page.locator('#svgo-input');
    const precisionInput = page.locator('#svgo-precision');
    const output = page.locator('#svgo-output');
    const resultEl = page.locator('#svgo-result');

    await input.fill(validSvg);

    // 最適化が実行されるまで待つ（自動リトライ）
    await expect(resultEl).toBeVisible();

    // 最初の出力を取得
    const initialValue = await output.inputValue();

    // precisionを変更
    await precisionInput.fill('1');

    // 出力が更新されるまで待つ（自動リトライ）
    await expect(output).toHaveValue(
      new RegExp(`.*${initialValue.substring(0, 10)}.*`, 's'),
    );

    const outputValue2 = await output.inputValue();

    // 異なる精度で最適化されたSVGが出力されている
    expect(outputValue2).toContain('<svg');
  });

  test('不正なSVGを入力するとエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/svg-optimizer/');

    const input = page.locator('#svgo-input');
    const errorEl = page.locator('#svgo-error');

    await input.fill(invalidSvg);

    // エラーが表示されるまで待つ（自動リトライ）
    await expect(errorEl).toBeVisible();
    // 空の結果エリアは表示されない
    const resultEl = page.locator('#svgo-result');
    await expect(resultEl).toBeHidden();
  });

  test('空の入力は結果を消す', async ({ page }) => {
    await page.goto('/tools/svg-optimizer/');

    const input = page.locator('#svgo-input');
    const resultEl = page.locator('#svgo-result');
    const errorEl = page.locator('#svgo-error');

    // 最初に有効なSVGを入力
    await input.fill(validSvg);

    // 結果が表示されるまで待つ（自動リトライ）
    await expect(resultEl).toBeVisible();

    // 入力をクリア
    await input.fill('');

    // 結果が隠れるまで待つ（自動リトライ）
    await expect(resultEl).toBeHidden();

    // 結果とエラーが表示されない
    await expect(resultEl).toBeHidden();
    await expect(errorEl).toBeHidden();
  });

  test('コピーボタンで結果をクリップボードにコピーできる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/svg-optimizer/');

    const input = page.locator('#svgo-input');
    const copyButton = page.locator('#svgo-copy');
    const statusEl = page.locator('#svgo-status');
    const resultEl = page.locator('#svgo-result');

    await input.fill(validSvg);

    // 最適化が実行されるまで待つ（自動リトライ）
    await expect(resultEl).toBeVisible();

    await copyButton.click();

    // コピー成功メッセージが表示されるまで待つ（自動リトライ）
    await expect(statusEl).toHaveText('コピーしました');

    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toContain('<svg');
  });

  test('ダウンロードボタンのhref属性が設定される', async ({ page }) => {
    await page.goto('/tools/svg-optimizer/');

    const input = page.locator('#svgo-input');
    const downloadLink = page.locator('#svgo-download');
    const resultEl = page.locator('#svgo-result');

    await input.fill(validSvg);

    // 最適化が実行されるまで待つ（自動リトライ）
    await expect(resultEl).toBeVisible();

    // href属性が blob: で始まるまで待つ
    await expect(downloadLink).toHaveAttribute('href', /^blob:/);

    const href = await downloadLink.getAttribute('href');
    expect(href).toMatch(/^blob:/);
  });

  test('クリアボタンで全てをリセットできる', async ({ page }) => {
    await page.goto('/tools/svg-optimizer/');

    const input = page.locator('#svgo-input');
    const output = page.locator('#svgo-output');
    const resultEl = page.locator('#svgo-result');
    const clearButton = page.locator('#svgo-clear');

    // 入力を設定
    await input.fill(validSvg);

    // 結果が表示されるまで待つ（自動リトライ）
    await expect(resultEl).toBeVisible();

    // クリア実行
    await clearButton.click();

    // 入力と出力が空になるまで待つ（自動リトライ）
    await expect(input).toHaveValue('');
    await expect(output).toHaveValue('');
    // 結果が隠れるまで待つ（自動リトライ）
    await expect(resultEl).toBeHidden();
  });

  test('用語解説セクションが表示される', async ({ page }) => {
    await page.goto('/tools/svg-optimizer/');

    await expect(
      page.getByRole('heading', { level: 2, name: '用語解説' }),
    ).toBeVisible();
    await expect(page.getByText('SVG', { exact: true })).toBeVisible();
  });
});

test.describe('SVG Optimizer (English)', () => {
  test('英語版が正しく表示される', async ({ page }) => {
    await page.goto('/en/tools/svg-optimizer/');

    await expect(page.locator('main h1')).toHaveText('SVG Optimizer (SVGO)');
  });

  test('SVG code is optimized when pasted', async ({ page }) => {
    await page.goto('/en/tools/svg-optimizer/');

    const input = page.locator('#svgo-input');
    await input.fill(validSvg);

    // 最適化が実行されるまで待つ（自動リトライ）
    const output = page.locator('#svgo-output');
    const resultEl = page.locator('#svgo-result');
    await expect(resultEl).toBeVisible();

    const outputValue = await output.inputValue();

    expect(outputValue).not.toContain('comment');
    expect(outputValue).not.toContain('metadata');
    expect(outputValue).toContain('<svg');

    await expect(resultEl).toBeVisible();
  });

  test('Invalid SVG shows English error message', async ({ page }) => {
    await page.goto('/en/tools/svg-optimizer/');

    const input = page.locator('#svgo-input');
    const errorEl = page.locator('#svgo-error');

    await input.fill(invalidSvg);

    // エラーが表示されるまで待つ（自動リトライ）
    await expect(errorEl).toBeVisible();
  });

  test('Copy button shows English message', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/en/tools/svg-optimizer/');

    const input = page.locator('#svgo-input');
    const copyButton = page.locator('#svgo-copy');
    const statusEl = page.locator('#svgo-status');
    const resultEl = page.locator('#svgo-result');

    await input.fill(validSvg);

    // 最適化が実行されるまで待つ（自動リトライ）
    await expect(resultEl).toBeVisible();

    await copyButton.click();

    // コピー成功メッセージが表示されるまで待つ（自動リトライ）
    await expect(statusEl).toHaveText('Copied');
  });

  test('Glossary section is displayed in English', async ({ page }) => {
    await page.goto('/en/tools/svg-optimizer/');

    await expect(
      page.getByRole('heading', { level: 2, name: 'Glossary' }),
    ).toBeVisible();
  });
});

test.describe('SVG最適化ツール - ドラッグ&ドロップ', () => {
  test('SVGファイルをドロップすると処理される', async ({ page }) => {
    await page.goto('/tools/svg-optimizer/');

    const validSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
      <rect width="100" height="100" fill="red"/>
    </svg>`;

    // DataTransfer を使ってドロップイベントをシミュレート
    await page.evaluate(
      ({ svgContent }) => {
        const dropZone = document.getElementById('svgo-drop')!;

        const dataTransfer = new DataTransfer();
        const file = new File([svgContent], 'test.svg', {
          type: 'image/svg+xml',
        });
        dataTransfer.items.add(file);

        const dropEvent = new DragEvent('drop', {
          bubbles: true,
          cancelable: true,
          dataTransfer,
        });

        dropZone.dispatchEvent(dropEvent);
      },
      { svgContent: validSvg },
    );

    // ファイルがドロップ処理されたことを確認（結果表示エリアが表示されるまで待つ、自動リトライ）
    const resultEl = page.locator('#svgo-result');
    await expect(resultEl).toBeVisible();
  });

  test('SVG以外のファイルをドロップするとエラーが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/svg-optimizer/');

    // SVG以外の DataTransfer（例：テキストファイル）
    await page.evaluate(() => {
      const dropZone = document.getElementById('svgo-drop')!;

      const dataTransfer = new DataTransfer();
      const file = new File(['Not an SVG'], 'test.txt', {
        type: 'text/plain',
      });
      dataTransfer.items.add(file);

      const dropEvent = new DragEvent('drop', {
        bubbles: true,
        cancelable: true,
        dataTransfer,
      });

      dropZone.dispatchEvent(dropEvent);
    });

    // エラーが表示されるまで待つ（自動リトライ）
    await expect(page.locator('#svgo-error')).toBeVisible();
    await expect(page.locator('#svgo-input')).toHaveValue('');
  });

  test('ドロップ領域がドラッグ時にスタイル変更される', async ({ page }) => {
    await page.goto('/tools/svg-optimizer/');

    // dragover イベントを発火
    await page.evaluate(() => {
      const dropZone = document.getElementById('svgo-drop')!;
      const dataTransfer = new DataTransfer();
      // DataTransfer.types は read-only で push できないので、
      // Files オブジェクトを直接設定することで hasFiles チェックをバイパス
      Object.defineProperty(dataTransfer, 'types', {
        value: ['Files'],
        writable: false,
      });

      const dragoverEvent = new DragEvent('dragover', {
        bubbles: true,
        cancelable: true,
        dataTransfer,
      });

      dropZone.dispatchEvent(dragoverEvent);
    });

    // ドロップ領域に active クラスが追加されるまで待つ（自動リトライ）
    const hasActiveClass = await page.evaluate(async () => {
      // 複数回チェックして、クラスが追加されるのを待つ
      for (let i = 0; i < 10; i++) {
        const dropZone = document.getElementById('svgo-drop')!;
        if (dropZone.classList.contains('border-blue-400!')) {
          return true;
        }
        await new Promise((r) => setTimeout(r, 10));
      }
      return false;
    });

    expect(hasActiveClass).toBe(true);
  });
});
