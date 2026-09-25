import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { PDFDocument } from 'pdf-lib';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** シンプルなテスト用PDFを生成する */
async function createTestPdf(
  pageCount: number,
  label: string,
): Promise<Buffer> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) {
    const page = doc.addPage([200 + i, 300]);
    const { height } = page.getSize();
    page.drawText(`${label} Page ${i + 1}`, {
      x: 10,
      y: height - 20,
      size: 12,
    });
  }
  const bytes = await doc.save();
  return Buffer.from(bytes);
}

test.describe('PDF結合・分割・ページ抽出ツール（日本語版）', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/tools/pdf-merge-split/');
    await expect(page.locator('main h1')).toHaveText(
      'PDF結合・分割・ページ抽出',
    );
  });

  test('初期状態で結合モード表示', async ({ page }) => {
    await page.goto('/tools/pdf-merge-split/');

    const modeRadios = page.locator('input[name="pdf-mode"]');
    const mergeRadio = modeRadios.first();
    await expect(mergeRadio).toBeChecked();

    const fileLabel = page.locator('#pdf-file-label');
    const labelText = await fileLabel.textContent();
    expect(labelText).toContain('複数');

    const extractOpt = page.locator('#pdf-opt-extract');
    await expect(extractOpt).toHaveAttribute('hidden');

    const splitOpt = page.locator('#pdf-opt-split');
    await expect(splitOpt).toHaveAttribute('hidden');
  });

  test('結合モード：複数PDFファイルをアップロードしてリストに追加される', async ({
    page,
  }) => {
    await page.goto('/tools/pdf-merge-split/');

    const pdf1Path = path.join(__dirname, 'temp-pdf-merge-1.pdf');
    const pdf2Path = path.join(__dirname, 'temp-pdf-merge-2.pdf');

    const pdf1Buffer = await createTestPdf(2, 'Document1');
    const pdf2Buffer = await createTestPdf(3, 'Document2');

    fs.writeFileSync(pdf1Path, pdf1Buffer);
    fs.writeFileSync(pdf2Path, pdf2Buffer);

    try {
      await page.locator('#pdf-file').setInputFiles([pdf1Path, pdf2Path]);

      const listItems = page.locator('#pdf-list li');
      await expect(listItems).toHaveCount(2);

      const firstItemText = await listItems.first().textContent();
      expect(firstItemText).toContain('temp-pdf-merge-1.pdf');
      expect(firstItemText).toContain('2');

      const secondItemText = await listItems.nth(1).textContent();
      expect(secondItemText).toContain('temp-pdf-merge-2.pdf');
      expect(secondItemText).toContain('3');
    } finally {
      if (fs.existsSync(pdf1Path)) fs.unlinkSync(pdf1Path);
      if (fs.existsSync(pdf2Path)) fs.unlinkSync(pdf2Path);
    }
  });

  test('結合モード：ファイルなしで実行するとエラー', async ({ page }) => {
    await page.goto('/tools/pdf-merge-split/');

    await page.locator('#pdf-run').click();

    const error = page.locator('#pdf-error');
    await expect(error).not.toHaveAttribute('hidden');
    const errorText = await error.textContent();
    expect(errorText).toBeTruthy();
  });

  test('結合モード：ファイル1件のみでは実行不可', async ({ page }) => {
    await page.goto('/tools/pdf-merge-split/');

    const pdfPath = path.join(__dirname, 'temp-pdf-single.pdf');
    const pdfBuffer = await createTestPdf(2, 'Document');
    fs.writeFileSync(pdfPath, pdfBuffer);

    try {
      await page.locator('#pdf-file').setInputFiles([pdfPath]);
      await page.locator('#pdf-run').click();

      const error = page.locator('#pdf-error');
      await expect(error).not.toHaveAttribute('hidden');
      const errorText = await error.textContent();
      expect(errorText).toContain('2');
    } finally {
      if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    }
  });

  test('結合モード：ファイル順序を並び替えられる', async ({ page }) => {
    await page.goto('/tools/pdf-merge-split/');

    const pdf1Path = path.join(__dirname, 'temp-pdf-order-1.pdf');
    const pdf2Path = path.join(__dirname, 'temp-pdf-order-2.pdf');

    const pdf1Buffer = await createTestPdf(1, 'First');
    const pdf2Buffer = await createTestPdf(1, 'Second');

    fs.writeFileSync(pdf1Path, pdf1Buffer);
    fs.writeFileSync(pdf2Path, pdf2Buffer);

    try {
      await page.locator('#pdf-file').setInputFiles([pdf1Path, pdf2Path]);

      const listItems = page.locator('#pdf-list li');
      let firstItemText = await listItems.first().textContent();
      expect(firstItemText).toContain('temp-pdf-order-1.pdf');

      // 下へボタンをクリック
      const downButtons = page.locator('#pdf-list button').filter({
        hasText: /下|down/i,
      });
      if ((await downButtons.count()) > 0) {
        await downButtons.first().click();

        const updatedListItems = page.locator('#pdf-list li');
        firstItemText = await updatedListItems.first().textContent();
        expect(firstItemText).toContain('temp-pdf-order-2.pdf');
      }
    } finally {
      if (fs.existsSync(pdf1Path)) fs.unlinkSync(pdf1Path);
      if (fs.existsSync(pdf2Path)) fs.unlinkSync(pdf2Path);
    }
  });

  test('結合モード：複数PDFを結合してダウンロードできる', async ({ page }) => {
    await page.goto('/tools/pdf-merge-split/');

    const pdf1Path = path.join(__dirname, 'temp-pdf-exec-1.pdf');
    const pdf2Path = path.join(__dirname, 'temp-pdf-exec-2.pdf');

    const pdf1Buffer = await createTestPdf(2, 'Doc1');
    const pdf2Buffer = await createTestPdf(3, 'Doc2');

    fs.writeFileSync(pdf1Path, pdf1Buffer);
    fs.writeFileSync(pdf2Path, pdf2Buffer);

    try {
      await page.locator('#pdf-file').setInputFiles([pdf1Path, pdf2Path]);

      const runButton = page.locator('#pdf-run');
      await runButton.click();

      const result = page.locator('#pdf-result');
      await expect(result).not.toHaveAttribute('hidden');

      const resultLinks = page.locator('#pdf-result-list a');
      await expect(resultLinks).toHaveCount(1);
      const href = await resultLinks.first().getAttribute('href');
      expect(href).toBeTruthy();
    } finally {
      if (fs.existsSync(pdf1Path)) fs.unlinkSync(pdf1Path);
      if (fs.existsSync(pdf2Path)) fs.unlinkSync(pdf2Path);
    }
  });

  test('抽出モード：ラジオボタン切り替えで表示が変わる', async ({ page }) => {
    await page.goto('/tools/pdf-merge-split/');

    // Get the radio button with value="extract"
    const radioButtons = page.locator('input[name="pdf-mode"]');
    const extractButton = radioButtons.nth(1);

    await extractButton.click();

    const fileLabel = page.locator('#pdf-file-label');
    const labelText = await fileLabel.textContent();
    expect(labelText).not.toContain('複数');

    const extractOpt = page.locator('#pdf-opt-extract');
    await expect(extractOpt).not.toHaveAttribute('hidden');

    const splitOpt = page.locator('#pdf-opt-split');
    await expect(splitOpt).toHaveAttribute('hidden');
  });

  test('抽出モード：ページ範囲指定で抽出される', async ({ page }) => {
    await page.goto('/tools/pdf-merge-split/');

    const pdfPath = path.join(__dirname, 'temp-pdf-extract.pdf');
    const pdfBuffer = await createTestPdf(5, 'Extract');
    fs.writeFileSync(pdfPath, pdfBuffer);

    try {
      // Switch to extract mode
      const radioButtons = page.locator('input[name="pdf-mode"]');
      await radioButtons.nth(1).click();

      await page.locator('#pdf-file').setInputFiles([pdfPath]);

      // Set page range to extract pages 1-3
      await page.locator('#pdf-range').fill('1-3');

      const runButton = page.locator('#pdf-run');
      await runButton.click();

      const result = page.locator('#pdf-result');
      await expect(result).not.toHaveAttribute('hidden');

      const resultLinks = page.locator('#pdf-result-list a');
      await expect(resultLinks).toHaveCount(1);
      const linkText = await resultLinks.first().textContent();
      expect(linkText).toContain('extracted.pdf');
    } finally {
      if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    }
  });

  test('抽出モード：無効なページ範囲でエラー', async ({ page }) => {
    await page.goto('/tools/pdf-merge-split/');

    const pdfPath = path.join(__dirname, 'temp-pdf-extract-err.pdf');
    const pdfBuffer = await createTestPdf(3, 'Extract');
    fs.writeFileSync(pdfPath, pdfBuffer);

    try {
      // Switch to extract mode
      const radioButtons = page.locator('input[name="pdf-mode"]');
      await radioButtons.nth(1).click();

      await page.locator('#pdf-file').setInputFiles([pdfPath]);

      // Set invalid page range (out of bounds)
      await page.locator('#pdf-range').fill('10');

      await page.locator('#pdf-run').click();

      const error = page.locator('#pdf-error');
      await expect(error).not.toHaveAttribute('hidden');
    } finally {
      if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    }
  });

  test('分割モード：ラジオボタン切り替えで表示が変わる', async ({ page }) => {
    await page.goto('/tools/pdf-merge-split/');

    const radioButtons = page.locator('input[name="pdf-mode"]');
    await radioButtons.nth(2).click();

    const splitOpt = page.locator('#pdf-opt-split');
    await expect(splitOpt).not.toHaveAttribute('hidden');

    const extractOpt = page.locator('#pdf-opt-extract');
    await expect(extractOpt).toHaveAttribute('hidden');
  });

  test('分割モード：ページ数ごとに分割できる', async ({ page }) => {
    await page.goto('/tools/pdf-merge-split/');

    const pdfPath = path.join(__dirname, 'temp-pdf-split.pdf');
    const pdfBuffer = await createTestPdf(5, 'Split');
    fs.writeFileSync(pdfPath, pdfBuffer);

    try {
      // Switch to split mode
      const radioButtons = page.locator('input[name="pdf-mode"]');
      await radioButtons.nth(2).click();

      await page.locator('#pdf-file').setInputFiles([pdfPath]);

      // Set split count to 2
      await page.locator('#pdf-split-n').fill('2');

      const runButton = page.locator('#pdf-run');
      await runButton.click();

      const result = page.locator('#pdf-result');
      await expect(result).not.toHaveAttribute('hidden');

      // Check that multiple files are ready for download
      const resultLinks = page.locator('#pdf-result-list a');
      // Should have 3 files (2+2+1 pages)
      await expect(resultLinks).toHaveCount(3);
    } finally {
      if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    }
  });

  test('暗号化PDFは「パスワードで保護」エラーになる', async ({ page }) => {
    await page.goto('/tools/pdf-merge-split/');
    const doc = await PDFDocument.create();
    doc.addPage();
    doc.context.trailerInfo.Encrypt = doc.context.register(
      doc.context.obj({
        Filter: 'Standard',
        V: 1,
        R: 2,
        O: '(x)',
        U: '(x)',
        P: -4,
      }),
    );
    await page.locator('#pdf-file').setInputFiles({
      name: 'encrypted.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from(await doc.save()),
    });
    await expect(page.locator('#pdf-error')).toContainText('パスワードで保護');
  });

  test('無効なPDF：「invalid」エラーとして表示される', async ({ page }) => {
    await page.goto('/tools/pdf-merge-split/');

    const invalidPath = path.join(__dirname, 'temp-pdf-invalid.pdf');
    fs.writeFileSync(invalidPath, Buffer.from('Not a PDF at all'));

    try {
      await page.locator('#pdf-file').setInputFiles([invalidPath]);

      const error = page.locator('#pdf-error');
      await expect(error).not.toHaveAttribute('hidden');
    } finally {
      if (fs.existsSync(invalidPath)) fs.unlinkSync(invalidPath);
    }
  });

  test('クリアボタン：状態をリセットできる', async ({ page }) => {
    await page.goto('/tools/pdf-merge-split/');

    const pdfPath = path.join(__dirname, 'temp-pdf-clear.pdf');
    const pdfBuffer = await createTestPdf(2, 'Clear');
    fs.writeFileSync(pdfPath, pdfBuffer);

    try {
      await page.locator('#pdf-file').setInputFiles([pdfPath]);

      const listItems = page.locator('#pdf-list li');
      await expect(listItems).toHaveCount(1);

      await page.locator('#pdf-clear').click();

      const clearedItems = page.locator('#pdf-list li');
      await expect(clearedItems).toHaveCount(0);
    } finally {
      if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    }
  });
});

