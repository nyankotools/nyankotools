import { test, expect } from './helpers/test';
import { PDFDocument, StandardFonts } from 'pdf-lib';

/** 見出し・本文・箇条書き・表を持つ1ページのPDFを作る */
async function createTestPdf(): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const page = doc.addPage([595, 842]);
  page.drawText('Quarterly Report', { x: 72, y: 760, size: 24, font: bold });
  const body = [
    'This report summarizes the results of the last quarter for the team.',
    'Sales grew steadily across all regions during the period.',
    'Details are listed below for reference.',
  ];
  body.forEach((line, i) =>
    page.drawText(line, { x: 72, y: 720 - i * 16, size: 12, font: regular }),
  );
  page.drawText('- First point', { x: 72, y: 650, size: 12, font: regular });
  page.drawText('- Second point', { x: 72, y: 634, size: 12, font: regular });
  const rows = [
    ['Item', 'Qty', 'Price'],
    ['Apple', '3', '120'],
    ['Melon', '1', '800'],
  ];
  rows.forEach((row, r) =>
    row.forEach((cell, c) =>
      page.drawText(cell, {
        x: 72 + c * 160,
        y: 580 - r * 20,
        size: 12,
        font: r === 0 ? bold : regular,
      }),
    ),
  );
  return Buffer.from(await doc.save());
}

/** テキストを持たない（ページだけの）PDF */
async function createBlankPdf(): Promise<Buffer> {
  const doc = await PDFDocument.create();
  doc.addPage([200, 200]);
  return Buffer.from(await doc.save());
}

/** ヘッダー・フッター・ページ番号が含まれた複数ページのPDF */
async function createMultiPagePdf(): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  for (let p = 1; p <= 3; p++) {
    const page = doc.addPage([595, 842]);
    // ヘッダー
    page.drawText(`Report - Page ${p}`, {
      x: 72,
      y: 800,
      size: 10,
      font: regular,
    });
    // 本文
    page.drawText(`This is page ${p} content.`, {
      x: 72,
      y: 720,
      size: 12,
      font: regular,
    });
    // フッター＆ページ番号
    page.drawText(String(p), { x: 290, y: 30, size: 10, font: regular });
  }
  return Buffer.from(await doc.save());
}

for (const [locale, base] of [
  ['ja', '/tools/pdf-to-markdown/'],
  ['en', '/en/tools/pdf-to-markdown/'],
] as const) {
  test.describe(`PDF→Markdown変換 (${locale})`, () => {
    test('見出し・箇条書き・表がMarkdownに変換される', async ({ page }) => {
      await page.goto(base);
      await page.locator('#md-file').setInputFiles({
        name: 'report.pdf',
        mimeType: 'application/pdf',
        buffer: await createTestPdf(),
      });
      await expect(page.locator('#md-info')).toContainText('report.pdf');
      const output = page.locator('#md-output');
      await expect(output).toHaveValue(/# Quarterly Report/);
      const md = await output.inputValue();
      expect(md).toContain('- First point\n- Second point');
      expect(md).toContain('| Item | Qty | Price |');
      expect(md).toContain('| --- | --- | --- |');
      expect(md).toContain('| Apple | 3 | 120 |');
    });

    test('表の検出をオフにすると表にならない', async ({ page }) => {
      await page.goto(base);
      await page.locator('#md-file').setInputFiles({
        name: 'report.pdf',
        mimeType: 'application/pdf',
        buffer: await createTestPdf(),
      });
      await expect(page.locator('#md-output')).toHaveValue(/\| Apple/);
      await page.locator('#md-opt-tables').uncheck();
      await expect(page.locator('#md-output')).not.toHaveValue(/\| Apple/);
    });

    test('文字のないPDFは警告を表示する', async ({ page }) => {
      await page.goto(base);
      await page.locator('#md-file').setInputFiles({
        name: 'scan.pdf',
        mimeType: 'application/pdf',
        buffer: await createBlankPdf(),
      });
      await expect(page.locator('#md-warning')).toBeVisible();
      await expect(page.locator('#md-output')).toHaveValue('');
    });

    test('PDF以外はエラーになる', async ({ page }) => {
      await page.goto(base);
      await page.locator('#md-file').setInputFiles({
        name: 'note.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('hello'),
      });
      await expect(page.locator('#md-error')).toBeVisible();
    });

    test('.mdをダウンロードできる', async ({ page }) => {
      await page.goto(base);
      await page.locator('#md-file').setInputFiles({
        name: 'report.pdf',
        mimeType: 'application/pdf',
        buffer: await createTestPdf(),
      });
      await expect(page.locator('#md-output')).toHaveValue(/Quarterly/);
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.locator('#md-download').click(),
      ]);
      expect(download.suggestedFilename()).toBe('report.md');
    });

    test('複数ページのPDFを変換する', async ({ page }) => {
      await page.goto(base);
      await page.locator('#md-file').setInputFiles({
        name: 'multi.pdf',
        mimeType: 'application/pdf',
        buffer: await createMultiPagePdf(),
      });
      await expect(page.locator('#md-result')).toBeVisible();
      const output = page.locator('#md-output');
      const md = await output.inputValue();
      expect(md).toContain('page 1');
      expect(md).toContain('page 2');
      expect(md).toContain('page 3');
    });

    test('ヘッダー・フッター・ページ番号を除去する', async ({ page }) => {
      await page.goto(base);
      await page.locator('#md-file').setInputFiles({
        name: 'multi.pdf',
        mimeType: 'application/pdf',
        buffer: await createMultiPagePdf(),
      });
      await expect(page.locator('#md-result')).toBeVisible();
      const output = page.locator('#md-output');
      const md = await output.inputValue();
      // ページ番号は除去されるはず
      expect(md).not.toMatch(/^\s*\d\s*$/m);
      // ヘッダーも除去されるはず（重複する行）
      expect(md).not.toContain('Report - Page');
    });

    test('ページ区切りのオプションを有効にすると水平線が入る', async ({
      page,
    }) => {
      await page.goto(base);
      await page.locator('#md-file').setInputFiles({
        name: 'multi.pdf',
        mimeType: 'application/pdf',
        buffer: await createMultiPagePdf(),
      });
      await expect(page.locator('#md-result')).toBeVisible();
      await page.locator('#md-opt-separator').check();
      const output = page.locator('#md-output');
      const md = await output.inputValue();
      expect(md).toContain('---');
    });
  });
}