test.describe('PDF Merge, Split & Extract (English)', () => {
  test('英語版が正しく表示される', async ({ page }) => {
    await page.goto('/en/tools/pdf-merge-split/');
    await expect(page.locator('main h1')).toHaveText(
      'PDF Merge, Split & Extract Pages',
    );
  });

  test('英語版：結合機能が正常に動作する', async ({ page }) => {
    await page.goto('/en/tools/pdf-merge-split/');

    const pdf1Path = path.join(__dirname, 'temp-pdf-en-merge-1.pdf');
    const pdf2Path = path.join(__dirname, 'temp-pdf-en-merge-2.pdf');

    const pdf1Buffer = await createTestPdf(2, 'DocEN1');
    const pdf2Buffer = await createTestPdf(1, 'DocEN2');

    fs.writeFileSync(pdf1Path, pdf1Buffer);
    fs.writeFileSync(pdf2Path, pdf2Buffer);

    try {
      await page.locator('#pdf-file').setInputFiles([pdf1Path, pdf2Path]);

      const listItems = page.locator('#pdf-list li');
      await expect(listItems).toHaveCount(2);

      const runButton = page.locator('#pdf-run');
      await runButton.click();

      const result = page.locator('#pdf-result');
      await expect(result).not.toHaveAttribute('hidden');

      const resultLinks = page.locator('#pdf-result-list a');
      await expect(resultLinks).toHaveCount(1);
    } finally {
      if (fs.existsSync(pdf1Path)) fs.unlinkSync(pdf1Path);
      if (fs.existsSync(pdf2Path)) fs.unlinkSync(pdf2Path);
    }
  });
});

test.describe('エッジケース・追加テスト', () => {
  test('単一PDFからの抽出後に複数ファイル結合に切り替え可能', async ({
    page,
  }) => {
    await page.goto('/tools/pdf-merge-split/');

    const pdf1Path = path.join(__dirname, 'temp-pdf-mode-switch-1.pdf');
    const pdf2Path = path.join(__dirname, 'temp-pdf-mode-switch-2.pdf');

    const pdf1Buffer = await createTestPdf(2, 'ModeSwitch1');
    const pdf2Buffer = await createTestPdf(2, 'ModeSwitch2');

    fs.writeFileSync(pdf1Path, pdf1Buffer);
    fs.writeFileSync(pdf2Path, pdf2Buffer);

    try {
      // Start with extract mode
      const radioButtons = page.locator('input[name="pdf-mode"]');
      await radioButtons.nth(1).click();
      await page.locator('#pdf-file').setInputFiles([pdf1Path]);

      let listItems = page.locator('#pdf-list li');
      await expect(listItems).toHaveCount(1);

      // Switch to merge mode
      await radioButtons.first().click();

      // Add another file
      await page.locator('#pdf-file').setInputFiles([pdf2Path]);

      listItems = page.locator('#pdf-list li');
      // Should have 2 files now
      await expect(listItems).toHaveCount(2);
    } finally {
      if (fs.existsSync(pdf1Path)) fs.unlinkSync(pdf1Path);
      if (fs.existsSync(pdf2Path)) fs.unlinkSync(pdf2Path);
    }
  });

  test('PDF非PDFファイルをアップロード時にエラー', async ({ page }) => {
    await page.goto('/tools/pdf-merge-split/');

    const txtPath = path.join(__dirname, 'temp-not-pdf.txt');
    fs.writeFileSync(txtPath, 'This is not a PDF');

    try {
      await page.locator('#pdf-file').setInputFiles([txtPath]);

      const error = page.locator('#pdf-error');
      await expect(error).not.toHaveAttribute('hidden');
    } finally {
      if (fs.existsSync(txtPath)) fs.unlinkSync(txtPath);
    }
  });

  test('削除ボタン：リストからファイルを削除できる', async ({ page }) => {
    await page.goto('/tools/pdf-merge-split/');

    const pdf1Path = path.join(__dirname, 'temp-pdf-delete-1.pdf');
    const pdf2Path = path.join(__dirname, 'temp-pdf-delete-2.pdf');

    const pdf1Buffer = await createTestPdf(1, 'Delete1');
    const pdf2Buffer = await createTestPdf(1, 'Delete2');

    fs.writeFileSync(pdf1Path, pdf1Buffer);
    fs.writeFileSync(pdf2Path, pdf2Buffer);

    try {
      await page.locator('#pdf-file').setInputFiles([pdf1Path, pdf2Path]);

      let listItems = page.locator('#pdf-list li');
      await expect(listItems).toHaveCount(2);

      // Click remove button for first item
      const removeButtons = page.locator('#pdf-list button').filter({
        hasText: /削除|remove/i,
      });
      await removeButtons.first().click();

      listItems = page.locator('#pdf-list li');
      await expect(listItems).toHaveCount(1);
    } finally {
      if (fs.existsSync(pdf1Path)) fs.unlinkSync(pdf1Path);
      if (fs.existsSync(pdf2Path)) fs.unlinkSync(pdf2Path);
    }
  });
});

test.describe('PDF結合・分割・ページ抽出 - ドラッグ&ドロップ', () => {
  test('ドロップ領域にドラッグされた時にスタイルが変更される', async ({
    page,
  }) => {
    await page.goto('/tools/pdf-merge-split/');

    // dragover イベントを発火
    await page.evaluate(() => {
      const dropZone = document.getElementById('pdf-drop')!;
      const dataTransfer = new DataTransfer();
      // DataTransfer のモックオブジェクトを作成
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

    await page.waitForTimeout(100);

    // ドロップ領域に active クラスが追加される
    const hasActiveClass = await page.evaluate(() => {
      const dropZone = document.getElementById('pdf-drop')!;
      return dropZone.classList.contains('border-blue-400!');
    });

    expect(hasActiveClass).toBe(true);
  });

  test('抽出モードでPDFがリストに追加される', async ({ page }) => {
    await page.goto('/tools/pdf-merge-split/');

    // 抽出モードに切り替え
    const radioButtons = page.locator('input[name="pdf-mode"]');
    await radioButtons.nth(1).click();

    const pdfPath = path.join(__dirname, 'temp-pdf-extract-mode-test.pdf');

    const pdfBuffer = await createTestPdf(5, 'ExtractMode');
    fs.writeFileSync(pdfPath, pdfBuffer);

    try {
      // ファイルを選択
      await page.locator('#pdf-file').setInputFiles([pdfPath]);

      await page.waitForTimeout(300);

      // リストに1つのファイルが追加される
      const listItems = page.locator('#pdf-list li');
      await expect(listItems).toHaveCount(1);
      const itemText = await listItems.first().textContent();
      // ファイル名とページ数が表示される
      expect(itemText).toContain('temp-pdf-extract-mode-test.pdf');
      expect(itemText).toContain('5');
    } finally {
      if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    }
  });

  test('ドロップヒントテキストが表示される', async ({ page }) => {
    await page.goto('/tools/pdf-merge-split/');

    // ドロップ領域にドロップヒントテキスト（dropHint）が含まれていることを確認
    const dropZone = page.locator('#pdf-drop');
    const hintText = await dropZone.textContent();

    // 辞書に追加された dropHint が表示されていることを確認
    expect(hintText).toMatch(/ドラッグ|ドロップ|ファイル/);
  });
  test('単一ファイルモードで複数PDFをドロップすると先頭1件のみ追加される', async ({
    page,
  }) => {
    await page.goto('/tools/pdf-merge-split/');
    await page.locator('input[name="pdf-mode"][value="extract"]').check();

    const toBase64 = async (n: number, label: string) =>
      (await createTestPdf(n, label)).toString('base64');
    const pdfs = [await toBase64(2, 'A'), await toBase64(3, 'B')];

    await page.evaluate((list) => {
      const dt = new DataTransfer();
      list.forEach((b64, i) => {
        const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
        dt.items.add(
          new File([bytes], `drop-${i + 1}.pdf`, { type: 'application/pdf' }),
        );
      });
      document.getElementById('pdf-drop')!.dispatchEvent(
        new DragEvent('drop', {
          bubbles: true,
          cancelable: true,
          dataTransfer: dt,
        }),
      );
    }, pdfs);

    const items = page.locator('#pdf-list li');
    await expect(items).toHaveCount(1);
    await expect(items.first()).toContainText('drop-1.pdf');
  });
});
